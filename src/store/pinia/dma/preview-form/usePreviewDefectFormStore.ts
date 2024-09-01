import DefectNoClass from "@/core/classes/DefectNoClass"
import DefectYesClass from "@/core/classes/DefectYesClass"
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler"
import ApiService from "@/core/services/ApiService"
import { ImageObject } from "@/core/types/entities/dma/ImageObject"
import { SingleApiResponse } from "@/core/types/misc/SingleApiResponse"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { defineStore } from "pinia"
import { useCameraStore } from "../../application/useCameraStore"
import { useAttachmentStore } from "../e-form/attachments/useAttachmentStore"
import {
  GET_DEFECTS_HEADER,
  GET_DEFECT_DETAIL,
  UPDATE_DEFECT_DETAIL,
  UPDATE_DEFECT_HEADER
} from "../e-form/defects/urls"
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo"
import {
  ApprovalData
} from "@/core/types/entities/dma/e-form/defects/ApprovalData"
import { ApiResponse } from "@/core/types/misc/ApiResponse"
import { Header } from "@/core/types/entities/dma/defects/Header"
import { findIndexAndObject } from "../e-form/helpers"
import {
  useDefectsStore
} from '@/store/pinia/dma/e-form/defects/useDefectsStore';
import {
  DefectSMU,
  passingParameterCreateSMU
} from "@/core/types/entities/dma/defects/DefectSMU"
import {
  useDefectsFormStore as useOfflineDefectsFormStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsFormStore";
import {
  useAuthenticationStore
} from "../../application/useAuthenticationStore"
import { MachineSMUEnum } from "@/store/enums/MachineSMUEnum"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const usePreviewDefectFormStore = defineStore({
  id: "defectPreview",
  state: () => {
    return {
      stateLoading: false,
      stateViewYesVisible: false,
      stateViewtNoVisible: false,
      stateDefectInfo: {} as DefectYesClass | DefectNoClass,
      stateIsYes: undefined as boolean | undefined,
      stateApprovalDefectList: [] as ApprovalData[],
      stateSelectedApprovalDefect: {} as ApprovalData,
      stateHasDefectSMU: false
    }
  },
  getters: {
    ViewYesVisible: (state) => {
      return state.stateViewYesVisible;
    },
    ViewNoVisible: (state) => {
      return state.stateViewtNoVisible;
    },
    images: () => {
      const cameraStore = useCameraStore();
      return cameraStore.ImageObjects.find((p) => {
        return p.Id === "defect"
      }) as ImageObject;
    },
    defectInfo: (state) => {
      return state.stateDefectInfo;
    },
    ApprovalDefect: (state) => {
      return state.stateSelectedApprovalDefect
    },
    HasDefectSMU: (state) => {
      return state.stateHasDefectSMU
    }
  },
  actions: {
    toggleViewYesVisible(value:boolean) {
      this.stateViewYesVisible = value;
      this.stateViewtNoVisible = false;
    },
    toggleViewNoVisible(value:boolean) {
      this.stateViewtNoVisible = value;
      this.stateViewYesVisible = false;
    },
    async getDefectDetail(sheetId: string, taskId: string) {
      this.stateLoading = true;
      const params = {
        ver: "v1"
      };
      const payload = {
        servicesheetDetailId: sheetId,
        taskId: taskId
      };
      try {
        const response: AxiosResponse<SingleApiResponse<any>> = await ApiService.post(`${GET_DEFECT_DETAIL}?${new URLSearchParams(params).toString()}`,
        payload as AxiosRequestConfig);
        const detail = response.data.result.content.detail;
        const camStore = useCameraStore();
        const attachmentStore = useAttachmentStore();
        camStore.setCurrent("defect");
        camStore.clearCurrent();
        if (detail.type === "YES") {
          this.stateIsYes = true;
          /* set details in defect info */
          this.stateDefectInfo = new DefectYesClass();
          this.stateDefectInfo.setAssetNumber(detail.assetNumber);
          this.stateDefectInfo.setDescription(detail.description);
          this.stateDefectInfo.setPriority(detail.priority);
          this.stateDefectInfo.setRaisedBy(detail.raisedBy);
          this.stateDefectInfo.setDate(detail.date);
          this.stateDefectInfo.setPlannedDuration(detail.plannedDuration);
          this.stateDefectInfo.setInstruction(detail.instruction);
          this.stateDefectInfo.setTitle(detail.title);
          this.stateDefectInfo.importParts(...JSON.parse(detail.parts));
          this.stateDefectInfo.importLabours(...JSON.parse(detail.labours));
          this.stateDefectInfo.importResources(...JSON.parse(detail.resources));
          this.stateDefectInfo.importSymptoms(...JSON.parse(detail.symptoms));
          this.stateDefectInfo.importCauses(...JSON.parse(detail.causes));
          this.images.ImageInfos.push(...JSON.parse(detail.images));
          const promises = [] as Promise<Blob>[];
          this.images.ImageInfos.forEach((f: string | ImageInfo) => {
            let filename = ''
            if (typeof f == 'string') {
              filename = f
            } else {
              filename = f.filename
            }
            promises.push(attachmentStore.downloadAttachment(filename) as Promise<Blob>);
          });
          Promise.all(promises).then((blobs) => {
            blobs.forEach((b) => {
              const blob = new Blob([b], { type: 'image/png' });
              this.images.ImageBlobs.push(blob)
            });
            this.toggleViewYesVisible(true);
          });
        } else {
          this.stateIsYes = false;
          this.stateDefectInfo = new DefectNoClass();
          this.stateDefectInfo.setAssetNumber(detail.assetNumber);
          this.stateDefectInfo.setDescription(detail.description);
          this.stateDefectInfo.setRaisedBy(detail.raisedBy);
          this.stateDefectInfo.setPriority(detail.priority);
          this.stateDefectInfo.setDate(detail.date);
          this.stateDefectInfo.setTitle(detail.title);
          this.stateDefectInfo.importActions(...JSON.parse(detail.actions));
          this.images.ImageInfos.push(...JSON.parse(detail.images));
          const promises = [] as Promise<Blob>[];
          this.images.ImageInfos.forEach((f: string | ImageInfo) => {
            let filename = ''
            if (typeof f == 'string') {
              filename = f
            } else {
              filename = f.filename
            }
            promises.push(attachmentStore.downloadAttachment(filename) as Promise<Blob>);
          });
          Promise.all(promises).then((blobs) => {
            blobs.forEach((b) => {
              const blob = new Blob([b], { type: 'image/png' });
              this.images.ImageBlobs.push(blob)
            });
            this.toggleViewNoVisible(true);
          });
        }
        this.stateLoading = false;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        this.stateLoading = false;
        sendErrorEvent('IRONS', error);
      }
    },
    async setDefectDetail(detail) {
      this.stateLoading = true;
      try {
        const camStore = useCameraStore();
        const attachmentStore = useAttachmentStore();
        camStore.setCurrent("defect");
        camStore.clearCurrent();
        if (detail.type === "YES") {
          this.stateIsYes = true;
          /* set details in defect info */
          this.stateDefectInfo = new DefectYesClass();
          this.stateDefectInfo.setAssetNumber(detail.assetNumber);
          this.stateDefectInfo.setDescription(detail.description);
          this.stateDefectInfo.setPriority(detail.priority);
          this.stateDefectInfo.setRaisedBy(detail.raisedBy);
          this.stateDefectInfo.setDate(detail.date);
          this.stateDefectInfo.setPlannedDuration(detail.plannedDuration);
          this.stateDefectInfo.setInstruction(detail.instruction);
          this.stateDefectInfo.setTitle(detail.title);
          this.stateDefectInfo.importParts(...JSON.parse(detail.parts));
          this.stateDefectInfo.importLabours(...JSON.parse(detail.labours));
          this.stateDefectInfo.importResources(...JSON.parse(detail.resources));
          this.stateDefectInfo.importSymptoms(...JSON.parse(detail.symptoms));
          this.stateDefectInfo.importCauses(...JSON.parse(detail.causes));
          this.images.ImageInfos.push(...JSON.parse(detail.images));
          const promises = [] as Promise<Blob>[];
          this.images.ImageInfos.forEach((f: string | ImageInfo) => {
            let filename = ''
            if (typeof f == 'string') {
              filename = f
            } else {
              filename = f.filename
            }
            promises.push(attachmentStore.downloadAttachment(filename) as Promise<Blob>);
          });
          Promise.all(promises).then((blobs) => {
            blobs.forEach((b) => {
              const blob = new Blob([b], { type: 'image/png' });
              this.images.ImageBlobs.push(blob)
            });
            this.toggleViewYesVisible(true);
          });
        } else {
          this.stateIsYes = false;
          this.stateDefectInfo = new DefectNoClass();
          this.stateDefectInfo.setAssetNumber(detail.assetNumber);
          this.stateDefectInfo.setDescription(detail.description);
          this.stateDefectInfo.setPriority(detail.priority);
          this.stateDefectInfo.setRaisedBy(detail.raisedBy);
          this.stateDefectInfo.setDate(detail.date);
          this.stateDefectInfo.setTitle(detail.title);
          this.stateDefectInfo.importActions(...JSON.parse(detail.actions));
          this.images.ImageInfos.push(...JSON.parse(detail.images));
          const promises = [] as Promise<Blob>[];
          this.images.ImageInfos.forEach((f: string | ImageInfo) => {
            let filename = ''
            if (typeof f == 'string') {
              filename = f
            } else {
              filename = f.filename
            }
            promises.push(attachmentStore.downloadAttachment(filename) as Promise<Blob>);
          });
          Promise.all(promises).then((blobs) => {
            blobs.forEach((b) => {
              const blob = new Blob([b], { type: 'image/png' });
              this.images.ImageBlobs.push(blob)
            });
            this.toggleViewNoVisible(true);
          });
        }
        this.stateLoading = false;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        this.stateLoading = false;
      }
    },
    async getApprovalDefect(params: {workorder?: string, id?: string, taskId?: string}): Promise<ApprovalData | null> {
      // check list first
      const { id, taskId } = params
      let foundObject :{ index: number, object: ApprovalData } | null = null
      if (this.stateApprovalDefectList.length != 0) {
        foundObject = findIndexAndObject(this.stateApprovalDefectList, (obj) => {
          // only with multidefect search with defect header id
          if (id) {
            return obj.defectHeaderId == id
          }
          // for crack data
          if (taskId) {
            return obj.taskKey == taskId
          }
          return false
        })
        // if found return object and have been acknowledge/decline cbmNAStatus confirmed/decline (approvalDate n approvalBy can be empty)
        if (foundObject && (foundObject.object.status == 'Acknowledge' || foundObject.object.status == 'Decline' || foundObject.object.cbmNAStatus == 'Confirmed' || foundObject.object.cbmNAStatus == 'Decline')) {
          return foundObject.object
        }
      }
      // if not in list/empty data, get from server
      const result = await this.getDefectsDataHeaderPerDefect(params)
      if (result) {
        const newDataApproval = {
          defectHeaderId: result.id,
          taskKey: result.taskId,
          approvedBy: result.approvedBy,
          approvedDate: result.approvedDate,
          status: result.status,
          cbmNAStatus: result.cbmNAStatus,
          declineReason: result.declineReason,
          declineBy: result.declineBy,
          declineDate: result.declineDate,
        }
        if (!foundObject) {
          // not found
          this.stateApprovalDefectList.push(newDataApproval)
        } else if (foundObject.index >= 0) {
          // found but no data approval
          this.stateApprovalDefectList[foundObject.index] = newDataApproval
        }
        return newDataApproval
      }
      return null
    },
    async getDefectsDataHeaderPerDefect(params) {
      const body = params
      try {
        const response: AxiosResponse<ApiResponse<Header>> = await ApiService.post(`${GET_DEFECTS_HEADER}`, body as AxiosRequestConfig)
        if (response.data.result.content && response.data.result.content[0]) {
          return response.data.result.content[0]
        }
        return null
      } catch (error) {
        sendErrorEvent('IRONS', error);
        // error
      }
    },
    setApprovalData(data: ApprovalData) {
      this.stateSelectedApprovalDefect = data
    },
    // update defect
    async updateSMUDefect(updatedDetail : passingParameterCreateSMU) {
      const store = useDefectsStore();
      const defectOfflineStore = useOfflineDefectsFormStore();
      store.setDetailId(store.DefectSMUHeader.id)
      const detail = store.DefectSMUDetailDetail

      if (detail) {
        await this.updateDefectDetailSMU(updatedDetail, true)
        await this.updateDefectHeaderSMU(updatedDetail, true)
      } else {
        await defectOfflineStore.createSMUDefect(updatedDetail)
      }
    },
    async updateDefectHeaderSMU(data: passingParameterCreateSMU, isEdit = false) {
      const authStore = useAuthenticationStore()
      const store = useDefectsStore();

      const header = store.DefectSMUHeader

      let status = MachineSMUEnum.STATUS_NOT_IN_RANGE
      if (data.isInRange) {
        status = MachineSMUEnum.STATUS_IN_RANGE
      }
      const payload = {
        id: header.id,
        updateParams: [{
          keyValue: header.key,
          propertyParams: [{
            propertyName: "taskDesc",
            propertyValue: MachineSMUEnum.TITLE(status)
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
        userGroup: authStore.user.Position
      }

      if (isEdit) {
        payload["isEdit"] = "true"
      }
      try {
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig)
      } catch (error: any) {
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    async updateDefectDetailSMU(data: passingParameterCreateSMU, isEdit = false) {
      const authStore = useAuthenticationStore()
      const store = useDefectsStore();

      const detail = store.DefectSMUDetailDetail

      let status = MachineSMUEnum.STATUS_NOT_IN_RANGE
      if (data.isInRange) {
        status = MachineSMUEnum.STATUS_IN_RANGE
      }

      const updatedDetail = {
        ...detail?.detail,
        title: MachineSMUEnum.TITLE(status),
        machineSMU: data.val,
        images: data.generalData?.imageEquipment
      } as DefectSMU

      const payload = {
        id: detail?.id,
        updateParams: [{
          keyValue: detail?.id,
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
        userGroup: authStore.user.Position
      }
      if (isEdit) {
        payload["isEdit"] = "true"
      }
      try {
        await ApiService.post(`${UPDATE_DEFECT_DETAIL}`, payload as AxiosRequestConfig)
      } catch (error: any) {
        updateLoggedInStatusFromAPIResponse(error)
        sendErrorEvent('IRONS', error);
        console.log(error)
      }
    },
    resetList() {
      this.stateApprovalDefectList = []
      this.stateSelectedApprovalDefect = {} as ApprovalData
    },
    resetInstance() {
      this.stateLoading = false;
      this.stateIsYes = undefined as boolean | undefined;
      this.stateViewYesVisible = false;
      this.stateViewtNoVisible = false;
      this.stateDefectInfo = {} as DefectYesClass | DefectNoClass;
    },
  }
})
