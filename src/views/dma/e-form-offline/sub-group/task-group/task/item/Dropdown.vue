<template>
  <div :class="[potraitWidthStyle, widthStyle, paddingBottomCondition]" class="px-2 pt-2 dropdown-eform-status" :style="style">
    <div class="px-0 mx-0 d-flex">
      <el-select
        v-model="inputValue"
        :placeholder="placeholderLabel"
        size="small"
        class="w-100"
        :disabled="readOnly"
        :class="[dropDownColor, brakeType, showParameterClassStyle]"
        @change="handleChange"
        :key="triggerRender">
        <el-option
          v-for="option in options"
          :key="option"
          :value="option.value"
        >
        <span v-html="option && option.label ? content(option && option.label): ''"></span>
        </el-option>
        <template v-if="inputValue" #prefix>
          <span class="el-input__custom-option" v-html="selectedOption"></span>
        </template>
      </el-select>
      <div v-if="(itemRef.value === '2'  && task?.category == 'NORMAL') && isUndefined(props.task!.showParameter) && props.task!.rating != 'SERVICE_CLEANED_AND_REPLACED'" class="ms-2 multiple-defect-badge" @click="onMultiDefectClickDetail">
        <img src="/media/logos/bumaau/detail.png" alt="defect" class="d-icon" />
        <span>+{{ defectListValue && defectListValue.length || 0 }}</span>
      </div>
      <div v-if="itemRef.value === '3' && (task?.category == 'NORMAL' || task?.category == 'CBM') && props.task!.rating != 'SERVICE_CLEANED_AND_REPLACED'" class="ms-2" @click="onNAClickDetail">
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
    <template v-if="loadingIndicator">
      <div class="ms-1 d-flex align-items-center">
        <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
          <span class="sr-only">Updating...</span>
        </div>
        <span class="timestamp-task">Updating...</span>
      </div>
    </template>
    <template v-if="loadingContainer">
      <div class="ms-1 d-flex align-items-center" style="opacity: 0;">
        <div class="spinner-border me-1" style="width: 1rem !important; height: 1rem !important;" role="status">
          <span class="sr-only">Updating...</span>
        </div>
        <span class="timestamp-task">Updating...</span>
      </div>
    </template>
  </div>
  <CBMDefectC :show="showCBMDefectC" @close="closeCBMDefectCModal"/>
  <CBMDefectX :show="showCBMDefectX" @close="closeCBMDefectXModal"/>
  <PriorityModal :show="priorityOptionVisibility"
    @submit="onPrioritySubmitted"
    @close="onPriorityCancel" />
  <template v-if="confirmSubmitVisibility">
    <DefectConfirmationDialog :show="confirmSubmitVisibility"
       @submit="showDefectForm"
       @close="onDefectRequiresCancel" />
  </template>
  <TakePhoto :show="showTakePicture" @close="handleTriggerCamera"/>
  <template v-if="multiDefectListView">
    <MultipleDefectListDialog
      :visibility="multiDefectListView"
      :defectList="defectListValue"
      :is-disabled="readOnlyMultipleDefect"
      :reason="props.task?.reason"
      @onClose="onMultiDefectDetailListDialogClose"
      @onOpenDetail="onSelectFromMultiDefectDialog"
      @onCancel="onMultiDefectDetailListDialogClose"
      @onAddDefect="onMultiDefectDetailAddDefect"
    />
  </template>
  <NAReasonDialog
    :na-detail="naDetail"
    :visibility="viewReasonDialog"
    @on-save="handleSaveReason"
    @on-close="handleCloseReason"
    @on-cancel="handleCancel"
  />
  <Confirmation :visibility="confirmSubmitFromDefectVisibility"
     caption="Are you sure to change this data? Defect data that already recorded will be deleted."
     @on-no-confirm="onConfirmDefectCancel"
     @on-yes-confirm="onConfirmDefectSubmit" />
  <Confirmation :visibility="isBrakeTypeOilCaliperPopUpShown"
     :caption=popUpBrakeOilCaliperMessage
     noLabel="Cancel"
     yesLabel="Yes, Continue"
     @on-no-confirm="toggleBrakeTypePopUp(false)"
     @on-yes-confirm="updateData(tempData, false)" />
  <Confirmation :visibility="isCalibrationResetPopUpShow"
     caption="Are you sure want to change it?"
     @on-no-confirm="cancelUpdateCalibraionData"
     @on-yes-confirm="handleUpdateCalibrationData" />
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
  watch,
  onMounted,
  defineEmits
} from 'vue'
import { useEFormStore } from "@/store/pinia/dma/e-form-offline/useEFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsStore";
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form-offline/defects/useDefectsFormStore";
import {
  UpdateParam
} from "@/core/types/entities/dma/e-form/update-data/updateParam";
import {
  isUndefined,
  isEqual,
  last,
  isEmpty,
} from 'lodash';
import {
  Task,
  CategoryTaskTypeEnum
} from '@/core/types/entities/dma/e-form/Task';
import {
  useNAFormStore
} from '@/store/pinia/dma/e-form-offline/na/useNAFormStore';
import {
  useCracksFormStore
} from '@/store/pinia/dma/e-form-offline/cracks/useCracksFormStore';
import CBMDefectC from './dialog/CBMDefectC.vue';
import CBMDefectX from './dialog/CBMDefectX.vue'
import {
  useOfflineCameraStore
} from '@/store/pinia/application/useOfflineCameraStore';
import TakePhoto from './dialog/TakePhoto.vue';
import DefectConfirmationDialog from './dialog/DefectConfirmationDialog.vue';
import PriorityModal from './dialog/PriorityModal.vue';
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string';
import { ElLoading } from 'element-plus';
import { AESTCurrentDateTime } from '@/core/helpers/date-format';
import MultipleDefectListDialog from "@/views/dma/e-form-offline/sub-group/task-group/task/item/dialog/MultipleDefectListDialog.vue"
import {
  useNAReasonViewStore
} from "@/store/pinia/dma/e-form/na/useNAReasonViewStore";
import NAReasonDialog from "@/views/dma/e-form/components/OfflineNAReasonDialog.vue"
import { checkTaskEditSameFitter } from "@/store/pinia/dma/e-form/helpers"
import { Audit } from '@/core/types/intervention/Audit';
import Confirmation from '@/components/dialog/Confirmation.vue';
import {
  setDefectIsActiveByTaskId
} from '@/core/helpers/ironforms/offline/defect-form';
import { deleteByWOItemKey } from "@/core/helpers/ironforms/offline/task";
import {
  ApprovalData
} from '@/core/types/entities/dma/e-form/defects/ApprovalData';
import {
  bindingKeyGeneratorServiceSheet
} from '@/core/helpers/binding-key-generator';
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"
import {
  PriorityEmitParam
} from '@/views/dma/e-form-offline/types/PriorityEmitParam';
import { TypeEmitParam } from '@/views/dma/e-form-offline/types/TypeEmitParam';
import {
  handleScrollToTopOfDialog
} from '@/core/helpers/ironforms/defects-form/defect-form';

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
  },
  itemLoading: {
    type: Boolean,
    default: false
  },
  taskGroupName: {
    type: String,
    required: false,
    default: ""
  },
  generalSubmitted: {
    required: true,
    type: Boolean
  }
});

const emits = defineEmits(["setLoading"])

