export type UpsertItem = {
    componentReplacementId: number
    site: string
    model: string
    equipment: string
    component: string
    componentAssignmentId: number
    replacementDate: string
    replacementSmu: number
    hmoffset: number
    frameHours: number
    transactionCount?: number
}
