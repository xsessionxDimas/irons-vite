<template>
    <div class="p-2 check-truck-info d-flex">
        <div class="form-check p-0 icon">
            <img :src="image?.buffer" class="img-fluid" />
        </div>
        <div class="form-check text ps-6">
            <span v-html="itemRef.value"></span>
        </div>
    </div>
</template>

<script lang='ts' setup>
import {
  defineProps,
  PropType,
  toRef,
  ref,
  computed
} from 'vue'
import { Item } from '@/core/types/entities/dma/e-form/Item'
import {
  useHistoricalEformDmaStore
} from "@/store/pinia/report/history/dma/useHistoricalEformDmaStore";

const props = defineProps({
  item: {
    required: true,
    type: Object as PropType<Item>
  },
})
const historicalStore = useHistoricalEformDmaStore();
const itemRef = toRef(props, 'item')

const image = computed(() => {
  return historicalStore.imageList.find((image) => {
    return image.id == props.item.icon.value
  })
})

</script>

<style lang="scss" scoped>
.check-truck-info {
    .text {
        font-size: 14px;
        line-height: 20px;
        color: #212B36;
    }
}
</style>
