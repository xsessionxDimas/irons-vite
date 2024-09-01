import { TaskUpdateObject } from "./TaskUpdateObject"

export type DefectNoFormData = {
    type: string,
    assetNumber: string,
    description: string,
    raisedBy: string,
    date: string,
    actions: string[],
    images: string[],
    taskNo: string,
    taskDesc: string
    task: TaskUpdateObject,
    submitDate: string
    reason?: string,
    idGenerated?: string
}
