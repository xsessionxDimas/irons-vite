<template>
  <div :class="[widthStyle, potraitWidthStyle, paddingBottomCondition]" class="pt-2 px-2 d-flex d-flex justify-content-center" :style="style">
    <div class="px-2 w-100">
      <div class="form-check checkbox-success item-checkbox w-100 ps-0 d-flex">
        <div class="little-box rounded-circle d-flex flex-column justify-content-center cbm-confirm-checkbox"
          :class="'dot'">
          <div class="little-dot" v-if="!itemRef.value" @click="updateValue()"></div>
          <img src="/media/svg/dma/icons/Check.png" style="width:28px" @click="updateValue()" alt="" v-else />
          <div class="ms-1 d-flex align-items-center">
            <div v-if="loading" class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <span v-if="loading">Loading...</span>
          </div>
        </div>
        <span class="ms-2 flex-fill text-start">{{ status }}</span>
      </div>
      <!-- <div v-if="scValidation" class="w-100 text-start">
        <span class="text-danger">Required</span>
      </div> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { useEFormStore } from '@/store/pinia/dma/e-form/useEFormStore';
import {
  useSuspensionCylinderFormStore
} from '@/store/pinia/dma/e-form/useSuspensionCylinderFormStore';
import { isUndefined, isEqual, last } from 'lodash';
import {
  computed,
  defineProps,
  PropType,
  toRef,
  ref,
} from 'vue'

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true
  },
  task: {
    type: Object as PropType<Task>
  },
  generalStyle: {
    type: Boolean,
    default: true
  },
});

const suspensionCylinderFormStore = useSuspensionCylinderFormStore()
const store = useEFormStore()

const itemRef = toRef(props, 'item')
const taskPropsItem = toRef(props, 'task')
const loading = ref(false)

const updateValue = () => {
  if (!itemRef.value.value) {
    itemRef.value.value = "true"
  } else {
    itemRef.value.value = ""
  }
  console.log("perubahan status radio", itemRef.value.value);
  suspensionCylinderFormStore.updateValidationValue({
    key: itemRef.value.key,
    value: itemRef.value.value
  })
  // update item
  const paramItem = {
    keyValue: itemRef.value.key,
    propertyParams: [
      {
        propertyName: 'value',
        propertyValue: itemRef.value.value
      },
      {
        propertyName: 'updatedBy',
        propertyValue: JSON.stringify(store.employee)
      },
      {
        propertyName: 'updatedDate',
        propertyValue: '<<ServerDateTime>>'
      },
    ]
  }
  if (itemRef.value.value) {
    suspensionCylinderFormStore.addUpdateParams(paramItem)
  } else {
    suspensionCylinderFormStore.deleteParams(itemRef.value.key)
  }
  // update task
  const paramTask = {
    keyValue: taskPropsItem.value!.key,
    propertyParams: [
      {
        propertyName: 'taskValue',
        propertyValue: itemRef.value.value
      },
      {
        propertyName: 'updatedBy',
        propertyValue: JSON.stringify(store.employee)
      },
      {
        propertyName: 'updatedDate',
        propertyValue: '<<ServerDateTime>>'
      },
    ]
  }
  if (itemRef.value.isTaskValue) {
    if (itemRef.value.value) {
      suspensionCylinderFormStore.addUpdateParams(paramTask)
    } else {
      suspensionCylinderFormStore.deleteParams(taskPropsItem.value!.key)
    }
  }
}

// const scValidation = computed(() => {
//   if (suspensionCylinderFormStore.stateStatusValidation == "not passed") {
//     if (itemRef.value.isTaskValue) {
//       if (itemRef.value.value == "" || itemRef.value.value == "false") return true
//     }
//   }
//   return false
// })

const widthStyle = computed(() => {
  return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col"
});

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

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  // check for condition CBM auto has additional row, jadi harus cek apakah menampilkan border dari item atau dari additional row
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
      borderBottom = !props.task!.updatedBy?.name && !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem; ` : ""
    }
  }
  const borderLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.left != 'none' ? `border-left: ${itemRef.value.style.border.left}; ` : ""

  const borderRadiusTopRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topRight != 'none' ? `border-top-right-radius: ${itemRef.value.style.borderRadius.topRight}; ` : ""
  const borderRadiusBottomRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomRight != 'none' ? `border-bottom-right-radius: ${itemRef.value.style.borderRadius.bottomRight}; ` : ""
  const borderRadiusTopLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.topLeft != 'none' ? `border-top-left-radius: ${itemRef.value.style.borderRadius.topLeft}; ` : ""
  const borderRadiusBottomLeft = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.borderRadius) && itemRef.value.style.borderRadius.bottomLeft != 'none' ? `border-bottom-left-radius: ${itemRef.value.style.borderRadius.bottomLeft}; ` : ""

  return `${backGroundColor}${fontColor}${borderTop}${borderRight}${borderBottom}${borderLeft}${borderRadiusTopRight}${borderRadiusBottomRight}${borderRadiusTopLeft}${borderRadiusBottomLeft}`
})

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  if (!isUndefined(props.task!.updatedBy!.name) && props.task!.updatedBy!.name) paddingBottom = ''
  return paddingBottom
})

const status = computed(() => {
  let status = 'Not Complete'
  if (itemRef.value.value == 'true') status = "Complete"
  return status
})

// ---------- VUE EVENTS ----------
// ---------- VUE EVENTS ----------

</script>
<style lang="scss">
  .item-checkbox {
    .form-check-input:checked {
      background-color: #18AF4A;
      border-color: #18AF4A;
    }
  }
</style>
<style lang="scss" scoped>
  @import "@/assets/sass/pages/defect.panel.scss";
</style>
