import {
  isDotTheLastDigit,
  maximumFiveDigitWithTwoFraction
} from "../helpers/number-format";
import {
  PreviousCrack,
  PreviousCrackWithValidationState
} from "../types/entities/dma/e-form/cracks/CrackPreviousCrack";
import DefectYesClass from "./DefectYesClass";

export default class CrackYessClass extends DefectYesClass {
  protected crackLength: PreviousCrackWithValidationState[]

  public constructor() {
    super();
    this.crackLength = [] as PreviousCrackWithValidationState[]
  }

  /* methods */
  protected initCracks(locationId = "", locationDesc = "", previousCrack = "", currentCrack = "") {
    return {
      locationId: locationId,
      locationDesc: locationDesc,
      previousCrack: previousCrack,
      currentCrack: currentCrack,
      isValid: true,
      errorMessage: ""
    }
  }
  public setCurrentCrack(index: number, currentCrack: string) {
    this.crackLength[index].currentCrack = currentCrack;
  }
  public importPreviousCrack(...previousCracks: PreviousCrack[]) {
    this.crackLength = [];
    previousCracks.forEach((c) => {
      this.crackLength.push(this.initCracks(c.locationId, c.locationDesc, c.previousCrack, c.currentCrack));
    })
  }
  /* validations */
  public validateCurrentCrack(e:PreviousCrackWithValidationState) {
    let isValid = true;
    if (e.currentCrack === "") {
      e.isValid = false;
      e.errorMessage = "Required";
      isValid = false;
    } else if (e.currentCrack == '0' || parseFloat(e.currentCrack) == 0) {
      e.isValid = false;
      e.errorMessage = "Must be greater than 0";
      isValid = false;
    } else {
      let validFormat = !isDotTheLastDigit(e.currentCrack);
      if (!validFormat) {
        e.isValid = false;
        e.errorMessage = "Invalid format";
        isValid = false;
        return isValid
      } else {
        e.isValid = true;
        e.errorMessage = "";
      }
      validFormat = maximumFiveDigitWithTwoFraction(e.currentCrack);
      if (!validFormat) {
        e.isValid = false;
        e.errorMessage = "Out of range (max 5 digit and 2 fraction)";
        isValid = false;
      } else {
        e.isValid = true;
        e.errorMessage = "";
      }
    }
    return isValid;
  }
  public validateCrack() {
    let isValid = true;
    this.crackLength.forEach((e) => {
      isValid = this.validateCurrentCrack(e);
    });
    return isValid;
  }
  public validateDefectForm() {
    const validations = [] as boolean[];
    validations.push(this.validateDescription());
    validations.push(this.validatePlannedDuration());
    validations.push(this.validateInstruction());
    validations.push(this.validateCrack());
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
  get CrackLength(): PreviousCrackWithValidationState[] {
    return this.crackLength
  }
}
