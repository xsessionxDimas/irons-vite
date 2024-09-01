<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.SubSite"
            label="Sub Site"
            name="SubSite"
            :options="listStore.subSiteOption"
            @handle-change="onSubSiteSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.SubSiteDescription"
            label="Sub Site Description"
            name="SubSiteDescription"
            :options="listStore.subSiteDescOption"
            @handle-change="onSubSiteDescSelected" />
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
  useSubSiteListStore
} from "@/store/pinia/iron-lake/business-partner/sub-site/useSubSiteListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/sub-site/FilterData";


/* stores */
const listStore = useSubSiteListStore();
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
const onSubSiteSelected = (value: string) => {
  listStore.setSubsite(value);
}
const onSubSiteDescSelected = (value: string) => {
  listStore.setSubsiteDescription(value);
}
const handleFilterClick = () => {
  const checkSubSite = listStore.lastUsedFilterData.SubSite !== listStore.filterData.SubSite
  const checkSubSiteDesc = listStore.lastUsedFilterData.SubSiteDescription !== listStore.filterData.SubSiteDescription
  const status = (checkSubSite || checkSubSiteDesc)
  emits("handle-close", status);
}
</script>
