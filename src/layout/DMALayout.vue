<template>
  <div class="container h-100 p-0" v-loading="loading">
    <div class="row mx-0">
      <user-info @on-sign-out="showLogoutConfirm" :loading="syncLoading"/>
      <!-- top image -->
      <div class="px-6">
        <NwImg src="/media/logos/bumaau/bumaau-home.png" alt="DMA" class="w-99"
          style="height:auto; border-radius: 2.475rem;" />
      </div>
      <router-view />
    </div>
    <div style="display: none;">
      <NwImg src="/media/svg/dma/camera/photo_camera.svg" alt="DMA" />
      <NwImg src="/media/svg/dma/camera/image-collections.svg" alt="DMA" />
      <NwImg src="/media/svg/dma/camera/flip_camera.svg" alt="DMA" />
      <NwImg src="/media/svg/dma/camera/e-form/png/cam-user.png" />
      <NwImg src="/media/svg/dma/camera/e-form/png/cam-read.png" />
      <NwImg src="/media/svg/dma/camera/e-form/png/cam-active.png" />
      <NwImg src="/media/icons/bumaau/available.png" />
      <NwImg src="/media/icons/bumaau/not-available.png" />
      <NwImg src="/media/logos/bumaau/buma-logo.png" />
      <NwImg src="/media/logos/logo-whitebg.png" />
      <NwImg src="/media/logos/bumaau/cautions.png" />
      <NwImg src="/media/logos/bumaau/defect.png" />
      <NwImg src="/media/logos/bumaau/na.png" />
      <NwImg src="/media/svg/dma/icons/Repair.png" />
      <NwImg src="/media/icons/bumaau/danger.png" />
      <NwImg src="/media/icons/bumaau/caution.png" />
      <NwImg src="/media/svg/dma/image-close-button-red.png" />
      <NwImg src="/media/svg/dma/green-checklist.png" />
      <NwImg src="/media/icons/bumaau/rotate.png" />
      <NwImg src="/media/icons/bumaau/sync.png" />
      <NwImg src="/media/logos/bumaau/detail.png" />
      <NwImg src="/media/icons/bumaau/download-arrow-down.png" />
      <NwImg src="/media/logos/bumaau/ok.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/approval.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/change-pin.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/component-intervention-forms.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/defects-planner.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/defects.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/e-Form.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/help.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/interim-engine-service.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/logout.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/monitoring_status.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/monitoring-status.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/sos-print-label.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/version-history.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/sos-print-label.png" />
      <NwImg src="/media/svg/dma/side-menu/inactive/sync.png" />

      <NwImg src="/media/svg/dma/side-menu/active/approval.png" />
      <NwImg src="/media/svg/dma/side-menu/active/sync.png" />
      <NwImg src="/media/svg/dma/side-menu/active/change-pin.png" />
      <NwImg src="/media/svg/dma/side-menu/active/component-intervention-forms.png" />
      <NwImg src="/media/svg/dma/side-menu/active/defects-planner.png" />
      <NwImg src="/media/svg/dma/side-menu/active/defects.png" />
      <NwImg src="/media/svg/dma/side-menu/active/e-form.png" />
      <NwImg src="/media/svg/dma/side-menu/active/interim-engine-service.png" />
      <NwImg src="/media/svg/dma/side-menu/active/monitoring-status.png" />
      <NwImg src="/media/svg/dma/side-menu/active/sos-print-label.png" />
      <NwImg src="/media/svg/dma/side-menu/active/version-history.png" />
      <NwImg src="/media/svg/dma/icons/Check.png" />
      <NwImg src="/media/svg/dma/icons/Check.png" />
      <NwImg src="/media/icons/bumaau/check_circle.png" />
      <NwImg src="/media/icons/bumaau/error.png" />
      <NwImg src="/media/icons/bumaau/close-success.png" />
      <NwImg src="/media/icons/bumaau/close-danger.png" />
      <NwImg src="/media/icons/bumaau/warning.png" />
      <NwImg src="/media/svg/dma/attachment/blue.png" />
      <NwImg src="/media/svg/dma/attachment/green.png" />
      <NwImg src="/media/svg/dma/attachment/pdf.png" />
      <NwImg src="/media/icons/bumaau/person-circle.png" />
      <NwImg src="/media/icons/bumaau/icon-edit.png" />
      <button type="button" class="el-carousel__arrow el-carousel__arrow--right"><i class="el-icon-arrow-right"></i></button>
      <button type="button" class="el-carousel__arrow el-carousel__arrow--left"><i class="el-icon-arrow-left"></i></button>
      <button aria-label="close" class="el-dialog__headerbtn" type="button"><i class="el-dialog__close el-icon el-icon-close"></i></button>
      <button class="btn btn-outline-secondary border" type="button">
        <em class="fa fa-chevron-up"></em>
      </button>
      <button class="btn btn-outline-secondary border" type="button">
        <em class="fa fa-chevron-down"></em>
      </button>
      <button class="p-5 btn btn-outline-secondary border-right-0 border" type="button">
        <em class="fa fa-search"></em>
      </button>
      <button aria-label="close" class="el-dialog__headerbtn" type="button">
        <i class="el-dialog__close el-icon el-icon-close"></i>
      </button>
    </div>
  </div>
  <Confirmation :visibility="logoutConfirm" caption="Are you sure want to log out?" @on-no-confirm="onHideHandler"
    @on-yes-confirm="onSignOutHandler" />
