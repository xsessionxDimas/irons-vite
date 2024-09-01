import { CronJob } from "cron";
import { defineStore } from "pinia";

export const useSyncStore = defineStore({
  id: "SyncStore",
  state: () => {
    return {
      stateJobSyncTask: undefined as CronJob | undefined,
      stateJobSyncTaskImage: undefined as CronJob | undefined,
      stateJobRenewToken: undefined as CronJob | undefined
    }
  },
  getters: {
    jobSyncTask: (state) => {
      return state.stateJobSyncTask
    },
    jobSyncTaskImage: (state) => {
      return state.stateJobSyncTaskImage
    },
    jobRenewToken: (state) => {
      return state.stateJobRenewToken
    }
  },
  actions: {
    setJobRenewTokenRunning(cron: CronJob) {
      this.stateJobRenewToken = cron
    },
    setJobSyncTaskRunning(cron: CronJob) {
      this.stateJobSyncTask = cron
    },
    setJobSyncTaskImageRunning(cron: CronJob) {
      this.stateJobSyncTaskImage = cron
    },
    stopAllJob() {
      // stop first then set undefined
      this.stateJobSyncTask?.stop()
      this.stateJobSyncTaskImage?.stop()
      this.stateJobRenewToken?.stop()
    },
    reset() {
      this.stopAllJob()
      // set all state undefined
      this.stateJobSyncTask = undefined
      this.stateJobSyncTaskImage = undefined
      this.stateJobRenewToken = undefined
    }
  }
})
