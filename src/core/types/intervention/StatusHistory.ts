import { Audit } from "./Audit"

export type StatusHistory = {
  status: string,
  tsUpdatedDate: number,
  updatedBy: Audit,
  updatedDate: string
}
