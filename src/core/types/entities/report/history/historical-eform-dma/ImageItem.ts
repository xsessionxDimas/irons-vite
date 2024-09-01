export type Dimensions = {
  width: number;
  height: number;
}

export type ImageItem = {
  id: string,
  buffer: string,
  dimension: Dimensions,
  desc: string
}

export type LoadedImageBuffer = Omit<ImageItem, 'desc'>
export type LoadedImageData = Omit<ImageItem, 'buffer' | 'dimension'>
