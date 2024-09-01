import { KeyValue } from "@/core/types/misc/KeyValue";

export const getBookmarks = async (report): Promise<KeyValue[]> => {
  const container = [] as KeyValue[]
  try {
    const pbiBookmarks = await report.bookmarksManager.getBookmarks()
    pbiBookmarks.forEach(function (bookmark) {
      container.push({
        key: bookmark.displayName,
        value: bookmark.name
      })
    })
  } catch (error) {
    console.log('get bookmark failed', error);
  }
  return container
}

/**
 *
 * @param bookmarks
 * @param matrixId
 * @param whiteMatrixs
 * @param dataPoints
 * @returns string
 */
export const getBookmark = (bookmarks: KeyValue[],
  matrixId: string, whiteMatrixs: string[],
  dataPoints: any[]): string => {
  let result = ''
  if (!whiteMatrixs.includes(matrixId)) return result
  const identity = dataPoints[0].identity
  if (Array.isArray(identity) && identity.length > 2) {
    //
    const prefix = (identity[0].equals as string).replaceAll(' ', '')
    const suffix = identity[2].equals as string
    const key = `${prefix}_${suffix}`
    const bookmark = bookmarks.find((b) => {
      return b.key == key
    })
    if (bookmark) result = bookmark.value
  }
  return result
}

export const getBookmarkByKey = (key: string, bookmarks: KeyValue[]) => {
  let result = ""
  const bookmark = bookmarks.find((b) => {
    return b.key == key
  })
  if (bookmark) result = bookmark.value
  return result
}
