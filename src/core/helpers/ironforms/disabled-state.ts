import { ImageInfo } from "@/core/types/entities/dma/ImageInfo"

/**
 *
 * @param formStatus
 * @param value
 * @returns boolean
 *
 * If status below submitted and value is empty then result will be false
 */
export function isCameraDisabled(formStatus: string,
  value: string | string[] | ImageInfo[] | undefined): boolean {
  let result = true
  const targetStatus = ['Open', 'On Progress']
  if (!targetStatus.includes(formStatus)) return true
  if (!value) result = false
  if (typeof value === 'string' && !value) result = false
  return result
}

export type isCameraDisabledParam = Parameters<typeof isCameraDisabled>
