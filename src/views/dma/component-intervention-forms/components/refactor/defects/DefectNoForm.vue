<template>
    <el-dialog v-model="dialogVisible"
    width="90%" center
    @closed="onFormClosed"
    @opened="onFormOpened"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleBeforeClose"
    :custom-class="`el-defect-crack-form-custom form-defect-no-intervention-form ${customClass}`"
    :destroy-on-close="true">
      <template #title>
          <span class="el-dialog__title">Detailed Information for Defect Identification</span>
          <span class="el-dialog__title task-title" v-html="displayDesc(title, true)" ref="defectDetailRef" v-if="!generic"></span>
      </template>
      <div>
        <div class="d-flex flex-column justify-content-between" v-if="generic">
          <div class="py-2 d-flex flex-row flex-grow-1">
            <div class="flex-fill">
                <div class="form-floating">
                  <input type="text" class="form-control" v-model="taskDescriptionValidation.value" @change="handleTaskDescription">
                  <label for="floatingInput">Task Description</label>
                </div>
                <div class="mt-2">
                  <Label class="error-label" v-if="!taskDescriptionValidation.isValid">{{ taskDescriptionValidation.errorMessage }}</Label>
                </div>
            </div>
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
            <defect-camera
            ref="defectCameraRef"
            :re-render="reRender"
            :task="task"
            :defect-images="defectImages"
            :type="'defect'"
            :disabled="false"
            :generated-i-d="generatedID"
            :allow-delete="true"
            @on-camera-clicked="handleCameraClick"
            @on-image-delete="handleImageDeleted"
            :has-submitted="!isImageValid"/>
          </div>
          <template v-if="!isImageValid">
            <Label class="error-label">Required</Label>
          </template>
          <div class="mt-1 py-2">
            <div class="d-flex flex-column">
              <Textarea
                :value="description?.value"
                :label="defectPlaceholder"
                name="DefectPlaceholder"
                :errorMessage="description?.errorMessage"
                :is-valid="description?.isValid"
                @handleChange="onDescriptionChange"
              ></Textarea>
            </div>
          </div>
          <div class="mt-1 py-2">
              <div class="row" style="width:101%">
                  <div class="col-6 pe-0">
                      <div class="form-floating">
                          <input type="text" class="form-control" disabled :value="currentFitter.name">
                          <label>Raised By</label>
                      </div>
                  </div>
                  <div class="col-6 pe-0">
                      <div class="form-floating">
                          <input type="text" class="form-control" disabled :value="current" />
                          <label>Date Raised</label>
                      </div>
                  </div>
              </div>
          </div>
          <div class="mt-2"></div>
          <el-collapse class="task-group general-accordion py-1 px-5" v-model="actionRepaired">
            <el-collapse-item title="Repairs Completed" name="Repairs Completed">
              <div class="p-2 d-flex" v-for="(item, index) in actions" :key="index">
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
            <button class="btn btn-success w-100" @click="onSubmitDefect"
            style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Submit</button>
          </div>
        </div>
        <Confirmation :visibility="confirmVisible"
          caption="Please confirm this defect information is correct."
          @on-no-confirm="onCancel"
          @on-yes-confirm="onConfirmSubmit" />
        <Confirmation :visibility="showConfirmExit"
          caption="Are you sure want to close the defect form? <br /> Note: By closing the defect form, you will lose your defect data that you have already inputted."
          @on-no-confirm="onCancelExit"
          @on-yes-confirm="onSaveExit" />
    </el-dialog>
  </template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  toRef,
  PropType,
  ref,
  computed,
} from 'vue'
import Confirmation from '@/components/dialog/Confirmation.vue'
import DefectCamera from '@/components/camera/DefectCamera.vue'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { IDetailTask } from '@/core/types/intervention/IDetailTask'
import { Audit } from '@/core/types/intervention/Audit'
import {
  StringWithValidationState
} from '@/core/types/misc/StringWithValidationState'
import {
  AESTCurrentDateTime,
} from '@/core/helpers/date-format'
import { DefectNoFormData } from '@/core/types/intervention/DefectNoFormData'
import { CameraParam } from '@/core/types/intervention/CameraParam'
import Textarea from "@/components/inputs/dma/Textarea.vue";
import { TextareaParam } from '@/core/types/misc/TextareaParam'
import {
  handleScrollToErrorModal,
  handleScrollToTopOfDialog
} from '@/core/helpers/ironforms/defects-form/defect-form'
import { v4 as uuidv4 } from 'uuid';
import {
  formatOwnership,
  getTitle,
  disabledHyperlink,
  hasDefectDataChanged
} from '@/store/pinia/dma/e-form/helpers';
import {
  cloneDeep,
} from 'lodash'

