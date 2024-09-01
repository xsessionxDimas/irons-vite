import { db } from "@/database/schema/DexieSchema"
import { ServiceSheetDefect } from "@/database/schema/ServiceSheetDefect"
import { cloneDeep, isUndefined } from "lodash"

export const deleteDefectByTaskId = async (wo, taskId) => {
  const defects = await db.serviceSheetDefect.where({
    workorder: wo,
    taskId: taskId
  })
  if (defects) {
    defects.delete()
  }
}

export const setDefectIsActiveById = async (wo, id, status) => {
  const defect = await db.serviceSheetDefect.where({
    workorder: wo,
    id: id,
    isActive: "true"
  }).first()
  if (defect) {
    defect.isActive = status
    await db.serviceSheetDefect.update(Number(defect.id!), defect)
  }
}

export const setDefectIsActiveByTaskId = async (wo, taskId, status) => {
  const defect = await db.serviceSheetDefect.where({
    workorder: wo,
    taskId: taskId,
    isActive: "true"
  }).first()
  if (defect) {
    defect.isActive = status
    await db.serviceSheetDefect.update(Number(defect.id!), defect)
  }
}

export const setAllDefectIsActiveByTaskId = async (wo, taskId, status) => {
  const defects = await db.serviceSheetDefect.where({
    workorder: wo,
    taskId: taskId,
    isActive: "true"
  }).toArray()
  if (defects) {
    for (const defectIndex in defects) {
      if (Object.prototype.hasOwnProperty.call(defects, defectIndex)) {
        const defect = defects[defectIndex];
        defect.isActive = status
        await db.serviceSheetDefect.update(Number(defect.id!), defect)
      }
    }
  }
}

export const dumpDefectListToLocalDB = async (defectHeaderList, defectDetailList) => {
  defectHeaderList.forEach(async (header, index) => {
    const detail = cloneDeep(defectDetailList.find((d) => {
      return d.defectHeaderId == header.id
    }))
    const clonedDefect = {
      ...cloneDeep(header)
    } as any
    let defect = {} as ServiceSheetDefect
    delete clonedDefect.id
    defect = {
      ...clonedDefect,
      defectDetailId: isUndefined(detail) ? '' : detail.id,
      defectData: isUndefined(detail) ? '' : {
        ...detail.detail,
        createdBy: detail.createdBy,
        createdDate: detail.createdDate,
        updatedBy: detail.updatedBy,
        updatedDate: detail.updatedDate,
      },
      defectHeaderId: header.id,
      defectDetailKey: detail?.key,
      statusSync: "Sync",
    }
    if (!isUndefined(detail) && detail.otherFitterUpdatedBy) {
      defect.otherFitterUpdatedBy = detail.otherFitterUpdatedBy;
      defect.updatedDate = detail.updatedDate;
    }
    await db.serviceSheetDefect.add(defect)
  })
}

export const clearDefectListFromLocalDB = async (workOrder) => {
  await db.serviceSheetDefect.where({
    workorder: workOrder
  }).delete()
}

export const updateDefectByDefectDetailId = async (detailId, detail) => {
  const defect = await db.serviceSheetDefect.where({
    defectDetailId: detailId
  }).first()
  if (defect) {
    defect.defectData = detail
    await db.serviceSheetDefect.update(Number(defect.id!), defect)
  }
}

export const getDefectSyncStatus = async (detailId) => {
  let status = false
  const defect = await db.serviceSheetDefect.where({
    defectDetailId: detailId
  }).first()
  if (defect) {
    if (defect.statusSync) {
      status = true
    }
  }
  return status
}

export const deleteServiceFormComments = async (workOrder) => {
  const woComment = await db.serviceFormComment.where({
    workOrder: workOrder
  })
  if (woComment) {
    woComment.delete()
  }
}

export const dumpServiceFormComments = async (comments, workOrder) => {
  await deleteServiceFormComments(workOrder)
  await db.serviceFormComment.bulkAdd(cloneDeep(comments))
}
