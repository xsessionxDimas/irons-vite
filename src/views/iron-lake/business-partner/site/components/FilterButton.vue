<template>
  <el-popover
    placement="bottom"
    :width="480"
    trigger="click"
    :visible="visible"
  >
    <template #reference>
      <button
        class="d-flex gap-2 align-items-center btn btn-btech-outline px-4 py-2"
        @click="handleFilterClicked">
        <icon name="filter" size="24" />
        Filter
      </button>
    </template>
    <template #default>
      <div class="employee-filter-container">
        <div class="employee-filter-header">
          <p class="m-0 fw-700 text-large">Filters</p>
        </div>
        <div class="row employee-filter-body">
          <div class="col-12">
            <TextInput
              :value="data.site"
              :margin="false"
              placeholder="Search Site ID, Site Code or Site name"
              label="Site"
              name="Site"
              @handle-change="(value) => (data.site = value)"
              :max="255"
            />
          </div>
          <div class="col-12">
            <SelectInput
              class="m-0"
              :margin="false"
              :options="isActive"
              :value="data.status"
              name="Status"
              label="Status"
              placeholder="Select status"
              @handleChange="(value) => (data.status = value )"
            />
          </div>
        </div>
        <div class="employee-filter-footer">
          <div>
            <button class="btn btn-btech-outline" @click="onReset">
              Reset
            </button>
          </div>
          <div class="d-flex gap-4 align-items-center">
            <button class="btn btn-btech-outline" @click="handleCloseFilter">
              Close
            </button>
            <button class="btn btn-btech" @click="onClick">Apply</button>
          </div>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { computed, defineEmits, ref } from "vue";
import TextInput from "@/components/inputs/TextInput.vue";
import Icon from "@/components/ironlake/Icon.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import {
  useSiteListStore
} from "@/store/pinia/iron-lake/business-partner/site/useSiteListStore";

const listStore = useSiteListStore();

const data = ref({
  site: "",
  status: "",
  ver: "v1",
  page: 1,
  pageSize: 20,
});
const isActive = ref([
  { value: "", label: "All" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
]);
const visible = ref(false);

const emit = defineEmits(["applyFilter"]);
const onClick = () => {
  emit("applyFilter", data);
};
const handleFilterClicked = () => {
  data.value.site = listStore.stateLastUsedFilterData.site;
  data.value.status = listStore.stateLastUsedFilterData.status;
  visible.value = !visible.value
}
const handleCloseFilter = () => {
  data.value.site = listStore.stateLastUsedFilterData.site;
  data.value.status = listStore.stateLastUsedFilterData.status;
  visible.value = false
}
const onReset = () => {
  data.value.site = "";
  data.value.status = "";
};
</script>

<style scoped lang="scss">
.employee-filter-container {
  .employee-filter-header {
    padding: 12px;
  }

  .employee-filter-body {
    padding: 12px;
    gap: 24px;
    border-bottom: 1px solid #919eab3d;
  }

  .employee-filter-footer {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
}
.btn-btech {
  border: 1.5px solid #01a3ff !important;
  color: #fff;
  background-color: #01a3ff;
}
.btn-btech:hover {
  background-color: #0175ff;
  color: #fff;
}
.btn-btech-outline {
  border: 1.5px solid #01a3ff !important;
  color: #01a3ff;
}
.btn-btech-outline:hover {
  background-color: #01a3ff;
  color: #fff;
}
.el-form-item {
  margin-bottom: 0 !important;
}
</style>
