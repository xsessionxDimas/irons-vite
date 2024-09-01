import { General } from "./general/General"
import { Group } from "./group"

export type GenerateServiceSheet = {
  id?: string
  general: General,
  serviceSheet: Group[]
}
