import { defineStore } from "pinia"
import {
  GET_DEFECTS_HEADER,
  GET_DEFECTS_DETAIL,
  UPDATE_DEFECT_DETAIL,
  UPDATE_DEFECT_HEADER,
  GET_DEFECTS_ALL_SECTION
} from "./url"
import { Detail } from "@/core/types/entities/dma/defects/Detail"
import { Header } from "@/core/types/entities/dma/defects/Header"
import ApiService from "@/core/services/ApiService"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { ApiResponse } from "@/core/types/misc/ApiResponse"
import DefectYesClass from "@/core/classes/DefectYesClass"
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler"
import { IDefectYesDetail } from "@/core/types/intervention/IDefectYesDetail"
import {
  InterventionPayload
} from "@/core/types/intervention/InterventionPayload"
import {
  InterventionPayloadPropertyParam
} from "@/core/types/intervention/InterventionPayloadPropertyParam"
import { Audit } from "@/core/types/intervention/Audit"
import { db } from '@/database/schema/DexieSchema'
import DefectIdentifiedClass from "@/core/classes/DefectIdentifiedClass"
import { Defect } from "@/database/schema/Defect"
import { IDefectNoDetail } from "@/core/types/intervention/IDefectNoDetail"
import {
  useComponentInterventionDetailStore
} from "./useComponentInterventionDetailStore"
import { Comment } from "@/database/schema/Comment"
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse"
import {
  ListDefectSections
} from "@/core/types/entities/dma/defects/ListDefectSections"
import { PartialBy } from "@/core/types/misc/PartialBy"
import {
  deleteInterventionFormComments
} from "@/core/helpers/interventionforms/defect"
import { Employee } from "@/core/types/entities/dma/Payload"
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useComponentInterventionDefectsIdentifiedStore = defineStore({
  id: "Component Intervention Defects Identified",
  state: () => {
    return {
      stateLoading: false,
      stateData: new DefectIdentifiedClass(),
      stateDefectHeader: [] as Header[],
      stateDefectDetail: [] as Detail[],
      stateComments: [] as Comment[],
      stateApproveBy: undefined as Audit | undefined,
      stateApproveDate: undefined as string | undefined,
      stateDefectFormData: new DefectYesClass(),
      stateSelectedDetailData: {} as any
    }
  },
  getters: {
    Loading: (state) => {
      return state.stateLoading
    },
    defectIdentifiedData: (state) => {
      return state.stateData
    },
    defectEditFormData: (state) => {
      return state.stateDefectFormData
    },
    defectIdentifiedCommentData: (state) => {
      return state.stateComments
    },
    ApproveBy: (state) => {
      return state.stateApproveBy
    },
    ApproveDate: (state) => {
      return state.stateApproveDate
    },
    DefectDetail: (state) => {
      return state.stateDefectDetail;
    }
  },
  actions: {
    createRequestBody(interventionId: string) {
      return {
        "interventionId": interventionId
      }
    },
    async setDefectIdentifiedData(sapWorkorder: string) {
      const defects = await db.interventionDefect.filter((h) => {
        return h.sapWorkorder == sapWorkorder
      }).toArray()
      this.stateData.setHeaders(defects)
      for (const defect of defects) {
        const foundDetail = this.stateDefectDetail.find((detail) => {
          return defect.defectDetailId == detail.id
        })
        if (foundDetail && defect.otherFitterUpdatedBy) {
          foundDetail.otherFitterUpdatedBy = defect.otherFitterUpdatedBy;
        }
      }
    },
    async getDefectsDataHeader(interventionId: string) {
      const body = this.createRequestBody(interventionId)
      const response: AxiosResponse<ApiResponse<Header>> = await ApiService.post(`${GET_DEFECTS_HEADER}`, body as AxiosRequestConfig)
      /* set the state */
      this.stateDefectHeader = response.data.result.content
    },
    async getDefectsDataDetail(interventionId: string) {
      const body = this.createRequestBody(interventionId)
      const response: AxiosResponse<ApiResponse<Detail>> = await ApiService.post(`${GET_DEFECTS_DETAIL}`, body as AxiosRequestConfig)
      /* set the state */
      this.stateDefectDetail = response.data.result.content
    },
    async getDefectsDataAll(interventionId: string) {
      const params = {
        interventionId: interventionId,
        ver: "v1"
      }
      const response: AxiosResponse<SingleApiResponse<ListDefectSections>> = await ApiService.get(`${GET_DEFECTS_ALL_SECTION}`, "", new URLSearchParams(params).toString())
      /* set the state */
      this.stateDefectHeader = response.data.result.content?.defectHeader || []
      this.stateDefectDetail = response.data.result.content?.defectDetail || []
      this.stateComments = response.data.result.content?.comment || []
      this.stateApproveBy = response.data.result.content?.approveBy
      this.stateApproveDate = response.data.result.content?.approveDate
    },
    async getDefectsData(interventionId: string, sapWorkOrder: string) {
      if (!sapWorkOrder) return
      this.stateLoading = true
      const pendingOfflineUpdateTask = await db.pendingTask.where({
        workorder: sapWorkOrder,
        module: "Intervention",
        syncStatus: "Pending"
      }).toArray()
      if (pendingOfflineUpdateTask.length > 0) {
        this.setDefectIdentifiedData(sapWorkOrder)
      } else {
        try {
          if (!isOfflineOrSlowInternetConnection()) {
            await db.interventionDefect.where({
              sapWorkorder: sapWorkOrder
            }).delete()
            await this.getDefectsDataAll(interventionId)
            await this.upsertDefectToLocal(interventionId)
            this.setDefectIdentifiedData(sapWorkOrder)
          }
        } catch (error) {
          console.error(error)
          updateLoggedInStatusFromAPIResponse(error)
        }
      }
      this.stateLoading = false
    },
    async upsertDefectToLocal(interventionId: string) {
      await db.interventionDefect.where({
        interventionId: interventionId
      }).delete()
      this.stateDefectHeader.forEach(async (h) => {
        const defectDetail = this.stateDefectDetail.find((d) => {
          return d.defectHeaderId == h.id
        })
        await db.interventionDefect.add({
          category: h.category,
          interventionId: interventionId,
          taskId: h.taskId,
          taskNo: h.taskNo,
          taskDesc: h.taskDesc,
          taskValue: h.taskValue,
          priority: defectDetail?.detail?.priority,
          sapWorkorder: h.workorder as string,
          taskKey: h.taskId as string,
          type: defectDetail == undefined ? 'CBM' : defectDetail.detail.type,
          defectHeaderId: h.id,
          defectType: h.defectType,
          defectDetailId: defectDetail?.id,
          defectWorkorder: h.defectWorkorder ?? '',
          defectData: defectDetail == undefined ? '' : JSON.stringify({
            ...defectDetail.detail,
            headerKey: h.key,
            createdBy: defectDetail.createdBy ? {
              id: defectDetail.createdBy.id,
              name: defectDetail.createdBy.name
            } as Audit : {} as Audit,
            createdDate: defectDetail.createdDate ? defectDetail.createdDate : '',
            updatedBy: defectDetail.updatedBy ? {
              id: defectDetail.updatedBy.id,
              name: defectDetail.updatedBy.name
            } as Audit : {} as Audit,
            updatedDate: defectDetail.updatedDate,
          }),
          commentValue: h.commentValue,
          status: h.status,
          repairedStatus: h.repairedStatus,
          cbmNAStatus: h.cbmNAStatus,
          cbmUom: h.cbmUom,
          cbmMeasurement: h.cbmMeasurement ?? undefined,
          plannerStatus: h.plannerStatus ? h.plannerStatus : '',
          declineReason: h.declineReason ? h.declineReason : '',
          declineBy: h.declineBy ? {
            id: h.declineBy.id,
            name: h.declineBy.name
          } as Audit : {} as Audit,
          declineDate: h.declineDate ? h.declineDate : '',
          approvedBy: h.approvedBy ? {
            id: h.approvedBy.id,
            name: h.approvedBy.name
          } as Audit : {} as Audit,
          approvedDate: h.approvedDate ? h.approvedDate : '',
          statusSync: 'Sync',
          createdBy: h.createdBy ? {
            id: h.createdBy.id,
            name: h.createdBy.name
          } as Audit : {} as Audit,
          createdDate: h.createdDate,
          updatedBy: h.updatedBy ? {
            id: h.updatedBy.id,
            name: h.updatedBy.name
          } as Audit : {} as Audit,
          updatedDate: h.updatedDate,
          downloadHistory: h.downloadHistory ? JSON.stringify(h.downloadHistory) : '',
          correctedValue: h.correctedValue ? h.correctedValue : "",
          correctedMeasurement: h.correctedMeasurement ? h.correctedMeasurement : "",
          correctedUom: h.correctedUom ? h.correctedUom : "",
          approveReason: h.approveReason ? h.approveReason : "",
          plannerApproveReason: h.plannerApproveReason ? h.plannerApproveReason : "",
        })
      })
      this.stateComments.forEach(async (h) => {
        await db.interventionComment.add({
          taskKey: h.taskKey,
          taskDesc: h.taskDesc,
          taskComment: h.taskComment,
          workOrder: h.workOrder,
          createdBy: h.createdBy ? {
            id: h.createdBy.id,
            name: h.createdBy.name
          } as Audit : {} as Audit,
          createdDate: h.createdDate,
          updatedBy: h.updatedBy ? {
            id: h.updatedBy.id,
            name: h.updatedBy.name
          } as Audit : {} as Audit,
          updatedDate: h.updatedDate
        })
      })
    },
    createDefectYesUpdatePayload(employee) : InterventionPayload {
      const payload = {} as InterventionPayload
      payload.id = this.stateSelectedDetailData.id
      const detail = {} as IDefectYesDetail
      detail.type = "YES"
      detail.isNeed30Minutes = this.stateDefectFormData.IsNeed30Minutes
      detail.assetNumber = this.stateDefectFormData.AssetNumber
      detail.description = this.stateDefectFormData.Description.value
      detail.raisedBy = this.stateDefectFormData.RaisedBy
      detail.plannedDuration = this.stateDefectFormData.PlannedDuration.value
      detail.instruction = this.stateDefectFormData.Instruction.value
      detail.priority = this.stateDefectFormData.Priority
      detail.parts = JSON.stringify(this.stateDefectFormData.Parts)
      detail.labours = JSON.stringify(this.stateDefectFormData.Labours)
      detail.resources = JSON.stringify(this.stateDefectFormData.Resources)
      detail.symptoms = JSON.stringify(this.stateDefectFormData.Symptoms.map((val) => {
        return val.value
      }))
      detail.causes = JSON.stringify(this.stateDefectFormData.Causes.map((val) => {
        return val.value
      }))
      payload.updateParams = []
      payload.updateParams.push({
        keyValue: this.stateSelectedDetailData.key,
        propertyParams: [
          {
            propertyName: "detail",
            propertyValue: JSON.stringify(detail)
          },
          {
            propertyName: "updateBy",
            propertyValue: JSON.stringify(employee)
          },
          {
            propertyName: "updatedDate",
            propertyValue: "<<ServerDateTime>>"
          },
        ] as InterventionPayloadPropertyParam[]
      })
      payload.employee = employee as Audit
      const detailStore = useComponentInterventionDetailStore()
      payload.localInterventionStatus = detailStore.Intervention.interventionExecution
      return payload
    },
    async updateDefectDetail(employee) {
      const payload = this.createDefectYesUpdatePayload(employee)
      try {
        if (!isOfflineOrSlowInternetConnection()) {
          await ApiService.post(`${UPDATE_DEFECT_DETAIL}`, payload as AxiosRequestConfig)
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async updateDownloadHistory(data: {
      headerId: string,
      type: string
      employee: {
        id: string,
        name: string,
      }
    }) {
      let found;
      if (data.type == 'defect') {
        found = this.stateData.DefectHeaders.find((d) => {
          return d.id === data.headerId
        }) as unknown as Header
      } else if (data.type == 'defectGeneric') {
        found = this.stateData.DefectGenericHeaders.find((d) => {
          return d.id === data.headerId
        }) as unknown as Header
      }
      if (!found) return
      const payload = {
        id: found.defectHeaderId,
        updateParams: [{
          keyValue: found.defectDetailId,
          propertyParams: [{
            propertyName: "downloadHistory",
            propertyValue: true
          },
          {
            propertyName: "updatedBy",
            propertyValue: JSON.stringify(data.employee)
          },
          {
            propertyName: "updatedDate",
            propertyValue: "<<ServerDateTime>>"
          }
          ]
        }],
        employee: data.employee
      }
      try {
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
        if (found.downloadHistory) {
          const tempDownloadHistory = JSON.parse(found.downloadHistory)
          tempDownloadHistory.push({
            downloadBy: data.employee
          })
          found.downloadHistory = JSON.stringify(tempDownloadHistory)
        } else {
          found.downloadHistory = JSON.stringify([{
            downloadBy: data.employee
          }])
        }
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    getDefectDetailData(taskId: string): IDefectYesDetail | IDefectNoDetail | null {
      const defect = this.stateData.DefectHeaders.find((val) => {
        return val.taskId == taskId
      })
      if (defect) {
        return defect.type == 'YES' ? JSON.parse(defect.defectData) as IDefectYesDetail :
        JSON.parse(defect.defectData) as IDefectNoDetail
      }
      return null
    },
    getDefectGenericData(defectHeaderId: string): Defect | null {
      const defect = this.stateData.DefectGenericHeaders.find((val) => {
        return val.defectHeaderId == defectHeaderId
      })
      return defect as Defect | null
    },
    getDefectHeaderDetailData(id: string): { header: PartialBy<Defect, 'defectData'>, detail: IDefectYesDetail } | null {
      const data = this.stateData.DefectHeaders.find((val) => {
        return val.id == id
      })

      if (data) {
        const detail = JSON.parse(data.defectData);
        const header = { ...data } as PartialBy<Defect, 'defectData'>;
        delete header.defectData;
        return {
          header,
          detail
        }
      }
      return null
    },
    getDefectGenericHeaderDetailData(id: string): { header: PartialBy<Defect, 'defectData'>, detail: IDefectYesDetail } | null {
      const data = this.stateData.DefectGenericHeaders.find((val) => {
        return val.id == id
      })

      if (data) {
        const detail = JSON.parse(data.defectData);
        const header = { ...data } as PartialBy<Defect, 'defectData'>;
        delete header.defectData;
        return {
          header,
          detail
        }
      }
      return null
    },
    getNADetailData(taskId: string) {
      const defect = this.stateData.DefectNAHeaders.find((val) => {
        return val.taskId == taskId
      })
      if (defect) {
        return defect as Defect
      }
      return null
    },
    getCBMDetailData(headerKey: string) {
      const cbmDetail = this.stateData.CBMHeaders.find((val) => {
        return val.taskId == headerKey
      })
      if (cbmDetail) {
        return cbmDetail as Defect
      }
      return null
    },
    reset() {
      this.stateLoading = false
      this.stateData = new DefectIdentifiedClass()
      this.stateDefectHeader = [] as Header[]
      this.stateDefectDetail = [] as Detail[]
      this.stateDefectFormData = new DefectYesClass()
      this.stateSelectedDetailData = {} as any
      this.stateComments = [] as Comment[]
    },
    async getCommentFromServiceSheet(workOrder) {
      await deleteInterventionFormComments(workOrder)
      const serviceSheet = await db.interventionDetail.where({
        sapWorkOrder: workOrder
      }).first()
      if (!serviceSheet) {
        return
      }
      console.log("serviceSheet", serviceSheet)
      for (const subGroup of serviceSheet.details) {
        for (const taskGroup of subGroup.tasks) {
          for (const task of taskGroup.tasks) {
            if (task.taskValue) {
              if (task?.adjustment) {
                const adjustment = task.adjustment
                if (adjustment.commentValue) {
                  // cari defect apa ada
                  const defect = await db.interventionDefect.where({
                    sapWorkorder: workOrder,
                    taskKey: task.key,
                  }).first()
                  // kalo ada cek apa commentnya sama
                  if (defect) {
                    const commentUndefined = !defect.commentValue
                    const commentNotSameWithAdjustment = defect.commentValue != adjustment.commentValue
                    if (commentUndefined || commentNotSameWithAdjustment) {
                      defect.commentValue = adjustment.commentValue
                    }
                    // kalo beda update pake value yg baru
                    await db.interventionDefect.update(Number(defect!.id), defect)
                  } else {
                    const commentTask = await db.interventionComment.where({
                      workOrder: workOrder,
                      taskKey: task.key,
                    }).first()
                    if (commentTask) {
                      commentTask.taskComment = adjustment.commentValue
                      await db.interventionComment.update(Number(task.key), commentTask)
                    } else {
                      await db.interventionComment.add({
                        taskKey: task.key,
                        taskDesc: task.description,
                        taskComment: adjustment.commentValue as string,
                        workOrder: workOrder,
                        createdBy: task.updatedBy as Employee,
                        createdDate: task?.updatedDate || "",
                        updatedBy: task.updatedBy as Employee,
                        updatedDate: task?.updatedDate || ""
                      })
                    }
                  }
                } else {
                  const defect = await db.interventionDefect.where({
                    sapWorkorder: workOrder,
                    taskKey: task.key,
                  }).first()
                  if (defect) {
                    const commentExist = defect?.commentValue
                    if (commentExist) {
                      defect.commentValue = ""
                    }
                    // kalo beda update pake value yg baru
                    await db.interventionDefect.update(Number(defect!.id), defect)
                  }
                }
              } else {
                for (const item of task.items) {
                  const isItemInput = item.itemType == "input"
                  const isItemHasValue = item.value
                  const isItemCommentType = item?.valueItemType == "comment"
                  if (isItemInput && isItemHasValue && isItemCommentType) {
                    // search in defect
                    const defect = await db.interventionDefect.where({
                      sapWorkorder: workOrder,
                      taskKey: task.key
                    }).first()
                    if (defect) {
                      const commentValueUndefined = defect.commentValue == "undefined"
                      const commentValueNotSame = defect.commentValue != item.value
                      if (commentValueUndefined || commentValueNotSame) {
                        defect.commentValue = item.value as string
                        await db.interventionDefect.update(Number(defect!.id), defect)
                      }
                    } else {
                      const comment = await db.interventionComment.where({
                        workOrder: workOrder,
                        taskKey: task.key,
                      }).first()
                      if (comment) {
                        if (comment?.taskComment != item.value) {
                          comment.taskComment = item.value as string
                          // kalo beda update pake value yg baru
                          await db.interventionComment.update(Number(task.key), comment)
                        }
                      } else {
                        await db.interventionComment.add({
                          taskKey: task.key,
                          taskDesc: task.description,
                          taskComment: item.value as string,
                          workOrder: workOrder,
                          createdBy: task.updatedBy as Employee,
                          createdDate: task?.updatedDate || "",
                          updatedBy: task.updatedBy as Employee,
                          updatedDate: task?.updatedDate || ""
                        })
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      const comments = await db.interventionComment.where({
        workOrder: workOrder,
      }).toArray()
      await this.setDefectIdentifiedData(workOrder)
      this.stateComments = comments
    }
  }
})
