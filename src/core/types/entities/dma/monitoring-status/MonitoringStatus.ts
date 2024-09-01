import { List } from "./List"
import { InterventionList } from "./InterventionList"

type data = {
  servicesheet: List[],
  intervention: InterventionList[],
  interimEngine: List[],
}

export type MonitoringStatus = {
  dataCount: number | string,
  status: string,
  data: data
}
