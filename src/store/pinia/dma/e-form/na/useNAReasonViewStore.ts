import { defineStore } from "pinia"

export const useNAReasonViewStore = defineStore({
  id: "NAReasonView",
  state: () => {
    return {
      stateReason: '',
      stateTitle: '',
      stateVisible: false
    }
  },
  getters: {
    reason: (state) => {
      return state.stateReason
    },
    title: (state) => {
      return state.stateTitle
    },
    visible: (state) => {
      return state.stateVisible
    },
  },
  actions: {
    setReason(value) {
      this.stateReason = value
    },
    setTitle(value) {
      this.stateTitle = value
    },
    setVisible(value) {
      this.stateVisible = value
    },
    resetInstance() {
      this.stateReason = ''
      this.stateTitle = ''
      this.stateVisible = false
    }
  }
})
