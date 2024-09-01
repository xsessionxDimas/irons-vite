import {
  StringWithValidationState
} from '@/core/types/misc/StringWithValidationState'
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import { FileInfo } from "@/core/types/entities/dma/FileInfo";

export type Parts = {
   partNumber: string,
   partDescription: StringWithValidationState
   partQty: StringWithValidationState
   images?: ImageInfo[]
   attachment?: FileInfo[]
}
