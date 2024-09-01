import { ImageInfo } from '../entities/dma/ImageInfo'
import { Audit } from './Audit'

export type RiskAssesmentValue = {
  image: string | ImageInfo,
  imageType?: string,
  updatedBy: Audit
  updatedDate?: string
}
