<template>
  <div class="d-flex justify-content-between">
    <SelectInput
      :is-disabled="isSiteDisabled"
      :value="filterData.site"
      :isLoading="filterLoading.site"
      label="Site"
      labelClass="text-white"
      popperClass="component_health_data-dropdown"
      name="Site"
      :options="listStore.siteOption"
      class="me-2 component_health_data-filter"
      @handleChange="handleSiteChange" />
    <SelectInput
      :value="filterData.group"
      :isLoading="filterLoading.group"
      label="Group"
      labelClass="text-white"
      popperClass="component_health_data-dropdown"
      name="Group"
      :options="listStore.groupOption"
      class="me-2 component_health_data-filter"
      @handleChange="handleGroupChange" />
    <SelectInput
      :value="filterData.model"
      :isLoading="filterLoading.model"
      label="Model"
      labelClass="text-white"
      popperClass="component_health_data-dropdown"
      name="Model"
      :options="listStore.modelOption"
      class="me-2 component_health_data-filter"
      @handleChange="handleModelChange" />
    <MultiSelectInput
      :value="filterData.equipment"
      :isLoading="filterLoading.equipment"
      label="Equipment"
      labelClass="text-white"
      popperClass="component_health_data-dropdown"
      name="Equipment"
      :options="listStore.equipmentOption"
      class="me-2 component_health_data-filter"
      @handleChange="handleEquipmentChange" />
    <MultiSelectInput
      :value="filterData.component"
      :isLoading="filterLoading.component"
      label="Component"
      labelClass="text-white"
      popperClass="component_health_data-dropdown"
      name="Component"
      :options="listStore.componentOption"
      class="me-2 component_health_data-filter"
      @handleChange="handleComponentChange" />
    <DatePickerInput
      :value="filterData.startDate"
      placeholder="Select Start Date"
      label="Start Date"
      labelClass="text-white"
      name="StartDate"
      class="me-2 component_health_data-filter"
      @handleChange="handleStartDateChange" />
    <DatePickerInput
      :value="filterData.endDate"
      placeholder="Select End Date"
      label="End Date"
      labelClass="text-white"
      name="EndDate"
      class="component_health_data-filter"
      @handleChange="handleEndDateChange" />
  </div>
</template>
<script lang="ts" setup>
import {
  ComputedRef,
  computed,
  onMounted,
  ref,
  watch,
} from 'vue';
import {
  useComponentHealthDataListStore
} from "@/store/pinia/iron-portal/iron-portal-historical/component-health-data/useComponentHealthDataListStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  FilterData
} from '@/core/types/entities/iron-portal/iron-portal-historical/component-health-data/FilterData';


/* import components here */
import SelectInput from '@/components/inputs/SelectInput.vue';
import MultiSelectInput from '@/components/inputs/MultiSelectInput.vue';
import DatePickerInput from '@/components/inputs/DatePickerInput.vue';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '@/core/types/misc/ApiResponse';
import {
  ListItem
} from "@/core/types/entities/administration/organization-unit/employee/ListItem";
import ApiService from '@/core/services/ApiService';
import {
  CRUD_API_URL as GET_EMPLOYEE_API_URL
} from "@/store/pinia/administration/organization-unit/employee/urls";

const listStore = useComponentHealthDataListStore();
const authStore = useAuthenticationStore();

/* refs */
const isSiteDisabled = ref(false)

/* computed */
const filterData: ComputedRef<FilterData> = computed(() => {
  return listStore.filterData;
});
const filterLoading = computed(() => {
  return listStore.filterLoading;
});
const employeeId = computed(() => {
  return authStore.user.EmployeeId
});

watch(employeeId, async () => {
  await setDefaultFilterAccordingToLoggedInUserLocation();
}, { deep: true })

/* methods */
const handleSiteChange = async (event) => {
  listStore.setSite(event);
  await listStore.getLookupGroup();
};
const handleGroupChange = async (event) => {
  listStore.setGroup(event);
  await listStore.getLookupModel();
};
const handleModelChange = async (event) => {
  listStore.setModel(event);
  await listStore.getLookupEquipment();
};
const handleEquipmentChange = async (event) => {
  listStore.setEquipment(event);
  await listStore.getLookupComponent();
};
const handleComponentChange = (event) => {
  listStore.setComponent(event);
};
const handleStartDateChange = (event) => {
  listStore.setStartDate(event);
};
const handleEndDateChange = (event) => {
  listStore.setEndDate(event);
};

const setDefaultFilterAccordingToLoggedInUserLocation = async () => {
  if (employeeId.value) {
    const loggedInUserLocation = await getLocationCode(authStore.user.EmployeeId);
    if (loggedInUserLocation != "AU02") {
      isSiteDisabled.value = true;
      await handleSiteChange(authStore.user.Location);
    }
    return
  }
  listStore.setDefaultFilter("Blackwater");
};
const getLocationCode = async (employeeId) => {
  const params = {
    employeeId: employeeId,
    page: "1",
    pageSize: "1",
    ver: "v1"
  };
  try {
    const response: AxiosResponse<ApiResponse<ListItem>> = await ApiService.get(GET_EMPLOYEE_API_URL, "", new URLSearchParams(params).toString());
    return response.data.result.content[0].Location;
  } catch (error) {
    console.log(error);
  }
  return "";
};

onMounted(async () => {
  await setDefaultFilterAccordingToLoggedInUserLocation();
});

</script>

<style lang="scss">
.component_health_data-filter .el-input__inner {
  background-color: #2d2b39;
  color: white;
  border: none;
}

// Multiselect tag text for selected items
.component_health_data-filter .el-select .el-select__tags .el-tag, .component_health_data-filter .el-select__input {
  background-color: #2d2b39;
  color: white;
}

// Multiselect dropdown close icon
.component_health_data-filter .el-select .el-select__tags .el-tag .el-icon-close {
  color: #2d2b39;
}

// Multiselect and usual dropdown background
.component_health_data-filter.el-select__popper.el-popper[role=tooltip], .component_health_data-dropdown.el-select__popper.el-popper[role=tooltip] {
  background: #2d2b39 !important;
}

// Triangle on top of dropdown
.component_health_data-dropdown.el-popper .el-popper__arrow::before {
  background-color: #2d2b39;
  border: 1px #2d2b39 solid !important;
}

// Dropdown background
.component_health_data-dropdown, .component_health_data-dropdown .el-select__popper.el-popper[role="tooltip"] {
  background: #2d2b39;
  border: 1px #2d2b39 solid !important;
}

// Dropdown item background and color
.component_health_data-dropdown .el-select-dropdown__item {
  color: #fff;
  &:hover {
    background-color: #3d3d4b;
  }
}
// Dropdown item when selected
.component_health_data-dropdown .el-select-dropdown__item.selected {
  color: #409eff;
  background-color: #3d3d4b;
}
</style>
