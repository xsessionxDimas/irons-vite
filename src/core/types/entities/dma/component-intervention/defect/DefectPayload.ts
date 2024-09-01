import { DefectDetailNo } from "../../e-form/defects/DefectDetailNo"
import { DefectDetailYes } from "../../e-form/defects/DefectDetailYes"
import { DefectHeader } from "./DefectHeader"
import { Employee } from "../../e-form/defects/Employee"
import { UpdatedParam } from "../../e-form/defects/UpdatedParam"

export type DefectPayload = {
    id: string,
    headerId: string,
    workorder: string,
    updateParams: UpdatedParam[],
    employee: Employee,
    defectHeader: DefectHeader,
    defectDetail: DefectDetailNo | DefectDetailYes
    interventionId: string
}