const itemRef = toRef(props, 'item')
const taskPropsItem = toRef(props, 'task')
const authStore = useAuthenticationStore();
const store = useEFormStore();
const defectsStore = useDefectsStore();
const defectStore = useDefectsFormStore();
const crackStore = useCracksFormStore()
const naStore = useNAFormStore();
const priorityOptionVisibility = ref(false);
const confirmSubmitVisibility = ref(false);
const reRenderTrigger = ref(false);
const oldValue = ref("");
const taskKey = ref("");
const loadingIndicator = ref(false)
const camStore = useOfflineCameraStore()
const loadingContainer = ref(false)
const multiDefectListView = ref(false)
const naReasonView = useNAReasonViewStore();
const viewReasonDialog = ref(false)
const naDetail = ref(null)
const confirmSubmitFromDefectVisibility = ref(false);
const isCalibrationResetPopUpShow = ref(false)
const isCalled = ref('')
const isBrakeTypeOilCaliperPopUpShown = ref(false)

const popUpBrakeOilCaliperMessage = computed(() => {
  let message = "oil cooled"
  // check input value
  const value = itemRef.value.value
  // get negation
  const locOpt = options.value.filter((opt) => {
    return opt.value != value && opt.value != ""
  });

  if (locOpt.length > 0) {
    message = locOpt[0].label
  }

  const msg = `Are you sure want to change brake type to ${message}? Your progress will not be saved.`
  return msg;
})

const toggleBrakeTypePopUp = (status: boolean): void => {
  isBrakeTypeOilCaliperPopUpShown.value = status;
}
const isCrack = ref(false)
const isMonitor = ref(false)

const multiDefectList = computed(() => {
  return store.multiDefectList
})

const defectListValue = computed(() => {
  const taskKey = props.task?.key || ""
  if (taskKey != "") {
    return multiDefectList.value[taskKey]
  } else {
    return []
  }
})

const onPrioritySubmitted = (value: PriorityEmitParam) => {
  priorityOptionVisibility.value = false
  if (isCrack.value) {
    crackStore.setPredefinedPriority(value.priority)
  } else {
    defectStore.setPredefinedPriority(value.priority)
  }
  confirmSubmitVisibility.value = true
}

const setupDefect = (param: TypeEmitParam) => {
  defectStore.toggleIsNeed30Minutes(false)
  defectStore.setTask(props.task as Task);
  const isMinor = param.type == 'Less than 30 minutes labour and less than $250 in parts'
  defectStore.cretateInstance(!isMinor);
  defectStore.toggleIsNeed30Minutes(!isMinor)
  defectStore.setDefectRequirment(param.type)
  showF55Form(!isMinor)
  camStore.addLocalImageInfo({
    taskKey: props.task?.key,
    workOrder: store.generalForm.workOrder,
    type: 'defect',
    updatedBy: store.employee.id,
    email: authStore.user.Email,
  })
}

const setupCrack = async (param: TypeEmitParam) => {
  crackStore.setTask(props.task as Task);
  crackStore.setItemKey(itemRef.value.key);
  crackStore.cretateInstance(!isMonitor.value)
  crackStore.setDefectRequirment(param.type)
  if (!isOfflineOrSlowInternetConnection()) {
    crackStore.getPreviousCrackFromState(props.task?.key ?? '')
  } else {
    await crackStore.getPreviousCrackFromLocalDB(store.generalForm.workOrder, props.task?.key)
  }
  showCrackF55Form()
  camStore.addLocalImageInfo({
    taskKey: props.task?.key ?? '',
    workOrder: store.generalForm.workOrder,
    type: 'defect',
    updatedBy: store.employee.id,
    email: authStore.user.Email,
  })
  isCrack.value = false
}

const showDefectForm = async (param: TypeEmitParam) => {
  if (isCrack.value) {
    await setupCrack(param)
  } else {
    setupDefect(param)
  }
}

const triggerRender = computed(() => {
  return reRenderTrigger;
});

const defectCancel = computed(() => {
  return defectStore.Cancelled;
});
const crackCancel = computed(() => {
  return crackStore.Cancelled;
});
const naCancel = computed(() => {
  return naStore.Cancelled;
});

const isSubmited = computed(() => {
  return store.generalForm.status == 'Submited'
})

const showCBMDefectC = ref(false)
const showCBMDefectX = ref(false)
const showTakePicture = ref(false)
const mappingCamera = ref('')

const handleTriggerCamera = () => {
  camStore.addLocalImageInfo({
    taskKey: props.task?.key ?? '',
    workOrder: store.generalForm.workOrder,
    type: 'defect',
    updatedBy: store.employee.id,
    email: authStore.user.Email,
  })
  if (props.task?.rating == "MANUAL_MOUNTING_LEAK") {
    camStore.toggleIsVisible(true, mappingCamera.value as string)
    camStore.setShowCloseButton(false)
  } else {
    if (!isEmpty(smallCameraItem.value)) {
      camStore.toggleIsVisible(true, smallCameraItem.value.key as string)
      camStore.setShowCloseButton(false)
    }
  }
  showTakePicture.value = false
}

const placeholderLabel = computed(() => {
  let placeholderLabel = 'Choose One'
  if (!isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.placeholder)) placeholderLabel = itemRef.value.style.placeholder
  return placeholderLabel
})

