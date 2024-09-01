import { defineStore } from 'pinia'
import ApiService from '@/core/services/ApiService'
import { SingleApiResponse } from '@/core/types/misc/SingleApiResponse'
import { db } from '@/database/schema/DexieSchema'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import {
  UPDATE_DATA,
  UPDATE_DATA_TASK,
  UPDATE_TASK_WITH_DEFECT,
  POST_GENERIC_DEFECT,
  UPLOAD_URL,
  UPDATE_DEFECT_DETAIL,
  UPDATE_DEFECT_DETAIL_BY_FITTER,
  UPDATE_SERVICE_SHEET_HEADER,
  UPDATE_SERVICE_SHEET_DETAIL,
  UPDATE_SERVICE_SHEET_DEFECT_TASK,
  UPDATE_SERVICE_FORM_DEFECT_DATA,
  UPDATE_SERVICE_SHEET_DEFECT_TASK_MULTIPLE,
  UPDATE_SERVICE_FORM_DEFECT_DETAIL_FITTER,
  updateHeaderSC,
  updateTaskSC,
  UPDATE_SERVICE_FORM_GENERIC_DEFECT,
  UPDATE_SERVICE_SHEET_HEADER_SUBMIT
} from './url'
import {
  useComponentInterventionHeaderStore
} from './useComponentInterventionHeaderStore'
import { SyncResult } from '@/core/types/intervention/SyncResult'
import { SyncMessage } from '@/database/schema/SyncMessage'
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import { cloneDeep, isUndefined } from 'lodash'
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import {
  addRecord,
  clearRecords,
  excludeSingleQuery,
  getPrimaryKeys,
  includeQuery,
  tableToArray,
  updateRecord
} from '@/database/schema/DatabaseWrapper'
import { IndexableType } from 'dexie'
import {
  usePendingTaskMonitorListStore
} from '@/store/pinia/dma/pending-task-monitor/usePendingTaskMonitorListStore'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { QueueTask } from '@/database/schema/QueueTask'
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import { AESTShortCurrentDateTime } from '@/core/helpers/date-format'
import { QueueFileTask } from '@/database/schema/QueueFileTask'
import { sendErrorEvent } from '@/core/helpers/analytics';

type ResponseStatus = {
  status: boolean
  statusCode: number,
  error?: string
}

const responseMessages = [
  ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER,
  ServiceSheetErrorMessages.CHANGE_NOT_APPLICABLE_WITHOUT_REASON,
  ServiceSheetErrorMessages.MODIFY_DEFECT_AFTER_SUPERVISOR_APPROVAL,
  ServiceSheetErrorMessages.SUBMITTED,
  ServiceSheetErrorMessages.CLOSE
]

