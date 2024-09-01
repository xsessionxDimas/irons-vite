import { ImageInfo } from '../entities/dma/ImageInfo'
import { Audit } from './Audit'

export type ImagePayload = {
  id: string,
  key: string,
  type: string,
  email: string,
  employee: Audit,
  submitDate: string,
  files: ImageInfo[],
  blobs: Blob[],
  taskKey?: string
}
