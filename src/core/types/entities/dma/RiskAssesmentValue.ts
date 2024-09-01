import { Audit } from "../../intervention/Audit"
import { ImageInfo } from "./ImageInfo"

export type RiskAssesmentValue = {
  image: string | ImageInfo,
  imageType: string,
  updatedBy: Audit,
  updatedDate: string
}