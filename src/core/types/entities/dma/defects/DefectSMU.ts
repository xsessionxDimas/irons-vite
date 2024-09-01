import { Audit } from "@/core/types/intervention/Audit";
import { Approve } from "@/core/types/intervention/Decline";

export type DefectSMU = {
  title: string,
  machineSMU: string,
  machineSMURange?: string,
  minRange?: number,
  maxRange?: number,
  smuDue: string,
  assetNumber: string,
  serialNumber: string,
  images: string,
  hmOffset: string,
  key: string,
  type: string,
  reason: string,
}


export type submitDetailParameter = {
  newDetail : DefectSMU,
  callback: () => void;
}

export type plannerDataSMU = {
  plannerStatus?: string,
  updatedBy: Audit,
  updatedDate: string,
}

export type ApproveSMU = Approve & {
  status: string
}

export type GeneralData = {
  id: string
  workOrder: string
  form: string
  smuDue: string
  equipment: string
  serialNumber: string
  imageEquipment: string,
  localStatus: string
}

// General Data for updating on monitoring page
export type passingParameterUpdateSMU = {
  smu: string,
  hmOffset: string,
  smuDate: string,
  smuBy: Audit,
  generalData?: GeneralData
}

export type passingParameterCreateSMU = {
  val: string,
  hmOffset: string,
  range: {
    MinRange: number,
    MaxRange: number,
  },
  smuDate: string,
  isInRange: boolean,
  employee?: Audit,
  generalData?: GeneralData
}
