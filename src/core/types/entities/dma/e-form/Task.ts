import { Item } from "./Item"

export type Task = {
  key: string,
  taskType: string,
  isActive: boolean,
  isDeleted: boolean,
  updatedBy: undefined | {
    name: string,
    id: string
  } | string,
  updatedDate: string | undefined
  header: string,
  description: string,
  taskGroupName?: string, // title wash
  items: Item[],
  category: string,
  seqId: number,
  taskValue: string,
  rating: string,
  style: any,
  adjustment: any | {
    key: string,
    measurement: string,
    rating: string,
    description: string,
    pictures: [],
    updatedBy: {
      name: string,
      id: string
    } | string,
    updatedDate: string,
    uom: string,
    createdBy: {
      name: string,
      id: string
    },
    createdDate: string,
    commentLabel?: string,
    commentPlaceHolder?: string,
    commentValue?: string,
    isCommentAdjustment?: string
  },
  replacement: {
    commentLabel?: string,
    commentPlaceHolder?: string,
    commentValue?: string,
    createdBy: {
      name: string,
      id: string
    },
    createdDate: string,
    description: string,
    key: string,
    measurement: string,
    rating: string,
    uom: string,
    updatedBy: {
      name: string,
      id: string
    },
    updatedDate: string,
  },
  cleaned: {
    commentLabel?: string,
    commentPlaceHolder?: string,
    commentValue?: string,
    createdBy: {
      name: string,
      id: string
    },
    createdDate: string,
    description: string,
    key: string,
    measurement: string,
    rating: string,
    uom: string,
    updatedBy: {
      name: string,
      id: string
    },
    updatedDate: string,
    pictures: [],
  },
  showParameter?: string,
  groupTaskId?: string,
  parentGroupTaskId?: string,
  childGroupTaskId?: string,
  // for fe use only
  isShowAdjustmentRow: boolean,
  isShowReplacementRow: boolean,
  isShowCleanedRow: boolean,
  generalStyle: any,
  customStyle: any,
  triggerCaption: any,
  taskNormalValue: any,
  disabledByItemKey: any,
  reason?: string
  taskValueLeak?: string,
  taskValueMounting?: string,
  mappingToolGroup?: string,
  mappingCamera?: string,
  SectionData?: string,
  categoryTaskType?: string,
  commentId?: string,
}

export const CategoryTaskTypeEnum = {
  BRAKE_TYPE_DROPDOWN: "BRAKE_TYPE_DROPDOWN",
  BRAKE_TYPE_DROPDOWN_DISABLED: "BRAKE_TYPE_DROPDOWN_DISABLED",
}

export const ShowParametereEnum = {
  BRAKE_TYPE_CALIPER: "BRAKE_TYPE_CALIPER",
  BRAKE_TYPE_OIL_COOLED: "BRAKE_TYPE_OIL_COOLED",
}

export const TaskCategoryEnum = {
  CBM: "CBM",
}

export const TaskRatingEnum = {
  OIL_COOLED: "OIL_COOLED",
  CALIPER: "CALIPER",
  AUTOMATIC_PREVIOUS_GROUP: "AUTOMATIC_PREVIOUS_GROUP",
  MANUAL_CLEANED: "MANUAL_CLEANED"
}
