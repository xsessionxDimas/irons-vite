import { Validation } from "@/core/types/misc/Validation";

export type Labour = {
    position: string,
    qty: string,
    hireEach: string,
    totalHours: string
};

export type LabourWithValidationState = {
    position: string,
    qty: string,
    hireEach: string,
    totalHours: string,
    positionValidation: Validation,
    qtyValidation: Validation,
    hireEachValidation: Validation,
    totalHoursValidation: Validation
}
