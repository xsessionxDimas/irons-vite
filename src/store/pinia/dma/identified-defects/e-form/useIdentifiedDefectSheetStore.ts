import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import ApiService from "@/core/services/ApiService";
import { DefectSheet } from "@/core/types/entities/dma/defects/DefectSheet";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { DEFECT_SHEET_API_URL } from "../../defect-approval/urls";
import { Option } from "@/core/types/misc/Option";
import {
  addCurrentDateWithFormatHelper,
  formatCurrentDateHelper,
  substractCurrentDateWithFormatHelper
} from "@/core/helpers/date-format";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useIdentifiedDefectSheetStore = defineStore({
  id: "useIdentifiedDefectSheetStore",
  state: () => {
    return {
      stateIsError: false,
      stateDefectSheets: [] as DefectSheet[],
      stateError: {} as any,
      stateSFOption: [] as Option[],
      stateDefaultRange: [
        substractCurrentDateWithFormatHelper(3, "months", "YYYY-MM-DD"),
        addCurrentDateWithFormatHelper(0, "months", "YYYY-MM-DD"),
      ]
    }
  },
  getters: {
    ServiceFormOptions: (state) => {
      return state.stateSFOption
    },
    ServiceFormList: (state) => {
      return state.stateDefectSheets
    },
    defaultRange: (state) => {
      return state.stateDefaultRange
    },
  },
  actions: {
    async getIdentifiedDefectList(supervisor: string) {
      const params = {
        ver: "v1",
        supervisor: supervisor,
        dateStart: this.defaultRange[0],
        dateEnd: this.defaultRange[1]
      }
      try {
        this.stateIsError = false
        const response: AxiosResponse<ApiResponse<DefectSheet>> = await ApiService.get(`${DEFECT_SHEET_API_URL}?${new URLSearchParams(params).toString()}`)
        this.stateDefectSheets = response.data.result.content
        this.stateSFOption = this.stateDefectSheets.map((val) => {
          return {
            label: `${val.unitNumber} - ${val.brand} ${val.equipmentModel} - ${val.psType} Hour Service - ${val.workOrder}`,
            // value: val.workOrder
            value: `${val.unitNumber} - ${val.equipmentModel} - ${val.psType} Hour Service - ${val.workOrder}`
          }
        })
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        this.stateIsError = true
        this.stateError = error
        sendErrorEvent('IRONS', error);
      }
      return;
    },
    setSelectedDefect(id: string): DefectSheet {
      const defectSheet = this.stateDefectSheets.find((d) => {
        return d.dailyScheduleId === id
      }) as DefectSheet
      return defectSheet
    },
    setDefaultFilter(dateStart, dateEnd) {
      this.stateDefaultRange[0] = dateStart
      this.stateDefaultRange[1] = dateEnd
    },
    setDefaultFilterDateRange() {
      this.stateDefaultRange[0] = substractCurrentDateWithFormatHelper(3, "months", "YYYY-MM-DD");
      this.stateDefaultRange[1] = formatCurrentDateHelper("YYYY-MM-DD");
    },
  }
});
