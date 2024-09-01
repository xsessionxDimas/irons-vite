<template>
  <el-dialog v-model="dialogVisible"
    width="90%" center
    @closed="onFormClosed"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @opened="onFormOpened"
    :custom-class="`el-defect-crack-form-custom form-defect-no-eform ${customClass}`"
    :destroy-on-close="true"
    :before-close="handleBeforeClose"
  >
    <template #title>
      <span class="el-dialog__title">Detailed Information for Defect Identification</span>
      <span class="el-dialog__title task-title" v-html="title" ref="defectDetailRef" ></span>
    </template>
    <div>
      <div class="d-flex flex-column justify-content-between" v-if="generic">
        <div class="py-2 d-flex flex-row flex-grow-1">
          <div class="flex-fill">
              <div class="form-floating">
                <input type="text" class="form-control" v-model="taskDescription" @handleChange="handleTaskDescription">
                <label for="floatingInput">Task Description</label>
              </div>
          </div>
        </div>
        <div class="mt-1" v-if="!taskDescriptionValidation.isValid">
          <Label class="error-label">{{ taskDescriptionValidation.errorMessage }}</Label>
        </div>
      </div>
      <div class="d-flex flex-row justify-content-between">
          <div class="py-2 d-flex flex-row flex-grow-1">
            <div class="flex-fill">
              <div class="form-floating">
                <div type="text" class="form-control asset-number-disabled-div" v-html="assetNumber"></div>
                <label for="floatingInput">Asset Number</label>
              </div>
            </div>
            <div class="flex-fill ps-3">
              <div class="form-floating">
                <div type="text" class="form-control asset-number-disabled-div" v-html="serialNumber"></div>
                <label for="floatingInput">Serial Number</label>
              </div>
            </div>
            <div class="flex-fill ps-3">
              <div class="form-floating">
                <div type="text" class="form-control asset-number-disabled-div" v-html="formatOwnershipHTML"></div>
                <label for="floatingInput">Ownership</label>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between">
          <large-camera
          :id="'defect'"
          :disabled="false"
          :allow-delete="true"
          :is-monitoring="false"
          :is-mandatory="isCustomValidationNormalTakePhoto"
          :old-version="true" />
        </div>
        <template v-if="showCameraValidation">
          <Label class="error-label">Required</Label>
        </template>
        <div class="mt-1 py-2">
          <Textarea
            :value="data?.Description.value"
            :label="defectPlaceholder"
            name="defectPlaceholder"
            :errorMessage="data.Description.errorMessage"
            :is-valid="data.Description.isValid"
            @handleChange="onDescriptionChange"
          ></Textarea>
        </div>
        <div class="mt-1 py-2">
          <div class="row" style="width:101%">
            <div class="col-6 pe-0">
              <div class="form-floating">
                <input type="text" class="form-control" disabled :value="formStore.selectedFitter.name">
                <label>Raised By</label>
              </div>
            </div>
            <div class="col-6 pe-0">
              <div class="form-floating">
                <input type="text" class="form-control" disabled :value="current()" />
                <label>Date Raised</label>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="actionRepaired">
          <el-collapse-item title="Repairs Completed" name="Repairs Completed">
            <div class="p-2 d-flex" v-for="(item, index) in data.Actions" :key="index">
              <div class="d-flex flex-fill flex-column">
                <div class="mt-2">
                  <Textarea
                    :value="item.value"
                    label="Description of Repairs Completed"
                    name="DescriptionofRepairsCompleted"
                    errorMessage="Required"
                    :is-valid="item.isValid"
                    :index="index"
                    @handleChange="onActionChange"
                  ></Textarea>
                </div>
              </div>
              <div class="ms-4 d-flex align-items-center" :class="index === 0 ? 'hidden' : ''">
                <em class="fa fa-times" style="color:gray; cursor: pointer;" @click.prevent="onRemoveAction(index)"></em>
              </div>
            </div>
            <button class="my-3 btn-add-new" @click="onAddNewAction">
              <em class="fa fa-plus me-2"></em>
              Add new repair action
            </button>
          </el-collapse-item>
        </el-collapse>
        <div class="my-5 w-100">
          <button class="btn btn-success w-100" @click="onSubmitDefects"
          style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Submit</button>
        </div>
      </div>
      <Confirmation :visibility="confirmVisible"
          caption="Please confirm this defect information is correct."
          @on-no-confirm="onCancel"
          @on-yes-confirm="onSave" />
      <Confirmation :visibility="showConfirmExit"
          caption="Are you sure want to close the defect form? <br /> Note: By closing the defect form, you will lose your defect data that you have already inputted."
          @on-no-confirm="onCancelExit"
          @on-yes-confirm="onSaveExit" />
      <MessageBox
          :show="messageBoxVisible"
          message="Defect Information Successfully Submitted"
          :show-left-button="true"
          left-button-label="+ Add Another Defect"
          @left-button-action="onAddAnotherDefect"
          backgroundLeftButton="#18AF4A"
          colorLeftButton="#FFF"
          borderColorLeftButton="#18AF4A"
          backgroundRightButton="#FFF"
          colorRightButton="#18AF4A"
          borderColorRightButton="#18AF4A"
          @close="onOk"
        />
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps,
  toRef,
  PropType,
  ref,
  computed,
  watch,
  defineEmits
} from "vue";
import DefectNoClass from "@/core/classes/DefectNoClass";
import {
  AESTCurrentDateTime,
  getUTCOffsetDate
} from "@/core/helpers/date-format";
import { useCameraStore } from "@/store/pinia/application/useCameraStore";
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import { useEFormStore } from "@/store/pinia/dma/e-form/useEFormStore";
import {
  UpdateParam
} from "@/core/types/entities/dma/e-form/update-data/updateParam";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import Confirmation from "@/components/dialog/Confirmation.vue";
import LargeCamera from '@/components/camera/LargeCamera.vue';
import MessageBox from "@/components/dialog/MessageBox.vue";
import { ElLoading } from "element-plus";
import {
  useGeneralFormStore
} from "@/store/pinia/dma/e-form/useGeneralFormStore";
import { displayDesc } from "@/core/helpers/manipulate-html-string";
import {
  isUndefined,
  cloneDeep
} from 'lodash'
import Textarea from "@/components/inputs/dma/Textarea.vue";
import {
  TextareaParam
} from "@/core/types/misc/TextareaParam";
import {
  handleScrollToError,
  handleScrollToTopOfDialog
} from "@/core/helpers/ironforms/defects-form/defect-form"
import { v4 as uuidv4 } from 'uuid';
import {
  formatOwnership,
  disabledHyperlink,
  getTitle,
  hasDefectDataChanged
} from "@/store/pinia/dma/e-form/helpers";

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  generic: {
    required: false,
    type: Boolean,
    default: false
  },
  assetNumber: {
    required: true,
    type: String
  },
  defectData: {
    required: true,
    type: Object as PropType<DefectNoClass>
  },
  workorder: {
    required: false,
    type: String,
    default: ''
  },
  form: {
    required: false,
    type: String,
    default: ''
  },
});

