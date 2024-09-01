import ApiService from "@/core/services/ApiService"
import { ApiResponse } from "@/core/types/misc/ApiResponse"
import { AxiosRequestConfig, AxiosResponse } from "axios"
import { defineStore } from "pinia"
import { Header } from "@/core/types/entities/dma/defects/Header"
import DefectApprovalClass from "@/core/classes/DefectsApprovalClass"
import {
  GET_DEFECTS_DETAIL,
  GET_DEFECTS_HEADER,
  UPDATE_DEFECT_HEADER
} from "../../defects/urls"
import { Detail } from "@/core/types/entities/dma/defects/Detail"
import { useAttachmentStore } from "../../attachments/useAttachmentStore"
import DefectYesClass from "@/core/classes/DefectYesClass"
import CrackYesClass from "@/core/classes/CrackYesClass"
import { useCameraStore } from "@/store/pinia/application/useCameraStore"
import { ImageObject } from "@/core/types/entities/dma/ImageObject"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import {
  updateLoggedInStatusFromAPIResponse
} from "@/core/helpers/authentication-handler"
import DefectNoClass from "@/core/classes/DefectNoClass"
import CrackNoClass from "@/core/classes/CrackNoClass"
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useMaintenanceDefectListOnFormStore = defineStore({
  id: "MaintenanceDefectListOnForm",
  state: () => {
    return {
      stateData: new DefectApprovalClass(),
      stateLoading: false,
      stateHeaderId: "",
      stateDefectFormData: new DefectYesClass(),
      stateDefectNoFormData: new DefectNoClass(),
      stateCrackFormData: new CrackYesClass(),
      stateCrackSimpleFormData: new CrackNoClass(),
      stateHeaderStatus: "",
      stateDetailId: "",
      stateIsError: false,
    }
  },
  getters: {
    ApprovalData: (state) => {
      return state.stateData;
    },
    ImagesDefect: () => {
      const cameraStore = useCameraStore();
      return cameraStore.ImageObjects.find((p) => {
        return p.Id === "defect"
      }) as ImageObject;
    },
    ImagesCrack: () => {
      const cameraStore = useCameraStore();
      return cameraStore.ImageObjects.find((p) => {
        return p.Id === "crack"
      }) as ImageObject;
    },
    DefectFormData: (state) => {
      return state.stateDefectFormData;
    },
    CrackFormData: (state) => {
      return state.stateCrackFormData;
    },
    HeaderStatus: (state) => {
      return state.stateHeaderStatus;
    },
  },
  actions: {
    createRequestBody(workorder: string) {
      return {
        "workorder": workorder
      };
    },
    async getDefectsDataHeader(workorder: string) {
      const body = this.createRequestBody(workorder)
      const response: AxiosResponse<ApiResponse<Header>> = await ApiService.post(`${GET_DEFECTS_HEADER}`, body as AxiosRequestConfig);
      /* set the state */
      this.stateData.setHeaders(response.data.result.content);
    },
    async getDefectsDataDetail(workorder: string) {
      const body = this.createRequestBody(workorder);
      const response: AxiosResponse<ApiResponse<Detail>> = await ApiService.post(`${GET_DEFECTS_DETAIL}`, body as AxiosRequestConfig);
      /* set the state */
      this.stateData.setDetails(response.data.result.content);
    },
    async getDefectsData(workorder: string) {
      this.stateLoading = true;
      try {
        await this.getDefectsDataHeader(workorder);
        await this.getDefectsDataDetail(workorder);
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.error(error);
      }
      this.stateLoading = false;
    },
    setDefectData(headerId: string) {
      const attachmentStore = useAttachmentStore();
      const header = this.ApprovalData.DefectHeaders.find((h) => {
        return h.id === headerId;
      })
      const found = this.ApprovalData.DefectDetails.find((d) => {
        return d.defectHeaderId == headerId;
      });
      if (found) {
        this.setHeaderId(headerId);
        this.setDetailId(found.id);
        this.stateHeaderStatus = header?.status as string;
        if (found.detail.type != 'NO') {
          this.stateDefectFormData.setAssetNumber(found.detail.assetNumber);
          this.stateDefectFormData.setDescription(found.detail.description);
          this.stateDefectFormData.setRaisedBy(found.detail.raisedBy);
          this.stateDefectFormData.setDate(found.detail.date);
          this.stateDefectFormData.setPlannedDuration(found.detail.plannedDuration);
          this.stateDefectFormData.setInstruction(found.detail.instruction);
          this.stateDefectFormData.setPriority(found.detail.priority);
          this.stateDefectFormData.importParts(...JSON.parse(found.detail.parts));
          this.stateDefectFormData.importLabours(...JSON.parse(found.detail.labours));
          this.stateDefectFormData.importResources(...JSON.parse(found.detail.resources));
          this.stateDefectFormData.importSymptoms(...JSON.parse(found.detail.symptoms));
          this.stateDefectFormData.importCauses(...JSON.parse(found.detail.causes));
          this.ImagesDefect.ImageInfos.push(...JSON.parse(found.detail.images));
        } else {
          this.stateDefectNoFormData.setAssetNumber(found.detail.assetNumber);
          this.stateDefectNoFormData.setDescription(found.detail.description);
          this.stateDefectNoFormData.setRaisedBy(found.detail.raisedBy);
          this.stateDefectNoFormData.setDate(found.detail.date);
          this.stateDefectNoFormData.setTitle(found.detail.title);
          this.stateDefectNoFormData.importActions(...JSON.parse(found.detail.actions))
        }
        const promises = [] as Promise<Blob>[];
        this.ImagesDefect.ImageInfos.forEach((f: string | ImageInfo) => {
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
            this.ImagesDefect.ImageBlobs.push(blob)
          });
        });
        return found.detail.type
      }
    },
    setHeaderId(id: string) {
      this.stateHeaderId = id;
    },
    setDetailId(id: string) {
      this.stateDetailId = id;
    },
    async updateRepairedStatus(headerId: string) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.DefectHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
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
      };
      try {
        this.stateIsError = false;
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig);
        found.repairedStatus = "Repaired";
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
    },
    async updateDefectMO(headerId: string, mo: string) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.DefectHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
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
      };
      try {
        this.stateIsError = false;
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig);
        found.defectWorkorder = mo;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
    },
    async updateCrackRepairedStatus(headerId: string) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
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
      };
      try {
        this.stateIsError = false;
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig);
        found.repairedStatus = "Repaired";
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
    },
    setCrackData(headerId: string) {
      const attachmentStore = useAttachmentStore();
      const found = this.ApprovalData.CrackDetails.find((d) => {
        return d.defectHeaderId == headerId;
      });
      if (found) {
        this.setHeaderId(headerId);
        this.setDetailId(found.id);
        if (found.detail.type != 'NO') {
          this.stateCrackFormData.setAssetNumber(found.detail.assetNumber);
          this.stateCrackFormData.setDescription(found.detail.description);
          this.stateCrackFormData.setRaisedBy(found.detail.raisedBy);
          this.stateCrackFormData.setDate(found.detail.date);
          this.stateCrackFormData.setPlannedDuration(found.detail.plannedDuration);
          this.stateCrackFormData.setInstruction(found.detail.instruction);
          this.stateCrackFormData.setPriority(found.detail.priority);
          this.stateCrackFormData.importParts(...JSON.parse(found.detail.parts));
          this.stateCrackFormData.importLabours(...JSON.parse(found.detail.labours));
          this.stateCrackFormData.importResources(...JSON.parse(found.detail.resources));
          this.stateCrackFormData.importSymptoms(...JSON.parse(found.detail.symptoms));
          this.stateCrackFormData.importCauses(...JSON.parse(found.detail.causes));
          this.stateCrackFormData.importPreviousCrack(...JSON.parse(found.detail.previousCracks));
        } else {
          this.stateCrackSimpleFormData.setAssetNumber(found.detail.assetNumber);
          this.stateCrackSimpleFormData.setDescription(found.detail.description);
          this.stateCrackSimpleFormData.setRaisedBy(found.detail.raisedBy);
          this.stateCrackSimpleFormData.setDate(found.detail.date);
          this.stateCrackSimpleFormData.setInstruction(found.detail.instruction);
          this.stateCrackSimpleFormData.setTitle(found.detail.title);
          this.stateCrackSimpleFormData.setTitle(found.detail.title);
          this.stateCrackSimpleFormData.importPreviousCrack(...JSON.parse(found.detail.previousCracks));
        }
        this.ImagesCrack.ImageInfos.push(...JSON.parse(found.detail.images));
        const promises = [] as Promise<Blob>[];
        this.ImagesCrack.ImageInfos.forEach((f: string | ImageInfo) => {
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
            this.ImagesCrack.ImageBlobs.push(blob)
          });
        });
        return found.detail.type
      }
    },
    async updateCrackMO(headerId: string, mo: string) {
      const authStore = useAuthenticationStore();
      const found = this.ApprovalData.CrackHeaders.find((d) => {
        return d.id === headerId;
      }) as unknown as Header;
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
      };
      try {
        this.stateIsError = false;
        await ApiService.post(`${UPDATE_DEFECT_HEADER}`, payload as AxiosRequestConfig);
        found.defectWorkorder = mo;
      } catch (error) {
        updateLoggedInStatusFromAPIResponse(error)
        console.log(error);
        this.stateIsError = true;
        sendErrorEvent('IRONS', error);
      }
    },
    reset() {
      this.stateLoading = false;
      this.stateData = new DefectApprovalClass();
      this.stateDefectFormData = new DefectYesClass();
      this.stateCrackFormData = new CrackYesClass();
      this.stateIsError = false;
      this.stateHeaderId = "";
      this.stateDetailId = "";
    }
  }
})
