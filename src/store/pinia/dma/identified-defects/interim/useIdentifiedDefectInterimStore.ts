import { defineStore } from "pinia";

export const useIdentifiedDefectInterimStore = defineStore({
  id: "useIdentifiedDefectInterimStore",
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
