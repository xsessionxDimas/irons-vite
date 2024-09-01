import { Audit } from './Audit';
import { IBasicTask } from './IBasicTask'

export interface IStandartTask extends IBasicTask {
    isActive: true,
    isDeleted: false,
    updatedBy: string | Audit,
    header: string,
    description: string,
    category: string,
    rating: string,
}
