import { Employee } from "../../e-form/defects/Employee"

export type Header = {
    id: string
    workorder: string
    form: string
    serviceSheetDetailId: string
    interventionId: string
    interventionHeaderId: string
    category: string
    taskId: string
    taskNo: string
    taskDesc: string
    priorityType: string
    defectWorkorder: string
    formDefect: string
    defectType: string
    taskValue: string
    repairedStatus: string
    cbmNAStatus: string
    cbmMeasurement: string
    cbmUom: string
    cbmImageKey: string
    cbmImageProp: string
    isCbmAdjusment: string
    supervisor: Employee
    status: string
    statusHistory: string
    key: string,
    defectStatus: string
}
