import { Item } from "./Item"

export type Task = {
    key: string,
    seqId: number | string,
    taskType: string,
    isActive: boolean,
    isDeleted: boolean,
    updatedBy: string | {
        name: string,
        id: string
    },
    header: string,
    description: string,
    category: string,
    rating: string,
    updatedDate: string,
    groupTaskId: string,
    items: Item[],
    taskValue?: string,
    adjustment?: any
}
