<template>
  <el-dialog
    v-model="isVisible"
    title="Filter"
    width="60%"
    @close="handleCloseModal()"
  >
    <div class="row g-9 my-4">
      <AutoComplete
        :value-from="filterData.equipmentModel"
        :value-to="filterData.equipmentModelTo"
        label="Equipment Model"
        name="EquipmentModel"
        :options="listStore.equipmentModelOption"
        @handle-change-from="onEquipmentModelSelected"
        @handle-change-to="onEquipmentModelToSelected"
     />
      <AutoComplete
        :value-from="filterData.component"
        :value-to="filterData.componentTo"
        label="Component"
        name="Component"
        :options="listStore.componentOption"
        @handle-change-from="onComponentSelected"
        @handle-change-to="onComponentToSelected"
     />
     <AutoComplete
        :value-from="filterData.interventionCode"
        :value-to="filterData.interventionCodeTo"
        label="Intervention Code"
        name="InterventionCode"
        :options="listStore.interventionCodeOption"
        @handle-change-from="onInterventionCodeSelected"
        @handle-change-to="onInterventionCodeToSelected"
     />
     <AutoComplete
        :value-from="filterData.sampleStatus"
        :value-to="filterData.sampleStatusTo"
        label="Sample Status"
        name="SampleStatus"
        :options="listStore.sampleStatusOption"
        @handle-change-from="onSampleStatusSelected"
        @handle-change-to="onSampleStatusToSelected"
     />
      <AutoComplete
        :value-from="filterData.sequence"
        :value-to="filterData.sequenceTo"
        label="Sequence"
        name="Sequence"
        :options="listStore.sequenceOption"
        @handle-change-from="onSequenceSelected"
        @handle-change-to="onSequenceToSelected"
     />
     <AutoComplete
        :value-from="filterData.subTask"
        :value-to="filterData.subTaskTo"
        label="Subtask"
        name="Subtask"
        :options="listStore.subtaskOption"
        @handle-change-from="onSubtaskSelected"
        @handle-change-to="onSubtaskToSelected"
     />
      <AutoComplete
        :value-from="filterData.recAction"
        :value-to="filterData.recActionTo"
        label="Rec Action"
        name="RecAction"
        :options="listStore.reActionOption"
        @handle-change-from="onRecActionSelected"
        @handle-change-to="onRecActionToSelected"
     />
     <SelectInput
        :value="filterData.isAutoFill"
        label="Auto Fill"
        name="AutoFill"
        :options="listStore.autoFillOption"
        @handle-change="onAutoFillSelected"
     />
      <SelectInput
        :value="filterData.isUom"
        label="Is Uom"
        name="IsUom"
        :options="listStore.isUomOption"
        @handle-change="onIsUomSelected"
     />
      <AutoComplete
        :value-from="filterData.uom"
        :value-to="filterData.uomTo"
        label="Uom"
        name="uom"
        :options="listStore.uomOption"
        @handle-change-from="onUomSelected"
        @handle-change-to="onUomToSelected"
     />
      <AutoComplete
        :value-from="filterData.referenceDocument"
        :value-to="filterData.referenceDocumentTo"
        label="Reference Document"
        name="ReferenceDocument"
        :options="listStore.referenceDocumentOption"
        @handle-change-from="onReferenceDocumentSelected"
        @handle-change-to="onReferenceDocumentToSelected"
     />
      <AutoComplete
        :value-from="filterData.psType"
        :value-to="filterData.psTypeTo"
        label="PS Type"
        name="psType"
        :options="listStore.psTypeOption"
        @handle-change-from="onPsTypeSelected"
        @handle-change-to="onPsTypeToSelected"
     />
      <AutoComplete
        :value-from="filterData.taskGroupKey"
        :value-to="filterData.taskGroupKeyTo"
        label="Task Group Key"
        name="taskGroupKey"
        :options="listStore.taskGroupKeyOption"
        @handle-change-from="onTaskGroupKeySelected"
        @handle-change-to="onTaskGroupKeyToSelected"
     />
      <AutoComplete
        :value-from="filterData.taskKey"
        :value-to="filterData.taskKeyTo"
        label="Task Key"
        name="taskKey"
        :options="listStore.taskKeyOption"
        @handle-change-from="onTaskKeySelected"
        @handle-change-to="onTaskKeyToSelected"
     />
      <AutoComplete
        :value-from="filterData.typeTask"
        :value-to="filterData.typeTaskTo"
        label="Type Task"
        name="TypeTask"
        :options="listStore.typeTaskOption"
        @handle-change-from="onTypeTaskSelected"
        @handle-change-to="onTypeTaskToSelected"
     />
      <DatePickerInput
        :value-from="filterData.startDate ? filterData.startDate.toString() : ''"
        :value-to="filterData.startDateTo ? filterData.startDateTo.toString() : ''"
        label="Start Date"
        name="StartDate"
        placeholder="Pick a date"
        @handle-change-from="onStartDateSelected"
        @handle-change-to="onStartDateToSelected"
     />
      <DatePickerInput
        :value-from="filterData.endDate ? filterData.endDate.toString() : ''"
        :value-to="filterData.endDateTo ? filterData.endDateTo.toString() : ''"
        label="End Date"
        name="EndDate"
        placeholder="Pick a date"
        @handle-change-from="onEndDateSelected"
        @handle-change-to="onEndDateToSelected"
     />
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
/* eslint-disable @typescript-eslint/no-unused-vars */
import AutoComplete from "@/components/inputs/range-inputs/v2/AutoComplete.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import DatePickerInput from "@/components/inputs/range-inputs/DatePickerInput.vue";
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed
} from 'vue';
import {
  useRecommendedActionListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/recommended-action/useRecommendedActionListStore";
import {
  FilterData
} from "@/core/types/entities/iron-portal/iron-portal-configuration/recommended-action/FilterData";


/* stores */
const listStore = useRecommendedActionListStore();
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
};
const handleCloseModal = () => {
  emits("handle-close", false);
};
const onInterventionCodeSelected = (value: string) => {
  listStore.setInterventionCode(value);
};
const onInterventionCodeToSelected = (value: string) => {
  listStore.setInterventionCodeTo(value);
};
const onEquipmentModelSelected = (value: string) => {
  listStore.setEquipmentModel(value);
};
const onEquipmentModelToSelected = (value: string) => {
  listStore.setEquipmentModelTo(value);
};
const onComponentSelected = (value: string) => {
  listStore.setComponent(value);
};
const onComponentToSelected = (value: string) => {
  listStore.setComponentTo(value);
};
const onRecActionSelected = (value: string) => {
  listStore.setReAction(value);
};
const onRecActionToSelected = (value: string) => {
  listStore.setReActionTo(value);
};
const onSampleStatusSelected = (value: string) => {
  listStore.setSampleStatus(value);
};
const onSampleStatusToSelected = (value: string) => {
  listStore.setSampleStatusTo(value);
};
const onSequenceSelected = (value: string) => {
  listStore.setSequence(value);
};
const onSequenceToSelected = (value: string) => {
  listStore.setSequenceTo(value);
};
const onSubtaskSelected = (value: string) => {
  listStore.setSubtask(value);
};
const onSubtaskToSelected = (value: string) => {
  listStore.setSubtaskTo(value);
};
const onIsUomSelected = (value: string) => {
  listStore.setIsUom(value);
};
const onUomSelected = (value: string) => {
  listStore.setUom(value);
};
const onUomToSelected = (value: string) => {
  listStore.setUomTo(value);
};
const onAutoFillSelected = (value: string) => {
  listStore.setAutoFill(value);
};
const onTypeTaskSelected = (value: string) => {
  listStore.setTypeTask(value);
};
const onTypeTaskToSelected = (value: string) => {
  listStore.setTypeTaskTo(value);
};
const onParameterToSelected = (value: string) => {
  listStore.setParameterTo(value);
};
const onParameterToToSelected = (value: string) => {
  listStore.setParameterToTo(value);
};
const onPsTypeSelected = (value: string) => {
  listStore.setPsType(value);
};
const onPsTypeToSelected = (value: string) => {
  listStore.setPsTypeTo(value);
};
const onTaskGroupKeySelected = (value: string) => {
  listStore.setTaskGroupKey(value);
};
const onTaskGroupKeyToSelected = (value: string) => {
  listStore.setTaskGroupKeyTo(value);
};
const onTaskKeySelected = (value: string) => {
  listStore.setTaskKey(value);
};
const onTaskKeyToSelected = (value: string) => {
  listStore.setTaskKeyTo(value);
};
const onReferenceDocumentSelected = (value: string) => {
  listStore.setReferenceDocument(value);
};
const onReferenceDocumentToSelected = (value: string) => {
  listStore.setReferenceDocumentTo(value);
};
const onStartDateSelected = (value: string) => {
  listStore.setStartDate(value);
};
const onStartDateToSelected = (value: string) => {
  listStore.setStartDateTo(value);
};
const onEndDateSelected = (value: string) => {
  listStore.setEndDate(value);
};
const onEndDateToSelected = (value: string) => {
  listStore.setEndDateTo(value);
};
const handleFilterClick = () => {
  const checkInterventionCode = listStore.lastUsedFilterData.interventionCode !== listStore.filterData.interventionCode;
  const checkInterventionCodeTo = listStore.lastUsedFilterData.interventionCodeTo !== listStore.filterData.interventionCodeTo;
  const checkEquipmentModel = listStore.lastUsedFilterData.equipmentModel !== listStore.filterData.equipmentModel;
  const checkEquipmentModelTo = listStore.lastUsedFilterData.equipmentModelTo !== listStore.filterData.equipmentModelTo;
  const checkComponent = listStore.lastUsedFilterData.component !== listStore.filterData.component;
  const checkComponentTo = listStore.lastUsedFilterData.componentTo !== listStore.filterData.componentTo;
  const checkReAction = listStore.lastUsedFilterData.recAction !== listStore.filterData.recAction;
  const checkReActionTo = listStore.lastUsedFilterData.recActionTo !== listStore.filterData.recActionTo;
  const checkSampleStatus = listStore.lastUsedFilterData.sampleStatus !== listStore.filterData.sampleStatus;
  const checkSampleStatusTo = listStore.lastUsedFilterData.sampleStatusTo !== listStore.filterData.sampleStatusTo;
  const checkSequence = listStore.lastUsedFilterData.sequence !== listStore.filterData.sequence;
  const checkSequenceTo = listStore.lastUsedFilterData.sequenceTo !== listStore.filterData.sequenceTo;
  const checkSubtask = listStore.lastUsedFilterData.subTask !== listStore.filterData.subTask;
  const checkSubtaskTo = listStore.lastUsedFilterData.subTaskTo !== listStore.filterData.subTaskTo;
  const checkIsUom = listStore.lastUsedFilterData.isUom !== listStore.filterData.isUom;
  const checkAutoFill = listStore.lastUsedFilterData.isAutoFill !== listStore.filterData.isAutoFill;
  const checkTypeTask = listStore.lastUsedFilterData.typeTask !== listStore.filterData.typeTask;
  const checkTypeTaskTo = listStore.lastUsedFilterData.typeTaskTo !== listStore.filterData.typeTaskTo;
  const checkPsType = listStore.lastUsedFilterData.psType !== listStore.filterData.psType;
  const checkPsTypeTo = listStore.lastUsedFilterData.psTypeTo !== listStore.filterData.psTypeTo;
  const checkTaskGroupKey = listStore.lastUsedFilterData.taskGroupKey !== listStore.filterData.taskGroupKey;
  const checkTaskGroupKeyTo = listStore.lastUsedFilterData.taskGroupKeyTo !== listStore.filterData.taskGroupKeyTo;
  const checkTaskKey = listStore.lastUsedFilterData.taskKey !== listStore.filterData.taskKey;
  const checkTaskKeyTo = listStore.lastUsedFilterData.taskKeyTo !== listStore.filterData.taskKeyTo;
  const checkParameterTo = listStore.lastUsedFilterData.parameterTo !== listStore.filterData.parameterTo;
  const checkParameterToTo = listStore.lastUsedFilterData.parameterToTo !== listStore.filterData.parameterToTo;
  const checkUom = listStore.lastUsedFilterData.uom !== listStore.filterData.uom;
  const checkUomTo = listStore.lastUsedFilterData.uomTo !== listStore.filterData.uomTo;
  const checkReferenceDocument = listStore.lastUsedFilterData.referenceDocument !== listStore.filterData.referenceDocument;
  const checkReferenceDocumentTo = listStore.lastUsedFilterData.referenceDocumentTo !== listStore.filterData.referenceDocumentTo;
  const checkStartDate = listStore.lastUsedFilterData.startDate !== listStore.filterData.startDate
  const checkStartDateTo = listStore.lastUsedFilterData.startDateTo !== listStore.filterData.startDateTo
  const checkEndDate = listStore.lastUsedFilterData.endDate !== listStore.filterData.endDate
  const checkEndDateTo = listStore.lastUsedFilterData.endDateTo !== listStore.filterData.endDateTo
  const status = (checkInterventionCode || checkInterventionCodeTo || checkEquipmentModel || checkEquipmentModelTo
          || checkComponent || checkComponentTo || checkReAction || checkUomTo || checkIsUom ||
          checkPsType || checkPsTypeTo || checkTaskGroupKey || checkTaskGroupKeyTo || checkTaskKey || checkTaskKeyTo ||
          checkParameterTo || checkParameterToTo || checkReActionTo || checkSampleStatus || checkSampleStatusTo || checkSequence ||
          checkSequenceTo || checkSubtask || checkSubtaskTo || checkTypeTask || checkTypeTaskTo || checkReferenceDocument || checkReferenceDocumentTo
          || checkUom || checkStartDate || checkStartDateTo || checkEndDate || checkEndDateTo || checkAutoFill)
  emits("handle-close", status);
}
</script>
