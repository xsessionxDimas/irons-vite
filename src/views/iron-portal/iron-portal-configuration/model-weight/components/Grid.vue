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
      <el-table-column prop="site" label="Site" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)">
        <template #default="{row}">
          <AutoComplete
            v-if="row.modelWeightId === editedItem.modelWeightId"
            :value="editedItem.site"
            placeholder="Add Site"
            name="Site"
            :max="10"
            @handleChange="(val) => editedItem.site = val"
            :options="formStore.siteOption" />
          <span v-else>{{ row.site }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipmentModel" label="Equipment Model" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)">
        <template #default="{row}">
          <AutoComplete
            v-if="row.modelWeightId === editedItem.modelWeightId"
            :value="editedItem.equipmentModel"
            placeholder="Add Equipment Model"
            name="EquipmentModel"
            :max="20"
            @handleChange="(val) => editedItem.equipmentModel = val"
            :options="formStore.equipmentModelOption" />
          <span v-else>{{ row.equipmentModel }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="Weight" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)">
        <template #default="{row}">
          <NumberInput
            v-if="row.modelWeightId === editedItem.modelWeightId"
            :value="editedItem.weight"
            :margin="false"
            placeholder="Add Weight"
            name="Weight"
            :max="10"
            @handleChange="(val) => editedItem.weight = val"
           />
          <span v-else>{{ row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="whPerday" label="Wh Perday" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)">
        <template #default="{row}">
          <DecimalInput
            v-if="row.modelWeightId === editedItem.modelWeightId"
            :value="editedItem.whPerday"
            placeholder="Add Wh Perday"
            name="WhPerday"
            :max="20"
            @handleChange="(val) => editedItem.whPerday = val"
           />
          <span v-else>{{ row.whPerday }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fuelBurn" label="Fuel Burn" min-width="170" sortable :sort-method="(a, b) => defaultSorting(columnOrder)">
        <template #default="{row}">
          <DecimalInput
            v-if="row.modelWeightId === editedItem.modelWeightId"
            :value="editedItem.fuelBurn"
            placeholder="Add Fuel Burn"
            name="FuelBurn"
            :max="20"
            :options="formStore.equipmentTypeOption"
            @handleChange="(val) => editedItem.fuelBurn = val"
           />
          <span v-else>{{ row.fuelBurn }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="startDate" label="Start Date" align="center" width="170" sortable>
        <template #default="scope">
          <DatePickerInput
          v-if="scope.row.modelWeightId === editedItem.modelWeightId"
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
          v-if="scope.row.modelWeightId === editedItem.modelWeightId"
          :value="editedItem.endDate"
          placeholder="Add End Date"
          name="EndDate"
          @handleChange="(val) => editedItem.endDate = val"/>
          <span v-else>{{ formatDateOnlyAU(scope.row.endDate) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="isActive" label="Is Active" :width="editedItem.modelWeightId != 0 ? 350 : 100" sortable align="center">
        <template #default="scope">
          <div
            v-if="scope.row.modelWeightId === editedItem.modelWeightId"
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
      <el-table-column prop="changedBy" label="Changed by" sortable width="300" />
      <el-table-column label="" width="100">
      <el-table-column prop="changedBy" label="Changed by" sortable width="300" /> -->
      <el-table-column label="" width="100">
        <template #default="scope">
          <div v-if="scope.row.modelWeightId !== editedItem.modelWeightId" class="d-flex justify-content-end">
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
import { formatDateAU, formatDateOnlyAU } from "@/core/helpers/date-format";
import {
  useModelWeightListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/model-weight/useModelWeightListStore";
import {
  useModelWeightFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/model-weight/useModelWeightFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/model-weight/ListItem";
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

import AutoComplete from "@/components/inputs/v2/AutoComplete.vue";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
import DecimalInput from "@/components/inputs/DecimalInput.vue";

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

const listStore = useModelWeightListStore();
const formStore = useModelWeightFormStore();
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

const defaultItem = ref({
  modelWeightId: 0,
  site: "",
  equipmentModel: "",
  weight: "",
  whPerday: "",
  fuelBurn: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
})
const editedItem = ref({
  modelWeightId: 0,
  site: "",
  equipmentModel: "",
  weight: "",
  whPerday: "",
  fuelBurn: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
})


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


/* validation schema */
const inputValidation = Yup.object().shape({
  site: Yup.string().required("Site is mandatory"),
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  weight: Yup.number().required("Weight is mandatory").typeError("Weight must be number"),
  whPerday: Yup.string().required("Wh Perday is mandatory").typeError("Wh Perday must be number"),
  fuelBurn: Yup.number().required("Fuel Burn is mandatory").typeError("Fuel Burn must be number"),
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

const isEdit = computed(() => {
  return formStore.isEdit;
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

<style scoped>
.container-edit {
  display: flex;
	flex-direction: column;
  justify-content: space-between;
}
</style>
