/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  GET_INTERVENTION_CHECKS_API_URL,
  GET_ADDITIONAL_TASK_API_URL,
  GET_COMPONENT_LIST_API_URL,
  GET_HEADER_LIST_ITEM,
  GET_TOTAL_LIST_HEADER,
  LOOKUP_TYPE_TASK,
  LOOKUP_CONDITION_TYPE_TASK,
  LOOKUP_UOM_TRANSACTION,
  GET_HEADER_LIST_ITEM_DECLINE,
} from "./urls";

import ApiService from "@/core/services/ApiService";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import {
  InterventionCheckItem
} from "@/core/types/entities/iron-portal/dashboard/intervention/InterventionCheckItem";
import {
  AdditionalTaskItem,
  ComponentItemAdditionalTask
} from "@/core/types/entities/iron-portal/dashboard/intervention/AdditionalTaskItem";
import {
  HeaderListItem
} from "@/core/types/entities/iron-portal/dashboard/intervention/LookupItem";
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";

import {
  useComponentInterventionDefectsStore
} from "@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore"
import {
  ComponentItem
} from "@/core/types/entities/iron-portal/dashboard/intervention/ComponentItem";

import {
  useInterventionFormStore
} from "./useInterventionFormStore";

import { Option } from "@/core/types/misc/Option";
import PaginationType from "@/core/types/misc/PaginationCustom";
import {
  mapOptionFromLookupApi,
  mapOption
} from "@/core/helpers/mapOption";

import { ApiResponse } from "@/core/types/misc/ApiResponse";
import {
  sendErrorEvent
} from "@/core/helpers/analytics";

const defectStore = useComponentInterventionDefectsStore();

const initialFilter = {
  keyPbi: "",
};
const initialFormAdditionalTask = {
  additionalTaskId: 0,
  sequence: 0,
  recAction: "",
  executed: false,
  actualInterventionDate: "",
  interventionStatus: "",
  condition: "",
  detailedInformation: "",
  taskKey: "",
  isActive: true,
  isDeleted: false,
  psType: "",
  interventionIdCosmos: "",
  images: [],
  typeTaskId: 0,
  uom: "",
  typeTask: "",
  componentId: "",
  listComponent: [] as ComponentItemAdditionalTask[],
};

const initialSelectedItem = {
  equipmentId: "",
  equipmentNumber: "",
  interventionCode: "",
  workOrder: "",
  model: "",
  modelId: "",
  brand: "",
  status: "",
  intervention: "",
  keyPbi: "",
  interventionDate: "",
  componentGroup: "",
}

