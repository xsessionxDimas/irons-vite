import { IBasicTask } from './IBasicTask'
import { Style } from './Style'
import {
  RiskAssesmentValue
} from '@/core/types/intervention/RiskAssesmentValue'

export interface IRiskAssesmentTask extends IBasicTask {
    key: string,
    taskType: string,
    caption: string,
    itemValue: string,
    value: string | RiskAssesmentValue[],
    valueType: string,
    style: Style | undefined
}
