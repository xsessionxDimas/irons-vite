<template>
    <OfflineCameras />
    <router-view />
</template>

<script lang="ts" setup>
import {
  checkDMASignInStatus
} from "@/core/helpers/get-user-info"
import {
  onBeforeMount,
  onUnmounted,
  onMounted,
  watch,
  computed
} from "vue"
import { useCameraStore } from "@/store/pinia/application/useCameraStore"
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import { useSyncStore } from '@/store/pinia/dma/sync/useSyncStore'
import { useOnline } from '@vueuse/core'
import {
  useInterventionFormSyncStore
} from "@/store/pinia/dma/component-intervention/refactor/useInterventionFormSyncStore"
import OfflineCameras from "@/components/camera/OfflineCameras.vue"
import { CronJob } from "cron"
import {
  isOfflineOrSlowInternetConnection,
  renewToken
} from "@/core/helpers/internet-connection";
import { useMsal } from "@/msal/api/useMsal"

/* online sensor */
const online = useOnline()
const { instance } = useMsal()
const camstore = useCameraStore()
const authStore = useAuthenticationStore()
const syncStore = useInterventionFormSyncStore()
const cronSyncStore = useSyncStore()

/* computeds */
const isLoggedIn = computed(() => {
  return authStore.loggedIn
})
const renewTokenJob = computed(() => {
  return cronSyncStore.jobRenewToken
})
const syncTaskJob = computed(() => {
  return cronSyncStore.jobSyncTask
})
const syncTaskImageJob = computed(() => {
  return cronSyncStore.jobSyncTaskImage
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
    cronSyncStore.setJobRenewTokenRunning(job)
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
    cronSyncStore.setJobSyncTaskRunning(job)
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
    cronSyncStore.setJobSyncTaskImageRunning(job)
  } else {
    if (!isOfflineOrSlowInternetConnection()) {
      syncStore.SyncImage()
    }
    syncTaskImageJob.value.start()
  }
}

watch(online, (value) => {
  if (value) {
    startRenewTokenJob()
    startSyncTaskJob()
    startSyncTaskImageJob()
  } else {
    cronSyncStore.stopAllJob()
  }
})

onMounted(() => {
  if (!isOfflineOrSlowInternetConnection()) {
    startRenewTokenJob()
    startSyncTaskJob()
    startSyncTaskImageJob()
  } else {
    cronSyncStore.stopAllJob()
  }
});

onBeforeMount(async () => {
  await checkDMASignInStatus(!isOfflineOrSlowInternetConnection(), instance);
});
onUnmounted(() => {
  camstore.reset();
});
</script>

<style>
  body {
    font-family: 'Public Sans', sans-serif !important;
  }
  body:not(.el-dialog) {
    padding-right: 0px !important;
  }
</style>
