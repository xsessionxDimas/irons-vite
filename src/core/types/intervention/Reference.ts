import { ReferenceItem } from './ReferenceItem'
import { ReferenceItemDetail } from './ReferenceItemDetail'
import { ReferenceStyle } from './ReferenceStyle'

export type Reference = {
  category: string,
  description: string,
  groupTaskId: string,
  header: string,
  isActive: boolean,
  isDeleted: boolean,
  items: ReferenceItem[] | ReferenceItemDetail[],
  key: string,
  rating: string,
  seqId: string,
  style: ReferenceStyle,
  taskType: string,
  triggerCaption: string,
  updatedBy: string,
  updatedDate: string
}
