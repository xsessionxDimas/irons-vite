<template>
  <div class="row w-100">
    <div class="col-1 pb-1 px-2"></div>
    <div class="col-1 pb-1 px-2" :style="[`border-left: ${borderLeft}`]"></div>
    <div class="col-4 col-md-3 pb-1 px-2" :style="[]">
      {{ task.replacement.description }}
    </div>
    <div class="col-1 pb-1 px-2"></div>
    <div class="col-2 pb-1 px-2" :style="[]">
      <el-input
        ref="replacementInput"
        v-model="inputValue"
        size="small"
        placeholder="Please Input"
        @keypress="onlyNumber"
        @focusout="changeEventToValue"
        inputmode="numeric"
        :readonly="readOnly"
        :disabled="isReplacementInputDisabled"
      />
      <template v-if="validation != ''">
        <label class="text-danger ps-2 font-weight-bold">{{ validation }}</label>
      </template>
      <template v-if="loadingIndicator">
        <div class="d-flex align-items-center">
          <div
            class="spinner-border me-1"
            style="width: 1rem !important; height: 1rem !important"
            role="status"
          >
            <span class="sr-only">Loading...</span>
          </div>
          <span class="timestamp-task">Updating...</span>
        </div>
      </template>
    </div>
    <div class="col-1 pb-1 px-2" :style="[]">
      {{ task.replacement.uom }}
    </div>
    <div class="col-1 col-md-1 pb-1 px-2 input-eform-status" :style="[]">
      <el-input
        v-model.lazy="taskVal.replacement.rating"
        size="small"
        disabled
        :class="dropDownColor"
      />
    </div>
    <div class="col-2 pb-1 px-2" :style="[`border-right: ${borderLeft}`]">
      <el-button
        :disabled="readOnly"
        type="danger"
        size="small"
        class="item-button w-100"
        @click="handleResetReplacement"
        >Delete</el-button
      >
    </div>
  </div>
  <div v-if="task.replacement.updatedBy!.name" class="row w-100">
    <div
      class="d-flex justify-content-end py-1 col-11 offset-1 timestamp-task"
      :style="[`border-left: ${borderLeft}; border-right: ${borderLeft}`]"
    >
      {{ task.replacement.updatedBy!.name }},
      {{ task.replacement.updatedDate! }}
    </div>
  </div>
  <template v-if="!isUndefined(taskVal.replacement.commentValue)">
    <div class="row w-100">
      <div class="col-1 pb-1 px-2"></div>
      <div
        class="col-1 pb-1 px-2"
        :style="[`border-left: ${borderLeft}`, taskBorderBottom]"
      ></div>
      <div class="col-5 col-md-4 pb-1 px-2" :style="[taskBorderBottom]">
        {{ task.replacement.commentLabel }}
      </div>
      <div
        class="col-5 col-md-6 pb-1 px-2"
        :style="[taskBorderBottom, `border-right: ${borderLeft}`]"
      >
        <el-input
          v-model.lazy="taskVal.replacement.commentValue"
          size="small"
          :placeholder="taskVal.replacement.commentPlaceHolder"
          @focusout="changeCommentToValue"
          :readonly="readOnly"
          :disabled="disabledCond"
        />
        <template v-if="loadingCommentIndicator">
          <div class="d-flex align-items-center">
            <div
              class="spinner-border me-1"
              style="width: 1rem !important; height: 1rem !important"
              role="status"
            >
              <span class="sr-only">Loading...</span>
            </div>
            <span class="timestamp-task">Updating...</span>
          </div>
        </template>
      </div>
    </div>
  </template>
  <TakeReplacementPhoto
    :show="showReplacementPhotoDialog"
    :item="inputItem"
    :tool="replacementTool"
    side="cab side"
    @close="onCloseReplacementDialog" />
  <ErrorBox
    :visibility="isOutOfRangeValidationShow"
    :isCloseButtonShow="false"
    :caption="'Out Of Range'"
    @on-close="() => { isOutOfRangeValidationShow = false }" />
</template>

