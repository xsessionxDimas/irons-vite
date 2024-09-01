<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.SiteId"
              :value-to="filterData.SiteIdTo"
              label="Site"
              :options="listStore.siteOption"
              @handle-change-from="onSiteSelected"
              @handle-change-to="onSiteSelectedTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <Datepicker
              :value-from="filterData.StartDate"
              :value-to="filterData.StartDateTo"
              label="Start Date"
              @handle-change-from="onStartDateSelected"
              @handle-change-to="onStartDateToSelected"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <Datepicker
              :value-from="filterData.EndDate"
              :value-to="filterData.EndDateTo"
              label="End Date"
              @handle-change-from="onEndDateSelected"
              @handle-change-to="onuserEndDateToSelected"
           />
          </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
              <el-button type="secondary" @click="handleReset">Reset</el-button>
              <el-button type="primary" @click="handleFilterClick">Filter</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import AutoComplete from "@/components/inputs/range-inputs/AutoComplete.vue";
import Datepicker from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useSiteListStore
} from "@/store/pinia/iron-lake/business-partner/site-v1/useSiteListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/site-v1/FilterData";


/* stores */
const listStore = useSiteListStore();
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* refs*/
const isVisible = toRef(props, "visibility");
const filterData: ComputedRef<FilterData> = computed(() => {
  return listStore.filterData;
});

/* handlers */
const handleReset = () => {
  handleCloseModal()
  listStore.resetFilter()
}
const handleCloseModal = () => {
  emits("handle-close", false);
}
const onSiteSelected = (value: string) => {
  listStore.setSite(value);
}
const onSiteSelectedTo = (value: string) => {
  listStore.setSiteTo(value);
}
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
}
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value);
}
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
}
const onuserEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value);
}
const handleFilterClick = () => {
  const CheckSite = listStore.lastUsedFilterData.Site !== listStore.filterData.Site
  const CheckStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const CheckEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const CheckSiteTo = listStore.lastUsedFilterData.SiteTo !== listStore.filterData.SiteTo
  const CheckStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const CheckEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo
  const status = (CheckSite || CheckStartDate || CheckEndDate || CheckSiteTo || CheckStartDateTo || CheckEndDateTo)
  emits("handle-close", status);
}
</script>