const emits = defineEmits(['onRefreshData'])

const actionRepaired = ref('Repairs Completed')

const camstore = useCameraStore();
const formStore = useDefectsFormStore();
const authStore = useAuthenticationStore();
const store = useEFormStore();

/* refs */
const messageBoxVisible = ref(false);
const confirmVisible = ref(false);
const isCancelled = ref(true);
const dialogVisible = toRef(props, "visibility");
const data = toRef(props, "defectData");
const customClass = ref(uuidv4())
const showConfirmExit = ref(false)
const taskDescription = ref("")
const clonedDefectData = ref()
const taskDescriptionValidation = ref({
  isValid: true,
  errorMessage: ""
})
const images = computed(() => {
  if (isUndefined(formStore.images)) {
    return []
  } else {
    return formStore.images.ImageInfos
  }
})
const comparedData = computed(() => {
  return {
    images: images.value,
    description: props.defectData.Description.value,
    actions: props.defectData.Actions,
  }
})
const watchedFields = [
  "images",
  "description",
  "actions",
];

const handleTaskDescription = (val) => {
  if (val == '') {
    taskDescriptionValidation.value.isValid = false
    taskDescriptionValidation.value.errorMessage = "Required"
  } else {
    taskDescriptionValidation.value.isValid = true
    taskDescriptionValidation.value.errorMessage = ""
  }
  taskDescription.value = val
}

