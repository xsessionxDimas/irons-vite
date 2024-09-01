import { TaskGroup } from "./taskGroup"

export type SubGroup = {
  name: string,
  key: string,
  desc: string,
  taskGroup: TaskGroup[]
}

export const SubGroupKeyEnum = {
  MECHANICAL_SERVICE: "MECHANICAL_SERVICE",
  PRE_SERVICE_OPERATIONAL_CHECK: "PRE_SERVICE_OPERATIONAL_CHECK",
}
