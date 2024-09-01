import { Audit } from "@/core/types/intervention/Audit";

export type Comment = {
    taskKey: string,
    taskDesc: string,
    taskComment: string,
    workOrder: string,
    createdBy: Audit | null,
    createdDate: string | null,
    updatedBy: Audit | null,
    updatedDate: string | null,
}
