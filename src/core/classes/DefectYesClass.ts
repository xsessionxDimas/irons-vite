import {
  Labour,
  LabourWithValidationState
} from "../types/entities/dma/e-form/defects/Labour";
import {
  Part,
  PartWithValidationState
} from "../types/entities/dma/e-form/defects/Part";
import AbstractDefectClass from "./AbstractDefectClass";
import {
  isDotTheLastDigit,
  maximumFiveDigitWithTwoFraction,
  maximumFiveDigit
} from "@/core/helpers/number-format";
import {
  StringWithValidationState
} from "../types/misc/StringWithValidationState";
import { ImageInfo } from "../types/entities/dma/ImageInfo";
import { FileInfo } from "../types/entities/dma/FileInfo";
export default class DefectYesClass extends AbstractDefectClass {
  /* fields */
  protected plannedDuration: StringWithValidationState;
  protected instruction: StringWithValidationState;
  protected parts: PartWithValidationState[];
  protected labours: LabourWithValidationState[];
  protected resources: StringWithValidationState[];
  protected symptoms: StringWithValidationState[];
  protected causes: StringWithValidationState[];
  protected isNeed30Minutes: boolean;
  protected defectRequirement: string;

  public constructor() {
    super();
    this.instruction = this.initStringWithValidationType();
    this.plannedDuration = this.initStringWithValidationType();
    this.parts = []
    this.labours = [this.initLabours()];
    this.resources = this.initStringWithValidationTypeArray();
    this.symptoms = this.initStringWithValidationTypeArray();
    this.causes = this.initStringWithValidationTypeArray();
    this.isNeed30Minutes = false
    this.defectRequirement = '';
  }
  /* methods */
  protected initParts(partNumber = "", partDescription = "", qty = "", attachment: FileInfo[] | undefined = [], images: ImageInfo[] | undefined = []) {
    return {
      partNumberFormatted: partNumber,
      partNumber: partNumber,
      partDescription: partDescription,
      qty: qty,
      attachment: attachment,
      images: images,
      partNumberValidation: this.initValidationType(),
      descriptionValidation: this.initValidationType(),
      qtyValidation: this.initValidationType()
    }
  }
  protected initLabours(position = "", qty = "", hireEach = "", totalHours = "") {
    return {
      position: position,
      qty: qty,
      hireEach: hireEach,
      totalHours: totalHours,
      positionValidation: this.initValidationType(),
      qtyValidation: this.initValidationType(),
      hireEachValidation: this.initValidationType(),
      totalHoursValidation: this.initValidationType()
    }
  }
  /* set fields */
  public setIsNeed30Minutes(status: boolean) {
    this.isNeed30Minutes = status;
  }
  public setDefectRequirement(requirement: string) {
    this.defectRequirement = requirement
  }
  public setPlannedDuration(duration: string) {
    this.plannedDuration.value = duration;
  }
  public setInstruction(instruction: string) {
    this.instruction.value = instruction;
  }
  public importParts(...parts: Part[]) {
    this.parts = [];
    parts.forEach((p) => {
      this.parts.push(this.initParts(p.partNumber, p.partDescription, p.qty, p.attachment || [], p.images || []));
    });
  }
  public addPart(...parts: Part[]) {
    parts.forEach((p) => {
      this.parts.push(this.initParts(p.partNumber, p.partDescription, p.qty));
    });
  }
  public importLabours(...labours: Labour[]) {
    this.labours = [];
    labours.forEach((l) => {
      this.labours.push(this.initLabours(l.position, l.qty, l.hireEach, l.totalHours));
    });
  }
  public addLabour(...labours: Labour[]) {
    labours.forEach((l) => {
      this.labours.push(this.initLabours(l.position, l.qty, l.hireEach, l.totalHours));
    });
  }
  public importResources(...resources: string[]) {
    this.resources = [];
    resources.forEach((r) => {
      this.resources.push(this.initStringWithValidationType(r));
    });
  }
  public addResource(...resources: string[]) {
    resources.forEach((r) => {
      this.resources.push(this.initStringWithValidationType(r));
    });
  }
  public importSymptoms(...symptoms: string[]) {
    this.symptoms = [];
    symptoms.forEach((s) => {
      this.symptoms.push(this.initStringWithValidationType(s));
    });
  }
  public addSymptom(...symptoms: string[]) {
    symptoms.forEach((s) => {
      this.symptoms.push(this.initStringWithValidationType(s));
    });
  }
  public importCauses(...causes: string[]) {
    this.causes = [];
    causes.forEach((c) => {
      this.causes.push(this.initStringWithValidationType(c));
    });
  }
  public addCauses(...causes: string[]) {
    causes.forEach((c) => {
      this.causes.push(this.initStringWithValidationType(c));
    });
  }
  /* parts */
  public setPartNumber(index: number, partNumber: string) {
    this.parts[index].partNumber = partNumber;
  }
  public setPartDescription(index: number, description: string) {
    this.parts[index].partDescription = description;
  }
  public setPartQty(index: number, qty: string) {
    this.parts[index].qty = qty;
  }
  public setPartImage(index: number, image: ImageInfo[]) {
    this.parts[index].images = image;
  }
  public setPartAttachment(index: number, attachment: FileInfo[]) {
    this.parts[index].attachment = attachment;
  }
  public removeParts(index: number) {
    this.parts.splice(index, 1);
  }
  /* labours */
  public setLabourActivity(index: number, activity: string) {
    this.labours[index].position = activity;
  }
  public setLabourQty(index: number, qty: string) {
    this.labours[index].qty = qty;
  }
  public setLabourHireEach(index: number, hireEach: string) {
    this.labours[index].hireEach = hireEach;
  }
  public setLabourTotalHours(index: number, totalHours: string) {
    this.labours[index].totalHours = totalHours;
  }
  public removeLabours(index: number) {
    this.labours.splice(index, 1);
  }
  /* resources */
  public setResources(index: number, resource: string) {
    this.resources[index].value = resource;
  }
  public removeResource(index: number) {
    this.resources.splice(index, 1);
  }
  /* symptom */
  public setSymptom(index: number, symptom: string) {
    this.symptoms[index].value = symptom;
  }
  public removeSymptom(index: number) {
    this.symptoms.splice(index, 1);
  }
  /* causes */
  public setCauses(index: number, cause: string) {
    this.causes[index].value = cause;
  }
  public removeCauses(index: number) {
    this.causes.splice(index, 1);
  }
  /* validations */
  public validatePlannedDuration() {
    let isValid = true;
    if (this.plannedDuration.value === "") {
      this.plannedDuration.isValid = false;
      this.plannedDuration.errorMessage = "Required";
      isValid = false;
    } else if (isNaN(Number(this.plannedDuration.value))) {
      this.plannedDuration.isValid = false;
      this.plannedDuration.errorMessage = "Invalid Format";
      isValid = false;
    } else {
      let validFormat = !isDotTheLastDigit(this.plannedDuration.value);
      if (!validFormat) {
        this.plannedDuration.isValid = false;
        this.plannedDuration.errorMessage = "Invalid format";
        isValid = false;
        return isValid
      } else {
        this.plannedDuration.isValid = true;
        this.plannedDuration.errorMessage = "";
      }
      validFormat = maximumFiveDigitWithTwoFraction(this.plannedDuration.value);
      if (!validFormat) {
        this.plannedDuration.isValid = false;
        this.plannedDuration.errorMessage = "Out of range (max 5 digit and 2 fraction)";
        isValid = false;
      } else {
        if (this.IsNeed30Minutes) {
          const number = Number(this.plannedDuration.value);
          if (number <= 0.5) {
            this.plannedDuration.isValid = false;
            this.plannedDuration.errorMessage = "Must more than half an hour";
            isValid = false;
          } else {
            this.plannedDuration.isValid = true;
            this.plannedDuration.errorMessage = "";
          }
        }
      }
    }
    return isValid;
  }
  public validateInstruction() {
    let isValid = true;
    if (this.instruction.value === "") {
      this.instruction.isValid = false;
      this.instruction.errorMessage = "Required";
      isValid = false;
    } else {
      this.instruction.isValid = true;
      this.instruction.errorMessage = "";
    }
    return isValid;
  }
  /* parts */
  public validateParts() {
    let isValid = true;
    const parentValids = [] as boolean[];
    this.parts.forEach((e) => {
      const valids = [] as boolean[];
      valids.push(this.validatePartDescription(e));
      valids.push(this.validatePartQty(e));
      parentValids.push(valids.every((x) => {
        return x;
      }));
    });
    isValid = parentValids.every((x) => {
      return x;
    });
    return isValid;
  }
  public validatePartDescription(e:PartWithValidationState) {
    let isValid = true;
    if (e.partDescription === "") {
      e.descriptionValidation.isValid = false;
      e.descriptionValidation.message = "Required";
      isValid = false;
    } else {
      e.descriptionValidation.isValid = true;
      e.descriptionValidation.message = "";
    }
    return isValid;
  }
  public validatePartQty(e:PartWithValidationState) {
    let isValid = true;
    if (e.qty === "") {
      e.qtyValidation.isValid = false;
      e.qtyValidation.message = "Required";
      isValid = false;
    } else if (e.qty == "0" || Number(e.qty) == 0) {
      e.qtyValidation.isValid = false;
      e.qtyValidation.message = "Must be greater than 0";
      isValid = false;
    } else {
      let validFormat = !isDotTheLastDigit(e.qty);
      if (!validFormat) {
        e.qtyValidation.isValid = false;
        e.qtyValidation.message = "Invalid format";
        isValid = false;
        return isValid
      } else {
        e.qtyValidation.isValid = true;
        e.qtyValidation.message = "";
      }
      validFormat = maximumFiveDigitWithTwoFraction(e.qty);
      if (!validFormat) {
        e.qtyValidation.isValid = false;
        e.qtyValidation.message = "Out of range (max 5 digit and 2 fraction)";
        isValid = false;
      } else {
        e.qtyValidation.isValid = true;
        e.qtyValidation.message = "";
      }
    }
    return isValid;
  }
  /* labours */
  public validateLabours() {
    let isValid = true;
    const parentValids = [] as boolean[];
    this.labours.forEach((e) => {
      const valids = [] as boolean[];
      valids.push(this.validateLaboursActivity(e));
      valids.push(this.validateLaboursQty(e));
      valids.push(this.validateLaboursHireEach(e));
      // valids.push(this.validateLaboursTotalHours(e));
      parentValids.push(valids.every((x) => {
        return x;
      }));
    });
    isValid = parentValids.every((x) => {
      return x;
    });
    return isValid;
  }
  public validateLaboursActivity(e:LabourWithValidationState) {
    let isValid = true;
    if (!e.position) {
      e.positionValidation.isValid = false;
      e.positionValidation.message = "Required";
      isValid = false;
    } else {
      e.positionValidation.isValid = true;
      e.positionValidation.message = "";
    }
    const duplicateLabours = this.labours.filter((l) => {
      return l.position === e.position;
    });
    if (duplicateLabours.length > 1) {
      e.positionValidation.isValid = false;
      e.positionValidation.message = "Duplicate labour";
      isValid = false;
    } else {
      e.positionValidation.isValid = true;
      e.positionValidation.message = "";
    }
    return isValid;
  }
  public validateLaboursQty(l:LabourWithValidationState) {
    let isValid = true;
    if (l.qty === "") {
      l.qtyValidation.isValid = false;
      l.qtyValidation.message = "Required";
      isValid = false;
    } else if (l.qty == "0" || Number(l.qty) == 0) {
      l.qtyValidation.isValid = false;
      l.qtyValidation.message = "Must be greater than 0";
      isValid = false;
    } else {
      let validFormat = !isDotTheLastDigit(l.qty);
      if (!validFormat) {
        l.qtyValidation.isValid = false;
        l.qtyValidation.message = "Invalid format";
        isValid = false;
        return isValid
      } else {
        l.qtyValidation.isValid = true;
        l.qtyValidation.message = "";
      }
      validFormat = maximumFiveDigit(l.qty);
      if (!validFormat) {
        l.qtyValidation.isValid = false;
        l.qtyValidation.message = "Out of range (max 5 digits)";
        isValid = false;
      } else {
        l.qtyValidation.isValid = true;
        l.qtyValidation.message = "";
      }
    }
    return isValid;
  }
  public validateLaboursHireEach(e:LabourWithValidationState) {
    let isValid = true;
    if (e.hireEach === "") {
      e.hireEachValidation.isValid = false;
      e.hireEachValidation.message = "Required";
      isValid = false;
    } else if (e.hireEach == "0" || Number(e.hireEach) == 0) {
      e.hireEachValidation.isValid = false;
      e.hireEachValidation.message = "Must be greater than 0";
      isValid = false;
    } else {
      let validFormat = !isDotTheLastDigit(e.hireEach);
      if (!validFormat) {
        e.hireEachValidation.isValid = false;
        e.hireEachValidation.message = "Invalid format";
        isValid = false;
        return isValid
      } else {
        e.hireEachValidation.isValid = true;
        e.hireEachValidation.message = "";
      }
      validFormat = maximumFiveDigitWithTwoFraction(e.hireEach);
      if (!validFormat) {
        e.hireEachValidation.isValid = false;
        e.hireEachValidation.message = "Out of range (max 5 digit and 2 fraction)";
        isValid = false;
      } else {
        e.hireEachValidation.isValid = true;
        e.hireEachValidation.message = "";
      }
    }
    return isValid;
  }
  public validateLaboursTotalHours(e:LabourWithValidationState) {
    let isValid = true;
    if (e.totalHours === "") {
      e.totalHoursValidation.isValid = false;
      e.totalHoursValidation.message = "Required";
      isValid = false;
    } else {
      let validFormat = !isDotTheLastDigit(e.totalHours);
      if (!validFormat) {
        e.totalHoursValidation.isValid = false;
        e.totalHoursValidation.message = "Invalid format";
        isValid = false;
        return isValid
      } else {
        e.totalHoursValidation.isValid = true;
        e.totalHoursValidation.message = "";
      }
      validFormat = maximumFiveDigitWithTwoFraction(e.totalHours);
      if (!validFormat) {
        e.totalHoursValidation.isValid = false;
        e.totalHoursValidation.message = "Out of range (max 5 digit and 2 fraction)";
        isValid = false;
      } else {
        e.totalHoursValidation.isValid = true;
        e.totalHoursValidation.message = "";
      }
    }
    return isValid;
  }
  /* resources */
  public validateResources() {
    let isValid = true;
    this.resources.forEach((e, index) => {
      if (index === 0) {
        return;
      }
      isValid = this.validateResource(e);
    });
    return isValid;
  }
  public validateResourcesAdd() {
    let isValid = true;
    this.resources.forEach((e) => {
      isValid = this.validateResource(e);
    });
    return isValid;
  }
  public validateResourcesRemove() {
    let isValid = true;
    const length = this.resources.length
    this.resources.forEach((e, index) => {
      if (index === 0 && e.value == '' && length == 1) {
        e.isValid = true
        return;
      }
      isValid = this.validateResource(e);
    });
    return isValid;
  }
  public validateResource(resource: StringWithValidationState) {
    let isValid = true;
    if (resource.value === "") {
      resource.isValid = false;
      resource.errorMessage = "Required";
      isValid = false;
    } else {
      resource.isValid = true;
      resource.errorMessage = "";
    }
    return isValid;
  }
  /* symptom */
  public validateSymptoms() {
    let isValid = true;
    this.symptoms.forEach((e) => {
      isValid = this.validateSymptom(e);
    });
    return isValid;
  }
  public validateSymptom(symptom: StringWithValidationState) {
    let isValid = true;
    if (symptom.value === "") {
      symptom.isValid = false;
      symptom.errorMessage = "Required";
      isValid = false;
    } else {
      const found = this.Symptoms.filter((a) => {
        return a.value === symptom.value;
      });
      if (found.length > 1) {
        symptom.isValid = false;
        symptom.errorMessage = "Duplicate symptom";
        isValid = false;
      } else {
        symptom.isValid = true;
        symptom.errorMessage = "";
      }
    }
    return isValid;
  }
  /* causes */
  public validateCauses() {
    let isValid = true;
    this.causes.forEach((e) => {
      isValid = this.validateCause(e);
    });
    return isValid;
  }
  public validateCause(causes: StringWithValidationState) {
    let isValid = true;
    if (causes.value === "") {
      causes.isValid = false;
      causes.errorMessage = "Required";
      isValid = false;
    } else {
      const found = this.Causes.filter((a) => {
        return a.value === causes.value;
      });
      if (found.length > 1) {
        causes.isValid = false;
        causes.errorMessage = "Duplicate causes";
        isValid = false;
      } else {
        causes.isValid = true;
        causes.errorMessage = "";
      }
    }
    return isValid;
  }
  public validateDefectForm() {
    const validations = [] as boolean[];
    validations.push(this.validateDescription());
    validations.push(this.validatePlannedDuration());
    validations.push(this.validateInstruction());
    validations.push(this.validateParts());
    validations.push(this.validateLabours());
    validations.push(this.validateResources());
    validations.push(this.validateSymptoms());
    validations.push(this.validateCauses());
    this.isValid = validations.every((x) => {
      return x;
    });
  }
  /* getters */
  get PlannedDuration(): StringWithValidationState {
    return this.plannedDuration;
  }
  get Instruction(): StringWithValidationState {
    return this.instruction;
  }
  get Parts(): PartWithValidationState[] {
    return this.parts;
  }
  get Labours(): LabourWithValidationState[] {
    return this.labours;
  }
  get Resources(): StringWithValidationState[] {
    return this.resources;
  }
  get Symptoms(): StringWithValidationState[] {
    return this.symptoms;
  }
  get Causes(): StringWithValidationState[] {
    return this.causes;
  }
  get IsNeed30Minutes(): boolean {
    return this.isNeed30Minutes;
  }
  get DefectRequirement(): string {
    return this.defectRequirement;
  }
}
