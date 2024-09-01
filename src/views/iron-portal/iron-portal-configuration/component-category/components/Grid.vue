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
      <el-table-column prop="type" label="Type Category" min-width="200" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.compCategoryId === editedItem.compCategoryId"
            :value="editedItem.type"
            placeholder="Add Type Category"
            name="Type"
            :max="40"
            :options="formStore.typeOption"
            @handleChange="(val) => editedItem.type = val"
          />
          <span v-else>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sequential" label="Sequential" min-width="120" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <NumberInput
            v-if="scope.row.compCategoryId === editedItem.compCategoryId"
            :value="editedItem.sequential"
            placeholder="Add Sequential"
            name="Sequential"
            :max="5"
            @handleChange="(val) => editedItem.sequential = val"
          />
          <span v-else>{{ scope.row.sequential }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="operator" label="Operator" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <SelectInput
            v-if="scope.row.compCategoryId === editedItem.compCategoryId"
            :value="editedItem.operator"
            placeholder="Add Operator"
            name="Operator"
            :max="80"
            :options="formStore.operatorOption"
            @handleChange="(val) => editedItem.operator = val"
          />
          <span v-else>{{ scope.row.operator }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="valueMin" label="Value Min" min-width="120" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <NumberInput
            v-if="scope.row.compCategoryId === editedItem.compCategoryId"
            :value="editedItem.valueMin"
            placeholder="Add Value Min"
            name="ValueMin"
            :max="5"
            @handleChange="(val) => editedItem.valueMin = val"
          />
          <span v-else>{{ scope.row.valueMin }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="valueMax" label="Value Max" min-width="120" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <NumberInput
            v-if="scope.row.compCategoryId === editedItem.compCategoryId"
            :value="editedItem.valueMax"
            placeholder="Add Value Max"
            name="ValueMax"
            :max="5"
            @handleChange="(val) => editedItem.valueMax = val"
          />
          <span v-else>{{ scope.row.valueMax }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="uom" label="UOM" min-width="100" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <SelectInput
            v-if="scope.row.compCategoryId === editedItem.compCategoryId"
            :value="editedItem.uom"
            placeholder="Add UOM"
            name="Uom"
            :max="5"
            :options="formStore.uomOption"
            @handleChange="(val) => editedItem.uom = val"
          />
          <span v-else>{{ scope.row.uom }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="Category" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <ElementTextInput
            v-if="scope.row.compCategoryId === editedItem.compCategoryId"
            :value="editedItem.category"
            placeholder="Add Category"
            name="Category"
            :max="80"
            @handleChange="(val) => editedItem.category = val"
          />
          <span v-else>{{ scope.row.category }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="categoryDesc" label="Category Description" min-width="250" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <ElementTextInput
            v-if="scope.row.compCategoryId === editedItem.compCategoryId"
            :value="editedItem.categoryDesc"
            placeholder="Add Category Description"
            name="CategoryDescription"
            :max="80"
            text-input-type="textarea"
            @handleChange="(val) => editedItem.categoryDesc = val"
          />
          <span v-else>{{ scope.row.categoryDesc }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="startDate" label="Start Date" align="center" width="170" sortable>
        <template #default="scope">
          <DatePickerInput
            v-if="scope.row.compCategoryId === editedItem.compCategoryId"
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
            v-if="scope.row.compCategoryId === editedItem.compCategoryId"
            :value="editedItem.endDate"
            placeholder="Add End Date"
            name="EndDate"
            @handleChange="(val) => editedItem.endDate = val"/>
          <span v-else>{{ formatDateOnlyAU(scope.row.endDate) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="isActive" label="Is Active" :width="editedItem.compCategoryId != 0 ? 350 : 100" sortable align="center">
        <template #default="scope">
          <div
            v-if="scope.row.compCategoryId === editedItem.compCategoryId"
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
          <div v-if="scope.row.compCategoryId !== editedItem.compCategoryId" class="d-flex justify-content-end">
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
  useComponentCategoryListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-category/useComponentCategoryListStore";
import {
  useComponentCategoryFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-category/useComponentCategoryFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-category/ListItem";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-category/UpsertItem";
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

import AutoComplete from "@/components/inputs/AutoComplete.vue";
import ElementTextInput from "@/components/inputs/ElementTextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";

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
const listStore = useComponentCategoryListStore();
const formStore = useComponentCategoryFormStore();

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
  compCategoryId: 0,
  type: "",
  sequential: 0,
  operator: "",
  valueMin: 0,
  valueMax: 0,
  uom: "",
  category: "",
  categoryDesc: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
});
const editedItem = ref<UpsertItem>({
  compCategoryId: 0,
  type: "",
  sequential: 0,
  operator: "",
  valueMin: 0,
  valueMax: 0,
  uom: "",
  category: "",
  categoryDesc: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
});

const handleEditRow = (item: ListItem) => {
  handleResetError();
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
  type: Yup.string().required("Type is mandatory"),
  sequential: Yup.number().required("Sequential is mandatory"),
  // operator: Yup.string().required("Operator is mandatory"),
  valueMin: Yup.number().required("Value Min is mandatory"),
  valueMax: Yup.number().required("Value Max is mandatory"),
  uom: Yup.string().required("UOM is mandatory"),
  category: Yup.string().required("Category is mandatory"),
  // categoryDesc: Yup.string().required("Category Description is mandatory"),
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
const handleDuplicateRow = async (dataRow) => {
  formStore.setFormData(dataRow);
  emits("duplicateData", true);
}
</script>
