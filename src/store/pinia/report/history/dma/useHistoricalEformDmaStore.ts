import { defineStore } from "pinia";
import {
  ImageItem
} from "@/core/types/entities/report/history/historical-eform-dma/ImageItem";
import ApiService from "@/core/services/ApiService";
import { AxiosResponse } from "axios";
import {
  ApprovalData
} from "@/core/types/entities/dma/e-form/defects/ApprovalData";
import {
  CrackYesDetail,
  DefectYesDetail,
  ReferencePhoto
} from "@/core/types/entities/dma/e-form/defects/DefectCrackYesDetail";
import { sendErrorEvent } from "@/core/helpers/analytics";

export const useHistoricalEformDmaStore = defineStore({
  id: "historicalEformDma",
  state: () => {
    return {
      stateImageList: [] as ImageItem[],
      statePreRiskImage: [] as ImageItem[],
      stateIsAttachmentIncludeDownload: false,
      stateApprovalDefectDownload: {} as Pick<ApprovalData, 'approvedBy' | 'approvedDate'>,
      stateDefectDetailDownload: {} as CrackYesDetail | DefectYesDetail,
      stateOwnerShip: "",
      stateSerialNumber: "",
      stateReferencePhoto: {} as ReferencePhoto,
      stateIsIntervention: false,
      stateFileName: "",
      stateTimeStamp: "",
      stateIsDownloadPDF: false
    };
  },
  getters: {
    imageList: (state) => {
      return state.stateImageList
    },
    preRiskImageList: (state) => {
      return state.statePreRiskImage
    },
    DefectDetailDownload: (state) => {
      return state.stateDefectDetailDownload
    },
    IsAttachmentIncludeDownload: (state) => {
      return state.stateIsAttachmentIncludeDownload
    },
    ApprovalDefectDownload: (state) => {
      return state.stateApprovalDefectDownload
    },
    OwnerShip: (state) => {
      return state.stateOwnerShip
    },
    SerialNumber: (state) => {
      return state.stateSerialNumber
    },
    ReferencePhoto: (state) => {
      return state.stateReferencePhoto
    },
    IsIntervention: (state) => {
      return state.stateIsIntervention
    },
    FileName: (state) => {
      return state.stateFileName
    },
    TimeStamp: (state) => {
      return state.stateTimeStamp
    },
    IsDownloadPDF: (state) => {
      return state.stateIsDownloadPDF
    }
  },
  actions: {
    setImageList(param: ImageItem) {
      this.stateImageList.push(param)
    },
    setImageListPreRisk(param: ImageItem) {
      this.statePreRiskImage.push(param)
    },
    setIsIntervention(isIntervention: boolean) {
      this.stateIsIntervention = isIntervention
    },
    setFileName(filename: string) {
      this.stateFileName = filename
    },
    setTimeStamp(timestamp: string) {
      this.stateTimeStamp = timestamp
    },
    setIsDownloadPDF(param: boolean) {
      this.stateIsDownloadPDF = param
    },
    resetImageList() {
      this.stateImageList = []
      this.statePreRiskImage = []
    },
    async loadImage(filename) {
      const params = {
        fileUrl: `${filename}`,
        ver: 'v1',
      }
      try {
        const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/dinspect/api/attachment/download_by_url`;
        await ApiService.getBlob(GET_IMAGE_API_URL, "", new URLSearchParams(params).toString())
        const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL, "", new URLSearchParams(params).toString())
        const buffer = response.data;
        const blob = new Blob([buffer]);
        const urlCreator = window.URL || window.webkitURL
        const bmp = await createImageBitmap(blob);
        return {
          id: filename,
          buffer: urlCreator.createObjectURL(blob),
          dimension: {
            height: bmp.height,
            width: bmp.width
          }
        }
      } catch (e) {
        sendErrorEvent('IRONS', e);
        console.log(e);
        return null
      }
    },
    setDefectDetailDownload(detail: CrackYesDetail | DefectYesDetail) {
      this.stateDefectDetailDownload = detail
    },
    setApprovalDefectDownload(approvalData: Pick<ApprovalData, 'approvedBy' | 'approvedDate'>) {
      this.stateApprovalDefectDownload = approvalData
    },
    setIsAttachmentIncludeDownload(included: boolean) {
      this.stateIsAttachmentIncludeDownload = included
    },
    setReferencePhoto(params: ReferencePhoto) {
      this.stateReferencePhoto = params
    },
    setOwnerShip(OwnerShip: string) {
      this.stateOwnerShip = OwnerShip
    },
    setSerialNumber(SerialNumber: string) {
      this.stateSerialNumber = SerialNumber
    },
    resetAfterDownload() {
      this.stateIsAttachmentIncludeDownload = false
      this.stateApprovalDefectDownload = {} as Pick<ApprovalData, 'approvedBy' | 'approvedDate'>
      this.stateDefectDetailDownload = {} as CrackYesDetail | DefectYesDetail
      this.stateOwnerShip = ""
      this.stateSerialNumber = ""
      this.stateReferencePhoto = {} as ReferencePhoto
      this.stateIsIntervention = false
      this.stateFileName = ""
      this.stateTimeStamp = ""
      this.stateIsDownloadPDF = false
    }
  },
});
