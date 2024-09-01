import ApiService from '@/core/services/ApiService'
import { Audit } from '@/core/types/intervention/Audit'
import { GeneralPayload } from '@/core/types/intervention/GeneralPayload'
import { Intervention } from '@/core/types/intervention/Intervention'
import {
  InterventionPayload
} from '@/core/types/intervention/InterventionPayload'
import {
  InterventionPayloadParam
} from '@/core/types/intervention/InterventionPayloadParam'
import { LogObject } from '@/core/types/intervention/LogObject'
import { LogParamObject } from '@/core/types/intervention/LogParamObject'
import {
  StatusHistoryParam
} from '@/core/types/intervention/StatusHistoryParam'
import { SubmitFormPayload } from '@/core/types/intervention/SubmitFormPayload'
import { SyncHistory } from '@/core/types/intervention/SyncHistory'
import { WorkOrder } from '@/core/types/intervention/WorkOrder'
import { ApiResponse } from '@/core/types/misc/ApiResponse'
import { SingleApiResponse } from '@/core/types/misc/SingleApiResponse'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { clone, isUndefined, orderBy } from 'lodash'
import { defineStore } from 'pinia'
import {
  GET_LAST_SYNC_DATE,
  UPDATE_DATA,
  OFFSET_DATE_EST_URL,
  SYNC_DATA_PORTAL_FORM,
  GET_DETAIL_FIELD_VALUE,
  UPLOAD_URL
} from './url'
import {
  useComponentInterventionDetailStore
} from './useComponentInterventionDetailStore'
import { db } from '@/database/schema/DexieSchema'
import { ImagePayload } from '@/core/types/intervention/ImagePayload'
import {
  AESTCurrentDateTime,
  AESTShortCurrentDateTime,
  addDateByDynamicParamHelper,
  compareDiffDatesHelper,
  formatUnixDateHelper,
  getUTCOffsetDate
} from '@/core/helpers/date-format'
import {
  RiskAssesmentValue
} from '@/core/types/intervention/RiskAssesmentValue'
import { Value } from '@/core/types/misc/Value'
import {
  ComponentInterventionListPayload
} from '@/core/types/entities/dma/component-intervention/ComponentInterventionListPayload'
import {
  COMPONENT_INTERVENTION_API_URL,
  GENERATE_SERVICE_SHEET_API_URL
} from '../urls'
import { useOnline } from '@vueuse/core'
import {
  useInterventionFormSyncStore
} from "@/store/pinia/dma/component-intervention/refactor/useInterventionFormSyncStore"
import {
  ServicePersonnel
} from '@/core/types/entities/dma/e-form/general/ServicePersonnel'
import {
  PreRiskImagePayload
} from '@/core/types/intervention/PreRiskImagePayload'
import {
  dynamicFieldValueParam
} from '@/core/types/entities/dma/component-intervention/FieldValue'
import { UpdateSMUParam } from '@/core/types/intervention/UpdateSMUParam'
import { Detail } from '@/core/types/intervention/Detail'
import { GET_SAS_URL_IMAGE_BY_ID } from '../../daily-schedule/urls'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore'
import { SMUTolerance } from "@/core/types/entities/dma/e-form/SmuTolerance";
import {
  ListItem
} from "@/core/types/entities/iron-lake/parameter/smu-tolerance-setting/ListItem"
import {
  CRUD_API_URL
} from "@/store/pinia/iron-lake/parameter/smu-tolerance-setting/urls";
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import { addRecord } from '@/database/schema/DatabaseWrapper'
import { QueueFileTask } from '@/database/schema/QueueFileTask'
import { sendErrorEvent } from '@/core/helpers/analytics';

