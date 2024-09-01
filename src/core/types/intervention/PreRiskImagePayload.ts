import { Audit } from './Audit'

export type PreRiskImagePayload = {
  id: string,
  key: string,
  employee: Audit,
  submitDate: string,
  filename: string
}