export const useInterventionListStore = defineStore({
  id: "interventionList",
  state: () => {
    return {
      stateFilter: {
        ...initialFilter
      },
      stateComponentList: [] as ComponentItem[],
      stateReRenderSelection: false,
      stateRerenderComponentList: false,
      stateInterventionCheckList: [] as InterventionCheckItem[],
      stateAdditionalTaskList: [] as AdditionalTaskItem[],
      stateDeletedAdditionalTaskList: [] as AdditionalTaskItem[],
      stateIsError: false,
      stateError: "",
      stateErrors: [] as string[],
      stateLoading: false,
      stateComponentListLoading: false,
      stateHeader: [
        {
          label: 'Pending Evaluation',
          total: 0,
          value: 'Pending Evaluation'
        },
        {
          label: 'Submitted',
          total: 0,
          value: 'Submitted'
        },
        {
          label: 'Yet to Start',
          total: 0,
          value: 'Yet to Start'
        },
        {
          label: 'In Progress',
          total: 0,
          value: 'In Progress'
        },
        {
          label: 'Under Review',
          total: 0,
          value: 'Under Review'
        },
        {
          label: 'Final Review',
          total: 0,
          value: 'Final Review'
        },
        {
          label: 'Closed',
          total: 0,
          value: 'Close'
        },
        {
          label: 'Declined',
          total: 0,
          value: 'Declined'
        },
      ],
      stateSelectedHeader: 'Pending Evaluation',
      stateSelectedHeaderItem: {
        ...initialSelectedItem
      } as HeaderListItem,
      stateHeaderListItems: [] as HeaderListItem[],
      stateLoadingHeader: false,
      stateIsSelectedItem: false,
      statePaginationLoading: false,
      statePagination: new PaginationType(1, 3),
      stateSearchOptions: [] as HeaderListItem[],
      stateTypeTaskOptions: [] as Option[],
      stateFormAdditionalTask: {
        ...initialFormAdditionalTask
      } as AdditionalTaskItem,
      stateConditionOptions: [] as Option[],
      stateLoadingConditionOptions: false,
      stateUomOptions: [] as Option[],
      stateComponentFromEquipment: "",
    }
  },
  getters: {
    componentList: (state) => {
      return state.stateComponentList;
    },
    reRenderSelection: (state) => {
      return state.stateReRenderSelection
    },
    reRenderComponentList: (state) => {
      return state.stateRerenderComponentList;
    },
    interventionCheckList: (state) => {
      return state.stateInterventionCheckList;
    },
    additionalTaskList: (state) => {
      return state.stateAdditionalTaskList;
    },
    deletedAdditionalTaskList: (state) => {
      return state.stateDeletedAdditionalTaskList;
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
    componentListLoading: (state) => {
      return state.stateComponentListLoading;
    },
    headerList: (state) => {
      return state.stateHeader;
    },
    selectedHeader: (state) => {
      return state.stateSelectedHeader
    },
    selectedHeaderItem: (state) => {
      return state.stateSelectedHeaderItem;
    },
    isSelectedItem: (state) => {
      return state.stateIsSelectedItem;
    },
    headerListItems: (state) => {
      return state.stateHeaderListItems;
    },
    pagination: (state) => {
      return state.statePagination;
    },
    loadingHeader: (state) => {
      return state.stateLoadingHeader
    },
    paginationLoading: (state) => {
      return state.statePaginationLoading;
    },
    searchOption: (state) => {
      return state.stateSearchOptions
    },
    typeTaskOptions: (state) => {
      return state.stateTypeTaskOptions
    },
    formDataAdditional: (state) => {
      return state.stateFormAdditionalTask;
    },
    conditionOptions: (state) => {
      return state.stateConditionOptions
    },
    loadingConditionOptions: (state) => {
      return state.stateLoadingConditionOptions
    },
    uomOptions: (state) => {
      return state.stateUomOptions
    }
  },
  actions: {
    getImageProperty(images): string[] {
      if (images?.adjustment?.images) {
        return images?.adjustment?.images
      }
      return images
    },
    setComponentFromEquipment(value: string) {
      this.stateComponentFromEquipment = value
    },
    async getComponentList(isPendingEvaluation = false) {
      const params = {
        keyPbi: this.stateFilter.keyPbi,
        ver: "v1"
      };
      try {
        this.stateRerenderComponentList = false
        this.stateComponentListLoading = true;
        const response: AxiosResponse<SingleApiResponse<ComponentItem[]>> = await ApiService.get(GET_COMPONENT_LIST_API_URL, "", new URLSearchParams(params).toString());
        this.stateComponentList = response.data.result.content

        if (this.stateComponentFromEquipment && isPendingEvaluation) {
          const tempSelectedComponentList = response.data.result.content.filter((component) => {
            return component.componentDescription == this.stateComponentFromEquipment
          })
          this.updateComponentAffected(tempSelectedComponentList)
        }
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      } finally {
        this.stateComponentListLoading = false;
        this.stateRerenderComponentList = true
      }
    },
    setReRenderComponentList(flag) {
      this.stateRerenderComponentList = flag
    },
    setReRenderSelection(flag) {
      this.stateReRenderSelection = flag
    },
    async getInterventionCheckList() {
      const formStore = useInterventionFormStore();
      const params = {
        keyPbi: this.stateFilter.keyPbi,
        ver: "v1"
      };
      try {
        this.stateReRenderSelection = false
        this.stateLoading = true;
        const response: AxiosResponse<SingleApiResponse<InterventionCheckItem[]>> = await ApiService.get(GET_INTERVENTION_CHECKS_API_URL, "", new URLSearchParams(params).toString());
        if (response.data.result.content?.length > 0) {
          // this.stateInterventionCheckList = await Promise.all(
          //   response.data.result.content.map(async (item, _index) => {
          //     const images = await defectStore.getDefectImages(item.interventionIdCosmos, item.taskKey, 'images');
          //     return {
          //       ...item,
          //       images: this.getImageProperty(images) ?? [],
          //     };
          //   })
          // );
          this.stateInterventionCheckList = [
            ...response.data.result.content
          ]
          if (formStore.isCannotReviseOrSubmit) {
            this.stateInterventionCheckList = this.stateInterventionCheckList.filter((item) => {
              return item.isMandatory || item.isMandatory == null // null filter is for provide old data
            })
          }
        }
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      } finally {
        this.stateReRenderSelection = true
        this.stateLoading = false;
      }
    },
    getInterventionChecksImage() {
      Promise.all(
        this.stateInterventionCheckList.map(async (item, _index) => {
          const images = await defectStore.getDefectImages(item.interventionIdCosmos, item.taskKey, 'images');
          return {
            ...item,
            images: this.getImageProperty(images) ?? [],
          };
        })
      ).then((values) => {
        console.log("VALUES", values)
        this.stateReRenderSelection = false
        this.stateInterventionCheckList = [
          ...values
        ]
        this.stateReRenderSelection = true
      }).catch((error) => {
        console.log(error)
      })
    },
    async getAdditionalTaskList() {
      const params = {
        keyPbi: this.stateFilter.keyPbi,
        ver: "v1"
      };
      try {
        this.stateLoading = true;
        const defectStore = useComponentInterventionDefectsStore();
        const response: AxiosResponse<SingleApiResponse<AdditionalTaskItem[]>> = await ApiService.get(GET_ADDITIONAL_TASK_API_URL, "", new URLSearchParams(params).toString());
        this.stateAdditionalTaskList = response.data.result.content
        if (this.stateAdditionalTaskList?.length > 0) {
          this.stateAdditionalTaskList = await Promise.all(
            this.stateAdditionalTaskList.map(async (item, _index) => {
              const images = await defectStore.getDefectImages(item.interventionIdCosmos, item.taskKey, 'images');
              return {
                ...item,
                images: this.getImageProperty(images) ?? [],
              };
            })
          );
        }
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      } finally {
        this.stateLoading = false;
      }
    },
    setAdditionalForm(row) {
      this.stateFormAdditionalTask = row;
    },
    addAdditionalForm() {
      this.stateFormAdditionalTask.sequence = this.stateAdditionalTaskList.length + 1;
    },
    insertAdditionalTask(dataForm) {
      this.stateAdditionalTaskList.push({
        additionalTaskId: 0,
        sequence: this.stateAdditionalTaskList.length + 1,
        recAction: dataForm.recAction,
        executed: false,
        actualInterventionDate: "",
        interventionStatus: "",
        condition: "",
        detailedInformation: "",
        taskKey: "",
        isActive: true,
        isDeleted: false,
        psType: "",
        interventionIdCosmos: "",
        images: [],
        typeTaskId: dataForm.typeTaskId,
        uom: dataForm.typeTaskId == 3 || dataForm.typeTaskId == 10 ? dataForm.uom : "",
        typeTask: "",
        componentId: "",
        listComponent: [
          ...dataForm.listComponent
        ],
      });
    },
    updateAdditionalTask(oldData, newData) {
      const index = this.stateAdditionalTaskList.findIndex((e) => {
        return e.sequence == oldData.sequence;
      });
      newData.recAction = newData.recAction.trim();
      newData.uom = newData.typeTaskId == 3 || newData.typeTaskId == 10 ? newData.uom : ""
      this.stateAdditionalTaskList[index] = { ...newData };
    },
    deleteAdditionalTask(additionalTaskData) {
      const index = this.stateAdditionalTaskList.findIndex((e) => {
        return e.sequence == additionalTaskData.sequence;
      });
      if (additionalTaskData.additionalTaskId !== 0) {
        this.stateAdditionalTaskList[index].isDeleted = true;
        this.stateDeletedAdditionalTaskList.push(this.stateAdditionalTaskList[index])
      }
      this.stateAdditionalTaskList.splice(index, 1)
      this.stateAdditionalTaskList.forEach((e, index) => {
        e.sequence = index + 1;
      });
    },
    checkIsAdditionalTaskDuplicate(newData) {
      const temp = this.stateAdditionalTaskList.filter((currentTask) => {
        if (newData.uom) {
          if (currentTask.recAction.trim().toLowerCase() === newData.recAction.trim().toLowerCase() && currentTask.typeTaskId === newData.typeTaskId && currentTask.uom === newData.uom) return currentTask;
        } else {
          if (currentTask.recAction.trim().toLowerCase() === newData.recAction.trim().toLowerCase() && currentTask.typeTaskId === newData.typeTaskId) return currentTask;
        }
      });
      return temp.length >= 2;
    },
    checkAnyEmptyAdditionalTask() {
      return this.stateAdditionalTaskList.find((task) => {
        if (!task.recAction || task.recAction == "") {
          return task
        }
      });
    },
    setFilter(filter) {
      this.stateFilter.keyPbi = filter.keyPbi || ""
    },
    setErrors(errors: string[]) {
      this.stateErrors = errors;
      this.stateIsError = this.stateErrors.length > 0;
    },
    resetFormAdditionalTask() {
      this.stateFormAdditionalTask = {
        ...initialFormAdditionalTask
      }
    },
    resetFewList() {
      this.stateInterventionCheckList = [] as InterventionCheckItem[];
      this.stateAdditionalTaskList = [] as AdditionalTaskItem[];
      this.stateDeletedAdditionalTaskList = [] as AdditionalTaskItem[];
      this.stateComponentList = [] as ComponentItem[];
    },
    resetAllList() {
      this.stateInterventionCheckList = [] as InterventionCheckItem[];
      this.stateAdditionalTaskList = [] as AdditionalTaskItem[];
      this.stateDeletedAdditionalTaskList = [] as AdditionalTaskItem[];
      this.stateComponentList = [] as ComponentItem[];
      this.stateComponentFromEquipment = ""
      this.stateIsError = false;
      this.stateError = "";
      this.stateErrors = [] as string[];
      this.stateFormAdditionalTask = {
        ...initialFormAdditionalTask
      }
      this.stateSelectedHeaderItem = {
        ...initialSelectedItem
      };
      this.stateIsSelectedItem = false
    },
    async updateInterventionCheckListMandatory(rows) {
      this.stateInterventionCheckList.forEach((item) => {
        const recActionIndex = rows.findIndex((row) => {
          return row.recAction == item.recAction
        });
        if (recActionIndex != -1) {
          item.isMandatory = true;
        } else {
          item.isMandatory = false;
        }
      })
    },
    async updateComponentAffected(rows: ComponentItem[]) {
      const formStore = useInterventionFormStore();

      let arrayTempReason = [] as string[]
      const arrayTempInterventionChecklist: Array<number> = []

      this.stateComponentList.forEach((componentItem) => {
        const isFound = rows.find((row) => {
          return row.componentId == componentItem.componentId
        });
        if (isFound) {
          componentItem.isCheck = true;

          // Add Intervention Reason
          componentItem.interventionReason.forEach((reasonItem) => {
            arrayTempReason.push(reasonItem)
          });

          // intervention check
          componentItem.interventionChecks.forEach((e) => {
            if (e.interventionDetailId && !arrayTempInterventionChecklist.includes(e.interventionDetailId)) {
              arrayTempInterventionChecklist.push(e.interventionDetailId)
            } else if (e.interventionDetailSourceId && !arrayTempInterventionChecklist.includes(e.interventionDetailSourceId)) {
              arrayTempInterventionChecklist.push(e.interventionDetailSourceId)
            }
          })
        } else {
          componentItem.isCheck = false;

          // Remove Intervention Reason
          componentItem.interventionReason.forEach((reasonItem) => {
            arrayTempReason = arrayTempReason.filter((tempReason) => {
              return reasonItem != tempReason
            })
          })
        }
      })

      // INTERVENTION REASON: start ===========================================================
      arrayTempReason = arrayTempReason.sort((a, b) => {
        const aIsCritOrCau = a.includes("CRITICAL") || a.includes("CAUTION")
        const bIsCritOrCau = b.includes("CRITICAL") || b.includes("CAUTION")
        const aIsNotBoth = !a.includes("CRITICAL") && !a.includes("CAUTION")
        const bIsNotBoth = !b.includes("CRITICAL") && !b.includes("CAUTION")

        if (aIsCritOrCau && bIsCritOrCau) { // If a and b is either critical or caution, then move a accordingly
          if (a.includes("CRITICAL") && b.includes("CRITICAL") || a.includes("CAUTION") && b.includes("CAUTION")) return 0
          return a.includes("CRITICAL") && b.includes("CAUTION") ? -1 : 1
        }
        if (aIsNotBoth && bIsCritOrCau) { // If a is not critical or caution but b is, then move a to the right
          return 1
        }
        if (aIsCritOrCau && bIsNotBoth) { // If a is critical or caution but b is not, then move a to the left
          return -1
        }
        return 0 // If a and b is not both, then do nothing
      })
      formStore.updateInterventionReason(arrayTempReason.join("<br> "))
      // INTERVENTION REASON: end ==============================================================

      // INTERVENTION CHECKS: start ============================================================
      if (arrayTempInterventionChecklist.length == 0) {
        this.stateInterventionCheckList.forEach((e) => {
          e.isActive = false
        })
        return
      }

      this.stateInterventionCheckList.forEach((interventionCheckItem) => {
        const indexOfCheck = arrayTempInterventionChecklist.findIndex((checkId) => {
          if (interventionCheckItem.interventionDetailId) return checkId == interventionCheckItem.interventionDetailId
          if (interventionCheckItem.interventionDetailSourceId) return checkId == interventionCheckItem.interventionDetailSourceId
          return false
        })
        if (indexOfCheck > -1) {
          interventionCheckItem.isActive = true
          interventionCheckItem.isMandatory = true
        } else {
          interventionCheckItem.isActive = false
        }
      })
      // INTERVENTION CHECKS: end ==============================================================
    },
    setTotalPage(totalPage: number) {
      this.pagination.totalPage = totalPage;
      this.pagination.getPaginationStartIndex();
      this.pagination.getPaginationLastIndex();
    },
    async setPage(newPage: number) {
      this.statePaginationLoading = true;
      this.statePagination.handleCurrentPageChange(newPage);
      if (this.stateSelectedHeader === 'Declined') {
        await this.setHeaderDeclined(this.stateSelectedHeader, newPage);
      } else {
        await this.setHeaderChange(this.stateSelectedHeader, newPage);
      }
      setTimeout(() => {
        this.statePaginationLoading = false;
      }, 20)
    },
    async setHeaderChange(header, pageNumber = 1) {
      const authStore = useAuthenticationStore();
      await this.getTotalHeader()
      this.stateSelectedHeader = header;
      const params = {
        site: authStore.user.SiteId,
        status: header,
        ver: "v1",
        page: pageNumber.toString(),
        pageSize: "3",
      };
      try {
        this.stateLoadingHeader = true;
        const response: AxiosResponse<ApiResponse<HeaderListItem>> = await ApiService.get(GET_HEADER_LIST_ITEM, "", new URLSearchParams(params).toString());
        this.stateHeaderListItems = response.data.result.content
        this.setTotalPage(response.data.result.total);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      } finally {
        this.stateLoadingHeader = false;
      }
    },
    async searchItems(param) {
      const authStore = useAuthenticationStore();
      const params = {
        site: authStore.user.SiteId,
        status: this.stateSelectedHeader,
        parameter: param,
        ver: "v1",
      };
      try {
        const URL = this.stateSelectedHeader === 'Declined' ? GET_HEADER_LIST_ITEM_DECLINE : GET_HEADER_LIST_ITEM
        const response: AxiosResponse<ApiResponse<HeaderListItem>> = await ApiService.get(URL, "", new URLSearchParams(params).toString());
        this.stateSearchOptions = response.data.result.content
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async getTotalHeader() {
      const authStore = useAuthenticationStore();
      const params = {
        site: authStore.user.SiteId,
        ver: "v1",
      };
      try {
        const response: AxiosResponse<any> = await ApiService.get(GET_TOTAL_LIST_HEADER, "", new URLSearchParams(params).toString());
        this.stateHeader[0].total = response.data.result.content.totalPendingEvaluation;
        this.stateHeader[1].total = response.data.result.content.totalSubmitted;
        this.stateHeader[2].total = response.data.result.content.totalYetToStart;
        this.stateHeader[3].total = response.data.result.content.totalInProgress;
        this.stateHeader[4].total = response.data.result.content.totalUnderReview;
        this.stateHeader[5].total = response.data.result.content.totalFinalReview;
        this.stateHeader[6].total = response.data.result.content.totalClosed;
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        console.log(error)
        if (error.response.data.statusCode == 401) {
          authStore.setLoggedIn(false);
        }
      }
    },
    async setSelectedHeader(header) {
      this.stateSelectedHeader = header;
    },
    async setSelectedHeaderItem(item) {
      this.stateSelectedHeaderItem = item;
    },
    setIsSelectedItem(flag) {
      this.stateIsSelectedItem = flag
    },
    async getLookupTypeTask() {
      const params = {
        ver: "v1"
      };
      try {
        const response: AxiosResponse<any> = await ApiService.get(LOOKUP_TYPE_TASK, "", new URLSearchParams(params).toString());
        this.stateTypeTaskOptions = mapOptionFromLookupApi(response.data.result.content, "typeTaskId", "typeTask", false);
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error)
      }
    },
    async getLookupConditionOption(typeId) {
      const params = {
        typeTaskId: typeId,
        ver: "v1"
      };
      try {
        this.stateLoadingConditionOptions = true;
        const response: AxiosResponse<any> = await ApiService.get(LOOKUP_CONDITION_TYPE_TASK, "", new URLSearchParams(params).toString());
        this.stateConditionOptions = mapOptionFromLookupApi(response.data.result.content, "typeCondition", "typeCondition", false);
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        console.log(error)
      } finally {
        this.stateLoadingConditionOptions = false;
      }
    },
    async getLookupUom() {
      const params = {
        ver: "v1"
      };
      try {
        const responseFollowUpPriorityUomLookup: AxiosResponse<any> = await ApiService.get(LOOKUP_UOM_TRANSACTION, "", new URLSearchParams(params).toString());
        this.stateUomOptions = mapOption(responseFollowUpPriorityUomLookup.data.result.content.uom);
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          const authStore = useAuthenticationStore();
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async setHeaderDeclined(header = 'Declined', pageNumber = 1, firstMount = false) {
      const authStore = useAuthenticationStore();
      await this.getTotalHeader();
      const params = {
        site: authStore.user.SiteId,
        status: header,
        ver: "v1",
        page: pageNumber.toString(),
        pageSize: "3",
      };
      try {
        this.stateLoadingHeader = true;
        const response: AxiosResponse<ApiResponse<HeaderListItem>> = await ApiService.get(GET_HEADER_LIST_ITEM_DECLINE, "", new URLSearchParams(params).toString());
        if (!firstMount) {
          this.stateHeaderListItems = response.data.result.content
          this.setTotalPage(response.data.result.total);
        }
        this.stateHeader[7].total = response.data.result.total;
      } catch (error: any) {
        if (error.response.data.statusCode == 401) {
          authStore.setLoggedIn(false);
        }
        sendErrorEvent('IRONS', error);
        console.log(error)
      } finally {
        this.stateLoadingHeader = false;
      }
    },
    mapHeaderFromExecutionIdAndDefectId(executionId: number, defectId: number | null) {
      let temp = "Pending Evaluation"

      const mappingFor9 = (defectId) => {
        switch (defectId) {
          case 1:
            temp = "Final Review"
            break;
          default:
            temp = "Closed"
            break;
        }
      }

      switch (executionId) {
        case 2:
          temp = "Submitted"
          break;
        case 3:
          temp = "Submitted"
          break;
        case 4:
          temp = "Yet to Start"
          break;
        case 5:
          temp = "In Progress"
          break;
        case 6:
          temp = "Under Review"
          break;
        case 7:
          temp = "Approved"
          break;
        case 8:
          temp = "Final Review"
          break;
        case 9:
          mappingFor9(defectId)
          break;
        default:
          temp = "Pending Evaluation"
          break;
      }

      return temp
    }
  }
});