/* watchers */
watch(defectCancel, (newValue) => {
  emits("setLoading", false)
  if (newValue === true) {
    if (itemRef.value?.categoryItemType == "resultRating") return;
    const taskKey = localStorage.getItem("taskKey");
    if (taskKey === taskPropsItem.value?.key as string) {
      itemRef.value.value = oldValue.value;
      reRenderTrigger.value = !reRenderTrigger.value;
      defectStore.setCancelledState(false);
      loadingIndicator.value = false;
    }
  }
});
watch(crackCancel, (newValue) => {
  emits("setLoading", false)
  if (newValue === true) {
    if (itemRef.value?.categoryItemType == "resultRating") return;
    const taskKey = localStorage.getItem("taskKey");
    if (taskKey === taskPropsItem.value?.key as string) {
      itemRef.value.value = oldValue.value;
      reRenderTrigger.value = !reRenderTrigger.value;
      crackStore.setCancelledState(false);
      loadingIndicator.value = false;
    }
  }
});
watch(naCancel, (newValue) => {
  emits("setLoading", false)
  if (newValue === true) {
    if (itemRef.value?.categoryItemType == "resultRating") return;
    const taskKey = localStorage.getItem("taskKey");
    if (taskKey === taskPropsItem.value?.key as string) {
      itemRef.value.value = oldValue.value;
      reRenderTrigger.value = !reRenderTrigger.value;
      naStore.setCancelledState(false);
      loadingIndicator.value = false;
    }
  }
});
const widthStyle = computed(() => {
  if (props.generalStyle) {
    return !isUndefined(itemRef.value.style) && itemRef.value.style.breakPoint != 'none' ? `col-${itemRef.value.style.breakPoint}` : "col"
  }
  return ''
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

const selectedOption = computed(() => {
  if (inputValue.value) {
    return options.value.find((val) => {
      return val.value == String(inputValue.value)
    })?.label
  }
  return inputValue.value
})

const dropDownColor = computed(() => {
  const val = itemRef.value.value.toString().replaceAll("'", '');
  let color
  if (val == '1' && isUndefined(props.task?.showParameter)) {
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

const smallCameraItem = computed(() => {
  const itemCamera = props.task?.items.find((item) => {
    if (item.itemType === 'smallCamera') {
      return item
    }
  }) || {} as Item
  return itemCamera
})

const imageLength = computed(() => {
  return smallCameraItem.value?.value || []
})

const handleChange = async (val) => {
  defectStore.setPredefinedPriority("")
  crackStore.setPredefinedPriority("")
  if (store.generalForm.status == "Submited") {
    store.toggleFormAlreadySubmitted(true)
    return
  }
  updateData(val, true)
  if ((val === '3' && props.task?.category === 'CRACK') || (val === '2' && props.task?.category === 'CRACK')) {
    await crackStore.setReferencePhoto(props.taskGroupName, store.getFieldValueByKey(props.item.imageMapping, "value"));
  }
}

const handleSaveReason = async (reasonResult) => {
  // klo save nanti nentuin mau ke ok atau defect & save hasil reasonnya apa
  const bindingKey = bindingKeyGeneratorServiceSheet(props.task as Task)
  const reasonString = reasonResult.selectedReason + ":" + reasonResult.desc
  if (itemRef.value.value == '1') {
    const loader = ElLoading.service({
      lock: true,
      text: 'Processing...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    const taskValue: UpdateParam[] = [
      {
        keyValue: taskPropsItem.value?.key as string,
        propertyParams: [
          {
            propertyName: 'taskValue',
            propertyValue: "1"
          },
          {
            propertyName: 'updatedBy',
            propertyValue: JSON.stringify(store.employee)
          },
          {
            propertyName: 'updatedDate',
            propertyValue: AESTCurrentDateTime()
          },
          {
            propertyName: 'reason',
            propertyValue: reasonString
          }
        ]
      }
    ]
    const value: UpdateParam[] = [
      {
        keyValue: itemRef.value.key,
        propertyParams: [
          {
            propertyName: 'value',
            propertyValue: '1'
          },
          {
            propertyName: 'updatedBy',
            propertyValue: JSON.stringify(store.employee)
          },
          {
            propertyName: 'updatedDate',
            propertyValue: AESTCurrentDateTime()
          },
        ]
      },
    ]
    const payload = [...taskValue, ...value]
    store.updateAllItems(itemRef.value.key, "1")
    if (!isOfflineOrSlowInternetConnection()) {
      await store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name)
    } else {
      await store.updateServiceSheetTaskOnLocalDB(payload, props.task?.key, props.item.key, false, bindingKey)
      await setDefectIsActiveByTaskId(store.stateWorkOrder, props.task?.key, "false")
    }
    loader.close()
    store.setReasonNA("")
    reasonResult.afterSubmit()
  } else {
    viewReasonDialog.value = false
    updateData(itemRef.value.value, false, false, '', true)
    store.setReasonNA(reasonString)
  }
}
const handleCloseReason = async () => {
  naDetail.value = null
  viewReasonDialog.value = false
}
const handleCancel = async () => {
  itemRef.value.value = oldValue.value
  handleCloseReason()
}

const cancelUpdateCalibraionData = () => {
  isCalibrationResetPopUpShow.value = false
  itemRef.value.value = oldValue.value
}

const handleUpdateCalibrationData = async () => {
  isCalibrationResetPopUpShow.value = false
  loadingIndicator.value = true
  emits("setLoading", true)
  await store.resetAdjustmentCalibration()
  await updateData(itemRef.value.value, false, false, '', true)
}

const tempData = ref("")

const updateData = async (val, triggerAskCamera, clearData = false, reason = '', fromOtherDialog = false) => {
  isCalled.value = ''
  isCrack.value = false
  isMonitor.value = false
  taskAlreadyUpdatedByOtherFitter.value = false
  const bindingKey = bindingKeyGeneratorServiceSheet(props.task as Task)
  if (!isUndefined(props.task?.updatedBy?.id)) emits("setLoading", true)
  store.setStateItemKey(itemRef.value.key as string)
  mappingCamera.value = ''
  if (props.item.categoryItemType == "brakeTypeDropdown") {
    // if condition is as is code
    // else if condition is new brake pack code, ticket BAA-11165 for 777fst etc
    if (isUndefined((props.task as Task).categoryTaskType)) {
      const taskValue = [
        {
          keyValue: taskPropsItem.value?.key as string,
          propertyParams: [
            {
              propertyName: 'taskValue',
              propertyValue: ""
            },
            {
              propertyName: 'updatedBy',
              propertyValue: "",
            },
            {
              propertyName: 'updatedDate',
              propertyValue: ""
            },
          ]
        }
      ]
      if (!isOfflineOrSlowInternetConnection()) {
        await store.updateItemServiceSheetDetail(taskValue)
      } else {
        await store.updateServiceSheetTaskOnLocalDB(taskValue, props.task!.key, props.item.key, false, bindingKey)
      }
    } else if (!isUndefined((props.task as Task).categoryTaskType) && props.task?.categoryTaskType == CategoryTaskTypeEnum.BRAKE_TYPE_DROPDOWN) {
      tempData.value = ""
      if (!isBrakeTypeOilCaliperPopUpShown.value) {
        tempData.value = val
        toggleBrakeTypePopUp(true);
        return
      }
      toggleBrakeTypePopUp(false);
      loadingIndicator.value = true;
      itemRef.value.value = val;
      // update stateSelectedBrakeTypeDropdown value
      store.updateSelectedBrakeTypeDropdownValue(val);
      // TODO: reset all task negation of the value task
      await store.updateBrakeTypeDropdownValueAndResetOtherType({
        task: props.task as Task,
        item: itemRef.value
      });
      // end the function because all item already sent on previous store function
      loadingIndicator.value = false;
      return;
    }
  }
  if (props.item.categoryItemType == "dropdownTool" || props.item.categoryItemType == "dropdownToolDisc") {
    store.toggleSetSelectedUOMToolTaskKey("")
    setTimeout(() => {
      store.toggleSetSelectedUOMToolTaskKey(props.task?.key ?? '')
    }, 100);
    loadingIndicator.value = true
    oldValue.value = inputValue.value;
    const taskValue = [
      {
        keyValue: taskPropsItem.value?.key as string,
        propertyParams: [
          {
            propertyName: 'taskValue',
            propertyValue: ""
          },
          {
            propertyName: 'updatedBy',
            propertyValue: "",
          },
          {
            propertyName: 'updatedDate',
            propertyValue: ""
          },
        ]
      }
    ]
    if (!isOfflineOrSlowInternetConnection()) {
      await store.updateItemServiceSheetDetail(taskValue)
    } else {
      await store.updateServiceSheetTaskOnLocalDB(taskValue, props.task?.key ?? '', props.item.key, false, bindingKey)
    }
    // update options value
    itemRef.value.value = val;
    // reset defect input
    // update uom (another item on this task)
    await store.updateToolUom(props.task as Task, itemRef.value, bindingKey)
    loadingIndicator.value = false
    emits("setLoading", false);
  } else if (props.item.categoryItemType == "dropdownToolGroup") {
    loadingIndicator.value = true;
    const payload: UpdateParam[] = [
      {
        keyValue: itemRef.value.key,
        propertyParams: [
          {
            propertyName: 'value',
            propertyValue: val
          },
          {
            propertyName: 'updatedBy',
            propertyValue: val === "" ? "" : JSON.stringify(store.employee)
          },
          {
            propertyName: 'updatedDate',
            propertyValue: val === "" ? "" : AESTCurrentDateTime()
          },
        ]
      },
    ]
    let updateStatus
    if (!isOfflineOrSlowInternetConnection()) {
      updateStatus = await store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name)
    } else {
      updateStatus = await store.updateServiceSheetTaskOnLocalDB(payload, props.task!.key, props.item.key, false, bindingKey)
    }
    if (updateStatus) {
      itemRef.value.value = val
      // reset nya taro sini aja
      const promises: any[] = []
      store.dropdownToolGroup[props?.item.key]?.tasksReset.forEach((task) => {
        promises.push(new Promise((resolve) => {
          const taskData = store.getTaskDataBasedOnTaskKey(task)
          if (task) {
            store.resetCBMAutomation(taskData, bindingKey).then((res) => {
              resolve(res)
            })
          } else {
            resolve('')
          }
        }))
      });
      Promise.all(promises).then(async () => {
        loadingIndicator.value = false;
        store.updateAdjustmentRow()
      })
    }
    // setTimeout(() => {
    // }, 500);
  } else {
    if (inputValue.value === val && !fromOtherDialog) return;
    if (val === props.task?.taskValue && !(defectCancel.value || crackCancel.value || naCancel.value)) return;
    resetAllDialog();
    if (defectCancel.value || crackCancel.value || naCancel.value) {
      oldValue.value = "";
      localStorage.removeItem("taskKey");
      return;
    } else {
      emits("setLoading", true);
      loadingIndicator.value = true;
      if (!fromOtherDialog) {
        localStorage.setItem("taskKey", taskPropsItem.value?.key as string);
        oldValue.value = inputValue.value;
        taskKey.value = taskPropsItem.value?.key as string;
        itemRef.value.value = val;
      }
      if (props.task?.rating != 'SERVICE_CLEANED_AND_REPLACED' && ((oldValue.value == '3' && props.task?.category === 'NORMAL') || (oldValue.value == '4' && props.task?.category === 'CRACK')) && val != '' && !checkSameFitter.value && !fromOtherDialog) {
        naDetail.value = await naStore.getNADetailValue(store.selectedGroup?.id as string, taskPropsItem.value?.key as string)
        viewReasonDialog.value = true
      } else if (props.task?.rating != 'SERVICE_CLEANED_AND_REPLACED' && ((oldValue.value == '2' && props.task?.category === 'NORMAL') || (oldValue.value == '2' && props.task?.category === 'CRACK' || (oldValue.value == '3' && props.task?.category === 'CRACK'))) && !fromOtherDialog) {
        // Defect Confirm
        const isTaskSylinderCalibration = props.task!.showParameter && props.task!.showParameter == "suspensionCylinder"
        if (!isTaskSylinderCalibration) {
          confirmSubmitFromDefectVisibility.value = true
        } else {
          let isResetPopUpShow = false
          for (const adjustedValue of store.stateStoredAdjustedSuspensionCylinderValue) {
            if (adjustedValue.value) {
              isResetPopUpShow = true
            }
          }
          if (!isResetPopUpShow) {
            await handleUpdateCalibrationData()
          } else {
            isCalibrationResetPopUpShow.value = true
          }
        }
      } else if (props.task?.rating != 'SERVICE_CLEANED_AND_REPLACED' && (val === '2' && props.task?.category === 'NORMAL') && isUndefined(props.task!.showParameter)) {
        defectStore.setTask(props.task as Task);
        defectStore.setItemKey(itemRef.value.key);
        priorityOptionVisibility.value = true;
        defectStore.setItem(itemRef.value as Item)
        camStore.addLocalImageInfo({
          taskKey: props.task.key,
          workOrder: store.generalForm.workOrder,
          type: 'defect',
          updatedBy: store.employee.id,
          email: authStore.user.Email,
        })
      } else if ((val === '3' && props.task?.category === 'CRACK')) {
        isCrack.value = true
        priorityOptionVisibility.value = true;
      } else if ((val === '2' && props.task?.category === 'CRACK')) {
        isMonitor.value = true
        isCrack.value = true
        priorityOptionVisibility.value = true;
      } else if (props.task?.rating != 'SERVICE_CLEANED_AND_REPLACED' && ((val === '3' && props.task?.category === 'NORMAL') || (val == '3' && itemRef.value.categoryItemType == 'resultStatus') ||
      (val === '4' && props.task?.category === 'CRACK'))) {
        naStore.setTask(props.task as Task);
        naStore.setItemKey(itemRef.value.key);
        naStore.toggleIsVisible(true);
        naStore.setItem(itemRef.value)
      } else if (props.task?.rating == "MANUAL_MOUNTING_LEAK" && props.task?.mappingCamera) {
        let loading
        loading = ElLoading.service({
          lock: true,
          text: '',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        store.setMeasurementValueAndUOM('', '', props.task!.mappingCamera);
        const isUpdated = await store.updateCBMLeakMounting(props.task, val, itemRef.value) as boolean
        store.updateCameraItemCBMTakePhotoCompleteRating(props.task!.mappingCamera, props.item.key, val)
        if (isOfflineOrSlowInternetConnection()) {
          store.handleGenerateLeakMounting()
        }
        loading.close()
        if (isUpdated) {
          // check udh keisi semua atau belum
          const isNotFilled = store.CameraItemCBMTakePhotoCompleteRating[props.task!.mappingCamera].filter((item) => {
            return item.value == ""
          })
          if (isNotFilled.length == 0) {
            const images = store.getFieldValueByKey(props.task!.mappingCamera, "value")
            // check jumlah item di item camera
            if (images == "" || images.length == 0) {
              // trigger camera
              store.setInputCameraMandatoryKey(itemRef.value.key)
              if (!taskAlreadyUpdatedByOtherFitter.value) {
                if (imageLength.value.length == 0) {
                  mappingCamera.value = props.task!.mappingCamera
                  showTakePicture.value = true
                }
              }
              taskAlreadyUpdatedByOtherFitter.value = false
            }
          }
        }
      } else if (val == 'C' || val == 'X') {
        let loading
        if (!isUndefined(itemRef.value.customValidation)) {
          const allRating = itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")
          const cbmRating = itemRef.value.customValidation!.includes("cbmTakePhoto")
          if (allRating || cbmRating) {
            loading = ElLoading.service({
              lock: true,
              text: '',
              background: 'rgba(0, 0, 0, 0.7)',
            })
          }
        }
        const cameraItem = smallCameraItem.value
        if (cameraItem) {
          store.setMeasurementValueAndUOM('', '', cameraItem.key);
        }
        let isUpdated = false
        isUpdated = await store.updateDefect(props.task, val, itemRef.value) as boolean
        if (!isUndefined(itemRef.value.customValidation)) {
          const allRating = itemRef.value.customValidation?.includes("cbmTakePhotoAllRating")
          const cbmRating = itemRef.value.customValidation?.includes("cbmTakePhoto")
          if (allRating || cbmRating) {
            loading.close()
          }
        }
        if (isUpdated) {
          // if (val == 'C') showCBMDefectC.value = true
          // if (val == 'X') showCBMDefectX.value = true
          if (val == 'C' || val == 'X') {
            if (triggerAskCamera) {
              store.setInputCameraMandatoryKey(itemRef.value.key)
              if (!taskAlreadyUpdatedByOtherFitter.value) {
                if (imageLength.value.length == 0) {
                  showTakePicture.value = true
                }
              }
              taskAlreadyUpdatedByOtherFitter.value = false
            }
          }
        }
      } else if (props.task!.showParameter == "suspensionCylinder" && val == "2") {
        loadingIndicator.value = true
        await store.updateDefectCalibrationDropdown(props.task, itemRef.value, bindingKey)
      } else if (((val == '2' || val == '3') && props.task?.category === 'NORMAL' && props.task?.rating == 'SERVICE_CLEANED_AND_REPLACED')) {
        let loading
        if (smallCameraItem.value && smallCameraItem.value.customValidation == 'cbmReplaceDefectTakePhoto' && imageLength.value.length == 0) {
          loading = ElLoading.service({
            lock: true,
            text: '',
            background: 'rgba(0, 0, 0, 0.7)',
          })
        }
        defectStore.setTask(props.task as Task);
        defectStore.setItemKey(itemRef.value.key);
        defectStore.setItem(itemRef.value as Item)
        isCalled.value = 'Defect Service Cleaned and Repaired'
        try {
          if (!isOfflineOrSlowInternetConnection()) {
            await defectStore.createSingleDefect(true, true);
            await store.getTaskProgress()
            await store.updateGroupByParam(store.stateSelectedGroup!.groupName)
          } else {
            await defectStore.updateDefectToLocalDB(true, true, false, true)
          }
        } finally {
          if (loading && loading.visible.value) {
            loading.close()
            showTakePicture.value = true
          }
          loadingIndicator.value = false
        }
      } else {
        if (itemRef.value.value == "1") {
          // check if offline
          // check all approved defects on task
          // if exist, show pop up
          if (isOfflineOrSlowInternetConnection()) {
            const checkDefectLocal = await store.checkApprovedLocalDefectOnTask({
              taskKey: props.task!.key
            });
            if (checkDefectLocal.isAlreadyHandledBySPV) {
              loadingIndicator.value = false;
              emits("setLoading", false);
              itemRef.value.value = oldValue.value;
              return;
            }
          }
          store.updateAllItems(itemRef.value.key, "1")
        }
        if (itemRef.value.value == "") {
          store.updateAllItems(itemRef.value.key, "")
        }
        let loading
        if (props.task?.category === "CBM") {
          if ((val == "A" || val == "B")) {
            if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")) {
              loading = ElLoading.service({
                lock: true,
                text: '',
                background: 'rgba(0, 0, 0, 0.7)',
              })
            }
          }
        } else if (taskPropsItem.value?.rating == 'SERVICE_CLEANED_AND_REPLACED' && val == "1") {
          if (smallCameraItem.value && smallCameraItem.value.customValidation == 'cbmReplaceDefectTakePhoto' && imageLength.value.length == 0) {
            loading = ElLoading.service({
              lock: true,
              text: '',
              background: 'rgba(0, 0, 0, 0.7)',
            })
          }
        }
        if (oldValue.value) {
          if (props.task?.category === "CBM" || props.task?.category === "NORMAL" || props.task?.category === "CRACK") {
            await store.deleteDefectOnLocal(props.task)
          }
        }
        let itemSent = itemRef.value.value.toString() ?? '1'
        if (props.task!.showParameter == "suspensionCylinder") {
          if (itemRef.value.value == "") {
            itemSent = ""
          } else {
            itemSent = "1"
          }
          store.updateStoredAdjustmentOptionValue(itemRef.value.value as string)
        } else if (props.task?.category == "NORMAL" || props.task?.category == "CRACK") {
          itemSent = val
        } else if (!isUndefined(itemRef.value.customValidation)) {
          const allRating = itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")
          const cbmRating = itemRef.value.customValidation!.includes("cbmTakePhoto")

          if (allRating || cbmRating) {
            if (itemRef.value.value == "" || val == "") {
              itemSent = ""
            }
          }
        }
        // if (val === "" || props.task?.taskValue === "1") return;
        const taskValue = {
          keyValue: taskPropsItem.value?.key as string,
          propertyParams: [
            {
              propertyName: 'taskValue',
              propertyValue: val == "" ? val : itemSent
            },
            {
              propertyName: 'updatedBy',
              propertyValue: val === "" ? "" : JSON.stringify(store.employee)
            },
            {
              propertyName: 'updatedDate',
              propertyValue: val === "" ? "" : AESTCurrentDateTime()
            },
          ]
        }

        // reason diinclude di setiap ganti jawaban (case 1 -> 3 padahal sudah pernah diganti dr 3 ke 1 -> reset reason)
        if (props.task?.category == "NORMAL") {
          taskValue.propertyParams.push(
            {
              propertyName: 'reason',
              propertyValue: reason
            }
          )
        }

        // -------- case reset na field -------
        let resetOtherItemFieldParam = {} as UpdateParam
        let taskNormalValueParam = {} as UpdateParam
        let naItemKey = ""
        if (itemRef.value.categoryItemType == "resultRating") {
          if (props.task?.taskValue == "3" || props.task?.taskValue == "4") {
            if (!isOfflineOrSlowInternetConnection()) {
              await store.deleteDefect(props.task as Task)
            } else {
              await store.deleteDefectOnLocal(props.task)
            }
          }

          taskNormalValueParam = {
            keyValue: props.task!.key,
            propertyParams: [
              {
                propertyName: 'taskNormalValue',
                propertyValue: ""
              },
            ]
          }
          props.task!.items.forEach((searchItem) => {
            if (searchItem.categoryItemType == "resultStatus") {
              naItemKey = searchItem!.key
              resetOtherItemFieldParam = {
                keyValue: searchItem!.key,
                propertyParams: [
                  {
                    propertyName: 'value',
                    propertyValue: ""
                  },
                  {
                    propertyName: 'updatedBy',
                    propertyValue: ""
                  },
                  {
                    propertyName: 'updatedDate',
                    propertyValue: ''
                  },
                ]
              }
            }
          })
        }
        // -------- case reset na field -------
        const payload: UpdateParam[] = [
          {
            keyValue: itemRef.value.key,
            propertyParams: [
              {
                propertyName: 'value',
                propertyValue: val
              },
              {
                propertyName: 'updatedBy',
                propertyValue: val === "" ? "" : JSON.stringify(store.employee)
              },
              {
                propertyName: 'updatedDate',
                propertyValue: val === "" ? "" : AESTCurrentDateTime()
              },
            ]
          },
        ]
        let isTaskValue = false
        if (!isUndefined(itemRef.value.isTaskValue) && itemRef.value.isTaskValue) {
          payload.push(taskValue)
          isTaskValue = true
        }
        if (itemRef.value.categoryItemType == "resultRating") {
          payload.push(resetOtherItemFieldParam)
          payload.push(taskNormalValueParam)
        }
        if (itemRef.value.categoryItemType == "resultStatus") {
          taskNormalValueParam = {
            keyValue: props.task!.key,
            propertyParams: [
              {
                propertyName: 'taskNormalValue',
                propertyValue: ""
              },
            ]
          }
          payload.push(taskValue)
          payload.push(taskNormalValueParam)
        }
        let status
        if (!isOfflineOrSlowInternetConnection()) {
          status = await store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name, true, props.task!.key)
        } else {
          await deleteByWOItemKey(store.stateGeneralForm.workOrder, naItemKey)
          await deleteByWOItemKey(store.stateGeneralForm.workOrder, `reset-${props.task!.key}`)
          status = await store.updateServiceSheetTaskOnLocalDB(payload, props.task!.key, props.item.key, false, bindingKey)
        }
        loadingIndicator.value = false
        emits("setLoading", false)
        store.setStateItemKey("")
        if (!status) {
          itemRef.value.value = oldValue.value
        } else {
          if (props.task?.category === "CBM") {
            if (val == "A" || val == "B") {
              store.setInputCameraMandatoryKey(itemRef.value.key)
              if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")) {
                if (!taskAlreadyUpdatedByOtherFitter.value) {
                  if (imageLength.value.length == 0) {
                    showTakePicture.value = true
                  }
                }
                taskAlreadyUpdatedByOtherFitter.value = false
              }
            }
          }
          if (val == "1") {
            if (oldValue.value == "") {
              store.setInputCameraMandatoryKey(itemRef.value.key)
              if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("normalTakePhoto")) {
                if (!taskAlreadyUpdatedByOtherFitter.value) {
                  if (imageLength.value.length == 0) {
                    showTakePicture.value = true
                  }
                }
                taskAlreadyUpdatedByOtherFitter.value = false
              }
              if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhoto")) {
                if (!taskAlreadyUpdatedByOtherFitter.value) {
                  if (imageLength.value.length == 0) {
                    showTakePicture.value = true
                  }
                }
                taskAlreadyUpdatedByOtherFitter.value = false
              }
            }
          }
          pushDataIfBrakeTypeDropdown()
        }
        if ((val == "A" || val == "B")) {
          if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")) {
            loading.close()
          }
        }

        if (taskPropsItem.value?.rating == 'SERVICE_CLEANED_AND_REPLACED' && val == "1") {
          if (loading && loading.visible.value) {
            loading.close()
            showTakePicture.value = true
          }
        }
      }
      loadingIndicator.value = false
      // to make input with timestamp have additional space
      // if (!isUndefined(itemRef.value.isTaskValue) && itemRef.value.isTaskValue) {
      //   loadingContainer.value = true
      // }
      if (updatedByTask.value == "" || (isUndefined(updatedByTask.value!.id) || updatedByTask.value!.id == "")) {
        loadingContainer.value = true
      }
      emits("setLoading", false)
    }
  }
}

