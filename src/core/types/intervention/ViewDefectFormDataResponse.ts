import { Audit } from './Audit'

export type ViewDefectFormDataResponse = {
    id: string,
    key: string,
    workorder: string,
    defectHeaderId: string,
    servicesheetDetailId: string,
    interventionId: string,
    interventionHeaderId: string,
    taskId: string,
    isActive: string,
    isDeleted: string,
    createdBy: Audit,
    createdDate: string,
    updatedBy: string | Audit,
    updatedDate: string,
    _rid: string,
    _self: string,
    _etag: string,
    _attachments: string,
    _ts: number
}
