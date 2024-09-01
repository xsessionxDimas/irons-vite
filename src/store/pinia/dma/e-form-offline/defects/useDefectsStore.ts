/* eslint-disable no-console */
import { defineStore } from "pinia"
import {
  GET_DEFECTS_HEADER,
  GET_DEFECTS_DETAIL,
  UPDATE_DEFECT_DETAIL,
  UPDATE_DEFECT_HEADER,
  GET_DETAIL_FIELD_VALUE
} from "./urls"
import {
  Detail,
  DetailHistory
} from "@/core/types/entities/dma/defects/Detail"
import {
  Header,
  HeaderHistory
} from "@/core/types/entities/dma/defects/Header"
import ApiService from "@/core/services/ApiService"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { ApiResponse } from "@/core/types/misc/ApiResponse"
import DefectApprovalClass from "@/core/classes/DefectsApprovalClass"
import DefectYesClass from "@/core/classes/DefectYesClass"
import CrackYesClass from "@/core/classes/CrackYesClass"
import {
  useOfflineCameraStore
} from "@/store/pinia/application/useOfflineCameraStore"
import { ImageObject } from "@/core/types/entities/dma/ImageObject"
import { useAttachmentStore } from "../attachments/useAttachmentStore"
import { Part } from "@/core/types/entities/dma/e-form/defects/Part"
import { Labour } from "@/core/types/entities/dma/e-form/defects/Labour"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import { useEFormStore } from "../useEFormStore"
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler"
import CrackNoClass from "@/core/classes/CrackNoClass"
import { cloneDeep, create, isUndefined } from "lodash"
import {
  AESTCurrentDateTime,
  AESTShortCurrentDateTime
} from "@/core/helpers/date-format"
import { db } from "@/database/schema/DexieSchema"
import {
  getImageFromAPI,
  getReferenceUrlFromLocalDB,
  handleReplaceImageToLocalDB
} from "@/core/helpers/ironforms/offline/reference-file"
import { useOnline } from "@vueuse/core"
import {
  clearDefectListFromLocalDB,
  deleteServiceFormComments,
  dumpDefectListToLocalDB,
  dumpServiceFormComments,
  getDefectSyncStatus,
  updateDefectByDefectDetailId
} from "@/core/helpers/ironforms/offline/defect-form"
import {
  GET_ALL_DEFECTS,
  UPDATE_DEFECT_DETAIL_FITTER
} from "../../e-form/defects/urls"
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse"
import {
  WrapperListDefectSections
} from "@/core/types/entities/dma/defects/ListDefectSections"
import { Comment } from "@/database/schema/Comment"
import { Task } from "@/core/types/entities/dma/e-form/Task"
import { Employee } from "@/core/types/entities/dma/Payload"
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo"
import { sendCustomEvent } from "@/core/helpers/azure-app-insight"
import { SyncMessage } from "@/database/schema/SyncMessage"
import { Audit } from "@/core/types/intervention/Audit"
import {
  DefectSMU
} from "@/core/types/entities/dma/defects/DefectSMU";
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import {
  assignCrackDetail,
  assignDefectDetail,
  downloadImageAttachments
} from "./methods"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useDefectsStore = defineStore({
  id: "offlineDefects",
  state: () => {
    return {
      stateLoading: false,
      stateData: new DefectApprovalClass(),
      stateDefectFormData: new DefectYesClass(),
      stateCrackFormData: new CrackYesClass(),
      stateCrackSimpleFormData: new CrackNoClass(),
      stateDefectSMU: {} as DefectSMU,
      stateIsError: false,
      stateHeaderId: "",
      stateDetailId: "",
      stateHeaderStatus: "",
      stateDefectGeneralStatus: "",
      stateDefectFetched: false,
      stateCurrentUserGroup: "",
      stateLoadDefectImages: false,
      stateApproveBy: undefined as Audit | undefined,
      stateApproveDate: undefined as string | undefined,
      stateErrorByNetwork: false,
      stateDefectPictures: {},
      stateDefectKey: 1,
      stateDefectDetails: [] as Detail[],
      stateDefectHeaders: [] as Header[],
      stateDefectHeaderHistory: [] as HeaderHistory[],
      stateSelectedHeaderHistory: [] as HeaderHistory[],
      stateDefectDetailHistory: [] as DetailHistory[],
      stateSelectedDetailHistory: [] as DetailHistory[],
      stateSelectedDetailVersion: {} as DetailHistory,
      stateCompleteStatus: true,
      stateComments: [] as Comment[],
      stateReferencePhoto: {
        title: "",
        blob: "",
        id: "",
      },
      stateDefectDetailDownload: {} as any,
      stateApprovalDefectDownload: {
        approvedBy: {} as Audit,
        approvedDate: ""
      },
      stateViewDefectVisible: false,
      stateViewCrackVisible: false,
    }
  },
  getters: {
    Loading: (state) => {
      return state.stateLoading
    },
    CompleteStatus: (state) => {
      return state.stateCompleteStatus
    },
    GeneralStatus: (state) => {
      return state.stateDefectGeneralStatus
    },
    ApprovalData: (state) => {
      return state.stateData
    },
    DefectKey: (state) => {
      return state.stateDefectKey
    },
    DefectHeaderHistory: (state) => {
      return state.stateDefectHeaderHistory
    },
    DefectDetailHistory: (state) => {
      return state.stateDefectDetailHistory
    },
    DefectFormData: (state) => {
      return state.stateDefectFormData
    },
    CrackFormData: (state) => {
      return state.stateCrackFormData
    },
    ImagesDefect: () => {
      const cameraStore = useOfflineCameraStore()
      return cameraStore.ImageObjects.find((p) => {
        return p.Id === "defect"
      }) as ImageObject
    },
    ImagesCrack: () => {
      const cameraStore = useOfflineCameraStore()
      return cameraStore.ImageObjects.find((p) => {
        return p.Id === "crack"
      }) as ImageObject
    },
    IsError: (state) => {
      return state.stateIsError
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
    referencePhoto: (state) => {
      return state.stateReferencePhoto;
    },
    onlineStatus: () => {
      return useOnline()
    },
    eformStore: () => {
      return useEFormStore()
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
    DefectSMUHeader: (state): Header => {
      return state.stateData.DefectHeaders.find((obj) => {
        return obj.defectType == 'machineSMU'
      }) ?? {} as Header;
    },
    DefectSMUDetail: (state) => {
      return state.stateDefectSMU;
    },
    DefectSMUDetailDetail: (state) => {
      return state.stateData.SMUDefectDetails.find((d) => {
        return d.defectHeaderId == state.stateDetailId
      })
    },
    SelectedDefectHeaderHistory: (state) => {
      return state.stateSelectedHeaderHistory
    },
    SelectedDefectDetailVersion: (state) => {
      return state.stateSelectedDetailVersion
    },
    VersionDate: (state) => {
      const dates = state.stateSelectedHeaderHistory.map((header) => {
        return header.createdDate
      })
      return dates
    },
    ViewDefectVisible: (state) => {
      return state.stateViewDefectVisible
    },
    ViewCrackVisible: (state) => {
      return state.stateViewCrackVisible
    }
  },
  actions: {
    setCompleteStatus(status: boolean) {
      this.stateErrorByNetwork = status;
    },
    toggleErrorByNetwork(status: boolean) {
      this.stateErrorByNetwork = status;
    },
    setCurrentUserGroup(userGroup: string): void {
      this.stateCurrentUserGroup = userGroup;
    },
    setViewDefectVisible(value: boolean) {
      this.stateViewDefectVisible = value
    },
    setViewCrackVisible(value: boolean) {
      this.stateViewCrackVisible = value
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
    getCompleteStatus(headerId: string): boolean {
      const found = this.ApprovalData.DefectDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        this.stateCompleteStatus = found.detail.isComplete ?? true
        return found.detail.isComplete ?? true
      }
      return true
    },
    getGenericCompleteStatus(headerId: string): boolean {
      const found = this.ApprovalData.DefectGenericDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        return found.detail.isComplete ?? true
      }
      return true
    },
    getCrackCompleteStatus(headerId: string): boolean {
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        return found.detail.isComplete ?? true
      }
      return true
    },
    async getDefectsDataHeader(workorder: string) {
      const body = this.createRequestBody(workorder)
      const response: AxiosResponse<ApiResponse<Header>> = await ApiService.post(`${GET_DEFECTS_HEADER}`, body as AxiosRequestConfig)
      /* set the state */
      this.stateData.setHeaders(response.data.result.content)
      this.stateDefectHeaders = response.data.result.content
    },
    async getDefectsDataDetail(workorder: string) {
      const body = this.createRequestBody(workorder)
      const response: AxiosResponse<ApiResponse<Detail>> = await ApiService.post(`${GET_DEFECTS_DETAIL}`, body as AxiosRequestConfig)
      /* set the state */
      this.stateDefectDetails = cloneDeep(response.data.result.content)
      this.stateData.setDetails(response.data.result.content)
    },
    async saveDefectServiceFormToLocalDB(workOrder) {
      clearDefectListFromLocalDB(workOrder)
      dumpDefectListToLocalDB(this.stateDefectHeaders, this.stateDefectDetails)
      this.stateComments.forEach((item) => {
        item.workOrder = workOrder
      })
      dumpServiceFormComments(this.stateComments, workOrder)
    },
    async getCommentFromServiceSheet(workOrder) {
      await deleteServiceFormComments(workOrder)
      const serviceSheet = await db.serviceSheetDetail.where({
        id: workOrder
      }).first()
      if (!serviceSheet) {
        return
      }
      const serviceSheetDetail = serviceSheet.serviceSheet
      for (const groupIndex in serviceSheetDetail) {
        if (Object.prototype.hasOwnProperty.call(serviceSheetDetail, groupIndex)) {
          const group = serviceSheetDetail[groupIndex];
          for (const subGroupIndex in group.subGroup) {
            if (Object.prototype.hasOwnProperty.call(group.subGroup, subGroupIndex)) {
              const subGroup = group.subGroup[subGroupIndex];
              for (const taskGroupIndex in subGroup.taskGroup) {
                if (Object.prototype.hasOwnProperty.call(subGroup.taskGroup, taskGroupIndex)) {
                  const taskGroup = subGroup.taskGroup[taskGroupIndex];
                  for (const taskIndex in taskGroup.task) {
                    if (Object.prototype.hasOwnProperty.call(taskGroup.task, taskIndex)) {
                      const task: Task = taskGroup.task[taskIndex];
                      if (task?.taskValue) {
                        if (task?.adjustment) {
                          const adjustment = task.adjustment
                          if (adjustment.commentValue) {
                            // cari defect apa ada
                            const defect = await db.serviceSheetDefect.where({
                              workorder: workOrder,
                              taskId: task.key,
                              isActive: "true"
                            }).first()
                            // kalo ada cek apa commentnya sama
                            if (defect) {
                              const commentUndefined = !defect.commentValue
                              const commentNotSameWithAdjustment = defect.commentValue != adjustment.commentValue
                              if (commentUndefined || commentNotSameWithAdjustment) {
                                defect.commentValue = adjustment.commentValue
                              }
                              // kalo beda update pake value yg baru
                              await db.serviceSheetDefect.update(Number(defect!.id), defect)
                            } else {
                              const commentTask = await db.serviceFormComment.where({
                                workOrder: workOrder,
                                taskKey: task.key,
                              }).first()
                              if (commentTask) {
                                commentTask.taskComment = adjustment.commentValue
                                await db.serviceFormComment.update(Number(task.key), commentTask)
                              } else {
                                await db.serviceFormComment.add({
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
                            const defect = await db.serviceSheetDefect.where({
                              workorder: workOrder,
                              taskId: task.key,
                              isActive: "true"
                            }).first()
                            if (defect) {
                              const commentExist = defect?.commentValue
                              if (commentExist) {
                                defect.commentValue = ""
                              }
                              // kalo beda update pake value yg baru
                              await db.serviceSheetDefect.update(Number(defect!.id), defect)
                            }
                          }
                        } else if (task?.replacement) {
                          const replacement = task.replacement
                          if (replacement.commentValue) {
                            // cari defect apa ada
                            const defect = await db.serviceSheetDefect.where({
                              workorder: workOrder,
                              taskId: task.key,
                              isActive: "true"
                            }).first()
                            // kalo ada cek apa commentnya sama
                            if (defect) {
                              const commentUndefined = !defect.commentValue
                              const commentNotSameWithReplacement = defect.commentValue != replacement.commentValue
                              if (commentUndefined || commentNotSameWithReplacement) {
                                defect.commentValue = replacement.commentValue
                              }
                              // kalo beda update pake value yg baru
                              await db.serviceSheetDefect.update(Number(defect!.id), defect)
                            } else {
                              const commentTask = await db.serviceFormComment.where({
                                workOrder: workOrder,
                                taskKey: task.key,
                              }).first()
                              if (commentTask) {
                                commentTask.taskComment = replacement.commentValue
                                await db.serviceFormComment.update(Number(task.key), commentTask)
                              } else {
                                await db.serviceFormComment.add({
                                  taskKey: task.key,
                                  taskDesc: task.description,
                                  taskComment: replacement.commentValue as string,
                                  workOrder: workOrder,
                                  createdBy: task.updatedBy as Employee,
                                  createdDate: task?.updatedDate || "",
                                  updatedBy: task.updatedBy as Employee,
                                  updatedDate: task?.updatedDate || ""
                                })
                              }
                            }
                          } else {
                            const defect = await db.serviceSheetDefect.where({
                              workorder: workOrder,
                              taskId: task.key,
                              isActive: "true"
                            }).first()
                            if (defect) {
                              const commentExist = defect?.commentValue
                              if (commentExist) {
                                defect.commentValue = ""
                              }
                              // kalo beda update pake value yg baru
                              await db.serviceSheetDefect.update(Number(defect!.id), defect)
                            }
                          }
                        // cek kondisi commentId di task
                        } else if (task.commentId) {
                          // get item value (comment)
                          const itemVal = this.eformStore.getFieldValueByKey(task.commentId, "value");
                          if (itemVal) {
                            // cari defect apa ada
                            const defect = await db.serviceSheetDefect.where({
                              workorder: workOrder,
                              taskId: task.key,
                              isActive: "true"
                            }).first()
                            // kalo ada cek apa commentnya sama
                            if (defect) {
                              const commentUndefined = !defect.commentValue
                              const commentNotSameWithAdjustment = defect.commentValue != itemVal
                              if (commentUndefined || commentNotSameWithAdjustment) {
                                defect.commentValue = itemVal
                              }
                              // kalo beda update pake value yg baru
                              await db.serviceSheetDefect.update(Number(defect!.id), defect)
                            } else {
                              const commentTask = await db.serviceFormComment.where({
                                workOrder: workOrder,
                                taskKey: task.key,
                              }).first()
                              if (commentTask) {
                                commentTask.taskComment = itemVal
                                await db.serviceFormComment.update(Number(task.key), commentTask)
                              } else {
                                await db.serviceFormComment.add({
                                  taskKey: task.key,
                                  taskDesc: task.description,
                                  taskComment: itemVal as string,
                                  workOrder: workOrder,
                                  createdBy: task.updatedBy as Employee,
                                  createdDate: task?.updatedDate || "",
                                  updatedBy: task.updatedBy as Employee,
                                  updatedDate: task?.updatedDate || ""
                                })
                              }
                            }
                          }
                        } else {
                          for (const itemIndex in task.items) {
                            if (Object.prototype.hasOwnProperty.call(task.items, itemIndex)) {
                              const item = task.items[itemIndex];
                              const isItemInput = item.itemType == "input"
                              const isItemHasValue = item.value
                              const isItemCommentType = item?.valueItemType == "comment"
                              if (isItemInput && isItemHasValue && isItemCommentType) {
                                // search in defect
                                const defect = await db.serviceSheetDefect.where({
                                  workorder: workOrder,
                                  taskId: task.key,
                                  isActive: "true"
                                }).first()
                                if (defect) {
                                  const commentValueUndefined = defect.commentValue == "undefined"
                                  const commentValueNotSame = defect.commentValue != item.value
                                  if (commentValueUndefined || commentValueNotSame) {
                                    defect.commentValue = item.value as string
                                    await db.serviceSheetDefect.update(Number(defect!.id), defect)
                                  }
                                } else {
                                  const comment = await db.serviceFormComment.where({
                                    workOrder: workOrder,
                                    taskKey: task.key,
                                  }).first()
                                  if (comment) {
                                    if (comment?.taskComment != item.value) {
                                      comment.taskComment = item.value as string
                                      // kalo beda update pake value yg baru
                                      await db.serviceFormComment.update(Number(task.key), comment)
                                    }
                                  } else {
                                    await db.serviceFormComment.add({
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
                }
              }
            }
          }
        }
      }
    },
    async getDefectsDataAll(workorder: string) {
      const params = {
        workOrder: workorder,
        ver: "v1"
      }
      if (!isOfflineOrSlowInternetConnection()) {
        const response: AxiosResponse<SingleApiResponse<WrapperListDefectSections>> = await ApiService.get(`${GET_ALL_DEFECTS}`, "", new URLSearchParams(params).toString())
        /* set the state */
        this.stateData.setHeaders(response.data.result.content?.content.defectHeader || [])
        this.stateData.setDetails(response.data.result.content?.content.defectDetail || [])
        this.stateDefectDetails = response.data.result.content?.content.defectDetail || []
        this.stateDefectHeaders = response.data.result.content?.content.defectHeader || []
        this.stateComments = response.data.result.content?.content.comment || []
        this.stateDefectHeaderHistory = response.data.result.content?.content.defectHeaderHistory || []
        this.stateDefectDetailHistory = response.data.result.content?.content.defectDetailHistory || []
        this.stateApproveBy = response.data.result.content?.content.approveBy || undefined
        this.stateApproveDate = response.data.result.content?.content.approveDate || ""
      }
    },
    setSelectedDefectHeaderHistory(headerId: string) {
      if (this.stateDefectHeaderHistory && this.stateDefectHeaderHistory.length > 0) {
        this.stateSelectedHeaderHistory = this.stateDefectHeaderHistory.filter((h) => {
          return h.defectHeaderId == headerId
        })
      }
      return []
    },
    setDetailVersion(createdDate: string): boolean {
      /* need to conver this first */
      const found = this.stateSelectedDetailHistory.find((d) => {
        return d.createdDate.substring(0, 15) == createdDate.substring(0, 15)
      })
      if (found) {
        this.stateSelectedDetailVersion = found
        return true
      }
      return false
    },
    resetDetailVersion() {
      this.stateSelectedDetailVersion = this.stateSelectedDetailHistory[0] ?? {} as DetailHistory
    },
    setSelectedDefectDetailHistory(headerId: string) {
      if (this.stateDefectDetailHistory && this.stateDefectDetailHistory.length > 0) {
        this.stateSelectedDetailHistory = this.stateDefectDetailHistory.filter((d) => {
          return d.defectHeaderId == headerId
        })
      }
      return []
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
    async getDefectFromLocalDB(workOrder: string) {
      await this.getCommentFromServiceSheet(workOrder)
      const defects = await db.serviceSheetDefect.where({
        workorder: workOrder,
        isActive: "true"
      }).toArray()
      const formattedDefectHeader: Header[] = []
      const formattedDefectDetail: Detail[] = []
      for (const key in defects) {
        const element = defects[key];
        const defectHeader = element as any
        defectHeader.id = element.defectHeaderId
        // if (!defectHeader?.id) {
        //   defectHeader.id = ""
        // }
        formattedDefectHeader.push(defectHeader)
        if (element.defectData) {
          let formattedDefectDetailData = element.defectData as any
          if (typeof formattedDefectDetailData === 'string') {
            formattedDefectDetailData = JSON.parse(element.defectData as string)
          }
          const detail = {
            id: element?.defectDetailId ? element?.defectDetailId : "",
            key: element?.defectDetailKey ? element?.defectDetailKey : "",
            defectHeaderId: element?.defectHeaderId ? element?.defectHeaderId : "",
            detail: formattedDefectDetailData,
            createdBy: formattedDefectDetailData.createdBy,
            createdDate: formattedDefectDetailData.createdDate,
            updatedBy: formattedDefectDetailData.updatedBy,
            updatedDate: formattedDefectDetailData.updatedDate,
          } as Detail
          if (element.otherFitterUpdatedBy) {
            if (typeof element.otherFitterUpdatedBy == "string") {
              element.otherFitterUpdatedBy = JSON.parse(element.otherFitterUpdatedBy);
            }
            detail.otherFitterUpdatedBy = element.otherFitterUpdatedBy
            detail.updatedDate = element.updatedDate
          }
          formattedDefectDetail.push(detail)
        }
      }
      this.stateData.setHeaders(formattedDefectHeader)
      this.stateData.setDetails(formattedDefectDetail)
      const comments = await db.serviceFormComment.where({
        workOrder: workOrder,
      }).toArray()
      if (comments) {
        this.stateComments = comments
      }
    },
    async setDefectImages(images) {
      const imageObject = await downloadImageAttachments(images, undefined)
      this.ImagesDefect.ImageInfos = imageObject.ImageInfos
      this.ImagesDefect.ImageBlobs = imageObject.ImageBlobs
    },
    async setCrackImages(images) {
      const imageObject = await downloadImageAttachments(images, undefined)
      this.ImagesCrack.ImageInfos = imageObject.ImageInfos
      this.ImagesCrack.ImageBlobs = imageObject.ImageBlobs
    },
    async setDefectGeneralStatus(headerId: string) {
      const header = this.ApprovalData.DefectHeaders.find((h) => {
        return h.id === headerId
      })
      this.stateDefectGeneralStatus = header?.generalStatus ?? ""
    },
    async setGenericDefectGeneralStatus(headerId: string) {
      const header = this.ApprovalData.DefectGenericHeaders.find((h) => {
        return h.id === headerId
      })
      this.stateDefectGeneralStatus = header?.generalStatus ?? ""
    },
    async setCrackGeneralStatus(headerId: string) {
      const header = this.ApprovalData.CrackHeaders.find((h) => {
        return h.id === headerId
      })
      this.stateDefectGeneralStatus = header?.generalStatus ?? ""
    },
    async setDefectData(headerId: string): Promise<string | undefined> {
      const header = this.ApprovalData.DefectHeaders.find((h) => {
        return h.id === headerId
      })
      const found = this.ApprovalData.DefectDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        const cameraStore = useOfflineCameraStore()
        cameraStore.setCurrent("defect")
        this.setHeaderId(headerId)
        this.setDetailId(found.id)
        this.setSelectedDefectHeaderHistory(headerId)
        this.setSelectedDefectDetailHistory(headerId)
        const [result] = assignDefectDetail(found.detail)
        this.stateDefectFormData = result
        this.stateDefectFormData.setTitle(header?.taskDesc || "")
        this.stateDefectFormData.setType(found.detail.type)
        this.stateHeaderStatus = header?.status as string
        const imageObject = await downloadImageAttachments(found.detail.images, undefined)
        this.ImagesDefect.ImageInfos = imageObject.ImageInfos
        this.ImagesDefect.ImageBlobs = imageObject.ImageBlobs
        return found.detail.type
      }
    },
    async setDefectGenericData(headerId: string): Promise<string | undefined> {
      const header = this.ApprovalData.DefectGenericHeaders.find((h) => {
        return h.id === headerId
      })
      const found = this.ApprovalData.DefectGenericDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        this.setHeaderId(headerId)
        this.setDetailId(found.id)
        this.setSelectedDefectHeaderHistory(headerId)
        this.setSelectedDefectDetailHistory(headerId)
        const [result] = assignDefectDetail(found.detail)
        this.stateDefectFormData = result
        this.stateDefectFormData.setTitle(header?.taskDesc || "")
        this.stateHeaderStatus = header?.status as string
        const imageObject = await downloadImageAttachments(found.detail.images, undefined)
        this.ImagesDefect.ImageInfos = imageObject.ImageInfos
        this.ImagesDefect.ImageBlobs = imageObject.ImageBlobs
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
      try {
        const response: AxiosResponse<ApiResponse<string>> =
          await ApiService.post(`${GET_DETAIL_FIELD_VALUE}?${new URLSearchParams(params).toString()}`,
            body as AxiosRequestConfig)
        if (!isUndefined(response.data.result.content)) {
          result = response.data.result.content
        }
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_get_defect_images`, {
          errorMessage: error
        })
        sendErrorEvent('IRONS', error);
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
        detail.detail.images = JSON.stringify(this.ImagesDefect?.ImageInfos ?? [])
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
      const formattedPartsDataList = this.DefectFormData.Parts.map((item) => {
        const qty = item.qty ? String(parseFloat(item.qty)) : item.qty
        return {
          ...item,
          qty,
        }
      })
      const formattedLabourDataList = this.DefectFormData.Labours.map((item) => {
        const qty = item.qty ? String(parseFloat(item.qty)) : item.qty
        const hireEach = item.hireEach ? String(parseFloat(item.hireEach)) : item.hireEach

        return {
          ...item,
          qty,
          hireEach
        }
      })
      return {
        type: this.DefectFormData.Type,
        assetNumber: this.DefectFormData.AssetNumber,
        description: this.DefectFormData.Description.value,
        title: this.DefectFormData.Title,
        raisedBy: this.DefectFormData.RaisedBy,
        date: this.DefectFormData.Date,
        plannedDuration: String(parseFloat(this.DefectFormData.PlannedDuration.value)),
        instruction: this.DefectFormData.Instruction.value,
        priority: this.DefectFormData.Priority,
        parts: JSON.stringify(formattedPartsDataList as Part[]),
        labours: JSON.stringify(formattedLabourDataList as Labour[]),
        resources: JSON.stringify(this.DefectFormData.Resources.map((r) => {
          return r.value
        })),
        symptoms: JSON.stringify(this.DefectFormData.Symptoms.map((s) => {
          return s.value
        })),
        causes: JSON.stringify(this.DefectFormData.Causes.map((c) => {
          return c.value
        })),
        images: JSON.stringify(images),
        // reference photo
        referencePhoto: this.stateReferencePhoto.id,
        referenceSection: this.stateReferencePhoto.title,
        isComplete: this.DefectFormData.IsComplete,
        requirement: this.DefectFormData.DefectRequirement
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
            propertyValue: AESTCurrentDateTime()
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        const res = await ApiService.post(`${UPDATE_DEFECT_DETAIL}`, payload as AxiosRequestConfig)
        if (res.data.statusError == 400) {
          this.stateIsError = true
          return res.data.result.message
        }
        return ''
      } catch (error: any) {
        sendCustomEvent("fe_event_error_update_defect_detail", {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        const eformStore = useEFormStore()
        eformStore.toggleTaskAlreadyUpdatedStatus(true)
        const message = error.response.data.result.message
        sendErrorEvent('IRONS', error);
        return message
      }
    },
    async updateDefectAcknowledge() {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.DefectHeaders.find((d) => {
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
            propertyValue: AESTCurrentDateTime()
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
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateIsError = true
      }
    },
    async updateDefectDecline(val) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.DefectHeaders.find((d) => {
        return d.id === this.stateHeaderId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "status",
            propertyValue: "Decline"
          },
          {
            propertyName: "declineReason",
            propertyValue: val
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
            propertyValue: AESTCurrentDateTime()
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
            propertyValue: AESTCurrentDateTime()
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
        found.status = "Decline"
        found.declineReason = val
        found.declineBy = {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
        found.declineDate = AESTCurrentDateTime()
        this.stateHeaderStatus = "Decline"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateIsError = true
      }
      this.stateData.setDetails(this.stateDefectDetails)
    },
    async updatePlannerDefectDecline(val) {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.DefectHeaders.find((d) => {
        return d.id === this.stateHeaderId
      }) as unknown as Header
      const payload = {
        id: found.id,
        updateParams: [{
          keyValue: found.key,
          propertyParams: [{
            propertyName: "plannerStatus",
            propertyValue: "Decline"
          },
          {
            propertyName: "declineReason",
            propertyValue: val
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
            propertyValue: AESTCurrentDateTime()
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
            propertyValue: AESTCurrentDateTime()
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
        found.plannerStatus = "Decline"
        found.declineReason = val
        found.declineBy = {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
        found.declineDate = AESTCurrentDateTime()
        this.stateHeaderStatus = "Decline"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateIsError = true
      }
      this.stateData.setDetails(this.stateDefectDetails)
    },
    async updateCrackDecline(val) {
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
            propertyValue: "Decline"
          },
          {
            propertyName: "declineReason",
            propertyValue: val
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
            propertyValue: AESTCurrentDateTime()
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
            propertyValue: AESTCurrentDateTime()
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
        found.status = "Decline"
        found.declineReason = val
        found.declineBy = {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
        found.declineDate = AESTCurrentDateTime()
        this.stateHeaderStatus = "Decline"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateIsError = true
      }
      this.stateData.setDetails(this.stateDefectDetails)
    },
    async updatePlannerCrackDecline(val) {
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
            propertyValue: "Decline"
          },
          {
            propertyName: "declineReason",
            propertyValue: val
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
            propertyValue: AESTCurrentDateTime()
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
            propertyValue: AESTCurrentDateTime()
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
        found.plannerStatus = "Decline"
        found.declineReason = val
        found.declineBy = {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
        found.declineDate = AESTCurrentDateTime()
        this.stateHeaderStatus = "Decline"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateIsError = true
      }
      this.stateData.setDetails(this.stateDefectDetails)
    },
    async updatePlannerDefectAcknowledge() {
      const authStore = useAuthenticationStore()
      const found = this.ApprovalData.DefectHeaders.find((d) => {
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
            propertyValue: AESTCurrentDateTime()
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
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateIsError = true
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
            propertyValue: AESTCurrentDateTime()
          }]
        }],
        employee: JSON.parse(fitter)
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_DETAIL}`, payload as AxiosRequestConfig)
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_update_defect_data`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        const eformStore = useEFormStore()
        eformStore.toggleTaskAlreadyUpdatedStatus(true)
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDefectFitter(fitter: string, generic = false) {
      let found;
      if (generic) {
        found = this.ApprovalData.DefectGenericDetails.find((d) => {
          return d.id === this.stateDetailId
        }) as unknown as Detail
      } else {
        found = this.ApprovalData.DefectDetails.find((d) => {
          return d.id === this.stateDetailId
        }) as unknown as Detail
      }

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
            propertyValue: AESTCurrentDateTime()
          },
          {
            propertyName: "otherFitterUpdatedBy",
            propertyValue: fitter,
          }]
        }],
        employee: JSON.parse(fitter)
      }
      try {
        this.stateIsError = false
        if (!isOfflineOrSlowInternetConnection()) {
          const res = await ApiService.post(`${UPDATE_DEFECT_DETAIL_FITTER}`, payload as AxiosRequestConfig)
          return res.data.result.message
        } else {
          this.updateDefectFitterToLocalDB(found, payload, detail)
          return "try offline"
        }
      } catch (error: any) {
        sendCustomEvent(`fe_event_error_service_form_update_defect_fitter`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async updateOtherFitterValueToLocalDB(payload) {
      let otherFitterVal = {} as Audit
      let updatedDate = ""
      // check other fitter exist
      payload.updateParams[0].propertyParams.forEach((propPar) => {
        if (propPar.propertyName == "otherFitterUpdatedBy") {
          otherFitterVal = propPar.propertyValue
        } else if (propPar.propertyName == "updatedDate") {
          updatedDate = propPar.propertyValue
        }
      })
      // update on local db
      const defect = await db.serviceSheetDefect.where({
        defectDetailId: this.stateDetailId
      }).first()
      if (defect) {
        defect.otherFitterUpdatedBy = otherFitterVal
        defect.updatedDate = updatedDate
        await db.serviceSheetDefect.update(Number(defect.id!), defect)
      }
    },
    async updateDefectFitterToLocalDB(defectDetail, payload, detail) {
      await this.updateOtherFitterValueToLocalDB(payload)
      // update defect at local,
      await updateDefectByDefectDetailId(this.stateDetailId, detail)
      const isDefectSync = await getDefectSyncStatus(this.stateDetailId)
      if (!isDefectSync) {
        const defect = await db.serviceSheetDefect.where({
          defectDetailId: this.stateDetailId
        }).first()
        if (!defect) {
          return
        }
        if (defect?.defectType == "Generic") {
          await this.updateLocalDefectDetailOnTask(detail, "GenericDefect")
        } else {
          await this.updateLocalDefectDetailOnTask(detail, "MultipleDefect")
        }
      } else {
        // add task to send to be
        await db.pendingTask.add({
          module: 'serviceForm',
          section: 'E-Form',
          type: 'FitterUpdateDefect',
          workorder: this.eformStore.generalForm.workOrder,
          key: defectDetail.key,
          bindingKey: defectDetail.key,
          payload: JSON.stringify(payload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
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
            propertyValue: AESTCurrentDateTime()
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
            propertyValue: AESTCurrentDateTime()
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
    async updateDefectConfirmedStatus(headerId: string) {
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
            propertyName: "updatedBy",
            propertyValue: JSON.stringify({
              id: authStore.user.EmployeeId,
              name: authStore.user.Name
            })
          },
          {
            propertyName: "updatedDate",
            propertyValue: AESTCurrentDateTime()
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
        found.cbmNAStatus = "Confirmed"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
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
            propertyValue: AESTCurrentDateTime()
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
        found.plannerCbmNAStatus = "Confirmed"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
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
            propertyValue: AESTCurrentDateTime()
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
            propertyValue: AESTCurrentDateTime()
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
        found.plannerCbmNAStatus = "Confirmed"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCBMConfirmedStatus(headerId: string) {
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
            propertyName: "updatedBy",
            propertyValue: JSON.stringify({
              id: authStore.user.EmployeeId,
              name: authStore.user.Name
            })
          },
          {
            propertyName: "updatedDate",
            propertyValue: AESTCurrentDateTime()
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
        found.cbmNAStatus = "Confirmed"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async updatePlannerCBMConfirmedStatus(headerId: string) {
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
            propertyName: "updatedBy",
            propertyValue: JSON.stringify({
              id: authStore.user.EmployeeId,
              name: authStore.user.Name
            })
          },
          {
            propertyName: "updatedDate",
            propertyValue: AESTCurrentDateTime()
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
        found.plannerCbmNAStatus = "Confirmed"
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        sendErrorEvent('IRONS', error);
      }
    },
    async setCrackData(headerId: string) {
      const header = this.ApprovalData.CrackHeaders.find((h) => {
        return h.id === headerId
      })
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      if (found) {
        const cameraStore = useOfflineCameraStore()
        cameraStore.setCurrent("crack")
        this.setHeaderId(headerId)
        this.setDetailId(found.id)
        this.setSelectedDefectHeaderHistory(headerId)
        this.setSelectedDefectDetailHistory(headerId)
        this.stateHeaderStatus = header?.status as string
        const [result] = assignCrackDetail(found.detail)
        this.stateCrackFormData = result
        this.stateCrackFormData.setType(found.detail.type)
        await this.setReferencePhoto(found.detail.referenceSection, found.detail.referencePhoto)
        const imageObject = await downloadImageAttachments(found.detail.images, undefined)
        this.ImagesCrack.ImageInfos = imageObject.ImageInfos
        this.ImagesCrack.ImageBlobs = imageObject.ImageBlobs
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
        found.detail.images = JSON.stringify(this.ImagesCrack?.ImageInfos ?? [])
      }
    },
    createCrackDetail() {
      const images = this.ImagesCrack?.ImageInfos ?? []
      const formattedPartsDataList = this.CrackFormData.Parts.map((item) => {
        const qty = item.qty ? String(parseFloat(item.qty)) : item.qty

        return {
          ...item,
          qty,
        }
      })
      const formattedLabourDataList = this.CrackFormData.Labours.map((item) => {
        const qty = item.qty ? String(parseFloat(item.qty)) : item.qty
        const hireEach = item.hireEach ? String(parseFloat(item.hireEach)) : item.hireEach

        return {
          ...item,
          qty,
          hireEach
        }
      })
      const formattedCrackLengthDataList = this.CrackFormData.CrackLength.map((item) => {
        const currentCrack = item.currentCrack ? String(parseFloat(item.currentCrack)) : item.currentCrack

        return {
          ...item,
          currentCrack,
        }
      })
      return {
        type: "YES",
        assetNumber: this.CrackFormData.AssetNumber,
        description: this.CrackFormData.Description.value,
        title: this.CrackFormData.Title,
        raisedBy: this.CrackFormData.RaisedBy,
        date: this.CrackFormData.Date,
        plannedDuration: String(parseFloat(this.CrackFormData.PlannedDuration.value)),
        instruction: this.CrackFormData.Instruction.value,
        priority: this.CrackFormData.Priority,
        parts: JSON.stringify(formattedPartsDataList as Part[]),
        labours: JSON.stringify(formattedLabourDataList as Labour[]),
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
        previousCracks: JSON.stringify(formattedCrackLengthDataList),
        referencePhoto: this.stateReferencePhoto.id,
        referenceSection: this.stateReferencePhoto.title,
        isComplete: this.CrackFormData.IsComplete,
        requirement: this.CrackFormData.DefectRequirement
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
            propertyValue: AESTCurrentDateTime()
          }]
        }],
        employee: {
          id: authStore.user.EmployeeId,
          name: authStore.user.Name
        }
      }
      try {
        this.stateIsError = false
        const res = await ApiService.post(`${UPDATE_DEFECT_DETAIL}`, payload as AxiosRequestConfig)
        if (res.data.statusError == 400) {
          this.stateIsError = true
          return res.data.result.message
        }
        return ''
      } catch (error: any) {
        sendCustomEvent(`fe_event_error_service_form_update_crack`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error)
        this.stateIsError = true
        const message = error.response.data.result.message
        sendErrorEvent('IRONS', error);
        return message
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
            propertyValue: AESTCurrentDateTime()
          }]
        }],
        employee: JSON.parse(fitter)
      }
      try {
        this.stateIsError = false
        await ApiService.post(`${UPDATE_DEFECT_DETAIL}`, payload as AxiosRequestConfig)
      } catch (error) {
        sendCustomEvent(`fe_event_error_service_form_update_crack`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
        this.stateIsError = true
      }
    },
    async updateCrackFitter(fitter: string) {
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
            propertyValue: AESTCurrentDateTime()
          },
          {
            propertyName: "otherFitterUpdatedBy",
            propertyValue: fitter,
          }]
        }],
        employee: JSON.parse(fitter)
      }
      try {
        this.stateIsError = false
        if (!isOfflineOrSlowInternetConnection()) {
          const res = await ApiService.post(`${UPDATE_DEFECT_DETAIL_FITTER}`, payload as AxiosRequestConfig)
          return res.data.result.message
        } else {
          this.updateCrackFitterToLocalDB(cloneDeep(found), cloneDeep(payload), cloneDeep(detail))
          return "try offline"
        }
      } catch (error: any) {
        sendCustomEvent(`fe_event_error_service_form_update_crack_fitter`, {
          errorMessage: error
        })
        updateLoggedInStatusFromAPIResponse(error)
        this.stateIsError = true
        const message = error.response.data.result.message
        sendErrorEvent('IRONS', error);
        return message
      }
    },
    async updateLocalDefectDetailOnTask(detail, taskType) {
      const defect = await db.serviceSheetDefect.where({
        defectHeaderId: this.stateHeaderId
      }).first()
      if (defect) {
        let taskDefects = {} as SyncMessage[]
        if (taskType == "GenericDefect") {
          taskDefects = await db.pendingTask.where({
            key: defect?.defectHeaderId,
            workorder: defect?.workorder,
            type: taskType,
          }).toArray()
        } else {
          taskDefects = await db.pendingTask.where({
            key: defect?.taskId,
            workorder: defect?.workorder,
            type: taskType,
          }).toArray()
        }
        taskDefects.forEach(async (task) => {
          const defectPayload = cloneDeep(JSON.parse(task.payload))
          if (defectPayload.defectHeader.defectHeaderId == this.stateHeaderId) {
            defectPayload.defectDetail = detail
            task!.payload = JSON.stringify(defectPayload)
            await db.pendingTask.update(Number(task.id!), task)
          }
        })
      }
    },
    async updateCrackFitterToLocalDB(defectDetail, payload, detail) {
      await this.updateOtherFitterValueToLocalDB(payload)
      // update defect at local,
      await updateDefectByDefectDetailId(this.stateDetailId, detail)
      const isCrackSync = await getDefectSyncStatus(this.stateDetailId)
      if (!isCrackSync) {
        await this.updateLocalDefectDetailOnTask(detail, "Defect")
      } else {
        // add task to send to be
        await db.pendingTask.add({
          module: 'serviceForm',
          section: 'E-Form',
          type: 'FitterUpdateDefect',
          workorder: this.eformStore.generalForm.workOrder,
          key: defectDetail.key,
          bindingKey: defectDetail.key,
          payload: JSON.stringify(payload),
          syncDate: AESTShortCurrentDateTime(),
          syncStatus: 'Pending'
        })
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
            propertyValue: AESTCurrentDateTime()
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
            propertyValue: AESTCurrentDateTime()
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
            propertyValue: AESTCurrentDateTime()
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
            propertyValue: AESTCurrentDateTime()
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
    updateHeaderCrack(headerId) {
      const header = this.ApprovalData.CrackHeaders.find((h) => {
        return h.id === headerId
      })
      this.stateHeaderStatus = !isUndefined(header!.plannerStatus) ? header!.plannerStatus : ""
    },
    async getReferencePhoto(id) {
      let url = ''
      try {
        const urlCreator = window.URL || window.webkitURL
        if (!isOfflineOrSlowInternetConnection()) {
          const blob = await getImageFromAPI(id)
          url = urlCreator.createObjectURL(blob)
          handleReplaceImageToLocalDB(id, this.eformStore.stateGeneralForm.workOrder, blob)
        } else {
          url = await getReferenceUrlFromLocalDB(id)
        }
        return url
      } catch (error) {
        console.log(error)
        return ""
      }
    },
    async setReferencePhoto(title: string, photoId) {
      this.stateReferencePhoto.title = title;
      this.stateReferencePhoto.blob = await this.getReferencePhoto(photoId)
      this.stateReferencePhoto.id = photoId;
    },
    getDefectDetail(headerId: string) {
      const found = this.ApprovalData.DefectDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      return found
    },
    getDefectHeader(headerId: string) {
      const found = this.ApprovalData.DefectHeaders.find((d) => {
        return d.id == headerId
      })
      return found
    },
    getDefectGenericDetail(headerId: string) {
      const found = this.ApprovalData.DefectGenericDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      return found
    },
    getCrackDetail(headerId: string) {
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.defectHeaderId == headerId
      })
      return found
    },
    setDefectDetailDownload(detail) {
      this.stateDefectDetailDownload = detail
    },
    setApprovalDefectDownload(approvedBy, approvedDate) {
      this.stateApprovalDefectDownload.approvedBy = approvedBy
      this.stateApprovalDefectDownload.approvedDate = approvedDate
    }
  }
})
