import { SubGroup } from "./subGroup"

export type Group = {
  id: string,
  modelId: string,
  psTypeId: string,
  workOrder: string,
  groupName: string,
  groupSeq: number,
  key: string,
  headerId: string,
  isActive: string,
  isDeleted: string,
  createdBy: {
    id: string,
    name: string
  },
  createdDate: string,
  updatedBy: string,
  updatedDate: string,
  _rid: string,
  _self: string,
  _etag: string,
  _attachments: string,
  _ts: number,
  subGroup: SubGroup[]
  isSelected: boolean,
  groupLabel: string,
  totalTask: number,
  transactionCalibration?: any,
  doneTask: number,
  version?: undefined | any
  isDisable?: string
}

export const GroupKeyEnum = {
  MECHANICAL_SERVICE: "MECHANICAL_SERVICE",
  PRE_SERVICE_OPERATIONAL_CHECK: "PRE_SERVICE_OPERATIONAL_CHECK",
}

