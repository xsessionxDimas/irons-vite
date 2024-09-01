<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()">
        <div class="row g-4 my-4">
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.CbmParameterId"
              :value-to="filterData.CbmParameterIdTo"
              placeholder="Add ID CBM Parameter"
              label="ID CBM Parameter"
              @handle-change-from="handleCbmParameterIdChange"
              @handle-change-to="handleCbmParameterIdChangeTo"
              :options="listStore.CbmParameterIDOption"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              placeholder="Add ID Component"
              :value-from="filterData.ComponentId"
              :value-to="filterData.ComponentIdTo"
              :options="listStore.ComponentOption"
              label="ID Component"
              @handle-change-from="handleComponentIdChange"
              @handle-change-to="handleComponentIdChangeTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.TypeParameterId"
              :value-to="filterData.TypeParameterIdTo"
              label="Type Parameter"
              placeholder="Add Type Parameter"
              @handle-change-from="handleTypeParameterChange"
              @handle-change-to="handleTypeParameterChangeTo"
              :options="listStore.ParameterTypeOption"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.CbmGroup"
              :value-to="filterData.CbmGroupTo"
              :options="listStore.CbmGroupOption"
              label="CBM Group"
              placeholder="Add CBM Group"
              @handle-change-from="handleCbmGroupChange"
              @handle-change-to="handleCbmGroupChangeTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.CbmArea"
              :value-to="filterData.CbmAreaTo"
              :options="listStore.AreaCbmOption"
              label="Area CBM"
              placeholder="Add Area CBM"
              @handle-change-from="handleCbmAreaChange"
              @handle-change-to="handleCbmAreaChangeTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.ModelId"
              :value-to="filterData.ModelIdTo"
              :options="listStore.ModelOption"
              label="Model"
              placeholder="Add Model"
              @handle-change-from="handleModelChange"
              @handle-change-to="handleModelChangeTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.PsTypeId"
              :value-to="filterData.PsTypeIdTo"
              :options="listStore.PsTypeOption"
              label="PS Type"
              placeholder="Add PS Type"
              @handle-change-from="handlePsTypeChange"
              @handle-change-to="handlePsTypeChangeTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.TaskNumber"
              :value-to="filterData.TaskNumberTo"
              label="Task Number"
              placeholder="Add Task Number"
              @handle-change-from="handleTaskNumberChange"
              @handle-change-to="handleTaskNumberChangeTo"
              :options="listStore.TaskNumberOption"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.DetailNumber"
              :value-to="filterData.DetailNumberTo"
              label="No Detail"
              placeholder="Add No Detail"
              @handle-change-from="handleDetailNumberChange"
              @handle-change-to="handleDetailNumberChangeTo"
              :options="listStore.DetailNumberOption"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.CbmParameter"
              :value-to="filterData.CbmParameterTo"
              :options="listStore.CbmParameterOption"
              label="CBM Parameter"
              placeholder="Add CBM Parameter"
              @handle-change-from="handleCbmParameterChange"
              @handle-change-to="handleCbmParameterChangeTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.Parameter"
              :value-to="filterData.ParameterTo"
              label="Parameter"
              placeholder="Add Parameter"
              @handle-change-from="handleParameterChange"
              @handle-change-to="handleParameterChangeTo"
              :options="listStore.ParameterOption"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.MinValue"
              :value-to="filterData.MinValueTo"
              label="Value Min"
              placeholder="Add Value Min"
              @handle-change-from="handleValueMinChange"
              @handle-change-to="handleValueMinChangeTo"
              :options="listStore.MinValueOption"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.MaxValue"
              :value-to="filterData.MaxValueTo"
              label="Value Max"
              placeholder="Add Value Max"
              @handle-change-from="handleValueMaxChange"
              @handle-change-to="handleValueMaxChangeTo"
              :options="listStore.MaxValueOption"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.Uom"
              :value-to="filterData.UomTo"
              :options="listStore.UomOption"
              label="UOM"
              placeholder="Add UOM"
              name="Uom"
              @handle-change-from="handleUomChange"
              @handle-change-to="handleUomChangeTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.StatusConverter"
              :value-to="filterData.StatusConverterTo"
              :options="listStore.StatusConverterOption"
              label="Status Converter"
              placeholder="Add Status Converter"
              @handle-change-from="handleStatusConverterChange"
              @handle-change-to="handleStatusConverterChangeTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-from="filterData.StatusDescriptionConverter"
              :value-to="filterData.StatusDescriptionConverterTo"
              :options="listStore.StatusConverterDescriptionOption"
              label="Status Converter Description"
              placeholder="Add Status Converter Description"
              @handle-change-from="handleStatusDescriptionConverterChange"
              @handle-change-to="handleStatusDescriptionConverterChangeTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-to="filterData.StatusTo"
              :value-from="filterData.Status"
              label="Status"
              placeholder="Add Status"
              @handle-change-from="handleStatusChange"
              @handle-change-to="handleStatusChangeTo"
              :options="listStore.StatusOption"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <AutoComplete
              :value-to="filterData.StatusDescriptionTo"
              :value-from="filterData.StatusDescription"
              label="Status Description"
              placeholder="Add Status Description"
              @handle-change-from="handleStatusDescriptionChange"
              @handle-change-to="handleStatusDescriptionChangeTo"
              :options="listStore.StatusDescriptionOption"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <Datepicker
              :value-to="filterData.StartDateTo"
              :value-from="filterData.StartDate"
              placeholder="Add Start Date"
              label="Start Date"
              @handle-change-from="handleStartDateChange"
              @handle-change-to="handleStartDateChangeTo"
           />
          </div>
          <div class="w-100 fv-row fv-plugins-icon-container">
            <Datepicker
              :value-from="filterData.EndDate"
              :value-to="filterData.EndDateTo"
              placeholder="Add End  Date"
              label="End  Date"
              @handle-change-from="handleEndDateChange"
              @handle-change-to="handleEndDateChangeTo"
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
  useParameterEhmsListStore
} from "@/store/pinia/iron-lake/parameter/parameter-ehms/useParameterEhmsListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/parameter/parameter-ehms/FilterData";

