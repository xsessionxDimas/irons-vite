import { IBasicItem } from './IBasicItem'

export interface ISafetyPrecautionTaskItem extends IBasicItem {
    caption: string | undefined,
    taskType?: string,
    valueType: string | undefined
}
