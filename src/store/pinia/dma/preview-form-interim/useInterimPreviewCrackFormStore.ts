import CrackNoClass from "@/core/classes/CrackNoClass"
import CrackYesClass from "@/core/classes/CrackYesClass"
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
import { GET_DEFECT_DETAIL } from "../interim-engine-service/cracks/urls"
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo"
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useInterimPreviewCrackFormStore = defineStore({
  id: "InterimcrackPreview",
  state: () => {
    return {
      stateLoading: false,
      stateViewYesVisible: false,
      stateViewtNoVisible: false,
      stateIsYes: undefined as boolean | undefined,
      stateCrackInfo: {} as CrackYesClass | CrackNoClass,
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
        return p.Id === "crack"
      }) as ImageObject;
    },
    crackInfo: (state) => {
      return state.stateCrackInfo;
    },
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
    async getCrackDetail(sheetId: string, taskId: string) {
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
        camStore.setCurrent("crack");
        camStore.clearCurrent();
        if (detail.type === "YES") {
          this.stateIsYes = true;
          /* set details in defect info */
          const copy = new CrackYesClass();
          copy.setAssetNumber(detail.assetNumber);
          copy.setDescription(detail.description);
          copy.setPriority(detail.priority);
          copy.setRaisedBy(detail.raisedBy);
          copy.setDate(detail.date);
          copy.setPlannedDuration(detail.plannedDuration);
          copy.setInstruction(detail.instruction);
          copy.setTitle(detail.title);
          copy.importParts(...JSON.parse(detail.parts));
          copy.importLabours(...JSON.parse(detail.labours));
          copy.importResources(...JSON.parse(detail.resources));
          copy.importSymptoms(...JSON.parse(detail.symptoms));
          copy.importCauses(...JSON.parse(detail.causes));
          copy.importPreviousCrack(...JSON.parse(detail.previousCracks));
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
            this.stateCrackInfo = copy;
            this.toggleViewYesVisible(true);
          });
        } else {
          this.stateIsYes = false;
          this.stateCrackInfo = new CrackNoClass();
          this.stateCrackInfo.setAssetNumber(detail.assetNumber);
          this.stateCrackInfo.setDescription(detail.description);
          this.stateCrackInfo.setRaisedBy(detail.raisedBy);
          this.stateCrackInfo.setDate(detail.date);
          this.stateCrackInfo.setInstruction(detail.instruction);
          this.stateCrackInfo.setTitle(detail.title);
          this.stateCrackInfo.importPreviousCrack(...JSON.parse(detail.previousCracks));
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
    resetInstance() {
      this.stateLoading = false;
      this.stateCrackInfo = {} as CrackYesClass | CrackNoClass;
      this.stateViewYesVisible = false;
      this.stateViewtNoVisible = false;
      this.stateIsYes = undefined;
    }
  }
})
