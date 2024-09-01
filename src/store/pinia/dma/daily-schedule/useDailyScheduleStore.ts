import { defineStore } from "pinia";
import { Option } from "@/core/types/misc/Option";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import ApiService from "@/core/services/ApiService";
import {
  DAILY_SCHEDULE_API_URL,
  DAILY_SCHEDULE_INTERIM_API_URL
} from "./urls";
import {
  DailySchedule
} from "@/core/types/entities/dma/daily-schedule/DailySchedule";
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useDailyScheduleStore = defineStore({
  id: "dailySchedule",
  state: () => {
    return {
      stateDailySchedules: [] as DailySchedule[],
      stateDailySchedulesInterim: [] as DailySchedule[],
      stateDailyScheduleOptions: [] as Option[],
      stateDailyScheduleInterimOptions: [] as Option[],
      stateSelectedDailySchedule: {} as DailySchedule,
      stateSelectedDailyScheduleInterim: {} as DailySchedule
    }
  },
  getters: {
    DailySchedules: (state) => {
      return state.stateDailySchedules;
    },
    DailyScheduleOptions: (state) => {
      return state.stateDailyScheduleOptions;
    },
    DailyScheduleInterimOptions: (state) => {
      return state.stateDailyScheduleInterimOptions;
    },
    SelectedDailySchedule: (state) => {
      return state.stateSelectedDailySchedule;
    },
    SelectedDailyScheduleInterim: (state) => {
      return state.stateSelectedDailyScheduleInterim;
    },
  },
  actions: {
    async getDailySchedules(site) {
      try {
        const params = {
          ver: "v1",
          siteId: site
        }
        const response: AxiosResponse<ApiResponse<DailySchedule>> = await ApiService.get(DAILY_SCHEDULE_API_URL, "", new URLSearchParams(params).toString());
        this.stateDailySchedules = response.data.result.content;
        this.formatDailyScheduleOptions()
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getDailySchedulesInterim(site) {
      try {
        const params = {
          ver: "v1",
          siteId: site
        }
        const response: AxiosResponse<ApiResponse<DailySchedule>> = await ApiService.get(DAILY_SCHEDULE_INTERIM_API_URL, "", new URLSearchParams(params).toString());
        this.stateDailySchedulesInterim = response.data.result.content;
        this.formatDailyScheduleInterimOptions()
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    formatDailyScheduleOptions() {
      this.stateDailyScheduleOptions = this.stateDailySchedules.map((e) => {
        return {
          label: `${e.unitNumber} - ${e.equipmentModel} - ${e.psType} Hour Service - ${e.workOrder}`,
          value: e.id,
          status: e.status,
          progress: e.progress
        }
      });
    },
    formatDailyScheduleInterimOptions() {
      this.stateDailyScheduleInterimOptions = this.stateDailySchedulesInterim.map((e) => {
        return {
          label: `${e.unitNumber} - ${e.equipmentModel} - ${e.psType} Hour Service - ${e.workOrder}`,
          value: e.id,
          status: e.status,
          progress: e.progress
        }
      });
    },
    setSelectedDailySchedule(id: string) {
      const dailySchedule = this.DailySchedules.find((d) => {
        return d.id === id;
      });
      if (dailySchedule) {
        this.stateSelectedDailySchedule = dailySchedule;
      }
    },
    setSelectedDailyScheduleInterim(id: string) {
      const dailySchedule = this.stateDailySchedulesInterim.find((d) => {
        return d.id === id;
      });
      if (dailySchedule) {
        this.stateSelectedDailyScheduleInterim = dailySchedule;
      }
    }
  }
});
