import { ImageInfo } from "../ImageInfo"

export type Item = {
  key: string,
  itemType: string,
  value: string | string[] | ImageInfo[],
  style: string | any,
  caption: string | undefined,
  itemValue: string | undefined,
  valueType: string | undefined,
  taskValue: string | undefined,
  category: string | undefined,
  isTaskValue: boolean,
  categoryItemType: string,
  visibility: any,
  updatedDate: string | undefined,
  updatedBy: undefined | {
    name: string,
    id: string
  },
  mappingKeyId: string | undefined | string[] | any[]
  targetCalculateKeyId: undefined | string,
  customValidation?: string,
  disabledByItemKey?: string,
  brakeTypeItemKey?: string,
  // for FE only
  isCalculatingTrue: undefined | boolean,
  // wash2
  reasonList?: string[],
  reason?: string,
  imageMapping?: string,
  ratingType?: string
  taskType?: string,
  icon?: any,
  valueItemType?: string
}

export const CategoryItemTypeEnum = {
  PISTON_INPUT_A: "pistonMovementA",
  PISTON_INPUT_B: "pistonMovementB",
  PISTON_INPUT_RESULT: "pistonMovementResult",
  PISTON_INPUT_RATING: "pistonMovementRating",
  TARGET_RATING: "targetRating",
  TERGET_TOOL: "targetTool",
  PREVIOUS_VALUE_PISTON_A: "previousValuePistonA",
  PREVIOUS_VALUE_PISTON_B: "previousValuePistonB",
  PREVIOUS_VALUE_PISTON_RESULT: "previousValuePistonResult",
  PREVIOUS_VALUE_UOM: "previousValueUom",
  PREVIOUS_VALUE_PISTON_PERCENTAGE: "previousValuePistonPercentage",
  PREVIOUS_VALUE_PISTON_RATING: "previousValuePistonRating",
  BRAKE_TYPE_DROPDOWN: "brakeTypeDropdown",
  PREVIOUS_PARAM_RATING: "previousParamRating",
  PREVIOUS_TARGET_RATING: "previousTargetRating",
  DROPDOWN_TOOL: "dropdownTool",
};

export const ItemTypeEnum = {
  SMALL_CAMERA: "smallCamera",
  DROPDOWN: "dropDown",
  INPUT: "input"
}

export const BrakePackTypeDropdownValueEnum = {
  OIL_COOLED: "Oil Cooled",
  CALIPER: "Caliper"
}

export const JSONFieldEnum = {
  VALUE: "value",
  TASK_VALUE: "taskValue",
  UPDATED_BY: "updatedBy",
  UPDATED_DATE: "updatedDate",
  RATING: "rating"
}

export const CustomValidationEnum = {
  CBM_TAKE_PHOTO_ALL_RATING: "cbmTakePhotoAllRating"
}

export const ValueItemTypeEnum = {
  COMMENT: "comment"
}
