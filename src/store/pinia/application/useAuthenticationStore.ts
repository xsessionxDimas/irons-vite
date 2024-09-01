import { GET_PROFILE, POST_LOGON_TRACK } from './newUrls'
import ApiService from '@/core/services/ApiService'
import { defineStore } from 'pinia'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import msalWrapperClass from '@/core/services/SSOService'
import { SingleApiResponse } from '@/core/types/misc/SingleApiResponse'
import { useTokenStore } from '../dma/token/useTokenStore'
import { AccountInfo, PublicClientApplication } from '@azure/msal-browser'
import { useRouter } from 'vue-router'
import { router } from '@/router/index'
import { db } from '@/database/schema/DexieSchema'
import { UserInfo } from '@/database/schema/UserInfo'
import { swalAlertError } from '@/core/helpers/sweet-alert'
import { useMenuStore } from './useMenuStore'
import { epochToDate } from '@/core/helpers/timer'
import {
  addRecord,
  clearRecords,
  tableToArray
} from '@/database/schema/DatabaseWrapper'
import { SyncToken } from '@/database/schema/SyncToken'
import { loginRequestForce } from '@/msal/authConfig'
import { sendErrorEvent } from '@/core/helpers/analytics';

export const useAuthenticationStore = defineStore({
  id: "authentication",
  state: () => {
    return {
      stateUser: {} as UserInfo,
      stateLoginError: false,
      stateLoading: false,
      stateLoggedIn: false,
      statePhotoUrl: '',
      stateUsername: undefined as undefined | string,
      stateRetryTimes: 0,
      stateIsBusyGetToken: false,
    }
  },
  getters: {
    user: (state) => {
      return state.stateUser;
    },
    loggedIn: (state) => {
      return state.stateLoggedIn;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    loginError: (state) => {
      return state.stateLoginError;
    },
    userPic: (state) => {
      return state.statePhotoUrl;
    },
    Username: (state) => {
      return state.stateUsername;
    }
  },
  actions: {
    setLoading(value: boolean) {
      this.stateLoading = value;
    },
    setLoginError(value: boolean) {
      this.stateLoginError = value;
    },
    setUsername(value: string) {
      this.stateUsername = value;
    },
    async setUserProfileFromDump() {
      this.stateUser = await db.userInfo.limit(1).first() as UserInfo
    },
    async signIn(instance: PublicClientApplication) {
      this.setLoading(true);
      try {
        // set it to localstorage
        const account = instance.getActiveAccount()
        if (account) {
          localStorage.setItem("account-info-cache", JSON.stringify(account));
          await this.getUserProfile(account.username, instance);
          await this.setUserProfilePic(true)
        }
      } catch (e) {
        console.log("error", e)
      } finally {
        this.setLoading(false);
      }
    },
    setIsLoggedInState() {
      this.stateLoggedIn = true
    },
    calculateExponentialBackoffDelay() {
      const baseDelay = 1000;
      return baseDelay * this.stateRetryTimes;
    },
    setDelay(milliseconds) {
      return new Promise((resolve) => {
        setTimeout(resolve, milliseconds)
      });
    },
    async logoutMSAL() {
      try {
        const wrapperInstance = msalWrapperClass.getInstance()
        const msalInstance = msalWrapperClass.getMSALInstance()
        const account = await wrapperInstance.getActiveUser(msalInstance);
        const logoutRequest = {
          account: account,
          postLogoutRedirectUri: import.meta.env.VITE_APP_MSAL_LOGOUT_REDIRECT,
          mainWindowRedirectUri: import.meta.env.VITE_APP_MSAL_MAIN_PAGE,
        };
        await msalInstance.logoutPopup(logoutRequest);
        router.push({ name: "signin" });
      } catch (error) {
        console.log(error)
      } finally {
        const menuStore = useMenuStore();
        localStorage.clear();
        sessionStorage.clear();
        this.reset();
        menuStore.reset();
      }
    },
    async getTokenOrRedirectToSignIn() {
      try {
        const wrapperInstance = msalWrapperClass.getInstance()
        await wrapperInstance.hitSilentToken()
      } catch (e) {
        router.push({ name: "signin" })
      }
    },
    async getUserProfile(email: string, instance: PublicClientApplication) {
      const params = { email: email, ver: 'v1' };
      try {
        const response: AxiosResponse<SingleApiResponse<UserInfo>> = await ApiService.get(GET_PROFILE, "", new URLSearchParams(params).toString())
        const data = response.data.result.content
        if (data === null) {
          throw {
            response: {
              statusCode: 404,
              message: 'User is not registered'
            }
          }
        }
        await db.userInfo.clear()
        await db.userInfo.add(data)
        this.stateUser = data
        this.stateLoggedIn = true
      } catch (error: any) {
        if (this.stateRetryTimes < 4) {
          // Retry with exponential backoff
          const delay = this.calculateExponentialBackoffDelay();
          console.log(`Retrying in ${delay} milliseconds...`);
          await this.setDelay(delay);
          this.stateRetryTimes++;
          instance.acquireTokenSilent(loginRequestForce)
          await this.getUserProfile(email, instance);
        } else {
          // need to logout force
          this.stateRetryTimes = 0
          if (error.response) {
            if (error.response.statusCode === 404) {
              swalAlertError(error.response.message, "Try Again").then(
                async (result) => {
                  if (result.value) {
                    await this.getTokenOrRedirectToSignIn()
                  }
                }
              )
            }
            if (error.response.statusCode === 500) {
              swalAlertError("Internal Server Error", "Logout").then(
                async (result) => {
                  if (result.value) {
                    await this.getTokenOrRedirectToSignIn()
                  }
                }
              )
            }
            await this.getTokenOrRedirectToSignIn()
            console.error('Max retry attempts reached. Logging out user');
          }
        }
        sendErrorEvent('IRONS', error);
      }
    },
    setLoggedIn(value: boolean) {
      this.stateLoggedIn = value;
    },
    async userProfile(email: string) {
      const params = { email: email, ver: 'v1' };
      await ApiService.get(GET_PROFILE, "", new URLSearchParams(params).toString())
    },
    async logUserLogin(employeeId: string) {
      this.setLoginError(false);
      const params = { ver: 'v1' };
      const payload = {
        employeeId: employeeId,
        section: "web"
      }
      try {
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${POST_LOGON_TRACK}?${new URLSearchParams(params).toString()}`,
        payload as AxiosRequestConfig);
        if (response.data.statusCode !== 200) this.setLoginError(true);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async setUserProfilePic(isOnline: boolean) {
      if (!isOnline) return
      try {
        const getGraphInfo = await ApiService.getGraph('https://graph.microsoft.com/v1.0/me/photo/$value')
        if (getGraphInfo.status == 200) {
          const buffer = getGraphInfo.data
          const blob = new Blob([buffer])
          const urlCreator = window.URL || window.webkitURL
          this.statePhotoUrl = urlCreator.createObjectURL(blob)
        }
      } catch (error) {
        sendErrorEvent('IRONS', error);
        // do nothing
      }
    },
    async renewToken() {
      const isAnyOngoingProcess = (await tableToArray(db, 'syncToken')).length
      if (isAnyOngoingProcess > 0) return
      await addRecord<SyncToken>(db, 'syncToken', {
        syncDate: new Date().toLocaleString()
      })
      const store = useTokenStore()
      const validToken = await db.validTokenNew.get({
        token: store.Token
      })
      if (validToken) {
        const expired = epochToDate(validToken.expired)
        const now = new Date()
        const diffs = (expired.getTime() - now.getTime())
        const minutesDifferences = Math.round(((diffs % 86400000) % 3600000) / 60000)
        console.log('minutes differences', minutesDifferences)
        if (minutesDifferences > 10) return
      }
      const tokenStore = useTokenStore()
      const cacheAccount = localStorage.getItem("account-info-cache") as string
      const account = JSON.parse(cacheAccount) as AccountInfo
      const wrapperInstance = msalWrapperClass.getInstance()
      const msalInstance = msalWrapperClass.getMSALInstance()
      try {
        const tokenResponse = await wrapperInstance.getSilentTokenRequest(msalInstance, account)
        tokenStore.setToken(tokenResponse.accessToken)
        tokenStore.setExpired(new Date())
        // update accessToken
        const validToken = await db.validTokenNew.get({
          token: tokenResponse.accessToken
        })
        if (validToken) {
          validToken.lastUpdated = Math.trunc(new Date().getTime() / 1000)
          validToken.expired = tokenResponse.expiresOn?.getTime() as number
          await db.validTokenNew.put(validToken)
        }
      } catch (error) {
        if (typeof error == 'object') {
          if (error?.toString().includes('no_network_connectivity')) {
            return
          }
        } else {
          localStorage.removeItem("account-info-cache")
          const router = useRouter()
          if (router) {
            router.push({ name: "signin" })
          } else {
            window.location.href = import.meta.env.VITE_APP_MSAL_LOGOUT_REDIRECT as string
          }
        }
        sendErrorEvent('IRONS', error);
      } finally {
        clearRecords(db, 'syncToken')
      }
    },
    async reset() {
      this.stateLoggedIn = false
      this.stateUser = {} as UserInfo
      this.statePhotoUrl = ''
      this.stateUsername = undefined
      // localStorage.removeItem("account-info-cache")
      // localStorage.removeItem("login-tracked")
      await db.validTokenNew.clear()
    }
  }
});
