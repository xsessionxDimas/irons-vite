import { defineStore } from 'pinia'

export const useGlobalConnectionStore = defineStore({
  id: "globalConnection",
  state: () => {
    return {
      stateIsConnectionError: false,
      stateSubmitConnectionError: false,
      stateConnectionStatus: true,
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
    },
    // ---------- check connection error when submitting ---------
    checkIsErrorNoNetwork(errorMessage: any) {
      let status = false
      try {
        const message = (errorMessage).message as string;
        status = message.includes('Network Error')
        status = `${errorMessage}`.includes("Network Error")
      } catch (noConErr) {
        console.log("catch on error checkIsErrorNoNetwork - useGlobalConnectionStore", noConErr);
        return status
      }
      return status
    },
    // ---------- check connection error when submitting ---------
    // ---------- toggle pop up showing submit no internet connection ---------
    setSubmitConnectionError(state: boolean) {
      this.stateSubmitConnectionError = state
    },
    // ---------- toggle pop up showing submit no internet connection ---------
    // ---------- toggle pop up showing no internet connection ---------
    setConnectionStatus(state: boolean) {
      this.stateConnectionStatus = state
    }
    // ---------- toggle pop up showing no internet connection ---------
  }
})
