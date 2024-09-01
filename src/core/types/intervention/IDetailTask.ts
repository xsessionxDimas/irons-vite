import { DetailTaskItem } from './DetailTaskItem'
import { IStandartTask } from './IStandartTask'
import { DetailTaskAdjustmentItem } from './DetailTaskAdjustmentItem'
import { Reference } from './Reference'

export interface IDetailTask extends IStandartTask {
  seqId: number,
  updatedDate: string,
  groupTaskId: string,
  items: DetailTaskItem[],
  reference?: Reference,
  taskValue: string,
  taskNormalValue?: string,
  modelUnitId?: string,
  psType?: string,
  taskGroupKey?: string,
  interventionSequence?: string,
  subTask?: string,
  images?: string,
  adjustment?: DetailTaskAdjustmentItem,
  reason?: string
}
