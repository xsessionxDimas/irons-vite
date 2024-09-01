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
      <el-table-column prop="interventionStatus" label="Intervention Status" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <TextInput
            v-if="row.interventionStatusId === editedItem.interventionStatusId"
            :value="editedItem.interventionStatus"
            placeholder="Add Intervention Status"
            name="InterventionStatus"
            @handleChange="(val) => editedItem.interventionStatus = val" />
          <span v-else>{{ row.interventionStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="interventionStatusDesc" label="Intervention Status Desc" min-width="200" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <TextInput
            v-if="row.interventionStatusId === editedItem.interventionStatusId"
            :value="editedItem.interventionStatusDesc"
            placeholder="Add Intervention Status Description"
            name="interventionStatusDesc"
            @handleChange="(val) => editedItem.interventionStatusDesc = val"/>
          <span v-else>{{ row.interventionStatusDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="followUpPriority" label="Follow Up Priority" min-width="170" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <NumberInput
            v-if="row.interventionStatusId === editedItem.interventionStatusId"
            :value="editedItem.followUpPriority"
            placeholder="Add Follow Up Priority"
            name="FollowUpPriority"
            @handleChange="(val) => editedItem.followUpPriority = val"/>
          <span v-else>{{ row.followUpPriority }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="followUpPriorityUom" label="Follow Up Priority Uom" min-width="190" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="{row}">
          <AutoComplete
            v-if="row.interventionStatusId === editedItem.interventionStatusId"
            :value="editedItem.followUpPriorityUom"
            placeholder="Add Follow Up Priority Uom"
            name="FollowUpPriority"
            @handleChange="(val) => editedItem.followUpPriorityUom = val"
            :options="formStore.followUpPriorityUomOption" />
          <span v-else>{{ row.followUpPriorityUom }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="startDate" label="Start Date" align="center" width="170" sortable>
        <template #default="scope">
          <DatePickerInput
          v-if="scope.row.interventionStatusId === editedItem.interventionStatusId"
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
          v-if="scope.row.interventionStatusId === editedItem.interventionStatusId"
          :value="editedItem.endDate"
          placeholder="Add End Date"
          name="EndDate"
          @handleChange="(val) => editedItem.endDate = val"/>
          <span v-else>{{ formatDateOnlyAU(scope.row.endDate) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="isActive" label="Is Active" :width="editedItem.interventionStatusId != 0 ? 350 : 100" sortable align="center">
        <template #default="scope">
          <div
            v-if="scope.row.interventionStatusId === editedItem.interventionStatusId"
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
      <el-table-column prop="changedBy" label="Changed by" sortable width="300" :sort-method="() => defaultSorting(columnOrder)" />
      <el-table-column label="" width="100">
      <el-table-column prop="changedBy" label="Changed by" sortable width="300" :sort-method="() => defaultSorting(columnOrder)" /> -->
      <el-table-column label="" width="100">
        <template #default="scope">
          <div v-if="scope.row.interventionStatusId !== editedItem.interventionStatusId" class="d-flex justify-content-end">
            <el-tooltip class="box-item" effect="dark" :content="scope.row.isActive ? 'Edit' : 'Inactive data cannot be edited'" placement="top">
              <div>
                <button :disabled="!scope.row.isActive" class="btn btn-sm btn-icon btn-bg-light me-3" @click="handleEditRow(scope.row)">
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
/* import componenets here */
import { ElTable, ElTableColumn } from "element-plus";
import { formatDateAU, formatDateOnlyAU } from "@/core/helpers/date-format";
import {
  useInterventionStatusListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/intervention-status/useInterventionStatusListStore";
import {
  useInterventionStatusFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/intervention-status/useInterventionStatusFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/intervention-status/ListItem";
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

import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/intervention-status/UpsertItem";

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
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import TextInput from "@/components/inputs/TextInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";

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

const listStore = useInterventionStatusListStore();
const formStore = useInterventionStatusFormStore();
const emits = defineEmits(["fetch-data", "duplicateData"]);
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

const isEdit = computed(() => {
  return formStore.isEdit;
});

const defaultItem = ref<UpsertItem>({
  interventionStatusId: 0,
  interventionStatus: "",
  interventionStatusDesc: "",
  followUpPriority: "",
  followUpPriorityUom: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
})
const editedItem = ref<UpsertItem>({
  interventionStatusId: 0,
  interventionStatus: "",
  interventionStatusDesc: "",
  followUpPriority: "",
  followUpPriorityUom: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
})

/* validation schema */
const inputValidation = Yup.object().shape({
  interventionStatus: Yup.string().required("Intervention Status is mandatory"),
  interventionStatusDesc: Yup.string().required("Intervention Status Description is mandatory"),
  // followUpPriority: Yup.string().required("Follow Up Priority is mandatory").nullable(),
  // followUpPriorityUom: Yup.string().required("Follow Up Priority Uom is mandatory").nullable(),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End date must be later than start date"),
});

const handleEditRow = (item: ListItem) => {
  editedItem.value = {
    ...item
  }
}

const handleCancelRow = () => {
  handleResetError()
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
  }, 300),
  formStore.resetState();
  formStore.setIsEdit(false);
}

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

const handleDuplicateRow = async (dataRow) => {
  formStore.setFormData(dataRow);
  emits("duplicateData", true);
}
</script>