const inputValue = computed(() => {
  return props.item.value.toString().replaceAll("'", '');
});

const pushDataIfBrakeTypeDropdown = () => {
  if (props.item.categoryItemType == "brakeTypeDropdown") {
    store.updateStoredBrakeTypeValue({
      key: itemRef.value.key,
      value: itemRef.value.value as string
    })
  }
}

const taskAlreadyUpdatedDialog = computed(() => {
  return store.taskAlreadyUpdated
})

const taskAlreadyUpdatedByOtherFitter = ref(false)

watch(taskAlreadyUpdatedDialog, async (newVal) => {
  if (newVal) taskAlreadyUpdatedByOtherFitter.value = true
})

onMounted(async () => {
  checkBrakeTypeDropdown()
  if (isOfflineOrSlowInternetConnection()) {
    pushDataIfBrakeTypeDropdown()
    checkBrake()
    handleDisableOtherItem()
    setTimeout(() => {
      updateStateDropdownToolGroup()
    }, 500)
  }
  oldValue.value = itemRef.value.value as string
  setTimeout(() => {
    resetCBMValue()
  }, 500);
})

const checkBrakeTypeDropdown = (): void => {
  if (!itemRef.value.categoryItemType) return;
  const isCategoryItemBrakeTypeDropdown = itemRef.value.categoryItemType == CategoryItemTypeEnum.BRAKE_TYPE_DROPDOWN
  const isCategoryTaskBrakeTypeDropdown = (props.task as Task).categoryTaskType && (props.task as Task).categoryTaskType == CategoryTaskTypeEnum.BRAKE_TYPE_DROPDOWN
  if (isCategoryItemBrakeTypeDropdown && isCategoryTaskBrakeTypeDropdown) {
    store.updateSelectedBrakeTypeDropdownValue(itemRef.value.value as string);
  }
}

