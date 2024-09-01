<template>
  <img
    :src="image?.buffer"
    class="w-100 rounded avoid" style="object-fit: fill; max-height: 1000px; text-align:center"
    alt="image" />
</template>

<script lang="ts" setup>
import {
  useHistoricalEformDmaStore
} from "@/store/pinia/report/history/dma/useHistoricalEformDmaStore";
import {
  defineProps,
  computed,
} from "vue";

const historicalStore = useHistoricalEformDmaStore();
const props = defineProps({
  img: {
    required: true,
    type: String,
  },
  preRisk: {
    type: Boolean,
    default: false
  }
});

const image = computed(() => {
  if (props.preRisk) {
    return historicalStore.preRiskImageList.find((image) => {
      return image.id == props.img
    })
  } else {
    return historicalStore.imageList.find((image) => {
      return image.id == props.img
    })
  }
})
</script>
