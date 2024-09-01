/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  LOOKUP_API_URL,
  GET_SENSOR_DATA_API_URL,
  POST_API_URL
} from "./urls";
import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import { Option } from "@/core/types/misc/Option";
import {
  mapOption
} from "@/core/helpers/mapOption";
import {
  UpsertItemType,
  SensorDataType,
  LookupDataType
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/3dpHornetType";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  sendErrorEvent
} from "@/core/helpers/analytics";

const initialFilter = {
  site: "",
  model: "",
  equipment: "",
  component: [] as string[],
  ver: "v1"
}
const initialFormLoading = {
  site: false,
  model: false,
  equipment: false,
  component: false,
};

export const useSummaryInterventionStore = defineStore({
  id: "summaryIntervention",
  state: () => {
    return {
      stateIsFromEquipment: false,
      stateIsFromIntervention: false,
      stateFilter: initialFilter,
      stateFilterLoading: {
        ...initialFormLoading
      },
      stateIsError: false,
      stateErrors: [] as string[],
      stateSiteOption: [] as Option[],
      stateModelOption: [] as Option[],
      stateEquipmentOption: [] as Option[],
      stateComponentOption: [] as Option[],

      stateSensorDataTotal: -1,
      stateIsSensorSelectAll: true,
      stateRerenderSensorList: true,

      stateSensorPaginate: {
        page: 1,
        pagesize: 20,
        lastPage: -1,
        list: [] as SensorDataType[],
      },

      stateLoadingSensor: false,
      stateLoadingUpdate: false,
    }
  },
  getters: {
    filter: (state) => {
      return state.stateFilter
    },
    errors: (state) => {
      return state.stateErrors;
    },
    isError: (state) => {
      return state.stateIsError;
    },
    filterLoading: (state) => {
      return state.stateFilterLoading;
    },
    siteOption: (state) => {
      return state.stateSiteOption;
    },
    modelOption: (state) => {
      return state.stateModelOption;
    },
    equipmentOption: (state) => {
      return state.stateEquipmentOption;
    },
    componentOption: (state) => {
      return state.stateComponentOption;
    },
    rerenderSensorList: (state) => {
      return state.stateRerenderSensorList;
    },
    sensorDataList: (state) => {
      return state.stateSensorPaginate.list;
    },
    sensorDataLastPage: (state) => {
      return state.stateSensorPaginate.lastPage;
    },
    sensorDataCurrentPage: (state) => {
      return state.stateSensorPaginate.page;
    },
    loadingSensor: (state) => {
      return state.stateLoadingSensor;
    },
    isSensorSelectAll: (state) => {
      return state.stateIsSensorSelectAll;
    },
    loadingUpdate: (state) => {
      return state.stateLoadingUpdate;
    },
  },
  actions: {
    setFilterSite(value: string) {
      this.stateFilter.site = value
    },
    setFilterModel(value: string) {
      this.stateFilter.model = value
    },
    setFilterEquipment(value: string) {
      this.stateFilter.equipment = value
    },
    setFilterComponent(values: string[]) {
      this.stateFilter.component = values
    },

    setLoadingSensor(isLoading: boolean) {
      this.stateLoadingSensor = isLoading
    },

    async getSiteLookup() {
      this.stateFilterLoading.site = true;
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupDataType>> = await ApiService.get(LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateSiteOption = mapOption(response.data.result.content.site.siteDescription);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      this.stateFilterLoading.site = false;
    },
    async getModelLookup() {
      this.stateFilterLoading.model = true;
      const params = {
        ver: "v1",
        site: this.stateFilter.site,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupDataType>> = await ApiService.get(LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateModelOption = mapOption(response.data.result.content.model.equipmentModel);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      this.stateFilterLoading.model = false;
    },
    async getEquipmentLookup() {
      this.stateFilterLoading.equipment = true;
      const params = {
        ver: "v1",
        site: this.stateFilter.site,
        model: this.stateFilter.model,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupDataType>> = await ApiService.get(LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateEquipmentOption = mapOption(response.data.result.content.equipment.equipmentNumber);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      this.stateFilterLoading.equipment = false;
    },
    async getComponentLookup() {
      this.stateFilterLoading.component = true;
      const params = {
        ver: "v1",
        site: this.stateFilter.site,
        model: this.stateFilter.model,
        equipment: this.stateFilter.equipment,
      };
      try {
        const response: AxiosResponse<SingleApiResponse<LookupDataType>> = await ApiService.get(LOOKUP_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentOption = mapOption(response.data.result.content.component.componentDescription);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
      this.stateFilterLoading.component = false;
    },

    /**
       * paginate sensor support
       *
       * @param options
       */
    async getSensorDataListPaginate(direction: "next" | "prev" | undefined = undefined) {
      if (!direction) {
        this.stateSensorPaginate.page = 0
      } else {
        if (direction == 'prev' && this.stateSensorPaginate.page == 1) {
          return
        } else if (
          direction == 'next' &&
          this.stateSensorPaginate.lastPage != -1 &&
          this.stateSensorDataTotal != -1 &&
          this.stateSensorPaginate.page == this.stateSensorPaginate.lastPage
        ) {
          console.warn("[summary intervention state]: nextpage is unavailable");
          return
        }
      }

      if (direction == 'prev') {
        this.stateSensorPaginate.page--;
      } else {
        this.stateSensorPaginate.page++;
      }

      this.stateRerenderSensorList = false
      return this.getSensorDataList({
        page: this.stateSensorPaginate.page,
        pagesize: this.stateSensorPaginate.pagesize
      }).then((data) => {
        console.log("[sensor-data]:", this.stateSensorPaginate.page, data);

        let pagedData = data

        if (!this.stateIsSensorSelectAll && this.stateSensorPaginate.list.length != 0) {
          pagedData = data.map((e) => {
            const temp = e
            temp.isCheck = false
            return temp
          })
        }

        // push direction
        if (direction == 'next') {
          this.stateSensorPaginate.list.push(...pagedData)
        } else {
          this.stateSensorPaginate.list.unshift(...pagedData)
        }
        this.stateSensorPaginate.lastPage = Math.ceil(this.stateSensorDataTotal / this.stateSensorPaginate.pagesize) || -1

        return data;
      }).finally(() => {
        this.stateRerenderSensorList = true
      })
    },

    /**
     * get sensor data list
     *
     */
    async getSensorDataList(options?: {
      page?: number;
      pagesize?: number;
      site?: string;
    }): Promise<SensorDataType[]> {
      this.stateLoadingSensor = true;

      const params = {
        ver: "v1",
      };

      const form = {
        site: options?.site || this.stateFilter.site,
        model: this.stateFilter.model,
        equipment: this.stateFilter.equipment,
        component: this.stateFilter.component,
        page: String(options?.page || 1),
        pagesize: String(options?.pagesize || 100)
      }

      return ApiService
        .post(`${GET_SENSOR_DATA_API_URL}?${new URLSearchParams(params).toString()}`, form as AxiosRequestConfig)
        .then((response: AxiosResponse<ApiResponse<SensorDataType>>) => {
          const data = response.data.result.content
          this.stateSensorDataTotal = response.data.result.total

          return data
        })
        .catch((error) => {
          sendErrorEvent('IRONS', error);
          console.error(error);
          return Promise.reject(error)
        })
        .finally(() => {
          this.stateLoadingSensor = false;
        })
    },

    setReRenderSensorSelection(flag) {
      this.stateRerenderSensorList = flag
    },
    updateSensorDataList(checkedItems: SensorDataType[]) {
      this.stateSensorPaginate.list.forEach((sensorDataItem) => {
        const isItemFound = checkedItems.findIndex((checkedItem) => {
          return checkedItem.sensorId == sensorDataItem.sensorId
        });
        sensorDataItem.isCheck = isItemFound != -1;
      })
    },

    /**
     * update intervention
     *
     * @param createBy
     */
    async updateIntervention(createBy: string) {
      this.stateLoadingUpdate = true;
      try {
        const params = {
          userAccount: createBy,
          ver: "v1"
        };
        const form: UpsertItemType = {
          site: this.stateFilter.site,
          model: this.stateFilter.model,
          equipment: this.stateFilter.equipment,
          component: this.stateFilter.component,
          sensor: this.generatePayloadSensor(),
          isCheckAllSensor: this.isSensorSelectAll,
        };
        const response: AxiosResponse<SingleApiResponse<undefined>> = await ApiService.post(`${POST_API_URL}?${new URLSearchParams(params).toString()}`, form as AxiosRequestConfig)
        if (response.data.title === "Error") {
          this.stateErrors.push(response.data.result.message);
          this.stateIsError = true;
        } else {
          this.stateErrors = [];
          this.stateIsError = false;
        }
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateErrors.push(error.response.data.result.message);
        this.stateIsError = true;
      }
      this.stateLoadingUpdate = false;
    },
    generatePayloadSensor() {
      let tempSensorList: SensorDataType[]

      if (this.stateIsSensorSelectAll) {
        tempSensorList = this.stateSensorPaginate.list.filter((sensor) => {
          return sensor.isCheck == false
        })
      } else {
        tempSensorList = this.stateSensorPaginate.list.filter((sensor) => {
          return sensor.isCheck == true
        })
      }

      return tempSensorList.map((sensor) => {
        return sensor.sensorId
      })
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    setParam(param) {
      this.stateFilter.site = param.site;
      this.stateFilter.model = param.model;
      this.stateFilter.equipment = param.equipment;
      this.stateFilter.component = param.component;
    },
    setIsSensorSelectAll(isCheck: boolean) {
      this.stateIsSensorSelectAll = isCheck
    },
    resetParam() {
      this.stateFilter = {
        ...initialFilter
      };
    },
    resetList() {
      this.stateRerenderSensorList = false
      this.stateSensorPaginate = {
        page: 1,
        pagesize: 20,
        list: [] as SensorDataType[],
        lastPage: -1,
      }
      this.stateRerenderSensorList = true
    },
    resetErrors() {
      this.stateErrors = [] as string[];
      this.stateIsError = false;
    },
  }
});