const props = defineProps({
  visibility: {
    type: Boolean,
    required: true
  },
  assetNumber: {
    type: String,
    required: true
  },
  task: {
    type: Object as PropType<IDetailTask>,
    required: true
  },
  currentFitter: {
    type: Object as PropType<Audit>,
    required: true
  },
  defectImages: {
    type: Array as PropType<string[]>,
    required: true
  },
  reRender: {
    type: Boolean,
    default: false
  },
  ownership: {
    type: String,
    default: "",
  },
  serialNumber: {
    type: String,
    default: "",
  },
  generic: {
    required: false,
    type: Boolean,
    default: false
  },
  generatedID: {
    required: false,
    type: String,
    default: ""
  }
})

const emits = defineEmits([
  'onCameraClick',
  'onImageDeleted',
  'onSubmit',
  'onCancel',
  'onClose',
  'OnSetFlagFromDeleteAction'
])

/* refs */
const defectSubmitted = ref(false)
const actionRepaired = ref('Repairs Completed')
const confirmVisible = ref(false)
const dialogVisible = toRef(props, "visibility");
const current = ref(AESTCurrentDateTime())
const description = ref<StringWithValidationState>({
  value: '',
  isValid: true,
  errorMessage: ''
})
const isDescriptionValid = ref(true)
const actions = ref<StringWithValidationState[]>([
  {
    value: '',
    isValid: true,
    errorMessage: ''
  }
])
const isImageValid = ref(true)
const defectDetailRef = ref<HTMLElement>()
const customClass = ref(uuidv4())
const showConfirmExit = ref(false)
const clonedDefectData = ref()
const watchedFields = [
  "images",
  "description",
  "actions",
];
const defectCameraRef = ref()

const comparedData = computed(() => {
  return {
    images: props.defectImages,
    description: description.value.value,
    actions: actions.value,
  }
})

const editedForm = computed(() => {
  return hasDefectDataChanged(watchedFields, clonedDefectData.value, comparedData.value)
})

const handleTaskDescription = () => {
  validateTaskDescription()
}
const taskDescriptionValidation = ref<StringWithValidationState>({
  isValid: true,
  errorMessage: "",
  value: ""
})

/* computes */
const defectPlaceholder = computed(() => {
  return 'Defect Identified Description'
})
const title = computed(() => {
  return getTitle(props.task)
})

