import { Audit } from "@/core/types/intervention/Audit"

export type Detail = {
    id: string,
    key: string,
    defectHeaderId: string,
    detail: any
    workorder: string
    servicesheetDetailId: string,
    interventionId: string,
    taskId: string,
    otherFitterUpdatedBy?: Audit
    updatedDate?: string
}
