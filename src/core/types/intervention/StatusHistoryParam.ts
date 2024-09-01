import { Audit } from "./Audit"

export type StatusHistoryParam = {
    updatedBy: Audit
    updatedDate: string,
    tsUpdatedDate: number,
    status: string
}
