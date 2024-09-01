import { ImageInfo } from '../entities/dma/ImageInfo'
import { Audit } from './Audit'

export type LogObject = {
    employee: Audit,
    timeLoggedIn: string[],
    shift: string,
    isIHaveReadChecked: boolean,
    riskPhotos: string[] | ImageInfo[]
}
