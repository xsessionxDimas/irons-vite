<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-4 my-4">
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <AutoComplete
            :value="filterData.Shift"
            label="Shift"
            name="Shift"
            :options="listStore.shiftOption"
            @handle-change="onShiftSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <TimePickerInput
              :value="filterData.StartHour ? `${filterData.StartHour} ${filterData.StartHourType}` : ''"
              placeholder="Add Start Hour"
              label="Start Hour"
              name="StartHour"
              @handleChange="onStartHourSelected" />
          </div>
          <div class="col-md-6 fv-row fv-plugins-icon-container">
            <TimePickerInput
              :value="filterData.EndHour ? `${filterData.EndHour} ${filterData.EndHourType}` : ''"
              placeholder="Add End Hour"
              label="End Hour"
              name="EndHour"
              @handleChange="onEndHourSelected" />
          </div>
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
import TimePickerInput from '@/components/inputs/TimePickerInput.vue';
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useShiftListStore
} from "@/store/pinia/administration/organization-unit/shift/useShiftListStore";
import {
  FilterData
} from "@/core/types/entities/administration/organization-unit/shift/FilterData";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";


/* stores */
const listStore = useShiftListStore();
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
const onShiftSelected = (value: string) => {
  listStore.setShift(value);
}
const onStartHourSelected = (value: string) => {
  if (value) {
    const hourNType = value.split(" ")
    filterData.value.StartHour = hourNType[0]
    filterData.value.StartHourType = hourNType[1]
  } else {
    filterData.value.StartHour = ""
    filterData.value.StartHourType = ""
  }
}
const onEndHourSelected = (value: string) => {
  if (value) {
    const hourNType = value.split(" ")
    filterData.value.EndHour = hourNType[0]
    filterData.value.EndHourType = hourNType[1]
  } else {
    filterData.value.EndHour = ""
    filterData.value.EndHourType = ""
  }
}
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
}
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
}
const handleFilterClick = () => {
  const checkShift = listStore.lastUsedFilterData.Shift !== listStore.filterData.Shift
  const checkStartHour = listStore.lastUsedFilterData.StartHour !== listStore.filterData.StartHour
  const checkStartHourType = listStore.lastUsedFilterData.StartHourType !== listStore.filterData.StartHourType
  const checkEndHour = listStore.lastUsedFilterData.EndHour !== listStore.filterData.EndHour
  const checkEndHourType = listStore.lastUsedFilterData.EndHourType !== listStore.filterData.EndHourType
  const checkStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const checkEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate
  const status = (checkShift || checkStartHour || checkStartHourType || checkEndHour || checkEndHourType || checkStartDate || checkEndDate)
  emits("handle-close", status);
}
</script>
