import { IBaseDefectHeader } from './IBaseDefectHeader'
import { IDefectNoDetail } from './IDefectNoDetail'

export interface IDefectNoHeader {
   header: IBaseDefectHeader
   detail: IDefectNoDetail
}