/* computes */
const taskUpdate = computed(() => {
  return formStore.DefectUpdate;
});
const serialNumber = computed(() => {
  return formStore.SerialNumber
})
const formatOwnershipHTML = computed(() => {
  const ownership = formStore.Ownership
  return formatOwnership(ownership)
})
const isFormAlreadySubmitted = computed(() => {
  return store.formAlreadySubmitted
});
const defectPlaceholder = computed(() => {
  return "Defect Identified Description"
});
const title = computed(() => {
  if (props.generic) {
    return data.value.Title
  } else {
    return displayDesc(getTitle(formStore.stateTask))
  }
});

/* watchers */
watch(isFormAlreadySubmitted, (newValue) => {
  if (newValue) {
    formStore.toggleYesVisible(false);
    store.resetTaskUpdated();
    formStore.resetTaskUpdated()
    messageBoxVisible.value = false;
    isCancelled.value = false;
    formStore.setCancelledState(true)
    camstore.clearCurrent();
  }
});

const onAddAnotherDefect = () => {
  formStore.setOpenDialogConfirmSubmitDefect(true)
  /* hide form */
  formStore.toggleNoVisible(false);
  store.resetTaskUpdated();
  formStore.resetTaskUpdated()
  messageBoxVisible.value = false;
  isCancelled.value = false;
}

/* watchers */
const isTaskAlreadyUpdated = computed(() => {
  return store.taskAlreadyUpdated
})

/* watchers */
watch(isTaskAlreadyUpdated, (newValue) => {
  if (newValue) {
    formStore.toggleNoVisible(false);
    store.resetTaskUpdated();
    formStore.resetTaskUpdated()
    messageBoxVisible.value = false;
    isCancelled.value = false;
    formStore.setCancelledState(true)
    camstore.clearCurrent();
  }
});
watch(taskUpdate, (newValue) => {
  if (formStore.DefectNoVisible != true) return;
  if (newValue === true) {
    messageBoxVisible.value = true
  }
});

const current = () => {
  const generalStore = useGeneralFormStore()
  const date = getUTCOffsetDate(generalStore.stateTimeZone)
  return (`${date} (${generalStore.stateTimeZoneDesc})`)
}

/* event handlers */
const onDescriptionChange = (event) => {
  data.value.setDescription(event.value);
}
const onActionChange = (param: TextareaParam) => {
  data.value.setAction(param.index as number, param.value);
  data.value.validateActions();
}
const onAddNewAction = () => {
  /* validate first */
  if (data.value.validateActions()) {
    data.value.addAction("");
  }
}
const onRemoveAction = (index: number) => {
  data.value.removeAction(index);
}
const updateTask = async () => {
  const payload: UpdateParam[] = [
    {
      keyValue: formStore.ItemKey,
      propertyParams: [
        {
          propertyName: "value",
          propertyValue: "2"
        },
        {
          propertyName: 'updatedBy',
          propertyValue: JSON.stringify(store.employee)
        },
        {
          propertyName: 'updatedDate',
          propertyValue: AESTCurrentDateTime()
        }
      ]
    },
  ]
  await store.updateServiceSheetTaskValue(payload, authStore.user.EmployeeId, authStore.user.Name);
  formStore.SetTaskUpdated()
  store.updateAllItems(formStore.ItemKey, "2")
}

const showCameraValidation = ref(false)
const isCustomValidationNormalTakePhoto = computed(() => {
  return !isUndefined(formStore.stateItem.customValidation) && formStore.stateItem.customValidation!.includes("normalTakePhoto")
})

watch(images, (newValue) => {
  if (newValue.length > 0) showCameraValidation.value = false
}, { deep: true })

const editedForm = computed(() => {
  return hasDefectDataChanged(watchedFields, clonedDefectData.value, comparedData.value)
})

