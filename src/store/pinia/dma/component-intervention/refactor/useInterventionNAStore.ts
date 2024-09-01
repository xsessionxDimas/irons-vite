import { defineStore } from 'pinia'
import { IDefectNAHeader } from '@/core/types/intervention/IDefectNAHeader'
import {
  useComponentInterventionDetailStore
} from './useComponentInterventionDetailStore'
import {
  NAFormData
} from '@/core/types/intervention/NAFormData'
import { IBaseDefectHeader } from '@/core/types/intervention/IBaseDefectHeader'
import {
  NADetail,
  ResponseDefectNADetail
} from '@/core/types/intervention/NADetail'
import {
  InterventionPayload
} from '@/core/types/intervention/InterventionPayload'
import {
  InterventionPayloadParam
} from '@/core/types/intervention/InterventionPayloadParam'
import { db } from '@/database/schema/DexieSchema'
import { AESTShortCurrentDateTime } from '@/core/helpers/date-format'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { SingleApiResponse } from '@/core/types/misc/SingleApiResponse'
import ApiService from '@/core/services/ApiService'
import { GET_DEFECT_HEADER, GET_DEFECT_DETAIL } from './url'
import { useOnline } from '@vueuse/core'
import {
  useInterventionFormSyncStore
} from "@/store/pinia/dma/component-intervention/refactor/useInterventionFormSyncStore"
import { Audit } from '@/core/types/intervention/Audit'
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'

