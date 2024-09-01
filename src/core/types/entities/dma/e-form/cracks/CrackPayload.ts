import { CrackDetailNo } from "./CrackDetailNo"
import { CrackDetailYes } from "./CrackDetailYes"
import { CrackHeader } from "./CrackHeader"
import { Employee } from "./Employee"
import { UpdatedParam } from "./UpdatedParam"

export type CrackPayload = {
    id: string,
    headerId: string,
    workorder: string
    updateParams: UpdatedParam[],
    employee: Employee,
    defectHeader: CrackHeader,
    defectDetail: CrackDetailNo | CrackDetailYes
}
