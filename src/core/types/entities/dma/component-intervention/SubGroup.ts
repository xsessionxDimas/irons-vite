import { Task } from "./Task"

export type TaskGroup = {
    key: string,
    name: string,
    tasks: Task[]
}

export type SubGroup = {
    key: string,
    group: string,
    tasks: TaskGroup[]
}