export const useInterventionFormSyncStore = defineStore({
  id: 'InterventionFormSyncStore',
  state: () => {
    return {
      stateInSync: false,
      stateSyncTasks: [] as SyncMessage[],
      stateKeys: [] as IndexableType[],
      stateInSyncBindingKeys: [] as string[]
    }
  },
  getters: {
    WorkOrder: (state) => {
      return state.stateInSync
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
  },
  actions: {
    async syncImageToBlobStorage(payload: FormData, email: string) {
      const params = {
        ver: "v1",
        userAccount: email
      };
      try {
        const response: AxiosResponse<SingleApiResponse<string>> = await ApiService.post(`${UPLOAD_URL}?${new URLSearchParams(params).toString()}`,
        payload as AxiosRequestConfig);
        return {
          status: true,
          statusCode: response.data.statusCode
        };
      } catch (error: unknown) {
        sendErrorEvent('IRONS', error);
        return {
          status: false,
          statusCode: 0,
          error: typeof (error) == 'object' ? (error as Error).message : error as string
        }
      }
    },
    async SyncInterventionGeneralData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_DATA, payload as AxiosRequestConfig)
        if (response.data.result.isError) {
          if (responseMessages.includes(response.data.result.message)) {
            throw response.data.result.message
          } else {
            throw "error sync"
          }
        }
      } catch (error: unknown) {
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        const errorMessage = error as string
        sendErrorEvent('IRONS', error);
        if (responseMessages.includes(errorMessage)) {
          throw error
        } else if (isNoNetwork) {
          throw error
        } else {
          throw "error sync"
        }
      }
    },
    async SyncServiceFormGeneralData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_SHEET_HEADER, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormSubmitGeneralData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_SHEET_HEADER_SUBMIT, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncInterventionTaskData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const messages = [
        ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER,
        ServiceSheetErrorMessages.CHANGE_NOT_APPLICABLE_WITHOUT_REASON,
        ServiceSheetErrorMessages.MODIFY_DEFECT_AFTER_SUPERVISOR_APPROVAL,
        ServiceSheetErrorMessages.SUBMITTED,
        ServiceSheetErrorMessages.CLOSE
      ]
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_DATA_TASK, payload as AxiosRequestConfig)
        if (response.data.result.isError) {
          if (messages.includes(response.data.result.message)) {
            throw response.data.result.message
          } else {
            throw "error sync"
          }
        }
      } catch (error: unknown) {
        sendErrorEvent('IRONS', error);
        const errorMessage = error as string
        if (messages.includes(errorMessage)) {
          throw error
        } else if (this.globalConnectionStore.checkIsErrorNoNetwork(error as string)) {
          throw error
        } else {
          throw "error sync"
        }
      }
    },
    async SyncServiceFormTaskData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_SHEET_DETAIL, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncInterventionDefectData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const messages = [
        ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER,
        ServiceSheetErrorMessages.CHANGE_NOT_APPLICABLE_WITHOUT_REASON,
        ServiceSheetErrorMessages.MODIFY_DEFECT_AFTER_SUPERVISOR_APPROVAL,
        ServiceSheetErrorMessages.SUBMITTED,
        ServiceSheetErrorMessages.CLOSE
      ]
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_TASK_WITH_DEFECT, payload as AxiosRequestConfig)
        if (response.data.result.isError) {
          if (messages.includes(response.data.result.message)) {
            throw response.data.result.message
          } else {
            throw "error sync"
          }
        }
      } catch (error: unknown) {
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        const errorMessage = error as string
        sendErrorEvent('IRONS', error);
        if (messages.includes(errorMessage)) {
          throw error
        } else if (isNoNetwork) {
          throw error
        } else {
          throw "error sync"
        }
      }
    },
    async SyncInterventionGenericDefectData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(POST_GENERIC_DEFECT, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw "error sync"
      }
    },
    async SyncInterventionDefectDataDefectIdentified(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_DEFECT_DETAIL_BY_FITTER, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw "error sync"
      }
    },
    async SyncServiceFormDefectData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_SHEET_DEFECT_TASK, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormMultipleDefectData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_SHEET_DEFECT_TASK_MULTIPLE, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormFitterUpdateDefectData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_FORM_DEFECT_DETAIL_FITTER, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormUpdateGenericDefectData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_FORM_GENERIC_DEFECT, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormPostCalibrationHeaderData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(updateHeaderSC, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormPostCalibrationDetailData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(updateTaskSC, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncInterventionUpdateDefectData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_DEFECT_DETAIL, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw "error sync"
      }
    },
    async SyncServiceFormUpdateDefectData(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_FORM_DEFECT_DATA, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncInterventionGeneralDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_DATA, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormGeneralDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_SHEET_HEADER, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormSubmitGeneralDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_SHEET_HEADER_SUBMIT, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncInterventionTaskDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_DATA_TASK, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormTaskDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_SHEET_DETAIL, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncInterventionDefectDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_TASK_WITH_DEFECT, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormDefectDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_SHEET_DEFECT_TASK, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormUpdateGenericDefectDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_FORM_GENERIC_DEFECT, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormDefectMultipleDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_SHEET_DEFECT_TASK_MULTIPLE, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormFitterUpdateDefectDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_SERVICE_FORM_DEFECT_DETAIL_FITTER, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncInterventionUpdateDefectDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_DEFECT_DETAIL, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormUpdateDefectDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(UPDATE_DEFECT_DETAIL, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormPostCalibrationHeaderDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(updateHeaderSC, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async SyncServiceFormPostCalibrationDetailDataRetry(stringObject: string) {
      const payload = JSON.parse(stringObject)
      const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(updateTaskSC, payload as AxiosRequestConfig)
      if (response.data.result.isError) {
        throw response.data.result.message
      }
    },
    async RemoveTemplate(stringObject: string, workOrder: string) {
      const authStore = useAuthenticationStore()
      /* need to delete local template */
      const payload = JSON.parse(stringObject)
      await db.interventionDetail.delete(payload.id as string)
      await db.interventionHeader.filter((r) => {
        return r.sapWorkOrder == workOrder
      }).delete()
      /* need to update oustanding local */
      const header = useComponentInterventionHeaderStore()
      if (authStore.user.SiteId) {
        await header.syncWorkOrders(authStore.user.SiteId)
      }
    },
    async SyncDataInSequence() {
      if (this.stateInSyncBindingKeys.includes('GENERAL')) return
      const task = await excludeSingleQuery(db, 'pendingTask', this.stateInSyncBindingKeys) as QueueTask
      if (!task) return
      if (task.bindingKey.includes('SUBMIT')) {
        const allRows = await tableToArray<QueueTask>(db, 'pendingTask')
        const anyOtherPendings = allRows.filter((f) => {
          return f.workorder == task.workorder && f.bindingKey != task.bindingKey && f.syncStatus == 'Pending'
        })
        if (anyOtherPendings.length > 0) return
      }
      this.stateInSyncBindingKeys.push(task.bindingKey)
      const allWOTasks = await includeQuery(db, 'pendingTask', [
        task.bindingKey
      ])
      const tasks = allWOTasks.filter((f) => {
        return f.workorder == task.workorder
      })
      const isError = await this.SyncProcess(tasks)
      this.stateInSyncBindingKeys = this.stateInSyncBindingKeys.filter((f) => {
        return f != task.bindingKey
      })
      return isError
    },
    async SyncProcess(tasks: QueueTask[]) {
      let isError = false
      const pendingStore = usePendingTaskMonitorListStore()
      const listClone = cloneDeep(tasks)
      for (const task of listClone) {
        try {
          switch (task.module) {
            case "serviceForm":
              switch (task.type) {
                case 'General':
                case 'PreRisk':
                  await this.SyncServiceFormGeneralData(task.payload)
                  break
                case 'SubmitGeneral':
                  await this.SyncServiceFormSubmitGeneralData(task.payload)
                  break
                case 'Task':
                case 'CBMImage':
                  await this.SyncServiceFormTaskData(task.payload)
                  break
                case 'MultipleDefect':
                  await this.SyncServiceFormMultipleDefectData(task.payload)
                  break
                case 'Defect':
                {
                  const payload = JSON.parse(task.payload);
                  if (!isUndefined(payload.defectDetail) && !isUndefined(payload.defectDetail.type)) {
                    if (payload.defectDetail.type == 'machineSMU') {
                      delete payload.defectDetail.type
                    }
                  }
                  await this.SyncServiceFormDefectData(JSON.stringify(payload))
                  break
                }
                case 'FitterUpdateDefect':
                  await this.SyncServiceFormFitterUpdateDefectData(task.payload)
                  break
                case 'UpdateDefect':
                  await this.SyncServiceFormUpdateDefectData(task.payload)
                  break
                case 'CalibrationHeader':
                  await this.SyncServiceFormPostCalibrationHeaderData(task.payload)
                  break
                case 'CalibrationDetail':
                  await this.SyncServiceFormPostCalibrationDetailData(task.payload)
                  break
                case 'GenericDefect':
                  await this.SyncServiceFormUpdateGenericDefectData(task.payload)
                  break
              }
              break;
            case "Intervention":
              switch (task.type) {
                case 'General':
                case 'PreRisk':
                  await this.SyncInterventionGeneralData(task.payload)
                  break
                case 'SubmitGeneral':
                  await this.SyncInterventionGeneralData(task.payload)
                  await this.RemoveTemplate(task.payload, task.workorder)
                  break
                case 'Task':
                case 'CBMImage':
                  await this.SyncInterventionTaskData(task.payload)
                  break
                case 'Defect':
                  await this.SyncInterventionDefectData(task.payload)
                  break
                case 'DefectGeneric':
                  await this.SyncInterventionGenericDefectData(task.payload)
                  break
                case 'UpdateDefect':
                  await this.SyncInterventionDefectDataDefectIdentified(task.payload)
                  break
              }
              break
            default:
              break;
          }
          // update sync status
          task.syncStatus = 'Sync'
          task.syncDate = AESTShortCurrentDateTime(),
          await updateRecord(db, 'pendingTask', task)
          tasks.splice(0, 1)
          await pendingStore.getPendingTaskList()
        } catch (e) {
          const skippedError = [
            'Failed to update data, service sheet status is',
            'Data already updated',
            'Task already updated by other mechanic',
            'You cannot modify the defect once already approved or declined by Supervisor',
            'Machine SMU has been',
            'Not applicable task has been',
            'Resource with specified id or name already exists'
          ]
          const error = typeof (e) == 'object' ? (e as Error).message : e as string
          let skip = false
          skippedError.forEach((err) => {
            if (error.includes(err)) {
              skip = true
            }
          })
          if (skip) {
            task.syncStatus = 'Sync'
            task.syncDate = AESTShortCurrentDateTime(),
            await updateRecord(db, 'pendingTask', task)
            tasks.splice(0, 1)
            await pendingStore.getPendingTaskList()
            return
          }
          // update to task
          for (const [i, task] of tasks.entries()) {
            if (i == 0) {
              task.errorMessage = typeof (e) == 'object' ? (e as Error).message : e as string
            }
            task.syncStatus = 'Failed'
            task.syncDate = AESTShortCurrentDateTime(),
            await updateRecord(db, 'pendingTask', task)
          }
          isError = true
          break
        } finally {
          if (task.syncStatus == 'Sync') {
            pendingStore.getTaskList().then(() => {
              pendingStore.updatePendingList(task.workorder)
            })
          }
        }
      }
      return isError
    },
    async SyncData() {
      if (isOfflineOrSlowInternetConnection()) return
      this.stateKeys = await getPrimaryKeys(db, 'pendingTask')
      await this.SyncDataInSequence()
    },
    async RetrySyncData() {
      if (isOfflineOrSlowInternetConnection()) return
      this.stateKeys = await getPrimaryKeys(db, 'pendingTask')
      if (!this.stateKeys) {
        this.stateInSync = false
        // need to clear sync progress table
        clearRecords(db, 'syncProgress')
      }
      const allRows = await tableToArray<QueueTask>(db, 'pendingTask')
      const retryTasks = allRows.filter((f) => {
        return f.syncStatus == 'Failed'
      })
      retryTasks.forEach((t) => {
        t.syncStatus = 'Pending'
        updateRecord(db, 'pendingTask', t)
      })
      const allRowsFile = await tableToArray<QueueFileTask>(db, 'pendingTaskFile')
      const retryFileTasks = allRowsFile.filter((f) => {
        return f.syncStatus == 'Failed'
      })
      retryFileTasks.forEach((t) => {
        t.syncStatus = 'Pending'
        updateRecord(db, 'pendingTaskFile', t)
      })
      const isError = await this.SyncDataInSequence()
      if (!isError) {
        clearRecords(db, 'syncProgress')
      }
      return isError
    },
    async SyncImage() {
      if (isOfflineOrSlowInternetConnection()) return
      const pendingStore = usePendingTaskMonitorListStore()
      const keys = await db.pendingTaskFile.where('syncStatus').equals('Pending').primaryKeys()
      if (!keys || keys.length == 0) return
      const task = await db.pendingTaskFile.get(keys[0])
      if (!task) {
        return
      } else {
        task.syncStatus = "On Progress"
        await updateRecord(db, 'pendingTaskFile', task)
      }
      const fileTask: QueueFileTask = {
        module: task.module,
        key: task.key,
        workorder: task.workorder,
        type: task.type,
        fileType: task.fileType,
        createdBy: task.createdBy,
        email: task.email,
        filename: task.filename,
        originalFilename: task.originalFilename,
        blob: task.blob,
        syncDate: AESTShortCurrentDateTime(),
        errorMessage: "",
        syncStatus: ""
      }
      const payload = new FormData();
      payload.append("files", task.blob, `${task.filename}.png`)
      payload.append("userAccount", task.email)
      let imageSuccess = {} as ResponseStatus
      try {
        imageSuccess = await this.syncImageToBlobStorage(payload, task.email)
        fileTask.syncStatus = 'Sync'
        if (!imageSuccess.status || imageSuccess.statusCode != 200) {
          fileTask.syncStatus = 'Failed',
          fileTask.errorMessage = imageSuccess.error
        }
        await db.pendingTaskFile.update(Number(task.id!), fileTask)
      } catch (e: any) {
        console.log(e)
        fileTask.syncStatus = 'Failed',
        fileTask.errorMessage = e.toString()
        await db.pendingTaskFile.update(Number(task.id!), fileTask)
      } finally {
        await pendingStore.getPendingFileTaskList()
        pendingStore.getFileTaskList().then(() => {
          pendingStore.updatePendingList(task.workorder)
        })
      }
    },
    async GetRetryTasks(workOrder) {
      return await db.retryTask.where('workorder').equals(workOrder).toArray()
    },
    async RetrySync(task: SyncMessage, index: number): Promise<SyncResult> {
      const resultMessage = 'OK'
      return {
        no: index + 1,
        key: task.key as string,
        type: task.type,
        result: resultMessage
      }
    },
    async RevokeSync(workOrder: string) {
      await db.retryTask.where('workorder').equals(workOrder).delete()
    }
  }
})
