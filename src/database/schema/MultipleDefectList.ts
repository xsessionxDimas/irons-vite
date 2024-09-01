import { Audit } from "@/core/types/intervention/Audit";

export type MultipleDefectList = {
  id: string,
  detail: any,
  key: string,
  workorder: string,
  defectHeaderId: string,
  servicesheetDetailId: string,
  interventionId: string | null,
  interventionHeaderId: string | null,
  taskId: string,
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
  _ts: string,
}
