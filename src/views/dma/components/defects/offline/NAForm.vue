<template>
  <el-dialog
    v-model="dialogVisible"
    width="90%"
    center
    @opened="onFormOpened"
    @closed="onFormClosed"
    custom-class="el-defect-crack-form-custom"
    :destroy-on-close="true"
  >
    <template #title>
      <span class="el-dialog__title">Not Applicable</span>
      <span class="el-dialog__title task-title" v-html="displayDesc(title)" ref="defectDetailRef"></span>
    </template>
    <div class="mt-1 p-2">
      <div class="d-flex flex-column">
        <h4 class="title ps-3">Reason</h4>
        <el-select
          v-model="reasonOpt"
          :disabled="true"
          class="w-100">
          <template v-for="opt in masterStore.NAConditions" :key="opt.id">
            <el-option :label="opt.naCondition" :value="opt.naCondition" />
          </template>
        </el-select>
      </div>
    </div>
    <div class="mt-1 p-2" v-if="isOthers">
      <Textarea
        :value="stringGroupExtractor(reason)"
        label="Why not applicable item task?"
        name="Reason"
        :disabled="true"
      ></Textarea>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps,
  toRef,
  computed,
  defineEmits,
  ref
} from 'vue';
import { useMasterStore } from '@/store/pinia/dma/masters/useMasterStore'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import Textarea from '@/components/inputs/dma/Textarea.vue'
import {
  disabledHyperlink
} from '@/store/pinia/dma/e-form/helpers'
import {
  stringGroupExtractor
} from "@/core/helpers/ironforms/defects-form/defect-form"

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean,
  },
  reason: {
    required: true,
    type: String,
  },
  title: {
    required: true,
    type: String
  }
});

/* stores */
const masterStore = useMasterStore();

/* computeds */
const reasonOpt = computed(() => {
  return props.reason.split(':')[0];
});
const isOthers = computed(() => {
  return props.reason.split(':')[0].includes("Other");
});

const emits = defineEmits(["close"]);

const dialogVisible = toRef(props, "visibility");
const defectDetailRef = ref(null) as any

const onFormClosed = async () => {
  emits("close");
};
const onFormOpened = () => {
  disabledHyperlink(defectDetailRef.value)
}
</script>
  <style scoped>
  .el-overlay {
    z-index: 3000 !important;
  }
  .el-dialog__title {
    text-align: start;
  }
  </style>
  <style lang="scss" scoped>
  @import "@/assets/sass/pages/custom.defect.crack.dialog.scss";
  .hidden {
    visibility: hidden;
  }
  .title {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
  }
  .error-label {
    color: #ff4842;
    font-size: 12px;
    font-weight: 400;
  }
  .btn-add-new {
    background: transparent;
    color: #18af4a;
    border: none;
    font-weight: 700;
    font-size: 13px;
    line-height: 22px;
  }
  .form-control {
    color: black;
  }
  .form-check-input:checked {
    background-color: #18af4a;
    border-color: #18af4a;
  }
  </style>

