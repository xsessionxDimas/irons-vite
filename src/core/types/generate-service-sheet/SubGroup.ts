import { TaskGroup } from "./TaskGroup"

export type SubGroup = {
  name: string,
  key: string,
  desc: string,
  taskGroup: TaskGroup[],
}