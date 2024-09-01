import { Part } from '../entities/dma/e-form/defects/Part'
import { Labour } from './Labour'
import { TaskUpdateObject } from './TaskUpdateObject'

export type DefectYesFormData = {
    type: string,
    title: string,
    assetNumber: string,
    description: string,
    raisedBy: string,
    date: string,
    plannedDuration: string,
    instruction: string,
    priority: string,
    parts: Part[],
    labours: Labour[],
    resources: string[],
    symptoms: string[],
    causes: string[],
    images: string[],
    taskNo: string,
    taskDesc: string
    task: TaskUpdateObject,
    submitDate: string,
    reason?: string,
    defectHeaderId?: string,
    idGenerated?: string,
    isNeed30Minutes?: boolean
}
