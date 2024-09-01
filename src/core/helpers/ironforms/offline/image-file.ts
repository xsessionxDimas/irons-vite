import ApiService from "@/core/services/ApiService"
import { db } from "@/database/schema/DexieSchema"
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore"
import { AxiosResponse } from "axios"
import { AESTShortCurrentDateTime } from "../../date-format"
import { addRecord } from "@/database/schema/DatabaseWrapper"

const authStore = useAuthenticationStore()

export const handleReplaceImageToLocalDB = async (id, wo, blob, taskKey, type, updatedById) => {
  const localImage = await db.pendingTaskFile.where({
    filename: id
  }).first()
  if (localImage) {
    db.pendingTaskFile.delete(localImage.id as number)
  }
  await addRecord(db, 'pendingTaskFile', {
    key: taskKey,
    module: 'serviceForm',
    workorder: wo,
    type: type,
    fileType: localImage?.fileType ?? 'webp',
    createdBy: updatedById,
    email: authStore.user.Email,
    filename: id,
    originalFile: localImage?.originalFilename ?? id,
    blob: blob,
    syncStatus: 'Sync',
    syncDate: AESTShortCurrentDateTime()
  })
}

export const getImageUrlFromLocalDB = async (id) => {
  let url = ""
  const urlCreator = window.URL || window.webkitURL
  const localImage = await db.pendingTaskFile.where({
    filename: id
  }).first()
  if (localImage) {
    url = urlCreator.createObjectURL(localImage.blob)
  }
  return url
}

export const getImageFromAPI = async (id) => {
  const params = {
    fileUrl: id,
    ver: 'v1',
  }
  const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/attachment/download_by_url`
  const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL, "", new URLSearchParams(params).toString())
  const buffer = response.data;
  const blob = new Blob([buffer]);
  return blob
}
