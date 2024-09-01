export type ReplacementDefaultPayloadType = {
  modelId: string,
  psTypeId: string,
  taskId: string
}

export type ReplacementDefaultBulkPayloadType = {
  modelId: string,
  psTypeId: string
}

export interface IntervantionReplacementDefaultBulkPayloadType extends Omit<ReplacementDefaultBulkPayloadType, "psTypeId"> {
  psTypeId?: string
  type: string
}

export type ReplacementDefaultResponseType = {
  id: string,
  modelId: string,
  psTypeId: string,
  taskId: string,
  defaultValue: string,
  isActive: string,
  isDeleted: string,
  createdBy: {
    id: string,
    name: string
  },
  createdDate: string,
  updatedBy: string,
  updatedDate: string,
  rating: string,
}
