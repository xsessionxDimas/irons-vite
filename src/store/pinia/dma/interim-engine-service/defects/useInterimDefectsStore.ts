/* eslint-disable no-console */
import { defineStore } from "pinia"
import {
  GET_DEFECTS_HEADER,
  GET_DEFECTS_DETAIL,
  UPDATE_DEFECT_DETAIL,
  UPDATE_DEFECT_HEADER,
  GET_DETAIL_FIELD_VALUE,
  GET_DEFECTS_ALL_SECTION
} from "./urls"
import { Detail } from "@/core/types/entities/dma/defects/Detail"
import { Header } from "@/core/types/entities/dma/defects/Header"
import ApiService from "@/core/services/ApiService"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { ApiResponse } from "@/core/types/misc/ApiResponse"
import DefectApprovalClass from "@/core/classes/DefectsApprovalClass"
import DefectYesClass from "@/core/classes/DefectYesClass"
import CrackYesClass from "@/core/classes/CrackYesClass"
import { useCameraStore } from "@/store/pinia/application/useCameraStore"
import { ImageObject } from "@/core/types/entities/dma/ImageObject"
import { useAttachmentStore } from "../attachments/useAttachmentStore"
import { Part } from "@/core/types/entities/dma/e-form/defects/Part"
import { Labour } from "@/core/types/entities/dma/e-form/defects/Labour"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import { useInterimEngineStore } from "../useInterimEngineStore"
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler"
import DefectNoClass from "@/core/classes/DefectNoClass"
import CrackNoClass from "@/core/classes/CrackNoClass"
import { isEmpty, isUndefined } from "lodash"
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse"
import {
  ListDefectSections
} from "@/core/types/entities/dma/defects/ListDefectSections"
import { Comment } from "@/database/schema/Comment"
import { Audit } from "@/core/types/intervention/Audit"
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo"
import { DefectSMU } from "@/core/types/entities/dma/defects/DefectSMU";
import {
  useGlobalConnectionStore
} from "@/store/pinia/application/useGlobalConnectionStore"
import { convertErrorMessage } from "../../e-form/helpers"
import { ErrorMessage } from "vee-validate"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useInterimDefectsStore = defineStore({
  id: "InterimDefects",
  state: () => {
    return {
      stateLoading: false,
      stateComments: [] as Comment[],
      stateData: new DefectApprovalClass(),
      stateDefectFormData: new DefectYesClass(),
      stateDefectNoFormData: new DefectNoClass(),
      stateCrackFormData: new CrackYesClass(),
      stateCrackSimpleFormData: new CrackNoClass(),
      stateIsError: false,
      stateHeaderId: "",
      stateDetailId: "",
      stateHeaderStatus: "",
      stateDefectFetched: false,
      stateLoadDefectImages: false,
      stateApproveBy: undefined as Audit | undefined,
      stateApproveDate: undefined as string | undefined,
      stateDefectPictures: {},
      stateDefectKey: 1,
      stateDefectSMU: {} as DefectSMU,
      stateErrorMessage: "",
      stateCurrentUserGroup: "",
      stateErrorByNetwork: false,
    }
  },
  getters: {
    Loading: (state) => {
      return state.stateLoading
    },
    ApprovalData: (state) => {
      return state.stateData
    },
    DefectKey: (state) => {
      return state.stateDefectKey
    },
    DefectFormData: (state) => {
      return state.stateDefectFormData
    },
    CrackFormData: (state) => {
      return state.stateCrackFormData
    },
    ImagesDefect: () => {
      const cameraStore = useCameraStore()
      return cameraStore.ImageObjects.find((p) => {
        return p.Id === "defect"
      }) as ImageObject
    },
    ImagesCrack: () => {
      const cameraStore = useCameraStore()
      return cameraStore.ImageObjects.find((p) => {
        return p.Id === "crack"
      }) as ImageObject
    },
    IsError: (state) => {
      return state.stateIsError
    },
    ErrorMessage: (state) => {
      return state.stateErrorMessage
    },
    HeaderId: (state) => {
      return state.stateHeaderId
    },
    DetailId: (state) => {
      return state.stateDetailId
    },
    DataFetched: (state) => {
      return state.stateDefectFetched
    },
    HeaderStatus: (state) => {
      return state.stateHeaderStatus
    },
    DefectPictures: (state) => {
      return state.stateDefectPictures
    },
    LoadDefectImages: (state) => {
      return state.stateLoadDefectImages
    },
    Comments: (state) => {
      return state.stateComments
    },
    ApproveBy: (state) => {
      return state.stateApproveBy
    },
    ApproveDate: (state) => {
      return state.stateApproveDate
    },
    DefectSMUHeader: (state) => {
      return state.stateData.SMUDefectHeaders.find((obj) => {
        return obj.defectType == 'machineSMU'
      }) ?? {} as Header
    },
    DefectSMUDetail: (state) => {
      return state.stateDefectSMU;
    },
    DefectSMUDetailDetail: (state) => {
      return state.stateData.SMUDefectDetails.find((d) => {
        return d.defectHeaderId == state.stateDetailId
      })
    },
    globalConnectionStore: () => {
      return useGlobalConnectionStore()
    },
  },
  actions: {
    setCurrentUserGroup(userGroup: string): void {
      this.stateCurrentUserGroup = userGroup
    },
    setHeaderId(id: string) {
      this.stateHeaderId = id
    },
    setDefectFetched(value) {
      this.stateDefectFetched = value
    },
    setDetailId(id: string) {
      this.stateDetailId = id
    },
    createRequestBody(workorder: string) {
      return {
        "workorder": workorder
      }
    },
    async getDefectsDataHeader(workorder: string) {
      const body = this.createRequestBody(workorder)
      const response: AxiosResponse<ApiResponse<Header>> = await ApiService.post(`${GET_DEFECTS_HEADER}`, body as AxiosRequestConfig)
      /* set the state */
      this.stateData.setHeaders(response.data.result.content)
    },
    async getDefectsDataDetail(workorder: string) {
      const body = this.createRequestBody(workorder)
      const response: AxiosResponse<ApiResponse<Detail>> = await ApiService.post(`${GET_DEFECTS_DETAIL}`, body as AxiosRequestConfig)
      /* set the state */
      this.stateData.setDetails(response.data.result.content)
    },
    toggleErrorByNetwork(status: boolean) {
      this.stateErrorByNetwork = status
    },
    async getDefectsDataAll(workorder: string) {
      const params = {
        workOrder: workorder,
        ver: "v1"
      }
      try {
        const response: AxiosResponse<SingleApiResponse<ListDefectSections>> = await ApiService.get(`${GET_DEFECTS_ALL_SECTION}`, "", new URLSearchParams(params).toString())
        /* set the state */
        this.stateData.setHeaders(response.data.result.content?.defectHeader || [])
        this.stateData.setDetails(response.data.result.content?.defectDetail || [])
        this.stateComments = response.data.result.content?.comment || []
        this.stateApproveBy = response.data.result.content?.approveBy
        this.stateApproveDate = response.data.result.content?.approveDate
      } catch (error) {
        const isNoNetwork = this.globalConnectionStore.checkIsErrorNoNetwork(error as string)
        this.stateErrorByNetwork = isNoNetwork
        sendErrorEvent('IRONS', error);
      }
    },
    async getDefectsData(workorder: string) {
      this.stateLoading = true
      try {
        this.setDefectFetched(false)
        await this.getDefectsDataAll(workorder)
        this.setDefectFetched(true)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.error(error)
      }
      this.stateLoading = false
    },
    setDefectData(headerId: string) {
      const attachmentStore = useAttachmentStore()
      const header = this.ApprovalData.DefectHeaders.find((h) => {
        return h.id === headerId
      })
      const found = this.ApprovalData.DefectDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        this.setHeaderId(headerId)
        this.setDetailId(found.id)
        this.stateHeaderStatus = header?.status as string
        if (found.detail.type == 'YES') {
          this.stateDefectFormData.setAssetNumber(found.detail.assetNumber)
          this.stateDefectFormData.setDescription(found.detail.description)
          this.stateDefectFormData.setRaisedBy(found.detail.raisedBy)
          this.stateDefectFormData.setDate(found.detail.date)
          this.stateDefectFormData.setPlannedDuration(found.detail.plannedDuration)
          this.stateDefectFormData.setInstruction(found.detail.instruction)
          this.stateDefectFormData.setPriority(found.detail.priority)
          this.stateDefectFormData.setTitle(header?.taskDesc || "")
          this.stateDefectFormData.importParts(...JSON.parse(found.detail.parts))
          this.stateDefectFormData.importLabours(...JSON.parse(found.detail.labours))
          this.stateDefectFormData.importResources(...JSON.parse(found.detail.resources))
          this.stateDefectFormData.importSymptoms(...JSON.parse(found.detail.symptoms))
          this.stateDefectFormData.importCauses(...JSON.parse(found.detail.causes))
          this.ImagesDefect.ImageInfos.push(...JSON.parse(found.detail.images))
        } else if (found.detail.type == 'NO') {
          this.stateDefectNoFormData.setAssetNumber(found.detail.assetNumber)
          this.stateDefectNoFormData.setDescription(found.detail.description)
          this.stateDefectNoFormData.setRaisedBy(found.detail.raisedBy)
          this.stateDefectNoFormData.setDate(found.detail.date)
          this.stateDefectNoFormData.setTitle(header?.taskDesc || "")
          this.stateDefectNoFormData.importActions(...JSON.parse(found.detail.actions))
          this.ImagesDefect.ImageInfos.push(...JSON.parse(found.detail.images))
        } else if (found.detail.type == 'machineSMU') {
          this.stateDefectSMU = found.detail;
        } else {
          this.stateDefectNoFormData.setAssetNumber(found.detail.assetNumber)
          this.stateDefectNoFormData.setDescription(found.detail.description)
          this.stateDefectNoFormData.setRaisedBy(found.detail.raisedBy)
          this.stateDefectNoFormData.setDate(found.detail.date)
          this.stateDefectNoFormData.setTitle(header?.taskDesc || "")
        }
        const promises = [] as Promise<Blob>[]
        this.ImagesDefect.ImageInfos.forEach((f: string | ImageInfo) => {
          let filename = ''
          if (typeof f == 'string') {
            filename = f
          } else {
            filename = f.filename
          }
          promises.push(attachmentStore.downloadAttachment(filename) as Promise<Blob>)
        })
        Promise.all(promises).then((blobs) => {
          blobs.forEach((b) => {
            const blob = new Blob([b], { type: 'image/png' })
            this.ImagesDefect.ImageBlobs.push(blob)
          })
        })
        return found.detail.type
      }
    },
    setSMUDefectData(headerId: string): boolean {
      let isFound = false
      const attachmentStore = useAttachmentStore()
      const header = this.ApprovalData.SMUDefectHeaders.find((h) => {
        return h.id === headerId
      })
      const found = this.ApprovalData.SMUDefectDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        isFound = true
        this.setHeaderId(headerId)
        this.setDetailId(found.id)
        this.stateHeaderStatus = header?.status as string
        this.stateDefectSMU = found.detail;
        const promises = [] as Promise<Blob>[]
        this.ImagesDefect.ImageInfos.forEach((f: string | ImageInfo) => {
          let filename = ''
          if (typeof f == 'string') {
            filename = f
          } else {
            filename = f.filename
          }
          promises.push(attachmentStore.downloadAttachment(filename) as Promise<Blob>)
        })
        Promise.all(promises).then((blobs) => {
          blobs.forEach((b) => {
            const blob = new Blob([b], { type: 'image/png' })
            this.ImagesDefect.ImageBlobs.push(blob)
          })
        })
      }
      return isFound
    },
    async getDefectImages(id: string, key: string, field: string) {
      const body = {
        id: id,
        keyValue: key,
        propertyName: field,
      }
      const params = {
        ver: "v1",
      }
      let result = [] as string[]
      const response: AxiosResponse<ApiResponse<string>> =
        await ApiService.post(`${GET_DETAIL_FIELD_VALUE}?${new URLSearchParams(params).toString()}`,
          body as AxiosRequestConfig)
      if (!isUndefined(response.data.result.content)) {
        result = response.data.result.content
      }
      return result
    },
    setLoadingImages(value: boolean) {
      this.stateLoadDefectImages = value
    },
    setNewDefectKey() {
      this.stateDefectKey += 1
    },
    async getDefectPictures(headerId: string) {
      const found = this.ApprovalData.DefectDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        this.stateDefectPictures[headerId] = JSON.parse(found.detail.images)
      }
    },
    getCrackPictures(headerId: string) {
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        this.stateDefectPictures[headerId] = JSON.parse(found.detail.images)
      }
    },
    setDefectNewData(isUpdateAcknowledge = true) {
      const detail = this.ApprovalData.DefectDetails.find((d) => {
        return d.id === this.stateDetailId
      }) as unknown as Detail
      if (detail) {
        detail.detail.description = this.DefectFormData.Description.value
        detail.detail.plannedDuration = this.DefectFormData.PlannedDuration.value
        detail.detail.instruction = this.DefectFormData.Instruction.value
        detail.detail.priority = this.DefectFormData.Priority
        detail.detail.parts = JSON.stringify(this.DefectFormData.Parts as Part[])
        detail.detail.labours = JSON.stringify(this.DefectFormData.Labours as Labour[])
        detail.detail.resources = JSON.stringify(this.DefectFormData.Resources.map((r) => {
          return r.value
        }))
        detail.detail.symptoms = JSON.stringify(this.DefectFormData.Symptoms.map((s) => {
          return s.value
        }))
        detail.detail.causes = JSON.stringify(this.DefectFormData.Causes.map((c) => {
          return c.value
        }))
      }
      const header = this.ApprovalData.DefectHeaders.find((h) => {
        return h.id === this.stateHeaderId
      }) as unknown as Header
      if (header) {
        if (isUpdateAcknowledge) {
          header.status = 'Acknowledge'
        }
      }
    },
    createDefectDetail() {
      const images = this.ImagesDefect?.ImageInfos ?? []
      return {
        type: "YES",
        assetNumber: this.DefectFormData.AssetNumber,
        description: this.DefectFormData.Description.value,
        title: this.DefectFormData.Title,
        raisedBy: this.DefectFormData.RaisedBy,
        date: this.DefectFormData.Date,
        plannedDuration: this.DefectFormData.PlannedDuration.value,
        instruction: this.DefectFormData.Instruction.value,
        priority: this.DefectFormData.Priority,
        parts: JSON.stringify(this.DefectFormData.Parts as Part[]),
        labours: JSON.stringify(this.DefectFormData.Labours as Labour[]),
        resources: JSON.stringify(this.DefectFormData.Resources.map((r) => {
          return r.value
        })),
        symptoms: JSON.stringify(this.DefectFormData.Symptoms.map((s) => {
          return s.value
        })),
        causes: JSON.stringify(this.DefectFormData.Causes.map((c) => {
          return c.value
        })),
        images: JSON.stringify(images)
      }
    },
    async updateDefectDetail() {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.DefectDetails.find((d) => {
        return d.id === this.stateDetailId
      }) as unknown as Detail
      const detail = this.createDefectDetail()
      const payload = {
        id: this.DetailId,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "detail",
            propertyValue: JSON.stringify(detail)
          },
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
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_DETAIL}`, payload as AxiosRequestConfig)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        const eformStore = useInterimEngineStore()
        eformStore.toggleTaskAlreadyUpdatedStatus(true)
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDefectAcknowledge(isSMU = false, newTaskDesc = "") {
      const authStore = useAuthenticationStore()
      let found;
      if (isSMU) {
        found = this.ApprovalData.SMUDefectHeaders.find((d) => {
          return d.id === this.stateHeaderId
        }) as unknown as Header
      } else {
        found = this.ApprovalData.DefectHeaders.find((d) => {
          return d.id === this.stateHeaderId
        }) as unknown as Header
      }
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "status",
            propertyValue: "Acknowledge"
          },
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
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        userGroup: this.stateCurrentUserGroup
      }

      if (newTaskDesc) {
        payload.updateParams[0].propertyParams.push({
          propertyName: "taskDesc",
          propertyValue: newTaskDesc
        })
      }

      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.status = "Acknowledge"
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerDefectAcknowledge(isSMU = false, newTaskDesc = "") {
      const authStore = useAuthenticationStore()
      let found
      if (isSMU) {
        found = this.ApprovalData.SMUDefectHeaders.find((d) => {
          return d.id === this.stateHeaderId
        }) as unknown as Header
      } else {
        found = this.ApprovalData.DefectHeaders.find((d) => {
          return d.id === this.stateHeaderId
        }) as unknown as Header
      }

      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "plannerStatus",
            propertyValue: "Acknowledge"
          },
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
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        userGroup: this.stateCurrentUserGroup
      }

      if (newTaskDesc) {
        payload.updateParams[0].propertyParams.push({
          propertyName: "taskDesc",
          propertyValue: newTaskDesc
        })
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.plannerStatus = "Acknowledge"
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDefectOnly(fitter: string) {
      const found = this.ApprovalData.DefectDetails.find((d) => {
        return d.id === this.stateDetailId
      }) as unknown as Detail
      const detail = this.createDefectDetail()
      const payload = {
        id: this.DetailId,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "detail",
            propertyValue: JSON.stringify(detail)
          },
          {
            propertyName: "updatedBy",
            propertyValue: fitter,
          },
          {
            propertyName: "updatedDate",
            propertyValue: "<<ServerDateTime>>"
          }]
        }],
        employee: JSON.parse(fitter)
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_DETAIL}`, payload as AxiosRequestConfig)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        const eformStore = useInterimEngineStore()
        eformStore.toggleTaskAlreadyUpdatedStatus(true)
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDefectMO(headerId: string, mo: string) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.DefectHeaders.find((d) => {
        return d.id === headerId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "defectWorkorder",
            propertyValue: mo
          },
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
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.defectWorkorder = mo
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDefectDetailSMU(detail: any = {}) {
      const authStore = useAuthenticationStore()
      let updatedDetail = this.stateDefectSMU
      if (!isEmpty(detail)) {
        updatedDetail = detail
      }
      const payload = {
        id: this.DetailId,
        updateParams: [{
          keyValue: this.DetailId,
          propertyParams: [{
            propertyName: "detail",
            propertyValue: JSON.stringify(updatedDetail)
          },
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
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        userGroup: this.stateCurrentUserGroup
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_DETAIL}`, payload as AxiosRequestConfig)
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
        sendErrorEvent('IRONS', error);
      }
    },
    async updateRepairedStatus(headerId: string) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.DefectHeaders.find((d) => {
        return d.id === headerId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "repairedStatus",
            propertyValue: "Repaired"
          },
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
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.repairedStatus = "Repaired"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDefectConfirmedStatus(headerId: string, reason = "") {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.DefectNAHeaders.find((d) => {
        return d.id === headerId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "cbmNAStatus",
            propertyValue: "Confirmed"
          },
          {
            propertyName: "approveReason",
            propertyValue: reason
          },
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
            propertyName: "approvedBy",
            propertyValue: JSON.stringify({
              id: authStore.user.EmployeeId,
              name: authStore.user.Name
            })
          },
          {
            propertyName: "approvedDate",
            propertyValue: "<<ServerDateTime>>"
          },
          ]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        userGroup: this.stateCurrentUserGroup
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.cbmNAStatus = "Confirmed"
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerDefectConfirmedStatus(headerId: string) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.DefectNAHeaders.find((d) => {
        return d.id === headerId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "plannerCbmNAStatus",
            propertyValue: "Confirmed"
          },
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
          }
          ]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        userGroup: this.stateCurrentUserGroup
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.plannerCbmNAStatus = "Confirmed"
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCrackConfirmedStatus(headerId: string) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.CrackNAHeaders.find((d) => {
        return d.id === headerId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "cbmNAStatus",
            propertyValue: "Confirmed"
          },
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
            propertyName: "approvedBy",
            propertyValue: JSON.stringify({
              id: authStore.user.EmployeeId,
              name: authStore.user.Name
            })
          },
          {
            propertyName: "approvedDate",
            propertyValue: "<<ServerDateTime>>"
          },
          ]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.cbmNAStatus = "Confirmed"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerCrackConfirmedStatus(headerId: string) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.CrackNAHeaders.find((d) => {
        return d.id === headerId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "plannerCbmNAStatus",
            propertyValue: "Confirmed"
          },
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
          }
          ]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.plannerCbmNAStatus = "Confirmed"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCBMConfirmedStatus(headerId: string, reason: string) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.CBMHeaders.find((d) => {
        return d.id === headerId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "cbmNAStatus",
            propertyValue: "Confirmed"
          },
          {
            propertyName: "approveReason",
            propertyValue: reason,
          },
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
            propertyName: "appSPVBy",
            propertyValue: JSON.stringify({
              id: authStore.user.EmployeeId,
              name: authStore.user.Name
            })
          },
          {
            propertyName: "appSPVDate",
            propertyValue: "<<ServerDateTime>>"
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        userGroup: this.stateCurrentUserGroup
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.cbmNAStatus = "Confirmed"
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerCBMConfirmedStatus(headerId: string, reason: string) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.CBMHeaders.find((d) => {
        return d.id === headerId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "plannerCbmNAStatus",
            propertyValue: "Confirmed"
          },
          {
            propertyName: "plannerApproveReason",
            propertyValue: reason,
          },
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
            propertyName: "appPlannerBy",
            propertyValue: JSON.stringify({
              id: authStore.user.EmployeeId,
              name: authStore.user.Name
            })
          },
          {
            propertyName: "appPlannerDate",
            propertyValue: "<<ServerDateTime>>"
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        },
        userGroup: this.stateCurrentUserGroup
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.plannerCbmNAStatus = "Confirmed"
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDefectDeclineStatus(headerId: string, reason) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.DefectNAHeaders.find((d) => {
        return d.id === headerId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "cbmNAStatus",
            propertyValue: "Decline"
          },
          {
            propertyName: "declineReason",
            propertyValue: reason
          },
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
            propertyName: "declineBy",
            propertyValue: JSON.stringify({
              id: authStore.user.EmployeeId,
              name: authStore.user.Name
            })
          },
          {
            propertyName: "declineDate",
            propertyValue: "<<ServerDateTime>>"
          }
          ]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.cbmNAStatus = "Decline"
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerDefectDeclineStatus(headerId: string, reason) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.DefectNAHeaders.find((d) => {
        return d.id === headerId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "plannerCbmNAStatus",
            propertyValue: "Decline"
          },
          {
            propertyName: "declineReason",
            propertyValue: reason
          },
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
            propertyName: "declineBy",
            propertyValue: JSON.stringify({
              id: authStore.user.EmployeeId,
              name: authStore.user.Name
            })
          },
          {
            propertyName: "declineDate",
            propertyValue: "<<ServerDateTime>>"
          }
          ]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.plannerCbmNAStatus = "Decline"
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        this.stateErrorMessage = convertErrorMessage(error?.response?.data?.result?.message ?? `${error}`)
        sendErrorEvent('IRONS', error);
      }
    },
    setCrackData(headerId: string) {
      const attachmentStore = useAttachmentStore()
      const header = this.ApprovalData.CrackHeaders.find((h) => {
        return h.id === headerId
      })
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        this.setHeaderId(headerId)
        this.setDetailId(found.id)
        this.stateHeaderStatus = header?.status as string
        if (found.detail.type != 'NO') {
          this.stateCrackFormData.setAssetNumber(found.detail.assetNumber)
          this.stateCrackFormData.setDescription(found.detail.description)
          this.stateCrackFormData.setRaisedBy(found.detail.raisedBy)
          this.stateCrackFormData.setDate(found.detail.date)
          this.stateCrackFormData.setPlannedDuration(found.detail.plannedDuration)
          this.stateCrackFormData.setInstruction(found.detail.instruction)
          this.stateCrackFormData.setPriority(found.detail.priority)
          this.stateCrackFormData.setTitle(header?.taskDesc || "")
          this.stateCrackFormData.importParts(...JSON.parse(found.detail.parts))
          this.stateCrackFormData.importLabours(...JSON.parse(found.detail.labours))
          this.stateCrackFormData.importResources(...JSON.parse(found.detail.resources))
          this.stateCrackFormData.importSymptoms(...JSON.parse(found.detail.symptoms))
          this.stateCrackFormData.importCauses(...JSON.parse(found.detail.causes))
          this.stateCrackFormData.importPreviousCrack(...JSON.parse(found.detail.previousCracks))
        } else {
          this.stateCrackSimpleFormData.setAssetNumber(found.detail.assetNumber)
          this.stateCrackSimpleFormData.setDescription(found.detail.description)
          this.stateCrackSimpleFormData.setRaisedBy(found.detail.raisedBy)
          this.stateCrackSimpleFormData.setDate(found.detail.date)
          this.stateCrackSimpleFormData.setInstruction(found.detail.instruction)
          this.stateCrackSimpleFormData.setTitle(header?.taskDesc || "")
          this.stateCrackSimpleFormData.importPreviousCrack(...JSON.parse(found.detail.previousCracks))
        }
        this.ImagesCrack.ImageInfos.push(...JSON.parse(found.detail.images))
        const promises = [] as Promise<Blob>[]
        this.ImagesCrack.ImageInfos.forEach((f: string | ImageInfo) => {
          let filename = ''
          if (typeof f == 'string') {
            filename = f
          } else {
            filename = f.filename
          }
          promises.push(attachmentStore.downloadAttachment(filename) as Promise<Blob>)
        })
        Promise.all(promises).then((blobs) => {
          blobs.forEach((b) => {
            const blob = new Blob([b], { type: 'image/png' })
            this.ImagesCrack.ImageBlobs.push(blob)
          })
        })
        return found.detail.type
      }
    },
    setCrackNewData() {
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.id === this.stateDetailId
      }) as any
      if (found) {
        found.detail.description = this.CrackFormData.Description.value
        found.detail.plannedDuration = this.CrackFormData.PlannedDuration.value
        found.detail.instruction = this.CrackFormData.Instruction.value
        found.detail.priority = this.CrackFormData.Priority
        found.detail.parts = JSON.stringify(this.CrackFormData.Parts as Part[])
        found.detail.labours = JSON.stringify(this.CrackFormData.Labours as Labour[])
        found.detail.resources = JSON.stringify(this.CrackFormData.Resources.map((r) => {
          return r.value
        }))
        found.detail.symptoms = JSON.stringify(this.CrackFormData.Symptoms.map((s) => {
          return s.value
        }))
        found.detail.causes = JSON.stringify(this.CrackFormData.Causes.map((c) => {
          return c.value
        }))
        found.detail.previousCracks = JSON.stringify(this.CrackFormData.CrackLength)
      }
    },
    createCrackDetail() {
      const images = this.ImagesCrack?.ImageInfos ?? []
      return {
        type: "YES",
        assetNumber: this.CrackFormData.AssetNumber,
        description: this.CrackFormData.Description.value,
        title: this.CrackFormData.Title,
        raisedBy: this.CrackFormData.RaisedBy,
        date: this.CrackFormData.Date,
        plannedDuration: this.CrackFormData.PlannedDuration.value,
        instruction: this.CrackFormData.Instruction.value,
        priority: this.CrackFormData.Priority,
        parts: JSON.stringify(this.CrackFormData.Parts as Part[]),
        labours: JSON.stringify(this.CrackFormData.Labours as Labour[]),
        resources: JSON.stringify(this.CrackFormData.Resources.map((r) => {
          return r.value
        })),
        symptoms: JSON.stringify(this.CrackFormData.Symptoms.map((s) => {
          return s.value
        })),
        causes: JSON.stringify(this.CrackFormData.Causes.map((c) => {
          return c.value
        })),
        images: JSON.stringify(images),
        previousCracks: JSON.stringify(this.CrackFormData.CrackLength)
      }
    },
    async updateCrackDetail() {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.id === this.stateDetailId
      }) as unknown as Detail
      const detail = this.createCrackDetail()
      const payload = {
        id: this.DetailId,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "detail",
            propertyValue: JSON.stringify(detail)
          },
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
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_DETAIL}`, payload as AxiosRequestConfig)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCrackOnly(fitter: string) {
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.id === this.stateDetailId
      }) as unknown as Detail
      const detail = this.createCrackDetail()
      const payload = {
        id: this.DetailId,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "detail",
            propertyValue: JSON.stringify(detail)
          },
          {
            propertyName: "updatedBy",
            propertyValue: fitter
          },
          {
            propertyName: "updatedDate",
            propertyValue: "<<ServerDateTime>>"
          }]
        }],
        employee: JSON.parse(fitter)
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_DETAIL}`, payload as AxiosRequestConfig)
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCrackAcknowledge() {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id === this.stateHeaderId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "status",
            propertyValue: "Acknowledge"
          },
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
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.status = "Acknowledge"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerCrackAcknowledge() {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id === this.stateHeaderId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "plannerStatus",
            propertyValue: "Acknowledge"
          },
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
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.plannerStatus = "Acknowledge"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCrackMO(headerId: string, mo: string) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id === headerId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "defectWorkorder",
            propertyValue: mo
          },
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
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.defectWorkorder = mo
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCrackRepairedStatus(headerId: string) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id === headerId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "repairedStatus",
            propertyValue: "Repaired"
          },
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
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        found.repairedStatus = "Repaired"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    reset() {
      this.stateLoading = false
      this.stateData = new DefectApprovalClass()
      this.stateDefectFormData = new DefectYesClass()
      this.stateCrackFormData = new CrackYesClass()
      this.stateIsError = false
      this.stateHeaderId = ""
      this.stateDetailId = ""
      this.stateDefectFetched = false
      this.stateHeaderStatus = ""
      // this.stateDefectPictures = {}
      this.stateLoadDefectImages = false
      this.stateDefectKey = 1
    },
    updateHeaderDefect(headerId) {
      const header = this.ApprovalData.DefectHeaders.find((h) => {
        return h.id === headerId
      })
      this.stateHeaderStatus = !isUndefined(header!.plannerStatus) ? header!.plannerStatus : ""
    },
    updateHeaderDefectSMU(headerId) {
      const header = this.ApprovalData.SMUDefectHeaders.find((h) => {
        return h.id === headerId
      })
      this.stateHeaderStatus = !isUndefined(header!.plannerStatus) ? header!.plannerStatus : ""
    },
    updateHeaderCrack(headerId) {
      const header = this.ApprovalData.CrackHeaders.find((h) => {
        return h.id === headerId
      })
      this.stateHeaderStatus = !isUndefined(header!.plannerStatus) ? header!.plannerStatus : ""
    },
    resetErrorStatus() {
      this.stateIsError = false
      this.stateErrorMessage = ""
    },
  }
})
