import { UpdateParams } from "../../Payload"
import { Mechanic } from "../general/ServicePersonnel"

export type updateServiceSheetHeaderResponse = {
  employee: Mechanic,
  id: string,
  updatedDate: string,
  updateParams: UpdateParams[]
  checkBeforeTruck? : UpdateParams[]
}