import { Employee } from "../../e-form/defects/Employee"

export type DefectHeader = {
    workorder: string,
    form: string,
    serviceSheetDetailId: string,
    interventionHeaderId: string,
    interventionId: string,
    category: string,
    taskId: string,
    taskNo: string,
    taskDesc: string,
    defectWorkorder: string,
    formDefect: string,
    defectType: string,
    cbmMeasurement: string,
    cbmUom: string,
    cbmImageKey: string,
    cbmImageProp: string,
    isCbmAdjusment: string,
    taskValue: string,
    repairedStatus: string,
    cbmNAStatus: string,
    supervisor: Employee,
    status: string,
    defectStatus: string
}
