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
      <el-table-column prop="cluster" label="Cluster" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)">
        <template #default="{row}">
          <TextInput
            v-if="row.cbmStatusId === editedItem.cbmStatusId"
            :value="editedItem.cluster"
            placeholder="Add Cluster"
            name="cluster"
            :max="200"
            @handleChange="(val) => editedItem.cluster = val"/>
          <span v-else>{{ row.cluster }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sampleCount" label="Sample Count" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)">
        <template #default="{row}">
          <NumberInput
            v-if="row.cbmStatusId === editedItem.cbmStatusId"
            :value="editedItem.sampleCount"
            placeholder="Add Sample Count"
            name="sampleCount"
            :max="20"
            @handleChange="handleSampleCountChange"/>
          <span v-else>{{ row.sampleCount  }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sampleWeight" label="Weight" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)">
        <template #default="{row}">
          <PercentInput
            v-if="row.cbmStatusId === editedItem.cbmStatusId"
            :value="editedItem.sampleWeight"
            placeholder="Add Weight"
            name="sampleWeight"
            :max="20"
            @handleChange="(val) => editedItem.sampleWeight  = val"/>
          <span v-else>{{ row.sampleWeight  }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cautionLimit" label="Caution Limit" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)">
        <template #default="{row}">
          <DecimalInput
            v-if="row.cbmStatusId === editedItem.cbmStatusId"
            :value="editedItem.cautionLimit"
            :margin="false"
            placeholder="Add Caution Limit"
            name="cautionLimit"
            :max="100"
            @handleChange="(val) => editedItem.cautionLimit = val"
           />
          <span v-else>{{ row.cautionLimit }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="criticalLimit" label="Critical Limit" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)">
        <template #default="{row}">
          <DecimalInput
            v-if="row.cbmStatusId === editedItem.cbmStatusId"
            :value="editedItem.criticalLimit"
            :margin="false"
            placeholder="Add Critical Limit"
            name="criticalLimit"
            :max="10"
            @handleChange="(val) => editedItem.criticalLimit = val"
           />
          <span v-else>{{ row.criticalLimit }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="summaryWeight" label="Summary Weight" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)">
        <template #default="{row}">
          <NumberInput
            v-if="row.cbmStatusId === editedItem.cbmStatusId"
            :value="editedItem.summaryWeight"
            :margin="false"
            placeholder="Add Summary Weight"
            name="summaryWeight"
            :max="10"
            @handleChange="(val) => editedItem.summaryWeight = val"
           />
          <span v-else>{{ row.summaryWeight }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="startDate" label="Start Date" align="center" width="170" sortable>
        <template #default="scope">
          <DatePickerInput
          v-if="scope.row.cbmStatusId === editedItem.cbmStatusId"
          :value="editedItem.startDate"
          placeholder="Add Start Date"
          name="StartDate"
          @handleChange="(val) => editedItem.startDate = val" />
          <span v-else>{{ formatDateOnlyAU(scope.row.startDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endDate" label="End Date" align="center" width="170" sortable>
        <template #default="scope">
          <DatePickerInput
          v-if="scope.row.cbmStatusId === editedItem.cbmStatusId"
          :value="editedItem.endDate"
          placeholder="Add End Date"
          name="EndDate"
          @handleChange="(val) => editedItem.endDate = val"/>
          <span v-else>{{ formatDateOnlyAU(scope.row.endDate) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="isActive" label="Is Active" :width="editedItem.cbmStatusId != 0 ? 350 : 100" sortable align="center">
        <template #default="scope">
          <div
            v-if="scope.row.cbmStatusId === editedItem.cbmStatusId"
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
      <!-- <el-table-column prop="changedOn" label="Changed on" align="center" width="170" sortable>
        <template #default="scope">
          <span>{{ formatDateAU(scope.row.changedOn) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="changedBy" label="Changed by" sortable width="300" /> -->
      <el-table-column label="" width="80">
        <template #default="scope">
            <div v-if="scope.row.cbmStatusId !== editedItem.cbmStatusId" class="d-flex justify-content-end">
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
/* import componenets here */
import { ElTable, ElTableColumn } from "element-plus";
import { formatDateAU, formatDateOnlyAU } from "@/core/helpers/date-format";
import {
  useCbmStatusListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-status/useCbmStatusListStore";
import {
  useCbmStatusFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/cbm-status/useCbmStatusFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-status/ListItem";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/cbm-status/UpsertItem";
import {
  PropType,
  defineProps,
  defineEmits,
  computed,
  ref
} from "vue";
import { defaultSorting } from "@/core/helpers/table-sort";

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

import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import PercentInput from "@/components/inputs/PercentInput.vue";
import DecimalInput from "@/components/inputs/DecimalInput.vue";
import TextInput from "@/components/inputs/TextInput.vue";

import useCalculate from "../composeable/useCalculate";

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

const calHelper = useCalculate()

const authStore = useAuthenticationStore();

const listStore = useCbmStatusListStore();
const formStore = useCbmStatusFormStore();
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
  listStore.setSort(payload, 'General');
}

const defaultItem = ref<UpsertItem>({
  cbmStatusId: 0,
  cluster: "",
  sampleCount: "",
  sampleWeight: "",
  cautionLimit: "",
  criticalLimit: "",
  summaryWeight: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
})
const editedItem = ref<UpsertItem>({
  cbmStatusId: 0,
  cluster: "",
  sampleCount: "",
  sampleWeight: "",
  cautionLimit: "",
  criticalLimit: "",
  summaryWeight: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
})

const handleEditRow = (item: ListItem) => {
  formStore.resetState();
  editedItem.value = {
    ...item
  }
}

const isEdit = computed(() => {
  return formStore.isEdit;
});


const handleSampleCountChange = (val) => {
  if (val) {
    const cautionLimit = calHelper.calCautionLimit(val);
    const criticalLimit = calHelper.calCriticalLimit(val);
    editedItem.value.cautionLimit = cautionLimit
    editedItem.value.criticalLimit = criticalLimit
  }
  editedItem.value.sampleCount = val
}


const handleCancelRow = () => {
  handleResetError();
  formStore.resetState();
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
  }, 300)
  formStore.setIsEdit(false);
}


/* validation schema */
const inputValidation = Yup.object().shape({
  cluster: Yup.string().required("Cluster is mandatory"),
  sampleCount: Yup.number().required("Sample Count is mandatory").max(10, "Sample Count should not be more than 10"),
  sampleWeight: Yup.string().required("Weight is mandatory")
    .matches(/^\d+(\.\d+)?%?$/, {
      message: 'Value Weight should be a valid percentage'
    })
    .test('max-value', 'Weight should not be more than 100%', function (value) {
      const percentageValue = parseFloat(value.replace('%', ''));
      return percentageValue <= 100;
    }),
  cautionLimit: Yup.string().required("Caution Limit is mandatory"),
  criticalLimit: Yup.string().required("Critical Limit is mandatory"),
  // summaryWeight: Yup.string().required("Summary Weight is mandatory"),
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
</script>

<style scoped>
.container-edit {
  display: flex;
	flex-direction: column;
  justify-content: space-between;
}
</style>
