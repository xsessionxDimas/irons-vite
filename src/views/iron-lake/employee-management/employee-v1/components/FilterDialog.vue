<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-4 my-4">
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
            :value="filterData.EmployeeCode"
            label="Employee ID"
            name="EmployeeCode"
            :options="listStore.employeeCodeOption"
            @handle-change="onEmployeeCodeSelected" />
          </div>
          <!-- <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Name"
            label="Name"
            name="Name"
            :options="listStore.nameOption"
            @handle-change="onNameSelected" />
          </div> -->
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.AdAccount"
            label="Ad Account"
            name="AdAccount"
            :options="listStore.adAccountOption"
            @handle-change="onAdAccountSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Email"
            label="Email"
            name="Email"
            :options="listStore.emailOption"
            @handle-change="onEmailSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Phone"
            label="Phone"
            name="Phone"
            :options="listStore.phoneOption"
            @handle-change="onPhoneSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <SelectInput
            :value="filterData.Gender"
            label="Gender"
            name="Gender"
            :options="listStore.genderOption"
            @handle-change="onGenderSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Position"
            label="Position"
            name="Position"
            :options="listStore.positionOption"
            @handle-change="onPositionSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Location"
            label="Location"
            name="Location"
            :options="listStore.locationOption"
            @handle-change="onLocationSelected" />
          </div>
          <!-- <div class="col-md-6 fv-row fv-plugins-icon-container"></div> -->
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <DatePickerInput
                :value="filterData.StartDate ? filterData.StartDate.toString() : ''"
                placeholder="Add Start Date"
                label="Start Date"
                name="StartDate"
                @handleChange="onStartDateSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <DatePickerInput
                :value="filterData.EndDate ? filterData.EndDate.toString() : ''"
                placeholder="Add End Date"
                label="End Date"
                name="EndDate"
                @handleChange="onEndDateSelected" />
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
import SelectInput from "@/components/inputs/SelectInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useEmployeeListStore
} from "@/store/pinia/administration/organization-unit/employee-v1/useEmployeeListStore";
import {
  FilterData
} from "@/core/types/entities/administration/organization-unit/employee-v1/FilterData";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";


/* stores */
const listStore = useEmployeeListStore();
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
const onEmployeeCodeSelected = (value: string) => {
  listStore.setEmployeeCode(value);
}
const onCompanySelected = (value: string) => {
  listStore.setCompany(value);
}
const onNameSelected = (value: string) => {
  listStore.setName(value);
}
const onAdAccountSelected = (value: string) => {
  listStore.setAdAccount(value);
}
const onEmailSelected = (value: string) => {
  listStore.setEmail(value);
}
const onPhoneSelected = (value: string) => {
  listStore.setPhone(value);
}
const onGenderSelected = (value: string) => {
  listStore.setGender(value);
}
const onPositionSelected = (value: string) => {
  listStore.setPosition(value);
}
const onLocationSelected = (value: string) => {
  listStore.setLocation(value);
}
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
}
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
}
const handleFilterClick = () => {
  const checkEmployeeCode = listStore.lastUsedFilterData.EmployeeCode !== listStore.filterData.EmployeeCode
  const checkCompany = listStore.lastUsedFilterData.Company !== listStore.filterData.Company
  const checkName = listStore.lastUsedFilterData.Name !== listStore.filterData.Name
  const checkAdAccount = listStore.lastUsedFilterData.AdAccount !== listStore.filterData.AdAccount
  const checkEmail = listStore.lastUsedFilterData.Email !== listStore.filterData.Email
  const checkPhone = listStore.lastUsedFilterData.Phone !== listStore.filterData.Phone
  const checkGender = listStore.lastUsedFilterData.Gender !== listStore.filterData.Gender
  const checkPosition = listStore.lastUsedFilterData.Position !== listStore.filterData.Position
  const checkLocation = listStore.lastUsedFilterData.Location !== listStore.filterData.Location
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const status = (checkEmployeeCode || checkCompany || checkName || checkAdAccount || checkEmail || checkPhone || checkGender || checkPosition || checkLocation || checkStartDate || checkEndDate)
  emits("handle-close", status);
}
</script>