/* event handlers */
const handleCameraClick = (param: CameraParam) => {
  isImageValid.value = true
  emits('onCameraClick', param)
}
const handleImageDeleted = (filename: string) => {
  if (props.defectImages.length == 1) {
    isImageValid.value = false
    emits('OnSetFlagFromDeleteAction', true)
    defectCameraRef.value.handleClickCamera()
    defectCameraRef.value.handleHideModal()
  } else {
    emits('onImageDeleted', filename)
  }
}
const resetFormModel = () => {
  defectSubmitted.value = false
  isImageValid.value = true
  current.value = AESTCurrentDateTime()
  description.value.value = ''
  description.value.isValid = true
  description.value.errorMessage = ''
  actions.value = [
    {
      value: '',
      isValid: true,
      errorMessage: ''
    }
  ]
}
const onDescriptionChange = (param: TextareaParam) => {
  description.value.value = param.value
}
const validateDescription = () => {
  let isValid = true
  if (description.value.value === "") {
    description.value.isValid = false
    description.value.errorMessage = "Required"
    isValid = false
  } else {
    description.value.isValid = true;
    description.value.errorMessage = ""
  }
  return isValid
}
const validateImage = () => {
  if (props.defectImages.length >= 1) {
    isImageValid.value = true
    return true
  }
  isImageValid.value = false
  return false
}
const validateTaskDescription = () => {
  let isValid = true
  if (taskDescriptionValidation.value.value == "") {
    taskDescriptionValidation.value.isValid = false
    taskDescriptionValidation.value.errorMessage = "Required"
    isValid = false
  } else {
    taskDescriptionValidation.value.isValid = true
    taskDescriptionValidation.value.errorMessage = ""
  }
  return isValid
}
const validateAction = (action: StringWithValidationState) => {
  let isValid = true
  if (action.value === "") {
    action.isValid = false
    action.errorMessage = "Required"
    isValid = false
  } else {
    action.isValid = true;
    action.errorMessage = ""
  }
  return isValid
}
const validateActions = () => {
  let isValid = true;
  actions.value.forEach((e) => {
    isValid = validateAction(e);
  });
  return isValid;
}
const onActionChange = (param: TextareaParam) => {
  actions.value[param.index as number].value = param.value
  validateAction(actions.value[param.index as number])
}
const onAddNewAction = () => {
  /* validate first */
  if (validateActions()) {
    actions.value.push({
      value: '',
      isValid: true,
      errorMessage: ''
    } as StringWithValidationState);
  }
}
const onRemoveAction = (index: number) => {
  actions.value.splice(index, 1)
}
const onSubmitDefect = () => {
  // validate first
  let isValid = [] as boolean[]
  if (props.generic) {
    // check task desc
    isValid.push(validateTaskDescription())
  }
  isValid.push(validateImage())
  isValid.push(validateDescription())
  isValid.push(validateActions())
  const valid = isValid.every((x) => {
    return x == true
  })
  if (!valid) {
    handleScrollToErrorModal("form-defect-no-intervention-form")
    return
  }
  confirmVisible.value = true
}
const onConfirmSubmit = () => {
  const formData = {} as DefectNoFormData
  formData.type = 'NO',
  formData.assetNumber = props.assetNumber
  formData.raisedBy = props.currentFitter.name
  formData.date = current.value
  formData.description = description.value.value
  formData.actions = actions.value.map((a) => {
    return a.value
  })
  if (props.generic) {
    formData.taskDesc = taskDescriptionValidation.value.value
    formData.taskNo = ""
  } else {
    formData.taskDesc = props.task.description
    formData.taskNo = props.task.interventionSequence as string
  }
  emits('onSubmit', formData)
  defectSubmitted.value = true
  confirmVisible.value = false
  taskDescriptionValidation.value = {
    isValid: true,
    errorMessage: "",
    value: '',
  }
}
const onCancel = () => {
  confirmVisible.value = false
}
const onFormClosed = async () => {
  taskDescriptionValidation.value = {
    isValid: true,
    errorMessage: "",
    value: '',
  }
  emits('onClose', defectSubmitted.value)
}
const onFormOpened = () => {
  handleScrollToTopOfDialog(customClass.value)
  taskDescriptionValidation.value = {
    isValid: true,
    errorMessage: "",
    value: '',
  }
  try {
    resetFormModel()
    if (!props.generic) {
      disabledHyperlink(defectDetailRef.value)
    }
  } catch (error) {
    console.log(error)
  }
  clonedDefectData.value = {
    images: cloneDeep(props.defectImages),
    description: cloneDeep(description.value.value),
    actions: cloneDeep(actions.value),
  }
}

const handleBeforeClose = () => {
  if (editedForm.value) {
    showConfirmExit.value = true
  } else {
    emits("onCancel")
  }
}

const onCancelExit = () => {
  showConfirmExit.value = false
}

const onSaveExit = () => {
  showConfirmExit.value = false
  emits("onCancel")
}
const formatOwnershipHTML = computed(() => {
  const ownership = props.ownership
  return formatOwnership(ownership)
})

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
    @import '@/assets/sass/pages/defect.ori.scss';
    @import '@/assets/sass/pages/custom.defect.crack.dialog.scss';
</style>