<script lang="ts" setup>
import {
  defineProps,
  PropType,
  computed,
  toRef,
  ref,
  onMounted,
  defineEmits,
} from "vue";
import { Task } from "@/core/types/entities/dma/e-form/Task";
import { isUndefined } from "lodash";
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore";
import {
  useOfflineCameraStore
} from "@/store/pinia/application/useOfflineCameraStore";
import { ElLoading } from "element-plus";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  useTaskReplacement
} from '@/core/helpers/ironforms/useTaskReplacement';
import { Item } from "@/core/types/entities/dma/e-form/Item";
import TakeReplacementPhoto from './item/dialog/TakeReplacementPhoto.vue';
import { maximumFiveDigitWithTwoFraction } from "@/core/helpers/number-format";
import ErrorBox from '@/components/alert/ErrorBox.vue'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import { Group } from "@/core/types/entities/dma/e-form/group";

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true,
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  } 
});
const emits = defineEmits(["showTaskAdjustment"])

const eformStore = useEFormStore();
const taskVal = toRef(props, "task");
const showReplacementPhotoDialog = ref(false)
const taskReplacement = useTaskReplacement(eformStore.stateSelectedGroup as Group)
const replacementTool = ref('')
const validation = ref('')
const isOutOfRangeValidationShow = ref(false)

const inputItem = computed(() => {
  let inpItem = {} as Item
  props.task.items.forEach((item) => {
    if (item.categoryItemType == "paramRating") {
      inpItem = item
    }
  })
  return inpItem
})

const isReplacementInputDisabled = computed(() => {
  if (!props.generalSubmitted) return true
  return props.task.rating == "AUTOMATIC_REPLACEMENT_GAP"
})

const disabledCond = computed(() => {
  if (!props.generalSubmitted) return true
  return false
})

const inputValue = computed({
  get: () => {
    return taskVal.value.replacement.measurement
  },
  set: (value) => {
    // if (validateDecimalNumber(value)) taskVal.value.replacement.measurement = formatNumberOnInput(value);
    const val = value as string
    if (isNaN(Number(val))) {
      return
    } else {
      if (val.length > 8) {
        return
      } else {
        if ((`${val}`.split(".") || []).length - 1 > 1) {
          return
        } else {
          if (val.includes(".")) {
            const afterComma = `${val}`.split(".")[1]
            if (afterComma.length > 2) {
              return
            } else {
              taskVal.value.replacement.measurement = val
            }
          }
          if (val.length > 5) {
            if (val.length >= 6 && val.length <= 6) {
              if (val[5] != ".") {
                return
              } else {
                taskVal.value.replacement.measurement = val
              }
            }
          } else {
            taskVal.value.replacement.measurement
          }
        }
      }
    }
    taskVal.value.replacement.measurement = val
  }
})

const onCloseReplacementDialog = () => {
  if (inputItem.value.customValidation?.includes("cbmReplaceDefectTakePhoto")) {
    camStore.setShowCloseButton(false)
  }
  const task = taskReplacement.getCameraItem(props.task?.groupTaskId ?? "", eformStore.stateSelectedSubGroups)
  let cameraItem
  if (task) {
    cameraItem = task.items.find((x) => {
      return x.itemType === 'smallCamera'
    })
  }
  // check length
  if (cameraItem.value.length < 2) {
    camStore.toggleIsVisible(true, cameraItem.key as string)
  }
  let replacementTool
  switch (props.task?.SectionData) {
    case "HV Alternator":
      replacementTool = "alternator"
      break;
    case "Retarder Grid Box 1":
    case "Retarder Grid Box 2":
      replacementTool = "blower motor"
      break;
    default:
      break;
  }
  camStore.setReplacementTool(replacementTool)
  // set replacement tools
  // reset camStore
  showReplacementPhotoDialog.value = false
}

const readOnly = computed(() => {
  if (!props.generalSubmitted) return true
  let sameFitter = true;
  return !sameFitter;
});

const borderLeft = computed(() => {
  let borderLeft = "";
  props.task.items.forEach((element) => {
    if (
      !isUndefined(element.style) &&
      !isUndefined(element.style.border) &&
      element.style.border.left != "none"
    ) {
      borderLeft = element.style.border.left;
    }
  });
  return borderLeft;
});

const taskBorderBottom = computed(() => {
  let borderBottom = "";
  let hasBorderBottom = false;
  taskVal.value.items.forEach((item) => {
    if (
      !isUndefined(item.style) &&
      !isUndefined(item.style.border) &&
      item.style.border.bottom != "none"
    ) {
      hasBorderBottom = true;
    }
  });
  if (hasBorderBottom) borderBottom = `border-bottom: ${borderLeft.value}`;
  return borderBottom;
});

