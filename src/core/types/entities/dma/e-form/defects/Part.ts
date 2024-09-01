import { Validation } from "@/core/types/misc/Validation";
import { ImageInfo } from "../../ImageInfo";
import { FileInfo } from "../../FileInfo";

export type Part = {
  partNumber: string,
  partDescription: string,
  qty: string,
  images?: ImageInfo[],
  attachment?: FileInfo[]
};

export type PartWithValidationState = {
  partNumber: string,
  partDescription: string,
  qty: string
  partNumberValidation: Validation,
  descriptionValidation: Validation,
  qtyValidation: Validation,
  images?: ImageInfo[],
  attachment?: FileInfo[]
}
