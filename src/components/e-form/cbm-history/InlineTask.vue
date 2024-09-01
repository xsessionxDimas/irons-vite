<template>
  <div class="position-relative pb-5" style="border: 1px solid rgba(145, 158, 171, 0.24);">
    <div class="d-flex flex-row justify-content-between" v-if="task.rating == TaskRatingEnum.OIL_COOLED">
      <div class="col-1 text-start px-2 py-2">
        {{ items[0].value }}
      </div>
      <div class="col text-start px-2 py-2">
        {{ items[2].value }}
      </div>
      <div class="col-1 text-start px-2 py-2">
        <Dropdown :item="items[3]" />
      </div>
      <div class="col-1 text-start px-2 py-2">
        <Input :item="items[4]" />
      </div>
      <div class="col-1 text-start px-2 py-2">
        <Input :item="items[5]" />
      </div>
      <div class="col-1 text-start px-2 py-2">
        <Input :item="items[6]" />
      </div>
      <div class="col-1 text-start px-2 py-2">
        {{ items[7].value }}
      </div>
      <div class="col-1 text-start px-2 py-2">
        <Input :item="items[8]" />
      </div>
      <div class="col-1 text-start px-2 py-2">
        <Input :item="items[9]" />
      </div>
      <div class="col-1 text-start px-2 py-2">
        <SmallCamera :item="getPhotoData(photoItems)" :history="history"  :is-disabled="true" />
      </div>
      <div class="col-1 text-start px-2 py-2 d-flex align-items-center">
        {{ (row == max - 1) ? 'IronForms' : 'IronPortal'}}
      </div>
    </div>
    <div class="d-flex flex-row justify-content-between" v-else-if="cbmCategory == 'manual'">
      <div class="col-1 text-start px-2 py-2">
        {{ items[0].value }}
      </div>
      <div class="col text-start px-2 py-2">
        <Label :item="items[2]" />
      </div>
      <div class="col-2 text-start px-2 py-2">
        <template v-if="items[3].itemType == 'dropDown'">
          <Dropdown :item="items[3]" />
        </template>
        <template v-else>
          <Dropdown :item="items[4]" />
        </template>
      </div>
      <div class="col-2 text-start px-2 py-2">
        <template v-if="items[4].itemType == 'smallCamera'">
          <SmallCamera :item="getPhotoData(items[4])" :history="history" :is-disabled="true" />
        </template>
        <template v-else>
          <SmallCamera :item="getPhotoData(items[5])" :history="history" :is-disabled="true" />
        </template>
      </div>
      <div class="col-2 text-start px-2 py-2 d-flex align-items-center">
        {{ (row == max - 1) ? 'IronForms' : 'IronPortal'}}
      </div>
    </div>
    <div class="d-flex flex-row justify-content-between" v-else-if="cbmCategory == 'auto' && task.rating != TaskRatingEnum.OIL_COOLED">
      <div class="col-1 text-start px-2 py-2">
        {{ items[0].value }}
      </div>
      <div class="col text-start px-2 py-2">
        {{ task.rating == TaskRatingEnum.CALIPER ? getLocationCaliper() : items[2].value }}
      </div>
      <div class="col text-start px-2 py-2">
        <Input :item="measurementItems" />
      </div>
      <div class="col-1 text-start px-2 py-2">
        <Label :item="uomItems" />
      </div>
      <div class="col-2 text-start px-2 py-2">
        <Input :item="ratingItems" />
      </div>
      <div class="col-2 text-start px-2 py-2">
        <SmallCamera :item="getPhotoData(photoItems)" :history="history"  :is-disabled="true" />
      </div>
      <div class="col-2 text-start px-2 py-2 d-flex align-items-center">
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
import Label from "./item/Label.vue"
import Dropdown from "./item/Dropdown.vue";
import Input from "./item/Input.vue";
import { Item } from '@/core/types/entities/dma/e-form/Item';
import SmallCamera from "./item/small-camera/SmallCamera.vue";
import { TaskRatingEnum } from "@/core/types/entities/dma/e-form/Task"

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
  }
});

const measurementItems = computed(() => {
  const measurementObj = props.items.find((obj) => {
    return (
      obj.categoryItemType == "paramRating" ||
      obj.categoryItemType == "paramRatingDynamic"
    );
  });
  if (measurementObj) {
    return measurementObj;
  } else {
    return {} as Item;
  }
});

const uomItems = computed(() => {
  const uomObj = props.items.find((obj) => {
    return obj.categoryItemType == "targetTool";
  });
  if (uomObj) {
    return uomObj;
  } else if (!uomObj) {
    const measurementValueIndex = props.items.findIndex((obj) => {
      return (
        obj.categoryItemType == "paramRating" ||
        obj.categoryItemType == "paramRatingDynamic"
      )
    });
    return props.items[measurementValueIndex + 1];
  } else {
    return {} as Item;
  }
});

const ratingItems = computed(() => {
  const ratingObj = props.items.find((obj) => {
    return obj.categoryItemType == "targetRating";
  });
  if (ratingObj) {
    return ratingObj;
  } else {
    return {} as Item;
  }
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

const cbmCategory = computed(() => {
  let status = 'auto'

  if (props.task.rating == 'MANUAL' || (props.task.rating == 'NORMAL' && props.task.category == 'CBM')) {
    status = 'manual'
  }
  console.log(status)
  return status
})

const getPhotoData = (item: Item) => {
  if (props.history.isUpdatePhoto != undefined && !props.history.isUpdatePhoto) {
    return {} as Item;
  }
  return item
}

const getLocationCaliper = () => {
  let location = '';
  if (props.history) {
    location += props.history.description.split(';')[1];
    location += '. ';
    location += props.history.description.split(';')[2];
  }
  return location;
}
</script>
