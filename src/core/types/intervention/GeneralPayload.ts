import {
  ServicePersonnel
} from '../entities/dma/e-form/general/ServicePersonnel'
import { Audit } from './Audit'
import { LogObject } from './LogObject'
import { LogParamObject } from './LogParamObject'
import { StatusHistoryParam } from './StatusHistoryParam'

export type GeneralPayload = {
  id: string,
  key: string,
  smu: string,
  employee: Audit,
  serviceStart: string,
  submitDate: string,
  status: string,
  shift: string,
  log: LogParamObject,
  logs?: LogObject[],
  history: StatusHistoryParam,
  servicePersonnel: ServicePersonnel
}