const updateStateDropdownToolGroup = () => {
  if (itemRef.value.categoryItemType == "dropdownToolGroup") {
    store.setDropdownToolGroup(itemRef.value.key, inputValue.value)
  }
}

const checkBrake = async () => {
  if (!isUndefined(itemRef.value.brakeTypeItemKey)) {
    let disabledItem = store.stateStoredBrakeTypeValue.find((disabled) => {
      return disabled.key == itemRef.value.brakeTypeItemKey
    })
    if (isUndefined(disabledItem)) {
      let value = ''
      if (!isOfflineOrSlowInternetConnection()) {
        value = await store.getValueFromItemKey(itemRef.value.brakeTypeItemKey)
      } else {
        value = await store.getFieldValueByKey(itemRef.value.mappingKeyId, "value")
      }
      store.pushStoredDisabledItems({
        key: itemRef.value.brakeTypeItemKey,
        value: value
      })
    }
    disabledItem = store.stateStoredBrakeTypeValue.find((disabled) => {
      return disabled.key == itemRef.value.brakeTypeItemKey
    })
    if (!isUndefined(disabledItem)) {
      brakeTypeDisableConditionHandler(disabledItem.value)
    }
  }
}

const isNASuccessUpdateFromNetworkError = computed(() => {
  return naStore.stateUpdateSuccessFromNetworkError
})

