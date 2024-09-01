import { Audit } from './Audit'
import { StatusHistoryParam } from './StatusHistoryParam'

export type SubmitFormPayload = {
    id: string,
    employee: Audit,
    serviceEnd: string,
    status: string,
    history: StatusHistoryParam,
    additionalInformation: string
}
