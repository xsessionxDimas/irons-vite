import { CRUD_URL, UPDATE_API_URL } from "./urls";
import { LOOKUP_API_URL as LOOKUP_LOCATION_URL } from "../location-crack/urls";
import {
  LOOKUP_API_URL as LOOKUP_MODEL_URL
} from "../../equipment/characteristic-value/urls";
import { LOOKUP_PS_TYPE_API_URL } from "../../task/daily-schedule/urls";
import {
  LOOKUP_API_URL as LOOKUP_UOM_API_URL
} from "../../parameter/uom/urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/crack-assignment/task-crack/UpsertItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/crack-assignment/task-crack/ListItem";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import { Option } from "@/core/types/misc/Option";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";

const initialForm = {
  mdTaskCrackId: "0",
  equipmentModel: "",
  psType: "",
  taskNo: "",
  taskCrackCode: "",
  locationId: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
}

export const useTaskCrackFormStore = defineStore({
  id: "TaskCrackForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateEquipmentModelOption: [] as Option[],
      statePsTypeOption: [] as Option[],
      stateTaskNoOption: [] as Option[],
      stateTaskCrackCodeOption: [] as Option[],
      stateLocationIdOption: [] as Option[],
      stateUomOption: [] as Option[]
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
    EquipmentModelOption: (state) => {
      return state.stateEquipmentModelOption
    },
    PsTypeOption: (state) => {
      return state.statePsTypeOption
    },
    TaskNoOption: (state) => {
      return state.stateTaskNoOption
    },
    TaskCrackCodeOption: (state) => {
      return state.stateTaskCrackCodeOption
    },
    LocationIdOption: (state) => {
      return state.stateLocationIdOption
    },
    UomOption: (state) => {
      return state.stateUomOption
    }
  },
  actions: {
    async insertData(createBy: string) {
      this.stateFormData.startDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate)))
      this.stateFormData.endDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate)))
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${CRUD_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        // this.stateError = error.response.data.result.message as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async updateData(updateBy: string) {
      this.stateFormData.startDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate)))
      this.stateFormData.endDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate)))
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        // this.stateError = error as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async getLocationLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_LOCATION_URL}?${new URLSearchParams(params).toString()}`);
        this.stateLocationIdOption = mapOptionFromLookupApi(response.data.result.content, "locationId", "locationDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getModelLookup() {
      const params = {
        ver: "v1",
        isEquipmentModel: "true"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_MODEL_URL}?${new URLSearchParams(params).toString()}`);
        this.stateEquipmentModelOption = mapOptionFromLookupApi(response.data.result.content, "characteristicValue", "characteristicValueDescription")
      } catch (error) {
        console.log(error);
      }
    },
    async getPSTypeLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_PS_TYPE_API_URL}?${new URLSearchParams(params).toString()}`);
        this.statePsTypeOption = mapOption(response.data.result.content.psType)
      } catch (error) {
        console.log(error);
      }
    },
    async getUomLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_UOM_API_URL}?${new URLSearchParams(params).toString()}`);
        this.stateUomOption = mapOption(response.data.result.content.uom)
      } catch (error) {
        console.log(error);
      }
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    resetState() {
      this.stateFormData = {
        ...initialForm
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    },
    setFormData(data: ListItem) {
      this.stateFormData.mdTaskCrackId = data.mdTaskCrackId || "0"
      this.stateFormData.equipmentModel = data.equipmentModel || ""
      this.stateFormData.psType = data.psType || ""
      this.stateFormData.taskNo = data.taskId || ""
      this.stateFormData.taskCrackCode = data.taskCrackCode || ""
      this.stateFormData.locationId = data.locationId || ""
      this.stateFormData.uom = data.uom || ""
      this.stateFormData.startDate = data.startDate || "";
      this.stateFormData.endDate = data.endDate || "";
    },
  }
});