</template>

<script lang="ts" setup>
import UserInfo from "@/components/users/UserInfo.vue";
import Confirmation from '@/components/dialog/Confirmation.vue';
import {
  ref,
  onBeforeMount,
  onMounted,
  computed,
  watch,
  getCurrentInstance,
  AppContext
} from 'vue';
import { useRouter } from "vue-router"
import {
  checkDMASignInStatus
} from "@/core/helpers/get-user-info"
import { useMenuStore } from "@/store/pinia/application/useMenuStore"
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import { useCronStore } from '@/store/pinia/application/useCronStore'
import { useSyncStore } from '@/store/pinia/dma/sync/useSyncStore'
import { useOnline } from '@vueuse/core'
import {
  useComponentInterventionHeaderStore
} from '@/store/pinia/dma/component-intervention/refactor/useComponentInterventionHeaderStore'
import {
  useInterventionFormSyncStore
} from "@/store/pinia/dma/component-intervention/refactor/useInterventionFormSyncStore";
import {
  useOfflineDailyScheduleStore
} from "@/store/pinia/dma/daily-schedule/useOfflineDailyScheduleStore";
import {
  useGeneralFormStore
} from "@/store/pinia/dma/e-form-offline/useGeneralFormStore";
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore";
import { useMasterStore } from "@/store/pinia/dma/masters/useMasterStore";
import { CronJob } from "cron";
import {
  clearRecords,
} from "@/database/schema/DatabaseWrapper";
import { db } from '@/database/schema/DexieSchema';
import {
  isOfflineOrSlowInternetConnection,
  renewToken
} from "@/core/helpers/internet-connection"
import {
  usePositionListStore
} from '@/store/pinia/administration/organization-unit/position/usePositionListStore'
import {
  useDailyScheduleStore
} from '@/store/pinia/dma/daily-schedule/useDailyScheduleStore'
import {
  useGeneralFormStore as useOfflineGeneralFormStore
} from '@/store/pinia/dma/e-form-offline/useGeneralFormStore'
import {
  useComponentInterventionStore
} from '@/store/pinia/dma/component-intervention/useComponentInterventionStore'
import {
  useEFormStore as useOfflineEFormStore
} from '@/store/pinia/dma/e-form-offline/useEFormStore'
import { useMsal } from "@/msal/api/useMsal"
import { loginRequest } from "@/msal/authConfig";
import { checkTokenExist } from "@/store/pinia/dma/e-form/helpers";
import { useAnalyticApi } from "@/analytics/api/analyticApi";

/* online sensor */
const online = useOnline()

const logoutConfirm = ref(false)
const router = useRouter()
const profileLoading = ref(false)
const authStore = useAuthenticationStore()
const syncStore = useInterventionFormSyncStore()
const cronStore = useCronStore()
const syncCronStore = useSyncStore()
const interventionHeaderStore = useComponentInterventionHeaderStore()
const offlineDailyScheduleStore = useOfflineDailyScheduleStore()
const generalStore = useGeneralFormStore()
const eFormStore = useEFormStore()
const store = useMenuStore()
const syncLoading = ref(false)
const masterStore = useMasterStore()
const listStore = usePositionListStore()
const dailyScheduleStore = useDailyScheduleStore()
const offlineGeneralStore = useOfflineGeneralFormStore()
const componentInterventionStore = useComponentInterventionStore()
const offlineEformStore = useOfflineEFormStore()

const { instance } = useMsal()

/* computeds */
const isLoggedIn = computed(() => {
  return authStore.loggedIn;
})
const renewTokenJob = computed(() => {
  return syncCronStore.jobRenewToken
})
const syncTaskJob = computed(() => {
  return syncCronStore.jobSyncTask
})
const syncTaskImageJob = computed(() => {
  return syncCronStore.jobSyncTaskImage
})
const lastSyncDate = computed(() => {
  return interventionHeaderStore.LastSync == '' ? '' : `Last Updated ${interventionHeaderStore.LastSync}`
})
/* methods */
const showLogoutConfirm = () => {
  logoutConfirm.value = true;
}

/* events handlers */
const onSignOutHandler = async () => {
  try {
    await instance.logoutPopup();
  } catch (error) {
    console.log(error)
  } finally {
    localStorage.clear();
    sessionStorage.clear();
    authStore.reset();
    store.reset();
    cronStore.releaseCronJob()
    syncCronStore.reset()
    // need to set posthog identity
    try {
      const analytic = useAnalyticApi();
      if (analytic.provider) {
        analytic.provider.resetUser()
      }
    } catch (e) {
      console.log(e)
    } finally {
      await clearRecords(db, 'validTokenNew')
      router.push({ name: "signin" });
    }
  }
}

