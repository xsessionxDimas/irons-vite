import { defineStore } from 'pinia'
import {
  useComponentInterventionDetailStore
} from './useComponentInterventionDetailStore'
import {
  useComponentInterventionDefectsIdentifiedStore
} from "@/store/pinia/dma/component-intervention/refactor/useComponentInterventionDefectsIdentifiedStore"
import { IBaseDefectHeader } from '@/core/types/intervention/IBaseDefectHeader'
import {
  InterventionPayload
} from '@/core/types/intervention/InterventionPayload'
import {
  InterventionPayloadParam
} from '@/core/types/intervention/InterventionPayloadParam'
import { db } from '@/database/schema/DexieSchema'
import { AESTShortCurrentDateTime } from '@/core/helpers/date-format'
import { IDefectYesHeader } from '@/core/types/intervention/IDefectYesHeader'
import {
  IDefectYesDetail,
  ResponseDefectYesDetail
} from '@/core/types/intervention/IDefectYesDetail'
import { DefectYesFormData } from '@/core/types/intervention/DefectYesFormData'
import { DefectSMUFormData } from '@/core/types/intervention/DefectSMUFormData'
import { IDefectNoHeader } from '@/core/types/intervention/IDefectNoHeader'
import {
  IDefectNoDetail,
  ResponseDefectNoDetail
} from '@/core/types/intervention/IDefectNoDetail'
import { DefectNoFormData } from '@/core/types/intervention/DefectNoFormData'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { SingleApiResponse } from '@/core/types/misc/SingleApiResponse'
import ApiService from '@/core/services/ApiService'
import {
  GET_DEFECT_HEADER,
  GET_DEFECT_DETAIL,
  UPDATE_DEFECT_DETAIL_BY_FITTER,
  UPDATE_DEFECT_HEADER
} from './url'
import { ImagePayload } from '@/core/types/intervention/ImagePayload'
import { useOnline } from '@vueuse/core'
import {
  useInterventionFormSyncStore
} from "@/store/pinia/dma/component-intervention/refactor/useInterventionFormSyncStore"
import { TaskUpdateObject } from '@/core/types/intervention/TaskUpdateObject'
import {
  useComponentInterventionHeaderStore
} from './useComponentInterventionHeaderStore'
import { Intervention } from '@/core/types/intervention/Intervention'
import { IDefectCBMHeader } from '@/core/types/intervention/IDefectCBMHeader'
import { CBMFormData } from '@/core/types/intervention/CBMFormData'
import { cloneDeep, isArray, omit } from 'lodash'
import {
  checkMaxValueNew,
  checkMinValueNew,
  checkRatingNew
} from '../../e-form/helpers'
import { CBMMappingDetail } from '@/core/types/intervention/CBMMapping'
import { RatingResult } from '@/core/types/intervention/RatingResult'
import { Defect } from '@/database/schema/Defect'
import { Decline } from '@/core/types/intervention/Decline'
import { Audit } from '@/core/types/intervention/Audit'
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter'
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo'
import { ServiceSheetErrorMessages } from "@/store/enums/ErrorMessagesEnum";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { MachineSMUEnum } from '@/store/enums/MachineSMUEnum'
import {
  useComponentInterventionDefectsStore
} from "@/store/pinia/dma/component-intervention/defects/useComponentInterventionDefectsStore"
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import { v4 as uuidv4 } from "uuid";
import { addRecord } from '@/database/schema/DatabaseWrapper'
import { QueueFileTask } from '@/database/schema/QueueFileTask'
import { sendErrorEvent } from '@/core/helpers/analytics';

