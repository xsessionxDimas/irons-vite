import { Audit } from "@/core/types/intervention/Audit";

export type Detail = {
    id: string,
    key: string,
    defectHeaderId: string,
    detail: any,
    createdBy: Audit,
    createdDate: string,
    updatedBy: Audit,
    updatedDate: string,
    otherFitterUpdatedBy?: Audit
}

export type DetailHistory = {
    id: string,
    defectHeaderId: string,
    detail: any,
    createdDate: string
}
