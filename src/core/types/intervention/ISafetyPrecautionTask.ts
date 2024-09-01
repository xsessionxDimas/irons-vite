import { ISafetyPrecautionTaskItem } from './ISafetyPrecautionTaskItem';
import { IStandartTask } from './IStandartTask';

export interface ISafetyPrecautionTask extends IStandartTask {
    items: ISafetyPrecautionTaskItem[]
}
