import { TaskUpdateObject } from './TaskUpdateObject'

export type CBMFormData = {
   taskNo: string,
   taskDesc: string
   cbmMeasurement?: string,
   uomValue?: string,
   task: TaskUpdateObject,
   submitDate: string,
   correctedValue?: string,
   correctedMeasurement?: string,
   correctedUom?: string
}
