import { GeneralPayload } from '@/core/types/intervention/GeneralPayload'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import { Intervention } from '@/core/types/intervention/Intervention'
import { InterventionGroup } from '@/core/types/intervention/InterventionGroup'
import {
  InterventionPayload
} from '@/core/types/intervention/InterventionPayload'
import {
  InterventionPayloadParam
} from '@/core/types/intervention/InterventionPayloadParam'
import { LogObject } from '@/core/types/intervention/LogObject'
import { Section } from '@/core/types/intervention/Section'
import { StatusHistory } from '@/core/types/intervention/StatusHistory'
import { SubmitFormPayload } from '@/core/types/intervention/SubmitFormPayload'
import { TaskUpdateObject } from '@/core/types/intervention/TaskUpdateObject'
import { defineStore } from 'pinia'
import { db } from '@/database/schema/DexieSchema'
import { ImagePayload } from '@/core/types/intervention/ImagePayload'
import {
  AESTShortCurrentDateTime
} from '@/core/helpers/date-format'
import {
  cloneDeep,
  isEmpty,
  isUndefined
} from 'lodash'
import {
  RiskAssesmentValue
} from '@/core/types/intervention/RiskAssesmentValue'
import { LogParamObject } from '@/core/types/intervention/LogParamObject'
import {
  InterventionTaskProgress
} from '@/core/types/intervention/InterventionTaskProgress'
import {
  useInterventionFormSyncStore
} from "@/store/pinia/dma/component-intervention/refactor/useInterventionFormSyncStore"
import {
  useComponentInterventionDefectsIdentifiedStore
} from "@/store/pinia/dma/component-intervention/refactor/useComponentInterventionDefectsIdentifiedStore"
import {
  useComponentInterventionHeaderStore
} from "@/store/pinia/dma/component-intervention/refactor/useComponentInterventionHeaderStore"
import {
  DetailTaskAdjustmentItem
} from '@/core/types/intervention/DetailTaskAdjustmentItem'
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'
import {
  GET_DEFECTS_COUNT
} from './url';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SingleApiResponse } from '@/core/types/misc/SingleApiResponse';
import ApiService from '@/core/services/ApiService';
import { CBM_REPLACEMENT_DEFAULT_BULK_URL } from '../../e-form/urls'
import {
  IntervantionReplacementDefaultBulkPayloadType,
  ReplacementDefaultResponseType
} from '@/core/types/entities/dma/e-form/cbm/ReplacementDefaultType'
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { getPercentageTaskProgressAllTabIntervention } from '../helper'
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import { Audit } from '@/core/types/intervention/Audit'
import { sendErrorEvent } from '@/core/helpers/analytics';

