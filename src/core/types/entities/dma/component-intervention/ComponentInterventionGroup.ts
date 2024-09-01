import { SubGroup } from "./SubGroup"

export type ComponentInterventionGroup = {
    name: string,
    group: string,
    key: string,
    tasks: any[] | null
    isSelected: boolean
    totalTask: number
    doneTask: number
    groupSeq: number

    id?: string,
    workOrder?: string,
}
