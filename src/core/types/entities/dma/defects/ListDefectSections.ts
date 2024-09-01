import { Header, HeaderHistory } from "./Header"
import { Detail, DetailHistory } from "./Detail"
import { Comment } from "./Comment"
import { Audit } from "@/core/types/intervention/Audit"

export type ListDefectSections = {
    version: string
    defectHeader: Header[],
    defectDetail: Detail[],
    defectDetailHistory: DetailHistory[],
    comment: Comment[],
    approveBy?: Audit,
    approveDate?: string
}

export type WrapperListDefectSections = {
    content: {
        version: string
        defectHeader: Header[],
        defectDetail: Detail[],
        defectHeaderHistory: HeaderHistory[],
        defectDetailHistory: DetailHistory[],
        comment: Comment[],
        approveBy?: Audit,
        approveDate?: string,
        approvedBy?: Audit,
        approvedDate?: string
    }
}