export const useComponentInterventionDetailStore = defineStore({
  id: 'ComponentInterventionDetailStore',
  state: () => {
    return {
      stateSelectedIntervention: {} as Intervention,
      stateGroups: [] as InterventionGroup[],
      stateSelectedGroup: {} as InterventionGroup,
      stateSelectedTask: {} as IDetailTask,
      stateIdentifiedDefectCount: 0,
      stateLoadingTask: {},
      stateItemTriggerDisabledValue: {}, // isi value item yg trigger disabled
      stateItemKeyWithTriggeredDisabledKey: {}, // isi list semua itemDisabled : TriggerDisabledItem,
      stateIsError: false,
      stateTaskErrorDialog: false,
      stateErrorMessageTaskErrorDialog: "",
      stateSerialNumber: "",
      stateFormSubmittedDialog: false,
      stateFormCloseDialog: false
    }
  },
  getters: {
    Intervention: (state) => {
      return state.stateSelectedIntervention
    },
    Groups: (state) => {
      return state.stateGroups
    },
    Group: (state) => {
      return state.stateSelectedGroup
    },
    Task: (state) => {
      return state.stateSelectedTask
    },
    CountIdentifiedDefect: (state) => {
      return state.stateIdentifiedDefectCount
    },
    TaskProgress: (state) => {
      const taskProgress = [] as InterventionTaskProgress[]
      if (!isEmpty(state.stateSelectedIntervention)) {
        state.stateSelectedIntervention.details.forEach((selected) => {
          let taskDone = 0
          let taskTotal = 0
          selected.tasks.forEach((taskGroup) => {
            const task = taskGroup.tasks.filter((val) => {
              return !isUndefined(val.taskValue)
            })
            taskTotal = taskTotal + task.length

            task.forEach((val) => {
              if (val.taskValue) {
                taskDone = taskDone + 1
              }
            })
          })
          taskProgress.push({
            key: selected.key,
            taskDone,
            taskTotal
          })
        })
      }
      return taskProgress
    },
    LoadingTask: (state) => {
      return state.stateLoadingTask
    },
    ItemTriggerDisabledValue: (state) => {
      return state.stateItemTriggerDisabledValue
    },
    IsFilledAllRequiredItem: (state) => {
      let allFilled = true
      if (isUndefined(state.stateSelectedIntervention?.details)) {
        return allFilled
      }
      state.stateSelectedIntervention?.details[0]?.tasks?.every((group) => {
        group.tasks.every((task) => {
          task.items.every((item) => {
            if (item.customValidation == "Required" && item.value == "") {
              allFilled = false
              return false
            }
            return true
          })
          if (allFilled == false) {
            return false
          }
          return true
        })
        if (allFilled == false) {
          return false
        }
        return true
      })
      return allFilled
    },
    IsError: (state) => {
      return state.stateIsError
    },
    percentageTaskProgressAllTab: (state) => {
      return getPercentageTaskProgressAllTabIntervention(state.stateSelectedIntervention.details || [])
    },
    RiskAssessmentImages: (state) => {
      let result = [] as RiskAssesmentValue[]
      if (!state.stateSelectedIntervention) {
        return result
      }
      if (!state.stateSelectedIntervention.riskAssesment) {
        return result
      }
      if (!Array.isArray(state.stateSelectedIntervention.riskAssesment)) {
        return result
      }
      const data = state.stateSelectedIntervention.riskAssesment[0].value
      if (typeof data == 'string') return result
      result = data
      return result
    },
    taskErrorDialog: (state) => {
      return state.stateTaskErrorDialog;
    },
    errorMessageTaskErrorDialog: (state) => {
      return state.stateErrorMessageTaskErrorDialog;
    },
    serialNumber: (state) => {
      return state.stateSerialNumber
    },
    formSubmittedDialog: (state) => {
      return state.stateFormSubmittedDialog
    },
    formCloseDialog: (state) => {
      return state.stateFormCloseDialog
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
  },
  actions: {
    updateLoading(key: string, loading = false) {
      this.stateLoadingTask[key] = loading
    },
    resetLoading() {
      this.stateLoadingTask = {}
    },
    toogleTaskErrorDialog(status) {
      this.stateTaskErrorDialog = status
    },
    toogleFormSubmittedDialog(status) {
      this.stateFormSubmittedDialog = status
    },
    toogleFormCloseDialog(status) {
      this.stateFormCloseDialog = status
    },
    setItemTriggerDisabledValue(intervention: Intervention) {
      intervention.details[0].tasks.forEach((group) => {
        group.tasks.forEach((task) => {
          task.items.forEach((item) => {
            if (item.disabledByItemKey) {
              const exist = item.disabledByItemKey in this.stateItemTriggerDisabledValue
              if (!exist) {
                this.stateItemTriggerDisabledValue[item.disabledByItemKey] = ''
                this.stateItemKeyWithTriggeredDisabledKey[item.key] = item.disabledByItemKey
              }
            }
          })
        })
      })
      intervention.details[0].tasks.forEach((group) => {
        group.tasks.forEach((task) => {
          task.items.forEach((item) => {
            const existKeyOnTriggerDisabled = item.key in this.stateItemTriggerDisabledValue
            if (existKeyOnTriggerDisabled) {
              this.stateItemTriggerDisabledValue[item.key] = item.value
            }
          })
        })
      })
    },
    checkHmOffset(intervention: Intervention) {
      switch (intervention.hmOffset) {
        case undefined:
          this.stateSelectedIntervention.hmOffset = 'Not Applicable';
          break;
        case '':
          this.stateSelectedIntervention.hmOffset = '0';
          break;
        default:
          break;
      }
    },
    setGroup(intervention: Intervention) {
      this.stateSelectedIntervention = intervention
      this.checkHmOffset(intervention);
      let sequence = 2
      this.stateGroups = [
        {
          sequence: 1,
          group: "General",
          sections: [] as Section[],
          key: intervention.id
        }
      ] as InterventionGroup[]
      this.stateSelectedIntervention.details.forEach((d) => {
        this.stateGroups.push({
          sequence: sequence++,
          group: d.group,
          sections: d.tasks,
          key: d.key
        })
      })
      this.stateGroups.push({
        sequence: sequence++,
        group: "Identified Defects",
        sections: [] as Section[],
        key: "Identified Defects"
      })
    },
    setSelectedGroup(group: InterventionGroup) {
      this.stateSelectedGroup = group
    },
    initGroup(intervention: Intervention, index = 0) {
      this.setGroup(intervention)
      this.stateItemTriggerDisabledValue = {}
      this.stateItemKeyWithTriggeredDisabledKey = {}
      this.setItemTriggerDisabledValue(intervention)
      this.setSelectedGroup(this.stateGroups[index])
    },
    setSelectedTask(task: IDetailTask) {
      this.stateSelectedTask = task
    },
    resetIntervention() {
      this.stateSelectedIntervention = {} as Intervention
      this.stateFormCloseDialog = false
      this.stateFormSubmittedDialog = false
    },
    getTaskById(taskId: string) {
      let task: IDetailTask | undefined = undefined
      this.Intervention.details[0].tasks.forEach((g) => {
        g.tasks.forEach((t) => {
          if (t.key == taskId) {
            task = t
          }
        })
      })
      return task
    },
    createTaskUpdatePayload(params: TaskUpdateObject, isDefect = false) {
      const detail = useComponentInterventionDetailStore()
      const payload = {} as InterventionPayload
      payload.employee = params.employee
      payload.localInterventionStatus = detail.Intervention.interventionExecution
      payload.headerId = params.id as string
      payload.id = params.id as string
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = params.itemKey
      propertyParam.propertyParams = []
      if (params.taskCategory == 'Adjustment') {
        let propertyName = ''
        switch (params.type) {
          case 'rating':
            propertyName = 'rating'
            break;
          case 'inputUom':
            propertyName = 'measurement'
            break;
          case 'commentValue':
            propertyName = 'commentValue'
            break;
        }
        propertyParam.propertyParams.push({
          propertyName: propertyName,
          propertyValue: params.value
        })
        propertyParam.propertyParams.push({
          propertyName: 'updatedBy',
          propertyValue: params.isOutOfRange ? "" : JSON.stringify(params.employee)
        })
        propertyParam.propertyParams.push({
          propertyName: 'updatedDate',
          propertyValue: params.isOutOfRange ? "" : params.timeStamp
        })
      } else {
        propertyParam.propertyParams.push({
          propertyName: 'value',
          propertyValue: params.value
        })
        propertyParam.propertyParams.push({
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(params.employee)
        })
        propertyParam.propertyParams.push({
          propertyName: 'updatedDate',
          propertyValue: params.timeStamp
        })
      }
      payload.updateParams.push(propertyParam)
      const taskReplacement = params.task.rating == 'AUTOMATIC_REPLACEMENT' || params.task.rating == 'AUTOMATIC_REPLACEMENT_GAP'
      if ((params.type == 'condition' || (params.type == 'rating' && !taskReplacement)) && !isDefect) {
        const taskPropertyParam = {} as InterventionPayloadParam
        taskPropertyParam.keyValue = params.taskKey as string
        taskPropertyParam.propertyParams = []
        taskPropertyParam.propertyParams.push({
          propertyName: 'taskValue',
          propertyValue: params.value
        })
        taskPropertyParam.propertyParams.push({
          propertyName: 'updatedBy',
          propertyValue: params.value ? JSON.stringify(params.employee) : ""
        })
        taskPropertyParam.propertyParams.push({
          propertyName: 'updatedDate',
          propertyValue: params.value ? params.timeStamp : ""
        })
        const reason = params.reason || ""
        // if old value NA
        if (params.task.taskValue == '4') {
          taskPropertyParam.propertyParams.push({
            propertyName: 'reason',
            propertyValue: reason
          })
        } else {
          taskPropertyParam.propertyParams.push({
            propertyName: 'reason',
            propertyValue: ""
          })
        }
        if (params.task.rating == 'AUTOMATIC_REPLACEMENT' || params.task.rating == 'AUTOMATIC_REPLACEMENT_GAP') {
          if (params.type == "condition") {
            taskPropertyParam.propertyParams.push({
              propertyName: 'taskNormalValue',
              propertyValue: params.value
            })
          }
        }
        payload.updateParams.push(taskPropertyParam)
      }
      if (params.taskCategory == 'CBM' && (params.task.rating == 'NORMAL' || params.task.rating == 'AUTOMATIC_REPLACEMENT' || params.task.rating == 'AUTOMATIC_REPLACEMENT_GAP')) {
        const taskPropertyParam = {} as InterventionPayloadParam
        taskPropertyParam.keyValue = params.taskKey as string
        taskPropertyParam.propertyParams = []
        if (params.task.rating == 'NORMAL') {
          taskPropertyParam.propertyParams.push({
            propertyName: 'taskNormalValue',
            propertyValue: params.type == 'rating' ? "" : params.value
          })
        }
        if (taskPropertyParam.propertyParams.length > 0) {
          payload.updateParams.push(taskPropertyParam)
        }

        if (params.task.rating == 'NORMAL') {
          const restItem = params.task.items.find((val) => {
            return ((params.type == 'rating' && val.valueItemType == 'condition') || (params.type == 'condition' && val.valueItemType == 'rating')) && val.itemType == 'dropDown'
          })
          if (restItem) {
            const resetPropertyParam = {} as InterventionPayloadParam
            resetPropertyParam.keyValue = restItem.key
            resetPropertyParam.propertyParams = []
            resetPropertyParam.propertyParams.push({
              propertyName: 'value',
              propertyValue: ""
            })
            resetPropertyParam.propertyParams.push({
              propertyName: 'updatedBy',
              propertyValue: JSON.stringify(params.employee)
            })
            resetPropertyParam.propertyParams.push({
              propertyName: 'updatedDate',
              propertyValue: params.timeStamp
            })
            payload.updateParams.push(resetPropertyParam)
          }
        }
      }
      // update task yg kedisabled saat pilih NA (4)
      if (params.value == "4") {
        const resetItemKeys = Object.keys(this.stateItemKeyWithTriggeredDisabledKey).filter((key) => {
          return this.stateItemKeyWithTriggeredDisabledKey[key] === params.itemKey
        });
        resetItemKeys.forEach((key) => {
          const resetPropertyParam = {} as InterventionPayloadParam
          resetPropertyParam.keyValue = key
          resetPropertyParam.propertyParams = []
          resetPropertyParam.propertyParams.push({
            propertyName: 'value',
            propertyValue: ""
          })
          resetPropertyParam.propertyParams.push({
            propertyName: 'updatedBy',
            propertyValue: JSON.stringify(params.employee)
          })
          resetPropertyParam.propertyParams.push({
            propertyName: 'updatedDate',
            propertyValue: params.timeStamp
          })
          payload.updateParams.push(resetPropertyParam)
        })
      }
      payload.workOrder = params.workOrder as string
      return payload
    },
    createResetTaskAdjustmentPayload(params: TaskUpdateObject) {
      const detail = useComponentInterventionDetailStore()
      const payload = {} as InterventionPayload
      payload.employee = params.employee
      payload.localInterventionStatus = detail.Intervention.interventionExecution
      payload.headerId = params.id as string
      payload.id = params.id as string
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = params.itemKey
      propertyParam.propertyParams = []
      propertyParam.propertyParams.push({
        propertyName: 'measurement',
        propertyValue: ""
      })
      propertyParam.propertyParams.push({
        propertyName: 'rating',
        propertyValue: ""
      })
      propertyParam.propertyParams.push({
        propertyName: 'updatedBy',
        propertyValue: ""
      })
      propertyParam.propertyParams.push({
        propertyName: 'updatedDate',
        propertyValue: ""
      })
      propertyParam.propertyParams.push({
        propertyName: 'commentValue',
        propertyValue: ""
      })

      payload.updateParams.push(propertyParam)

      payload.workOrder = params.workOrder as string
      return payload
    },
    async updateHeaderData(data: GeneralPayload) {
      if (this.stateSelectedIntervention.interventionSMU == '' || this.stateSelectedIntervention.interventionSMU == null) {
        this.stateSelectedIntervention.interventionSMU = data.smu.replaceAll(',', '')
      }
      if (this.stateSelectedIntervention.serviceStart == '') {
        this.stateSelectedIntervention.serviceStart = data.serviceStart
      }
      this.stateSelectedIntervention.log = data.logs as LogObject[]
      this.stateSelectedIntervention.interventionExecution = data.status
      this.stateSelectedIntervention.supervisor = data.employee
      this.stateSelectedIntervention.updatedBy = data.log.employee
      this.stateSelectedIntervention.statusHistory.push(data.history as StatusHistory)
      await db.interventionDetail.put(cloneDeep(this.stateSelectedIntervention))
    },
    // ensure that image equipment is always one file
    async  updateEquipmentImageData(data: ImagePayload) {
      const existing = [] as ImageInfo[]
      this.stateSelectedIntervention.imageEquipment = [
        ...existing,
        ...data.files
      ]
      this.stateSelectedIntervention.supervisor = data.employee
      this.stateSelectedIntervention.updatedBy = data.employee
      await db.interventionDetail.put(cloneDeep(this.stateSelectedIntervention))
    },
    async deleteImageFromEquipmentImage(filename: string) {
      let existing = this.stateSelectedIntervention.imageEquipment ? this.stateSelectedIntervention.imageEquipment as string[] : [] as string[]
      existing = existing.filter((i) => {
        return i != filename
      })
      this.stateSelectedIntervention.imageEquipment = existing
      await db.interventionDetail.put(cloneDeep(this.stateSelectedIntervention))
    },
    async updateRiskAssesmentImageData(preRiskImages: RiskAssesmentValue[], log: LogParamObject) {
      const existing = this.stateSelectedIntervention.log?.find((l) => {
        return l.employee.id == log.employee.id
      })
      if (existing) {
        existing.timeLoggedIn.push(log.timeLoggedIn)
        existing.riskPhotos = []
        existing.isIHaveReadChecked = true
      } else {
        if (this.stateSelectedIntervention.log == null) {
          this.stateSelectedIntervention.log = [] as LogObject[]
        }
        this.stateSelectedIntervention.log.push({
          employee: log.employee,
          timeLoggedIn: [log.timeLoggedIn],
          shift: log.shift,
          isIHaveReadChecked: true,
          riskPhotos: []
        })
      }
      this.stateSelectedIntervention.riskAssesment[0].value = preRiskImages
      await db.interventionDetail.put(cloneDeep(this.stateSelectedIntervention))
    },
    async deleteRiskAssesmentImage(filename: string, log: LogParamObject) {
      const existing = this.stateSelectedIntervention.log?.find((l) => {
        return l.employee.id == log.employee.id
      })
      if (existing) {
        // need to convert old value to new scheme
        existing.riskPhotos = stringToImageInfoConvert(existing.riskPhotos)
      }
      this.stateSelectedIntervention.riskAssesment[0].value = (this.stateSelectedIntervention.riskAssesment[0].value as RiskAssesmentValue[]).filter((i) => {
        return (i.image as ImageInfo).filename != filename
      })
      await db.interventionDetail.put(cloneDeep(this.stateSelectedIntervention))
    },
    async updateHeaderDataWhenSubmitted(data: SubmitFormPayload) {
      this.stateSelectedIntervention.interventionExecution = data.status
      this.stateSelectedIntervention.updatedBy = data.employee
      this.stateSelectedIntervention.statusHistory.push(data.history as StatusHistory)
      await db.interventionDetail.put(cloneDeep(this.stateSelectedIntervention))
    },
    async updateLocalData(params: TaskUpdateObject) {
      const clonedTask = cloneDeep(params.task)
      const tasks = this.stateSelectedIntervention.details[0].tasks
      let task: IDetailTask | undefined
      tasks.every((t) => {
        task = t.tasks.find((it) => {
          return it.key == params.taskKey
        })
        if (task) {
          return false
        }
        return true
      })
      if (!task) return

      if (params.taskCategory == 'Adjustment') {
        const adjustmentData = task.adjustment as DetailTaskAdjustmentItem
        if (params.type == 'rating') {
          adjustmentData.rating = params.value
        } else if (params.type == 'inputUom') {
          adjustmentData.measurement = params.value
        }
        adjustmentData.updatedBy = params.employee
        adjustmentData.updatedDate = params.timeStamp
      } else {
        if (params.type == 'condition' || params.type == 'rating') {
          task.taskValue = params.value
          task.updatedBy = params.employee
          task.updatedDate = params.timeStamp
          task.reason = params.reason || ""
          if (clonedTask.reason) {
            task.reason = clonedTask.reason
          }
          if ((task.taskNormalValue || task.taskNormalValue == "") && params.type == "condition") {
            task.taskNormalValue = params.value
          }
          if (params.taskCategory == 'CBM-NORMAL' || (params.task.category == "CBM" && params.task.rating == "NORMAL")) {
            if (params.type == 'condition') {
              const ratingItem = task.items.find((i) => {
                return i.valueItemType == 'rating'
              })
              if (!ratingItem) return
              ratingItem.value = ""
              ratingItem.updatedBy = params.employee
              ratingItem.updatedDate = params.timeStamp
              params.task.images = ""
            } else {
              const conditionItem = task.items.find((i) => {
                return i.valueItemType == 'condition'
              })
              if (!conditionItem) {
                if (params.type == 'rating') {
                  const ratingItem = task.items.find((i) => {
                    return i.valueItemType == 'rating'
                  })
                  if (!ratingItem) return
                  ratingItem.value = params.value
                  ratingItem.updatedBy = params.employee
                  ratingItem.updatedDate = params.timeStamp
                }
                return
              }
              conditionItem.value = ""
              conditionItem.updatedBy = params.employee
              conditionItem.updatedDate = params.timeStamp
            }
          }
        }
        if (params.type == 'images') {
          task.images = params.value
          await db.interventionDetail.put(cloneDeep(this.stateSelectedIntervention))
          return
        }

        const item = task.items.find((i) => {
          return i.key == params.itemKey
        })
        if (!item) return
        item.value = params.value
        item.updatedBy = params.employee
        item.updatedDate = params.timeStamp

        // update task yg kedisabled saat pilih NA (4)
        if (params.value == "4") {
          const resetItemKeys = Object.keys(this.stateItemKeyWithTriggeredDisabledKey).filter((key) => {
            return this.stateItemKeyWithTriggeredDisabledKey[key] === params.itemKey
          })
          resetItemKeys.forEach((key) => {
            const item = task && task.items.find((i) => {
              return i.key == key
            })
            if (!item) return
            item.value = ""
            item.updatedBy = params.employee
            item.updatedDate = params.timeStamp
          })
        }
      }
      await db.interventionDetail.put(cloneDeep(this.stateSelectedIntervention))
      const defectIdentifiedStore = useComponentInterventionDefectsIdentifiedStore()
      defectIdentifiedStore.setDefectIdentifiedData(this.Intervention.sapWorkOrder)
    },
    async updateLocalTaskCBMImageData(params: TaskUpdateObject) {
      const tasks = this.stateSelectedIntervention.details[0].tasks
      let task: IDetailTask | undefined
      tasks.every((t) => {
        task = t.tasks.find((it) => {
          return it.key == params.taskKey
        })
        if (task) {
          return false
        }
        return true
      })
      if (!task) return
      task.images = JSON.parse(params.value)
      await db.interventionDetail.put(cloneDeep(this.stateSelectedIntervention))
    },
    async updateLocalAutoCBM(params: TaskUpdateObject) {
      const tasks = this.stateSelectedIntervention.details[0].tasks
      let task: IDetailTask | undefined
      tasks.every((t) => {
        task = t.tasks.find((it) => {
          return it.key == params.taskKey
        })
        if (task) {
          return false
        }
        return true
      })
      if (!task) return
      const item = task.items.find((i) => {
        return i.categoryItemType == 'targetRating'
      })
      if (!item) return
      item.value = params.value
      item.updatedBy = params.value ? params.employee : ""
      item.updatedDate = params.value ? params.timeStamp : ""
      localStorage.setItem('itemKey', item.key)
    },
    async appendTaskUpdatePayload(payload: InterventionPayload, params: TaskUpdateObject, isDefect: boolean, isResetAdjustment = false) {
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = params.itemKey
      propertyParam.propertyParams = []
      if (params.taskCategory == 'Adjustment') {
        let propertyName = ''
        switch (params.type) {
          case 'rating':
            propertyName = 'rating'
            break;
          case 'inputUom':
            propertyName = 'measurement'
            break;
          case 'commentValue':
            propertyName = 'commentValue'
            break;
        }
        propertyParam.propertyParams.push({
          propertyName: propertyName,
          propertyValue: params.value
        })
        const checkIsRatingAndEmpty = params.type == 'rating' && params.value == ""
        propertyParam.propertyParams.push({
          propertyName: 'updatedBy',
          propertyValue: checkIsRatingAndEmpty ? "" : JSON.stringify(params.employee)
        })
        propertyParam.propertyParams.push({
          propertyName: 'updatedDate',
          propertyValue: checkIsRatingAndEmpty ? "" : params.timeStamp
        })
      } else {
        propertyParam.propertyParams.push({
          propertyName: 'value',
          propertyValue: params.value
        })
        propertyParam.propertyParams.push({
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(params.employee)
        })
        propertyParam.propertyParams.push({
          propertyName: 'updatedDate',
          propertyValue: params.timeStamp
        })
      }
      payload.updateParams.push(propertyParam)
      if ((params.type == 'condition' || params.type == 'rating') && !isDefect) {
        const taskPropertyParam = {} as InterventionPayloadParam
        taskPropertyParam.keyValue = params.taskKey as string
        taskPropertyParam.propertyParams = []
        taskPropertyParam.propertyParams.push({
          propertyName: 'taskValue',
          propertyValue: params.value
        })
        taskPropertyParam.propertyParams.push({
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(params.employee)
        })
        taskPropertyParam.propertyParams.push({
          propertyName: 'updatedDate',
          propertyValue: params.timeStamp
        })
        payload.updateParams.push(taskPropertyParam)
      }
      if (params.taskCategory == 'CBM' && (params.task.rating == 'NORMAL' || params.task.rating == 'AUTOMATIC_REPLACEMENT' || params.task.rating == 'AUTOMATIC_REPLACEMENT_GAP')) {
        const taskPropertyParam = {} as InterventionPayloadParam
        taskPropertyParam.keyValue = params.taskKey as string
        taskPropertyParam.propertyParams = []
        const isAutoReplacementAndCondInput = (params.task.rating == 'AUTOMATIC_REPLACEMENT' || params.task.rating == 'AUTOMATIC_REPLACEMENT_GAP') && params.type == "condition"
        const isNormarInput = params.task.rating == 'NORMAL'
        if (isAutoReplacementAndCondInput || isNormarInput) {
          taskPropertyParam.propertyParams.push({
            propertyName: 'taskNormalValue',
            propertyValue: params.type == 'rating' ? "" : params.value
          })
        }
        if (isNormarInput && params.type == "condition" && params.value == "4") {
          if (params.task.images) {
            if (params.task.images?.length > 0) {
              taskPropertyParam.propertyParams.push({
                propertyName: 'images',
                propertyValue: ""
              })
            }
          }
        }
        payload.updateParams.push(taskPropertyParam)

        if (params.task.rating == 'NORMAL') {
          const restItem = params.task.items.find((val) => {
            return ((params.type == 'rating' && val.valueItemType == 'condition') || (params.type == 'condition' && val.valueItemType == 'rating')) && val.itemType == 'dropDown'
          })
          if (restItem) {
            const resetPropertyParam = {} as InterventionPayloadParam
            resetPropertyParam.keyValue = restItem.key
            resetPropertyParam.propertyParams = []
            resetPropertyParam.propertyParams.push({
              propertyName: 'value',
              propertyValue: ""
            })
            resetPropertyParam.propertyParams.push({
              propertyName: 'updatedBy',
              propertyValue: JSON.stringify(params.employee)
            })
            resetPropertyParam.propertyParams.push({
              propertyName: 'updatedDate',
              propertyValue: params.timeStamp
            })
            payload.updateParams.push(resetPropertyParam)
          }
        }

        // --------- jika input NA, reset imagenya --------
        if (params.task.rating == 'AUTOMATIC_REPLACEMENT' || params.task.rating == 'AUTOMATIC_REPLACEMENT_GAP') {
          const resetPropertyParam = {} as InterventionPayloadParam
          resetPropertyParam.keyValue = params.task.key
          resetPropertyParam.propertyParams = []
          resetPropertyParam.propertyParams.push({
            propertyName: 'images',
            propertyValue: ""
          })
          payload.updateParams.push(resetPropertyParam)
        }
        // --------- jika input NA, reset imagenya --------
      }
      if (params.value == "4") {
        const resetItemKeys = Object.keys(this.stateItemKeyWithTriggeredDisabledKey).filter((key) => {
          return this.stateItemKeyWithTriggeredDisabledKey[key] === params.itemKey
        });
        resetItemKeys.forEach((key) => {
          const resetPropertyParam = {} as InterventionPayloadParam
          resetPropertyParam.keyValue = key
          resetPropertyParam.propertyParams = []
          resetPropertyParam.propertyParams.push({
            propertyName: 'value',
            propertyValue: ""
          })
          resetPropertyParam.propertyParams.push({
            propertyName: 'updatedBy',
            propertyValue: JSON.stringify(params.employee)
          })
          resetPropertyParam.propertyParams.push({
            propertyName: 'updatedDate',
            propertyValue: params.timeStamp
          })
          payload.updateParams.push(resetPropertyParam)
        })
      }

      const defectIdentifiedStore = useComponentInterventionDefectsIdentifiedStore()
      defectIdentifiedStore.setDefectIdentifiedData(this.Intervention.sapWorkOrder)
    },
    async getCountIdentifiedDefect() {
      const params = {
        ver: "v1",
        interventionId: this.stateSelectedIntervention.id,
      };
      try {
        if (isOfflineOrSlowInternetConnection()) {
          return
        }
        const response: AxiosResponse<SingleApiResponse<any>> =
          await ApiService.get(
            `${GET_DEFECTS_COUNT}`,
            '',
            new URLSearchParams(params).toString()
          );
        const foundedCount = response.data.result.content;
        this.stateIdentifiedDefectCount = foundedCount.identifiedDefectCount;
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async updateFormDataFromServer() {
      const interventionHeaderStore = useComponentInterventionHeaderStore();
      const detailJSON = await interventionHeaderStore.getWorkOrderDetailById(this.Intervention.keyPbi)
      this.stateSelectedIntervention = detailJSON as Intervention
      this.setGroup(detailJSON as Intervention)
      this.setSelectedGroup(this.stateGroups[this.stateSelectedGroup.sequence - 1])
    },
    async updateTask(data: TaskUpdateObject, isDefect = false, isResetAdjustment = false) {
      this.stateIsError = false
      const interventionFormSyncStore = useInterventionFormSyncStore();
      data.headerId = this.stateSelectedIntervention.id
      data.id = this.stateSelectedIntervention.id
      data.workOrder = this.stateSelectedIntervention.sapWorkOrder
      const exists = data.itemKey in this.stateItemTriggerDisabledValue
      if (exists) {
        this.stateItemTriggerDisabledValue[data.itemKey] = data.value
      }
      let payload = {}
      if (isResetAdjustment) {
        payload = this.createResetTaskAdjustmentPayload(data)
      } else {
        payload = this.createTaskUpdatePayload(data, isDefect)
      }
      if (!isOfflineOrSlowInternetConnection()) {
        this.LoadingTask[data.itemKey] = true
        try {
          await interventionFormSyncStore.SyncInterventionTaskData(JSON.stringify(payload))
          await this.updateFormDataFromServer()
        } catch (error) {
          const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
          if (isNoNetwork) {
            await db.pendingTask.add({
              module: 'Intervention',
              section: 'E-Form',
              type: 'Task',
              workorder: data.workOrder,
              key: data.taskKey as string,
              bindingKey: data.taskKey as string,
              payload: JSON.stringify(payload),
              syncDate: AESTShortCurrentDateTime(),
              syncStatus: 'Pending'
            })
            await this.updateLocalData(data)

            this.LoadingTask[data.itemKey] = false

            const defectIdentifiedStore = useComponentInterventionDefectsIdentifiedStore()
            defectIdentifiedStore.setDefectIdentifiedData(this.Intervention.sapWorkOrder)
          } else {
            if (error == ServiceSheetErrorMessages.MODIFY_DEFECT_AFTER_SUPERVISOR_APPROVAL || error == ServiceSheetErrorMessages.CHANGE_NOT_APPLICABLE_WITHOUT_REASON) {
              this.stateTaskErrorDialog = true
              this.stateErrorMessageTaskErrorDialog = error as string
            } else if (error == ServiceSheetErrorMessages.SUBMITTED) {
              this.stateFormSubmittedDialog = true
            } else if (error == ServiceSheetErrorMessages.CLOSE) {
              this.stateFormCloseDialog = true
            }
            this.stateIsError = true
          }
        }
        this.LoadingTask[data.itemKey] = false
      } else {
        await db.pendingTask.add({
          module: 'Intervention',
          section: 'E-Form',
          type: 'Task',
          workorder: data.workOrder,
          key: data.taskKey as string,
          bindingKey: data.taskKey as string,
          payload: JSON.stringify(payload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
        await this.updateLocalData(data)
      }

      const defectIdentifiedStore = useComponentInterventionDefectsIdentifiedStore()
      defectIdentifiedStore.setDefectIdentifiedData(this.Intervention.sapWorkOrder)
    },
    async updateIntervention(reinit = false) {
      const interventionHeaderStore = useComponentInterventionHeaderStore()
      const detailJSON = await interventionHeaderStore.getWorkOrderDetailById(this.Intervention.keyPbi)
      await db.interventionDetail.put(detailJSON as Intervention)
      this.stateSelectedIntervention = detailJSON as Intervention
      if (reinit) {
        this.setGroup(detailJSON as Intervention)
        this.setSelectedGroup(this.stateGroups[this.stateSelectedGroup.sequence - 1])
      }
    },
    async updateSMU(params: {
      value: string,
      smuBy: Audit,
      smuDate: string
    }) {
      this.stateSelectedIntervention.interventionSMU = params.value
      this.stateSelectedIntervention.smuBy = params.smuBy
      this.stateSelectedIntervention.smuDate = params.smuDate
    },
    async discardGeneralChanges() {
      this.stateSelectedIntervention.imageEquipment = ""
      this.stateSelectedIntervention.log = null
      this.stateSelectedIntervention.riskAssesment[0].value = ''
      this.stateSelectedIntervention.servicePersonnels = []
      await db.interventionDetail.put(cloneDeep(this.stateSelectedIntervention))
    },
    setSerialNumber(serialNumber: string) {
      this.stateSerialNumber = serialNumber
    },
    async saveReplacementPreviousValue(): Promise<void> {
      const replacementDefaultPayload: IntervantionReplacementDefaultBulkPayloadType = {
        modelId: this.Intervention.equipmentDesc,
        type: "intervention"
      }
      try {
        const params = new URLSearchParams({ ver: "v1" }).toString()
        const response: AxiosResponse<SingleApiResponse<ReplacementDefaultResponseType[]>> = await ApiService.post(`${CBM_REPLACEMENT_DEFAULT_BULK_URL}?${params}`, replacementDefaultPayload as AxiosRequestConfig)
        const defaultValueArr = response.data.result.content ?? []
        await db.intervetionReplacementDefaultValue.put({
          id: this.Intervention.id,
          defaultValues: cloneDeep(defaultValueArr)
        })
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log("error get bulk default values", error)
      }
    },
    async getReplacementDefaultValueByTask(task: IDetailTask): Promise<string> {
      let returnVal = ""
      let taskCollection: ReplacementDefaultResponseType[] = []
      const taskCollectionDB = await db.intervetionReplacementDefaultValue.where({
        id: this.Intervention.id
      }).first()
      if (taskCollectionDB) {
        taskCollection = taskCollectionDB.defaultValues
      }
      const defaultVal = taskCollection.find((dbTask) => {
        const isSameTaskId = dbTask.taskId == task.key
        const isSamePsType = task.psType == dbTask.psTypeId
        const isSameRating = task.rating == dbTask.rating
        return isSameTaskId && isSamePsType && isSameRating
      }) as ReplacementDefaultResponseType

      if (defaultVal) {
        returnVal = defaultVal.defaultValue
      }
      return returnVal
    },
    async checIsReadySubmitInterventionData() {
      const isFormComplete = this.TaskProgress.every((task) => {
        return task.taskDone === task.taskTotal;
      });
      if (isFormComplete) {
        if (!isOfflineOrSlowInternetConnection()) {
          const interventionHeaderStore = useComponentInterventionHeaderStore();
          const status = await interventionHeaderStore.getExisitingSMU({
            id: this.Intervention.id,
            key: this.Intervention.key,
            propertyName: 'interventionExecution'
          })
          if (status == "On Progress") {
            return true
          }
          return false
        } else if (this.Intervention.interventionExecution == 'On Progress') {
          return true
        }
      }
      return false
    }
  }
})