/* stores */
const listStore = useParameterEhmsListStore();
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
const handleCbmParameterIdChange = (value: string) => {
  listStore.setCbmParameterId(value)
}
const handleComponentIdChange = (value: string) => {
  listStore.setComponentId(value)
}
const handleCbmGroupChange = (value: string) => {
  listStore.setCbmGroup(value)
}
const handleCbmAreaChange = (value: string) => {
  listStore.setCbmArea(value)
}
const handleModelChange = (value: string) => {
  listStore.setModelId(value)
}
const handlePsTypeChange = (value: string) => {
  listStore.setPsTypeId(value)
}
const handleTaskNumberChange = (value: string) => {
  listStore.setTaskNumber(value)
}
const handleDetailNumberChange = (value: string) => {
  listStore.setDetailNumber(value)
}
const handleCbmParameterChange = (value: string) => {
  listStore.setCbmParameter(value)
}
const handleParameterChange = (value: string) => {
  listStore.setParameter(value)
}
const handleTypeParameterChange = (value: string) => {
  listStore.setTypeParameter(value)
}
const handleValueMinChange = (value: string) => {
  listStore.setMinValue(value)
}
const handleValueMaxChange = (value: string) => {
  listStore.setMaxValue(value)
}
const handleUomChange = (value: string) => {
  listStore.setUom(value)
}
const handleStatusConverterChange = (value: string) => {
  listStore.setStatusConverter(value)
}
const handleStatusDescriptionConverterChange = (value: string) => {
  listStore.setStatusDescriptionConverter(value)
}
const handleStatusChange = (value: string) => {
  listStore.setStatus(value)
}
const handleStatusDescriptionChange = (value: string) => {
  listStore.setStatusDescription(value)
}
const handleStartDateChange = (value: string) => {
  listStore.setStartDate(value)
}
const handleEndDateChange = (value: string) => {
  listStore.setEndDate(value)
}
const handleCbmParameterIdChangeTo = (value: string) => {
  listStore.setCbmParameterIdTo(value)
}
const handleComponentIdChangeTo = (value: string) => {
  listStore.setComponentIdTo(value)
}
const handleCbmGroupChangeTo = (value: string) => {
  listStore.setCbmGroupTo(value)
}
const handleCbmAreaChangeTo = (value: string) => {
  listStore.setCbmAreaTo(value)
}
const handleModelChangeTo = (value: string) => {
  listStore.setModelIdTo(value)
}
const handlePsTypeChangeTo = (value: string) => {
  listStore.setPsTypeIdTo(value)
}
const handleTaskNumberChangeTo = (value: string) => {
  listStore.setTaskNumberTo(value)
}
const handleDetailNumberChangeTo = (value: string) => {
  listStore.setDetailNumberTo(value)
}
const handleCbmParameterChangeTo = (value: string) => {
  listStore.setCbmParameterTo(value)
}
const handleParameterChangeTo = (value: string) => {
  listStore.setParameterTo(value)
}
const handleTypeParameterChangeTo = (value: string) => {
  listStore.setTypeParameterTo(value)
}
const handleValueMinChangeTo = (value: string) => {
  listStore.setMinValueTo(value)
}
const handleValueMaxChangeTo = (value: string) => {
  listStore.setMaxValueTo(value)
}
const handleUomChangeTo = (value: string) => {
  listStore.setUomTo(value)
}
const handleStatusConverterChangeTo = (value: string) => {
  listStore.setStatusConverterTo(value)
}
const handleStatusDescriptionConverterChangeTo = (value: string) => {
  listStore.setStatusDescriptionConverterTo(value)
}
const handleStatusChangeTo = (value: string) => {
  listStore.setStatusTo(value)
}
const handleStatusDescriptionChangeTo = (value: string) => {
  listStore.setStatusDescriptionTo(value)
}
const handleStartDateChangeTo = (value: string) => {
  listStore.setStartDateTo(value)
}
const handleEndDateChangeTo = (value: string) => {
  listStore.setEndDateTo(value)
}
const handleFilterClick = () => {
  const CheckComponentId = listStore.lastUsedFilterData.ComponentId !== listStore.filterData.ComponentId
  const CheckCbmGroup = listStore.lastUsedFilterData.CbmGroup !== listStore.filterData.CbmGroup
  const CheckCbmArea = listStore.lastUsedFilterData.CbmArea !== listStore.filterData.CbmArea
  const CheckCbmParameterId = listStore.lastUsedFilterData.CbmParameterId !== listStore.filterData.CbmParameterId
  const CheckModelId = listStore.lastUsedFilterData.ModelId !== listStore.filterData.ModelId
  const CheckPsTypeId = listStore.lastUsedFilterData.PsTypeId !== listStore.filterData.PsTypeId
  const CheckTaskNumber = listStore.lastUsedFilterData.TaskNumber !== listStore.filterData.TaskNumber
  const CheckDetailNumber = listStore.lastUsedFilterData.DetailNumber !== listStore.filterData.DetailNumber
  const CheckCbmParameter = listStore.lastUsedFilterData.CbmParameter !== listStore.filterData.CbmParameter
  const CheckParameter = listStore.lastUsedFilterData.Parameter !== listStore.filterData.Parameter
  const CheckMinValue = listStore.lastUsedFilterData.MinValue !== listStore.filterData.MinValue
  const CheckMaxValue = listStore.lastUsedFilterData.MaxValue !== listStore.filterData.MaxValue
  const CheckUom = listStore.lastUsedFilterData.Uom !== listStore.filterData.Uom
  const CheckTypeParameterId = listStore.lastUsedFilterData.TypeParameterId !== listStore.filterData.TypeParameterId
  const CheckStatusConverter = listStore.lastUsedFilterData.StatusConverter !== listStore.filterData.StatusConverter
  const CheckStatusDescriptionConverter = listStore.lastUsedFilterData.StatusDescriptionConverter !== listStore.filterData.StatusDescriptionConverter
  const CheckStatus = listStore.lastUsedFilterData.Status !== listStore.filterData.Status
  const CheckStatusDescription = listStore.lastUsedFilterData.StatusDescription !== listStore.filterData.StatusDescription
  const CheckStartDate = listStore.lastUsedFilterData.StartDate !== listStore.filterData.StartDate
  const CheckEndDate = listStore.lastUsedFilterData.EndDate !== listStore.filterData.EndDate

  const CheckComponentIdTo = listStore.lastUsedFilterData.ComponentIdTo !== listStore.filterData.ComponentIdTo
  const CheckCbmGroupTo = listStore.lastUsedFilterData.CbmGroupTo !== listStore.filterData.CbmGroupTo
  const CheckCbmAreaTo = listStore.lastUsedFilterData.CbmAreaTo !== listStore.filterData.CbmAreaTo
  const CheckCbmParameterIdTo = listStore.lastUsedFilterData.CbmParameterIdTo !== listStore.filterData.CbmParameterIdTo
  const CheckModelIdTo = listStore.lastUsedFilterData.ModelIdTo !== listStore.filterData.ModelIdTo
  const CheckPsTypeIdTo = listStore.lastUsedFilterData.PsTypeIdTo !== listStore.filterData.PsTypeIdTo
  const CheckTaskNumberTo = listStore.lastUsedFilterData.TaskNumberTo !== listStore.filterData.TaskNumberTo
  const CheckDetailNumberTo = listStore.lastUsedFilterData.DetailNumberTo !== listStore.filterData.DetailNumberTo
  const CheckCbmParameterTo = listStore.lastUsedFilterData.CbmParameterTo !== listStore.filterData.CbmParameterTo
  const CheckParameterTo = listStore.lastUsedFilterData.ParameterTo !== listStore.filterData.ParameterTo
  const CheckMinValueTo = listStore.lastUsedFilterData.MinValueTo !== listStore.filterData.MinValueTo
  const CheckMaxValueTo = listStore.lastUsedFilterData.MaxValueTo !== listStore.filterData.MaxValueTo
  const CheckUomTo = listStore.lastUsedFilterData.UomTo !== listStore.filterData.UomTo
  const CheckTypeParameterIdTo = listStore.lastUsedFilterData.TypeParameterIdTo !== listStore.filterData.TypeParameterIdTo
  const CheckStatusConverterTo = listStore.lastUsedFilterData.StatusConverterTo !== listStore.filterData.StatusConverterTo
  const CheckStatusDescriptionConverterTo = listStore.lastUsedFilterData.StatusDescriptionConverterTo !== listStore.filterData.StatusDescriptionConverterTo
  const CheckStatusTo = listStore.lastUsedFilterData.StatusTo !== listStore.filterData.StatusTo
  const CheckStatusDescriptionTo = listStore.lastUsedFilterData.StatusDescriptionTo !== listStore.filterData.StatusDescriptionTo
  const CheckStartDateTo = listStore.lastUsedFilterData.StartDateTo !== listStore.filterData.StartDateTo
  const CheckEndDateTo = listStore.lastUsedFilterData.EndDateTo !== listStore.filterData.EndDateTo

  const status = (CheckComponentId || CheckCbmGroup || CheckCbmArea || CheckCbmParameterId || CheckModelId || CheckPsTypeId || CheckTaskNumber || CheckDetailNumber || CheckCbmParameter || CheckParameter || CheckMinValue || CheckMaxValue || CheckUom || CheckStatusConverter || CheckStatusDescriptionConverter || CheckStatus || CheckStatusDescription || CheckStartDate || CheckEndDate || CheckTypeParameterId || CheckComponentIdTo || CheckCbmGroupTo || CheckCbmAreaTo || CheckCbmParameterIdTo || CheckModelIdTo || CheckPsTypeIdTo || CheckTaskNumberTo || CheckDetailNumberTo || CheckCbmParameterTo || CheckParameterTo || CheckMinValueTo || CheckMaxValueTo || CheckUomTo || CheckTypeParameterIdTo || CheckStatusConverterTo || CheckStatusDescriptionConverterTo || CheckStatusTo || CheckStatusDescriptionTo || CheckStartDateTo || CheckEndDateTo)
  emits("handle-close", status);
}
</script>
