import { INSERT_API_URL, UPDATE_API_URL } from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/UpsertItem";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/ListItem";
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
} from "@/core/helpers/mapOption";
import { Option } from "@/core/types/misc/Option";
// Look ups
import {
  LOOKUP_TRANSACTION_API_URL as EQUIPMENT_MODEL_LOOKUP_TRANSACTION_API_URL
} from "@/store/pinia/iron-lake/equipment/equipment-model/urls";
import {
  LookupItem as EquipmentModelLookupItem
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import {
  LOOKUP_API_URL as SITE_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/business-partner/site/urls";
import {
  LookupItem as SiteLookupItem
} from "@/core/types/entities/iron-lake/business-partner/site/LookupItem";
import {
  LOOKUP_API_URL as CODE_GROUP_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/code-group/urls";
import {
  LookupItem as CodeGroupLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/code-group/LookupItem";
import {
  LOOKUP_TRANSACTION_API_URL as DAMAGE_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/damage/urls";
import {
  LookupItem as DamageLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/damage/LookupItem";
import {
  LOOKUP_TRANSACTION_API_URL as DAMAGE_CATEGORY_LOOKUP_API_URL
} from "@/store/pinia/iron-portal/iron-portal-configuration/damage-category/urls";
import {
  LookupItem as DamageCategoryLookupItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/damage-category/LookupItem";
import {
  LOOKUP_API_URL as COMPONENT_LOOKUP_API_URL
} from "@/store/pinia/iron-lake/equipment/component/urls";
import {
  LookupItem as ComponentLookupItem
} from "@/core/types/entities/iron-lake/equipment/component/LookupItem";
import { sendErrorEvent } from "@/core/helpers/analytics";

const initialForm = {
  excludeUnitByEquipmentId: 0,
  site: "",
  equipmentModel: "",
  objectType: "",
  codeGroup: "",
  damageCategory: "",
  damage: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
};

export const useEquipmentConfigInIronPortalFormStore = defineStore({
  id: "equipmentConfigInIronPortalForm",
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
      stateSiteOption: [] as Option[],
      stateCodeGroupOption: [] as Option[],
      stateDamageCategoryOption: [] as Option[],
      stateDamageOption: [] as Option[],
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
    siteOption: (state) => {
      return state.stateSiteOption
    },
    codeGroupOption: (state) => {
      return state.stateCodeGroupOption
    },
    damageCategoryOption: (state) => {
      return state.stateDamageCategoryOption
    },
    damageOption: (state) => {
      return state.stateDamageOption
    },
  },
  actions: {
    async getLookupObjectType() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<ComponentLookupItem>> = await ApiService.get(COMPONENT_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateObjectTypeOption = mapOptionFromLookupApi(response.data.result.content, "component", "componentDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
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
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupSite() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<SiteLookupItem>> = await ApiService.get(SITE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateSiteOption = mapOptionWithThreeLabelFromLookupApi(response.data.result.content, "siteId", "siteCode", "siteDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupCodeGroup() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<CodeGroupLookupItem>> = await ApiService.get(CODE_GROUP_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateCodeGroupOption = mapOptionFromLookupApi(response.data.result.content, "codeGroup", "codeGroupDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupDamage() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<DamageLookupItem>> = await ApiService.get(DAMAGE_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateDamageOption = mapOptionFromLookupApi(response.data.result.content, "damage", "damageDescription");
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getLookupDamageCategory() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<DamageCategoryLookupItem>> = await ApiService.get(DAMAGE_CATEGORY_LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateDamageCategoryOption = mapOptionFromLookupApi(response.data.result.content, "damageCategory", "damageCategoryDescription");
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
          excludeUnitByEquipmentId: 0,
          site: this.stateFormData.site,
          equipmentModel: this.stateFormData.equipmentModel,
          objectType: this.stateFormData.objectType,
          codeGroup: this.stateFormData.codeGroup,
          damageCategory: this.stateFormData.damageCategory,
          damage: this.stateFormData.damage,
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
          excludeUnitByEquipmentId: this.stateFormData.excludeUnitByEquipmentId,
          site: this.stateFormData.site,
          equipmentModel: this.stateFormData.equipmentModel,
          objectType: this.stateFormData.objectType,
          codeGroup: this.stateFormData.codeGroup,
          damageCategory: this.stateFormData.damageCategory,
          damage: this.stateFormData.damage,
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
      this.stateFormData.excludeUnitByEquipmentId = data.excludeUnitByEquipmentID
      this.stateFormData.site = data.site
      this.stateFormData.equipmentModel = data.equipmentModel
      this.stateFormData.objectType = data.objectType
      this.stateFormData.codeGroup = data.codeGroup
      this.stateFormData.damageCategory = data.damageCategory
      this.stateFormData.damage = data.damage
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
