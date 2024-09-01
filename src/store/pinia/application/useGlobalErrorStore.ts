import { defineStore } from 'pinia'

export const useGlobalErrorStore = defineStore({
  id: "globalError",
  state: () => {
    return {
      stateIsConnectionError: false,
      stateSubmitConnectionError: false,
    }
  },
  getters: {
    isConnectionError: (state) => {
      return state.stateIsConnectionError
    }
  },
  actions: {
    setIsConnectionErrorState(currentState: boolean) {
      this.stateIsConnectionError = currentState
    }
  }
})
