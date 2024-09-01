import { db } from "@/database/schema/DexieSchema";

export const deleteByWOItemKey = async (workOrder, key) => {
  const prevInput = db.pendingTask.where({
    workorder: workOrder,
    itemKey: key,
  });
  if (prevInput) {
    await prevInput.delete();
  }
};
