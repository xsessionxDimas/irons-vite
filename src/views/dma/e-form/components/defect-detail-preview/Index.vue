<template>
    <div class="w-100 px-1 mx-0">
      <h1><span class="me-3"></span>{{listStore.selectedForm.equipmentModel}} {{ equipmentModelGroupDescription }} {{listStore.selectedForm.psType}} Hr Service {{listStore.selectedForm.unitNumber}} {{listStore.selectedForm.workOrder}}</h1>
      <DefectIdentified :data="defectStore.ApprovalData"/>
    </div>
</template>

<script lang="ts" setup>
import DefectIdentified from "@/views/dma/components/form-preview/components/defect-identified/Index.vue"
import { computed, onUnmounted } from 'vue';
import {
  useMaintenanceDefectListOnFormStore
} from '@/store/pinia/dma/e-form/maintenance-list/defect/useDefectListOnFormStore';
import {
  useMaintenanceDefectListStore
} from '@/store/pinia/dma/e-form/maintenance-list/defect/useDefectListStore';
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form/defects/useDefectsStore";
import { checkDozer } from "@/store/pinia/dma/e-form/helpers";

const store = useMaintenanceDefectListOnFormStore();
const listStore = useMaintenanceDefectListStore()
const defectStore = useDefectsStore()

const equipmentModelGroupDescription = computed(() => {
  return checkDozer(listStore.selectedForm.equipmentModel) ? 'Dozer' : 'Dump Truck'
})

onUnmounted(() => {
  store.reset()
});
</script>
