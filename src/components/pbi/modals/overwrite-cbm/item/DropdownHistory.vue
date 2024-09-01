<template>
  <div class="px-2 pt-2 dropdown-eform-status">
    <div class="px-0 mx-0 d-flex">
      <el-select
        v-model="inputValue"
        :placeholder="placeholderLabel"
        size="small"
        class="w-100"
        :disabled="readOnly"
        :class="dropDownColor"
        @change="handleChange"
        :key="triggerRender">
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
      <div v-if="(itemRef.value === '2'  && task?.category == 'NORMAL') && isUndefined(props.task!.showParameter)" class="ms-2 multiple-defect-badge"  @click="onDefectClickDetail">
        <img src="/media/logos/bumaau/detail.png" alt="defect" class="d-icon" />
        <span>+{{ defectListValue && defectListValue.length || 0 }}</span>
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
</template>

<script lang="ts" setup>
import { Item } from '@/core/types/entities/dma/e-form/Item';
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
import { useEFormStore } from "@/store/pinia/dma/e-form/useEFormStore";
import {
  useNAReasonViewStore
} from "@/store/pinia/dma/e-form/na/useNAReasonViewStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import {
  UpdateParam
} from "@/core/types/entities/dma/e-form/update-data/updateParam";
import { isUndefined, isEqual, last } from 'lodash';
import { Task } from '@/core/types/entities/dma/e-form/Task';
import { useNAFormStore } from '@/store/pinia/dma/e-form/na/useNAFormStore';
import {
  useCracksFormStore
} from '@/store/pinia/dma/e-form/cracks/useCracksFormStore';
import {
  useCameraStore
} from '@/store/pinia/application/useCameraStore';
import { addSpanOnHyphen } from '@/core/helpers/manipulate-html-string';
import {
  useGlobalConnectionStore
} from '@/store/pinia/application/useGlobalConnectionStore'
import { ElLoading } from 'element-plus';
import MultipleDefectListDialog from "@/views/dma/e-form/sub-group/task-group/task/item/dialog/MultipleDefectListDialog.vue"
import NAReasonDialog from "@/views/dma/e-form/components/NAReasonDialog.vue"
import { checkTaskEditSameFitter } from "@/store/pinia/dma/e-form/helpers"
import { Audit } from '@/core/types/intervention/Audit';
import Confirmation from '@/components/dialog/Confirmation.vue';

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
  }
});

const emits = defineEmits(["setLoading"])
const CBM = ["A", "B", "C", "X"]

const itemRef = toRef(props, 'item')
const taskPropsItem = toRef(props, 'task')
const authStore = useAuthenticationStore();
const store = useEFormStore();
const naReasonView = useNAReasonViewStore();
const defectStore = useDefectsFormStore();
const crackStore = useCracksFormStore();
const naStore = useNAFormStore();
const globalConnectionStore = useGlobalConnectionStore()
const confirmSubmitVisibility = ref(false);
const reRenderTrigger = ref(false);
const oldValue = ref("");
const taskKey = ref("");
const loadingIndicator = ref(false)
const camStore = useCameraStore()
const loadingContainer = ref(false)
const multiDefectListView = ref(false)
const viewReasonDialog = ref(false)
const naDetail = ref(null)
const confirmSubmitFromDefectVisibility = ref(false);
const mappingCamera = ref('')

const checkBoxList = ref([])

const updateCheckList = (val) => {
  checkBoxList.value = val
}
const showDefectForm = () => {
  if (checkBoxList.value.length < 1) {
    onConfirmCancel()
  } else {
    onConfirmSubmit()
  }
  checkBoxList.value = []
}

const defectListValue = computed(() => {
  const taskKey = props.task?.key || ""
  if (taskKey != "") {
    return store.multiDefectList[taskKey]
  }
  return []
})

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

const showCBMDefectC = ref(false)
const showCBMDefectX = ref(false)
const showTakePicture = ref(false)

