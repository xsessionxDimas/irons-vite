<template>
  <div class="d-flex justify-content-start avoid">
    <div class="p-2 flex-fill">
      <div class="d-flex flex-row align-items-center">
        <NwImg style="height: 24px; width: 24px;" class="me-3" src="/media/icons/bootstrap-icon/checkbox-marked.svg" v-if="item.value == 'true'" />
        <NwImg style="height: 24px; width: 24px;" class="me-3" src="/media/icons/bootstrap-icon/checkbox-blank-outline.svg" v-else />
        <div class="col">
          <p class="mb-0">{{ item.caption }}</p>
        </div>
        <div class="col-4">
          <div class="col text-end">
            {{ timeStamp }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
import {
  defineProps,
  PropType,
  computed
} from 'vue'
import { Item } from '@/core/types/entities/dma/e-form/Item'
import { isUndefined } from 'lodash'

const props = defineProps({
  item: {
    required: true,
    type: Object as PropType<Item>
  },
})

const timeStamp = computed(() => {
  let timeStamp = ''
  if (!isUndefined(props.item.updatedDate) && !isUndefined(props.item.updatedBy?.name)) {
    timeStamp = `${props.item.updatedBy?.name}, ${props.item.updatedDate}`
  }
  return timeStamp
})
</script>
