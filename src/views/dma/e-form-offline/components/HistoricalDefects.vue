<template>
  <div class="mt-5 ps-0" style="width: 100%">
    <el-collapse class="task-group general-accordion py-1 ps-3 pe-3">
      <el-collapse-item name="1">
        <template #title>
        <div class="d-flex flex-fill align-items-center">
          <div>
            <img
              :src="`/media/logos/bumaau/defects.png`"
              class="icon"
              alt="defects"
           />
          </div>
          <div class="ms-5">
            <h4 class="title">Historical Defect</h4>
          </div>
        </div>
      </template>
      <template v-if="!isHitOnline">
        <p class="text-danger">
          Out of network, data cannot be retrieved.
        </p>
      </template>
      <div class="d-flex flex-column">
          <p v-for="d in list.slice(0, 3)" :key="d.workOrder" @click="onEFormClick(d)" style="cursor: pointer;">
            {{ d.unitNumber }} - {{ d.equipmentModel }} - {{ d.psType }} Hour Service - {{ d.workOrder }}
          </p>
      </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import {
  useMaintenanceDefectListStore
} from "@/store/pinia/dma/e-form/maintenance-list/defect/useDefectListStore";
import {
  useHistoricalStore
} from "@/store/pinia/dma/historical/useHistoricalStore";
import { computed, defineEmits } from "vue";

const emits = defineEmits(["show-history"]);
const listStore = useMaintenanceDefectListStore();
const historyStore = useHistoricalStore();

defineProps<{
  isHitOnline: boolean
}>()

const list = computed(() => {
  return historyStore.defectList
});

const onEFormClick = (item) => {
  listStore.setSelectedForm(item);
  emits("show-history");
};
</script>

<style scoped>
.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
  width: 100%;
}
.title {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #637381;
}
.icon {
  width: 30px;
  height: 30px;
}
</style>
