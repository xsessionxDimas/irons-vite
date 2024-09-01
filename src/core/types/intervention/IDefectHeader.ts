import { DefectDetail } from './DefectDetail'
import { IBaseDefectHeader } from './IBaseDefectHeader'

export interface IDefectHeader extends IBaseDefectHeader {
   detail: DefectDetail
}
