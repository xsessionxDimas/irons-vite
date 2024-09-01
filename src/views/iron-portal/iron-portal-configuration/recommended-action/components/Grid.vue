<template>
  <template v-if="listStore.loading">
    <div v-loading="listStore.loading" style="height: 100px"></div>
  </template>
  <template v-else>
    <transition name="fade">
      <ErrorAlert
        v-if="isError && isEdit"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <el-table v-loading="listStore.loading"
      :data="props.listData"
      style="width: 100%"
      @sort-change="handleSort"
      :empty-text="'No Data'"
    >
      <el-table-column label="No" width="90" align="center">
        <template #default="scope">
          <span>{{ startIndex + scope.$index }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipmentModel" label="Equipment Model" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <span>{{ row.equipmentModel }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="Component" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <span>{{ row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="interventionCode" label="Intervention Code" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <span>{{ row.interventionCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sampleStatus" label="Sample Status" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <AutoComplete
            v-if="row.recommendedActionId === editedItem.recommendedActionId"
            :value="editedItem.sampleStatus"
            placeholder="Add Sample Status"
            name="SampleStatus"
            @handleChange="(val) => editedItem.sampleStatus = val"
            :options="formStore.sampleStatusOption" />
          <span v-else>{{ row.sampleStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sequence" label="Sequence" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <NumberInput
            v-if="row.recommendedActionId === editedItem.recommendedActionId"
            :value="editedItem.sequence"
            :margin="false"
            placeholder="Add Sequence"
            name="Sequence"
            :max="20"
            @handleChange="(val) => editedItem.sequence = val"
            />
          <span v-else>{{ row.sequence }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subTask" label="Sub Task" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <TextInput
            v-if="row.recommendedActionId === editedItem.recommendedActionId"
            :value="editedItem.subTask"
            :margin="false"
            placeholder="Add Sub Task"
            name="Subtask"
            @handleChange="(val) => editedItem.subTask = val"
            />
          <span v-else>{{ row.subTask }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="recAction" label="Rec Action" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <TextInput
            v-if="row.recommendedActionId === editedItem.recommendedActionId"
            :value="editedItem.recAction"
            :margin="false"
            placeholder="Add Rec Action"
            name="RecAction"
            @handleChange="(val) => editedItem.recAction = val"
            />
          <span v-else>{{ row.recAction }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isAutoFill" label="Auto Fill" min-width="100" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <SwitchInput
            v-if="row.recommendedActionId === editedItem.recommendedActionId"
            :value="editedItem.isAutoFill"
            name="AutoFill"
            @handleChange="(val) => editedItem.isAutoFill = val"
            />
          <span v-else>
            {{  row.isAutoFill }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="isUom" label="Is Uom" min-width="100" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <SwitchInput
            v-if="row.recommendedActionId === editedItem.recommendedActionId"
            :value="editedItem.isUom"
            name="isUom"
            @handleChange="(val) => editedItem.isUom = val"
            />
          <span v-else>
            {{ row.isUom }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="uom" label="Uom" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <AutoComplete
            v-if="row.recommendedActionId === editedItem.recommendedActionId"
            :value="editedItem.uom"
            :margin="false"
            placeholder="Add Uom"
            name="uom"
            @handleChange="(val) => editedItem.uom = val"
            :options="formStore.uomOption" />
          <span v-else>{{ row.uom }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="referenceDocument" label="Reference Document" min-width="190" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <SelectInput
            v-if="row.recommendedActionId === editedItem.recommendedActionId"
            :value="editedItem.referenceDocument"
            :margin="false"
            placeholder="Add Reference Document"
            name="referenceDocument"
            @handleChange="(val) => editedItem.referenceDocument = val"
            :options="formStore.referenceDocumentOption" />
          <span v-else>{{ row.referenceDocument }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="psType" label="Ps Type" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <AutoComplete
            v-if="row.recommendedActionId === editedItem.recommendedActionId"
            :value="editedItem.psType"
            :margin="false"
            placeholder="Add Ps Type"
            name="PsType"
            @handleChange="(val) => editedItem.psType = val"
            :options="formStore.psTypeOption" />
          <span v-else>{{ row.psType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taskGroupKey" label="Task Group Key" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <TextInput
            v-if="row.recommendedActionId === editedItem.recommendedActionId"
            :value="editedItem.taskGroupKey"
            :margin="false"
            placeholder="Add Task Group Key"
            name="taskGroupKey"
            @handleChange="(val) => editedItem.taskGroupKey = val" />
          <span v-else>{{ row.taskGroupKey }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taskKey" label="Task Key" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <TextInput
            v-if="row.recommendedActionId === editedItem.recommendedActionId"
            :value="editedItem.taskKey"
            :margin="false"
            placeholder="Add Task Key"
            name="taskKey"
            @handleChange="(val) => editedItem.taskKey = val" />
          <span v-else>{{ row.taskKey }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="typeTask" label="Type Task" min-width="230" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <AutoComplete
            v-if="row.recommendedActionId === editedItem.recommendedActionId"
            :value="editedItem.typeTask"
            :margin="false"
            placeholder="Add Type Task"
            name="TypeTask"
            @handleChange="(val) => editedItem.typeTask = val"
            :options="formStore.typeTaskOption" />
          <span v-else>{{ row.typeTask }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="Is Active" :width="editedItem.recommendedActionId != 0 ? 350 : 100" sortable align="center">
        <template #default="scope">
          <div
            v-if="scope.row.recommendedActionId === editedItem.recommendedActionId"
            class="d-flex align-items-center"
          >
            <DatePickerInput
              :value="editedItem.startDate"
              placeholder="Add Start Date"
              name="StartDate"
              @handleChange="(val) => editedItem.startDate = val" />
            <span class="mx-1 w-20">to</span>
            <DatePickerInput
              :value="editedItem.endDate"
              placeholder="Add End Date"
              name="EndDate"
              @handleChange="(val) => editedItem.endDate = val"/>
          </div>
          <template v-else>
            <div class="row justify-content-center">
              <inline-svg v-if="scope.row.isActive" src="/media/svg/tables/rows/check.svg" />
              <inline-svg v-else src="/media/svg/tables/rows/minus.svg" />
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="" width="80">
        <template #default="scope">
          <div v-if="scope.row.recommendedActionId !== editedItem.recommendedActionId" class="d-flex justify-content-end">
              <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.isActive ? 'Edit' : 'Inactive data cannot be edited'"
              placement="top">
                <div>
                  <button
                  :disabled="!scope.row.isActive"
                  class="btn btn-sm btn-icon btn-bg-light me-1"
                  @click="handleEditRow(scope.row)">
                    <inline-svg src="/media/svg/tables/rows/pencil-edit-blue.svg" width="12" height="12" />
                  </button>
                </div>
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="Add new data based on table rows"
                placement="top"
              >
              <div>
                <button
                  class="btn btn-sm btn-icon btn-bg-light"
                  @click="handleDuplicateRow(scope.row)"
                >
                   <inline-svg src="/media/svg/tables/rows/paste-icon-button-blue.svg" width="12" height="12" />
                </button>
              </div>
            </el-tooltip>
            </div>
            <div class="d-flex" v-else>
              <el-tooltip class="box-item" effect="dark" content="Save" placement="top">
                  <button class="btn btn-sm btn-icon btn-bg-light me-3" @click.prevent="handleSubmitEditData">
                    <inline-svg src="/media/svg/tables/rows/save.svg" width="12" height="12" />
                  </button>
             </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="Cancel" placement="top">
              <button class="btn btn-sm btn-icon btn-bg-light" @click.prevent="handleCancelRow">
                <inline-svg src="/media/svg/tables/rows/valid-false.svg" width="12" height="12" />
              </button>
            </el-tooltip>
            </div>
        </template>
      </el-table-column>
    </el-table>
  </template>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-unused-vars */
/* import componenets here */
import { ElTable, ElTableColumn } from "element-plus";
import { formatDateAU, formatDateOnlyAU } from "@/core/helpers/date-format";
import {
  useRecommendedActionListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/recommended-action/useRecommendedActionListStore";
import {
  useRecommendedActionFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/recommended-action/useRecommendedActionFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/recommended-action/ListItem";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/recommended-action/UpsertItem";
import {
  PropType,
  defineProps,
  defineEmits,
  computed,
  ref
} from "vue";
import {
  defaultSorting
} from "@/core/helpers/table-sort";

import * as Yup from "yup";

import ErrorAlert from "@/components/alert/ErrorAlert.vue";

import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";

import {
  normalizeDate
} from "@/core/helpers/date-format";

import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";

import AutoComplete from "@/components/inputs/v2/AutoComplete.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import SwitchInput from "@/components/inputs/SwitchInput.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import ComponentTo from "./ComponentTo.vue"


import useConditionState from '../composeable/useConditionState'

const { stateCondition, calStateCondition } = useConditionState();

const props = defineProps({
  listData: {
    required: true,
    type: Array as PropType<ListItem[]>,
  },
  page: {
    required: true,
    type: Number,
    default: 1
  }
});
const authStore = useAuthenticationStore();
const listStore = useRecommendedActionListStore();
const formStore = useRecommendedActionFormStore();
const emits = defineEmits(["show-dialog", "fetch-data", "duplicateData"]);
const startIndex = computed(() => {
  return ((props.page - 1) * 10) + 1
})
const columnOrder = ref("");
const handleSort = (sort) => {
  columnOrder.value = sort.order
  const payload = {
    prop: sort.prop,
    order: sort.order,
  };
  listStore.setSort(payload);
}

const checkedParameterTo = computed({
  get: () => {
    return checkedParameterTo.value;
  },
  set: (val) => {
    checkedParameterTo.value = val;
  },
});

const defaultItem = ref<UpsertItem>({
  recommendedActionId: 0,
  cbmType: "",
  equipmentModel: "",
  component: "",
  parameterTo: "",
  interventionCode: "",
  recAction: "",
  sampleStatus: "",
  sampleStatusId: "",
  sequence: "",
  subTask: "",
  isUom: false,
  isAutoFill: false,
  psType: "",
  taskGroupKey: "",
  taskKey: "",
  uom: "",
  referenceDocument: "",
  typeTask: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
})
const editedItem = ref<UpsertItem>({
  recommendedActionId: 0,
  cbmType: "",
  equipmentModel: "",
  component: "",
  parameterTo: "",
  interventionCode: "",
  recAction: "",
  sampleStatus: "",
  sampleStatusId: "",
  sequence: "",
  subTask: "",
  isUom: false,
  isAutoFill: false,
  psType: "",
  taskGroupKey: "",
  taskKey: "",
  typeTask: "",
  uom: "",
  referenceDocument: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
})

const handleEditRow = async (item: ListItem) => {
  formStore.resetState();
  editedItem.value = {
    ...item
  }
  // await formStore.getLookupParameterTo(editedItem.value.cbmType);
  await formStore.getLookupTaskGroupAndKey(editedItem.value.equipmentModel, editedItem.value.component, '');
}

const isEdit = computed(() => {
  return formStore.isEdit;
});

const handleCancelRow = () => {
  handleResetError();
  formStore.resetState();
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
  }, 300)
  formStore.setIsEdit(false);
}


/* validation schema */
const validationCase1 = Yup.object().shape({
  interventionCode: Yup.string().required("Intervention Code is mandatory"),
  recAction: Yup.string().required("Rec Action is mandatory"),
  sampleStatus: Yup.string().required("Sample Status is mandatory"),
  sequence: Yup.string().required("Sequence is mandatory"),
  referenceDocument: Yup.string().required("Reference Document is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});
const validationCase2 = Yup.object().shape({
  interventionCode: Yup.string().required("Intervention Code is mandatory"),
  recAction: Yup.string().required("Rec Action is mandatory"),
  sampleStatus: Yup.string().required("Sample Status is mandatory"),
  sequence: Yup.string().required("Sequence is mandatory"),
  referenceDocument: Yup.string().required("Reference Document is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});

const handleResetError = () => {
  formStore.setErrors([] as string[]);
};

const isError = computed(() => {
  return formStore.isError;
});

const errors = computed(() => {
  return formStore.errors;
});

const handleSubmitEditData = async () => {
  formStore.setIsEdit(true);
  handleResetError();
  let inputValidation = validationCase1
  switch (stateCondition.value) {
    case 1:
      inputValidation = validationCase1;
      break;
    case 2:
    case 3:
      inputValidation = validationCase2;
      break;
    default:
      inputValidation = validationCase1
      break;
  }
  await inputValidation.validate(editedItem.value, {
    abortEarly: false,
  }).catch((error) => {
    formStore.setErrors(error.errors);
    if (window) {
      window.scrollTo(0, 0);
    }
  });
  if (isError.value) return;
  swalAlertConfirmation("Are you sure you want to submit ?").then(async (res) => {
    if (res.isConfirmed) {
      formStore.setFormData(editedItem.value);
      formStore.updateData(authStore.user.Name).then(() => {
        if (!formStore.isError) {
          swalAlertSuccess("Form has been successfully submitted!", "Ok")
            .then(() => {
              handleCancelRow();
              emits("fetch-data", null);
            });
        }
      });
    }
  });
};

const handleDuplicateRow = async (dataRow) => {
  formStore.setFormDataDuplicate(dataRow);
  emits("duplicateData", true);
}
</script>


<style scoped>
.el-checkbox {
  margin-right: 10px;
}

.el-checkbox.is-bordered.is-checked .el-checkbox__inner {
  border-color: #409EFF;
  background-color: #409EFF;
  width: 54px;
  height: 54px;
}

.el-checkbox.is-bordered .el-checkbox__inner {
  border-color: #dcdfe6;
  background-color: #fff;
  width: 54px;
  height: 54px;
}

.el-checkbox .el-checkbox__label {
  font-size: 16px;
  line-height: 54px;
  margin-left: 8px;
}

</style>

