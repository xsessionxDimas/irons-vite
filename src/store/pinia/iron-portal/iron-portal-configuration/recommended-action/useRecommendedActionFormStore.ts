/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  INSERT_API_URL,
  UPDATE_API_URL,
  LOOKUP_INTERVENTION_CODE,
  TYPE_TASK_LOOK_UP,
  TASK_GROUP_KEY_AND_TASK_GROUP,
  LOOKUP_UOM_TRANSACTION,
  LOOKUP_PS_TYPE,
  LOOKUP_REF_DOC_TRANSACTION
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/recommended-action/UpsertItem";
import {
  LookupReferenceDocument,
  LookupSampleStatus,
  LookupTypeTask,
  LookupUom
} from "@/core/types/entities/iron-portal/iron-portal-configuration/recommended-action/LookupItem";
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
  mapOptionWithThreeLabelFromLookupApi,
  mapOption
} from "@/core/helpers/mapOption";
import {
  LOOKUP_TRANSACTION_API_URL as EQUIPMENT_MODEL_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-model/urls";
import {
  LookupItem as EquipmentModelLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import { Option } from "@/core/types/misc/Option";
import {
  LOOKUP_TRANSACTION_API_URL as COMPONENT_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/component/urls";
import {
  LOOKUP_TRANS_API_URL as RATING_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/rating/urls";
import {
  LookupItem as ComponentLookupItem
} from "@/core/types/entities/iron-lake/equipment/component/LookupItem";
import {
  LOOKUP_TRANSACTION_API_URL as CBM_TYPE_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/type/urls";
import {
  LookupItem as CbmTypeLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/type/LookupItem";
import {
  LOOKUP_TRANSACTION_API_URL as PARAMETER_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-threshold/urls";
import {
  LookupItem as ParameterLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-threshold/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";


const initialForm = {
  recommendedActionId: 0,
  cbmType: "",
  equipmentModel: "",
  component: "",
  parameterTo: "",
  interventionCode: "",
  recAction: "",
  sampleStatus: "",
  sampleStatusId: "",
  sequence: "",
  subTask: "",
  isAutoFill: true,
  isUom: true,
  uom: "",
  referenceDocument: "",
  psType: "",
  taskGroupKey: "",
  taskKey: "",
  typeTask: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useRecommendedActionFormStore = defineStore({
  id: "recommendedActionForm",
  state: () => {
    return {
      stateFormData: {
        ...initialForm
      } as UpsertItem,
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateInterventionCodeOption: [] as Option[],
      stateEquipmentModelOption: [] as Option[],
      stateComponentOption: [] as Option[],
      stateInterventionReasonOption: [] as Option[],
      stateSampleStatusOption: [] as Option[],
      stateTypeTaskOption: [] as Option[],
      stateCbmTypeOption: [] as Option[],
      statePsTypeOption: [] as Option[],
      stateTaskGroupKeyOption: [] as Option[],
      stateTaskKeyOption: [] as Option[],
      stateParameterToOption: [] as Option[],
      stateUomOption: [] as Option[],
      stateReferenceDocumentOption: [] as Option[],
      stateIsEdit: false,
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
    interventionCodeOption: (state) => {
      return state.stateInterventionCodeOption;
    },
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    interventionReasonOption: (state) => {
      return state.stateInterventionReasonOption;
    },
    sampleStatusOption: (state) => {
      return state.stateSampleStatusOption;
    },
    typeTaskOption: (state) => {
      return state.stateTypeTaskOption;
    },
    cbmTypeOption: (state) => {
      return state.stateCbmTypeOption;
    },
    psTypeOption: (state) => {
      return state.statePsTypeOption;
    },
    taskGroupKeyOption: (state) => {
      return state.stateTaskGroupKeyOption;
    },
    taskKeyOption: (state) => {
      return state.stateTaskKeyOption;
    },
    parameterToOption: (state) => {
      return state.stateParameterToOption;
    },
    uomOption: (state) => {
      return state.stateUomOption;
    },
    referenceDocumentOption: (state) => {
      return state.stateReferenceDocumentOption;
    },
    isEdit: (state) => {
      return state.stateIsEdit;
    }
  },
  actions: {
    setIsEdit(state: boolean) {
      this.stateIsEdit = state
    },
    async getLookup() {
      const params = {
        ver: "v1"
      };
      try {
        const responseEquipmentModelLookup: AxiosResponse<SingleApiResponse<EquipmentModelLookupItem>> = await ApiService.get(EQUIPMENT_MODEL_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseComponentOption: AxiosResponse<SingleApiResponse<ComponentLookupItem>> = await ApiService.get(COMPONENT_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseSampleStatus: AxiosResponse<SingleApiResponse<LookupSampleStatus>> = await ApiService.get(RATING_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responseTypeTask: AxiosResponse<SingleApiResponse<LookupTypeTask>> = await ApiService.get(TYPE_TASK_LOOK_UP, "", new URLSearchParams(params).toString());
        const responseCbmTypeLookup: AxiosResponse<SingleApiResponse<CbmTypeLookupItem>> = await ApiService.get(CBM_TYPE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        const responsePsTypeLookup: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOOKUP_PS_TYPE, "", new URLSearchParams(params).toString());
        const responseUomLookup: AxiosResponse<SingleApiResponse<LookupUom>> = await ApiService.get(LOOKUP_UOM_TRANSACTION, "", new URLSearchParams(params).toString());
        const responseRefDocLookup: AxiosResponse<SingleApiResponse<LookupReferenceDocument>> = await ApiService.get(LOOKUP_REF_DOC_TRANSACTION, "", new URLSearchParams(params).toString());

        this.stateComponentOption = mapOptionFromLookupApi(responseComponentOption.data.result.content, "component", "componentDescription");
        this.stateEquipmentModelOption = mapOptionWithThreeLabelFromLookupApi(responseEquipmentModelLookup.data.result.content, "equipmentModel", "brand", "equipmentModelDescription");
        this.stateSampleStatusOption = mapOptionFromLookupApi(responseSampleStatus.data.result.content, "rating", "ratingDescription");
        this.stateTypeTaskOption = mapOption(responseTypeTask.data.result.content.typeTask);
        this.stateCbmTypeOption = mapOption(responseCbmTypeLookup.data.result.content.type);
        this.statePsTypeOption = mapOption(responsePsTypeLookup.data.result.content.budgetLife);
        this.stateUomOption = mapOption(responseUomLookup.data.result.content.uom);
        this.stateReferenceDocumentOption = mapOption(responseRefDocLookup.data.result.content.referenceDocument);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupParameterTo(cbmType: string) {
      const params = {
        cbmType: cbmType,
        ver: "v1"
      };
      try {
        const responseParameterLookup: AxiosResponse<SingleApiResponse<ParameterLookupItem>> = await ApiService.get(PARAMETER_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateParameterToOption = mapOption(responseParameterLookup.data.result.content.parameterTo);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupInterventionCode(equipmentModel, component, parameterTo) {
      const params = {
        equipmentModel: equipmentModel,
        component: component,
        parameterTo: parameterTo,
        ver: "v1"
      };
      try {
        const responseInterventionCodeOption: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(LOOKUP_INTERVENTION_CODE, "", new URLSearchParams(params).toString());
        this.stateFormData.interventionCode = responseInterventionCodeOption.data.result.content.interventionCode;
        return {
          interventionCode: responseInterventionCodeOption.data.result.content.interventionCode
        }
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupTaskGroupAndKey(equipmentModel, component, parameterTo) {
      const params = {
        equipmentModel: equipmentModel,
        component: component,
        parameterTo: parameterTo,
        ver: "v1"
      };
      try {
        const responseTaskGroup: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(TASK_GROUP_KEY_AND_TASK_GROUP, "", new URLSearchParams(params).toString());
        this.stateTaskKeyOption = mapOption(responseTaskGroup.data.result.content.task_key);
        this.stateTaskGroupKeyOption = mapOption(responseTaskGroup.data.result.content.taskgroup_key);
        if (responseTaskGroup.data.result.content.taskgroup_key.length === 1) {
          this.stateFormData.taskGroupKey = responseTaskGroup.data.result.content.taskgroup_key[0];
        }
        if (responseTaskGroup.data.result.content.task_key.length === 1) {
          this.stateFormData.taskKey = responseTaskGroup.data.result.content.task_key[0];
        }
        return {
          taskGroupKey: responseTaskGroup.data.result.content.taskgroup_key,
          taskKey: responseTaskGroup.data.result.content.task_key
        }
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
          recommendedActionId: 0,
          interventionCode: this.stateFormData.interventionCode,
          equipmentModel: this.stateFormData.equipmentModel,
          component: this.stateFormData.component,
          recAction: this.stateFormData.recAction,
          sampleStatus: this.stateFormData.sampleStatus,
          sequence: this.stateFormData.sequence,
          subTask: this.stateFormData.subTask,
          isUom: this.stateFormData.isUom,
          isAutoFill: this.stateFormData.isAutoFill,
          typeTask: this.stateFormData.typeTask,
          cbmType: this.stateFormData.cbmType,
          psType: this.stateFormData.psType,
          taskGroupKey: this.stateFormData.taskGroupKey,
          taskKey: this.stateFormData.taskKey,
          parameterTo: this.stateFormData.parameterTo,
          uom: this.stateFormData.uom,
          referenceDocument: this.stateFormData.referenceDocument,
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
          recommendedActionId: this.stateFormData.recommendedActionId,
          interventionCode: this.stateFormData.interventionCode,
          equipmentModel: this.stateFormData.equipmentModel,
          component: this.stateFormData.component,
          recAction: this.stateFormData.recAction,
          sampleStatus: this.stateFormData.sampleStatus,
          sequence: this.stateFormData.sequence,
          subTask: this.stateFormData.subTask,
          isUom: this.stateFormData.isUom,
          isAutoFill: this.stateFormData.isAutoFill,
          typeTask: this.stateFormData.typeTask,
          psType: this.stateFormData.psType,
          taskGroupKey: this.stateFormData.taskGroupKey,
          taskKey: this.stateFormData.taskKey,
          uom: this.stateFormData.uom,
          referenceDocument: this.stateFormData.referenceDocument,
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
    setFormData(data: UpsertItem) {
      this.stateFormData.recommendedActionId = data.recommendedActionId;
      this.stateFormData.interventionCode = data.interventionCode;
      this.stateFormData.equipmentModel = data.equipmentModel;
      this.stateFormData.component = data.component;
      this.stateFormData.recAction = data.recAction;
      this.stateFormData.sampleStatus = data.sampleStatus;
      this.stateFormData.sequence = data.sequence;
      this.stateFormData.subTask = data.subTask;
      this.stateFormData.isUom = data.isUom;
      this.stateFormData.isAutoFill = data.isAutoFill;
      this.stateFormData.typeTask = data.typeTask;
      this.stateFormData.cbmType = data.cbmType,
      this.stateFormData.psType = data.psType,
      this.stateFormData.taskGroupKey = data.taskGroupKey,
      this.stateFormData.taskKey = data.taskKey,
      this.stateFormData.parameterTo = data.parameterTo,
      this.stateFormData.uom = data.uom,
      this.stateFormData.referenceDocument = data.referenceDocument,
      this.stateFormData.startDate = data.startDate;
      this.stateFormData.endDate = data.endDate;
    },
    setFormDataDuplicate(data: UpsertItem) {
      this.stateFormData.recommendedActionId = data.recommendedActionId;
      this.stateFormData.interventionCode = data.interventionCode;
      this.stateFormData.equipmentModel = data.equipmentModel;
      this.stateFormData.component = data.component;
      this.stateFormData.recAction = data.recAction;
      this.stateFormData.sampleStatus = data.sampleStatus;
      this.stateFormData.sequence = data.sequence;
      this.stateFormData.subTask = data.subTask;
      this.stateFormData.isUom = data.isUom;
      this.stateFormData.isAutoFill = data.isAutoFill;
      this.stateFormData.typeTask = data.typeTask;
      this.stateFormData.psType = data.psType,
      this.stateFormData.taskGroupKey = data.taskGroupKey,
      this.stateFormData.taskKey = data.taskKey,
      this.stateFormData.uom = data.uom,
      this.stateFormData.referenceDocument = data.referenceDocument,
      this.stateFormData.startDate = data.startDate;
      this.stateFormData.endDate = data.endDate;
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
