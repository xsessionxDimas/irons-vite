import { Employee } from "./Employee"

export type CrackHeader = {
    workorder: string,
    form: string,
    serviceSheetDetailId: string,
    category: string,
    taskId: string,
    taskNo: string,
    taskDesc: string,
    crackWorkorder: string,
    formCrack: string,
    crackType: string,
    taskValue: string,
    repairedStatus: string,
    cbmNAStatus: string,
    supervisor: Employee,
    status: string,
    defectStatus: string,
    isActive?: string,
    defectHeaderId?: string,
    defectDetailId?: string,
    pic?: string,
    role?: string,
    declineReason?: string,
    approveReason?: string,
    action?: string
}
