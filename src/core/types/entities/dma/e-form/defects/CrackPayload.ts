import { DefectDetailNo } from "./DefectDetailNo"
import { DefectDetailYes } from "./DefectDetailYes"
import { DefectHeader } from "./DefectHeader"
import { Employee } from "./Employee"
import { UpdatedParam } from "./UpdatedParam"

export type CrackPayload = {
    id: string,
    updateParams: UpdatedParam[],
    employee: Employee,
    defectHeader: DefectHeader,
    defectDetail: DefectDetailNo | DefectDetailYes
}
