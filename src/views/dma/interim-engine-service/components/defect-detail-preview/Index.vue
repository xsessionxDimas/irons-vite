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
  useInterimMaintenanceDefectListOnFormStore
} from '@/store/pinia/dma/interim-engine-service/maintenance-list/defect/useInterimMaintenanceDefectListOnFormStore';
import {
  useInterimMaintenanceDefectListStore
} from '@/store/pinia/dma/interim-engine-service/maintenance-list/defect/useInterimMaintenanceDefectListStore';
import {
  useInterimDefectsStore
} from "@/store/pinia/dma/interim-engine-service/defects/useInterimDefectsStore";
import { checkDozer } from "@/store/pinia/dma/e-form/helpers";

const store = useInterimMaintenanceDefectListOnFormStore();
const listStore = useInterimMaintenanceDefectListStore()
const defectStore = useInterimDefectsStore()

const equipmentModelGroupDescription = computed(() => {
  return checkDozer(listStore.selectedForm.equipmentModel) ? 'Dozer' : 'Dump Truck'
})

onUnmounted(() => {
  store.reset()
});
</script>
