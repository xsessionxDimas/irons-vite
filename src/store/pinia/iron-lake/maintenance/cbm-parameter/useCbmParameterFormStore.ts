import ApiService from "@/core/services/ApiService";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { defineStore } from "pinia";
import {
  UpdateItem
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/UpdateItem";
import {
  BulkResponse
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/BulkResponse";
import {
  UpdateForm
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/UpdateForm";
import { IRONLAKE_CRUD_API_URL } from "./urls";
import {
  CbmParameter,
  ListItem
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/ListItem";
import {
  DraftItem
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/DraftItem";

export const useCbmParameterFormStore = defineStore({
  id: "cbmForm",
  state: () => {
    return {
      stateFormData: [] as UpdateItem[],
      stateFormEditData: {} as ListItem,
      stateFormDraftData: {} as DraftItem,
      stateFormCBMData: [] as CbmParameter[],
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateLoadingMessage: "",
    }
  },
  getters: {
    formData: (state) => {
      return state.stateFormData;
    },
    formDraftData: (state) => {
      return state.stateFormDraftData;
    },
    formEditData: (state) => {
      return state.stateFormEditData;
    },
    formCbmData: (state) => {
      return state.stateFormCBMData;
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
    async updateData() {
      try {
        this.stateLoading = true;
        const params = {
          ver: "v1"
        };
        const payload = this.stateFormData;
        const response: AxiosResponse<SingleApiResponse<BulkResponse>> = await ApiService.post(`${IRONLAKE_CRUD_API_URL}/upsert?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
        if (response.data.title !== "Error") {
          if (response.data.result.isError) {
            this.stateErrors.push(response.data.result.content?.cbmParameterList[0]?.validationReason);
            this.stateIsError = true;
          } else {
            this.stateError = "";
            this.stateIsError = false;
          }
        }
      } catch (error: any) {
        this.stateError = error.response.data.result.message as string;
        this.stateErrors.push(error && error.response.data.result.message)
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async deleteDraft(draftId: number) {
      try {
        this.stateLoading = true;
        const payload = [{
          cbmParameterDraftId: draftId,
        }];
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${IRONLAKE_CRUD_API_URL}/delete_draft?ver=v1`, payload as AxiosRequestConfig);
        if (response.data.title !== "Error") {
          if (response.data.result.isError) {
            this.stateErrors.push("Failed to delete draft");
            this.stateIsError = true;
          } else {
            this.stateError = "";
            this.stateIsError = false;
          }
        } else {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        }
      } catch (error: any) {
        this.stateErrors.push(error && error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false;
    },
    async updateDraft() {
      try {
        this.stateLoading = true
        const params = {
          ver: "v1"
        };
        const payload = [{
          cbmParameterDraftId: this.stateFormDraftData.cbmParameterDraftId,
          taskKey: this.stateFormDraftData.taskKey,
          model: this.stateFormDraftData.equipmentModel,
          serviceSize: this.stateFormDraftData.serviceSize,
          description: this.stateFormDraftData.taskDescription,
          uom: this.stateFormDraftData.uom,
          typeParameter: this.stateFormDraftData.typeParameter,
          status: this.stateFormDraftData.status,
          minValue: this.stateFormDraftData.minValue,
          maxValue: this.stateFormDraftData.maxValue,
          component: this.stateFormDraftData.component,
          cbmGroup: this.stateFormDraftData.cbmGroup,
          taskNo: this.stateFormDraftData.taskNo,
          taskNoDetail: this.stateFormDraftData.taskNoDetail,
          rating: this.stateFormDraftData.rating,
          isActive: true,
        }]
        const response: AxiosResponse<SingleApiResponse<BulkResponse>> = await ApiService.post(`${IRONLAKE_CRUD_API_URL}/upsert?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig);
        if (response.data.title !== "Error") {
          if (response.data.result.isError) {
            this.stateErrors.push(response.data.result.content?.cbmParameterList[0]?.validationReason);
            this.stateIsError = true;
          } else {
            this.stateError = "";
            this.stateIsError = false;
          }
        }
      } catch (error: any) {
        this.stateErrors.push(error && error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoading = false
    },
    // setters
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setFormDraftData(data: DraftItem) {
      this.stateFormDraftData = data
    },
    setFormEditData(data: ListItem) {
      this.stateFormEditData = {
        taskKey: data.taskKey || "",
        equipmentModel: data.equipmentModel || "",
        serviceSize: data.serviceSize || "",
        component: data.component || "",
        typeParameter: data.typeParameter || "",
        cbmGroup: data.cbmGroup || "",
        rating: data.rating || "",
        taskDescription: data.taskDescription || "",
        isActive: data.isActive || false,
        taskNo: data.taskNo || "",
        taskNoDetail: data.taskNoDetail || "",
        modifiedBy: data.modifiedBy || "",
        modifiedOn: data.modifiedOn || "",
        cbmParameter: data.cbmParameter || [],
      }
    },
    setPayload(formData: ListItem) {
      this.stateFormData = [] as UpdateItem[];
      this.formCbmData.forEach((el) => {
        this.stateFormData.push({
          taskKey: formData.taskKey,
          model: formData.equipmentModel,
          serviceSize: formData.serviceSize,
          description: formData.taskDescription,
          typeParameter: formData.rating.toLocaleLowerCase().includes('automatic') ? formData.typeParameter : formData.rating.toLocaleLowerCase().includes('calibration') ? formData.typeParameter : '',
          rating: formData.rating,
          component: formData.component,
          cbmGroup: formData.cbmGroup,
          uom: el.uom,
          cbmParameterId: el.cbmParameterId,
          status: el.status,
          minValue: el.minValue,
          maxValue: el.maxValue,
          taskNo: formData.taskNo,
          taskNoDetail: formData.taskNoDetail,
          isActive: true,
        } as UpdateItem)
      })
    },
    setFormCbmData(cbmData: CbmParameter[]) {
      this.stateFormCBMData = [] as CbmParameter[];
      cbmData.forEach((el) => {
        this.stateFormCBMData.push({
          cbmParameterId: el.cbmParameterId,
          uom: el.uom,
          minValue: el.minValue,
          maxValue: el.maxValue,
          status: el.status,
        } as CbmParameter)
      });
    },
    resetFormData() {
      this.stateFormEditData = {} as ListItem
    },
  }
});