const replacementInput = ref<HTMLInputElement>();
const onlyNumber = ($event) => {
  let keyCode = $event.keyCode ? $event.keyCode : $event.which;
  if (keyCode == 13) {
    // Allow 13 (Enter) to calculate
    replacementInput.value?.blur();
    return;
  }
  if ((keyCode < 48 || keyCode > 57) && keyCode != 46) {
    $event.preventDefault();
  }
};

const camStore = useOfflineCameraStore();
const loadingIndicator = ref(false);
const authStore = useAuthenticationStore();
const loadingCommentIndicator = ref(false);

const handleUpdateComment = async (val) => {
  if (readOnly.value) return;
  if (val != oldCommentValue.value) {
    loadingCommentIndicator.value = true;
    const propertyParams = [
      {
        keyValue: props.task.replacement.key, // this will be replacement key
        propertyParams: [
          {
            propertyName: "commentValue",
            propertyValue: val,
          },
        ],
      },
    ];
    if (!isOfflineOrSlowInternetConnection()) {
      await eformStore.updateServiceSheetTaskValue(
        propertyParams,
        authStore.user.EmployeeId,
        authStore.user.Name,
      );
    } else {
      await eformStore.updateServiceSheetTaskOnLocalDB(propertyParams, props.task.replacement.key, `changeComment-${props.task.replacement.key}`)
    }
    loadingCommentIndicator.value = false;
    oldCommentValue.value = val;
  }
}

const changeCommentToValue = async (event) => {
  let val = event.target.value;
  await handleUpdateComment(val)
};

const handleUpdateValue = async (val) => {
  if (readOnly.value) return;
  const loader = ElLoading.service({
    lock: true,
    text: "Updating...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  if (val != oldValue.value) {
    loadingIndicator.value = true;
    // update measuremnt
    taskVal.value.replacement.measurement = val;
    const rating = await eformStore.getReplacementRating(taskVal.value);
    if (!rating) {
      isOutOfRangeValidationShow.value = true
      setTimeout(() => {
        isOutOfRangeValidationShow.value = false
      }, 2000)
      oldValue.value = ""
      // validation.value = 'Out Of Range'
      val = ""
      taskVal.value.replacement.measurement = ""
    } else {
      oldValue.value = val;
    }
    loadingIndicator.value = false;
  }
  loader.close();
}

const checkCBMDecimal = () => {
  if (!isUndefined(inputValue.value == "")) return true
  const validFormat = maximumFiveDigitWithTwoFraction(inputValue.value as string);
  if (!validFormat) {
    validation.value = "max. 2 decimal digits"
    return false
  }
  return true
}

const changeEventToValue = async (event) => {
  let formattedVal = parseFloat(event.target.value);
  if (isNaN(formattedVal)) {
    formattedVal = event.target.value
  }
  let val = String(formattedVal)
  let clientValidationPassed = checkCBMDecimal()
  if (clientValidationPassed) {
    await handleUpdateValue(val)
  }
};

const handleResetReplacement = async () => {
  if (taskVal.value.replacement.measurement) {
    const loading = ElLoading.service({
      lock: true,
      text: "Deleting Replacement",
      background: "rgba(0, 0, 0, 0.7)",
    });
    await eformStore.deleteReplacementTask(taskVal.value);
    loading.close();
    camStore.setCurrent(`${taskVal.value.key}-replacement`);
    camStore.clearCurrent();
  }
  taskVal.value.isShowReplacementRow = false;
  emits("showTaskAdjustment", false)
};

const dropDownColor = computed(() => {
  const val = taskVal.value.replacement.rating;
  let color;
  if (val == "A") {
    color = "a";
  } else if (val == "B") {
    color = "b";
  } else if (val == "C") {
    color = "c";
  } else if (val == "X") {
    color = "x";
  }
  return color;
});

const oldValue = ref("");
const oldCommentValue = ref("");
const oldReplacementVal = ref("");
onMounted(async () => {
  if (!isUndefined(taskVal.value.replacement.commentValue)) {
    if (taskVal.value.replacement.commentValue) {
      oldCommentValue.value = taskVal.value.replacement.commentValue;
    } else {
      const commentVal = ""
      taskVal.value.replacement.commentValue = commentVal
      handleUpdateComment(commentVal)
    }
  }
  if (eformStore.stateIsReplaceValue) {
    await handleUpdateValue(taskVal.value.replacement.measurement)
    eformStore.toggleIsReplaceValue(false)
  }
  oldValue.value = taskVal.value.replacement.measurement;
  oldReplacementVal.value = taskVal.value.replacement.measurement;
});
</script>