const getOutstanding = async () => {
  try {
    await store.getOutstandingMenuDMA(authStore.user.EmployeeId)
  } catch (error) {
    console.log(error)
  }
}


const onHideHandler = () => {
  logoutConfirm.value = false;
}

const loading = computed(() => {
  return (store.loadingDMA && profileLoading.value)
})

watch(isLoggedIn, (value) => {
  if (!value) {
    renewToken(instance)
  }
})

const startRenewTokenJob = () => {
  if (renewTokenJob.value && renewTokenJob.value.running) return
  if (!renewTokenJob.value) {
    const job = new CronJob(
      "*/10 * * * *", // every 10 minutes
      async function () {
        renewToken(instance)
      }, // onTick
      null, // onComplete
      true
    );
    syncCronStore.setJobRenewTokenRunning(job)
  } else {
    renewTokenJob.value.start()
  }
}

const startSyncTaskJob = () => {
  if (syncTaskJob.value && syncTaskJob.value.running) return
  if (!syncTaskJob.value) {
    syncStore.SyncData()
    const job = new CronJob(
      "*/3 * * * * *", // every 3 seconds
      function () {
        syncStore.SyncData()
      }, // onTick
      null, // onComplete
      true
    );
    syncCronStore.setJobSyncTaskRunning(job)
  } else {
    syncStore.SyncData()
    syncTaskJob.value.start()
  }
}

const startSyncTaskImageJob = () => {
  if (syncTaskImageJob.value && syncTaskImageJob.value.running) return
  if (!syncTaskImageJob.value) {
    if (!isOfflineOrSlowInternetConnection()) {
      syncStore.SyncImage()
    }
    const job = new CronJob(
      "*/3 * * * * *", // every 3 seconds
      function () {
        if (!isOfflineOrSlowInternetConnection()) {
          syncStore.SyncImage()
        }
      }, // onTick
      null, // onComplete
      true
    );
    syncCronStore.setJobSyncTaskImageRunning(job)
  } else {
    if (!isOfflineOrSlowInternetConnection()) {
      syncStore.SyncImage()
    }
    syncTaskImageJob.value.start()
  }
}

watch(online, (value) => {
  if (value) {
    console.log('Cron renew token called after back online at : ', new Date().toLocaleString())
    renewToken(instance)
    startSyncTaskJob()
    startSyncTaskImageJob()
  } else {
    syncCronStore.stopAllJob()
  }
})

/* lifecycle events */
onBeforeMount(async () => {
  profileLoading.value = true
  await checkDMASignInStatus(!isOfflineOrSlowInternetConnection(), instance)
  profileLoading.value = false
  // get master data from home.vue file
  if (!isOfflineOrSlowInternetConnection()) {
    await instance.acquireTokenSilent(loginRequest)
    if (authStore.user.SiteId) {
      listStore.getPositionDMA();
      if (authStore.user.SiteId) {
        if (store.isMenuDMASet) {
          getOutstanding()
        }
        dailyScheduleStore.getDailySchedules(authStore.user.SiteId)
        dailyScheduleStore.getDailySchedulesInterim(authStore.user.SiteId)
        offlineDailyScheduleStore.getDailySchedules(authStore.user.SiteId)
        offlineDailyScheduleStore.getHmOffset(authStore.user.SiteId)
      }
      offlineGeneralStore.getSMUTolerance()
      offlineGeneralStore.getShiftListData()
      offlineEformStore.getOilTolerance();
      componentInterventionStore.getParamDaysBeforeEst()
      masterStore.getCBMMappingDataFromServer()
      masterStore.getMasterDataFromServer()
      masterStore.getMasterDataFitterFromServer()
      eFormStore.updateSkipPreServiceReasonOptions()
      offlineEformStore.updateSkipPreServiceReasonOptions()
    }
  } else {
    offlineDailyScheduleStore.getDailyScheduleFromLocalDB()
  }
});

onMounted(() => {
  if (!isOfflineOrSlowInternetConnection()) {
    startRenewTokenJob()
    startSyncTaskJob()
    startSyncTaskImageJob()
    interventionHeaderStore.syncWithIronPortalData()
    interventionHeaderStore.getLatestSyncDate()
    if (authStore.user.SiteId) {
      interventionHeaderStore.getWorkOrders(authStore.user.SiteId)
    }
  } else {
    syncCronStore.stopAllJob()
    checkTokenExist()
  }
});

watch(() => {
  return authStore.user.SiteId
}, (newVal) => {
  if (newVal) {
    interventionHeaderStore.getWorkOrders(authStore.user.SiteId)
  }
})
</script>

<style>
body:not(.el-dialog) {
  padding-right: 0px !important;
}
</style>
