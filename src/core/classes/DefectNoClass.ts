import {
  StringWithValidationState
} from "../types/misc/StringWithValidationState";
import AbstractDefectClass from "./AbstractDefectClass";

export default class DefectNoClass extends AbstractDefectClass {
    protected actions: StringWithValidationState[];

    public constructor() {
      super();
      this.actions = [
        this.initStringWithValidationType()
      ] as Array<StringWithValidationState>;
    }

    /* set fields */
    public importActions(...actions: string[]) {
      /* clear existing values */
      this.actions = [];
      actions.forEach((a) => {
        this.actions.push(this.initStringWithValidationType(a));
      });
    }
    public addAction(...actions: string[]) {
      actions.forEach((a) => {
        this.actions.push(this.initStringWithValidationType(a));
      });
    }
    public setAction(index: number, action: string) {
      this.actions[index].value = action;
    }
    public removeAction(index: number) {
      this.actions.splice(index, 1);
    }
    /* validations */
    public validateActions() {
      let isValid = true;
      this.actions.forEach((e) => {
        isValid = this.validateAction(e);
      });
      return isValid;
    }
    public validateAction(action: StringWithValidationState) {
      let isValid = true;
      if (action.value === "") {
        action.isValid = false;
        action.errorMessage = "Required";
        isValid = false;
      } else {
        action.isValid = true;
        action.errorMessage = "";
      }
      return isValid;
    }
    public validateDefectForm() {
      const validations = [] as boolean[];
      validations.push(this.validateDescription());
      validations.push(this.validateActions());
      this.isValid = validations.every((x) => {
        return x == true;
      });
    }
    /* getters */
    get Actions(): StringWithValidationState[] {
      return this.actions;
    }
}
