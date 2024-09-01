import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler";
import ApiService from "@/core/services/ApiService";
import { Header } from "@/core/types/entities/dma/monitoring-status/Header";
import { List } from "@/core/types/entities/dma/monitoring-status/List";
import {
  MonitoringStatus
} from "@/core/types/entities/dma/monitoring-status/MonitoringStatus";
import { ApiResponse } from "@/core/types/misc/ApiResponse";
import { Option } from "@/core/types/misc/Option";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { cloneDeep, isEqual } from "lodash";
import { defineStore } from "pinia";
import { serviceSheetHistoryUrl, interventionOpenListSql } from "./urls";
import {
  InterventionList
} from "@/core/types/entities/dma/monitoring-status/InterventionList"
import { db } from '@/database/schema/DexieSchema'
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore";
import {
  GENERAL_SERVICE_SHEET_API_URL as GENERAL_SERVICE_SHEET_API_URL_INTERVENTION
} from "../component-intervention/urls";
import {
  GENERAL_SERVICE_SHEET_API_URL as GENERAL_SERVICE_SHEET_API_URL_INTERIM
} from "../interim-engine-service/urls";
import {
  GENERAL_SERVICE_SHEET_API_URL as GENERAL_SERVICE_SHEET_API_URL_EFORM
} from "../e-form/urls";
import {
  addCurrentDateWithFormatHelper,
  formatCurrentDateHelper,
  substractCurrentDateWithFormatHelper
} from "@/core/helpers/date-format";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useMonitoringListStore = defineStore({
  id: "DmaMonitoringList",
  state: () => {
    return {
      stateHeader: [
        {
          label: 'Yet To Start',
          total: '0',
          value: 'Open'
        },
        {
          label: 'In Progress',
          total: '0',
          value: 'On Progress'
        },
        {
          label: 'Under Review',
          total: '0',
          value: 'Submited'
        },
        {
          label: 'Final Review',
          total: '0',
          value: 'Final Review'
        },
        {
          label: 'Closed',
          total: '0',
          value: 'Close'
        },
      ] as Header[],
      stateSelectedHeader: 'Open',
      stateList: [] as List[],
      stateInterventionList: [] as InterventionList[],
      stateInterimList: [] as List[],
      stateInitList: [] as List[],
      stateStatusList: [] as MonitoringStatus[],
      stateListLoading: true,
      stateOptions: [] as Option[],
      stateInitOptions: [] as Option[],
      stateInitOptionsIntervention: [] as Option[],
      stateInitOptionsInterim: [] as Option[],
      stateOptionsQuery: "",
      stateSelectedServiceSheet: "",
      stateDefaultRange: [
        substractCurrentDateWithFormatHelper(3, "months", "YYYY-MM-DD"),
        addCurrentDateWithFormatHelper(1, "months", "YYYY-MM-DD"),
      ],
      stateDefaultFormTypeOpenFromApprovalPlanner: ""
    }
  },
  getters: {
    headerList: (state) => {
      return state.stateHeader;
    },
    selectedHeader: (state) => {
      return state.stateSelectedHeader
    },
    list: (state) => {
      return state.stateList
    },
    interventionList: (state) => {
      return state.stateInterventionList
    },
    interimnList: (state) => {
      return state.stateInterimList
    },
    listLoading: (state) => {
      return state.stateListLoading
    },
    serviceSheetOptions: (state) => {
      return state.stateInitOptions
    },
    serviceSheetInterventionOptions: (state) => {
      return state.stateInitOptionsIntervention
    },
    serviceSheetInterimOptions: (state) => {
      return state.stateInitOptionsInterim
    },
    serviceSheetOptionQuery: (state) => {
      return state.stateOptionsQuery
    },
    selectedServiceSheet: (state) => {
      return state.stateSelectedServiceSheet
    },
    defaultRange: (state) => {
      return state.stateDefaultRange
    },
    defaultFormTypeOpenFromApprovalPlanner: (state) => {
      return state.stateDefaultFormTypeOpenFromApprovalPlanner
    }
  },
  actions: {
    setDefaultFormTypeOpenFromApprovalPlanner(formType: string) {
      this.stateDefaultFormTypeOpenFromApprovalPlanner = formType
    },
    setInitialRange(oldHeader, newHeader) {
      const oldDefaultRange = ['', ''];
      if (oldHeader == "Yet To Start" || oldHeader == "Open") {
        oldDefaultRange[0] = substractCurrentDateWithFormatHelper(3, "months", "YYYY-MM-DD");
        oldDefaultRange[1] = addCurrentDateWithFormatHelper(1, "months", "YYYY-MM-DD");
      } else {
        oldDefaultRange[0] = substractCurrentDateWithFormatHelper(3, "months", "YYYY-MM-DD");
        oldDefaultRange[1] = formatCurrentDateHelper("YYYY-MM-DD");
      }
      // When the filter is still set to the default value for the old header,
      // use the default value of the new header as a fallback mechanism
      if (isEqual(oldDefaultRange, this.stateDefaultRange)) {
        if (newHeader == "Yet To Start") this.setDefaultFilterDateRangeForYetToStart()
        else this.setDefaultFilterDateRange();
      }
    },
    async setHeaderChange(header) {
      localStorage.setItem("monitoring-status-tab", header)
      this.stateOptionsQuery = ""
      this.stateSelectedServiceSheet = ""
      this.stateList = []
      this.stateInterventionList = []
      this.stateInterimList = []
      const oldHeader = String(this.stateSelectedHeader)
      this.stateSelectedHeader = header
      let statusVal
      this.stateHeader.forEach((headerStatus) => {
        if (headerStatus.label == header) {
          statusVal = headerStatus.value
        }
      })
      const pendings = await db.retryTask.toArray()
      const pendingsWo = pendings.map((s) => {
        return s.workorder
      })
      this.setInitialRange(oldHeader, header)
      await this.getMonitoringList()
      await this.getMonitoringListOnlyOpenIntervention()
      this.stateStatusList?.forEach((status) => {
        if (statusVal == status.status) {
          this.stateList = status.data.servicesheet
          this.stateInitList = cloneDeep(this.stateList)
          this.stateInterventionList = status.data.intervention
          this.stateInterimList = status.data.interimEngine
          this.stateInterventionList?.forEach((i) => {
            i.isPendingSync = pendingsWo.includes(i.sapWorkOrder)
          })
        }
      })
      this.stateInitOptions = this.stateList.map((e) => {
        return {
          label: `${e.unitNumber} - ${e.brand} ${e.equipmentModel} - ${e.psType} Hour Service - ${e.workOrder}`,
          value: `${e.unitNumber} - ${e.equipmentModel} - ${e.psType} Hour Service - ${e.workOrder}`
        }
      })
      this.stateInitOptionsInterim = this.stateInterimList.map((e) => {
        return {
          label: `${e.unitNumber} - ${e.brand} ${e.equipmentModel} - ${e.psType} Hour Service - ${e.workOrder}`,
          value: `${e.unitNumber} - ${e.equipmentModel} - ${e.psType} Hour Service - ${e.workOrder}`
        }
      })
      this.stateInitOptionsIntervention = this.stateInterventionList.map((e) => {
        return {
          value: `${e.equipment} - ${e.equipmentDesc} - ${e.sampleStatus} Intervention - ${e.sapWorkOrder}`,
          labelPlain: `${e.equipment} - ${e.equipmentDesc} - ${e.sampleStatus} Intervention - ${e.sapWorkOrder}`,
          label: `${e.equipment} - ${e.equipmentDesc} - <span class="${e.sampleStatus?.toLowerCase() == 'caution' ? 'yellow' : e.sampleStatus?.toLowerCase() == 'normal' ? 'green' : 'red'}">${e.sampleStatus} Intervention</span> - ${e.componentSystem} - ${e.sapWorkOrder}`,
        }
      })
    },
    async revalidate() {
      const pendings = await db.retryTask.toArray()
      const pendingsWo = pendings.map((s) => {
        return s.workorder
      })
      this.stateStatusList[0].data.intervention.forEach((i) => {
        i.isPendingSync = pendingsWo.includes(i.sapWorkOrder)
      })
      this.stateInterventionList.forEach((i) => {
        i.isPendingSync = pendingsWo.includes(i.sapWorkOrder)
      })
    },
    async getMonitoringList() {
      const authStore = useAuthenticationStore()
      const params = {
        ver: 'v1',
        siteId: authStore.user.SiteId,
        dateStart: this.defaultRange[0],
        dateEnd: this.defaultRange[1],
        statusTabName: this.stateSelectedHeader,
      }
      try {
        const response: AxiosResponse<ApiResponse<MonitoringStatus>> = await ApiService.get(serviceSheetHistoryUrl, "", new URLSearchParams(params).toString())
        this.stateStatusList = response.data.result.content
        response.data.result.content?.forEach((item) => {
          this.stateHeader.forEach((header) => {
            if (item.status == header.value) {
              if (item.status == "Open") {
                header.total = String(Number(item.data.servicesheet.length) + Number(item.data.intervention.length))
              } else {
                header.total = String(Number(item.data.servicesheet.length) + Number(item.data.intervention.length) + Number(item.data.interimEngine.length))
              }
            }
          })
          if (item.status == this.stateSelectedHeader) {
            this.stateList = item.data.servicesheet
            this.stateInterventionList = item.data.intervention
          }
        })
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateListLoading = false
      }
    },
    async getMonitoringListOnlyOpenIntervention() {
      const authStore = useAuthenticationStore()
      const params = {
        ver: 'v1',
        siteId: authStore.user.SiteId,
        dateStart: this.defaultRange[0],
        dateEnd: this.defaultRange[1],
      }
      try {
        const pendings = await db.retryTask.toArray()
        const pendingsWo = pendings.map((s) => {
          return s.workorder
        })
        const response: AxiosResponse<ApiResponse<InterventionList>> = await ApiService.get(interventionOpenListSql, "", new URLSearchParams(params).toString())
        this.stateStatusList[0].data.intervention = response.data.result.content
        this.stateStatusList[0].data.intervention.forEach((i) => {
          i.isPendingSync = pendingsWo.includes(i.sapWorkOrder)
        })
        this.stateStatusList[0].dataCount = String(Number(this.stateStatusList[0].data.servicesheet.length) + Number(response.data.result.content.length))
        this.stateHeader[0].total = String(Number(this.stateStatusList[0].data.servicesheet.length) + Number(response.data.result.content.length))
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error);
      } finally {
        this.stateListLoading = false
      }
    },
    setDefaultFilterDateRangeForYetToStart() {
      this.stateDefaultRange[0] = substractCurrentDateWithFormatHelper(3, "months", "YYYY-MM-DD");
      this.stateDefaultRange[1] = addCurrentDateWithFormatHelper(1, "months", "YYYY-MM-DD");
    },
    setDefaultFilterDateRange() {
      this.stateDefaultRange[0] = substractCurrentDateWithFormatHelper(3, "months", "YYYY-MM-DD");
      this.stateDefaultRange[1] = formatCurrentDateHelper("YYYY-MM-DD");
    },
    setDefaultFilter(dateStart, dateEnd) {
      this.stateDefaultRange[0] = dateStart
      this.stateDefaultRange[1] = dateEnd
    },
    resetList() {
      this.stateList = []
      this.stateDefaultRange = [
        substractCurrentDateWithFormatHelper(3, "months", "YYYY-MM-DD"),
        addCurrentDateWithFormatHelper(1, "months", "YYYY-MM-DD"),
      ]
      this.setHeaderChange(this.stateSelectedHeader)
    },
    setOptionQuery(query) {
      this.stateOptionsQuery = query
    },
    setServiceSheetOption() {
      this.stateOptions = cloneDeep(this.stateInitOptions)
      if (this.stateOptionsQuery) {
        this.stateOptions = this.stateOptions.filter((element) => {
          if (element.label.toLowerCase().includes(this.stateOptionsQuery.toLowerCase())) {
            return true
          }
        });
      }
    },
    fitlerList(workOrder) {
      this.stateSelectedServiceSheet = workOrder
      this.serviceSheetOptions.forEach((element) => {
        if (element.value == workOrder) this.stateOptionsQuery = element.label
      })
      this.setServiceSheetOption()
      this.stateList = cloneDeep(this.stateInitList)
      this.stateList = this.stateList.filter((element) => {
        return `${element.workOrder}` == this.stateSelectedServiceSheet
      })
    },
    async updateDownloadHistory(category, item) {
      const authStore = useAuthenticationStore()
      const payload = {
        id: item.id,
        updateParams: [{
          keyValue: item.key,
          propertyParams: [
            {
              propertyName: "updatedBy",
              propertyValue: JSON.stringify({
                id: authStore.user.EmployeeId,
                name: authStore.user.Name
              })
            },
            {
              propertyName: "updatedDate",
              propertyValue: "<<ServerDateTime>>"
            },
            {
              propertyName: "downloadHistory",
              propertyValue: JSON.stringify({
                downloadBy: {
                  id: authStore.user.EmployeeId,
                  name: authStore.user.Name
                },
                downloadDate: "<<ServerDateTime>>",
              })
            },
            {
              propertyName: "isDownload",
              propertyValue: "true"
            },
          ]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      const params = {
        ver: 'v1'
      }
      let url = ""
      if (category == "Digital Service Forms") {
        url = GENERAL_SERVICE_SHEET_API_URL_EFORM
      } else if (category == "Interim Engine Service Forms") {
        url = GENERAL_SERVICE_SHEET_API_URL_INTERIM
      } else {
        payload["localInterventionStatus"] = "Close"
        url = GENERAL_SERVICE_SHEET_API_URL_INTERVENTION
      }
      try {
        await ApiService.post(`${url}?${new URLSearchParams(params).toString()}`, payload as AxiosRequestConfig)
        if (category == "Digital Service Forms") {
          const index = this.stateList.findIndex((data) => {
            return data.workOrder == item.workOrder
          })
          if (index >= 0) {
            this.stateList[index].isDownload = "true"
          }
        } else if (category == "Interim Engine Service Forms") {
          const index = this.stateInterimList.findIndex((data) => {
            return data.workOrder == item.workOrder
          })
          if (index >= 0) {
            this.stateInterimList[index].isDownload = "true"
          }
        } else {
          const index = this.stateInterventionList.findIndex((data) => {
            return data.sapWorkOrder == item.sapWorkOrder
          })
          if (index >= 0) {
            this.stateInterventionList[index].isDownload = "true"
          }
        }
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
  },
})