const handleTriggerCamera = () => {
  if (props.task!.rating == "MANUAL_MOUNTING_LEAK" && mappingCamera.value != '') {
    camStore.toggleIsVisible(true, mappingCamera.value as string)
    camStore.setShowCloseButton(false)
  } else {
    props.task?.items.forEach((item) => {
      if (item.itemType === 'smallCamera') {
        camStore.toggleIsVisible(true, item.key as string)
        camStore.setShowCloseButton(false)
      }
    })
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
    console.log(taskPropsItem.value?.key)
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
  if (val == '1' && isUndefined(props.task!.showParameter)) {
    color = 'green'
  } else if ((val == '2' || (val == '3' && taskPropsItem.value?.category == 'CRACK')) && isUndefined(props.task!.showParameter)) {
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

const imageLength = computed(() => {
  let image: string[] = []
  props.task?.items.forEach((item) => {
    if (item.itemType === 'smallCamera') {
      image = item.value as string[]
    }
  })
  return image
})

const handleChange = async (val) => {
  updateData(val, true)
  if (props.task?.category == "CRACK") {
    await crackStore.setReferencePhoto(props.taskGroupName, store.getFieldValueByKey(props.item.imageMapping, "value"));
  }
}

const handleSaveReason = async (reasonResult) => {
  // klo save nanti nentuin mau ke ok atau defect & save hasil reasonnya apa
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
            propertyValue: '<<ServerDateTime>>'
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
            propertyValue: '<<ServerDateTime>>'
          },
        ]
      },
    ]
    const payload = [...taskValue, ...value]
    store.updateAllItems(itemRef.value.key, "1")
    await store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name)
    loader.close()
    reasonResult.afterSubmit()
  } else if ((itemRef.value.value == '2' && props.task?.category === 'NORMAL')) {
    viewReasonDialog.value = false
    defectStore.setTask(props.task as Task);
    defectStore.setItemKey(itemRef.value.key);
    confirmSubmitVisibility.value = true;
    defectStore.setItem(itemRef.value as Item)
    store.setReasonNA(reasonString)
  }
}
const handleCloseReason = async () => {
  // klo close nanti apa ya
  naDetail.value = null
  viewReasonDialog.value = false
}
const handleCancel = async () => {
  // klo masuk cancel berarti ke old value
  itemRef.value.value = oldValue.value
  handleCloseReason()
}

