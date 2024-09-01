import {
  CRUD_API_URL,
  MAINTENANCE_PLANT_LOOKUP_API_URL,
  CUSTOMER_LOOKUP_API_URL,
  UPDATE_API_URL,
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/business-partner/customer-assignment/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/business-partner/customer-assignment/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { Option } from "@/core/types/misc/Option";
import {
  CustomerAssignmentMaintenancePlantLookup,
  CustomerAssignmentCustomerLookup
} from "@/core/types/entities/iron-lake/business-partner/customer-assignment/LookupItem";
import { camelCase } from "lodash";

export const useCustomerAssignmentFormStore = defineStore({
  id: "customerAssignmentForm",
  state: () => {
    return {
      stateFormData: {
        CustomerAssignmentId: 0,
        IsActive: true
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateMaintenancePlantOption: [] as Option[],
      stateMaintenancePlantDescOption: [] as Option[],
      stateCustomerOption: [] as Option[],
      stateCustomerWithDescOption: [] as Option[],
      stateMaintenancePlantWithDescOption: [] as Option[],
      maintenancePlantLookupArr: [] as CustomerAssignmentMaintenancePlantLookup[],
      customerLookupArr: [] as CustomerAssignmentCustomerLookup[]
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
    maintenancePlantOption: (state) => {
      return state.stateMaintenancePlantOption;
    },
    maintenancePlantDescOption: (state) => {
      return state.stateMaintenancePlantDescOption;
    },
    customerOption: (state) => {
      return state.stateCustomerOption
    },
    customerWithDescOption: (state) => {
      return state.stateCustomerWithDescOption
    },
    maintenancePlantWithDescOption: (state) => {
      return state.stateMaintenancePlantWithDescOption;
    },
  },
  actions: {
    async insertData(createBy: string) {
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
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${UPDATE_API_URL}?${new URLSearchParams(params).toString()}`, this.stateFormData as AxiosRequestConfig)
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
      this.stateFormData.CustomerAssignmentId = data.customerAssignmentId || 0;
      this.stateFormData.MaintenancePlant = data.maintenancePlant || "";
      this.stateFormData.MaintenancePlantDescription = data.maintenancePlantDescription || "";
      this.stateFormData.Customer = data.customer || "";
      this.stateFormData.IsActive = data.isActive || false;
    },
    resetState() {
      this.stateFormData = {
        CustomerAssignmentId: 0,
        IsActive: true
      } as UpsertItem;
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateLoading = false;
    },
    async getMaintenancePlantLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<CustomerAssignmentMaintenancePlantLookup[]>> = await ApiService.get(MAINTENANCE_PLANT_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.maintenancePlantLookupArr = response.data.result.content
        this.stateMaintenancePlantOption = response.data.result.content.map((s) => {
          return {
            label: s.maintenancePlant,
            value: s.maintenancePlant
          }
        });
        this.stateMaintenancePlantDescOption = response.data.result.content.map((d) => {
          return {
            label: d.maintenancePlantDescription,
            value: d.maintenancePlantDescription
          }
        });
        this.stateMaintenancePlantWithDescOption = response.data.result.content.map((s) => {
          return {
            label: `${s.maintenancePlant} | ${s.maintenancePlantDescription}`,
            value: `${s.maintenancePlant}`
          }
        });
      } catch (error) {
        console.log(error)
      }
    },
    async getCustomerLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<CustomerAssignmentCustomerLookup[]>> = await ApiService.get(CUSTOMER_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.customerLookupArr = response.data.result.content
        this.stateCustomerOption = response.data.result.content.map((s) => {
          return {
            label: s.customer,
            value: s.customer
          }
        });
        this.stateCustomerWithDescOption = response.data.result.content.map((s) => {
          return {
            value: `${s.customer}`,
            label: `${s.customer} | ${s.customerDescription}`
          }
        });
      } catch (error) {
        console.log(error)
      }
    },
    syncMaintenancePlantAndDescriptionAnswer(key) {
      const val = this.stateFormData[key]
      const maintenancePlant = this.maintenancePlantLookupArr.find((el) => {
        return el[camelCase(key)] == val
      }) as CustomerAssignmentMaintenancePlantLookup
      this.stateFormData.MaintenancePlant = maintenancePlant.maintenancePlant
      this.stateFormData.MaintenancePlantDescription = maintenancePlant.maintenancePlantDescription
    }
  }
});
