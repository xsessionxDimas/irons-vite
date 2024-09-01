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
      <el-table-column prop="site" label="Site" min-width="100" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentReplacementId === editedItem.componentReplacementId"
            :value="editedItem.site"
            placeholder="Add Site"
            name="Site"
            :max="20"
            @handleChange="handleSiteChange"
            :options="formStore.siteOption"
          />
          <span v-else>{{ scope.row.site }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="model" label="Model" min-width="150" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentReplacementId === editedItem.componentReplacementId"
            :value="editedItem.model"
            placeholder="Add Model"
            :is-disabled="!editedItem.site || editedItem.site == ''"
            name="model"
            :max="40"
            @handleChange="handleModelChange"
            :options="formStore.modelOption"
          />
          <span v-else>{{ scope.row.model }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipment" label="Equipment" min-width="150" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentReplacementId === editedItem.componentReplacementId"
            :value="editedItem.equipment"
            placeholder="Add Equipment"
            :is-disabled="!editedItem.model || editedItem.model == ''"
            name="equipment"
            :max="20"
            @handleChange="handleEquipmentChange"
            :options="formStore.equipmentOption"
          />
          <span v-else>{{ scope.row.equipment }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="Component" min-width="200" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentReplacementId === editedItem.componentReplacementId"
            :value="editedItem.component"
            placeholder="Add Component"
            :is-disabled="!editedItem.equipment || editedItem.equipment == ''"
            name="Component"
            :max="20"
            @handleChange="handleComponentChange"
            :options="formStore.componentOption"
          />
          <span v-else>{{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="replacementDate" label="Replacement Date" min-width="180" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="scope">
          <DatePickerInput
            v-if="scope.row.componentReplacementId === editedItem.componentReplacementId"
            :value="editedItem.replacementDate"
            placeholder="Add Replacement Date"
            name="ReplacementDate"
            @handleChange="(val) => editedItem.replacementDate = val" />
          <span v-else>{{ formatDateOnlyAU(scope.row.replacementDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="replacementSmu" label="Replacement SMU" min-width="200" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="scope">
          <NumberInput
            v-if="scope.row.componentReplacementId === editedItem.componentReplacementId"
            :value="editedItem.replacementSmu"
            placeholder="Add Replacement SMU"
            name="ReplacementSmu"
            @handleChange="(val) => editedItem.replacementSmu = val"
          />
          <span v-else>{{ scope.row.replacementSmu }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="frameHours" label="Frame Hours" min-width="150" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <NumberInput
            v-if="scope.row.componentReplacementId === editedItem.componentReplacementId"
            :value="editedItem.frameHours"
            placeholder="Add Frame Hours"
            name="FrameHours"
            @handleChange="(val) => editedItem.frameHours = val"
          />
          <span v-else>{{ scope.row.frameHours }}</span>
        </template>
      </el-table-column>
      <el-table-column label="" width="100">
        <template #default="scope">
          <div v-if="scope.row.componentReplacementId !== editedItem.componentReplacementId" class="d-flex justify-content-end">
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
  formatDateOnlyAU,
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useComponentReplacementListStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/component-replacement/useComponentReplacementListStore";
import {
  useComponentReplacementFormStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/component-replacement/useComponentReplacementFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/component-replacement/ListItem";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/component-replacement/UpsertItem";
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
import NumberInput from "@/components/inputs/NumberInput.vue";
import AutoComplete from "@/components/inputs/AutoComplete.vue";

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
const listStore = useComponentReplacementListStore();
const formStore = useComponentReplacementFormStore();

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
  componentReplacementId: 0,
  site: "",
  model: "",
  equipment: "",
  component: "",
  componentAssignmentId: 0,
  replacementDate: normalizeDate(new Date()),
  replacementSmu: 0,
  hmoffset: 0,
  frameHours: 0,
  transactionCount: 0,
});
const editedItem = ref<UpsertItem>({
  componentReplacementId: 0,
  site: "",
  model: "",
  equipment: "",
  component: "",
  componentAssignmentId: 0,
  replacementDate: normalizeDate(new Date()),
  replacementSmu: 0,
  hmoffset: 0,
  frameHours: 0,
  transactionCount: 0,
});

const handleEditRow = (item: ListItem) => {
  handleResetError();
  editedItem.value = {
    ...item
  }
};

const handleCancelRow = () => {
  formStore.setIsEdit(false);
  formStore.resetState();
  handleResetError();
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
  }, 300);
};

/* validation schema */
const inputValidation = Yup.object().shape({
  site: Yup.string().required("Site is mandatory"),
  model: Yup.string().required("Model is mandatory"),
  equipment: Yup.string().required("Equipment is mandatory"),
  component: Yup.string().required("Component is mandatory"),
  smu: Yup.string().required("SMU is mandatory"),
  counterReading: Yup.string().required("Component Life is mandatory"),
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

/* handlers */
const handleSiteChange = async (value: string) => {
  editedItem.value.site = value;
  if (value != "") {
    await formStore.getLookupModel();
  }
  handleModelChange("");
};
const handleModelChange = async (value: string) => {
  editedItem.value.model = value;
  if (value != "") {
    await formStore.getLookupEquipment();
  }
  handleEquipmentChange("");
};
const handleEquipmentChange = async (value: string) => {
  editedItem.value.equipment = value;
  if (value != "") {
    await formStore.getLookupComponent();
  }
  handleComponentChange("");
};
const handleComponentChange = (value: string) => {
  editedItem.value.component = value;
};

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
      // formStore.updateData(authStore.user.Name).then(() => {
      //   if (!formStore.isError) {
      //     swalAlertSuccess("Form has been successfully submitted!", "Ok")
      //       .then(() => {
      //         handleCancelRow();
      //         emits("fetch-data", null);
      //       });
      //   }
      // });
    }
  });
};
const handleDuplicateRow = async (dataRow) => {
  formStore.setFormData(dataRow, true);
  emits("duplicateData", true);
}
</script>
