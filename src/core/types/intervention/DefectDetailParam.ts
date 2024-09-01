import { Audit } from "./Audit";

export type DefectDetailParam = {
    type: string,
    taskId: string,
    taskNo: string,
    taskDesc: string,
    taskStatus?: string,
    taskDeclineReason?: string,
    taskDeclineBy?: Audit,
    taskDeclineDate?: string,
    taskApprovedBy?: Audit,
    taskApprovedDate?: string,
    defectHeaderId?: string
}
