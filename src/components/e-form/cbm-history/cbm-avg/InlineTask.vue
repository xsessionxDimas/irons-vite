<template>
  <div class="position-relative pb-5 history-table" :style="tableStyle">
    <div class="d-flex flex-row justify-content-between">
      <div class="col-1 text-start px-2 py-2">
        {{ taskNo }}
      </div>
      <div class="col-2 col-lg-3 text-start px-2 py-2">
        <Label :item="items[2]" />
      </div>
      <div class="col-2 text-start px-2 py-2">
        <Input :item="items[3]" />
      </div>
      <div class="col-1 text-start px-2 py-2">
        <Label :item="items[4]" />
      </div>
      <div class="col-2 text-start px-2 py-2">
        <template v-if="items[5].itemType == 'input'">
          <Input :item="items[5]" />
        </template>
        <template v-else-if="items[5].itemType == 'label'">
          <Label :item="items[5]" />
        </template>
      </div>
      <div class="col-2 text-start px-2 py-2">
        <SmallCamera :item="getPhotoData(photoItems)" :history="history" :is-disabled="true" />
      </div>
      <div class="col-2 col-lg-1 text-start px-2 py-2 d-flex align-items-center">
        {{ (row == max - 1) ? 'IronForms' : 'IronPortal'}}
      </div>
    </div>
    <div v-if="task.updatedBy!.name" class="row w-100 position-absolute pe-3" :style="`bottom: 4px;`">
      <div class="d-flex justify-content-end pb-1 my-0 timestamp-task">
        {{ task.updatedBy!.name }}, {{ task.updatedDate! }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType,
} from 'vue'
import Label from "../item/Label.vue"
import Input from "../item/Input.vue";
import { Item } from '@/core/types/entities/dma/e-form/Item';
import SmallCamera from "../item/small-camera/SmallCamera.vue";

const props = defineProps({
  history: {
    type: Object as any,
    required: true
  },
  items: {
    type: Object as PropType<Item[]>,
    required: true
  },
  task: {
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
  taskNo: {
    required: true
  }
});

const tableStyle = computed(() => {
  const style = 'border-bottom: 1px solid rgba(145, 158, 171, 0.24);'
  return style
})

const photoItems = computed(() => {
  const photoObj = props.items.find((obj) => {
    return obj.itemType == "smallCamera";
  });
  if (photoObj) {
    return photoObj;
  } else {
    return {} as Item;
  }
})

const getPhotoData = (item: Item) => {
  if (props.history.isUpdatePhoto != undefined && !props.history.isUpdatePhoto) {
    return {} as Item;
  }
  return item
}
</script>
<style lang="scss" scoped>
.history-table {
  border-left: 1px solid rgba(145, 158, 171, 0.24);
  border-right: 1px solid rgba(145, 158, 171, 0.24);
}
</style>
