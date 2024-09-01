import { Task } from "../../e-form/Task"

export type CBMInfoDetail = {
    workOrder: string
    equipment: string
    siteId: string
    taskKey: string
    headerId: string
    form: string
    serviceSheetDetailId: string
    currentCondition: currentCondition
    detailSpec: string
    detailedPicture: string[]
    historyModified:historyModified[] | historyModified
    historyModifiedDefault: Task[]
}

type currentCondition = {
    taskKey: string
    category: string
    rating: string
    updatedBy: string
    updatedDate: string
    taskNo: string
    measurementLocation: string
    measurementValue: string
    uom: string
}

type detail = {
    category: string
    history: Task[] | TaskGroupHistory
    rating: string
}

type TaskGroupHistory = {
    taskGroup: Task[]
}
        
type historyModified =  {
    workOrder: string
    equipment: string
    siteId: string
    taskKey: string
    serviceSheetDetailId: string
    defectHeaderId: string
    detail: detail
}