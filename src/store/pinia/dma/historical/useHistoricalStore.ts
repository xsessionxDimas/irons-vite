import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import ApiService from "@/core/services/ApiService";
import {
  DefectList
} from "@/core/types/entities/dma/e-form/historical-maintenace/DefectList";
import {
  FormList
} from "@/core/types/entities/dma/e-form/historical-maintenace/FormList";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { GET_EFORM_HISTORY, GET_DEFECT_HISTORY } from "./urls";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useHistoricalStore = defineStore({
  id: "historical",
  state: () => {
    return {
      stateDataFetched: false,
      stateFormList: [] as FormList[],
      stateDefectList: [] as DefectList[]
    }
  },
  getters: {
    formList: (state) => {
      return state.stateFormList;
    },
    defectList: (state) => {
      return state.stateDefectList;
    },
    dataFetched: (state) => {
      return state.stateDataFetched;
    }
  },
  actions: {
    async getHistoricalFormData(psType: string, equipmentModel: string, equipmentNumber: string) {
      const params = {
        ver: "v1",
        psTypeId: psType,
        equipmentModel: equipmentModel,
        equipmentNumber: equipmentNumber
      };
      try {
        const response: AxiosResponse<ApiResponse<FormList>> = await ApiService.get(`${GET_EFORM_HISTORY}?${new URLSearchParams(params).toString()}`);
        this.stateFormList = response.data.result.content;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getHistoricalDefectData(psType: string, equipmentModel: string, unitNumber: string) {
      const params = {
        ver: "v1",
        psTypeId: psType,
        equipmentModel: equipmentModel,
        unitNumber: unitNumber
      };
      try {
        const response: AxiosResponse<ApiResponse<DefectList>> = await ApiService.get(`${GET_DEFECT_HISTORY}?${new URLSearchParams(params).toString()}`);
        this.stateDefectList = response.data.result.content;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    setDataFetchedFlag(value: boolean) {
      this.stateDataFetched = value;
    },
    reset() {
      this.stateDataFetched = false;
      this.stateFormList = [];
      this.stateDefectList = [];
    }
  }
});
