import { Item } from './Item'

export type Task = {
  key: string,
  seqId?: number,
  taskType: string,
  isActive: boolean,
  isDeleted: boolean,
  updatedBy: string,
  header: string,
  description: string,
  category?: string,
  rating?: string,
  items: Item[] | "<<LUBRICANT>>" | string,
  reason?: string,
  SectionData?: string,
  groupTaskId?: string,
  disabledByItemKey: string,
  triggerCaption?: string,
  taskValue?: string
}