watch(isNASuccessUpdateFromNetworkError, async (newVal) => {
  if (newVal) {
    await handleDisableOtherItem()
    naStore.toggleUpdateSuccessFromNetworkError(false)
  }
})

const brakeTypeDisableConditionHandler = (disabledItem) => {
  if (disabledItem == '') {
    disabledByOtherItem.value = true
    if (props.task?.taskType == "inline") {
      if (itemRef.value.value) {
        updateData("", false)
      }
    }
  } else if (disabledItem == 'Oil Cooled') {
    if (props.item.categoryItemType == "dropdownTool") {
      disabledByOtherItem.value = true
      if (props.task?.taskType == "inline") {
        if (itemRef.value.value) {
          updateData("", false)
        }
      }
    } else {
      disabledByOtherItem.value = false
    }
  } else if (disabledItem == 'Caliper') {
    if (props.item.categoryItemType == "dropdownToolDisc") {
      disabledByOtherItem.value = true
      if (props.task?.taskType == "inline") {
        if (itemRef.value.value) {
          updateData("", false)
        }
      }
    } else {
      disabledByOtherItem.value = false
    }
    if (props.item.categoryItemType == "dropdownTool") {
      if (props.item.value == "") {
        updateData(options.value[0].value, false)
      }
    }
  } else {
    disabledByOtherItem.value = false
  }
}

const disabledByOtherItem = ref(false)

const handleDisableOtherItem = async () => {
  if (!isUndefined(itemRef.value.disabledByItemKey)) {
    let disabledItem = store.stateStoredDisableKeyValue.find((disabled) => {
      return disabled.key == itemRef.value.disabledByItemKey
    })
    if (isUndefined(disabledItem)) {
      let value
      if (!isOfflineOrSlowInternetConnection()) {
        value = await store.getValueFromItemKey(itemRef.value.disabledByItemKey)
      } else {
        value = store.getFieldValueByKey(itemRef.value.disabledByItemKey, "value")
      }
      store.pushStoredDisabledItems({
        key: itemRef.value.disabledByItemKey,
        value: value
      })
    }
    disabledItem = store.stateStoredDisableKeyValue.find((disabled) => {
      return disabled.key == itemRef.value.disabledByItemKey
    })
    if (disabledItem?.value == '3') {
      disabledByOtherItem.value = true
      if (props.task?.taskType == "inline") {
        if (itemRef.value.value) {
          updateData("", false)
        }
      }
    } else {
      disabledByOtherItem.value = false
    }
  }
}

const resetCBMValue = () => {
  const isCBM = props.task?.category == "CBM"
  if (!isCBM) return
  const isHaveValidation = itemRef.value.customValidation
  if (!isHaveValidation) return
  const allRating = itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")
  const cbmRating = itemRef.value.customValidation!.includes("cbmTakePhoto")
  if (allRating || cbmRating) {
    const cameraItem = smallCameraItem.value
    if ((cameraItem?.value as any[]).length > 0) return
    if (!itemRef.value.value) return
    updateData("", false)
  }
}

watch(inputValue, async (newVal) => {
  updateStateDropdownToolGroup()
  pushDataIfBrakeTypeDropdown()
  checkBrake()
  await handleDisableOtherItem()
  if (!isOfflineOrSlowInternetConnection()) {
    store.stateStoredDisableKeyValue.forEach((disableKey) => {
      if (disableKey.key == itemRef.value.key) {
        disableKey.value = newVal
      }
    })
  }
}, { deep: true })

const isGetDataByParam = computed(() => {
  return store.stateGetDataByParam
})

watch(isGetDataByParam, async (newVal, oldVal) => {
  if (newVal) {
    await handleDisableOtherItem()
  }
})

const itemLoadingComp = computed(() => {
  return props.itemLoading
})

const showSCConfirmToSPC = () => {
  return store.stateShowSCConfirmToSPC
}

watch(showSCConfirmToSPC, (newVal) => {
  if (newVal) {
    if (!isUndefined(props.task?.showParameter) && props.task?.showParameter == "suspensionCylinder") {
      if (props.item.value != "") {
        updateData("", false)
      }
    }
  }
})

watch(itemLoadingComp, (newVal) => {
  loadingIndicator.value = newVal
})

const storedSuspensionCylinderValue = computed(() => {
  return store.stateStoredSuspensionCylinderValue
})

