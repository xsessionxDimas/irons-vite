import { defineStore } from "pinia";

export const useLayoutStore = defineStore({
  id: "layoutStore",
  state: () => {
    return {
      addFunction: null,
      bulkRoute: "" as String
    }
  },
  getters: {
    getAddFunction: (state) => {
      return state.addFunction
    },
    getBulkRoute: (state) => {
      return state.bulkRoute
    },
  },
  actions: {
    setAddFunction: (callbackFunction) => {
      // this.addFunction = callbackFunction
    },
    setBulkRoute: (value) => {
      // this.bulkRoute = value
    }
  }
})