const updateData = async (val, triggerAskCamera, clearData = false, reason = '', fromOtherDialog = false) => {
  taskAlreadyUpdatedByOtherFitter.value = false
  if (!isUndefined(props.task?.updatedBy?.id)) emits("setLoading", true)
  store.setStateItemKey(itemRef.value.key as string)
  mappingCamera.value = ''
  if (props.item.categoryItemType == "brakeTypeDropdown") {
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
            propertyValue: val === "",
          },
          {
            propertyName: 'updatedDate',
            propertyValue: val === ""
          },
        ]
      }
    ]
    await store.updateItemServiceSheetDetail(taskValue)
  }
  if (props.item.categoryItemType == "dropdownTool" || props.item.categoryItemType == "dropdownToolDisc") {
    if (!globalConnectionStore.stateConnectionStatus) {
      globalConnectionStore.setSubmitConnectionError(true)
      itemRef.value.value = oldValue.value
      localStorage.removeItem("taskKey");
      return
    } else {
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
              propertyValue: val === "",
            },
            {
              propertyName: 'updatedDate',
              propertyValue: val === ""
            },
          ]
        }
      ]
      await store.updateItemServiceSheetDetail(taskValue)
      // update options value
      itemRef.value.value = val;
      // reset defect input
      // update uom (another item on this task)
      await store.updateToolUom(props.task!, itemRef.value)
      loadingIndicator.value = false
      emits("setLoading", false);
    }
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
            propertyValue: val === "" ? "" : '<<ServerDateTime>>'
          },
        ]
      },
    ]
    const updateStatus = await store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name)
    if (updateStatus) {
      itemRef.value.value = val
      // reset nya taro sini aja
      const promises: any[] = []
      store.dropdownToolGroup[props?.item.key]?.tasksReset.forEach((task) => {
        promises.push(new Promise((resolve) => {
          const taskData = store.getTaskDataBasedOnTaskKey(task)
          if (task) {
            store.resetCBMAutomation(taskData).then((res) => {
              resolve(res)
            })
          } else {
            resolve('')
          }
        }))
      });
      Promise.all(promises).then(async () => {
        loadingIndicator.value = false;
      })
    }
  } else {
    if (inputValue.value === val && !fromOtherDialog) return;
    if (val === props.task?.taskValue && !(defectCancel.value || crackCancel.value || naCancel.value)) return;
    resetAllDialog();
    if (defectCancel.value || crackCancel.value || naCancel.value) {
      oldValue.value = "";
      localStorage.removeItem("taskKey");
      return;
    } else {
      if (!globalConnectionStore.stateConnectionStatus) {
        globalConnectionStore.setSubmitConnectionError(true)
        localStorage.removeItem("taskKey");
        itemRef.value.value = oldValue.value
        return
      } else {
        emits("setLoading", true);
        loadingIndicator.value = true;
        if (!fromOtherDialog) {
          localStorage.setItem("taskKey", taskPropsItem.value?.key as string);
          oldValue.value = inputValue.value;
          taskKey.value = taskPropsItem.value?.key as string;
          itemRef.value.value = val;
        }
        // if (((oldValue.value == '3' && props.task?.category === 'NORMAL') || (oldValue.value == '4' && props.task?.category === 'CRACK')) && val != '' && !checkSameFitter.value) {
        if ((oldValue.value == '3' && props.task?.category === 'NORMAL') && val != '' && !checkSameFitter.value && !fromOtherDialog) {
          // NA Reason
          naDetail.value = await naStore.getNADetailValue(store.selectedGroup?.id as string, taskPropsItem.value?.key as string)
          viewReasonDialog.value = true
        } else if (((oldValue.value == '2' && props.task?.category === 'NORMAL') || (oldValue.value == '2' && props.task?.category === 'CRACK' || (oldValue.value == '3' && props.task?.category === 'CRACK'))) && !fromOtherDialog) {
          // Defect Confirm
          confirmSubmitFromDefectVisibility.value = true
        } else if ((val === '2' && props.task?.category === 'NORMAL') && isUndefined(props.task!.showParameter)) {
          // Defect
          defectStore.setTask(props.task as Task);
          defectStore.setItemKey(itemRef.value.key);
          confirmSubmitVisibility.value = true;
          defectStore.setItem(itemRef.value as Item)
        } else if ((val === '3' && props.task?.category === 'CRACK')) {
          // Crack
          crackStore.setTask(props.task as Task);
          crackStore.setItemKey(itemRef.value.key);
          crackStore.cretateInstance(true);
          await crackStore.getPreviousCrack(store.generalForm.workOrder, store.generalForm.modelId, store.generalForm.psTypeId, props.task.key);
          crackStore.toggleYesVisible(true);
        } else if ((val === '2' && props.task?.category === 'CRACK') && isUndefined(props.task!.showParameter)) {
          // Crack
          crackStore.setTask(props.task as Task);
          crackStore.setItemKey(itemRef.value.key);
          crackStore.cretateInstance(false);
          await crackStore.getPreviousCrack(store.generalForm.workOrder, store.generalForm.modelId, store.generalForm.psTypeId, props.task.key);
          crackStore.toggleNoVisible(true);
        } else if ((val === '3' && props.task?.category === 'NORMAL') || (val == '3' && itemRef.value.categoryItemType == 'resultStatus') ||
        (val === '4' && props.task?.category === 'CRACK')) {
          // NA
          naStore.setTask(props.task as Task);
          naStore.setItemKey(itemRef.value.key);
          naStore.toggleIsVisible(true);
          naStore.setItem(itemRef.value)
        } else if (props.task!.rating == "MANUAL_MOUNTING_LEAK" && props.task!.mappingCamera) {
          let loading
          loading = ElLoading.service({
            lock: true,
            text: '',
            background: 'rgba(0, 0, 0, 0.7)',
          })
          store.setMeasurementValueAndUOM('', '', props.task!.mappingCamera);
          const isUpdated = await store.updateCBMLeakMounting(props.task, val, itemRef.value) as boolean
          store.updateCameraItemCBMTakePhotoCompleteRating(props.task!.mappingCamera, props.item.key, val)
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
          // CBM C X
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
          const cameraItem = (props.task as Task).items.find((x) => {
            return x.itemType === 'smallCamera'
          });
          if (cameraItem) {
            store.setMeasurementValueAndUOM('', '', cameraItem.key);
          }
          const isUpdated = await store.updateDefect(props.task, val, itemRef.value) as boolean
          if (!isUndefined(itemRef.value.customValidation)) {
            const allRating = itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")
            const cbmRating = itemRef.value.customValidation!.includes("cbmTakePhoto")
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
          await store.updateDefectCalibrationDropdown(props.task!, itemRef.value)
          // val = oldValue.value
        } else {
          if (itemRef.value.value == "1" || itemRef.value.value == "") {
            store.updateAllItems(itemRef.value.key, itemRef.value.value)
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
          }
          if (oldValue.value) {
            if (props.task?.category === "CBM" || props.task?.category === "NORMAL" || props.task?.category === "CRACK") {
              await store.deleteDefect(props.task)
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
          }
          // if (val === "" || props.task?.taskValue === "1") return;
          const taskValue = {
            keyValue: taskPropsItem.value?.key as string,
            propertyParams: [
              {
                propertyName: 'taskValue',
                propertyValue: itemSent
              },
              {
                propertyName: 'updatedBy',
                propertyValue: val === "" ? "" : JSON.stringify(store.employee)
              },
              {
                propertyName: 'updatedDate',
                propertyValue: val === "" ? "" : '<<ServerDateTime>>'
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
          if (itemRef.value.categoryItemType == "resultRating") {
            if (props.task!.taskValue == "3" || props.task!.taskValue == "4") await store.deleteDefect(props.task!)

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
                  propertyValue: val === "" ? "" : '<<ServerDateTime>>'
                },
              ]
            },
          ]
          if (!isUndefined(itemRef.value.isTaskValue) && itemRef.value.isTaskValue) {
            payload.push(taskValue)
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
          await store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name).then((status) => {
            loadingIndicator.value = false
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
              // console.log(val, oldValue.value);
              if (val == "1") {
                if (oldValue.value == "") {
                  // console.log("setting input camera mandatory");
                  store.setInputCameraMandatoryKey(itemRef.value.key)
                  // console.log("🙄🙄", oldValue.value, itemRef.value.value);
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
          });
          if ((val == "A" || val == "B")) {
            if (!isUndefined(itemRef.value.customValidation) && itemRef.value.customValidation!.includes("cbmTakePhotoAllRating")) {
              loading.close()
            }
          }
        }
        loadingIndicator.value = false
        // to make input with timestamp have additional space
        // if (!isUndefined(itemRef.value.isTaskValue) && itemRef.value.isTaskValue) {
        //   loadingContainer.value = true
        // }
        loadingContainer.value = true
        emits("setLoading", false)
      }
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
  oldValue.value = itemRef.value.value as string
})

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
      const value = await store.getValueFromItemKey(itemRef.value.brakeTypeItemKey)
      store.pushStoredDisabledItems({
        key: itemRef.value.brakeTypeItemKey,
        value: value
      })
    }
    disabledItem = store.stateStoredBrakeTypeValue.find((disabled) => {
      return disabled.key == itemRef.value.brakeTypeItemKey
    })
    if (disabledItem?.value == '') {
      disabledByOtherItem.value = true
      if (props.task?.taskType == "inline") {
        if (itemRef.value.value) {
          updateData("", false)
        }
      }
    } else if (disabledItem?.value == 'Oil Cooled') {
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
    } else if (disabledItem?.value == 'Caliper') {
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
}

const disabledByOtherItem = ref(false)

watch(inputValue, async (newVal) => {
  pushDataIfBrakeTypeDropdown()
  checkBrake()
  updateStateDropdownToolGroup()
  if (!isUndefined(itemRef.value.disabledByItemKey)) {
    let disabledItem = store.stateStoredDisableKeyValue.find((disabled) => {
      return disabled.key == itemRef.value.disabledByItemKey
    })
    if (isUndefined(disabledItem)) {
      const value = await store.getValueFromItemKey(itemRef.value.disabledByItemKey)
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
  if (newVal == "3") {
    store.stateStoredDisableKeyValue.forEach((disableKey) => {
      if (disableKey.key == itemRef.value.disabledByItemKey) {
        disableKey.value = newVal
      }
    })
  }
}, { deep: true })

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
  defectStore.toggleNoVisible(false);
  defectStore.toggleViewNoVisible(false);
  defectStore.toggleViewYesVisible(false);
  crackStore.toggleYesVisible(false);
  crackStore.toggleNoVisible(false);
  crackStore.toggleViewNoVisible(false);
  crackStore.toggleViewYesVisible(false);
  naStore.toggleIsVisible(false);
  naStore.toggleIsViewVisible(false);
})

const options = computed(() => {
  const itemValArr = props.item.caption!.replace("[", "").replace("]", "").split("; ")
  const valArr = props.item.itemValue!.replace("[", "").replace("]", "").split(", ")
  let options = itemValArr.map((el, index) => {
    return {
      label: el.replaceAll("'", ''),
      value: valArr[index].replaceAll("'", '')
    }
  });

  // if (!checkSameFitter.value) {
  //   if ((props.task?.category == 'NORMAL' || props.task?.category == 'CRACK') && (inputValue.value == "1")) {
  //     // remove NA
  //     options = options.filter((opt) => {
  //       return !opt.label.includes("Not Applicable")
  //     });
  //   }
  // }
  // checkSameFitter.value &&
  if (inputValue.value != '' && !CBM.includes(inputValue.value)) {
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

const onDefectClickDetail = () => {
  multiDefectListView.value = true
};

const onMultiDefectDetailListDialogClose = () => {
  multiDefectListView.value = false
}

const onSelectFromMultiDefectDialog = (detail) => {
  defectStore.setDefectDetail(detail)
}

const onMultiDefectDetailAddDefect = () => {
  defectStore.setTask(props.task as Task);
  defectStore.setItemKey(itemRef.value.key);
  confirmSubmitVisibility.value = true;
  defectStore.setItem(itemRef.value as Item)
  multiDefectListView.value = false
}

const onCrackClickDetail = (async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Opening Form",
    background: "rgba(0, 0, 0, 0.7)",
  })
  await crackStore.getCrackDetail(store.selectedGroup?.id as string, taskPropsItem.value?.key as string);
  loading.close()
});
const onNAClickDetail = (async () => {
  const loading = ElLoading.service({
    lock: true,
    text: "Opening Form",
    background: "rgba(0, 0, 0, 0.7)",
  })
  await naStore.getNADetail(store.selectedGroup?.id as string, taskPropsItem.value?.key as string);
  loading.close()
});
const onNAReasonClick = () => {
  naReasonView.setReason(props.task?.reason)
  naReasonView.setTitle(props.task?.description)
  naReasonView.setVisible(true)
};
const updatedByTask = computed(() => {
  return props.task?.updatedBy
})

watch(updatedByTask, (newVal) => {
  if (newVal != "") {
    loadingContainer.value = false
  }
})

watch(() => {
  return defectStore.UpdateTaskDefect
}, (newVal) => {
  if (newVal == props.task?.key) {
    defectStore.setTask(props.task as Task);
    defectStore.setItemKey(itemRef.value.key);
    defectStore.setItem(itemRef.value as Item);
  }
})

watch(() => {
  return defectStore.UpdateTaskDefect
}, async (newVal) => {
  if (newVal != "" && (props.item.value === '2' && props.task?.category === 'NORMAL')) {
    oldValue.value = itemRef.value.value as string
    await store.getMultiDefectListPerKey(props.task?.key)
  }
})

watch(() => {
  return defectStore.stateUpdateTaskDefect
}, async (newValue) => {
  if (newValue == props.item.key) {
    oldValue.value = itemRef.value.value as string
    await store.getMultiDefectListPerKey(props.task?.key)
  }
})

watch(() => {
  return defectStore.OpenDialogConfirmSubmitDefect
}, (newVal) => {
  if (defectStore.UpdateTaskDefect == props.task?.key && newVal) {
    confirmSubmitVisibility.value = newVal
  }
})

const onConfirmSubmit = async () => {
  confirmSubmitVisibility.value = false;
  defectStore.cretateInstance(true);
  defectStore.toggleYesVisible(true);
}
const onConfirmCancel = () => {
  confirmSubmitVisibility.value = false;
  defectStore.cretateInstance(false);
  defectStore.toggleNoVisible(true);
}
const onCancel = () => {
  checkBoxList.value = []
  confirmSubmitVisibility.value = false;
  itemRef.value.value = oldValue.value;
  // reset reason
  store.setReasonNA("")
}

const onConfirmDefectCancel = async () => {
  itemRef.value.value = oldValue.value
  confirmSubmitFromDefectVisibility.value = false;
}
const onConfirmDefectSubmit = async () => {
  confirmSubmitFromDefectVisibility.value = false;
  updateData(itemRef.value.value, false, false, '', true)
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
  return true
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
  // console.log("🙄🙄", oldValue.value, itemRef.value.value);
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
</script>

<style scoped>
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
