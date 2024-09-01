import { INSERT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-mapping/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-mapping/ListItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  formatDateForPostData,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  mapOption,
  mapOptionFromLookupApi,
  mapOptionWithThreeLabelFromLookupApi
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";
// Look ups
import {
  LOOKUP_TRANSACTION_API_URL as OBJECT_TYPE_LOOKUP_TRANSACTION_API_URL
} from "@/store/pinia/iron-lake/equipment/object-type/urls";
import {
  LookupItem as ObjectTypeLookupItem
} from "@/core/types/entities/iron-lake/equipment/object-type/LookupItem";
import {
  LOOKUP_TRANSACTION_API_URL as EQUIPMENT_MODEL_LOOKUP_TRANSACTION_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-model/urls";
import {
  LookupItem as EquipmentModelLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import {
  LOOKUP_TRANSACTION_API_URL as CBM_GROUP_LOOKUP_TRANSACTION_API_URL
} from "@/store/pinia/iron-lake/parameter/cbm-group/urls";
import {
  LookupItem as CbmGroupLookupItem
} from "@/core/types/entities/iron-lake/parameter/cbm-group/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  cbmMappingId: 0,
  equipmentModel: "",
  objectType: "",
  cbmGroup: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useCbmMappingFormStore = defineStore({
  id: "cbmMappingForm",
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
      stateObjectTypeOption: [] as Option[],
      stateCbmGroupOption: [] as Option[],
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
    equipmentModelOption: (state) => {
      return state.stateEquipmentModelOption;
    },
    objectTypeOption: (state) => {
      return state.stateObjectTypeOption;
    },
    cbmGroupOption: (state) => {
      return state.stateCbmGroupOption;
    },
  },
  actions: {
    async getLookupObjectType() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<ObjectTypeLookupItem>> = await ApiService.get(OBJECT_TYPE_LOOKUP_TRANSACTION_API_URL, "", new URLSearchParams(params).toString());
        this.stateObjectTypeOption = mapOptionFromLookupApi(response.data.result.content, "objectType", "objectTypeDescription");
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error)
      }
    },
    async getLookupEquipmentModel() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<EquipmentModelLookupItem>> = await ApiService.get(EQUIPMENT_MODEL_LOOKUP_TRANSACTION_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentModelOption = mapOptionFromLookupApi(response.data.result.content, "equipmentModel", "equipmentModelDescription");
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error)
      }
    },
    async getLookupCbmGroup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<CbmGroupLookupItem>> = await ApiService.get(CBM_GROUP_LOOKUP_TRANSACTION_API_URL, "", new URLSearchParams(params).toString());
        this.stateCbmGroupOption = mapOption(response.data.result.content.cbmGroup);
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
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
          cbmMappingId: this.stateFormData.cbmMappingId,
          equipmentModel: this.stateFormData.equipmentModel,
          objectType: this.stateFormData.objectType,
          cbmGroup: this.stateFormData.cbmGroup,
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
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
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
          cbmMappingId: this.stateFormData.cbmMappingId,
          equipmentModel: this.stateFormData.equipmentModel,
          objectType: this.stateFormData.objectType,
          cbmGroup: this.stateFormData.cbmGroup,
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
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
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
      this.stateFormData.cbmMappingId = data.CbmMappingId;
      this.stateFormData.equipmentModel = data.EquipmentModel;
      this.stateFormData.objectType = data.ObjectType;
      this.stateFormData.cbmGroup = data.CbmGroup;
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
