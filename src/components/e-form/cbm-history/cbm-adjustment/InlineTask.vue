<template>
  <div class="position-relative pb-5" style="border: 1px solid rgba(145, 158, 171, 0.24);">
    <div class="d-flex flex-row justify-content-between">
      <div class="col-1 text-start px-2 py-2">
        {{ item.items[0].value }}
      </div>
      <div class="col text-start px-2 py-2">
        {{ item.items[2].value }}
      </div>
      <div class="col text-start px-2 py-2">
        <span>{{ item.cbmAdjustmentReplacementValue.measurement }}</span>
      </div>
      <div class="col-1 text-start px-2 py-2">
        <span>{{ item.cbmAdjustmentReplacementValue.uom }}</span>
      </div>
      <div class="col-2 text-start px-2 py-2">
        <InputHistory
          :item="item.cbmAdjustmentReplacementValue.rating"
        />
      </div>
      <div class="col-2 text-start px-2 py-2">
        <SmallCamera
          :item="getPhotoData(item)"
          :history="history"
        />
      </div>
      <div class="col-2 text-start px-2 py-2 d-flex align-items-center">
        {{ (row == max - 1) ? 'IronForms' : 'IronPortal'}}
      </div>
    </div>
    <div v-if="item.cbmAdjustmentReplacementValue.updatedBy!.name" class="row w-100 position-absolute pe-3" :style="`bottom: 4px;`">
      <div class="d-flex justify-content-end pb-1 my-0 timestamp-task">
        {{ item.cbmAdjustmentReplacementValue.updatedBy!.name }}, {{ item.cbmAdjustmentReplacementValue.updatedDate! }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import InputHistory from './InputHistory.vue';
import SmallCamera from './SmallCamera.vue';

const props = defineProps({
  item: {
    type: Object as any,
    required: true
  },
  row: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  history: {
    type: Object as any,
    required: true
  },
})

const getPhotoData = (item) => {
  if (item.isUpdatePhoto != undefined && !item.isUpdatePhoto) {
    return [];
  }
  return item.cbmAdjustmentReplacementValue.pictures;
}
</script>
