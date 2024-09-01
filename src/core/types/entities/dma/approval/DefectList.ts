export type DefectList = {
  id: string,
  workorder: string,
  form: string,
  serviceSheetDetailId: string,
  category: string,
  taskId: string,
  taskNo: string,
  taskDesc: string,
  priorityType: null | string,
  defectWorkorder: string,
  formDefect: string,
  defectType: string,
  taskValue: string,
  repairedStatus: string,
  cbmNAStatus: string,
  supervisor: {
      id: string,
      name: string
  },
  status: string,
  key: string,
  isActive: string,
  isDeleted: string,
  createdBy: {
      id: string,
      name: string
  },
  createdDate: string,
  updatedBy: string,
  updatedDate: string,
  _rid: string,
  _self: string,
  _etag: string,
  _attachments: string,
  _ts: number,
  defectAction: string | undefined,
  taskNumber: number | undefined
}
