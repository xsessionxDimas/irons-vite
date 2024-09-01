import { PreviousCrack } from "./CrackPreviousCrack"

export type MultiplePreviousCrack = {
  taskId: string,
  workOrder: string,
  previousCrack: PreviousCrack[]
}