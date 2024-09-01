import { Audit } from './Audit'

export type UpdateSMUParam = {
  id: string,
  key: string,
  status: string,
  value: string,
  employee: Audit,
  isInRange: boolean,
  submitDate: string,
  fitter?: Audit
}
