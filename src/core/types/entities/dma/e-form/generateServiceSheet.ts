import { General } from "./general/general"
import { Group } from "./group"

export type GenerateServiceSheet = {
  general: General,
  serviceSheet: Group[]
}

export type GenerateSuspensionCylinderSheet = {
  header: General,
  detail: Group
}

export type GenerateInterimEngineServiceSheet = {
  general: General,
  suckBlowSheet: Group[]
}
