import { ImageInfo } from "../../ImageInfo";
import { Item } from "../Item";
import { Task } from "../Task";
import { ServicePersonnel } from "./ServicePersonnel";
import { StatusHistory } from "@/core/types/intervention/StatusHistory";

export type General = {
  id: string,
  key: string,
  groupName: string,
  modelId: string,
  psTypeId: string,
  workOrder: string,
  smu: string,
  equipment: string,
  serviceStart: string,
  serviceEnd: string,
  form: string,
  version: string,
  supervisor: {
    id: string,
    name: string
  },
  servicePersonnels: ServicePersonnel[],
  safetyPrecaution: Task[],
  checkBeforeTruck: Task,
  status: string,
  defectStatus: string,
  isActive: boolean,
  isDeleted: boolean,
  createdBy: {
    id: string,
    name: string
  },
  createdDate: string,
  updatedBy: {
    id: string,
    name: string
  },
  updatedDate: string,
  riskAssesment: Item[]
  _rid: string,
  _self: string,
  _etag: string,
  _attachments: string,
  _ts: number,
  tsServiceStart: string,
  tsServiceEnd: string,
  imageEquipment: string | string[] | ImageInfo[],
  log: FitterLog[],
  serialNumber?: string
  formTitle?: any,
  hmOffset?: number | string,
  travelHour?: number | string,
  swingHour?: number | string,
  swingHourImages?: string | string[] | ImageInfo[],
  travelHourImages?: string | string[] | ImageInfo[],
  isSwingTravelRequired?: string,
  statusCalibration?: string,
  releasedDate?: string,
  isApprovedSmu: boolean,
  smuBy?: {
    id: string,
    name: string
  },
  smuDate?: string,
  statusHistory: StatusHistory[],
  isTravelMandatoryTakePhoto?: string,
  isSwingMandatoryTakePhoto?: string,
  isTravelRequired?: string,
  isSwingRequired?: string,
}

export type FitterLog = {
  id: string
  employee: {
    id: string,
    name: string
  },
  riskPhotos: string[] | ImageInfo[],
  timeLoggedIn: string, // >"submit general"
  shift: string,
  isIHaveReadChecked: boolean,
}
