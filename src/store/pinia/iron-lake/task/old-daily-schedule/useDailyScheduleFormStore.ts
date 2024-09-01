import {
  CRUD_API_URL,
  UPDATE_API_URL,
  LOOKUP_PS_TYPE_API_URL,
  LOOKUP_EQUIPMENT_NUMBER_API_URL,
  LOOKUP_SHIFT_API_URL,
  DELETE_API_URL
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/task/daily-schedule/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/task/daily-schedule/old/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import { Option } from "@/core/types/misc/Option";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";

export const useDailyScheduleFormStore = defineStore({
  id: "dailyScheduleForm",
  state: () => {
    return {
      stateFormData: {
        dailyScheduleId: 0,
        endDate: normalizeDate(new Date("12/31/9999")),
        startDate: normalizeDate(new Date()),
        isActive: true
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      statePsTypeOption: [] as Option[],
      stateShiftOption: [] as Option[],
      stateUnitNumberOption: [] as Option[],
    }
  },
  getters: {
    formData: (state) => {
      return state.stateFormData;
    },
    error: (state) => {
      return state.stateError;
    },
    errors: (state) => {
      return state.stateErrors;
    },
    isError: (state) => {
      return state.stateIsError;
    },
    loading: (state) => {
      return state.stateLoading;
    },
    psTypeOption: (state) => {
      return state.statePsTypeOption;
    },
    shiftOption: (state) => {
      return state.stateShiftOption;
    },
    unitNumberOption: (state) => {
      return state.stateUnitNumberOption;
    },
  },
  actions: {
    async getEquipmentNumberLookup() {
      const params = {
        ver: "v1",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_EQUIPMENT_NUMBER_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateUnitNumberOption = mapOptionFromLookupApi(response.data.result.content, "equipmentNumber", "equipmentNumberDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getPsTypeLookup() {
      const params = {
        ver: "v1",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_PS_TYPE_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.statePsTypeOption = mapOption(response.data.result.content.psType)
      } catch (error) {
        console.log(error);
      }
    },
    async getShiftLookup() {
      const params = {
        ver: "v1",
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            LOOKUP_SHIFT_API_URL,
            "",
            new URLSearchParams(params).toString(),
          );
        this.stateShiftOption = mapOption(response.data.result.content.shift)
      } catch (error) {
        console.log(error);
      }
    },
    async insertData(createBy: string) {
      this.stateFormData.startDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate)))
      this.stateFormData.dateService = formatDateForPostData(normalizeDate(new Date(this.stateFormData.dateService)))
      this.stateFormData.endDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate)))
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${CRUD_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        this.stateErrors.push(error.response.data.result.message);
        // this.stateError = error as string;
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async updateData(updateBy: string) {
      this.stateFormData.startDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate)))
      this.stateFormData.endDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate)))
      this.stateFormData.dateService = formatDateForPostData(normalizeDate(new Date(this.stateFormData.dateService)))
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const payloadFormData = {
          dailyScheduleId: this.stateFormData.dailyScheduleId,
          unitNumber: this.stateFormData.unitNumber,
          smuDue: this.stateFormData.smuDue,
          workOrder: this.stateFormData.workOrder,
          psType: this.stateFormData.psType,
          dateService: this.stateFormData.dateService,
          shift: this.stateFormData.shift,
          startDate: this.stateFormData.startDate,
          endDate: this.stateFormData.endDate,
          isActive: this.stateFormData.isActive
        }
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, payloadFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        this.stateErrors.push(error.response.data.result.message);
        // this.stateError = error as string;
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: ListItem) {
      this.stateFormData.dailyScheduleId = data.dailyScheduleId || 0;
      this.stateFormData.unitNumber = data.unitNumber || "";
      this.stateFormData.smuDue = data.smuDue || "";
      this.stateFormData.workOrder = data.workOrder || "";
      this.stateFormData.psType = data.psType || "";
      this.stateFormData.dateService = data.dateService || "";
      this.stateFormData.shift = data.shift || "";
      this.stateFormData.startDate = data.startDate || "";
      this.stateFormData.endDate = data.endDate || "";
    },
    async deleteData(item: ListItem, updateBy) {
      try {
        const body = {
          workOrder: item.workOrder,
          isDeleted: true
        }
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${DELETE_API_URL}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        console.log(error);
        this.stateErrors.push(error.response.data.result.message);
        // this.stateError = error as string;
        this.stateIsError = true;
      }
    },
    resetState() {
      this.stateFormData = {
        dailyScheduleId: 0,
        endDate: normalizeDate(new Date("12/31/9999")),
        startDate: normalizeDate(new Date()),
        isActive: true
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    }
  }
});
