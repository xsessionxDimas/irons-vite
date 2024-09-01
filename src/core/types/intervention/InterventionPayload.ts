import { Audit } from './Audit'
import { IDefectNoDetail } from './IDefectNoDetail'
import { IBaseDefectHeader } from './IBaseDefectHeader'
import { InterventionPayloadParam } from './InterventionPayloadParam'
import { NADetail } from './NADetail'
import { ISMUDetail } from './ISMUDetail'
import { IDefectYesDetail } from './IDefectYesDetail'

export type InterventionPayload = {
    id?: string,
    headerId?: string,
    updateParams: InterventionPayloadParam[]
    employee: Audit,
    workOrder?: string,
    workorder?: string,
    localInterventionStatus: string,
    defectHeader?: IBaseDefectHeader
    defectDetail?: NADetail | IDefectNoDetail | IDefectYesDetail | ISMUDetail
}
