<template>
  <div class="row ">
     <!-- wrapper -->
     <div class="shadow-lg p-4 pb-10 mb-5 bg-white rounded border border-light rounded text-center" v-loading="authStore.loading">
        <!-- image -->
        <NwImg class="w-300px my-7" src="/media/logos/bumaau/buma-logo.png" style="height:auto" alt="logo" />
        <!-- buttons wrapper-->
        <div class="row justify-content-center">
           <div class="w-100 justify-content-center" style="margin-right:5px;">
              <button @click.prevent="dmaLogin" href="#" class="w-100 btn btn-lg text-white btn-big" style="font-size: 12px; font-weight: 600;">
                <NwImg src="/media/logos/bumaau/microsoft.png" alt="microsoft" width="24" />
                Sign in Microsoft
              </button>
           </div>
        </div>
        <div style="display: none;">
          <NwImg src="/media/icons/bumaau/danger.png" />
        </div>
     </div>
  </div>
  <ErrorBox
    :visibility="errorBoxVisible"
    :caption="'Failed to sign in, you need to sign in when you have internet connection first'"
    @on-close="() => { errorBoxVisible = false }" />
</template>

<script lang="ts" setup>
import {
  onMounted,
  ref,
} from "vue";
import { useRouter } from "vue-router";
import {
  swalAlertError
} from "@/core/helpers/sweet-alert";
import msalWrapperClass from "@/core/services/SSOService";
import { AccountInfo } from "@azure/msal-browser";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { useNetwork } from "@vueuse/core";
import { checkIsUserInfoExists } from "@/core/helpers/get-user-info";
import ErrorBox from '@/components/alert/ErrorBox.vue'

const authStore = useAuthenticationStore();
const router = useRouter();
const { isOnline } = useNetwork()
const retryTimes = ref(0)
const errorBoxVisible = ref(false)

const dmaLogin = async () => {
  if (isOfflineOrSlowInternetConnection()) {
    const isUserInfoExists = await checkIsUserInfoExists()
    if (!isUserInfoExists) {
      errorBoxVisible.value = true
      return
    }
    router.push({ name: "ironforms" })
    return
  }
  await msLogin();
}
// eslint-disable-next-line @typescript-eslint/ban-types
const msLogin = async () => {
  const wrapperInstance = msalWrapperClass.getInstance();
  const msalInstance = msalWrapperClass.getMSALInstance();
  let account: AccountInfo | undefined;
  account = await wrapperInstance.getActiveUser(msalInstance);
  if (
    account &&
    (
      localStorage.getItem("account-info-cache") ||
      localStorage.getItem("account-info-cache") !== 'undefined'
    )
  ) {
    router.push({ name: "ironforms" });
    return;
  }
  let isError = false
  try {
    console.log('step 1 msal login');
    await authStore.signIn();
    if (!authStore.loggedIn) return;
    localStorage.setItem("login-tracked", "false");
    console.log('step 2 redirect to ironforms');
    router.push({ name: "ironforms" });
  } catch (error: any) {
    console.log('step error', error)
    if (!error) {
      isError = false
      return
    }
    if (error.errorCode == "user_cancelled") {
      return;
    }
    if (error.errorCode == "interaction_in_progress") {
      if (retryTimes.value < 4) {
        handleClearStorageData()
        await msLogin()
        retryTimes.value++
        return
      }
      return;
    }
    if (!isOnline.value) {
      console.log('isOnline:', isOnline.value)
      swalAlertError("Unable to sign in. Offline connection detected. Please check your internet connection and try signing in again.", "Close")
    }
  } finally {
    console.log('step error final', isError)
    authStore.setLoading(false);
    if (!isError) {
      router.push({ name: "ironforms" });
    }
  }
}

const handleClearStorageData = () => {
  const theCookies = document.cookie.split(';');
  for (var i = 1; i <= theCookies.length; i++) {
    var acookie = theCookies[i - 1];
    var cookieArr = acookie.split('=');
    document.cookie = cookieArr[0] + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  window.localStorage.clear();
  window.sessionStorage.clear();
}

onMounted(async () => {
  localStorage.setItem("lang", "en");
  if (isOfflineOrSlowInternetConnection()) {
    const wrapperInstance = msalWrapperClass.getInstance();
    const msalInstance = msalWrapperClass.getMSALInstance();
    let account: AccountInfo | undefined;
    account = await wrapperInstance.getActiveUser(msalInstance);
    if (
      account &&
      (
        localStorage.getItem("account-info-cache") ||
        localStorage.getItem("account-info-cache") !== 'undefined'
      )
    ) {
      router.push({ name: "ironforms" });
      return;
    }
  }
});
</script>

<style scoped>
   .btn-big {
    background:#18AF4A;
    font-weight: 700;
   }

   .btn-big:hover {
    background: rgb(34 197 94) !important;
   }
</style>
