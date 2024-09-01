import { Audit } from './Audit'

export interface DetailTaskAdjustmentItem {
    key: string,
    description: string,
    measurement: string,
    rating: string,
    uom: string,
    pictures: string[],
    createdBy: Audit | string,
    createdDate: string,
    updatedBy: Audit | string,
    updatedDate: string,
    commentLabel?: string,
    commentPlaceHolder?: string,
    commentValue?: string
}
