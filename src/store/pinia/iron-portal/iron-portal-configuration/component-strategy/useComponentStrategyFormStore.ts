import { INSERT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-strategy/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-strategy/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  mapOptionFromLookupApi,
  mapOptionWithFourLabelFromLookupApi,
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";
// Look ups
import {
  LOOKUP_TRANSACTION_API_URL as EQP_MODEL_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-model/urls";
import {
  LookupItem as EqpModelLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import {
  LOOKUP_API_URL as COMPONENT_ASSIGNMENT_LOOKUP_TRANSACTION_API_URL
} from "@/store/pinia/iron-lake/equipment/component-assignment/urls";
import {
  LookupItem as ComponentAssignmentLookupItem
} from "@/core/types/entities/iron-lake/equipment/component-assignment/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  componentStrategyId: 0,
  componentCode: "",
  equipmentModel: "",
  modifierCode: "",
  taskType: "",
  strategyTaskDesc: "",
  oemInterval: "",
  percentageOfOem: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useComponentStrategyFormStore = defineStore({
  id: "componentStrategyForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateComponentCodeOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
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
    componentCodeOption: (state) => {
      return state.stateComponentCodeOption;
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
  },
  actions: {
    async getLookupEquipmentModel() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<EqpModelLookupItem>> = await ApiService.get(EQP_MODEL_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentModelOption = mapOptionFromLookupApi(response.data.result.content, "equipmentModel", "equipmentModelDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupComponentCode() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<ComponentAssignmentLookupItem>> = await ApiService.get(COMPONENT_ASSIGNMENT_LOOKUP_TRANSACTION_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentCodeOption = mapOptionWithFourLabelFromLookupApi(response.data.result.content, "component", "componentType", "equipment", "objectType");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
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
          componentStrategyId: 0,
          componentCode: this.stateFormData.componentCode,
          equipmentModel: this.stateFormData.equipmentModel,
          modifierCode: this.stateFormData.modifierCode,
          taskType: this.stateFormData.taskType,
          strategyTaskDesc: this.stateFormData.strategyTaskDesc,
          oemInterval: this.stateFormData.oemInterval,
          percentageOfOem: this.stateFormData.percentageOfOem,
          startDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.startDate))),
          endDate: formatDateForPostData(normalizeDate(new Date(this.stateFormData.endDate))),
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${INSERT_API_URL}?${new URLSearchParams(params).toString()}`, formData as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateError = "";
          this.stateIsError = false;
        }
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        this.stateError = error as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
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
          componentStrategyId: this.stateFormData.componentStrategyId,
          componentCode: this.stateFormData.componentCode,
          equipmentModel: this.stateFormData.equipmentModel,
          modifierCode: this.stateFormData.modifierCode,
          taskType: this.stateFormData.taskType,
          strategyTaskDesc: this.stateFormData.strategyTaskDesc,
          oemInterval: this.stateFormData.oemInterval,
          percentageOfOem: this.stateFormData.percentageOfOem,
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
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        this.stateError = error as string;
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
      this.stateLoading = false;
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormData(data: ListItem) {
      this.stateFormData.componentStrategyId = data.ComponentStrategyId;
      this.stateFormData.componentCode = data.ComponentCode;
      this.stateFormData.equipmentModel = data.EquipmentModel;
      this.stateFormData.modifierCode = data.ModifierCode;
      this.stateFormData.taskType = data.TaskType;
      this.stateFormData.strategyTaskDesc = data.StrategyTaskDesc;
      this.stateFormData.oemInterval = data.OemInterval;
      this.stateFormData.percentageOfOem = data.PercentageOfOem;
      this.stateFormData.startDate = data.StartDate;
      this.stateFormData.endDate = data.EndDate;
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
