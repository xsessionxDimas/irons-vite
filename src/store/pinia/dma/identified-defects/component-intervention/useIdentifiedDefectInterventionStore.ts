import { defineStore } from "pinia";

export const useIdentifiedDefectInterventionStore = defineStore({
  id: "useIdentifiedDefectInterventionStore",
  state: () => {
    return {}
  },
  actions: {
    async getIdentifiedDefectList(supervisor: string) {
      const params = {
        ver: "v1",
        supervisor: supervisor,
        userGroup: 'supervisor'
      }
      return;
    }
  }
});
