import { ReferenceStyle } from "./ReferenceStyle"

export type ReferenceItemDetail = {
  itemType: string,
  key: string,
  seqId?: string,
  style: ReferenceStyle,
  value: string
}

