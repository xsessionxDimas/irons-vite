import { clearRecords, tableToArray } from "@/database/schema/DatabaseWrapper";
import { db } from "@/database/schema/DexieSchema";
import { ValidTokenNew } from "@/database/schema/ValidTokenNew";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import { useTokenStore } from "@/store/pinia/dma/token/useTokenStore";
import {
  PublicClientApplication,
  AccountInfo,
  SilentRequest,
  PopupRequest,
  AuthenticationResult,
  InteractionRequiredAuthError,
  InteractionStatus
} from "@azure/msal-browser";

export default class SSOService {
  private static msal: PublicClientApplication;
  private static instance: SSOService;

  public static getInstance(): SSOService {
    if (!this.instance) {
      this.instance = new SSOService();
    }
    return this.instance;
  }

  public static getMSALInstance(): PublicClientApplication {
    if (!this.msal) {
      this.msal = new PublicClientApplication({
        auth: {
          clientId: import.meta.env.VITE_APP_MSAL_CLIENT_ID as string,
          authority: import.meta.env.VITE_APP_MSAL_AUTHORITY,
          postLogoutRedirectUri: import.meta.env.VITE_APP_MSAL_LOGOUT_REDIRECT as string
        },
        cache: {
          cacheLocation: import.meta.env.VITE_APP_MSAL_CACHE_LOCATION,
        },
      });
    }
    return this.msal;
  }

  public async getActiveUser(msal: PublicClientApplication): Promise<AccountInfo|undefined> {
    if (!localStorage.getItem("account-info-cache") || localStorage.getItem("account-info-cache") == 'undefined') return
    const store = useAuthenticationStore();
    const cacheAccount = JSON.parse(localStorage.getItem("account-info-cache") as string);
    if (store.Username === undefined && cacheAccount) {
      store.setUsername(cacheAccount.username);
    }
    await msal.handleRedirectPromise()
    return msal.getAccountByUsername(store.Username as string) as AccountInfo;
  }

  private getSilentRequest(account: AccountInfo): SilentRequest {
    return {
      scopes: [import.meta.env.VITE_APP_MSAL_SCOPE as string],
      account: account,
      forceRefresh: true
    }
  }

  public async forceLogout(msal: PublicClientApplication) {
    localStorage.clear();
    await msal.loginRedirect({
      account: msal.getAllAccounts()[0],
      scopes: [import.meta.env.VITE_APP_MSAL_SCOPE as string],
      redirectStartPage: import.meta.env.VITE_APP_MSAL_MAIN_PAGE as string
    })
  }

  public getGraphTokenRequest(msal: PublicClientApplication, account: AccountInfo) {
    const req = {
      scopes: [
        'https://graph.microsoft.com/.default'
      ],
      account: account
    }
    return msal.acquireTokenSilent(req)
  }

  private getPopupRequest(): PopupRequest {
    return {
      scopes: [import.meta.env.VITE_APP_MSAL_SCOPE as string]
    };
  }

  public async getAccessToken(msal: PublicClientApplication, account: AccountInfo) {
    let tokenResponse: AuthenticationResult | null = null;
    try {
      const silentRequest = this.getSilentRequest(account);
      tokenResponse = await msal.acquireTokenSilent(silentRequest);
      return tokenResponse;
    } catch (e) {
      if (typeof e == 'object') {
        if (e?.toString().includes('no_network_connectivity')) {
          return
        }
      }
      if (e instanceof InteractionRequiredAuthError) {
        // check for any interactions
        if (e.errorMessage !== InteractionStatus.None) {
          // throw a new error to be handled in the caller below
          throw new Error("interaction_in_progress");
        } else {
          // no interaction, invoke popup flow
          const request = this.getPopupRequest();
          tokenResponse = await msal.acquireTokenPopup(request);
          return tokenResponse
        }
      }
    }
  }

  public async renewAccessToken(msal: PublicClientApplication) {
    let tokenResponse: AuthenticationResult | null = null;
    try {
      const account = msal.getAllAccounts()[0]
      if (!account) return
      const silentRequest = this.getSilentRequest(account);
      tokenResponse = await msal.acquireTokenSilent(silentRequest);
      return tokenResponse;
    } catch (e) {
      if (typeof e == 'object') {
        if (e?.toString().includes('no_network_connectivity')) {
          return
        }
      }
    }
  }


  public async hitSilentToken() {
    const wrapperInstance = SSOService.getInstance()
    const msalInstance = SSOService.getMSALInstance()
    try {
      const tokenResponse = await wrapperInstance.getSilentTokenRequest(msalInstance, msalInstance.getAllAccounts()[0])
      const tokenStore = useTokenStore()
      tokenStore.setToken(tokenResponse.accessToken)
      tokenStore.setExpired(new Date())
      // update accessToken
      const validTokenNew = await tableToArray(db, 'validTokenNew') as ValidTokenNew[]
      if (validTokenNew.length > 0) {
        validTokenNew[0].token = tokenResponse.accessToken
        validTokenNew[0].lastUpdated = Math.trunc(new Date().getTime() / 1000)
        validTokenNew[0].expired = tokenResponse.expiresOn?.getTime() as number
        validTokenNew[0].expiredDate = tokenResponse.expiresOn as Date
        validTokenNew[0].lastUpdatedDate = new Date()
        await clearRecords(db, 'validTokenNew')
        await db.validTokenNew.put(validTokenNew[0])
      }
      const authStore = useAuthenticationStore()
      authStore.setLoggedIn(true)
    } catch (error) {
      console.log(error)
    }
  }

  public async getSilentTokenRequest(msal: PublicClientApplication, account: AccountInfo) {
    let tokenResponse: AuthenticationResult | null = null;
    const silentRequest = this.getSilentRequest(account);
    tokenResponse = await msal.acquireTokenSilent(silentRequest);
    return tokenResponse;
  }

  public getAccessTokenSilent(msal: PublicClientApplication, account: AccountInfo) {
    const silentRequest = this.getSilentRequest(account);
    return msal.acquireTokenSilent(silentRequest);
  }

  public async getAccessTokenPopup(msal: PublicClientApplication) {
    let tokenResponse: AuthenticationResult | null = null;
    const request = this.getPopupRequest();
    const activity = sessionStorage.getItem("msal.interaction.status")
    if (activity) {
      sessionStorage.removeItem("msal.interaction.status")
    }
    tokenResponse = await msal.acquireTokenPopup(request);
    const store = useAuthenticationStore();
    store.setUsername(tokenResponse.account?.username as string);
    return tokenResponse.accessToken;
  }
}
