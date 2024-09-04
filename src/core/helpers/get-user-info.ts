import { Actions } from '../../store/enums/StoreEnums'
import { useBodyStore } from '../../store/templates/useBodyStore'
import { router } from '../../router/index'
import {
  DrawerComponent,
  ScrollComponent,
} from '../../assets/ts/components/index'
import {
  useAuthenticationStore
} from '../../store/pinia/application/useAuthenticationStore'
import { useMenuStore } from '../../store/pinia/application/useMenuStore'
import { useLanguageStore } from '../../store/pinia/application/useLanguageStore'
import { AccountInfo } from '@azure/msal-common'
import { useMasterStore } from '../../store/pinia/dma/masters/useMasterStore'
import {
  isOfflineOrSlowInternetConnection
} from "../../core/helpers/internet-connection"
import { PublicClientApplication } from '@azure/msal-browser'
import { tableToArray } from '../../database/schema/DatabaseWrapper'
import { db } from '../../database/schema/DexieSchema'
import { UserInfo } from '../../database/schema/UserInfo'

const store = useBodyStore()
const authStore = useAuthenticationStore()
const menuStore = useMenuStore()
const masterStore = useMasterStore()
const langStore = useLanguageStore()

export const removePageLoadingClassthenRedirectSignIn = () => {
  store[Actions.REMOVE_BODY_CLASSNAME]("page-loading")
  router.push({ name: "signin" })
}

export const downloadLanguage = async () => {
  if (!langStore.isDictionarySet) await langStore.downloadLanguage("EN")
}

export const checkSignInStatus = async (instance: PublicClientApplication) => {
  if (!localStorage.getItem("account-info-cache") || localStorage.getItem("account-info-cache") == 'undefined') {
    store[Actions.REMOVE_BODY_CLASSNAME]("page-loading")
    router.push({ name: "signin" })
    return
  }
  const cacheAccount = localStorage.getItem("account-info-cache") as string
  const account = JSON.parse(cacheAccount) as AccountInfo
  const isTracked = localStorage.getItem("login-tracked") as string === "true"
  try {
    if (Object.keys(authStore.user).length === 0 && authStore.user.constructor === Object) {
      await authStore.getUserProfile(account.username, instance)
    }
    if (!isTracked) {
      await authStore.logUserLogin(authStore.user.EmployeeId)
      localStorage.setItem("login-tracked", "true")
    }
    if (!menuStore.isMenuSet) await menuStore.getMenu(authStore.user.EmployeeId.toString())
    await downloadLanguage()
    DrawerComponent.bootstrap()
    ScrollComponent.bootstrap()
    DrawerComponent.updateAll()
    // checkAccess()
    store[Actions.REMOVE_BODY_CLASSNAME]("page-loading")
  } catch (e) {
    store[Actions.REMOVE_BODY_CLASSNAME]("page-loading")
    // need to release signed in user as well
    authStore.reset()
    localStorage.clear()
    router.push({ name: "signin" })
  }
}

export const checkDMASignInStatus = async (isOnline: boolean, instance: PublicClientApplication) => {
  if (!isOnline) {
    try {
      await authStore.setUserProfileFromDump()
      await menuStore.setMenuDMAFromDump()
      return
    } catch (error) {
      console.log(error)
    }
  }
  if (!localStorage.getItem("account-info-cache") || localStorage.getItem("account-info-cache") == 'undefined') {
    router.push({ name: "signin" })
    return
  }
  const cacheAccount = localStorage.getItem("account-info-cache") as string
  const account = JSON.parse(cacheAccount) as AccountInfo
  const isTracked = localStorage.getItem("login-tracked") as string === "true"
  try {
    if (Object.keys(authStore.user).length === 0 && authStore.user.constructor === Object) {
      await authStore.getUserProfile(account.username, instance)
      await masterStore.getMasterDataFitterFromServer()
    }
    if (!isTracked) {
      await authStore.logUserLogin(authStore.user.EmployeeId)
      localStorage.setItem("login-tracked", "true")
    }
    if (!menuStore.isMenuDMASet) {
      if (!isOfflineOrSlowInternetConnection()) {
        await menuStore.getMenuDMA(authStore.user.EmployeeId.toString())
      }
    }
  } catch (e) {
    // need to release signed in user as well
    authStore.reset()
    localStorage.clear()
    router.push({ name: "signin" })
  }
}

export const checkIsUserInfoExists = async () => {
  const isUserInfoExists = await tableToArray(db, "userInfo") as UserInfo[]
  if (isUserInfoExists.length > 0) {
    return true
  } else {
    return false
  }
}
