import { Audit } from "./Audit"
import { IDetailTask } from "./IDetailTask"

export type TaskUpdateObject = {
    itemKey: string,
    taskCategory: string,
    type: string,
    value: string,
    taskKey?: string,
    headerId?: string,
    model?: string,
    psType: string,
    cbmMeasurement?: string,
    uomValue?: string,
    id?: string,
    workOrder?: string,
    timeStamp: string
    employee: Audit,
    supervisor: Audit,
    task: IDetailTask,
    reason?: string,
    defectType?: string,
    correctedValue?: string,
    correctedMeasurement?: string,
    correctedUom?: string,
    isOutOfRange?: boolean
}