export const useInterventionNAStore = defineStore({
  id: 'InterventionNAStore',
  state: () => {
    return {
      stateNAData: {} as IDefectNAHeader,
      stateIsBusy: false
    }
  },
  getters: {
    NAData: (state) => {
      return state.stateNAData
    },
    IsBusy: (state) => {
      return state.stateIsBusy
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
  },
  actions: {
    createNAData(param: NAFormData) {
      const detail = useComponentInterventionDetailStore()
      this.stateNAData.header = {} as IBaseDefectHeader
      this.stateNAData.header.workorder = detail.Intervention.sapWorkOrder
      this.stateNAData.header.form = detail.Intervention.equipmentDesc
      this.stateNAData.header.serviceSheetDetailId = ""
      this.stateNAData.header.interventionId = detail.Intervention.id
      this.stateNAData.header.interventionHeaderId = detail.Intervention.trInterventionHeaderId
      this.stateNAData.header.category = param.task.taskCategory
      this.stateNAData.header.taskId = param.task.taskKey as string
      this.stateNAData.header.taskNo = param.taskNo
      this.stateNAData.header.taskDesc = param.taskDesc
      this.stateNAData.header.defectWorkorder = ''
      this.stateNAData.header.formDefect = "DM-PL-F55"
      this.stateNAData.header.defectType = ''
      this.stateNAData.header.cbmMeasurement = ''
      this.stateNAData.header.cbmUom = ''
      this.stateNAData.header.cbmImageKey = ''
      this.stateNAData.header.cbmImageProp = ''
      this.stateNAData.header.isCbmAdjusment = ''
      this.stateNAData.header.taskValue = param.task.value
      this.stateNAData.header.repairedStatus = "Not-Repaired",
      this.stateNAData.header.cbmNAStatus = "Not-Confirm",
      this.stateNAData.header.supervisor = param.task.supervisor,
      this.stateNAData.header.status = "Submited",
      this.stateNAData.header.defectStatus = "Submited"
      this.stateNAData.detail = {} as NADetail
      this.stateNAData.detail.interventionId = param.task.id as string
      this.stateNAData.detail.type = 'N/A'
      this.stateNAData.detail.reason = param.reasonDesc != '' ? `${param.reason}:${param.reasonDesc}` : param.reason
      this.stateNAData.detail.title = param.taskDesc
    },
    createNAPayload(param: NAFormData) {
      const detail = useComponentInterventionDetailStore()
      this.createNAData(param)
      const payload = {} as InterventionPayload
      payload.headerId = param.task.headerId
      payload.id = param.task.id
      payload.employee = param.task.employee
      payload.localInterventionStatus = detail.Intervention.interventionExecution
      payload.workOrder = detail.Intervention.sapWorkOrder
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = param.task.taskKey as string
      propertyParam.propertyParams = []
      propertyParam.propertyParams.push({
        propertyName: 'taskValue',
        propertyValue: param.task.value
      })
      propertyParam.propertyParams.push({
        propertyName: 'updatedBy',
        propertyValue: JSON.stringify(param.task.employee)
      })
      propertyParam.propertyParams.push({
        propertyName: 'updatedDate',
        propertyValue: param.submitDate
      })
      payload.updateParams.push(propertyParam)
      payload.defectHeader = this.NAData.header
      payload.defectDetail = this.NAData.detail
      return payload
    },
    async submitNA(param: NAFormData) {
      const onlineStatus = useOnline();
      const detail = useComponentInterventionDetailStore()
      const interventionFormSyncStore = useInterventionFormSyncStore()
      const payload = this.createNAPayload(param)
      detail.appendTaskUpdatePayload(payload, param.task, true, false)
      let status = ''
      if (!isOfflineOrSlowInternetConnection()) {
        try {
          await interventionFormSyncStore.SyncInterventionDefectData(JSON.stringify(payload))
        } catch (error) {
          const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
          if (isNoNetwork) {
            await db.pendingTask.add({
              module: 'Intervention',
              section: 'E-Form',
              type: 'Defect',
              workorder: payload.workOrder as string,
              key: param.task.taskKey as string,
              bindingKey: param.task.taskKey as string,
              payload: JSON.stringify(payload),
              syncDate: AESTShortCurrentDateTime(),
              syncStatus: 'Pending'
            })
            status = 'Not Sync'
            await this.updateDefectDataAndUpdateOnLocal(payload, detail, param)
            return false
          } else {
            const detail = useComponentInterventionDetailStore()
            if (error == ServiceSheetErrorMessages.MODIFY_DEFECT_AFTER_SUPERVISOR_APPROVAL || error == ServiceSheetErrorMessages.CHANGE_NOT_APPLICABLE_WITHOUT_REASON) {
              detail.stateTaskErrorDialog = true
              detail.stateErrorMessageTaskErrorDialog = error as string
            } else if (error == ServiceSheetErrorMessages.SUBMITTED) {
              detail.stateFormSubmittedDialog = true
            } else if (error == ServiceSheetErrorMessages.CLOSE) {
              detail.stateFormCloseDialog = true
            }
            return true
          }
        }
        await detail.updateIntervention(true)
        status = 'Sync'
      } else {
        await db.pendingTask.add({
          module: 'Intervention',
          section: 'E-Form',
          type: 'Defect',
          workorder: payload.workOrder as string,
          key: param.task.taskKey as string,
          bindingKey: param.task.taskKey as string,
          payload: JSON.stringify(payload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
        status = 'Not Sync'
      }
      await this.updateDefectDataAndUpdateOnLocal(payload, detail, param)
    },
    async updateDefectDataAndUpdateOnLocal(payload, detail, param) {
      const row = db.interventionDefect.where({
        interventionId: payload.defectHeader?.interventionId as string,
        taskId: payload.defectHeader?.taskId as string
      })
      if (row) {
        await row.delete()
      }
      await db.interventionDefect.put({
        category: payload.defectHeader?.category as string,
        interventionId: payload.defectHeader?.interventionId as string,
        taskId: payload.defectHeader?.taskId as string,
        taskNo: payload.defectHeader?.taskNo as string,
        taskDesc: payload.defectHeader?.taskDesc as string,
        taskValue: payload.defectHeader?.taskValue as string,
        sapWorkorder: payload.workOrder as string,
        taskKey: payload.defectHeader?.taskId as string,
        type: 'N/A',
        defectData: JSON.stringify(payload.defectDetail),
        repairedStatus: payload.defectHeader?.repairedStatus as string,
        cbmNAStatus: 'Not-Confirm',
        status: payload.defectHeader?.status as string,
        plannerStatus: payload.defectHeader?.plannerStatus ? payload.defectHeader?.plannerStatus : '',
        declineReason: payload.defectHeader?.declineReason ? payload.defectHeader?.declineReason : '',
        statusSync: status,
        declineDate: payload.defectHeader?.declineDate ? payload.defectHeader?.declineDate : '',
        declineBy: payload.defectHeader?.declineBy ? payload.defectHeader?.declineBy : {} as Audit,
        createdDate: payload.defectHeader?.createdDate ? payload.defectHeader?.createdDate : '',
        createdBy: payload.defectHeader?.createdBy ? {
          id: payload.defectHeader?.createdBy.id,
          name: payload.defectHeader?.createdBy.name
        } : {} as Audit,
        updatedBy: payload.defectHeader?.updatedBy ? {
          id: payload.defectHeader?.updatedBy.id,
          name: payload.defectHeader?.updatedBy.name
        } : {} as Audit,
        updatedDate: payload.defectHeader?.updatedDate ? payload.defectHeader?.updatedDate : '',
      })
      await detail.updateLocalData(param.task)
    },
    async getNADetail(taskKey: string, interventionHeaderId: string, workOrder: string) {
      const record = await db.interventionDefect.where('taskKey').equals(taskKey).first()
      if (record) {
        return record
      } else {
        if (!isOfflineOrSlowInternetConnection()) {
          this.stateIsBusy = true
          const header = await this.getNAHeaderFromServer(taskKey, interventionHeaderId) as unknown as IBaseDefectHeader
          const detail = await this.getNADetailFromServer(taskKey, interventionHeaderId) as NADetail
          const dataDefect = {
            category: header.category,
            interventionId: header.interventionId,
            taskId: header.taskId,
            taskNo: header.taskNo,
            taskDesc: header.taskDesc,
            taskValue: header.taskValue,
            sapWorkorder: workOrder,
            taskKey: taskKey,
            type: 'N/A',
            defectData: JSON.stringify(detail),
            repairedStatus: header.repairedStatus,
            cbmNAStatus: 'Not-Confirm',
            status: header.status as string,
            plannerStatus: header.plannerStatus as string,
            declineReason: header.declineReason as string,
            statusSync: 'Sync',
            declineDate: header.declineDate,
            declineBy: header.declineBy,
            createdBy: header.createdBy,
            createdDate: header.createdDate,
            updatedBy: header.updatedBy,
            updatedDate: header.updatedDate,
          }
          await db.interventionDefect.put(dataDefect)
          this.stateIsBusy = false
          return dataDefect
        }
      }
    },
    async getNAHeaderFromServer(taskKey: string, interventionHeaderId) {
      const payload = {
        interventionHeaderId: interventionHeaderId,
        taskId: taskKey,
        isActive: "true",
        isDeleted: "false"
      }
      const response: AxiosResponse<SingleApiResponse<IDefectNAHeader>> = await ApiService.post(GET_DEFECT_HEADER, payload as AxiosRequestConfig)
      return response.data.result.content
    },
    async getNADetailFromServer(taskKey: string, interventionHeaderId) {
      const payload = {
        interventionHeaderId: interventionHeaderId,
        taskId: taskKey,
        isActive: "true",
        isDeleted: "false"
      }
      const response: AxiosResponse<SingleApiResponse<ResponseDefectNADetail>> = await ApiService.post(GET_DEFECT_DETAIL, payload as AxiosRequestConfig)
      return response.data.result.content.detail
    }
  }
})
