<template>
    <el-dialog v-model="dialogVisible" width="90%" center @closed="onFormClosed" @opened="onFormOpened" :destroy-on-close="true" :custom-class="`el-defect-crack-form-custom form-defect-no-eform-view ${customClass}`">
      <template #title>
        <span class="el-dialog__title">Detailed Information for Defect Identification</span>
        <span class="el-dialog__title task-title" v-html="title" ref="defectDetailRef" ></span>
      </template>
        <div class="d-flex flex-row justify-content-between">
            <div class="p-2 d-flex flex-row flex-grow-1">
                <div class="flex-fill">
                  <div class="form-floating">
                    <div type="text" class="form-control asset-number-disabled-div" v-html="data.AssetNumber"></div>
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
          :disabled="true"
          :allow-delete="false"
          :is-monitoring="true"
          :is-mandatory="false" />
        </div>
        <div class="mt-1 p-2">
            <div class="d-flex flex-column">
              <Textarea
                :value="data.Description.value"
                label="Defect Identified Description"
                name="Defect Identified Description"
                :disabled="true"
              ></Textarea>
        </div>
        </div>
        <div class="mt-1 p-2">
          <div class="row" style="width:101%">
              <div class="col-6 pe-0">
                  <div class="form-floating">
                      <input type="text" class="form-control" disabled :value="data.RaisedBy">
                      <label>Raised By</label>
                  </div>
              </div>
              <div class="col-6 pe-0">
                  <div class="form-floating">
                      <input type="text" class="form-control" disabled :value="data.Date" />
                      <label>Date Raised</label>
                  </div>
              </div>
          </div>
        </div>
        <div class="mt-2"></div>
        <el-collapse class="task-group general-accordion py-1 px-5" v-model="actionRepaired">
          <el-collapse-item title="Repairs Completed" name="Repairs Completed">
            <div class="p-2 d-flex" v-for="(item) in data.Actions" :key="item.value">
              <div class="d-flex flex-fill flex-column">
                <div class="mt-2">
                  <Textarea
                    :value="item.value"
                    label="Description of Repairs Completed"
                    name="Description"
                    :disabled="true"
                  ></Textarea>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
    </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps,
  toRef,
  PropType,
  ref,
  defineEmits,
  computed
} from 'vue'
import DefectNoClass from '@/core/classes/DefectNoClass'
import { useCameraStore } from '@/store/pinia/application/useCameraStore'
import {
  useDefectsFormStore
} from '@/store/pinia/dma/e-form/defects/useDefectsFormStore'
import {
  usePreviewDefectFormStore
} from '@/store/pinia/dma/preview-form/usePreviewDefectFormStore'
import LargeCamera from '@/components/camera/LargeCamera.vue'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import Textarea from '@/components/inputs/dma/Textarea.vue'
import {
  handleScrollToTopOfDialog
} from "@/core/helpers/ironforms/defects-form/defect-form"
import { v4 as uuidv4 } from 'uuid';
import {
  formatOwnership,
  disabledHyperlink
} from '@/store/pinia/dma/e-form/helpers';

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  },
  defectData: {
    required: true,
    type: Object as PropType<DefectNoClass>
  },
  isIntervention: {
    required: false,
    type: Boolean,
    default: false
  },
  generic: {
    required: false,
    type: Boolean,
    default: false
  },
})

const emits = defineEmits(["close"])

const camstore = useCameraStore()
const formStore = useDefectsFormStore()
const prevStore = usePreviewDefectFormStore()

/* refs */
const actionRepaired = ref('Repairs Completed')
const dialogVisible = toRef(props, "visibility")
const data = toRef(props, "defectData")
const defectDetailRef = ref<HTMLElement>()
const customClass = ref(uuidv4())

/* event handlers */
const onFormClosed = async () => {
  camstore.clearCurrent()
  formStore.resetInstance()
  prevStore.resetInstance()
  emits("close")
}

const onFormOpened = () => {
  handleScrollToTopOfDialog(customClass.value)
  disabledHyperlink(defectDetailRef.value!)
}

const serialNumber = computed(() => {
  return formStore.SerialNumber
})


const formatOwnershipHTML = computed(() => {
  const ownership = formStore.Ownership
  return formatOwnership(ownership)
})

const title = computed(() => {
  if (props.generic) {
    return data.value.Title
  }
  return displayDesc(data.value.Title, props.isIntervention)
})
</script>
<style lang="scss" scoped>
   @import "@/assets/sass/pages/defect.ori.scss";
   @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
