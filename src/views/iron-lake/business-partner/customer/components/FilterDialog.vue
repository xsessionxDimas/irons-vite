<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-9 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Customer"
            label="Customer"
            name="Customer"
            :options="listStore.customerOption"
            @handle-change="onCustomerSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.CustomerDescription"
            label="Customer Description"
            name="CustomerDescription"
            :options="listStore.customerDescOption"
            @handle-change="onCustomerDescSelected" />
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
  useCustomerListStore
} from "@/store/pinia/iron-lake/business-partner/customer/useCustomerListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/business-partner/customer/FilterData";


/* stores */
const listStore = useCustomerListStore();
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
const onCustomerSelected = (value: string) => {
  listStore.setCustomer(value);
}
const onCustomerDescSelected = (value: string) => {
  listStore.setCustomerDescription(value);
}
const handleFilterClick = () => {
  const checkCustomer = listStore.lastUsedFilterData.Customer !== listStore.filterData.Customer
  const checkCustomerDesc = listStore.lastUsedFilterData.CustomerDescription !== listStore.filterData.CustomerDescription
  const status = (checkCustomer || checkCustomerDesc)
  emits("handle-close", status);
}
</script>
