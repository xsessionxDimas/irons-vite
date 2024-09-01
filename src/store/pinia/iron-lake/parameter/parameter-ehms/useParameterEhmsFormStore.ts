import { CRUD_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/parameter/parameter-ehms/UpsertItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/parameter-ehms/ListItem";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";

export const useParameterEhmsFormStore = defineStore({
  id: "ParameterEhmsForm",
  state: () => {
    return {
      stateFormData: {
        ParameterEhmsId: 0,
        StartDate: normalizeDate(new Date()),
        EndDate: normalizeDate(new Date("12/31/9999"))
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
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
  },
  actions: {
    async insertData(createBy: string) {
      this.stateFormData.StartDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.StartDate)))
      this.stateFormData.EndDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.EndDate)))
      try {
        this.stateLoading = true;
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const payload = {
          ...this.stateFormData,
          ...{
            Parameter: String(this.stateFormData.Parameter)
          }
        }
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${CRUD_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig)
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
      this.stateFormData.StartDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.StartDate)))
      this.stateFormData.EndDate = formatDateForPostData(normalizeDate(new Date(this.stateFormData.EndDate)))
      try {
        this.stateLoading = true;
        const params = {
          userAccount: updateBy,
          ver: "v1"
        };
        const payload = {
          ...this.stateFormData,
          ...{
            Parameter: String(this.stateFormData.Parameter)
          }
        }
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig)
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
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    resetState() {
      this.stateFormData = {
        ParameterEhmsId: 0,
        StartDate: normalizeDate(new Date()),
        EndDate: normalizeDate(new Date("12/31/9999"))
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    },
    changeNulltoEmptyString(value) {
      return value || ""
    },
    setFormData(data: ListItem, TypeParameterOptions = []) {
      this.stateFormData.ParameterEhmsId = data.mdParameterEhmsId;
      this.stateFormData.CbmParameterId = this.changeNulltoEmptyString(data.cbmParameterId);
      this.stateFormData.ComponentId = data.componentId || "";
      if (TypeParameterOptions.length > 0 && data.typeParameterId) {
        const findObject = TypeParameterOptions.find((val) => {
          const label: string = val["label"] || ""
          return (label.split("|")[1] && label.split("|")[1].trim() == data.typeParameterId) || ""
        })
        this.stateFormData.TypeParameterId = this.changeNulltoEmptyString(findObject && findObject["value"])
      } else {
        this.stateFormData.TypeParameterId = ""
      }
      this.stateFormData.CbmGroup = this.changeNulltoEmptyString(data.cbmGroup);
      this.stateFormData.CbmArea = this.changeNulltoEmptyString(data.cbmArea);
      this.stateFormData.Model = this.changeNulltoEmptyString(data.modelId);
      this.stateFormData.PsType = this.changeNulltoEmptyString(data.psTypeId);
      this.stateFormData.TaskNumber = this.changeNulltoEmptyString(data.taskNumber);
      this.stateFormData.DetailNumber = this.changeNulltoEmptyString(data.detailNumber);
      this.stateFormData.CbmParameter = this.changeNulltoEmptyString(data.cbmParameter);
      this.stateFormData.Parameter = this.changeNulltoEmptyString(data.parameter);
      this.stateFormData.ValueMin = this.changeNulltoEmptyString(data.minValue);
      this.stateFormData.ValueMax = this.changeNulltoEmptyString(data.maxValue);
      this.stateFormData.Uom = this.changeNulltoEmptyString(data.uom);
      this.stateFormData.StatusConverter = this.changeNulltoEmptyString(data.statusConverter);
      this.stateFormData.StatusConverterDescription = this.changeNulltoEmptyString(data.statusDescriptionConverter);
      this.stateFormData.Status = this.changeNulltoEmptyString(data.status);
      this.stateFormData.StatusDescription = this.changeNulltoEmptyString(data.statusDescription);
      this.stateFormData.StartDate = this.changeNulltoEmptyString(data.validFrom);
      this.stateFormData.EndDate = this.changeNulltoEmptyString(data.validTo);
      this.stateFormData.IsActive = data.isActive || false;
    },
  }
});
