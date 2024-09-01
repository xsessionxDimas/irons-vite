import { Audit } from './Audit'

export type SyncHistory = {
    id: string,
    key: string,
    detail: string,
    isSuccess: string,
    isActive: string,
    isDeleted: string,
    createdBy: Audit,
    createdDate: string,
    updatedBy: string,
    updatedDate: string,
    _rid: string,
    _self: string,
    _etag: string,
    _attachments: string,
    _ts: number
}
