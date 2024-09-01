<template>
  <el-dialog
    v-model="dialogVisible"
    :custom-class="`defectform el-defect-crack-form-custom form-defect-no-eform-defectidentified ${customClass}`"
    width="90%"
    center
    @closed="onFormClosed"
    @opened="onFormOpened"
    :destroy-on-close="true">
    <template #title>
      <span class="el-dialog__title">Detailed Information for Defect Identification</span>
      <span class="el-dialog__title task-title" v-html="title" ref="defectDetailRef" ></span>
    </template>
    <div>
      <div class="d-flex flex-row justify-content-between">
        <div class="py-2 d-flex flex-row flex-grow-1">
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
      <div class="mt-1 py-2">
        <Textarea
          :value="data?.Description?.value"
          :label="defectPlaceholder"
          name="defectPlaceholder"
          :errorMessage="data.Description.errorMessage"
          :is-valid="data.Description.isValid"
          :disabled="isDisabled"
          @handleChange="onDescriptionChange"
        ></Textarea>
      </div>
      <div class="mt-1 py-2">
        <div class="row">
          <div class="col-6 pe-0">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                disabled
                :value="data.RaisedBy"
              />
              <label>Raised By</label>
            </div>
          </div>
          <div class="col-6 pe-0">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                disabled
                :value="data.Date"
              />
              <label>Date Raised</label>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-1 py-2">
        <div class="row">
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
                    name="DescriptionofRepairsCompleted"
                    :disabled="true"
                  ></Textarea>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
    </div>
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
  watch,
} from 'vue'
import DefectNoClass from '@/core/classes/DefectNoClass'
import { useCameraStore } from '@/store/pinia/application/useCameraStore'
import LargeCamera from '@/components/camera/LargeCamera.vue'
import { displayDesc } from "@/core/helpers/manipulate-html-string"
import Textarea from "@/components/inputs/dma/Textarea.vue";
import {
  handleScrollToTopOfDialog
} from "@/core/helpers/ironforms/defects-form/defect-form"
import { v4 as uuidv4 } from 'uuid';
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import {
  formatOwnership,
  disabledHyperlink
} from '@/store/pinia/dma/e-form/helpers';

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean,
  },
  defectData: {
    required: true,
    type: Object as PropType<DefectNoClass>,
  },
  status: {
    required: true,
    type: String,
  },
  generic: {
    required: false,
    type: Boolean,
    default: false
  },
});

const emits = defineEmits(["closeForm"]);

const camstore = useCameraStore();
const defectformStore = useDefectsFormStore();

/* refs */
const isDisabled = ref(true);
const componentKey = ref(0);
const defectDetailRef = ref<HTMLElement>()
const dialogVisible = toRef(props, "visibility")
const data = toRef(props, "defectData");
const priority = ref<string>("")
const actionRepaired = ref<string>('Repairs Completed')
const labours = ref<Array<string>>([""])
const symptoms = ref<Array<string>>([""])
const causes = ref<Array<string>>([""])
const symptomDesc = ref<Array<string>>([""])
const symptomDescValid = ref<Array<boolean>>([true])
const causesDesc = ref<Array<string>>([""])
const causesDescValid = ref<Array<boolean>>([true])
const customClass = ref(uuidv4())

/* computes */
const imageObject = computed(() => {
  return camstore.ImageObjects.find((i) => {
    return i.Id === "defect";
  })
})
const imageCount = computed(() => {
  return imageObject.value?.ImageInfos.length;
})
const defectPlaceholder = computed(() => {
  return "Defect Identified Description"
})
const serialNumber = computed(() => {
  return defectformStore.SerialNumber
})

const formatOwnershipHTML = computed(() => {
  const ownership = defectformStore.Ownership
  return formatOwnership(ownership)
})

/* watchers */
watch(imageCount, () => {
  componentKey.value += 1
})

/* event handlers */
const onDescriptionChange = (event) => {
  event.preventDefault()
  data.value.setDescription(event.value)
  data.value.validateDescription()
}
const onFormClosed = () => {
  camstore.setShowCloseButton(false)
  camstore.clearCurrent()
  priority.value = ""
  labours.value = [""]
  symptoms.value = [""]
  causes.value = [""]
  symptomDesc.value = [""]
  symptomDescValid.value = [true]
  causesDesc.value = [""]
  causesDescValid.value = [true]
  isDisabled.value = true
  emits("closeForm")
}
const onFormOpened = () => {
  camstore.setShowCloseButton(true)
  handleScrollToTopOfDialog(customClass.value)
  symptoms.value = []
  symptomDesc.value = []
  symptomDescValid.value = []
  causes.value = []
  causesDesc.value = []
  causesDescValid.value = []

  disabledHyperlink(defectDetailRef.value)
}

const title = computed(() => {
  if (props.generic) {
    return data.value.Title
  } else {
    return displayDesc(data.value.Title)
  }
});
</script>

<style lang="scss">
.el-dialog__title {
  text-align: start;
}
.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}
.vcp__body {
  overflow: inherit !important;
  font-size: 14px;
}
</style>
<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.form.scss";
@import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
</style>
