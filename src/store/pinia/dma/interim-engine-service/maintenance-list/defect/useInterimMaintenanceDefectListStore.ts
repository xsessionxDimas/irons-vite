
import {
  DefectList
} from "@/core/types/entities/dma/e-form/historical-maintenace/DefectList";
import { defineStore } from "pinia";

export const useInterimMaintenanceDefectListStore = defineStore({
  id: "InterimMaintenanceDefectList",
  state: () => {
    return {
      stateList: [] as DefectList[],
      stateSelectedForm: {} as DefectList
    }
  },
  getters: {
    selectedForm: (state) => {
      return state.stateSelectedForm
    }
  },
  actions: {
    setSelectedForm(form: DefectList) {
      this.stateSelectedForm = form
    }
  }
});