watch(storedSuspensionCylinderValue, (newVal) => {
  if (isUndefined(props.task?.showParameter) || props.task?.showParameter != "suspensionCylinder") return
  let suspensionNotFilled = false
  newVal.forEach((item) => {
    if (item.value == "") {
      suspensionNotFilled = true
    }
  })
  let allSuspensionInSpec = true
  if (!suspensionNotFilled) {
    newVal.forEach((item) => {
      if (item.value == "Out of spec" || item.value == "Out Spec") {
        allSuspensionInSpec = false
      }
    })
    if (allSuspensionInSpec) {
      if (itemRef.value.value == "") {
        updateData("No", false)
      }
    }
  }
}, { deep: true })

const resetAllDialog = (() => {
  defectStore.toggleYesVisible(false);
  defectStore.toggleViewYesVisible(false);
  crackStore.toggleYesVisible(false);
  crackStore.toggleViewYesVisible(false);
  naStore.toggleIsVisible(false);
  naStore.toggleIsViewVisible(false);
})

const CBM = ["A", "B", "C", "X"]

const options = computed(() => {
  const itemValArr = props.item.caption!.replace("[", "").replace("]", "").split("; ")
  const valArr = props.item.itemValue!.replace("[", "").replace("]", "").split(", ")
  let options = itemValArr.map((el, index) => {
    return {
      label: el.replaceAll("'", ''),
      value: valArr[index].replaceAll("'", '')
    }
  });

  if (!checkSameFitter.value) {
    const defectDefectVal = props.task?.category == 'NORMAL' && inputValue.value == "2"
    const crackDefectVal = props.task?.category == 'CRACK' && (inputValue.value == "2" || inputValue.value == "3")
    if ((props.task?.category == 'NORMAL' || props.task?.category == 'CRACK') && (inputValue.value == "1")) {
      // remove NA
      options = options.filter((opt) => {
        return !opt.label.includes("Not Applicable")
      });
    } else if (defectDefectVal || crackDefectVal) {
      // jika other fitter dan input defect atau crack maka hanya bisa pilih ok system || 1
      options = options.filter((opt) => {
        return opt.value.includes("1") || opt.value == inputValue.value
      });
    }
  }

  const categoryItemTypeIsBrakeTypeDropdown = props.item.categoryItemType == "brakeTypeDropdown"
  const categoryItemTypeIsDropdownTool = props.item.categoryItemType == "dropdownTool" || props.item.categoryItemType == "dropdownToolDisc"

  const hideResetCondition = categoryItemTypeIsBrakeTypeDropdown
  const showResetCondition = (categoryItemTypeIsDropdownTool || (checkSameFitter.value && !CBM.includes(inputValue.value)))

  if (inputValue.value != '' && !hideResetCondition && showResetCondition) {
    options.push({
      label: "Reset",
      value: "",
    });
  }
  return options
})

const style = computed(() => {
  const backGroundColor = !isUndefined(itemRef.value.style) && itemRef.value.style.bgColor != 'none' ? `background-color: ${itemRef.value.style.bgColor}; ` : ""
  const fontColor = !isUndefined(itemRef.value.style) && itemRef.value.style.fontColor != 'none' ? `color: ${itemRef.value.style.fontColor}; ` : ""
  const borderTop = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.top != 'none' ? `border-top: ${itemRef.value.style.border.top}; ` : ""
  const borderRight = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.right != 'none' ? `border-right: ${itemRef.value.style.border.right}; ` : ""
  let borderBottom = !isUndefined(itemRef.value.style) && !isUndefined(itemRef.value.style.border) && itemRef.value.style.border.bottom != 'none' ? `border-bottom: ${itemRef.value.style.border.bottom}; margin-bottom: 1rem;` : ""
  // check for condition CBM auto has additional row, jadi harus cek apakah menampilkan border dari item atau dari additional row
  const isReplacement = (!isUndefined(props.task?.isShowReplacementRow) && props.task?.isShowReplacementRow)
  const isAdjustment = (!isUndefined(props.task?.isShowAdjustmentRow) && props.task?.isShowAdjustmentRow)
  const isCleaned = (!isUndefined(props.task?.isShowCleanedRow) && props.task?.isShowCleanedRow)
  const isRepJust = isReplacement || isAdjustment || isCleaned || props.isShowAdjustment
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

const onMultiDefectClickDetail = (async () => {
  multiDefectListView.value = true
});

const onMultiDefectDetailListDialogClose = () => {
  multiDefectListView.value = false
  defectStore.toggleYesVisible(false);
  crackStore.toggleYesVisible(false);
}

const getApprovalData = async (params) => {
  const approvalData = await defectStore.getApprovalDefect(params)
  defectStore.setApprovalData(approvalData || {} as ApprovalData)
}

const onSelectFromMultiDefectDialog = async (defect) => {
  if (!defect.defectHeaderId) return
  camStore.reset()
  await defectsStore.setDefectData(defect.defectHeaderId)
  defectsStore.setDefectGeneralStatus(defect.defectHeaderId)
  defectsStore.setCompleteStatus(defectsStore.getCompleteStatus((defect.defectHeaderId)))
  defectsStore.setViewDefectVisible(true)
}

const onMultiDefectDetailAddDefect = () => {
  defectStore.setTask(props.task as Task);
  defectStore.setItemKey(itemRef.value.key);
  priorityOptionVisibility.value = true;
  defectStore.setItem(itemRef.value as Item);
  camStore.reset()
  multiDefectListView.value = false
}

const onCrackClickDetail = (async () => {
  const defectHeaderId = await crackStore.getCrackHeaderIdLocally(taskPropsItem.value?.key ?? '')
  if (!defectHeaderId) return
  camStore.reset()
  await defectsStore.setCrackData(defectHeaderId)
  defectsStore.setCrackGeneralStatus(defectHeaderId)
  defectsStore.setCompleteStatus(defectsStore.getCrackCompleteStatus((defectHeaderId)))
  defectsStore.setViewCrackVisible(true)
});
const onNAClickDetail = (async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Opening Form",
    background: "rgba(0, 0, 0, 0.7)",
  })
  const isOfflineTaskPending = await store.checkCurrentWoPendingOfflineTask()
  if (!isOfflineOrSlowInternetConnection() && !isOfflineTaskPending) {
    await naStore.getNADetail(store.selectedGroup?.id as string, taskPropsItem.value?.key as string);
  } else {
    await naStore.getNAFromLocalDB(taskPropsItem.value?.key as string)
  }
  await getApprovalData({
    workorder: store.generalForm.workOrder,
    taskId: taskPropsItem.value?.key
  })
  loading.close()
});

const onNAReasonClick = () => {
  naReasonView.setReason(props.task?.reason)
  naReasonView.setTitle(props.task?.description)
  naReasonView.setVisible(true)
};

const updatedByTask = computed(() => {
  return props.task?.updatedBy
});

watch(updatedByTask, (newVal) => {
  if (newVal != "" || (!isUndefined(newVal.id) && newVal.id != "")) {
    loadingContainer.value = false
  }
}, {
  deep: true
});

watch(() => {
  return defectStore.UpdateTaskDefect
}, (newVal) => {
  if (newVal == props.task?.key) {
    defectStore.setTask(props.task as Task);
    defectStore.setItemKey(itemRef.value.key);
    defectStore.setItem(itemRef.value as Item)
  }
});

watch(() => {
  return defectStore.UpdateTaskDefect
}, async (newVal) => {
  if (newVal != "" && (props.item.value === '2' && props.task?.category === 'NORMAL')) {
    if (isOfflineOrSlowInternetConnection()) {
      await defectStore.getMultipleDefectList(store.generalForm.workOrder, props.task.key, store.selectedGroup?.id)
    }
  }
});

watch(() => {
  return defectStore.stateUpdateTaskDefect
}, async (newValue) => {
  if (newValue == props.task?.key) {
    oldValue.value = itemRef.value.value as string
  }
});

