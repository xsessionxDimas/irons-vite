<template>
    <!-- container -->
    <div class="m-0 p-8 bg-white full-screen">
      <router-view />
    </div>
</template>

<script lang="ts" setup>
import {
  computed,
  onMounted,
  watch,
} from 'vue'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import {
  isOfflineOrSlowInternetConnection,
  renewToken
} from "@/core/helpers/internet-connection";
import { useMsal } from '@/msal/api/useMsal'
import { useSyncStore } from '@/store/pinia/dma/sync/useSyncStore'
import { CronJob } from 'cron'

const authStore = useAuthenticationStore()
const { instance } = useMsal()
const syncCronStore = useSyncStore()

const isLoggedIn = computed(() => {
  return authStore.loggedIn
})

watch(isLoggedIn, (value) => {
  if (!value) {
    renewToken(instance)
  }
})

const renewTokenJob = computed(() => {
  return syncCronStore.jobRenewToken
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

onMounted(() => {
  if (!isOfflineOrSlowInternetConnection()) {
    startRenewTokenJob()
  } else {
    syncCronStore.stopAllJob()
  }
})
</script>

<style lang="scss" scoped>
body:not(.el-dialog) {
  padding-right: 0px !important;
}
.full-screen {
  height: 100%;
}
</style>

<style>
body:not(.el-dialog) {
  padding-right: 0px !important;
}
</style>
