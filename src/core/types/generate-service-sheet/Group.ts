import { Model } from "./Model"
import { SubGroup } from "./SubGroup"

export type Group = {
  version: "1.0.0",
  modelId: string,
  psTypeId: keyof Model,
  workOrder: string,
  groupName: string,
  groupSeq: number,
  key: string,
  subGroup: SubGroup[]
}
