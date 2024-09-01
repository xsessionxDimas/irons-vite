
import { defineStore } from 'pinia'

export const useCronStore = defineStore({
  id: 'cronStore',
  state: () => {
    return {
      stateTokenIntervalId: null as number | null,
      stateSyncInterventionIntervalId: null as number | null,
      stateFormSyncIntervalId: null as number | null
    }
  },
  getters: {
    TokenIntervalId: (state) => {
      return state.stateTokenIntervalId
    },
    SyncIntervalId: (state) => {
      return state.stateSyncInterventionIntervalId
    },
    FormSyncIntervalId: (state) => {
      return state.stateFormSyncIntervalId
    }
  },
  actions: {
    setTokenCronJob(intervalId: number): void {
      this.stateTokenIntervalId = intervalId
    },
    setSyncInteventionCronJob(intervalId: number): void {
      this.stateSyncInterventionIntervalId = intervalId
    },
    setFormSyncCronJob(intervalId: number): void {
      this.stateFormSyncIntervalId = intervalId
    },
    releaseCronJob() {
      if (this.stateTokenIntervalId) {
        window.clearInterval(this.stateTokenIntervalId as number)
      }
      if (this.stateSyncInterventionIntervalId) {
        window.clearInterval(this.stateSyncInterventionIntervalId as number)
      }
      if (this.stateFormSyncIntervalId) {
        window.clearInterval(this.stateFormSyncIntervalId as number)
      }
      this.stateTokenIntervalId = null
      this.stateSyncInterventionIntervalId = null
      this.stateFormSyncIntervalId = null
    }
  }
})