export const useComponentInterventionHeaderStore = defineStore({
  id: 'ComponentInterventionHeaderStore',
  state: () => {
    return {
      stateSelectedWorkOrder: '',
      stateSelectedShortWorkOrder: '',
      stateOutstandingWorkorders: [] as WorkOrder[],
      stateLastSync: '',
      stateActiveFitter: {} as Audit,
      stateGeneralSubmitted: false,
      stateLog: {} as LogParamObject,
      stateServicePersonnel: {} as ServicePersonnel,
      stateServicePersonnels: [] as ServicePersonnel[],
      stateDayOffset: 0,
      stateIsBusy: false,

      stateSMUTolerance: {} as SMUTolerance,
      stateSMUToleranceNotMapped: false,
    }
  },
  getters: {
    WorkOrder: (state) => {
      return state.stateOutstandingWorkorders.sort((a, b) => {
        return compareDiffDatesHelper(new Date(b.headerChangedOn), new Date(a.headerChangedOn))
      });
    },
    SelectedWorkOrder: (state) => {
      return state.stateSelectedWorkOrder
    },
    SelectedShortWO: (state) => {
      return state.stateSelectedShortWorkOrder
    },
    LastSync: (state) => {
      return state.stateLastSync
    },
    GeneralSubmitted: (state) => {
      return state.stateGeneralSubmitted
    },
    ActiveFitter: (state) => {
      return state.stateLog?.employee
    },
    Log: (state) => {
      return state.stateLog
    },
    CutOffEstimate: (state) => {
      const date = getUTCOffsetDate(+10.00)
      return addDateByDynamicParamHelper(date, "DD/MM/YYYY HH:mm:ss", state.stateDayOffset, 'days')
    },
    IsBusy: (state) => {
      return state.stateIsBusy
    },
    onlineStatus: () => {
      return useOnline()
    },
    authStore: () => {
      return useAuthenticationStore()
    },
    smuTolerance: (state) => {
      return state.stateSMUTolerance
    },
    SMUToleranceNotMapped: (state) => {
      return state.stateSMUToleranceNotMapped
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
  },
  actions: {
    setLog(data: LogParamObject) {
      this.stateLog = data
    },
    setServicePersonnel(data: ServicePersonnel) {
      this.stateServicePersonnel = data
    },
    setBusyState(value: boolean) {
      this.stateIsBusy = value
    },
    setSelectedWorkOrder(value: string) {
      this.stateSelectedWorkOrder = value
    },
    setSelectedShortWorkOrder(value: string) {
      this.stateSelectedShortWorkOrder = value
    },
    async getParamDaysBeforeEst() {
      const body = {
        key: "InterventionMaxEstDate"
      }
      try {
        const response: AxiosResponse<SingleApiResponse<Value>> = await ApiService.post(OFFSET_DATE_EST_URL, body as AxiosRequestConfig)
        try {
          await db.offsetDate.add({
            offsetDate: +response.data.result.content.value
          })
        } catch (error) {
          await db.offsetDate.put({
            offsetDate: +response.data.result.content.value
          })
          sendErrorEvent('IRONS', error);
        }
        this.stateDayOffset = +response.data.result.content.value
      } catch (error) {
        console.log(error);
      }
    },
    async syncWithIronPortalData() {
      const params = {
        ver: 'v1'
      }
      try {
        await ApiService.get(`${SYNC_DATA_PORTAL_FORM}?${new URLSearchParams(params).toString()}`);
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async getWorkOrdersFromLocal() {
      const offset = await db.offsetDate.limit(1).first()
      if (offset) {
        this.stateDayOffset = offset.offsetDate
      }
      this.stateOutstandingWorkorders = await db.interventionHeader.toArray()
    },
    async getWorkOrderFromDB(key: string) {
      await db.interventionHeader.get(key)
    },
    async getWorkOrderDetailFromDB(key: string) {
      return await db.interventionDetail.where('keyPbi').equals(key).first()
    },
    async getWorkOrders(site) {
      try {
        if (this.stateDayOffset == 0) {
          await this.getParamDaysBeforeEst()
        }
        this.stateOutstandingWorkorders = await db.interventionHeader.toArray()
        const params = {
          ver: "v1",
          siteId: site
        }
        const response: AxiosResponse<ApiResponse<ComponentInterventionListPayload>> = await ApiService.get(COMPONENT_INTERVENTION_API_URL, "", new URLSearchParams(params).toString());
        const data = [] as WorkOrder[]
        if (response.data.result.content.length < 1) {
          this.stateOutstandingWorkorders = []
          await db.interventionHeader.clear()
          await db.interventionDetail.clear()
          await db.interventionDefect.clear()
          this.stateOutstandingWorkorders = []
        }
        response.data.result.content.forEach((val) => {
          data.push({
            id: val.keyPbi,
            equipment: val.equipment,
            equipmentDesc: val.equipmentDesc,
            sampleStatus: val.sampleStatus,
            componentDescription: val.componentDescription,
            sapWorkOrder: val.sapWorkOrder,
            mdInterventionStatusId: val.mdInterventionStatusId,
            interventionStatus: val.interventionStatus,
            interventionDiagnosis: val.interventionDiagnosis,
            followUpPriority: val.followUpPriority,
            estimationCompletionDate: val.estimationCompletionDate,
            headerChangedOn: val.headerChangedOn,
            interventionExecution: val.interventionExecution,
            progress: val.progress,
            componentSystem: val.componentSystem
          })
        })
        // get the keys
        const keys = data.map((w) => {
          return w.id
        })
        // obseletes wo header
        const obs = db.interventionHeader.filter((h) => {
          return !keys.includes(h.id)
        })
        await obs.delete()
        // obseletes wo detail
        const detailObs = db.interventionDetail.filter((d) => {
          return !keys.includes(d.keyPbi)
        })
        await detailObs.delete()
        for (const wo of data) {
          const existing = await db.interventionHeader.where('id').equals(wo.id).first()
          if (!existing) {
            await db.interventionHeader.add({
              id: wo.id,
              equipment: wo.equipment,
              equipmentDesc: wo.equipmentDesc,
              sampleStatus: wo.sampleStatus,
              componentDescription: wo.componentDescription,
              sapWorkOrder: wo.sapWorkOrder,
              mdInterventionStatusId: wo.mdInterventionStatusId,
              interventionStatus: wo.interventionStatus,
              interventionDiagnosis: wo.interventionDiagnosis,
              followUpPriority: wo.followUpPriority,
              estimationCompletionDate: wo.estimationCompletionDate,
              status: 'Not Updated',
              headerChangedOn: wo.headerChangedOn,
              interventionExecution: wo.interventionExecution,
              progress: wo.progress,
              componentSystem: wo.componentSystem
            })
          }
          if (existing) {
            const data = await db.interventionHeader.where('id').equals(wo.id).first() as WorkOrder
            const identical = (data.equipment == wo.equipment && data.equipmentDesc == wo.equipmentDesc &&
                data.sampleStatus == wo.sampleStatus && data.componentDescription == wo.componentDescription &&
                data.sapWorkOrder == wo.sapWorkOrder && data.estimationCompletionDate == wo.estimationCompletionDate)
            await db.interventionHeader.put({
              id: wo.id,
              equipment: wo.equipment,
              equipmentDesc: wo.equipmentDesc,
              sampleStatus: wo.sampleStatus,
              componentDescription: wo.componentDescription,
              sapWorkOrder: wo.sapWorkOrder,
              mdInterventionStatusId: wo.mdInterventionStatusId,
              interventionStatus: wo.interventionStatus,
              interventionDiagnosis: wo.interventionDiagnosis,
              followUpPriority: wo.followUpPriority,
              estimationCompletionDate: wo.estimationCompletionDate,
              status: identical ? data.status : 'Not Updated',
              headerChangedOn: wo.headerChangedOn,
              interventionExecution: wo.interventionExecution,
              progress: wo.progress,
              componentSystem: wo.componentSystem
            })
          }
          this.stateOutstandingWorkorders = await db.interventionHeader.toArray()
        }
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log('error')
      }
    },
    async syncWorkOrders(site) {
      try {
        if (this.stateDayOffset == 0) {
          await this.getParamDaysBeforeEst()
        }
        const params = {
          ver: "v1",
          siteId: site
        }
        const response: AxiosResponse<ApiResponse<ComponentInterventionListPayload>> = await ApiService.get(COMPONENT_INTERVENTION_API_URL, "", new URLSearchParams(params).toString());
        const data = [] as WorkOrder[]
        if (response.data.result.content.length < 1) {
          this.stateOutstandingWorkorders = []
          await db.interventionHeader.clear()
          await db.interventionDetail.clear()
          await db.interventionDefect.clear()
          this.stateOutstandingWorkorders = []
        }
        response.data.result.content.forEach((val) => {
          data.push({
            id: val.keyPbi,
            equipment: val.equipment,
            equipmentDesc: val.equipmentDesc,
            sampleStatus: val.sampleStatus,
            componentDescription: val.componentDescription,
            sapWorkOrder: val.sapWorkOrder,
            mdInterventionStatusId: val.mdInterventionStatusId,
            interventionStatus: val.interventionStatus,
            interventionDiagnosis: val.interventionDiagnosis,
            followUpPriority: val.followUpPriority,
            estimationCompletionDate: val.estimationCompletionDate,
            headerChangedOn: val.headerChangedOn,
            interventionExecution: val.interventionExecution,
            progress: val.progress,
            componentSystem: val.componentSystem
          })
        })
        const ids = data.map((w) => {
          return w.id
        })
        /* delete obselete outstanding */
        const obseleteWO = await db.interventionHeader.filter((o) => {
          return !ids.includes(o.id)
        }).toArray()
        const wos = obseleteWO.map((e) => {
          return e.sapWorkOrder
        })
        /* delete obselete detail */
        await db.interventionDetail.filter((o) => {
          return wos.includes(o.sapWorkOrder)
        }).delete()
        await db.interventionHeader.filter((o) => {
          return !ids.includes(o.id)
        }).delete()
        await this.syncDetail()
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    async setInterventionHeaderToLocalDB(interventionHeader: WorkOrder) {
      await db.interventionHeader.put({
        id: interventionHeader.id,
        equipment: interventionHeader.equipment,
        equipmentDesc: interventionHeader.equipmentDesc,
        sampleStatus: interventionHeader.sampleStatus,
        componentDescription: interventionHeader.componentDescription,
        sapWorkOrder: interventionHeader.sapWorkOrder,
        mdInterventionStatusId: interventionHeader.mdInterventionStatusId,
        interventionStatus: interventionHeader.interventionStatus,
        interventionDiagnosis: interventionHeader.interventionDiagnosis,
        followUpPriority: interventionHeader.followUpPriority,
        estimationCompletionDate: interventionHeader.estimationCompletionDate,
        status: 'Updated',
        headerChangedOn: interventionHeader.headerChangedOn,
        interventionExecution: interventionHeader.interventionExecution,
        progress: interventionHeader.progress,
        componentSystem: interventionHeader.componentSystem
      });
    },
    async handleSetInterventionAccessibleOffline(interventionHeader: WorkOrder) {
      // get data from server
      const detailJSON = await this.getWorkOrderDetailById(interventionHeader.id);
      // update header data to local DB
      await this.setInterventionHeaderToLocalDB(interventionHeader);
      // reformat state array (for WO option on dashboard)
      this.stateOutstandingWorkorders = await db.interventionHeader.toArray()
      // update detail data to local DB
      if (detailJSON && detailJSON != null) {
        await this.updateIntervention(detailJSON)
      }
      console.log(detailJSON, "detailJSON");
    },
    async syncDetail() {
      const interval = 1000
      let promise = Promise.resolve()
      const data = clone(this.stateOutstandingWorkorders)
      for (const w of data) {
        promise = promise.then(async () => {
          const detailJSON = await this.getWorkOrderDetailById(w.id)
          if (detailJSON && detailJSON != null) {
            await db.interventionDetail.put(detailJSON)
          }
          await db.interventionHeader.put({
            id: w.id,
            equipment: w.equipment,
            equipmentDesc: w.equipmentDesc,
            sampleStatus: w.sampleStatus,
            componentDescription: w.componentDescription,
            sapWorkOrder: w.sapWorkOrder,
            mdInterventionStatusId: w.mdInterventionStatusId,
            interventionStatus: w.interventionStatus,
            interventionDiagnosis: w.interventionDiagnosis,
            followUpPriority: w.followUpPriority,
            estimationCompletionDate: w.estimationCompletionDate,
            status: 'Updated',
            headerChangedOn: w.headerChangedOn,
            interventionExecution: w.interventionExecution,
            progress: w.progress,
            componentSystem: w.componentSystem
          })
          this.stateOutstandingWorkorders = await db.interventionHeader.toArray()
          return new Promise(function (resolve) {
            setTimeout(resolve, interval);
          })
        })
      }
    },
    async updateIntervention(intervention: Intervention) {
      // search di intervention detail yg mana yg sapWO nya sekian, trs hapus n add baru
      const findAllDetail = await db.interventionDetail.filter((detail) => {
        return detail.sapWorkOrder == intervention.sapWorkOrder
      })
      if (findAllDetail) {
        await findAllDetail.delete()
      }
      await db.interventionDetail.add(intervention)
    },
    async getWorkOrderDetailById(id: string): Promise<Intervention|null> {
      const params = {
        ver: 'v1',
        keyPbi: id
      }
      try {
        const response: AxiosResponse<SingleApiResponse<Intervention>> = await ApiService.get(`${GENERATE_SERVICE_SHEET_API_URL}?${new URLSearchParams(params).toString()}`)
        const intervention = response.data.result.content
        await this.handleSaveImagesToLocal(intervention)
        const findAllDetail = await db.interventionDetail.filter((detail) => {
          return detail.sapWorkOrder == intervention.sapWorkOrder
        })
        if (findAllDetail) {
          await findAllDetail.delete()
        }
        await db.interventionDetail.add(intervention)
        const header = await db.interventionHeader.where({
          sapWorkOrder: +intervention.sapWorkOrder
        }).first()
        if (header) {
          header.status = 'Updated'
          await db.interventionHeader.put(header)
        }
        return response.data.result.content
      } catch (error) {
        sendErrorEvent('IRONS', error);
        return null
      }
    },
    async updateHeaders(payload: InterventionPayload) {
      try {
        await ApiService.post(UPDATE_DATA, payload as AxiosRequestConfig)
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async handleSaveImagesToLocal(intervention: Intervention): Promise<void> {
      const imgIDArr: string[] = []
      const checkImageItem = async (item) => {
        if (item.itemType == "image") {
          if (!isOfflineOrSlowInternetConnection()) {
            const existing = await db.taskReference.where({
              filename: item.value as string
            }).first()
            if (!existing) {
              if (!imgIDArr.includes(item.value as string)) {
                imgIDArr.push(item.value as string)
              }
            } else {
              if (!existing.createdDate) {
                db.taskReference.where({
                  filename: item.value
                }).delete()
                if (!imgIDArr.includes(item.value as string)) {
                  imgIDArr.push(item.value as string)
                }
              } else {
                const currentDate = new Date()
                const createdDate = existing.createdDate
                const timeDiff = currentDate.getTime() - createdDate.getTime()
                const dayDiff = timeDiff / (1000 * 60 * 60 * 24)
                if (dayDiff > 1) {
                  db.taskReference.where({
                    filename: item.value
                  }).delete()
                  if (!imgIDArr.includes(item.value as string)) {
                    imgIDArr.push(item.value as string)
                  }
                }
              }
            }
          }
        }
      }
      const detail = intervention.details
      // loop task
      for (const taskGroup of detail) {
        for (const taskSection of taskGroup.tasks) {
          for (const task of taskSection.tasks) {
            if (task.reference) {
              // todo
              for (const item of task.reference.items) {
                for (const itemIndex in item) {
                  const colItem = item[itemIndex]
                  await checkImageItem(colItem)
                }
              }
            }
          }
        }
      }

      if (imgIDArr.length == 0) return
      for (const imgIdIndex in imgIDArr) {
        const imgId = imgIDArr[imgIdIndex]
        const params = {
          ver: "v1",
          id: imgId
        }
        const response: AxiosResponse<SingleApiResponse<URL>> = await ApiService.get(`${GET_SAS_URL_IMAGE_BY_ID}`, "", new URLSearchParams(params).toString());
        const imageUrl = response.data.result.content
        const file = await fetch(imageUrl.toString(), {
          headers: new Headers({ })
        }).then((r) => {
          return r.blob()
        }).then((blobData) => {
          return blobData
        })
        await db.taskReference.add({
          workorder: intervention.sapWorkOrder,
          filename: imgId,
          file: file,
          fileType: "image",
          createdDate: new Date()
        })
      }
    },
    async getLatestSyncDate() {
      const queryString = {
        ver: 'v1',
        limit: '1',
        orderBy: '_ts',
        orderType: 'desc',
      }
      const params = {
        isActive: 'true'
      }
      try {
        const response: AxiosResponse<ApiResponse<SyncHistory>> = await ApiService.post(`${GET_LAST_SYNC_DATE}?${new URLSearchParams(queryString).toString()}`, params as AxiosRequestConfig)
        const syncData = response.data.result.content
        if (syncData.length > 0) {
          const latestData = orderBy(syncData, ["_ts"], ["desc"])
          this.stateLastSync = `${formatUnixDateHelper(latestData[0]._ts, "DD/MM/YYYY HH:mm:ss")} (AEST)`
        }
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error);
      }
    },
    setActiveFitter(fitter: Audit) {
      this.stateActiveFitter = fitter
    },
    createLogPayload(data: LogParamObject, payload: InterventionPayload) {
      const detail = useComponentInterventionDetailStore()
      let logs: LogObject[]
      if (detail.Intervention.log == null) {
        logs = [] as LogObject[]
      } else {
        logs = detail.Intervention.log
      }
      let log = logs?.find((l) => {
        return l.employee?.id == data.employee.id
      })
      if (log) {
        if (!Array.isArray(log.timeLoggedIn)) {
          log.timeLoggedIn = log.timeLoggedIn != '' ? [log.timeLoggedIn] : []
        }
        log.timeLoggedIn.push(data.timeLoggedIn)
        log.riskPhotos = []
        logs = detail.Intervention.log as LogObject[]
      } else {
        log = {} as LogObject
        log.employee = data.employee
        log.timeLoggedIn = [data.timeLoggedIn]
        log.shift = data.shift
        log.isIHaveReadChecked = true
        log.riskPhotos = []
        logs = [log]
      }
      payload.updateParams[0].propertyParams.push({
        propertyName: 'log',
        propertyValue: JSON.stringify(log)
      })
      return logs
    },
    setServicePersonnelForPayload(serviceEnd = "") {
      if (serviceEnd) {
        this.stateServicePersonnel.serviceEnd = serviceEnd
      }
    },
    createServiceHistoryPayload(params: StatusHistoryParam, payload: InterventionPayload) {
      const detail = useComponentInterventionDetailStore()
      const histories = detail.Intervention.statusHistory
      const newHistories = histories.concat(params)
      payload.updateParams[0].propertyParams.push({
        propertyName: 'statusHistory',
        propertyValue: JSON.stringify(newHistories)
      })
    },
    createGeneralFormPayload(params: GeneralPayload, isSubmittedBefore: boolean) {
      const payload = {} as InterventionPayload
      payload.employee = params.employee
      payload.localInterventionStatus = params.status
      payload.id = params.id
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = params.key
      propertyParam.propertyParams = []
      if (!isSubmittedBefore) {
        propertyParam.propertyParams.push({
          propertyName: 'serviceStart',
          propertyValue: params.submitDate
        })
      }
      propertyParam.propertyParams.push({
        propertyName: 'interventionSMU',
        propertyValue: params.smu.replaceAll(',', '')
      })
      propertyParam.propertyParams.push({
        propertyName: 'interventionExecution',
        propertyValue: params.status
      })
      propertyParam.propertyParams.push({
        propertyName: 'supervisor',
        propertyValue: JSON.stringify(payload.employee)
      })
      propertyParam.propertyParams.push({
        propertyName: 'updatedBy',
        propertyValue: JSON.stringify(payload.employee)
      })
      propertyParam.propertyParams.push({
        propertyName: 'updatedDate',
        propertyValue: params.submitDate
      })
      propertyParam.propertyParams.push({
        propertyName: 'servicePersonnels',
        propertyValue: JSON.stringify(this.stateServicePersonnel)
      })
      payload.updateParams.push(propertyParam)
      return payload
    },
    createFinishFormPayload(params: GeneralPayload) {
      const payload = {} as InterventionPayload
      payload.employee = params.employee
      payload.localInterventionStatus = params.status
      payload.id = params.id
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = params.key
      propertyParam.propertyParams = []
      propertyParam.propertyParams.push({
        propertyName: 'servicePersonnels',
        propertyValue: JSON.stringify({
          ...this.stateServicePersonnel,
          serviceEnd: AESTCurrentDateTime()
        })
      })
      propertyParam.propertyParams.push({
        propertyName: 'updatedBy',
        propertyValue: JSON.stringify(payload.employee)
      })
      propertyParam.propertyParams.push({
        propertyName: 'updatedDate',
        propertyValue: params.submitDate
      })
      payload.updateParams.push(propertyParam)
      return payload
    },
    createPreRiskImages(params: ImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      const images = detailStore.RiskAssessmentImages
      const fitterImages = images.filter((x) => {
        return x.updatedBy.id == this.Log.employee.id
      }).slice(0, 1)
      let type = 'front'
      if (fitterImages.length > 0 && fitterImages[0].imageType) {
        type = fitterImages[0].imageType == 'front' ? 'back' : type
      }
      images.push({
        image: params.files[0],
        imageType: type,
        updatedBy: params.employee,
        updatedDate: AESTCurrentDateTime()
      })
      return images
    },
    preRiskImagesFiltered(filename: string) {
      const detailStore = useComponentInterventionDetailStore()
      const images = detailStore.RiskAssessmentImages.filter((x) => {
        if (typeof x.image == 'string') {
          return x.image != filename
        } else {
          return x.image.filename != filename
        }
      })
      return images
    },
    createTaskPreRiskPayload(params: ImagePayload, images: RiskAssesmentValue[]) {
      const detailStore = useComponentInterventionDetailStore()
      const payload = {} as InterventionPayload
      payload.employee = params.employee
      payload.localInterventionStatus = detailStore.Intervention.interventionExecution
      payload.id = params.id
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = params.key
      propertyParam.propertyParams = []
      propertyParam.propertyParams.push({
        propertyName: 'value',
        propertyValue: JSON.stringify(images)
      })
      payload.updateParams.push(propertyParam)
      return payload
    },
    async createTaskPreRisk(params: ImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      const intervention = detailStore.Intervention
      const preRiskImages = this.createPreRiskImages(params)
      const payload = this.createTaskPreRiskPayload(params, preRiskImages)
      if (!isOfflineOrSlowInternetConnection()) {
        await this.storeImageToServer(payload)
      } else {
        await db.pendingTask.add({
          module: 'Intervention',
          section: 'E-Form',
          type: 'PreRisk',
          workorder: intervention.sapWorkOrder,
          key: params.key,
          bindingKey: params.key,
          payload: JSON.stringify(payload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
      }
      for (const [index, blob] of params.blobs.entries()) {
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
        if (!isOfflineOrSlowInternetConnection()) {
          const payload = new FormData();
          payload.append("files", blob, `${params.files[index].filename}.png`)
          payload.append("userAccount", this.authStore.user.Email)
          this.storeImageBlobToServer(payload, fileTask)
        } else {
          await addRecord(db, 'pendingTaskFile', fileTask)
        }
      }
      return preRiskImages
    },
    async deleteRiskAssesmentImage(params: PreRiskImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      const preRiskImages = await this.createTaskPreRiskDelete(params)
      await detailStore.updateRiskAssesmentImageData(preRiskImages, this.stateLog)
    },
    async createTaskPreRiskDelete(params: PreRiskImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      const intervention = detailStore.Intervention
      const preRiskImages = this.preRiskImagesFiltered(params.filename)
      const payload = {} as InterventionPayload
      payload.employee = params.employee
      payload.localInterventionStatus = detailStore.Intervention.interventionExecution
      payload.id = params.id
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = params.key
      propertyParam.propertyParams = []
      propertyParam.propertyParams.push({
        propertyName: 'value',
        propertyValue: JSON.stringify(preRiskImages)
      })
      payload.updateParams.push(propertyParam)
      await db.pendingTask.add({
        module: 'Intervention',
        section: 'E-Form',
        type: 'PreRisk',
        workorder: intervention.sapWorkOrder,
        key: params.key,
        bindingKey: params.key,
        payload: JSON.stringify(payload),
        syncDate: AESTShortCurrentDateTime(),
        syncStatus: 'Pending'
      })
      return preRiskImages
    },
    createTaskImagePayload(params: ImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      const payload = {} as InterventionPayload
      payload.employee = params.employee
      payload.localInterventionStatus = detailStore.Intervention.interventionExecution
      payload.id = params.id
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = params.key
      propertyParam.propertyParams = []
      propertyParam.propertyParams.push({
        propertyName: params.type,
        propertyValue: JSON.stringify(params.files)
      })
      payload.updateParams.push(propertyParam)
      return payload
    },
    updatePreRiskImagePayload(params: PreRiskImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      const payload = {} as InterventionPayload
      payload.employee = params.employee
      payload.localInterventionStatus = detailStore.Intervention.interventionExecution
      payload.id = params.id
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = params.key
      propertyParam.propertyParams = []
      return payload
    },
    async createTaskImage(params: ImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      const intervention = detailStore.Intervention
      const payload = this.createTaskImagePayload(params)
      const existingTask = db.pendingTask.where({
        module: 'Intervention',
        type: 'General',
        key: params.key,
        itemKey: `${intervention.sapWorkOrder}-ImageEquipment`,
        workorder: intervention.sapWorkOrder,
        syncStatus: 'Pending'
      });
      if (existingTask) {
        await existingTask.delete()
      }
      await db.pendingTask.add({
        module: 'Intervention',
        section: 'E-Form',
        type: 'General',
        workorder: intervention.sapWorkOrder,
        key: params.key,
        bindingKey: params.key,
        itemKey: `${intervention.sapWorkOrder}-ImageEquipment`,
        payload: JSON.stringify(payload),
        syncDate: AESTShortCurrentDateTime(),
        syncStatus: 'Pending'
      })
      for (const [index, blob] of params.blobs.entries()) {
        const fileTask: QueueFileTask = {
          module: 'Intervention',
          key: params.key,
          workorder: intervention.sapWorkOrder,
          type: params.type,
          fileType: params.files[index].fileType ?? 'webp',
          createdBy: params.employee.id,
          email: params.email,
          filename: params.files[index].filename,
          originalFilename: params.files[index].filename,
          blob: blob,
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        }
        await addRecord(db, 'pendingTaskFile', fileTask)
      }
    },
    async storeImageLocal(params: ImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      const intervention = detailStore.Intervention
      const existing = await db.pendingTaskFile.get({
        filename: params.files[0].filename
      })
      if (existing) return
      const fileTask: QueueFileTask = {
        module: 'Intervention',
        key: params.key,
        workorder: intervention.sapWorkOrder,
        type: params.type,
        fileType: params.files[0].fileType ?? 'webp',
        createdBy: params.employee.id,
        email: params.email,
        filename: params.files[0].filename,
        originalFilename: params.files[0].filename,
        blob: params.blobs[0],
        syncDate: AESTShortCurrentDateTime(),
        syncStatus: 'Pending'
      }
      await addRecord(db, 'pendingTaskFile', fileTask)
    },
    async storeImageToServer(params: InterventionPayload) {
      try {
        await ApiService.post(UPDATE_DATA, params as AxiosRequestConfig)
      } catch (error) {
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async storeImageBlobToServer(payload: FormData, fileTask: QueueFileTask | undefined = undefined) {
      const params = {
        ver: "v1",
        userAccount: this.authStore.user.Email
      };
      let syncStatus = ''
      try {
        await ApiService.post(`${UPLOAD_URL}?${new URLSearchParams(params).toString()}`,
        payload as AxiosRequestConfig);
        syncStatus = 'Sync'
      } catch (error) {
        syncStatus = 'Failed'
        sendErrorEvent('IRONS', error);
      } finally {
        if (fileTask) {
          fileTask.syncDate = AESTShortCurrentDateTime()
          fileTask.syncStatus = syncStatus
          await addRecord(db, 'pendingTaskFile', fileTask)
        }
      }
    },
    async updateEquipmentImage(params: ImagePayload) {
      const detailStore = useComponentInterventionDetailStore()
      await this.createTaskImage(params)
      await detailStore.updateEquipmentImageData(params)
    },
    async updateRiskAssesmentImage(params: ImagePayload, completed: boolean) {
      const detailStore = useComponentInterventionDetailStore()
      const preRiskImages = await this.createTaskPreRisk(params)
      if (completed) {
        this.createLogTask(this.stateLog, params.employee)
      }
      await detailStore.updateRiskAssesmentImageData(preRiskImages, this.stateLog)
    },
    async getExisitingSMU(param: dynamicFieldValueParam) {
      const body = {
        id: param.id,
        keyValue: param.key,
        propertyName: param.propertyName,
      }
      const params = {
        ver: "v1",
      }
      const response: AxiosResponse<SingleApiResponse<string>> = await ApiService.post(`${GET_DETAIL_FIELD_VALUE}?${new URLSearchParams(params).toString()}`, body as AxiosRequestConfig)
      return response.data.result.content ?? ''
    },
    createUpdateSMUPayload(params: UpdateSMUParam) {
      const payload = {} as InterventionPayload
      payload.employee = params.employee
      payload.localInterventionStatus = params.status
      payload.id = params.id
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = params.key
      propertyParam.propertyParams = []
      let userEdit = this.Log.employee
      if (params.fitter) {
        userEdit = params.fitter
      }
      propertyParam.propertyParams.push({
        propertyName: 'interventionSMU',
        propertyValue: params.value
      },
      {
        propertyName: "smuBy",
        propertyValue: params.value !== '' ? JSON.stringify(userEdit) : ""
      },
      {
        propertyName: "smuDate",
        propertyValue: params.value !== '' ? params.submitDate : ""
      },
      {
        propertyName: "updatedBy",
        propertyValue: params.value !== '' ? JSON.stringify(userEdit) : ""
      },
      {
        propertyName: "updatedDate",
        propertyValue: params.value !== '' ? params.submitDate : ""
      })
      payload.updateParams.push(propertyParam)
      return payload
    },
    async updateSMU(params: UpdateSMUParam) {
      const detailStore = useComponentInterventionDetailStore()
      const interventionFormSyncStore = useInterventionFormSyncStore()
      const intervention = detailStore.Intervention
      const payload = this.createUpdateSMUPayload(params)
      let userEdit = this.Log.employee
      if (params.fitter) {
        userEdit = params.fitter
      }
      if (!isOfflineOrSlowInternetConnection()) {
        try {
          await interventionFormSyncStore.SyncInterventionGeneralData(JSON.stringify(payload))
        } catch (e) {
          // if sync error
          const existingTask = db.pendingTask.where({
            module: 'Intervention',
            type: 'General',
            key: params.key,
            itemKey: `${intervention.sapWorkOrder}-SMU`,
            workorder: intervention.sapWorkOrder,
            syncStatus: 'Pending'
          });
          if (existingTask) {
            await existingTask.delete()
          }
          await db.pendingTask.add({
            module: 'Intervention',
            section: 'E-Form',
            type: 'General',
            workorder: intervention.sapWorkOrder,
            key: params.key,
            itemKey: `${intervention.sapWorkOrder}-SMU`,
            bindingKey: params.key,
            payload: JSON.stringify(payload),
            syncDate: AESTShortCurrentDateTime(),
            syncStatus: 'Pending'
          })
        } finally {
          const detailJSON = await this.getWorkOrderDetailById(intervention.keyPbi)
          // incase if return is null
          if (detailJSON) await db.interventionDetail.put(detailJSON as Intervention)
        }
        // update to SMU
        detailStore.updateSMU({
          value: params.value,
          smuBy: userEdit,
          smuDate: params.submitDate
        })
      } else {
        // if no signal
        const existingTask = db.pendingTask.where({
          module: 'Intervention',
          type: 'General',
          key: params.key,
          workorder: intervention.sapWorkOrder,
          itemKey: `${intervention.sapWorkOrder}-SMU`,
          syncStatus: 'Pending'
        });
        if (existingTask) {
          await existingTask.delete()
        }
        await db.pendingTask.add({
          module: 'Intervention',
          section: 'E-Form',
          type: 'General',
          workorder: intervention.sapWorkOrder,
          key: params.key,
          bindingKey: params.key,
          itemKey: `${intervention.sapWorkOrder}-SMU`,
          payload: JSON.stringify(payload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
        detailStore.updateSMU({
          value: params.value,
          smuBy: userEdit,
          smuDate: params.submitDate
        })
      }
    },
    async createLogTask(log: LogParamObject, employee: Audit) {
      const detail = useComponentInterventionDetailStore()
      const payload = {} as InterventionPayload
      payload.employee = employee
      payload.localInterventionStatus = detail.Intervention.interventionExecution
      payload.id = detail.Intervention.id
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = detail.Intervention.id
      propertyParam.propertyParams = []
      payload.updateParams.push(propertyParam)
      this.createLogPayload(log, payload)
      await db.pendingTask.add({
        module: 'Intervention',
        section: 'E-Form',
        type: 'General',
        workorder: detail.Intervention.sapWorkOrder,
        key: detail.Intervention.id,
        bindingKey: detail.Intervention.id,
        payload: JSON.stringify(payload),
        syncDate: AESTShortCurrentDateTime(),
        syncStatus: 'Pending'
      })
    },
    async submitGeneral(params: GeneralPayload) {
      const detailStore = useComponentInterventionDetailStore()
      const interventionFormSyncStore = useInterventionFormSyncStore()
      const intervention = detailStore.Intervention
      const isSubmittedBefore = intervention.interventionExecution != 'Open'
      const payload = this.createGeneralFormPayload(params, isSubmittedBefore)
      params.logs = this.createLogPayload(params.log, payload)
      params.servicePersonnel = this.stateServicePersonnel
      this.createServiceHistoryPayload(params.history, payload)
      if (!isOfflineOrSlowInternetConnection()) {
        try {
          await interventionFormSyncStore.SyncInterventionGeneralData(JSON.stringify(payload))
          const detailJSON = await this.getWorkOrderDetailById(intervention.keyPbi)
          await db.interventionDetail.put(detailJSON as Intervention)
          await detailStore.updateHeaderData(params)
        } catch (error) {
          const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
          if (isNoNetwork) {
            await db.pendingTask.add({
              module: 'Intervention',
              section: 'E-Form',
              type: 'General',
              workorder: intervention.sapWorkOrder,
              key: params.key,
              bindingKey: params.key,
              payload: JSON.stringify(payload),
              syncDate: AESTShortCurrentDateTime(),
              syncStatus: 'Pending'
            })
            await detailStore.updateHeaderData(params)
            this.stateGeneralSubmitted = true
          }
        }
      } else {
        await db.pendingTask.add({
          module: 'Intervention',
          section: 'E-Form',
          type: 'General',
          workorder: intervention.sapWorkOrder,
          key: params.key,
          bindingKey: params.key,
          payload: JSON.stringify(payload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
        await detailStore.updateHeaderData(params)
      }
      this.stateGeneralSubmitted = true
    },
    async UpdateServiceEndMechanic(params: GeneralPayload) {
      const payload = this.createFinishFormPayload(params)
      const interventionFormSyncStore = useInterventionFormSyncStore()
      if (!isOfflineOrSlowInternetConnection()) {
        await interventionFormSyncStore.SyncInterventionGeneralData(JSON.stringify(payload))
      } else {
        const detailStore = useComponentInterventionDetailStore()
        const intervention = detailStore.Intervention
        await db.pendingTask.add({
          module: 'Intervention',
          section: 'E-Form',
          type: 'General',
          workorder: intervention.sapWorkOrder,
          key: `FINISH-${params.id}`,
          bindingKey: `FINISH-${params.id}`,
          payload: JSON.stringify(payload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
      }
    },
    async submitForm(params: SubmitFormPayload) {
      const onlineStatus = useOnline();
      const detailStore = useComponentInterventionDetailStore()
      const interventionFormSyncStore = useInterventionFormSyncStore();
      const intervention = detailStore.Intervention
      const payload = {} as InterventionPayload
      payload.employee = params.employee
      payload.localInterventionStatus = params.status
      payload.id = params.id
      payload.updateParams = []
      const propertyParam = {} as InterventionPayloadParam
      propertyParam.keyValue = params.id
      propertyParam.propertyParams = []
      propertyParam.propertyParams.push({
        propertyName: 'interventionExecution',
        propertyValue: params.status
      })
      propertyParam.propertyParams.push({
        propertyName: 'serviceEnd',
        propertyValue: params.serviceEnd
      })
      propertyParam.propertyParams.push({
        propertyName: 'updatedBy',
        propertyValue: JSON.stringify(payload.employee)
      })
      propertyParam.propertyParams.push({
        propertyName: 'updatedDate',
        propertyValue: params.serviceEnd
      })
      propertyParam.propertyParams.push({
        propertyName: 'additionalInformation',
        propertyValue: params.additionalInformation
      })
      this.setServicePersonnelForPayload(params.serviceEnd)
      propertyParam.propertyParams.push({
        propertyName: 'servicePersonnels',
        propertyValue: JSON.stringify(this.stateServicePersonnel)
      })
      payload.updateParams.push(propertyParam)
      this.createServiceHistoryPayload(params.history, payload)
      if (!isOfflineOrSlowInternetConnection()) {
        try {
          await interventionFormSyncStore.SyncInterventionGeneralData(JSON.stringify(payload))
        } catch (error) {
          const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
          if (isNoNetwork) {
            await db.pendingTask.add({
              module: 'Intervention',
              section: 'E-Form',
              type: 'SubmitGeneral',
              workorder: intervention.sapWorkOrder,
              key: `SUBMIT-${params.id}`,
              bindingKey: `SUBMIT-${params.id}`,
              payload: JSON.stringify(payload),
              syncDate: AESTShortCurrentDateTime(),
              syncStatus: 'Pending'
            })
            await detailStore.updateHeaderDataWhenSubmitted(params)
          }
        }
      } else {
        await db.pendingTask.add({
          module: 'Intervention',
          section: 'E-Form',
          type: 'SubmitGeneral',
          workorder: intervention.sapWorkOrder,
          key: `SUBMIT-${params.id}`,
          bindingKey: `SUBMIT-${params.id}`,
          payload: JSON.stringify(payload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
        await detailStore.updateHeaderDataWhenSubmitted(params)
      }
    },
    async removeInterventionFromLocal(sapWorkOrder: string) {
      await db.interventionHeader.filter((h) => {
        return h.sapWorkOrder == sapWorkOrder
      }).delete()
      await db.interventionDetail.filter((d) => {
        return d.sapWorkOrder == sapWorkOrder
      }).delete()
      await db.interventionDefect.filter((d) => {
        return d.sapWorkorder == sapWorkOrder
      }).delete()
      await db.taskImage.filter((i) => {
        return i.sapWorkorder == sapWorkOrder
      }).delete()
      await db.pendingTaskFile.filter((i) => {
        return i.workorder == sapWorkOrder && i.module == 'Intervention'
      }).delete()
    },
    setInterventionGeneralSubmited(isSubmited: boolean) {
      this.stateGeneralSubmitted = isSubmited
    },
    async getSMUTolerance() {
      this.stateSMUToleranceNotMapped = false
      const setDefaultSMU = async () => {
        this.stateSMUTolerance = {
          min: 0,
          max: 0
        } as SMUTolerance
        this.stateSMUToleranceNotMapped = true
        const data = clone(this.stateSMUTolerance)
        await db.smuTolerance.add(data)
        console.log('SMU tolerance not mapped on ADM');
      }

      if (isOfflineOrSlowInternetConnection()) {
        const smu = await db.smuTolerance.limit(1).first()
        if (smu) {
          this.stateSMUTolerance = smu
        } else {
          setDefaultSMU()
        }
      } else {
        const params = {
          Parameter: '',
          ParameterTo: '',
          ValueMin: '',
          ValueMinTo: '',
          ValueMax: '',
          ValueMaxTo: '',
          Uom: '',
          UomTo: '',
          StartDate: '',
          StartDateTo: '',
          EndDate: '',
          EndDateTo: '',
          Page: '1',
          PageSize: '1',
          Order: '',
          ver: 'v1'
        };
        try {
          const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(CRUD_API_URL, "", new URLSearchParams(params).toString())
          const smuData = response.data.result.content[0]
          await db.smuTolerance.clear()
          if (!isUndefined(smuData)) {
            if (smuData.isActive) {
              this.stateSMUTolerance = {
                min: Number(smuData.valueMin),
                max: Number(smuData.valueMax)
              } as SMUTolerance
              const data = clone(this.stateSMUTolerance)
              await db.smuTolerance.add(data)
            } else {
              setDefaultSMU()
            }
          } else {
            setDefaultSMU()
          }
        } catch (error) {
          console.log("error get smu", error);
          setDefaultSMU()
          sendErrorEvent('IRONS', error);
        }
      }
    },
    reset() {
      this.stateActiveFitter = {} as Audit
      this.stateLog = {} as LogParamObject
      this.stateServicePersonnel = {} as ServicePersonnel
      this.stateServicePersonnels = [] as ServicePersonnel[]
      this.stateGeneralSubmitted = false
    }
  }
})
