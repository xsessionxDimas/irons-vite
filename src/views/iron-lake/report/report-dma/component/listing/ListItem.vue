<template>
    <template v-if="props.listData && props.listData.length < 1">
      <div class="row py-10 px-2 my-10 justify-content-center text-center">
        <template v-if="!loading">
          <h5 style="color: #919EAB;">No Data to Display</h5>
        </template>
      </div>
    </template>
    <template v-else>
      <div v-for="(item, index) in props.listData" :key="item.dailyScheduleId" class="row p-3 m-3 bg-light rounded list-item pointer-cursor" @click="handlePreviewForm(item)">
        <div class="col item__desc">
          {{ index + 1 }}. e-form {{ item.brand }} {{ item.equipmentModel }} Dump Truck {{ item.psType }} Hr Service {{ item.unitNumber }}
        </div>
        <div class="col-3 col-md-2 item__timestamp">{{ formatDateOnlyAU(item.dateService) }}</div>
      </div>
    </template>
</template>

<script lang="ts" setup>
import { formatDateOnlyAU } from "@/core/helpers/date-format";
import {
  useHistoricalEformDmaListStore
} from "@/store/pinia/report/history/dma/useHistoricalEformDmaListStore";
import { List } from '@/core/types/entities/dma/monitoring-status/List';
import { PropType, defineProps, defineEmits } from "vue";
import { computed } from "@vue/reactivity";

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<List[]>,
  },
});

const emits = defineEmits(["handleClick"])

const listStore = useHistoricalEformDmaListStore();

const loading = computed(() => {
  return listStore.loading
})

const handlePreviewForm = (data) => {
  emits("handleClick", data)
}
</script>

<style lang="scss" scoped>
.list-item {
  cursor: pointer;
}
</style>
