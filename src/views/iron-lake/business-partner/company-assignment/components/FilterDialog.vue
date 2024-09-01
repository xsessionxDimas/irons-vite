<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Company"
            label="Company"
            name="Company"
            :options="listStore.companyOption"
            @handle-change="onCompanySelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Site"
            label="Site"
            name="Site"
            :options="listStore.siteOption"
            @handle-change="onSiteSelected" />
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
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useCompanyAssignmentListStore
} from "@/store/pinia/iron-lake/business-partner/company-assignment/useCompanyAssignmentListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/company-assignment/FilterData";


/* stores */
const listStore = useCompanyAssignmentListStore();
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
const onCompanySelected = (value: string) => {
  listStore.setCompany(value);
}
const onSiteSelected = (value: string) => {
  listStore.setCompanySite(value);
}
const handleFilterClick = () => {
  const checkCompany = listStore.lastUsedFilterData.Company !== listStore.filterData.Company
  const checkSite = listStore.lastUsedFilterData.Site !== listStore.filterData.Site
  const status = (checkCompany || checkSite)
  emits("handle-close", status);
}
</script>
