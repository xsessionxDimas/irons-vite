import { db } from "@/database/schema/DexieSchema"

export const deleteById = async (id) => {
  const record = await db.retryTask.where({
    id: id
  })
  if (record) {
    record.delete()
  }
}

export const deleteAll = async () => {
  await db.retryTask.clear()
}
