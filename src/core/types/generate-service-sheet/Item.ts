import { Style } from './Style'

export type Item = {
  key: string,
  itemType: string,
  caption: string,
  itemValue: string,
  value: string,
  valueType: string,
  categoryItemType?: string,
  disabledByItemKey?: string,
  style: Style,
  customValidation?: string,
  updatedBy?: string,
  updatedDate?: string
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
