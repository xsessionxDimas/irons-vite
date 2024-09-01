import { ImageInfo } from "../entities/dma/ImageInfo"
import { Audit } from "./Audit"

export type LogParamObject = {
    key: string,
    employee: Audit,
    timeLoggedIn: string,
    shift: string,
    isIHaveReadChecked: boolean,
    riskPhotos: ImageInfo[]
}
