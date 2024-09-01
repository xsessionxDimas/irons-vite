import { defineStore } from "pinia";
import { List } from '@/core/types/entities/dma/monitoring-status/List';
import {
  FilterData
} from "@/core/types/entities/report/history/historical-eform-dma/FilterData";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import ApiService from "@/core/services/ApiService";
import { GET_API_URL } from "./urls"
import { Option } from "@/core/types/misc/Option";
import {
  LookupItem as LookupItemSite
} from "@/core/types/entities/iron-lake/business-partner/site/LookupItem";
import {
  LookupItem as LookupItemEquipmentModel
} from "@/core/types/entities/iron-lake/equipment/equipment-model/LookupItem";
import {
  LOOKUP_API_URL as LOOKUP_API_URL_SITE
} from "@/store/pinia/iron-lake/business-partner/site/urls";
import {
  LOOKUP_PS_TYPE_API_URL as LOOKUP_API_URL_PSTYPE
} from "@/store/pinia/iron-lake/parameter/oil-tolerance-setting/urls";
import {
  LOOKUP_API_URL as LOOKUP_API_URL_EQUIPMENT_ASSIGNMENT
} from "@/store/pinia/iron-lake/equipment/equipment-assignment/urls";
import {
  LOOKUP_API_URL as LOOKUP_API_URL_EQUIPMENT_MODEL
} from "@/store/pinia/iron-lake/equipment/equipment-model/urls";
import { mapOption, mapOptionFromLookupApi } from "@/core/helpers/mapOption";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useHistoricalEformDmaListStore = defineStore({
  id: "historicalEformDmaList",
  state: () => {
    return {
      statePageName: "historicalEformDma",
      stateFilterData: {
        Site: "",
        Model: "",
        Equipment: "",
        PsType: "",
        ver: "v1"
      } as FilterData,
      stateLastUsedFilterData: {
        Site: "",
        Model: "",
        Equipment: "",
        PsType: "",
        ver: "v1"
      } as FilterData,
      stateDisplayData: [] as List[],
      stateLoading: false as boolean,
      stateSiteOptions: [] as Option[],
      stateModelOptions: [] as Option[],
      stateEquipmentOptions: [] as Option[],
      statePsTypeOptions: [] as Option[],
    };
  },
  getters: {
    pageName: (state) => {
      return state.statePageName;
    },
    displayData: (state) => {
      return state.stateDisplayData;
    },
    filterData: (state) => {
      return state.stateFilterData;
    },
    lastUsedFilterData: (state) => {
      return state.stateLastUsedFilterData
    },
    loading: (state) => {
      return state.stateLoading;
    },
    siteOptions: (state) => {
      return state.stateSiteOptions
    },
    modelOptions: (state) => {
      return state.stateModelOptions
    },
    equipmentOptions: (state) => {
      return state.stateEquipmentOptions
    },
    psTypeOptions: (state) => {
      return state.statePsTypeOptions
    },
  },
  actions: {
    async getData(isPageRefresh = true) {
      const params = {
        Site: this.stateFilterData.Site,
        Model: this.stateFilterData.Model,
        Equipment: this.stateFilterData.Equipment,
        PsType: this.stateFilterData.PsType,
        ver: this.stateFilterData.ver
      };
      try {
        if (isPageRefresh) this.stateLoading = true;
        if (!isPageRefresh) this.stateDisplayData = [...[]]
        const response: AxiosResponse<ApiResponse<List>> = await ApiService.get(GET_API_URL, "", new URLSearchParams(params).toString());
        this.stateDisplayData = response.data.result.content;
        this.stateLastUsedFilterData = {
          ...this.stateFilterData
        } as FilterData
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      this.stateLoading = false;
    },
    async getLookupSite() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItemSite>> = await ApiService.get(`${LOOKUP_API_URL_SITE}?${new URLSearchParams(params).toString()}`);
        this.stateSiteOptions = mapOptionFromLookupApi(response.data.result.content, "siteId", "siteDescription")
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getLookupPsType() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_API_URL_PSTYPE}?${new URLSearchParams(params).toString()}`);
        this.statePsTypeOptions = mapOption(response.data.result.content.psType)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getLookupEquipment() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.get(`${LOOKUP_API_URL_EQUIPMENT_ASSIGNMENT}?${new URLSearchParams(params).toString()}`);
        this.stateEquipmentOptions = mapOption(response.data.result.content.equipment)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getLookupModel() {
      const params = {
        ver: this.stateFilterData.ver
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupItemEquipmentModel>> = await ApiService.get(`${LOOKUP_API_URL_EQUIPMENT_MODEL}?${new URLSearchParams(params).toString()}`);
        this.stateModelOptions = mapOptionFromLookupApi(response.data.result.content, "equipmentModel", "equipmentModelDescription")
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    setSite(value: string) {
      this.stateFilterData.Site = value
    },
    setModel(value: string) {
      this.stateFilterData.Model = value
    },
    setEquipment(value: string) {
      this.stateFilterData.Equipment = value
    },
    setPsType(value: string) {
      this.stateFilterData.PsType = value
    },
    resetState() {
      this.stateFilterData.Site = ""
      this.stateFilterData.Model = ""
      this.stateFilterData.Equipment = ""
      this.stateFilterData.PsType = ""
      this.stateDisplayData = [] as List[];
      this.stateLoading = false;
    }
  }
});