watch(() => {
  return defectStore.OpenDialogConfirmSubmitDefect
}, (newVal) => {
  if (defectStore.UpdateTaskDefect == props.task?.key && newVal) {
    priorityOptionVisibility.value = newVal;
  }
});

const showCrackF55Form = async () => {
  isCalled.value = 'Crack Repaired';
  confirmSubmitVisibility.value = false;
  crackStore.toggleYesVisible(true);
}

const showF55Form = async (isMajor: boolean) => {
  confirmSubmitVisibility.value = false;
  defectStore.toggleYesVisible(true);
  isCalled.value = isMajor ? 'Defect Major' : 'Defect Minor';
  handleScrollToTopOfDialog('form-defect-yes-eform')
}

const onConfirmDefectCancel = async () => {
  itemRef.value.value = oldValue.value
  confirmSubmitFromDefectVisibility.value = false;
}
const onConfirmDefectSubmit = async () => {
  confirmSubmitFromDefectVisibility.value = false;
  updateData(itemRef.value.value, false, false, '', true)
}

const onCancel = () => {
  itemRef.value.value = oldValue.value
  defectStore.toggleYesVisible(false);
  crackStore.toggleYesVisible(false);
  // reset reason
  store.setReasonNA("")
}

const onPriorityCancel = () => {
  priorityOptionVisibility.value = false
  onCancel()
}

const onDefectRequiresCancel = () => {
  confirmSubmitVisibility.value = false
  onCancel()
}

const closeCBMDefectCModal = () => {
  showCBMDefectC.value = false
}

const closeCBMDefectXModal = () => {
  showCBMDefectX.value = false
}

const checkSameFitter = computed(() => {
  return checkTaskEditSameFitter(taskPropsItem.value!.updatedBy || "", store.employee as Audit)
})

const readOnly = computed(() => {
  if (!props.generalSubmitted) return true
  // condiiton untuk brake pack yang hanya bisa caliper
  const isBrakeTypeDropdownDisabled = (props.task as Task).categoryTaskType && (props.task as Task).categoryTaskType == CategoryTaskTypeEnum.BRAKE_TYPE_DROPDOWN_DISABLED
  if (isBrakeTypeDropdownDisabled) return true 
  let sameFitter = true
  if (!isUndefined(taskPropsItem.value!.updatedBy!) && !isUndefined(taskPropsItem.value!.updatedBy!.id) && taskPropsItem.value?.updatedBy.toString() != '') {
    if (store.employee.id != taskPropsItem.value!.updatedBy!.id) {
      const defectDefectVal = props.task?.category == 'NORMAL' && inputValue.value == "2"
      const crackDefectVal = props.task?.category == 'CRACK' && (inputValue.value == "2" || inputValue.value == "3")
      if (defectDefectVal || crackDefectVal) {
        sameFitter = true
      } else {
        sameFitter = false
      }
    }
  }

  const optionOK = options.value.find((opt) => {
    return opt.label.includes("1 - OK, System Working")
  })

  const optionComplete = options.value.find((opt) => {
    return opt.label.includes("1 - Complete")
  })

  const normalCategory = (itemRef.value.value == "3" || (itemRef.value.value == "1" && optionOK)) && taskPropsItem.value?.category == 'NORMAL'
  const crackCategory = (itemRef.value.value == "1" || itemRef.value.value == "4") && taskPropsItem.value?.category == 'CRACK'
  const cbmCategory = taskPropsItem.value?.category == 'CBM'
  const serviceCleanAndReplace = taskPropsItem.value?.category == 'NORMAL' && taskPropsItem.value?.rating == 'SERVICE_CLEANED_AND_REPLACED'
  // to make other fitter can change Yes/No value calibration adjustment
  const calibrationAdjustmentCategory = itemRef.value.value && props.task.category == "NORMAL" && props.task.rating == "CALIBRATION"

  const completeSelected = ((itemRef.value.value == "1" && optionComplete))

  if (normalCategory || crackCategory || cbmCategory || calibrationAdjustmentCategory || serviceCleanAndReplace || completeSelected) {
    sameFitter = true
  }

  let defect = false

  let isSCAdjustmentYes = false
  if (!isUndefined(props.task?.showParameter) && props.task?.showParameter == "suspensionCylinder") {
    if (inputValue.value == 'Yes' || inputValue.value == "2") {
      // change to true to make when suspension yes, disabled
      isSCAdjustmentYes = false
    }
  }
  return !sameFitter || defect || disabledByOtherItem.value || loadingIndicator.value || isSCAdjustmentYes || isSubmited.value || props.task?.isShowCleanedRow
});

const readOnlyMultipleDefect = computed(() => {
  let sameFitter = true
  if (!isUndefined(taskPropsItem.value!.updatedBy!) && !isUndefined(taskPropsItem.value!.updatedBy!.id) && taskPropsItem.value?.updatedBy.toString() != '') {
    if (store.employee.id != taskPropsItem.value!.updatedBy!.id) {
      sameFitter = false
    }
  }
  return !sameFitter || disabledByOtherItem.value || loadingIndicator.value || isSubmited.value
});

const content = ((string) => {
  return addSpanOnHyphen(string)
})

const paddingBottomCondition = computed(() => {
  let paddingBottom = "pb-2"
  if (!isUndefined(props.task!.updatedBy!.name) && props.task!.updatedBy!.name) paddingBottom = ''
  return paddingBottom
})

const successUpdateItemKey = computed(() => {
  return naStore.stateSuccessUpdateItemKey
})

watch(successUpdateItemKey, (newValue) => {
  if (newValue == itemRef.value.key) {
    if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("normalTakePhoto")) {
      store.setInputCameraMandatoryKey(itemRef.value.key)
      if (!taskAlreadyUpdatedByOtherFitter.value) {
        if (imageLength.value.length == 0) {
          showTakePicture.value = true
        }
      }
      taskAlreadyUpdatedByOtherFitter.value = false
    }
  }
})

const isCameraError = computed(() => {
  return camStore.stateIsCameraError
})

watch(isCameraError, async (newValue) => {
  if (newValue) {
    if (store.stateInputCameraMandatoryKey == itemRef.value.key) {
      await updateData("", false, true)
      store.setInputCameraMandatoryKey("")
    }
  }
})

const disabledItemByKey = computed(() => {
  let val = ""
  if (!isUndefined(itemRef.value.disabledByItemKey)) {
    store.stateStoredDisableKeyValue.forEach((item) => {
      if (item.key == itemRef.value.disabledByItemKey) {
        val = item.value
      }
    })
  }
  return val
})

watch(disabledItemByKey, async () => {
  if (isOfflineOrSlowInternetConnection()) {
    await handleDisableOtherItem()
  }
})

const disabledItemByKeyBrakeType = computed(() => {
  let val = ""
  if (!isUndefined(itemRef.value.brakeTypeItemKey)) {
    store.stateStoredBrakeTypeValue.forEach((item) => {
      if (item.key == itemRef.value.brakeTypeItemKey) {
        val = item.value
      }
    })
  }
  return val
})

watch(disabledItemByKeyBrakeType, async () => {
  if (isOfflineOrSlowInternetConnection()) {
    brakeTypeDisableConditionHandler(disabledItemByKeyBrakeType.value)
  }
})

watch(() => {
  return defectStore.stateUpdateTaskDefect
}, async (newValue) => {
  if (newValue == props.item.key) {
    if (isOfflineOrSlowInternetConnection()) {
      await defectStore.getMultipleDefectList(store.generalForm.workOrder, props?.task?.key, store.selectedGroup?.id)
    }
  }
})
</script>

<style scoped>
  .el-input__prefix {
    top: 0px;
  }
  .d-icon {
    width: 24px;
    cursor: pointer;
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
