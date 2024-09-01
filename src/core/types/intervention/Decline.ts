import { Audit } from "./Audit"

export type Decline = {
  isDecline: boolean,
  declineReason: string,
  declineDate?: string,
  declineBy?: Audit
}

export type Approve = {
  approvedDate?: string,
  approvedBy?: Audit
}

