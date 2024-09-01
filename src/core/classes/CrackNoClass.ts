import AbstractDefectClass from "./AbstractDefectClass";
import {
  PreviousCrack,
  PreviousCrackWithValidationState
} from "../types/entities/dma/e-form/cracks/CrackPreviousCrack";
import {
  StringWithValidationState
} from "../types/misc/StringWithValidationState";
import { maximumFiveDigitWithTwoFraction } from "../helpers/number-format";

export default class CrackNoClass extends AbstractDefectClass {
  /* fields */
  protected assetNumber: string;
  protected instruction: StringWithValidationState;
  protected crackLength: PreviousCrackWithValidationState[]

  public constructor() {
    super();
    this.assetNumber = "";
    this.instruction = this.initStringWithValidationType();
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
  /* set fields */
  public setAssetNumber(assetNumber: string) {
    this.assetNumber = assetNumber;
  }
  public setInstruction(instruction: string) {
    this.instruction.value = instruction;
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
      const validFormat = maximumFiveDigitWithTwoFraction(e.currentCrack);
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
    validations.push(this.validateInstruction());
    validations.push(this.validateCrack());
    this.isValid = validations.every((x) => {
      return x == true;
    });
  }
  /* getters */
  get AssetNumber(): string {
    return this.assetNumber;
  }
  get Instruction(): StringWithValidationState {
    return this.instruction;
  }
  get CrackLength(): PreviousCrackWithValidationState[] {
    return this.crackLength
  }
}
