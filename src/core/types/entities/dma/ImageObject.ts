import { ImageInfo } from "./ImageInfo"

export type ImageObject = {
    Id: string,
    ImageInfos: string[] | ImageInfo[],
    ImageBlobs: Blob[]
}
