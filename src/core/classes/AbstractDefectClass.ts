import { ImageObject } from "../types/entities/dma/ImageObject";
import {
  StringWithValidationState
} from "../types/misc/StringWithValidationState";
import { Validation } from "../types/misc/Validation";

export default abstract class AbstractDefectClass {
     protected images: Array<ImageObject>;
     protected assetNumber: string;
     protected description: StringWithValidationState;
     protected priority: string;
     protected isComplete: boolean;
     protected isValid: boolean;
     /* additional */
     protected raisedBy: string;
     protected date: string;
     protected title: string;
     protected type: string;

     constructor() {
       this.type = "";
       this.assetNumber = "";
       this.raisedBy = "";
       this.date = "";
       this.title = "";
       this.isValid = true;
       this.images = [] as Array<ImageObject>;
       /* field init */
       this.description = this.initStringWithValidationType();
       this.priority = "";
       this.isComplete = true;
     }

     /* methods */
     protected initValidationType() {
       return {
         isValid: true,
         message: ""
       } as Validation;
     }
     protected initStringWithValidationType(initValue = "") {
       return {
         value: initValue,
         isValid: true,
         errorMessage: ""
       } as StringWithValidationState;
     }
     protected initStringWithValidationTypeArray(initValue = "") {
       return [
         this.initStringWithValidationType(initValue)
       ] as Array<StringWithValidationState>;
     }

     /* set fields */
     public setType(type: string) {
       this.type = type;
     }
     public setRaisedBy(raisedBy: string) {
       this.raisedBy = raisedBy;
     }
     public setDate(date: string) {
       this.date = date;
     }
     public setAssetNumber(assetNumber: string) {
       this.assetNumber = assetNumber;
     }
     public addImages(...imageObject: ImageObject[]) {
       this.images = this.images.concat(imageObject);
     }
     public setDescription(desc: string) {
       this.description.value = desc;
     }
     public setTitle(title: string) {
       this.title = title;
     }
     public setPriority(priority: string) {
       this.priority = priority;
     }
     public setIsComplete(isComplete: boolean) {
       this.isComplete = isComplete;
     }
     /* validations */
     public validateDescription() {
       let isValid = true;
       if (this.description.value === "") {
         this.description.isValid = false;
         this.description.errorMessage = "Required";
         isValid = false;
       } else {
         this.description.isValid = true;
         this.description.errorMessage = "";
       }
       return isValid;
     }
     abstract validateDefectForm(): void;

     /* getters */
     get IsValid(): boolean {
       return this.isValid;
     }
     get Images(): ImageObject[] {
       return this.images;
     }
     get Description(): StringWithValidationState {
       return this.description;
     }
     get AssetNumber(): string {
       return this.assetNumber;
     }
     get RaisedBy(): string {
       return this.raisedBy;
     }
     get Date(): string {
       return this.date;
     }
     get Title(): string {
       return this.title;
     }
     get Priority(): string {
       return this.priority;
     }
     get IsComplete(): boolean {
       return this.isComplete;
     }
     get Type(): string {
       return this.type;
     }
}