export const useInterventionDefectStore = defineStore({
  id: 'InterventionDefectStore',
  state: () => {
    return {
      stateDefectNoData: {} as IDefectNoHeader,
      stateDefectYesData: {} as IDefectYesHeader,
      stateDefectCBMData: {} as IDefectCBMHeader,
      stateIsBusy: false,
      stateDefectImages: {},
      stateCBMImages: {}
    }
  },
  getters: {
    DefectYesData: (state) => {
      return state.stateDefectYesData
    },
    DefectNoData: (state) => {
      return state.stateDefectNoData
    },
    DefectCBMData: (state) => {
      return state.stateDefectCBMData
    },
    DefectImages: (state) => {
      return state.stateDefectImages
    },
    CBMImages: (state) => {
      return state.stateCBMImages
    },
    IsBusy: (state) => {
      return state.stateIsBusy
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
  },
  actions: {
    initDefectImages(key: string) {
      const isExists = key in this.stateDefectImages
      if (!isExists) {
        this.stateDefectImages[key] = []
      }
    },
    async addNewPartImages(params: ImagePayload) {
      // add to taskImage
      // state on defect yes form
      const detailStore = useComponentInterventionDetailStore()
      const intervention = detailStore.Intervention
      params.blobs.forEach(async (blob, index) => {
        const fileTask: QueueFileTask = {
          module: 'Intervention',
          key: params.taskKey ?? '',
          workorder: intervention.sapWorkOrder,
          type: params.type,
          fileType: params.files[index].fileType ?? 'webp',
          createdBy: params.employee.id,
          email: params.email,
          filename: params.files[index].filename,
          originalFilename: params.files[index].originalFilename ?? params.files[index].filename,
          blob: blob,
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        }
        await addRecord(db, 'pendingTaskFile', fileTask)
      })
    },
    async deletePartImage(filename: string) {
      // delete from taskImage
      await db.pendingTaskFile.where('filename').equals(filename).delete()
    },
    async defineNewDefectImages(params: ImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      const intervention = detailStore.Intervention

      // define new defect image is where the image list length is 1 and want to replace
      // need to remove taskImage and replace this.stateDefectImages[params.key] with new image
      await db.pendingTaskFile.where('filename').equals(this.stateDefectImages[params.key][0].filename).delete()

      params.blobs.forEach(async (blob, index) => {
        const fileTask: QueueFileTask = {
          module: 'Intervention',
          key: params.key,
          workorder: intervention.sapWorkOrder,
          type: params.type,
          fileType: params.files[index].fileType ?? 'webp',
          createdBy: params.employee.id,
          email: params.email,
          filename: params.files[index].filename,
          originalFilename: params.files[index].originalFilename ?? params.files[index].filename,
          blob: blob,
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        }
        await addRecord(db, 'pendingTaskFile', fileTask)
        const clone = stringToImageInfoConvert([params.files[index]])
        this.stateDefectImages[params.key] = clone
      })
    },
    async addNewDefectImages(params: ImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      const intervention = detailStore.Intervention
      params.blobs.forEach(async (blob, index) => {
        const fileTask: QueueFileTask = {
          module: 'Intervention',
          key: params.key,
          workorder: intervention.sapWorkOrder,
          type: params.type,
          fileType: params.files[index].fileType ?? 'webp',
          createdBy: params.employee.id,
          email: params.email,
          filename: params.files[index].filename,
          originalFilename: params.files[index].originalFilename ?? params.files[index].filename,
          blob: blob,
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        }
        await addRecord(db, 'pendingTaskFile', fileTask)
        const clone = stringToImageInfoConvert(this.stateDefectImages[params.key])
        clone.push(params.files[index])
        this.stateDefectImages[params.key] = clone
      })
    },
    setExistingDefectImages(key: string, images: string[] | ImageInfo[]) {
      this.initDefectImages(key)
      this.stateDefectImages[key] = stringToImageInfoConvert(images)
    },
    async deleteDefectImage(key: string, filename: string) {
      // need to update defect
      await db.pendingTaskFile.where('filename').equals(filename).delete()
      const clone = stringToImageInfoConvert(this.stateDefectImages[key])
      this.stateDefectImages[key] = clone.filter((image) => {
        return image.filename != filename
      })
    },
    async resetDefectImages(key: string, workOrder: string) {
      const rows = db.pendingTaskFile.filter((row) => {
        return row.key === key && row.workorder === workOrder && row.module == "Intervention"
      })
      await rows.delete()
      this.stateDefectImages[key] = []
    },
    initCBMImages(key: string, existingImages: undefined | string | string[] | ImageInfo[]) {
      const isExists = key in this.stateCBMImages
      if (!isExists) {
        this.stateCBMImages[key] = []
      }
      if (isArray(existingImages)) {
        this.stateCBMImages[key] = existingImages
      } else if (existingImages != '') {
        this.stateCBMImages[key] = JSON.parse(existingImages as string)
      } else {
        this.stateCBMImages[key] = []
      }
    },
    async addNewCBMImages(params: ImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      const intervention = detailStore.Intervention
      params.blobs.forEach(async (blob, index) => {
        const fileTask: QueueFileTask = {
          module: 'Intervention',
          key: params.key,
          workorder: intervention.sapWorkOrder,
          type: params.type,
          fileType: params.files[index].fileType ?? 'webp',
          createdBy: params.employee.id,
          email: params.email,
          filename: params.files[index].filename,
          originalFilename: params.files[index].originalFilename ? params.files[index].originalFilename as string : params.files[index].filename,
          blob: blob,
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        }
        await addRecord(db, 'pendingTaskFile', fileTask)
      })
      this.stateCBMImages[params.key].push(...params.files)
    },
    async defineNewCBMImages(params: ImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      const intervention = detailStore.Intervention
      // delete all data cbm image for certain task key
      const existing = db.pendingTaskFile.where({
        key: params.key,
        sapWorkorder: intervention.sapWorkOrder,
        syncStatus: 'Not Sync'
      })
      if (existing) {
        await existing.delete()
      }
      // add new image
      params.blobs.forEach(async (blob, index) => {
        const fileTask: QueueFileTask = {
          module: 'Intervention',
          key: params.key,
          workorder: intervention.sapWorkOrder,
          type: params.type,
          fileType: params.files[index].fileType ?? 'webp',
          createdBy: params.employee.id,
          email: params.email,
          filename: params.files[index].filename,
          originalFilename: params.files[index].originalFilename ? params.files[index].originalFilename as string : params.files[index].filename,
          blob: blob,
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        }
        await addRecord(db, 'pendingTaskFile', fileTask)
      })
      this.stateCBMImages[params.key] = params.files
    },
    async deleteCBMImage(key: string, filename: string) {
      // need to update cbm
      await db.pendingTaskFile.where('filename').equals(filename).delete()
      const clone = stringToImageInfoConvert(this.stateCBMImages[key])
      this.stateCBMImages[key] = clone.filter((image) => {
        return image.filename != filename
      })
    },
    async resetCBMImages(key: string, workOrder: string) {
      const rows = db.pendingTaskFile.filter((row) => {
        return row.key === key && row.workorder === workOrder && row.module == "Intervention"
      })
      await rows.delete()
      this.stateCBMImages[key] = []
    },
    createDefectYesData(param: DefectYesFormData, generatedID = "") {
      const detail = useComponentInterventionDetailStore()
      this.stateDefectYesData.header = {} as IBaseDefectHeader
      this.stateDefectYesData.header.workorder = detail.Intervention.sapWorkOrder
      this.stateDefectYesData.header.form = detail.Intervention.equipmentDesc
      this.stateDefectYesData.header.serviceSheetDetailId = ""
      this.stateDefectYesData.header.interventionId = detail.Intervention.id
      this.stateDefectYesData.header.interventionHeaderId = detail.Intervention.trInterventionHeaderId
      this.stateDefectYesData.header.category = param.task.taskCategory
      this.stateDefectYesData.header.taskId = param.task.taskKey as string
      this.stateDefectYesData.header.taskNo = param.taskNo
      this.stateDefectYesData.header.taskDesc = param.taskDesc
      this.stateDefectYesData.header.defectWorkorder = ''
      this.stateDefectYesData.header.formDefect = "DM-PL-F55"
      this.stateDefectYesData.header.defectType = param.task?.defectType || ""
      this.stateDefectYesData.header.cbmMeasurement = ''
      this.stateDefectYesData.header.cbmUom = ''
      this.stateDefectYesData.header.cbmImageKey = ''
      this.stateDefectYesData.header.cbmImageProp = ''
      this.stateDefectYesData.header.isCbmAdjusment = ''
      this.stateDefectYesData.header.taskValue = param.task.value
      this.stateDefectYesData.header.repairedStatus = "Not-Repaired"
      this.stateDefectYesData.header.cbmNAStatus = "Not-Confirm"
      this.stateDefectYesData.header.supervisor = param.task.supervisor
      this.stateDefectYesData.header.status = "Submited"
      this.stateDefectYesData.header.defectStatus = "Submited"
      this.stateDefectYesData.header.plannerStatus = ""
      this.stateDefectYesData.header.declineReason = ""
      this.stateDefectYesData.header.declineBy = {} as Audit
      this.stateDefectYesData.header.declineDate = ""
      this.stateDefectYesData.header.approvedBy = {} as Audit
      this.stateDefectYesData.header.approvedDate = ""
      if (generatedID != "") {
        this.stateDefectYesData.header.id = generatedID
      }
      this.createDefectYesDetail(param, generatedID)
    },
    createDefectYesDetail(param: DefectYesFormData, generatedID = "") {
      this.stateDefectYesData.detail = {} as IDefectYesDetail
      this.stateDefectYesData.detail.interventionId = param.task.id as string
      this.stateDefectYesData.detail.title = param.taskDesc
      this.stateDefectYesData.detail.type = "YES"
      this.stateDefectYesData.detail.isNeed30Minutes = param.isNeed30Minutes
      this.stateDefectYesData.detail.assetNumber = param.assetNumber
      this.stateDefectYesData.detail.description = param.description
      this.stateDefectYesData.detail.raisedBy = param.raisedBy
      this.stateDefectYesData.detail.date = param.submitDate
      this.stateDefectYesData.detail.plannedDuration = param.plannedDuration
      this.stateDefectYesData.detail.instruction = param.instruction
      this.stateDefectYesData.detail.priority = param.priority
      this.stateDefectYesData.detail.parts = JSON.stringify(param.parts)
      this.stateDefectYesData.detail.labours = JSON.stringify(param.labours)
      this.stateDefectYesData.detail.resources = JSON.stringify(param.resources)
      this.stateDefectYesData.detail.symptoms = JSON.stringify(param.symptoms)
      this.stateDefectYesData.detail.causes = JSON.stringify(param.causes)
      if (generatedID != "") {
        this.stateDefectYesData.detail.images = JSON.stringify(this.stateDefectImages[generatedID as string])
      } else if (param.task.taskKey != "") {
        this.stateDefectYesData.detail.images = JSON.stringify(this.stateDefectImages[param.task.taskKey as string])
      } else {
        this.stateDefectYesData.detail.images = JSON.stringify(this.stateDefectImages[param.defectHeaderId as string])
      }
      this.stateDefectYesData.detail.id = uuidv4()
    },
    createDefectYesPayload(param: DefectYesFormData, id = ""): InterventionPayload {
      const detail = useComponentInterventionDetailStore()
      this.createDefectYesData(param, id)
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
      // if old value NA
      if (param.task.task.taskValue == '4') {
        propertyParam.propertyParams.push({
          propertyName: 'reason',
          propertyValue: param.reason ?? ""
        })
      } else {
        propertyParam.propertyParams.push({
          propertyName: 'reason',
          propertyValue: ""
        })
      }
      payload.updateParams.push(propertyParam)
      payload.defectHeader = this.DefectYesData.header
      payload.defectDetail = this.DefectYesData.detail
      return payload
    },
    async submitDefectYes(param: DefectYesFormData, generic = false) {
      const onlineStatus = useOnline();
      const detail = useComponentInterventionDetailStore()
      const interventionFormSyncStore = useInterventionFormSyncStore();
      const payload = this.createDefectYesPayload(param, param.idGenerated)
      if (generic) {
        payload.updateParams = []
      } else {
        detail.appendTaskUpdatePayload(payload, param.task, true)
      }
      let status = ''
      if (!isOfflineOrSlowInternetConnection()) {
        if (generic) {
          await interventionFormSyncStore.SyncInterventionGenericDefectData(JSON.stringify(payload))
        } else {
          try {
            await interventionFormSyncStore.SyncInterventionDefectData(JSON.stringify(payload))
          } catch (error) {
            const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
            if (isNoNetwork) {
              const existingTask = await db.pendingTask.get({
                key: param.task.taskKey,
                workorder: payload.workOrder
              })
              // if generic will always add (ga ad task id)
              if (existingTask && !generic) {
                existingTask.payload = JSON.stringify(payload)
                await db.pendingTask.put(existingTask)
              } else {
                await db.pendingTask.add({
                  module: 'Intervention',
                  section: 'E-Form',
                  type: generic ? 'DefectGeneric' : 'Defect',
                  workorder: payload.workOrder as string,
                  key: generic ? param.idGenerated as string : param.task.taskKey as string,
                  bindingKey: generic ? param.idGenerated as string : param.task.taskKey as string,
                  payload: JSON.stringify(payload),
                  syncDate: AESTShortCurrentDateTime(),
                  syncStatus: 'Pending'
                })
              }
              status = 'Pending'
              await this.updateDefectYesDataAndUpdateOnLocal(generic, payload, param, detail)
              return false
            } else {
              const detail = useComponentInterventionDetailStore()
              if (error == ServiceSheetErrorMessages.MODIFY_DEFECT_AFTER_SUPERVISOR_APPROVAL || error == ServiceSheetErrorMessages.CHANGE_NOT_APPLICABLE_WITHOUT_REASON || error == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
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
        }
        await detail.updateIntervention(true)
        status = 'Sync'
      } else {
        const existingTask = await db.pendingTask.get({
          key: param.task.taskKey,
          workorder: payload.workOrder
        })
        // if generic will always add (ga ad task id)
        if (existingTask && !generic) {
          existingTask.payload = JSON.stringify(payload)
          await db.pendingTask.put(existingTask)
        } else {
          await db.pendingTask.add({
            module: 'Intervention',
            section: 'E-Form',
            type: generic ? 'DefectGeneric' : 'Defect',
            workorder: payload.workOrder as string,
            key: generic ? param.idGenerated as string : param.task.taskKey as string,
            bindingKey: generic ? param.idGenerated as string : param.task.taskKey as string,
            payload: JSON.stringify(payload),
            syncDate: AESTShortCurrentDateTime(),
            syncStatus: 'Pending'
          })
        }
        status = 'Pending'
      }
      await this.updateDefectYesDataAndUpdateOnLocal(generic, payload, param, detail)
    },
    async updateDefectYesDataAndUpdateOnLocal(generic, payload, param, detail) {
      if (!generic) {
        const row = db.interventionDefect.where({
          interventionId: payload.defectHeader?.interventionId as string,
          taskId: payload.defectHeader?.taskId as string
        })
        if (row) {
          await row.delete()
        }
      }
      await db.interventionDefect.put({
        category: payload.defectHeader?.category as string,
        interventionId: payload.defectHeader?.interventionId as string,
        taskId: payload.defectHeader?.taskId as string,
        taskNo: payload.defectHeader?.taskNo as string,
        taskDesc: payload.defectHeader?.taskDesc as string,
        taskValue: payload.defectHeader?.taskValue as string,
        defectHeaderId: generic ? param.idGenerated : '',
        defectDetailId: payload.defectDetail?.id ?? '',
        defectType: generic ? 'Generic' : '',
        priority: param.priority,
        sapWorkorder: payload.workOrder as string,
        taskKey: payload.defectHeader?.taskId as string,
        type: 'YES',
        defectData: JSON.stringify(payload.defectDetail),
        repairedStatus: payload.defectHeader?.repairedStatus as string,
        cbmNAStatus: 'Not-Confirm',
        status: payload.defectHeader?.status as string,
        plannerStatus: payload.defectHeader?.plannerStatus ? payload.defectHeader?.plannerStatus : '',
        declineReason: payload.defectHeader?.declineReason ? payload.defectHeader?.declineReason : '',
        statusSync: status,
        declineDate: payload.defectHeader?.declineDate ? payload.defectHeader?.declineDate : '',
        declineBy: payload.defectHeader?.declineBy ? {
          id: payload.defectHeader?.declineBy.id,
          name: payload.defectHeader?.declineBy.name
        } : {} as Audit,
        approvedDate: payload.defectHeader?.approvedDate ? payload.defectHeader?.approvedDate : '',
        approvedBy: payload.defectHeader?.approvedBy ? {
          id: payload.defectHeader?.approvedBy.id,
          name: payload.defectHeader?.approvedBy.name
        } : {} as Audit,
        createdBy: payload.employee ? {
          id: payload.employee.id,
          name: payload.employee.name
        } : {} as Audit,
        createdDate: param.task.timeStamp ? param.task.timeStamp : '',
        updatedBy: payload.employee ? {
          id: payload.employee.id,
          name: payload.employee.name
        } : {} as Audit,
        updatedDate: param.task.timeStamp ? param.task.timeStamp : '',
      })
      let usedID = param.task.taskKey;
      if (generic) {
        usedID = param.idGenerated
      }
      this.stateDefectImages[usedID as string] = []
      await detail.updateLocalData(param.task)
      const defectIdentifiedStore = useComponentInterventionDefectsIdentifiedStore()
      defectIdentifiedStore.setDefectIdentifiedData(payload.defectHeader?.workorder as string)
    },
    async checkDataInterventionSMU() {
      const detail = useComponentInterventionDetailStore()
      const row = await db.interventionDefect.where({
        interventionId: detail.Intervention.id,
        category: 'GENERAL',
        defectType: 'machineSMU'
      }).toArray()
      return row.length > 0
    },
    createDefectSMUPayload(param: DefectSMUFormData) {
      const detail = useComponentInterventionDetailStore()
      const header = useComponentInterventionHeaderStore()
      const payload = {} as InterventionPayload
      payload.headerId = param.id
      payload.id = param.id
      payload.employee = header.Log.employee
      payload.localInterventionStatus = detail.Intervention.interventionExecution
      payload.workorder = detail.Intervention.sapWorkOrder
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = "GENERAL" as string
      propertyParam.propertyParams = []
      let userEdit = header.Log.employee
      if (param.fitter) {
        userEdit = param.fitter
        payload.employee = param.fitter
      }
      propertyParam.propertyParams.push({
        propertyName: 'interventionSMU',
        propertyValue: param.value
      })
      propertyParam.propertyParams.push({
        propertyName: 'smuBy',
        propertyValue: JSON.stringify(userEdit)
      })
      propertyParam.propertyParams.push({
        propertyName: 'smuDate',
        propertyValue: param.submitDate
      })
      propertyParam.propertyParams.push({
        propertyName: 'hmOffset',
        propertyValue: detail.Intervention.hmOffset ?? "0"
      })
      propertyParam.propertyParams.push({
        propertyName: 'updatedBy',
        propertyValue: JSON.stringify(userEdit)
      })
      propertyParam.propertyParams.push({
        propertyName: 'updatedDate',
        propertyValue: param.submitDate
      })
      payload.updateParams.push(propertyParam)

      payload.defectHeader = {
        workorder: detail.Intervention.sapWorkOrder,
        form: detail.Intervention.equipmentDesc,
        serviceSheetDetailId: "",
        interventionId: detail.Intervention.id,
        interventionHeaderId: detail.Intervention.trInterventionHeaderId,
        category: "GENERAL",
        taskId: "",
        taskNo: "",
        taskDesc: MachineSMUEnum.MACHINESMUTITLE(),
        defectWorkorder: "",
        formDefect: "",
        defectType: "machineSMU",
        cbmMeasurement: "",
        cbmUom: "",
        cbmImageKey: "",
        cbmImageProp: "",
        isCbmAdjusment: "",
        taskValue: "",
        repairedStatus: "",
        cbmNAStatus: "",
        supervisor: param.employee,
        status: "Submited",
        defectStatus: "Submited",
        isActive: "true",
        plannerStatus: "",
        declineReason: "",
        declineBy: {} as Audit,
        declineDate: "",
        approvedBy: {} as Audit,
        approvedDate: "",
        createdBy: header.Log.employee,
        createdDate: param.submitDate,
        updatedBy: header.Log.employee,
        updatedDate: param.submitDate,
      }
      payload.defectDetail = {
        title: MachineSMUEnum.TITLE(status),
        machineSMU: param.value,
        minRange: Number(param.detail.range.minRange),
        maxRange: Number(param.detail.range.maxRange),
        smuDue: detail.Intervention.smuDue,
        assetNumber: detail.Intervention.equipment,
        serialNumber: param.detail.serialNumber,
        hmOffset: detail.Intervention.hmOffset ?? "0",
        images: JSON.stringify(detail.Intervention.imageEquipment ?? []),
      }
      return payload
    },
    async createDefectSMU(param: DefectSMUFormData) {
      const detail = useComponentInterventionDetailStore()
      const interventionFormSyncStore = useInterventionFormSyncStore();
      const payload = this.createDefectSMUPayload(param)
      let status = ''

      const offlineSync = async () => {
        const existingTask = await db.pendingTask.get({
          key: 'SMU',
          workorder: payload.workorder
        })
        if (existingTask) {
          existingTask.payload = JSON.stringify(payload)
          await db.pendingTask.put(existingTask)
        } else {
          await db.pendingTask.add({
            module: 'Intervention',
            section: 'E-Form',
            type: 'Defect',
            workorder: payload.workorder as string,
            key: "SMU",
            bindingKey: "SMU",
            payload: JSON.stringify(payload),
            syncDate: AESTShortCurrentDateTime(),
            syncStatus: 'Pending'
          })
        }
        status = 'Pending'
      }

      if (!isOfflineOrSlowInternetConnection()) {
        try {
          await interventionFormSyncStore.SyncInterventionDefectData(JSON.stringify(payload))
          await detail.updateIntervention(true)
          status = 'Sync'
        } catch (error) {
          const detail = useComponentInterventionDetailStore()
          if (error == ServiceSheetErrorMessages.MODIFY_DEFECT_AFTER_SUPERVISOR_APPROVAL || error == ServiceSheetErrorMessages.CHANGE_NOT_APPLICABLE_WITHOUT_REASON || error == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
            detail.stateTaskErrorDialog = true
            detail.stateErrorMessageTaskErrorDialog = error as string
          } else if (error == ServiceSheetErrorMessages.SUBMITTED) {
            detail.stateFormSubmittedDialog = true
          } else if (error == ServiceSheetErrorMessages.CLOSE) {
            detail.stateFormCloseDialog = true
          }
          await offlineSync()
        }
      } else {
        await offlineSync()
      }
      const row = db.interventionDefect.where({
        interventionId: payload.defectHeader?.interventionId as string,
        category: payload.defectHeader?.category,
        defectType: 'machineSMU'
      })
      if (row) {
        await row.delete()
      }
      const newDetail = {
        ...payload.defectDetail,
        createdBy: payload.defectHeader?.createdBy,
        createdDate: payload.defectHeader?.createdDate,
        updatedBy: payload.defectHeader?.updatedBy,
        updatedDate: payload.defectHeader?.updatedDate,
      }
      await db.interventionDefect.put({
        category: payload.defectHeader?.category as string,
        interventionId: payload.defectHeader?.interventionId as string,
        taskId: payload.defectHeader?.taskId as string,
        taskNo: payload.defectHeader?.taskNo as string,
        taskDesc: payload.defectHeader?.taskDesc as string,
        taskValue: payload.defectHeader?.taskValue as string,
        defectHeaderId: param.idGenerated,
        defectType: "machineSMU",
        priority: "",
        sapWorkorder: payload.workorder as string,
        taskKey: payload.defectHeader?.taskId as string,
        type: 'machineSMU',
        defectData: JSON.stringify(newDetail),
        repairedStatus: payload.defectHeader?.repairedStatus as string,
        cbmNAStatus: 'Not-Confirm',
        status: payload.defectHeader?.status as string,
        plannerStatus: payload.defectHeader?.plannerStatus ? payload.defectHeader?.plannerStatus : '',
        declineReason: payload.defectHeader?.declineReason ? payload.defectHeader?.declineReason : '',
        statusSync: status,
        declineDate: payload.defectHeader?.declineDate ? payload.defectHeader?.declineDate : '',
        declineBy: payload.defectHeader?.declineBy ? {
          id: payload.defectHeader?.declineBy.id,
          name: payload.defectHeader?.declineBy.name
        } : {} as Audit,
        approvedDate: payload.defectHeader?.approvedDate ? payload.defectHeader?.approvedDate : '',
        approvedBy: payload.defectHeader?.approvedBy ? {
          id: payload.defectHeader?.approvedBy.id,
          name: payload.defectHeader?.approvedBy.name
        } : {} as Audit,
        createdBy: payload.employee ? {
          id: payload.employee.id,
          name: payload.employee.name
        } : {} as Audit,
        createdDate: param.submitDate,
        updatedBy: payload.employee ? {
          id: payload.employee.id,
          name: payload.employee.name
        } : {} as Audit,
        updatedDate: param.submitDate,
      })
      const defectIdentifiedStore = useComponentInterventionDefectsIdentifiedStore()
      defectIdentifiedStore.setDefectIdentifiedData(payload.defectHeader?.workorder as string)
    },
    async updateDefectSMUMonitoring(param: DefectSMUFormData) {
      const defectIdentifiedStore = useComponentInterventionDefectsIdentifiedStore()
      const ComponentInterventionDefectsStore = useComponentInterventionDefectsStore()
      const detailStore = useComponentInterventionDetailStore()

      if (defectIdentifiedStore.stateData.DefectSMUHeaders.length == 0) {
        await this.createDefectSMU(param)
      } else {
        const detail = defectIdentifiedStore.stateData.DefectSMUHeaders[0].defectData

        const detailObj = JSON.parse(detail)

        await ComponentInterventionDefectsStore.updateDefectDetailSMU({
          ...omit(detailObj, ["headerKey"]),
          machineSMU: param.value,
          title: MachineSMUEnum.MACHINESMUTITLE(),
          images: JSON.stringify(detailStore.Intervention.imageEquipment ?? [])
        }, defectIdentifiedStore.stateData.DefectSMUHeaders[0].defectDetailId, true)
        await ComponentInterventionDefectsStore.updateDefectHeaderSMU({
          isInRange: param.detail.isInRange,
          headerId: defectIdentifiedStore.stateData.DefectSMUHeaders[0].defectHeaderId!,
          headerKey: detailObj.headerKey,
          isEdit: true
        })
      }
    },
    createDefectNoData(param: DefectNoFormData, generatedID = "") {
      const detail = useComponentInterventionDetailStore()
      this.stateDefectNoData.header = {} as IBaseDefectHeader
      this.stateDefectNoData.header.workorder = detail.Intervention.sapWorkOrder
      this.stateDefectNoData.header.form = detail.Intervention.equipmentDesc
      this.stateDefectNoData.header.serviceSheetDetailId = ""
      this.stateDefectNoData.header.interventionId = detail.Intervention.id
      this.stateDefectNoData.header.interventionHeaderId = detail.Intervention.trInterventionHeaderId
      this.stateDefectNoData.header.category = param.task.taskCategory
      this.stateDefectNoData.header.taskId = param.task.taskKey as string
      this.stateDefectNoData.header.taskNo = param.taskNo
      this.stateDefectNoData.header.taskDesc = param.taskDesc
      this.stateDefectNoData.header.defectWorkorder = ''
      this.stateDefectNoData.header.formDefect = "DM-PL-F55"
      this.stateDefectNoData.header.defectType = param.task?.defectType || ""
      this.stateDefectNoData.header.cbmMeasurement = ''
      this.stateDefectNoData.header.cbmUom = ''
      this.stateDefectNoData.header.cbmImageKey = ''
      this.stateDefectNoData.header.cbmImageProp = ''
      this.stateDefectNoData.header.isCbmAdjusment = ''
      this.stateDefectNoData.header.taskValue = param.task.value
      this.stateDefectNoData.header.repairedStatus = "Not-Repaired"
      this.stateDefectNoData.header.cbmNAStatus = "Not-Confirm"
      this.stateDefectNoData.header.supervisor = param.task.supervisor
      this.stateDefectNoData.header.status = "Submited"
      this.stateDefectNoData.header.defectStatus = "Submited"
      this.stateDefectNoData.detail = {} as IDefectNoDetail
      this.stateDefectNoData.detail.interventionId = param.task.id as string
      this.stateDefectNoData.detail.title = param.taskDesc
      this.stateDefectNoData.detail.type = "NO"
      this.stateDefectNoData.detail.assetNumber = param.assetNumber
      this.stateDefectNoData.detail.description = param.description
      this.stateDefectNoData.detail.raisedBy = param.raisedBy
      this.stateDefectNoData.detail.date = param.submitDate
      this.stateDefectNoData.detail.actions = JSON.stringify(param.actions)
      if (generatedID != "") {
        this.stateDefectNoData.detail.images = JSON.stringify(this.stateDefectImages[generatedID as string])
      } else {
        this.stateDefectNoData.detail.images = JSON.stringify(this.stateDefectImages[param.task.taskKey as string])
      }
      this.stateDefectNoData.header.plannerStatus = ""
      this.stateDefectNoData.header.declineReason = ""
      this.stateDefectNoData.header.declineBy = {} as Audit
      this.stateDefectNoData.header.declineDate = ""
      this.stateDefectNoData.header.approvedBy = {} as Audit
      this.stateDefectNoData.header.approvedDate = ""
    },
    createDefectNoPayload(param: DefectNoFormData, id = ""): InterventionPayload {
      const detail = useComponentInterventionDetailStore()
      this.createDefectNoData(param, id)
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
      // if old value NA
      if (param.task.task.taskValue == '4') {
        propertyParam.propertyParams.push({
          propertyName: 'reason',
          propertyValue: param.reason || ""
        })
      } else {
        propertyParam.propertyParams.push({
          propertyName: 'reason',
          propertyValue: ""
        })
      }
      payload.updateParams.push(propertyParam)
      payload.defectHeader = this.DefectNoData.header
      if (id != "") {
        payload.defectHeader.id = id
      }
      payload.defectDetail = this.DefectNoData.detail
      return payload
    },
    async submitDefectNo(param: DefectNoFormData, generic = false) {
      const onlineStatus = useOnline()
      const detail = useComponentInterventionDetailStore()
      const payload = this.createDefectNoPayload(param, param.idGenerated)
      if (generic) {
        payload.updateParams = []
      } else {
        detail.appendTaskUpdatePayload(payload, param.task, true, false)
      }
      let status = ''
      if (!isOfflineOrSlowInternetConnection()) {
        const interventionFormSyncStore = useInterventionFormSyncStore()
        if (generic) {
          await interventionFormSyncStore.SyncInterventionGenericDefectData(JSON.stringify(payload))
        } else {
          try {
            await interventionFormSyncStore.SyncInterventionDefectData(JSON.stringify(payload))
          } catch (error) {
            const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
            if (isNoNetwork) {
              const existingTask = await db.pendingTask.get({
                key: param.task.taskKey,
                workorder: payload.workOrder
              })
              if (existingTask && !generic) {
                existingTask.payload = JSON.stringify(payload)
                await db.pendingTask.put(existingTask)
              } else {
                await db.pendingTask.add({
                  module: 'Intervention',
                  section: 'E-Form',
                  type: generic ? 'DefectGeneric' : 'Defect',
                  workorder: payload.workOrder as string,
                  key: param.task.taskKey as string,
                  bindingKey: param.task.taskKey as string,
                  payload: JSON.stringify(payload),
                  syncDate: AESTShortCurrentDateTime(),
                  syncStatus: 'Pending'
                })
                status = 'Pending'
              }
              await this.updateDefectNoDataAndUpdateOnLocal(generic, payload, param, detail)
              return false
            } else {
              const detail = useComponentInterventionDetailStore()
              if (error == ServiceSheetErrorMessages.MODIFY_DEFECT_AFTER_SUPERVISOR_APPROVAL || error == ServiceSheetErrorMessages.CHANGE_NOT_APPLICABLE_WITHOUT_REASON || error == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
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
        }
        await detail.updateIntervention(true)
        status = 'Sync'
      } else {
        const existingTask = await db.pendingTask.get({
          key: param.task.taskKey,
          workorder: payload.workOrder
        })
        if (existingTask && !generic) {
          existingTask.payload = JSON.stringify(payload)
          await db.pendingTask.put(existingTask)
        } else {
          await db.pendingTask.add({
            module: 'Intervention',
            section: 'E-Form',
            type: generic ? 'DefectGeneric' : 'Defect',
            workorder: payload.workOrder as string,
            key: param.task.taskKey as string,
            bindingKey: param.task.taskKey as string,
            payload: JSON.stringify(payload),
            syncDate: AESTShortCurrentDateTime(),
            syncStatus: 'Pending'
          })
          status = 'Pending'
        }
      }
      await this.updateDefectNoDataAndUpdateOnLocal(generic, payload, param, detail)
    },
    async updateDefectNoDataAndUpdateOnLocal(generic, payload, param, detail) {
      if (!generic) {
        const row = db.interventionDefect.where({
          interventionId: payload.defectHeader?.interventionId as string,
          taskId: payload.defectHeader?.taskId as string
        })
        if (row) {
          await row.delete()
        }
      }
      await db.interventionDefect.add({
        category: payload.defectHeader?.category as string,
        interventionId: payload.defectHeader?.interventionId as string,
        taskId: payload.defectHeader?.taskId as string,
        taskNo: payload.defectHeader?.taskNo as string,
        taskDesc: payload.defectHeader?.taskDesc as string,
        taskValue: payload.defectHeader?.taskValue as string,
        defectHeaderId: generic ? param.idGenerated : '',
        defectType: generic ? 'Generic' : '',
        sapWorkorder: payload.workOrder as string,
        taskKey: payload.defectHeader?.taskId as string,
        type: 'NO',
        defectData: JSON.stringify(payload.defectDetail),
        repairedStatus: 'Not-Repaired',
        cbmNAStatus: 'Not-Confirm',
        status: payload.defectHeader?.status as string,
        plannerStatus: payload.defectHeader?.plannerStatus ? payload.defectHeader?.plannerStatus : '',
        declineReason: payload.defectHeader?.declineReason ? payload.defectHeader?.declineReason : '',
        createdBy: payload.employee ? {
          id: payload.employee.id,
          name: payload.employee.name
        } : {} as Audit,
        createdDate: param.task.timeStamp ? param.task.timeStamp : '',
        updatedBy: payload.employee ? {
          id: payload.employee.id,
          name: payload.employee.name
        } : {} as Audit,
        updatedDate: param.task.timeStamp ? param.task.timeStamp : '',
        statusSync: status
      })
      let usedID = param.task.taskKey;
      if (generic) {
        usedID = param.idGenerated
      }
      this.stateDefectImages[usedID as string] = []
      await detail.updateLocalData(param.task)
      const defectIdentifiedStore = useComponentInterventionDefectsIdentifiedStore()
      defectIdentifiedStore.setDefectIdentifiedData(payload.defectHeader?.workorder as string)
    },
    createDefectCBMData(param: CBMFormData) {
      const detail = useComponentInterventionDetailStore()
      this.stateDefectCBMData.header = {} as IBaseDefectHeader
      this.stateDefectCBMData.header.workorder = detail.Intervention.sapWorkOrder
      this.stateDefectCBMData.header.form = detail.Intervention.equipmentDesc
      this.stateDefectCBMData.header.serviceSheetDetailId = ""
      this.stateDefectCBMData.header.interventionId = detail.Intervention.id
      this.stateDefectCBMData.header.interventionHeaderId = detail.Intervention.trInterventionHeaderId
      this.stateDefectCBMData.header.category = param.task.taskCategory == "Adjustment" ? "CBM" : param.task.taskCategory
      this.stateDefectCBMData.header.taskId = param.task.taskKey as string
      this.stateDefectCBMData.header.taskNo = param.taskNo
      this.stateDefectCBMData.header.taskDesc = param.task.task.description
      this.stateDefectCBMData.header.defectWorkorder = ''
      this.stateDefectCBMData.header.formDefect = "DM-PL-F55"
      this.stateDefectCBMData.header.defectType = ''
      this.stateDefectCBMData.header.cbmMeasurement = param.cbmMeasurement ?? ''
      this.stateDefectCBMData.header.cbmUom = param.uomValue ?? ''
      this.stateDefectCBMData.header.cbmImageKey = ''
      this.stateDefectCBMData.header.cbmImageProp = 'images'
      this.stateDefectCBMData.header.isCbmAdjusment = 'false'
      this.stateDefectCBMData.header.taskValue = param.task.value
      this.stateDefectCBMData.header.repairedStatus = "Not-Repaired"
      this.stateDefectCBMData.header.cbmNAStatus = "Not-Confirm"
      this.stateDefectCBMData.header.supervisor = param.task.supervisor
      this.stateDefectCBMData.header.status = "Submited"
      this.stateDefectCBMData.header.defectStatus = "Submited"
      this.stateDefectCBMData.header.plannerStatus = ""
      this.stateDefectCBMData.header.declineReason = ""
      this.stateDefectCBMData.header.declineBy = {} as Audit
      this.stateDefectCBMData.header.declineDate = ""
      this.stateDefectCBMData.header.approvedBy = {} as Audit
      this.stateDefectCBMData.header.approvedDate = ""
      this.stateDefectCBMData.header.isActive = "true"
      if (param.task.taskCategory == "Adjustment") {
        const measurementItem = param.task.task.items.find((item) => {
          return item.categoryItemType == 'paramRating'
        })
        this.stateDefectCBMData.header.cbmMeasurement = measurementItem?.value as string
        const targetItem = param.task.task.items.find((item) => {
          return item.categoryItemType == 'targetRating'
        })
        this.stateDefectCBMData.header.taskValue = targetItem?.value as string
        if (param.correctedMeasurement) this.stateDefectCBMData.header.correctedMeasurement = param.correctedMeasurement;
        if (param.correctedValue) this.stateDefectCBMData.header.correctedValue = param.correctedValue;
        if (param.correctedUom) this.stateDefectCBMData.header.correctedUom = param.correctedUom;
      }
    },
    createDefectCBMPayload(param: CBMFormData) {
      const detail = useComponentInterventionDetailStore()
      this.createDefectCBMData(param)
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
      const ratingItem = param.task.task.items.find((item) => {
        return item.categoryItemType == 'targetRating'
      })
      propertyParam.propertyParams.push({
        propertyName: 'taskValue',
        propertyValue: param.task.taskCategory == 'Adjustment' ? ratingItem?.value as string : param.task.value
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
      payload.defectHeader = this.stateDefectCBMData.header
      payload.defectDetail = undefined
      return payload
    },
    async deleteLocalDefect(param: {
      interventionId: string,
      taskId: string
    }) {
      const row = db.interventionDefect.where({
        interventionId: param.interventionId,
        taskId: param.taskId
      })
      if (row) {
        await row.delete()
      }
    },
    async updateLocalDefect(param, status = "") {
      if (!param.cbmMeasurement) {
        for (const item of param.task.task.items) {
          if (item.categoryItemType == "paramRating") {
            param.cbmMeasurement = item.value
            break
          }
        }
      }
      const payload = this.createDefectCBMPayload(param)
      const isDefect = !(param.task.value == "A" || param.task.value == "B")
      const existing = await db.interventionDefect.filter((l) => {
        return l.taskKey == param.task.taskKey
      }).first()
      if (existing) {
        // Klo nilainya A || B -> hapus data defect klo ada
        if (!isDefect) {
          await db.interventionDefect.filter((l) => {
            return l.taskKey == param.task.taskKey
          }).delete()
        } else {
          if (param.task.value) {
            // Else simpan
            existing.taskValue = param.task.value
            existing.cbmMeasurement = param.cbmMeasurement
            await db.interventionDefect.put(existing)
          }
        }
      } else {
        if (isDefect) {
          const row = db.interventionDefect.where({
            interventionId: payload.defectHeader?.interventionId as string,
            taskId: payload.defectHeader?.taskId as string
          })
          if (row) {
            await row.delete()
          }
          const newDefect: Defect = {
            category: payload.defectHeader?.category as string,
            interventionId: payload.defectHeader?.interventionId as string,
            taskId: payload.defectHeader?.taskId as string,
            taskNo: payload.defectHeader?.taskNo as string,
            taskDesc: payload.defectHeader?.taskDesc as string,
            taskValue: payload.defectHeader?.taskValue as string,
            sapWorkorder: payload.workOrder as string,
            taskKey: payload.defectHeader?.taskId as string,
            cbmMeasurement: payload.defectHeader?.cbmMeasurement,
            type: 'CBM',
            defectData: '',
            repairedStatus: 'Not-Repaired',
            cbmNAStatus: 'Not-Confirm',
            status: payload.defectHeader?.status as string,
            plannerStatus: payload.defectHeader?.plannerStatus ? payload.defectHeader?.plannerStatus : '',
            declineReason: payload.defectHeader?.declineReason ? payload.defectHeader?.declineReason : '',
            statusSync: status,
            declineDate: payload.defectHeader?.declineDate ? payload.defectHeader?.declineDate : '',
            declineBy: payload.defectHeader?.declineBy ? payload.defectHeader?.declineBy : {} as Audit,
            approvedDate: payload.defectHeader?.approvedDate ? payload.defectHeader?.approvedDate : '',
            approvedBy: payload.defectHeader?.approvedBy ? payload.defectHeader?.approvedBy : {} as Audit,
            createdBy: payload.defectHeader?.createdBy ? {
              id: payload.defectHeader?.createdBy.id,
              name: payload.defectHeader?.createdBy.name
            } : {} as Audit,
            createdDate: payload.defectHeader?.createdDate ? payload.defectHeader?.createdDate : '',
            updatedBy: payload.defectHeader?.updatedBy ? {
              id: payload.defectHeader?.updatedBy.id,
              name: payload.defectHeader?.updatedBy.name
            } : {} as Audit,
            updatedDate: payload.defectHeader?.updatedDate ? payload.defectHeader?.updatedDate : '',
          }
          console.log(newDefect)
          await db.interventionDefect.add(cloneDeep(newDefect))
        }
      }
    },
    async submitDefectCBM(param: CBMFormData) {
      const onlineStatus = useOnline()
      const detail = useComponentInterventionDetailStore()
      const payload = this.createDefectCBMPayload(param)
      detail.appendTaskUpdatePayload(payload, param.task, true, false)
      let status = ''
      if (!isOfflineOrSlowInternetConnection()) {
        const interventionFormSyncStore = useInterventionFormSyncStore()
        try {
          await interventionFormSyncStore.SyncInterventionDefectData(JSON.stringify(payload))
          status = 'Sync'
          this.updateLocalDefect(param, status)
        } catch (error) {
          const detail = useComponentInterventionDetailStore()
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
            await detail.updateTask(param.task, true)
            status = 'Pending'
            await detail.updateLocalData(param.task)
            this.updateLocalDefect(param, status)
          } else {
            if (error == ServiceSheetErrorMessages.MODIFY_DEFECT_AFTER_SUPERVISOR_APPROVAL || error == ServiceSheetErrorMessages.CHANGE_NOT_APPLICABLE_WITHOUT_REASON || error == ServiceSheetErrorMessages.TASK_UPDATED_BY_OTHER) {
              detail.stateTaskErrorDialog = true
              detail.stateErrorMessageTaskErrorDialog = error as string
            } else if (error == ServiceSheetErrorMessages.SUBMITTED) {
              detail.stateFormSubmittedDialog = true
            } else if (error == ServiceSheetErrorMessages.CLOSE) {
              detail.stateFormCloseDialog = true
            }
            await detail.updateIntervention(true)
          }
        }
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
        await detail.updateTask(param.task, true)
        status = 'Pending'
        await detail.updateLocalData(param.task)
        this.updateLocalDefect(param, status)
      }
    },
    async resetDefectCBMAdjustment(param: CBMFormData) {
      const onlineStatus = useOnline()
      const detail = useComponentInterventionDetailStore()
      const payload = this.createDefectCBMPayload(param)
      detail.appendTaskUpdatePayload(payload, param.task, false, true)
      let status = ''
      if (!isOfflineOrSlowInternetConnection()) {
        const interventionFormSyncStore = useInterventionFormSyncStore()
        await interventionFormSyncStore.SyncInterventionDefectData(JSON.stringify(payload))
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
        status = 'Pending'
      }
      const existing = await db.interventionDefect.filter((l) => {
        return l.taskKey == param.task.taskKey
      }).first()
      if (existing) {
        param.task.task.items.forEach((t) => {
          if (t.valueItemType == "rating") {
            existing.taskValue = t.value
          } else if (t.valueItemType == "inputUom") {
            existing.cbmMeasurement = t.value
          }
        })
        await db.interventionDefect.put(existing)
      } else {
        let rating = ""
        let measurement = ""
        param.task.task.items.forEach((t) => {
          if (t.valueItemType == "rating") {
            rating = t.value
          } else if (t.valueItemType == "inputUom") {
            measurement = t.value
          }
        })
        await db.interventionDefect.add(cloneDeep({
          category: payload.defectHeader?.category as string,
          interventionId: payload.defectHeader?.interventionId as string,
          taskId: payload.defectHeader?.taskId as string,
          taskNo: payload.defectHeader?.taskNo as string,
          taskDesc: payload.defectHeader?.taskDesc as string,
          taskValue: rating as string,
          sapWorkorder: payload.workOrder as string,
          taskKey: payload.defectHeader?.taskId as string,
          cbmMeasurement: measurement,
          type: 'CBM',
          defectData: '',
          repairedStatus: payload.defectHeader?.repairedStatus as string,
          cbmNAStatus: 'Not-Confirm',
          status: payload.defectHeader?.status as string,
          plannerStatus: payload.defectHeader?.plannerStatus ? payload.defectHeader?.plannerStatus : '',
          declineReason: payload.defectHeader?.declineReason ? payload.defectHeader?.declineReason : '',
          statusSync: status,
          declineDate: payload.defectHeader?.declineDate ? payload.defectHeader?.declineDate : '',
          declineBy: payload.defectHeader?.declineBy ? payload.defectHeader?.declineBy : {} as Audit,
          approvedDate: payload.defectHeader?.approvedDate ? payload.defectHeader?.approvedDate : '',
          approvedBy: payload.defectHeader?.approvedBy ? payload.defectHeader?.approvedBy : {} as Audit,
          createdBy: payload.defectHeader?.createdBy ? {
            id: payload.defectHeader?.createdBy.id,
            name: payload.defectHeader?.createdBy.name
          } : {} as Audit,
          createdDate: payload.defectHeader?.createdDate ? payload.defectHeader?.createdDate : '',
          updatedBy: payload.defectHeader?.updatedBy ? {
            id: payload.defectHeader?.updatedBy.id,
            name: payload.defectHeader?.updatedBy.name
          } : {} as Audit,
          updatedDate: payload.defectHeader?.updatedDate ? payload.defectHeader?.updatedDate : '',
          correctedValue: "",
          correctedMeasurement: "",
          correctedUom: ""
        }))
      }
      await detail.updateLocalData(param.task)
      const defectIdentifiedStore = useComponentInterventionDefectsIdentifiedStore()
      defectIdentifiedStore.setDefectIdentifiedData(detail.Intervention.sapWorkOrder as string)
    },
    async getDefectDetail(defectHeaderId: string, interventionHeaderId: string, workOrder: string, idProperty: string): Promise<IDefectYesDetail | IDefectNoDetail> {
      const paramSearch = {}
      paramSearch[idProperty] = defectHeaderId
      paramSearch["sapWorkorder"] = workOrder
      const record = await db.interventionDefect.where(paramSearch).first()
      if (record) {
        return JSON.parse(record.defectData)
      } else {
        const header = await this.getDefectHeaderFromServer(defectHeaderId, interventionHeaderId, idProperty) as unknown as IBaseDefectHeader
        const detail = await this.getDefectDetailFromServer(defectHeaderId, interventionHeaderId, idProperty) as IDefectYesDetail | IDefectNoDetail
        await db.interventionDefect.put({
          category: header.category,
          interventionId: header.interventionId,
          taskId: header.taskId,
          taskNo: header.taskNo,
          taskDesc: header.taskDesc,
          taskValue: header.taskValue,
          sapWorkorder: workOrder,
          taskKey: header.taskId,
          type: detail.type,
          defectHeaderId: header.id,
          defectData: JSON.stringify(detail),
          statusSync: 'Sync',
          repairedStatus: header.repairedStatus,
          cbmNAStatus: 'Not-Confirm',
          status: header.status,
          plannerStatus: header.plannerStatus,
          declineReason: header.declineReason,
          declineDate: header.declineDate,
          declineBy: header.declineBy,
          approvedDate: header.approvedDate,
          approvedBy: header.approvedBy,
          createdBy: header.createdBy,
          createdDate: header.createdDate,
          updatedBy: header.updatedBy,
          updatedDate: header.updatedDate
        })
        return detail
      }
    },
    async getDefectHeader(defectHeaderId: string, interventionHeaderId: string, workOrder: string, idProperty: string): Promise<Defect | undefined> {
      const paramSearch = {}
      paramSearch[idProperty] = defectHeaderId
      paramSearch["sapWorkorder"] = workOrder
      const record = await db.interventionDefect.where(paramSearch).first()
      return record
    },
    async getDefectDecline(taskKey: string): Promise<Decline> {
      const record = await db.interventionDefect.where('taskKey').equals(taskKey).first() as Defect
      const decline = {} as Decline
      decline.isDecline = record.declineReason != ''
      decline.declineReason = record.declineReason
      decline.declineBy = record.declineBy
      decline.declineDate = record.declineDate
      return decline
    },
    async getDefectHeaderFromServer(defectHeaderId: string, interventionHeaderId: string, idProperty: string): Promise<unknown> {
      this.stateIsBusy = true
      const payload = {
        interventionHeaderId: interventionHeaderId,
        isActive: "true",
        isDeleted: "false"
      }
      payload[idProperty] = defectHeaderId
      const response: AxiosResponse<SingleApiResponse<IBaseDefectHeader>> = await ApiService.post(GET_DEFECT_HEADER, payload as AxiosRequestConfig)
      this.stateIsBusy = false
      return response.data.result.content
    },
    async getDefectDetailFromServer(defectHeaderId: string, interventionHeaderId: string, idProperty: string): Promise<unknown> {
      this.stateIsBusy = true
      const payload = {
        interventionHeaderId: interventionHeaderId,
        isActive: "true",
        isDeleted: "false"
      }
      payload[idProperty] = defectHeaderId
      const response: AxiosResponse<SingleApiResponse<ResponseDefectYesDetail | ResponseDefectNoDetail>> = await ApiService.post(GET_DEFECT_DETAIL, payload as AxiosRequestConfig)
      this.stateIsBusy = false
      return response.data.result.content.detail
    },
    createCBMImagePayload(params: TaskUpdateObject) {
      const detailStore = useComponentInterventionDetailStore()
      const payload = {} as InterventionPayload
      payload.employee = params.employee
      payload.localInterventionStatus = detailStore.Intervention.interventionExecution
      payload.headerId = params.id as string
      payload.id = params.id as string
      payload.updateParams = []
      const taskPropertyParam = {} as InterventionPayloadParam
      taskPropertyParam.propertyParams = []
      if (params.taskCategory == "Adjustment") {
        taskPropertyParam.keyValue = params.itemKey as string
        taskPropertyParam.propertyParams.push({
          propertyName: 'pictures',
          propertyValue: JSON.stringify(this.stateCBMImages[params.itemKey as string])
        })
      } else {
        taskPropertyParam.keyValue = params.taskKey as string
        taskPropertyParam.keyValue = params.taskKey as string
        taskPropertyParam.propertyParams = []
        taskPropertyParam.keyValue = params.taskKey as string
        taskPropertyParam.propertyParams = []
        taskPropertyParam.propertyParams.push({
          propertyName: 'images',
          propertyValue: JSON.stringify(this.stateCBMImages[params.taskKey as string])
        })
      }
      payload.updateParams.push(taskPropertyParam)
      payload.workOrder = params.workOrder as string
      return payload
    },
    async submitCBMImageData(params: TaskUpdateObject) {
      const onlineStatus = useOnline()
      const detail = useComponentInterventionDetailStore()
      const payload = this.createCBMImagePayload(params)
      if (!isOfflineOrSlowInternetConnection()) {
        const interventionFormSyncStore = useInterventionFormSyncStore()
        try {
          await interventionFormSyncStore.SyncInterventionTaskData(JSON.stringify(payload))
          const header = useComponentInterventionHeaderStore()
          const intervention = detail.Intervention
          const detailJSON = await header.getWorkOrderDetailById(intervention.keyPbi) as Intervention
          await db.interventionDetail.put(detailJSON)
          detail.stateSelectedIntervention = detailJSON
          detail.setGroup(detailJSON)
          detail.setSelectedGroup(detail.stateGroups[detail.stateSelectedGroup.sequence - 1])
        } catch (error) {
          const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
          if (isNoNetwork) {
            params.value = JSON.stringify(this.stateCBMImages[params.taskKey as string])
            params.type = 'images'
            await db.pendingTask.add({
              module: 'Intervention',
              section: 'E-Form',
              type: 'CBMImage',
              workorder: payload.workOrder as string,
              key: params.taskKey as string,
              bindingKey: params.taskKey as string,
              payload: JSON.stringify(payload),
              syncDate: AESTShortCurrentDateTime(),
              syncStatus: 'Pending'
            })
            params.value = JSON.stringify(this.stateCBMImages[params.taskKey as string])
            await detail.updateLocalTaskCBMImageData(params)
          }
        }
      } else {
        params.value = JSON.stringify(this.stateCBMImages[params.taskKey as string])
        params.type = 'images'
        await db.pendingTask.add({
          module: 'Intervention',
          section: 'E-Form',
          type: 'CBMImage',
          workorder: payload.workOrder as string,
          key: params.taskKey as string,
          bindingKey: params.taskKey as string,
          payload: JSON.stringify(payload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
        params.value = JSON.stringify(this.stateCBMImages[params.taskKey as string])
        await detail.updateLocalTaskCBMImageData(params)
      }
    },
    async getCBMResult(params: TaskUpdateObject, isCbmAdjusment = false) {
      let rating = ''
      const result = {} as RatingResult
      if (isCbmAdjusment) {
        if (params.value == "") {
          params.correctedMeasurement = params.value
          params.correctedValue = rating
          result.rating = rating
          result.task = params
          return result
        }
      } else {
        if (params.value == "") {
          params.cbmMeasurement = params.value
          params.value = rating
          result.rating = rating
          result.task = params
          return result
        }
      }

      const mappings = await db.cbmMapping.where({
        model: params.model,
        psType: params.task.psType
      }).first()
      if (mappings) {
        const formulas = mappings.detail.filter((k) => {
          return k.taskKey == params.taskKey && k.cbmType != "CBM_GAP"
        })
        if (formulas.length < 1) {
          result.rating = rating
          result.task = params
          result.isError = true
          result.errorMessage = 'Rating for this task has not been mapped yet, please insert mapping on IronLake first'
          return result
        }
        formulas.every((formula) => {
          const checkMin = checkMinValueNew(formula as CBMMappingDetail, params.value)
          const checkMax = checkMaxValueNew(formula as CBMMappingDetail, params.value)
          console.log(
            "checkMin",
            checkMin,
            "checkMax",
            checkMax,
            "formula",
            formula,
          );
          rating = checkRatingNew(checkMin, checkMax, formula as CBMMappingDetail)
          if (rating) {
            if (isCbmAdjusment) {
              params.correctedMeasurement = params.value
              params.correctedUom = formula.uom
              params.correctedValue = rating
              const paramRatingItem = params.task.items.find((item) => {
                return item.categoryItemType === "paramRating"
              });
              params.value = paramRatingItem?.value as string
              result.rating = rating
              result.task = params
              return false
            } else {
              params.cbmMeasurement = params.value
              params.uomValue = formula.uom
              params.value = rating
              result.rating = rating
              result.task = params
              return false
            }
          } else {
            return true;
          }
        })
      } else {
        result.isError = true
        result.errorMessage = 'Rating for this task has not been mapped yet, please insert mapping on IronLake first'
      }
      // not found rating (out of range)
      if (!rating) {
        if (isCbmAdjusment) {
          params.correctedValue = ""
        } else {
          params.value = ""
        }
        result.rating = ""
      } else {
        result.rating = rating
      }
      result.task = params
      return result
    },
    async updateDefectDetail(param: DefectYesFormData, generic = false) {
      this.createDefectYesDetail(param)
      const paramSearchDefect = {
        interventionId: param.task.id,
      };
      if (generic) {
        paramSearchDefect["defectHeaderId"] = param.defectHeaderId as string
      } else {
        paramSearchDefect["taskId"] = param.task.taskKey as string
      }
      const defect = await db.interventionDefect.get(paramSearchDefect) as Defect
      const payload = {
        id: defect.defectDetailId,
        updateParams: [{
          keyValue: param.task.taskKey,
          propertyParams: [{
            propertyName: "detail",
            propertyValue: JSON.stringify(this.stateDefectYesData.detail)
          },
          {
            propertyName: "updatedBy",
            propertyValue: JSON.stringify({
              id: param.task.employee.id,
              name: param.task.employee.name
            })
          },
          {
            propertyName: "updatedDate",
            propertyValue: param.submitDate
          },
          {
            propertyName: "otherFitterUpdatedBy",
            propertyValue: JSON.stringify({
              id: param.task.employee.id,
              name: param.task.employee.name
            }),
          }]
        }],
        employee: {
          id: param.task.supervisor.id,
          name: param.task.supervisor.name
        }
      }
      const payloadHeader = {
        id: defect.defectHeaderId,
        updateParams: [{
          keyValue: param.task.taskKey,
          propertyParams: [{
            propertyName: "sapWorkorder",
            propertyValue: defect.sapWorkorder
          },
          {
            propertyName: "updatedBy",
            propertyValue: JSON.stringify({
              id: param.task.employee.id,
              name: param.task.employee.name
            })
          },
          {
            propertyName: "updatedDate",
            propertyValue: param.submitDate
          }]
        }],
        employee: {
          id: param.task.supervisor.id,
          name: param.task.supervisor.name
        }
      }

      const detailStore = useComponentInterventionDetailStore()
      const intervention = detailStore.Intervention
      const syncTaskDefectData = await db.pendingTask.where({
        module: "Intervention",
        workorder: intervention.sapWorkOrder,
        key: generic ? param.defectHeaderId : param.task.taskKey,
        type: generic ? 'DefectGeneric' : 'Defect',
        syncStatus: 'Pending'
      }).toArray()

      const syncTaskUpdateDefectData = await db.pendingTask.where({
        module: "Intervention",
        workorder: intervention.sapWorkOrder,
        key: generic ? param.defectHeaderId : param.task.taskKey,
        type: 'UpdateDefect',
        syncStatus: 'Pending'
      }).toArray()

      // deleting pending task data so can be replaced with new modified defect
      if (syncTaskDefectData.length > 0) {
        const oldData = syncTaskDefectData[0]
        await db.pendingTask.delete(syncTaskDefectData[0].id as number);
        const newPayload = JSON.parse(oldData.payload)
        newPayload.defectDetail = JSON.parse(payload.updateParams[0].propertyParams[0].propertyValue as string)
        await db.pendingTask.add({
          module: 'Intervention',
          section: 'E-Form',
          type: generic ? 'DefectGeneric' : 'Defect',
          workorder: intervention.sapWorkOrder,
          key: generic ? param.defectHeaderId as string : param.task.taskKey as string,
          bindingKey: generic ? param.defectHeaderId as string : param.task.taskKey as string,
          payload: JSON.stringify(newPayload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
      } else if (syncTaskUpdateDefectData.length > 0) {
        await db.pendingTask.delete(syncTaskUpdateDefectData[0].id as number);
        await db.pendingTask.add({
          module: 'Intervention',
          section: 'E-Form',
          type: 'UpdateDefect',
          workorder: intervention.sapWorkOrder,
          key: generic ? param.defectHeaderId as string : param.task.taskKey as string,
          bindingKey: generic ? param.defectHeaderId as string : param.task.taskKey as string,
          payload: JSON.stringify(payload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
      } else {
        if (!isOfflineOrSlowInternetConnection()) {
          const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(`${UPDATE_DEFECT_DETAIL_BY_FITTER}`, payload as AxiosRequestConfig)
          await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payloadHeader as AxiosRequestConfig)
          if (response.data.result.isError) {
            throw (response.data.result.message)
          }
        } else {
          await db.pendingTask.add({
            module: 'Intervention',
            section: 'E-Form',
            type: 'UpdateDefect',
            workorder: intervention.sapWorkOrder,
            key: generic ? param.defectHeaderId as string : param.task.taskKey as string,
            bindingKey: generic ? param.defectHeaderId as string : param.task.taskKey as string,
            payload: JSON.stringify(payload),
            syncDate: AESTShortCurrentDateTime(),
            syncStatus: 'Pending'
          })
        }
      }

      const row = db.interventionDefect.where(paramSearchDefect)
      if (row) {
        await row.delete()
      }
      defect.priority = this.DefectYesData.detail.priority
      defect.defectData = JSON.stringify(this.DefectYesData.detail)
      defect.updatedBy = {
        id: param.task.employee.id,
        name: param.task.employee.name
      }
      defect.updatedDate = param.submitDate
      defect.otherFitterUpdatedBy = {
        id: param.task.employee.id,
        name: param.task.employee.name
      }
      await db.interventionDefect.add(defect)
    }
  }
})
