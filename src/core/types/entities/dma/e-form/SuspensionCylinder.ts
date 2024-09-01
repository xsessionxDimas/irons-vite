import { Employee } from "../Payload"

export type GetSCTemplatePayload = {
  employee: Employee
  modelId: string
  psTypeId: string,
  workOrder: string | number,
  unitNumber: string
}
