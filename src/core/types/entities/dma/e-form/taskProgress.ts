export type TaskProgress = {
  workorder: string,
  group: string,
  totalTask: number,
  doneTask: number,
  identifiedDefectCount?: number
}
