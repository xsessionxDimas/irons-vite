import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import {
  LOOKUP_API_URL as LOCATION_CRACK_LOOKUP_API_URL
} from "../location-crack/urls";
import {
  LOOKUP_API_URL as TASK_CRACK_LOOKUP_API_URL
} from "../task-crack/urls";
import {
  LOOKUP_PS_TYPE_API_URL
} from "../../task/daily-schedule/urls";
import {
  LOOKUP_API_URL as EQUIPMENT_MODEL_LOOKUP_API_URL
} from "../../equipment/equipment-model/urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/crack-assignment/assignment-location-crack/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/crack-assignment/assignment-location-crack/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  mapOption,
  mapOptionFromLookupApi
} from "@/core/helpers/mapOption";

const initialForm = {
  assignmentLocationCrackId: 0,
  model: "",
  psType: "",
  taskNumberDetailParent: "",
  locationIdParent: "",
  taskNumberDetailChild: "",
  locationIdChild: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999"))
};

export const useAssignmentLocationCrackFormStore = defineStore({
  id: "assignmentLocationCrackForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      // Form Options
      stateModelFormOption: [] as any[],
      stateLocationCrackFormOption: [] as any[],
      stateTaskCrackFormOption: [] as any[],
      statePsTypeFormOption: [] as any[], // get look up Maintenance Strategy
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
    modelFormOption: (state) => {
      return state.stateModelFormOption;
    },
    locationFormOption: (state) => {
      return state.stateLocationCrackFormOption;
    },
    taskFormOption: (state) => {
      return state.stateTaskCrackFormOption;
    },
    psTypeFormOption: (state) => {
      return state.statePsTypeFormOption;
    },
  },
  actions: {
    async getLocationCrackLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOCATION_CRACK_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateLocationCrackFormOption = mapOptionFromLookupApi(response.data.result.content, "locationId", "locationDescription");
      } catch (error) {
        console.log(error)
      }
    },
    async getTaskCrackLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(TASK_CRACK_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateTaskCrackFormOption = mapOptionFromLookupApi(response.data.result.content, "taskNumberDetail", "task");
      } catch (error) {
        console.log(error)
      }
    },
    async getPsTypeLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOOKUP_PS_TYPE_API_URL, "", new URLSearchParams(params).toString());
        this.statePsTypeFormOption = mapOption(response.data.result.content.psType);
      } catch (error) {
        console.log(error)
      }
    },
    async getModelCrackLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(EQUIPMENT_MODEL_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateModelFormOption = mapOptionFromLookupApi(response.data.result.content, "equipmentModel", "equipmentModelDescription");
      } catch (error) {
        console.log(error)
      }
    },
    async insertData(createBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const formData = {
          assignmentLocationCrackId: this.stateFormData.assignmentLocationCrackId,
          model: this.stateFormData.model,
          psType: this.stateFormData.psType,
          taskNumberDetailParent: this.stateFormData.taskNumberDetailParent,
          locationIdParent: this.stateFormData.locationIdParent,
          taskNumberDetailChild: this.stateFormData.taskNumberDetailChild,
          locationIdChild: this.stateFormData.locationIdChild,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate))),
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${CRUD_API_URL}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        this.stateError = error as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async updateData(updateBy: string) {
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const formData = {
          assignmentLocationCrackId: this.stateFormData.assignmentLocationCrackId,
          model: this.stateFormData.model,
          psType: this.stateFormData.psType,
          taskNumberDetailParent: this.stateFormData.taskNumberDetailParent,
          locationIdParent: this.stateFormData.locationIdParent,
          taskNumberDetailChild: this.stateFormData.taskNumberDetailChild,
          locationIdChild: this.stateFormData.locationIdChild,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate))),
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        this.stateError = error as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: ListItem) {
      this.stateFormData.assignmentLocationCrackId = data.assignmentLocationCrackId || 0;
      this.stateFormData.model = data.model || "";
      this.stateFormData.psType = data.psType || "";
      this.stateFormData.taskNumberDetailParent = data.taskNumberDetailParent || "";
      this.stateFormData.locationIdParent = data.locationIdParent || "";
      this.stateFormData.taskNumberDetailChild = data.taskNumberDetailChild || "";
      this.stateFormData.locationIdChild = data.locationIdChild || "";
      this.stateFormData.startDate = data.startDate || "";
      this.stateFormData.endDate = data.endDate || "";
    },
    resetState() {
      this.stateFormData = {
        ...initialForm
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    }
  }
});