const onSubmitDefects = async () => {
  data.value.validateDefectForm();
  if (props.generic) {
    // check task desc
    if (taskDescription.value == "") {
      taskDescriptionValidation.value.isValid = false
      taskDescriptionValidation.value.errorMessage = "Required"
    } else {
      taskDescriptionValidation.value.isValid = true
      taskDescriptionValidation.value.errorMessage = ""
    }
  }
  if (isCustomValidationNormalTakePhoto.value) {
    if (isUndefined(formStore.images) || formStore.images.ImageInfos.length < 1) {
      showCameraValidation.value = true
      return
    }
  }
  data.value.validateDefectForm();
  if (data.value.IsValid === true && taskDescriptionValidation.value.isValid) {
    confirmVisible.value = true;
  } else {
    handleScrollToError()
  }
}
const onSave = async () => {
  confirmVisible.value = false;
  const loader = ElLoading.service({
    lock: true,
    text: 'Processing...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  data.value.setAssetNumber(props.assetNumber);

  if (props.generic) {
    await formStore.createDefectGeneric({
      form: props.form,
      workorder: props.workorder,
      taskDesc: taskDescription.value,
    });
    emits('onRefreshData')
    formStore.SetTaskUpdated()
  } else {
    let deleteDefectNA = false
    // 3 -> NA
    if (formStore.stateTask.taskValue == "3") {
      const payload: UpdateParam[] = [
        {
          keyValue: "",
          propertyParams: [
            {
              propertyName: "isActive",
              propertyValue: "false"
            },
          ]
        },
      ]
      await store.updateDefectHeaderWithTaskKey(formStore.stateTask.key, payload);
      formStore.stateTask.taskValue = '2'
      deleteDefectNA = true
    } else if (formStore.stateTask.taskValue == "1") {
      deleteDefectNA = true
    }
    const updateDefectSuccess = await formStore.createDefect(deleteDefectNA);
    if (updateDefectSuccess) await updateTask();
    else if (store.taskErrorDialog) {
      onOk()
    }
  }
  loader.close();
}
const onCancel = () => {
  confirmVisible.value = false;
}
const onOk = () => {
  formStore.setOpenDialogConfirmSubmitDefect(false)
  /* hide form */
  formStore.toggleNoVisible(false);
  store.resetTaskUpdated();
  formStore.resetTaskUpdated()
  messageBoxVisible.value = false;
  isCancelled.value = false;
}
const onFormClosed = async () => {
  if (isCancelled.value === true) {
    formStore.setCancelledState(true);
  }
  if (formStore.OpenDialogConfirmSubmitDefect == false) {
    formStore.resetInstance();
  }
  taskDescriptionValidation.value = {
    isValid: true,
    errorMessage: ""
  }
  taskDescription.value = "";
  formStore.setUpdateTaskDefect("")
  camstore.clearCurrent();
  camstore.setShowCloseButton(false)
  showCameraValidation.value = false
  camstore.reset()
}

const defectDetailRef = ref(null) as any

const onFormOpened = () => {
  messageBoxVisible.value = false;
  camstore.setShowCloseButton(true)
  formStore.setOpenDialogConfirmSubmitDefect(false)
  handleScrollToTopOfDialog(customClass.value)
  isCancelled.value = true;
  taskDescriptionValidation.value = {
    isValid: true,
    errorMessage: ""
  }
  clonedDefectData.value = {
    images: cloneDeep(images.value),
    description: cloneDeep(props.defectData.Description.value),
    actions: cloneDeep(props.defectData.Actions),
  }
  disabledHyperlink(defectDetailRef.value)
}
const handleBeforeClose = () => {
  if (editedForm.value) {
    showConfirmExit.value = true
  } else {
    formStore.toggleYesVisible(false)
  }
}

const onCancelExit = () => {
  showConfirmExit.value = false
}

const onSaveExit = () => {
  showConfirmExit.value = false
  formStore.toggleYesVisible(false)
}
</script>

<style lang="scss">
.el-select__popper {
  z-index: 90000 !important;
}
.el-dialog__title {
  text-align: start;
}
.vcp {
    background: white;
    border: 1px solid rgba(145, 158, 171, 0.24);
    border-radius: 12px;
}
.vcp__body {
    overflow:inherit !important;
    font-size: 14px;
}
</style>
<style lang="scss" scoped>
   @import "@/assets/sass/pages/defect.ori.scss";
   @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
