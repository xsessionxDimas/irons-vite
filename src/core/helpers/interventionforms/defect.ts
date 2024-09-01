import { db } from "@/database/schema/DexieSchema"

export const deleteInterventionFormComments = async (workOrder) => {
  const woComment = await db.interventionComment.where({
    workOrder: workOrder
  })
  if (woComment) {
    woComment.delete()
  }
}
