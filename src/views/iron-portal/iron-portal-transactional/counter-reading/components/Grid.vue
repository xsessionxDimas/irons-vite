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
      <el-table-column prop="site" label="Site" min-width="200" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.counterReadingId === editedItem.counterReadingId"
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
      <el-table-column prop="equipmentModel" label="Model" min-width="200" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.counterReadingId === editedItem.counterReadingId"
            :value="editedItem.equipmentModel"
            placeholder="Add Model"
            :is-disabled="!editedItem.site || editedItem.site == ''"
            name="EquipmentModel"
            :max="40"
            @handleChange="handleEquipmentModelChange"
            :options="formStore.equipmentModelOption"
          />
          <span v-else>{{ scope.row.equipmentModel }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipmentNumber" label="Equipment" min-width="200" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.counterReadingId === editedItem.counterReadingId"
            :value="editedItem.equipmentNumber"
            placeholder="Add Equipment"
            :is-disabled="!editedItem.equipmentModel || editedItem.equipmentModel == ''"
            name="EquipmentNumber"
            :max="20"
            @handleChange="handleEquipmentNumberChange"
            :options="formStore.equipmentNumberOption"
          />
          <span v-else>{{ scope.row.equipmentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="Component" min-width="200" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.counterReadingId === editedItem.counterReadingId"
            :value="editedItem.component"
            placeholder="Add Component"
            :is-disabled="!editedItem.equipmentNumber || editedItem.equipmentNumber == ''"
            name="Component"
            :max="20"
            @handleChange="handleComponentChange"
            :options="formStore.componentOption"
          />
          <span v-else>{{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="smu" label="SMU" min-width="200" sortable :sort-method="() => defaultSorting(columnOrder)">
        <template #default="scope">
          <ElementTextInput
            v-if="scope.row.counterReadingId === editedItem.counterReadingId"
            :value="editedItem.smu"
            placeholder="Add SMU"
            name="Smu"
            :max="20"
            @handleChange="(val) => editedItem.smu = val"
          />
          <span v-else>{{ scope.row.smu }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="counterReading" label="Component Life" min-width="200" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <NumberInput
            v-if="scope.row.counterReadingId === editedItem.counterReadingId"
            :value="editedItem.counterReading"
            placeholder="Add Component Life"
            name="CounterReading"
            :max="20"
            @handleChange="(val) => editedItem.counterReading = val"
          />
          <span v-else>{{ scope.row.counterReading }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="Is Active" :width="editedItem.counterReadingId != 0 ? 350 : 100" sortable align="center">
        <template #default="scope">
          <div
            v-if="scope.row.counterReadingId === editedItem.counterReadingId"
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
      <el-table-column label="" width="100">
        <template #default="scope">
          <div v-if="scope.row.counterReadingId !== editedItem.counterReadingId" class="d-flex justify-content-end">
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
  normalizeDate
} from "@/core/helpers/date-format";
import {
  useCounterReadingListStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/counter-reading/useCounterReadingListStore";
import {
  useCounterReadingFormStore
} from "@/store/pinia/iron-portal/iron-portal-transactional/counter-reading/useCounterReadingFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-transactional/counter-reading/ListItem";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-transactional/counter-reading/UpsertItem";
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
const listStore = useCounterReadingListStore();
const formStore = useCounterReadingFormStore();

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
  counterReadingId: 0,
  site: "",
  equipmentModel: "",
  equipmentNumber: "",
  component: "",
  smu: "",
  counterReading: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
});
const editedItem = ref<UpsertItem>({
  counterReadingId: 0,
  site: "",
  equipmentModel: "",
  equipmentNumber: "",
  component: "",
  smu: "",
  counterReading: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
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
  equipmentModel: Yup.string().required("Model is mandatory"),
  equipmentNumber: Yup.string().required("Equipment is mandatory"),
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
    await formStore.getLookupEquipmentModel();
  }
  handleEquipmentModelChange("");
};
const handleEquipmentModelChange = async (value: string) => {
  editedItem.value.equipmentModel = value;
  if (value != "") {
    await formStore.getLookupEquipmentNumber();
  }
  handleEquipmentNumberChange("");
};
const handleEquipmentNumberChange = async (value: string) => {
  editedItem.value.equipmentNumber = value;
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
