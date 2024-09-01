<template>
  <div :class="[widthStyle, potraitWidthStyle, paddingBottomCondition]" class="px-2 py-2 d-flex dropdown-eform-status" :style="style">
    <el-select
      v-model="inputValue"
      :placeholder="placeholderLabel"
      size="small"
      class="w-100"
      :disabled="disableCondition"
      :class="dropDownColor">
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
    <div v-if="itemRef.value === '2'  && task?.category == 'NORMAL'" class="ms-2">
      <img src="/media/logos/bumaau/defect.png" alt="defect" class="d-icon" @click="onDefectClickDetail" />
    </div>
    <div v-if="itemRef.value === '3' && (task?.category == 'NORMAL' || task?.category == 'CBM')" class="ms-2" @click="onNAClickDetail">
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
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
import {
  computed,
  defineProps,
  PropType,
  toRef,
  ref
} from 'vue'
import { isUndefined, isEqual, last } from 'lodash';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import Confirmation from '@/components/dialog/Confirmation.vue';
import {
  useInterimPreviewDefectFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewDefectFormStore';
import {
  useInterimPreviewCrackFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewCrackFormStore';
import {
  useInterimPreviewNaFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewNaFormStore';
import {
  useInterimPreviewFormStore
} from '@/store/pinia/dma/preview-form-interim/useInterimPreviewFormStore';
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string';
import {
  useNAReasonViewStore
} from "@/store/pinia/dma/e-form/na/useNAReasonViewStore";
import {
  ApprovalData
} from '@/core/types/entities/dma/e-form/defects/ApprovalData';

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
const store = useInterimPreviewFormStore();
const defectStore = useInterimPreviewDefectFormStore();
const crackStore = useInterimPreviewCrackFormStore()
const naStore = useInterimPreviewNaFormStore();
const confirmSubmitVisibility = ref(false);
const naReasonView = useNAReasonViewStore();

const onNAReasonClick = () => {
  naReasonView.setReason(props.task?.reason)
  naReasonView.setTitle(props.task?.description)
  naReasonView.setVisible(true)
};

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
  return true
})

const dropDownColor = computed(() => {
  const val = itemRef.value.value.toString().replaceAll("'", '');
  let color
  if (val == '1') {
    color = 'green'
  } else if (val == '2' || (val == '3' && taskPropsItem.value?.category == 'CRACK')) {
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

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  if (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow) {
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
const getApprovalData = async (params) => {
  const approvalData = await defectStore.getApprovalDefect(params)
  defectStore.setApprovalData(approvalData || {} as ApprovalData)
}
const onDefectClickDetail = (async () => {
  await defectStore.getDefectDetail(store.selectedGroup?.id as string, taskPropsItem.value?.key as string);
});
const onCrackClickDetail = (async () => {
  await crackStore.getCrackDetail(store.selectedGroup?.id as string, taskPropsItem.value?.key as string);
});
const onNAClickDetail = (async () => {
  await naStore.getNADetail(store.selectedGroup?.id as string, taskPropsItem.value?.key as string);
  await getApprovalData({
    workorder: store.generalForm.workOrder,
    taskId: taskPropsItem.value?.key
  })
});

const onConfirmSubmit = async () => {
  confirmSubmitVisibility.value = false;
}
const onConfirmCancel = () => {
  confirmSubmitVisibility.value = false;
}
const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  if (!isUndefined(props.task!.updatedBy!.name) && props.task!.updatedBy!.name) paddingBottom = ''
  return paddingBottom
})
</script>

<style scoped>
  .d-icon {
    width: 24px;
    cursor: pointer;
  }
</style>
