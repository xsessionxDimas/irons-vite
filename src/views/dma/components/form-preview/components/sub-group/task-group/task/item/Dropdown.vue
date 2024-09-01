<template>
  <div :class="[widthStyle, potraitWidthStyle, paddingBottomCondition]" class="px-2 pt-2 d-flex dropdown-eform-status" :style="style">
    <el-select
      v-model="inputValue"
      :placeholder="placeholderLabel"
      size="small"
      class="w-100"
      :disabled="disableCondition"
      :class="[dropDownColor, dropdownToolStyle, brakeType, showParameterClassStyle]">
      <el-option
          v-for="option in options"
          :key="option"
          :value="option.value"
        >
        <span v-html="option && option.label ? content(option && option.label): ''"></span>
        </el-option>
        <!-- label if selected -->
        <template v-if="inputValue" #prefix>
          <span class="el-input__custom-option" v-html="selectedOption"></span>
        </template>
      </el-select>
    <!-- icon detail -->
    <div v-if="(itemRef.value === '2'  && task?.category == 'NORMAL') && isUndefined(props.task!.showParameter)  && props.task!.rating != 'SERVICE_CLEANED_AND_REPLACED'" class="ms-2 multiple-defect-badge" @click="onDefectClickDetail">
      <img src="/media/logos/bumaau/detail.png" alt="defect" class="d-icon" />
      <span style="word-break: normal;">+{{ defectListValue && defectListValue.length || 0 }}</span>
    </div>
    <div v-if="itemRef.value === '3' && (task?.category == 'NORMAL' || task?.category == 'CBM')  && props.task!.rating != 'SERVICE_CLEANED_AND_REPLACED'" class="ms-2" @click="onNAClickDetail">
      <img src="/media/logos/bumaau/na.png" alt="na" class="d-icon" />
    </div>
    <div v-if="itemRef.value === '2' && task?.category == 'CRACK'" class="ms-2" @click="onCrackClickDetail">
      <img src="/media/logos/bumaau/defect.png" alt="defect" class="d-icon" />
    </div>
    <div v-if="itemRef.value === '3' && task?.category == 'CRACK'" class="ms-2" @click="onCrackClickDetail">
      <img src="/media/logos/bumaau/defect.png" alt="defect" class="d-icon" />
    </div>
    <div v-if="itemRef.value === '4'" class="ms-2" @click="onNAClickDetail">
      <img src="/media/logos/bumaau/na.png" alt="na" class="d-icon" />
    </div>
    <div v-if="itemRef.value === '1' && task?.reason && task?.reason != ''" class="ms-2" @click="onNAReasonClick">
      <img src="/media/logos/bumaau/ok.png" alt="ok" class="d-icon" />
    </div>
  </div>
  <Confirmation :visibility="confirmSubmitVisibility"
     caption="Have you done personal Pre-Task Risk Assessment?"
     @on-no-confirm="onConfirmCancel"
     @on-yes-confirm="onConfirmSubmit" />

  <MultipleDefectListDialog
    :visibility="multiDefectListView"
    :defectList="defectListValue"
    :is-disabled="true"
    :reason="props.task?.reason"
    @onClose="onMultiDefectDetailListDialogClose"
    @onOpenDetail="onSelectFromMultiDefectDialog"
    @onCancel="onMultiDefectDetailListDialogClose"
  />
</template>

<script lang="ts" setup>
import {
  Item,
  CategoryItemTypeEnum
} from '@/core/types/entities/dma/e-form/Item';
import {
  computed,
  defineProps,
  PropType,
  toRef,
  ref,
  onMounted,
  watch,
} from 'vue'
import { isUndefined, isEqual, last } from 'lodash';
import {
  Task,
  CategoryTaskTypeEnum
} from '@/core/types/entities/dma/e-form/Task';
import Confirmation from '@/components/dialog/Confirmation.vue';
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsStore";
import {
  usePreviewNaFormStore
} from '@/store/pinia/dma/preview-form/usePreviewNaFormStore';
import {
  usePreviewFormStore
} from '@/store/pinia/dma/preview-form/usePreviewFormStore';
import {
  useNAReasonViewStore
} from "@/store/pinia/dma/e-form/na/useNAReasonViewStore";
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string';
import MultipleDefectListDialog from "@/views/dma/e-form/sub-group/task-group/task/item/dialog/MultipleDefectListDialog.vue"
import {
  ApprovalData
} from '@/core/types/entities/dma/e-form/defects/ApprovalData';
import { Audit } from '@/core/types/intervention/Audit';
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsFormStore";
import {
  useCracksFormStore
} from '@/store/pinia/dma/e-form-offline/cracks/useCracksFormStore';
import {
  useOfflineCameraStore
} from '@/store/pinia/application/useOfflineCameraStore';

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object as PropType<Task>
  },
  generalStyle: {
    type: Boolean,
    default: true
  }
});

