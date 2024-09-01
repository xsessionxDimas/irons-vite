import {
  InteractionRequiredAuthError,
  PublicClientApplication
} from '@azure/msal-browser'
import { useNetwork, useOnline } from '@vueuse/core'
import { loginRequest, loginRequestForce } from "@/msal/authConfig"

const { effectiveType } = useNetwork()
const online = useOnline()

const isOfflineOrSlowInternetConnection = () => {
  let status = false
  if (effectiveType.value == "2g" || !online.value) {
    status = true
  }
  return status
}

const renewToken = (instance: PublicClientApplication) => {
  instance.acquireTokenSilent(loginRequestForce).catch((error) => {
    if (error instanceof InteractionRequiredAuthError) {
      // fallback to interaction when silent call fails
      return instance.acquireTokenPopup(loginRequest);
    }
  })
}

export { isOfflineOrSlowInternetConnection, renewToken }
