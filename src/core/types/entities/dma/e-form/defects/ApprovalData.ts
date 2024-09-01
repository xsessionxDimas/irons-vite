import { Audit } from "@/core/types/intervention/Audit"

export type ApprovalData = {
    defectHeaderId?: string
    taskKey?: string
    approvedBy: Audit
    approvedDate: string
    status: string
    declineReason: string | undefined
    declineBy: Audit
    declineDate: string
    cbmNAStatus: string
}
