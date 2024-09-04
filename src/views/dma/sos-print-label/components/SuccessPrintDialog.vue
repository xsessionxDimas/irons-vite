<template>
  <el-dialog
    v-model="showDialog"
    width="45%"
    :show-close="false"
    custom-class="message-box-custom oil-not-in-range__header p-0 success-box"
    top="20vh" :center="true"
    :close-on-click-modal="false"
    :close-on-press-escape = "false">
    <div class="row text-center pb-5 pt-5 text-dark processing-time-container">
      <div class="icon mb-4">
        <inline-svg src="/media/svg/dma/green-checklist.svg" />
      </div>
      <h3 class="mb-2">Successfully downloaded</h3>
    </div>
    <div class="d-flex flex-column label-list mx-auto">
      <div
        v-for="(labelItem, idxLabelItem) in labelData.details"
        :key="idxLabelItem"
        class="row"
      >
        <div class="col-6">
          <p class="mb-0">{{ labelData.equipment }} - {{ labelItem.compartmentLubricant }}</p>
        </div>
        <div class="col-3">
          <p class="mb-0">{{ labelItem.label || '-' }}</p>
        </div>
        <div class="col-3 d-flex justify-content-end">
          <div v-if="labelItem.label" class="printed mb-2">
            <p class="mb-0">Printed</p>
          </div>
          <div v-else class="not-printed mb-2">
            <p class="mb-0">Not Printed</p>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex text-center pt-5">
      <el-button type="success" class="mx-auto success-button" @click="handleClose">Close</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { SosLabel } from '@/core/types/entities/dma/sos/SosLabel';
import {
  defineProps,
  defineEmits,
  toRef,
  PropType
} from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  labelData: {
    type: Object as PropType<SosLabel>,
    required: true
  },
});
const emits = defineEmits(["close", "leftButtonAction"]);
const handleClose = () => {
  emits("close")
}
const showDialog = toRef(props, "show");
</script>

<style lang="scss">
.message-box-custom {
  min-width: 600px;
}

.success-box {
  z-index: 9999 !important;
}

.success-button {
  color: #FFF;
  border: 1px solid #18AF4A;
  background-color: #18AF4A;
}

.label-list {
  background-color: #F5F5F5;
  padding: 15px;
  max-width: 90%;
  border-radius: 10px;
  max-height: 150px;
  overflow-y: scroll;
}

.printed {
  background-color: #18AF4A;
  color: white;
  padding: 2px 8px;
  border-radius: 5px;
}

.not-printed {
  background-color: #FF4842;
  color: white;
  padding: 2px 8px;
  border-radius: 5px;
}
</style>
