import { TaskUpdateObject } from "./TaskUpdateObject"

export type RatingResult = {
   rating: string,
   isError: true,
   errorMessage: string,
   task: TaskUpdateObject
}
