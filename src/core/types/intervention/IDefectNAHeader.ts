import { NADetail } from './NADetail'
import { IBaseDefectHeader } from './IBaseDefectHeader'

export interface IDefectNAHeader {
   header: IBaseDefectHeader
   detail: NADetail
}
