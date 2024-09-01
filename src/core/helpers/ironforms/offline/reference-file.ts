import ApiService from "@/core/services/ApiService"
import { db } from "@/database/schema/DexieSchema"
import { TaskReference } from "@/database/schema/TaskReferences"
import { AxiosResponse } from "axios"

export const handleReplaceImageToLocalDB = async (id, wo, blob) => {
  const localImage = await db.taskReference.where({
    filename: id
  })
  if (localImage) {
    localImage.delete()
  }
  await db.taskReference.add({
    workorder: wo,
    filename: id,
    file: blob,
    fileType: "image",
    createdDate: new Date()
  })
}

export const getReferenceDataFromLocalDB = async (id) => {
  let data = {} as TaskReference
  const localImage = await db.taskReference.where({
    filename: id
  }).first()
  if (localImage) {
    data = localImage
  }
  return data
}

export const getReferenceUrlFromLocalDB = async (id) => {
  let url = ""
  const urlCreator = window.URL || window.webkitURL
  const localImage = await db.taskReference.where({
    filename: id
  }).first()
  if (localImage) {
    url = urlCreator.createObjectURL(localImage.file)
  }
  return url
}

export const getImageFromAPI = async (id) => {
  const params = {
    id: id,
    ver: 'v1',
  }
  const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/utility/api/master_attachment/download_by_id`
  const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL, "", new URLSearchParams(params).toString())
  const buffer = response.data;
  const blob = new Blob([buffer]);
  return blob
}
