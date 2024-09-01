import { CRUD_API_URL, UPDATE_API_URL } from "./urls";
import {
  LOOKUP_API_URL as LOOKUP_COMPONENT_LUBRI_API_URL
} from "../component-lubricant/urls";
import {
  LOOKUP_PS_TYPE_API_URL
} from "../../task/daily-schedule/urls";
import {
  LOOKUP_API_URL as LOOKUP_EQUIPMENT_MODEL_API_URL
} from "../../equipment/characteristic-value/urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/parameter/assignment-component-lubricant/UpsertItem";
import {
  LookupItem as LookupItemLubricant
} from "@/core/types/entities/iron-lake/parameter/component-lubricant/LookupItem";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/assignment-component-lubricant/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";

const initialForm = {
  mdAssignmentComponentLubricantId: 0,
  equipmentModel: "",
  psType: "",
  component: "",
  taskNo: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999"))
};

export const useAssignmentComponentLubricantFormStore = defineStore({
  id: "AssignmentcomponentLubricantForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateComponentOption: [] as any[],
      stateComponentDetailOption: {} as LookupItemLubricant,
      stateEquipmentModelOption: [] as any[],
      statePsTypeOption: [] as any[],
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
    componentOption: (state) => {
      return state.stateComponentOption
    },
    psTypeOption: (state) => {
      return state.statePsTypeOption
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption
    }
  },
  actions: {
    async getComponentLubriLookUp() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItemLubricant>> = await ApiService.get(LOOKUP_COMPONENT_LUBRI_API_URL, "", new URLSearchParams(params).toString());
        if (response.data.result.content) {
          this.stateComponentOption = mapOptionFromLookupApi(response.data.result.content, "component", [
            "recommendedLubricant",
            "value",
            "uom"
          ])
          this.stateComponentDetailOption = response.data.result.content
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getPsTypeLookUp() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOOKUP_PS_TYPE_API_URL, "", new URLSearchParams(params).toString());
        this.statePsTypeOption = mapOption(response.data.result.content.psType)
      } catch (error) {
        console.log(error)
      }
    },
    async getEquipmentModelLookUp() {
      const params = {
        ver: "v1",
        isEquipmentModel: "true"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOOKUP_EQUIPMENT_MODEL_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentModelOption = mapOptionFromLookupApi(response.data.result.content, "characteristicValue", "characteristicValueDescription")
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
        const componentSelected: any = {}
        this.stateComponentDetailOption.component.forEach((_val, idx) => {
          if (this.stateComponentDetailOption.component[idx] == this.stateFormData.component) {
            componentSelected["recommendedLubricant"] = this.stateComponentDetailOption.recommendedLubricant[idx]
            componentSelected["value"] = this.stateComponentDetailOption.value[idx]
            componentSelected["uom"] = this.stateComponentDetailOption.uom[idx]
          }
        })

        const formData = {
          mdAssignmentComponentLubricant: 0,
          equipmentModel: this.stateFormData.equipmentModel,
          psType: this.stateFormData.psType,
          component: this.stateFormData.component,
          recomendedLubricant: componentSelected.recommendedLubricant,
          value: componentSelected.value,
          uom: componentSelected.uom,
          taskNo: this.stateFormData.taskNo,
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
        const componentSelected: any = {}
        this.stateComponentDetailOption.component.forEach((_val, idx) => {
          if (this.stateComponentDetailOption.component[idx] == this.stateFormData.component) {
            componentSelected["recommendedLubricant"] = this.stateComponentDetailOption.recommendedLubricant[idx]
            componentSelected["value"] = this.stateComponentDetailOption.value[idx]
            componentSelected["uom"] = this.stateComponentDetailOption.uom[idx]
          }
        })
        const formData = {
          mdAssignmentComponentLubricant: this.stateFormData.mdAssignmentComponentLubricantId,
          equipmentModel: this.stateFormData.equipmentModel,
          psType: this.stateFormData.psType,
          component: this.stateFormData.component,
          recomendedLubricant: componentSelected.recommendedLubricant,
          value: componentSelected.value,
          uom: componentSelected.uom,
          taskNo: this.stateFormData.taskNo,
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
      this.stateFormData.mdAssignmentComponentLubricantId = data.mdAssignmentComponentLubricantId || 0;
      this.stateFormData.equipmentModel = data.equipmentModel || "";
      this.stateFormData.psType = data.psType || "";
      this.stateFormData.taskNo = data.taskNo || "";
      this.stateFormData.startDate = data.startDate || "";
      this.stateFormData.endDate = data.endDate || "";
      this.stateComponentDetailOption.component.forEach((val, idx) => {
        if (this.stateComponentDetailOption.component[idx] == data.component && this.stateComponentDetailOption.recommendedLubricant[idx] == data.recomendedLubricant && this.stateComponentDetailOption.value[idx] == data.value && this.stateComponentDetailOption.uom[idx] == data.uom) {
          this.stateFormData.component = val
        }
      })
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
