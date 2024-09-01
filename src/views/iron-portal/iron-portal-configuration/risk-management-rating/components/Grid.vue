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
      <el-table-column prop="ratingParameter" label="Rating Parameter" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <ElementTextInput
            v-if="scope.row.managementRatingId === editedItem.managementRatingId"
            :value="editedItem.ratingParameter"
            placeholder="Add Rating Parameter"
            name="RatingParameter"
            :max="40"
            @handleChange="(val) => editedItem.ratingParameter = val"
          />
          <span v-else>{{ scope.row.ratingParameter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ratingCode" label="Rating Code" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <ElementTextInput
            v-if="scope.row.managementRatingId === editedItem.managementRatingId"
            :value="editedItem.ratingCode"
            placeholder="Add Rating Code"
            name="RatingCode"
            :max="5"
            @handleChange="(val) => editedItem.ratingCode = val"
          />
          <span v-else>{{ scope.row.ratingCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ratingDescription" label="Rating Description" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <ElementTextInput
            v-if="scope.row.managementRatingId === editedItem.managementRatingId"
            :value="editedItem.ratingDescription"
            placeholder="Add Rating Description"
            name="RatingDescription"
            :max="255"
            @handleChange="(val) => editedItem.ratingDescription = val"
          />
          <span v-else>{{ scope.row.ratingDescription }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="startDate" label="Start Date" align="center" width="170" sortable>
        <template #default="scope">
          <DatePickerInput
            v-if="scope.row.managementRatingId === editedItem.managementRatingId"
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
            v-if="scope.row.managementRatingId === editedItem.managementRatingId"
            :value="editedItem.endDate"
            placeholder="Add End Date"
            name="EndDate"
            @handleChange="(val) => editedItem.endDate = val"/>
          <span v-else>{{ formatDateOnlyAU(scope.row.endDate) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="isActive" label="Is Active" :width="editedItem.managementRatingId != 0 ? 350 : 100" sortable align="center">
        <template #default="scope">
          <div
            v-if="scope.row.managementRatingId === editedItem.managementRatingId"
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
      <el-table-column label="" width="100">
        <template #default="scope">
          <div v-if="scope.row.managementRatingId !== editedItem.managementRatingId" class="d-flex justify-content-end">
            <el-tooltip
              class="box-item"
              effect="dark"
              :content="scope.row.isActive ? 'Edit' : 'Inactive data cannot be edited'"
              placement="top"
            >
              <div>
                <button
                  :disabled="!scope.row.isActive"
                  class="btn btn-sm btn-icon btn-bg-light me-3"
                  @click="handleEditRow(scope.row)"
                >
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
import {
  formatDateAU,
  formatDateOnlyAU,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useRiskManagementRatingListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/risk-management-rating/useRiskManagementRatingListStore";
import {
  useRiskManagementRatingFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/risk-management-rating/useRiskManagementRatingFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/risk-management-rating/ListItem";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/risk-management-rating/UpsertItem";
import {
  PropType,
  defineProps,
  defineEmits,
  computed,
  ref,
} from "vue";
import { defaultSorting } from "@/core/helpers/table-sort";

import * as Yup from "yup";

import ErrorAlert from "@/components/alert/ErrorAlert.vue";

import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";

import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";

import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import ElementTextInput from "@/components/inputs/ElementTextInput.vue";

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

// Store
const authStore = useAuthenticationStore();
const listStore = useRiskManagementRatingListStore();
const formStore = useRiskManagementRatingFormStore();

const emits = defineEmits(["fetch-data", "duplicateData"]);

const isEdit = computed(() => {
  return formStore.isEdit;
});

const startIndex = computed(() => {
  return ((props.page - 1) * 10) + 1;
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

const defaultItem = ref<UpsertItem>({
  managementRatingId: 0,
  ratingParameter: "",
  ratingCode: "",
  ratingDescription: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
});
const editedItem = ref<UpsertItem>({
  managementRatingId: 0,
  ratingParameter: "",
  ratingCode: "",
  ratingDescription: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
});

const handleEditRow = (item: ListItem) => {
  console.log(item)
  formStore.setIsEdit(true);
  editedItem.value = {
    ...item
  }
}


const handleCancelRow = () => {
  formStore.setIsEdit(false);
  formStore.resetState();
  handleResetError();
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
  }, 300);
}


/* validation schema */
const inputValidation = Yup.object().shape({
  ratingParameter: Yup.string().required("Rating Parameter is mandatory"),
  ratingCode: Yup.string().required("Rating Code is mandatory"),
  ratingDescription: Yup.string().required("Rating Description is mandatory"),
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
