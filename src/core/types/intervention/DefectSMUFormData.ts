import { Audit } from './Audit'

export type DefectSMUFormData = {
    id: string
    status: string
    key: string
    value: string
    employee: Audit
    submitDate: string
    detail: {
        isInRange: boolean,
        range: {
            minRange: string | number,
            maxRange: string | number
        },
        serialNumber: string
    },
    idGenerated: string
    fitter?: Audit
}