const itemRef = toRef(props, 'item')
const taskPropsItem = toRef(props, 'task')
const store = usePreviewFormStore();
const defectsStore = useDefectsStore();
const defectStore = useDefectsFormStore();
const crackStore = useCracksFormStore()
const naStore = usePreviewNaFormStore();
const naReasonView = useNAReasonViewStore();
const camStore = useOfflineCameraStore()

const confirmSubmitVisibility = ref(false);
const multiDefectListView = ref(false)

const brakeType = computed(() => {
  let brakeClass = ''
  const braketypes = ['brakeTypeDropdown', 'dropdownTool', 'dropdownToolDisc']
  if (braketypes.includes(props.item.categoryItemType)) {
    brakeClass = 'breaktype'
  }
  return brakeClass
})

const showParameterClassStyle = computed(() => {
  let showParameterClass = ''
  if (props.task?.showParameter == "suspensionCylinder") {
    showParameterClass = 'suspensionCylinder'
  }
  return showParameterClass
})

const defectListValue = computed(() => {
  const taskKey = props.task?.key || ""
  if (taskKey != "") {
    return store.multiDefectList[taskKey]
  }
  return []
})

const widthStyle = computed(() => {
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col"
  }
  return ''
})

const potraitWidthStyle = computed(() => {
  let customClass = ''
  if (props.generalStyle) {
    const hasStyle = !isUndefined(itemRef.value.style)
    if (hasStyle) {
      const hasPotraitBreakPoint = !isUndefined(itemRef.value.style.potraitBreakPoint)
      if (hasPotraitBreakPoint && itemRef.value.style.breakPoint != 'none') {
        customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`

        customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
      } else {
        customClass = `col-md-${itemRef.value.style.potraitBreakPoint}`

        customClass = `${customClass} col-lg-${itemRef.value.style.breakPoint}`
      }
    }
  }
  return customClass
})

const placeholderLabel = computed(() => {
  let placeholderLabel = 'Choose One'
  if (!isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.placeholder)) placeholderLabel = itemRef.value.style.placeholder
  return placeholderLabel
})

const disableCondition = computed(() => {
  if (window.location.href.includes("render-template")) return false
  if (!isUndefined(props.task?.showParameter) && props.task?.showParameter == "suspensionCylinder") {
    if (inputValue.value == 'Yes' || inputValue.value == "2") {
      return true
    }
  }
  return true
})

const dropdownToolStyle = computed(() => {
  let customClass = ''
  if (props.item.categoryItemType == "dropdownToolGroup") {
    customClass = 'dropdown-tool'
  }
  return customClass
})

const dropDownColor = computed(() => {
  const val = itemRef.value.value.toString().replaceAll("'", '');
  let color
  if (val == '1' && isUndefined(props.task!.showParameter)) {
    color = 'green'
  } else if ((val == '2' || (val == '3' && taskPropsItem.value?.category == 'CRACK')) && isUndefined(props.task!.showParameter) || (val == '3' && taskPropsItem.value?.rating == 'SERVICE_CLEANED_AND_REPLACED')) {
    color = 'red'
  } else if ((val == '3' && (taskPropsItem.value?.category == 'NORMAL' || itemRef.value.categoryItemType == 'resultStatus')) || val == '4') {
    color = 'yellow'
  } else if (val == 'A') {
    color = 'a'
  } else if (val == 'B') {
    color = 'b'
  } else if (val == 'C') {
    color = 'c'
  } else if (val == 'X') {
    color = 'x'
  }
  return color
})

const selectedOption = computed(() => {
  if (inputValue.value) {
    return options.value.find((val) => {
      return val.value == String(inputValue.value)
    })?.label
  }
  return inputValue.value
})

const inputValue = computed({
  get: () => {
    return props.item.value.toString().replaceAll("'", '');
  },
  set: (val) => {
    console.log(val);
  },
});

const options = computed(() => {
  const itemValArr = props.item.caption!.replace("[", "").replace("]", "").split("; ")
  const valArr = props.item.itemValue!.replace("[", "").replace("]", "").split(", ")
  const options = itemValArr.map((el, index) => {
    return {
      label: el.replaceAll("'", ''),
      value: valArr[index].replaceAll("'", '')
    }
  });
  return options
})

const content = ((string) => {
  return addSpanOnHyphen(string)
})

const onMultiDefectDetailListDialogClose = () => {
  multiDefectListView.value = false
}

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  const isReplacement = (!isUndefined(props.task?.isShowReplacementRow) && props.task?.isShowReplacementRow)
  const isAdjustment = (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow)
  const isCleaned = (!isUndefined(props.task?.isShowCleanedRow) && props.task?.isShowCleanedRow)
  const isRepJust = isReplacement || isAdjustment || isCleaned
  if (isRepJust) {
    borderBottom = ''
  } else {
    // get total col for border bottom (if 12 this means full table and the border bottom must be below timestamp)
    // otherwise border bottom must be below item
    let totalCol = 0
    props.task?.items.forEach((item) => {
      if (!isUndefined(item.style)) {
        if (!isUndefined(item.style.border)) {
          if (item.style.border.right == 'none' || isUndefined(item.style.border.right)) {
            totalCol = totalCol + Number(item.style.breakPoint)
          }
          if (isEqual(item, last(props.task?.items))) {
            totalCol = totalCol + Number(item.style.breakPoint)
          }
        } else if (isUndefined(item.style.border)) {
          totalCol = totalCol + Number(item.style.breakPoint)
        }
      }
    })
    if (totalCol == 12) {
      borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem; ` : ""
    }
  }
  const borderLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.left != 'none' ? `border-left: ${itemRef.value.style.border.left}; ` : ""

  const borderRadiusTopRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topRight != 'none' ? `border-top-right-radius: ${itemRef.value.style.borderRadius.topRight}; ` : ""
  const borderRadiusBottomRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomRight != 'none' ? `border-bottom-right-radius: ${itemRef.value.style.borderRadius.bottomRight}; ` : ""
  const borderRadiusTopLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topLeft != 'none' ? `border-top-left-radius: ${itemRef.value.style.borderRadius.topLeft}; ` : ""
  const borderRadiusBottomLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemRef.value.style.borderRadius.bottomLeft}; ` : ""

  // kondisi kalau dia row terakhir table (border bottom at last index)
  let paddingBottom = ''
  if (borderBottom) {
    paddingBottom = 'padding-bottom: 25px; '
  }
  return `${paddingBottom}${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
});

const onCrackClickDetail = (async () => {
  const defectHeaderId = await crackStore.getCrackHeaderIdLocally(taskPropsItem.value?.key as string, store.generalForm.workOrder)
  if (!defectHeaderId) return
  camStore.reset()
  await defectsStore.setCrackData(defectHeaderId)
  defectsStore.setCompleteStatus(defectsStore.getCrackCompleteStatus(defectHeaderId))
  defectsStore.setViewCrackVisible(true)
});
const onNAClickDetail = (async () => {
  await naStore.getNADetail(store.selectedGroup?.id as string, taskPropsItem.value?.key as string);
  await getApprovalData({
    workorder: store.generalForm.workOrder,
    taskId: taskPropsItem.value?.key
  })
});
const onNAReasonClick = () => {
  naReasonView.setReason(props.task?.reason)
  naReasonView.setTitle(props.task?.description)
  naReasonView.setVisible(true)
};
const onConfirmSubmit = async () => {
  confirmSubmitVisibility.value = false;
}
const onConfirmCancel = () => {
  confirmSubmitVisibility.value = false;
}
const paddingBottomCondition = computed(() => {
  return (props.task?.updatedBy as Audit | undefined)?.name ? "" : "pb-2";
})

const onDefectClickDetail = (async () => {
  multiDefectListView.value = true
});
const getApprovalData = async (params) => {
  const approvalData = await defectStore.getApprovalDefect(params)
  defectStore.setApprovalData(approvalData || {} as ApprovalData)
}

const onSelectFromMultiDefectDialog = async (defect) => {
  if (!defect.defectHeaderId) return
  camStore.reset()
  await defectsStore.setDefectData(defect.defectHeaderId)
  defectsStore.setCompleteStatus(defectsStore.getCompleteStatus(defect.defectHeaderId))
  defectsStore.setViewDefectVisible(true)
}

onMounted(() => {
  checkBrakeTypeDropdown();
})

const checkBrakeTypeDropdown = (): void => {
  if (!itemRef.value.categoryItemType) return;
  const isCategoryItemBrakeTypeDropdown = itemRef.value.categoryItemType == CategoryItemTypeEnum.BRAKE_TYPE_DROPDOWN
  const isCategoryTaskBrakeTypeDropdown = (props.task as Task).categoryTaskType && (props.task as Task).categoryTaskType == CategoryTaskTypeEnum.BRAKE_TYPE_DROPDOWN
  if (isCategoryItemBrakeTypeDropdown && isCategoryTaskBrakeTypeDropdown) {
    store.updateSelectedBrakeTypeDropdownValue(itemRef.value.value as string);
  }
}

watch(inputValue, (newVal, oldVal) => {
  if (newVal != oldVal) {
    checkBrakeTypeDropdown();
  }
}, { deep: true })

</script>

<style scoped lang="scss">
  .el-input__prefix {
    top: 0px;
  }
  .d-icon {
    width: 24px;
    cursor: pointer;
  }
  .dropdown-tool {
    font-weight: 400;
    .el-input__custom-option {
      color: darkslategray;
    }
  }
  .multiple-defect-badge {
    display: flex;
    padding: 2px 6px;
    align-items: center;
    gap: 2px;
    border-radius: 6px;
    background: #FF4842;
    color: white;
    height: 32px;
  }
</style>
