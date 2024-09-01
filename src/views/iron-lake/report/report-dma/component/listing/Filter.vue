<template>
   <div class="grid-icon-buttons d-flex justify-content-between flex-wrap align-items-center">
      <div class="d-flex justify-content-between align-items-center">
        <div class="me-3">
          <AutoComplete
            :value="filterData.Site"
            label="Site"
            name=""
            :options="listStore.siteOptions"
            @handle-change="onSiteSelected"
         />
        </div>
        <div class="me-3">
          <AutoComplete
            :value="filterData.Model"
            label="Model"
            name=""
            :options="listStore.modelOptions"
            @handle-change="onModelSelected"
         />
          </div>
        <div class="me-3">
          <AutoComplete
            :value="filterData.Equipment"
            label="Equipment"
            name=""
            :options="listStore.equipmentOptions"
            @handle-change="onEquipmentSelected"
         />
          </div>
        <div class="me-3">
          <AutoComplete
            :value="filterData.PsType"
            label="PS Type"
            name=""
            :options="listStore.psTypeOptions"
            @handle-change="onPsTypeSelected"
         />
          </div>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <el-button type="primary" @click="handleFetch">Generate</el-button>
      </div>
    </div>
</template>

<script lang="ts" setup>
import { swalAlertErrorBulk } from "@/core/helpers/sweet-alert";
import {
  useHistoricalEformDmaListStore
} from "@/store/pinia/report/history/dma/useHistoricalEformDmaListStore";
import { defineEmits } from "vue";
import { computed, ComputedRef } from "@vue/reactivity";
import {
  FilterData
} from '@/core/types/entities/report/history/historical-eform-dma/FilterData';
import AutoComplete from "@/components/inputs/AutoComplete.vue";

const emits = defineEmits(["handleFetch"])
const listStore = useHistoricalEformDmaListStore();

const filterData: ComputedRef<FilterData> = computed(() => {
  return listStore.filterData;
});

const onSiteSelected = (value: string) => {
  listStore.setSite(value)
}
const onModelSelected = (value: string) => {
  listStore.setModel(value)
}
const onEquipmentSelected = (value: string) => {
  listStore.setEquipment(value)
}
const onPsTypeSelected = (value: string) => {
  listStore.setPsType(value)
}

const handleFetch = () => {
  if (filterData.value.Site || filterData.value.Equipment || filterData.value.Model || filterData.value.PsType) {
    emits("handleFetch")
  } else {
    swalAlertErrorBulk("Must fill one of the filter");
  }
}
</script>

