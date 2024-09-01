export type QueueTask = {
  id?: number,
  module: string,
  section: string,
  type: string,
  workorder: string,
  key: string,
  bindingKey: string,
  payload: string,
  syncDate: string,
  errorMessage?: string
  itemKey?: string
  syncStatus: string,
}

export const PendingTaskSyncStatusEnum = {
  PENDING: "Pending"
}

export const PendingTaskModuleEnum = {
  SERVICE_FORM: "serviceForm"
}
