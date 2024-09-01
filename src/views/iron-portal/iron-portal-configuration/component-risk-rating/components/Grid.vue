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
      <el-table-column prop="site" label="Site" min-width="120" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.site"
            placeholder="Add Site"
            name="Site"
            :options="formStore.siteOption"
            :max="20"
            @handleChange="handleSiteChange"
          />
          <span v-else>{{ scope.row.site }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="equipmentModel" label="Equipment Model" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :is-disabled="!editedItem.site || editedItem.site == ''"
            :value="editedItem.equipmentModel"
            placeholder="Add Equipment Model"
            name="EquipmentModel"
            :options="formStore.equipmentModelOption"
            :max="20"
            @handleChange="handleEquipmentModelChange"
          />
          <span v-else>{{ scope.row.equipmentModel }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="component" label="Component" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.component"
            :is-disabled="!editedItem.equipmentModel || editedItem.equipmentModel == ''"
            placeholder="Add Component"
            name="Component"
            :options="formStore.componentOption"
            :max="40"
            @handleChange="handleComponentChange"
          />
          <span v-else>{{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="componentType" label="Component Type" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.componentType"
            placeholder="Add Component Type"
            name="ComponentType"
            :options="formStore.componentTypeOption"
            :max="20"
            @handleChange="handleComponentTypeChange"
          />
          <span v-else>{{ scope.row.componentType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="componentWeight" label="Component Weight" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <NumberInput
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.componentWeight"
            placeholder="Add Component Weight"
            name="componentWeight"
            @handleChange="(val) => editedItem.componentWeight = val"
          />
          <span v-else>{{ scope.row.componentWeight }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="oemInterval" label="OEM Interval" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <NumberInput
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.oemInterval"
            placeholder="Add OEM Interval"
            name="oemInterval"
            @handleChange="(val) => editedItem.oemInterval = val"
          />
          <span v-else>{{ scope.row.oemInterval }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bumaAuTarget" label="BUMA AU Target" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <NumberInput
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.bumaAuTarget"
            placeholder="Add BUMA AU Target"
            name="bumaAuTarget"
            @handleChange="(val) => editedItem.bumaAuTarget = val"
          />
          <span v-else>{{ scope.row.bumaAuTarget }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="maxRiskRank" label="Max Risk Rank" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <ElementTextInput
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.maxRiskRank"
            placeholder="Add Max Risk Rank"
            name="MaxRiskRank"
            @handleChange="(val) => editedItem.maxRiskRank = val"
            :max="5"
          />
          <span v-else>{{ scope.row.maxRiskRank }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="revisedRank" label="Revised Rank" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <ElementTextInput
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.revisedRank"
            placeholder="Add Revised Rank"
            name="RevisedRank"
            @handleChange="(val) => editedItem.revisedRank = val"
            :max="5"
          />
          <span v-else>{{ scope.row.revisedRank }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="overallRisk" label="Overall Risk" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.overallRisk"
            placeholder="Add Overall Risk"
            name="OverallRisk"
            :options="formStore.overallRiskOption"
            @handleChange="(val) => editedItem.overallRisk = val"
            :max="5"
          />
          <span v-else>{{ scope.row.overallRisk }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="failureTiming" label="Failure Timing" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.failureTiming"
            placeholder="Add Failure Timing"
            name="FailureTiming"
            :options="formStore.failureTimingOption"
            @handleChange="(val) => editedItem.failureTiming = val"
            :max="5"
          />
          <span v-else>{{ scope.row.failureTiming }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="systemImpact" label="System Impact" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.systemImpact"
            placeholder="Add System Impact"
            name="SystemImpact"
            :options="formStore.systemImpactOption"
            @handleChange="(val) => editedItem.systemImpact = val"
            :max="5"
          />
          <span v-else>{{ scope.row.systemImpact }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="opsImpact" label="OPS Impact" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.opsImpact"
            placeholder="Add OPS Impact"
            name="OpsImpact"
            :options="formStore.opsImpactOption"
            @handleChange="(val) => editedItem.opsImpact = val"
            :max="5"
          />
          <span v-else>{{ scope.row.opsImpact }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="supplyRisk" label="Supply Risk" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.supplyRisk"
            placeholder="Add Supply Risk"
            name="SupplyRisk"
            :options="formStore.supplyRiskOption"
            @handleChange="(val) => editedItem.supplyRisk = val"
            :max="5"
          />
          <span v-else>{{ scope.row.supplyRisk }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="failureCost" label="Failure Cost" min-width="170" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <AutoComplete
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.failureCost"
            placeholder="Add Failure Cost"
            name="FailureCost"
            :options="formStore.failureCostOption"
            @handleChange="(val) => editedItem.failureCost = val"
            :max="5"
          />
          <span v-else>{{ scope.row.failureCost }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="comments" label="Comments" min-width="250" sortable :sort-method="defaultSorting(columnOrder)">
        <template #default="scope">
          <ElementTextInput
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.comments"
            placeholder="Add Comments"
            name="Comments"
            :options="formStore.commentsOption"
            @handleChange="(val) => editedItem.comments = val"
            textInputType="textarea"
            :max="255"
          />
          <span v-else>{{ scope.row.comments }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="startDate" label="Start Date" align="center" width="170" sortable>
        <template #default="scope">
          <DatePickerInput
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
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
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
            :value="editedItem.endDate"
            placeholder="Add End Date"
            name="EndDate"
            @handleChange="(val) => editedItem.endDate = val"/>
          <span v-else>{{ formatDateOnlyAU(scope.row.endDate) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="isActive" label="Is Active" :width="editedItem.componentRiskRatingId != 0 ? 350 : 100" sortable align="center">
        <template #default="scope">
          <div
            v-if="scope.row.componentRiskRatingId === editedItem.componentRiskRatingId"
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
          <div v-if="scope.row.componentRiskRatingId !== editedItem.componentRiskRatingId" class="d-flex justify-content-end">
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
  useComponentRiskRatingListStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-risk-rating/useComponentRiskRatingListStore";
import {
  useComponentRiskRatingFormStore
} from "@/store/pinia/iron-portal/iron-portal-configuration/component-risk-rating/useComponentRiskRatingFormStore";
import {
  ListItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-risk-rating/ListItem";
import {
  UpsertItem
} from "@/core/types/entities/iron-portal/iron-portal-configuration/component-risk-rating/UpsertItem";
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
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import NumberInput from "@/components/inputs/NumberInput.vue";
// import DecimalInput from "@/components/inputs/DecimalInput.vue";

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
const listStore = useComponentRiskRatingListStore();
const formStore = useComponentRiskRatingFormStore();

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
  componentRiskRatingId: 0,
  equipmentModel: "",
  component: "",
  componentType: "",
  maxRiskRank: "",
  revisedRank: "",
  overallRisk: "",
  failureTiming: "",
  systemImpact: "",
  opsImpact: "",
  supplyRisk: "",
  failureCost: "",
  comments: "",
  site: "",
  oemInterval: "",
  bumaAuTarget: "",
  componentWeight: "",
  startDate: normalizeDate(new Date()),
  endDate: normalizeDate(new Date("12/31/9999")),
});
const editedItem = ref<UpsertItem>({
  componentRiskRatingId: 0,
  equipmentModel: "",
  component: "",
  componentType: "",
  maxRiskRank: "",
  revisedRank: "",
  overallRisk: "",
  failureTiming: "",
  systemImpact: "",
  opsImpact: "",
  supplyRisk: "",
  failureCost: "",
  comments: "",
  site: "",
  oemInterval: "",
  bumaAuTarget: "",
  componentWeight: "",
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
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  component: Yup.string().required("Component is mandatory"),
  componentType: Yup.string().required("Component Type is mandatory"),
  componentWeight: Yup.string().required("Component Weight is mandatory"),
  site: Yup.string().required("Site is mandatory"),
  oemInterval: Yup.string().required("OEM Interval is mandatory"),
  bumaAuTarget: Yup.string().required("BUMA AU Target is mandatory"),
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

const handleSiteChange = async (value: string) => {
  editedItem.value.site = value;
  if (value != "") {
    formStore.setFormData(editedItem.value);
    await formStore.getLookupEquipmentModel();
  }
  handleEquipmentModelChange("");
};

const handleEquipmentModelChange = async (value: string) => {
  editedItem.value.equipmentModel = value;
  if (value != "") {
    formStore.setFormData(editedItem.value);
    await formStore.getLookupComponent();
  }
  handleComponentChange("");
};

const handleComponentChange = async (value: string) => {
  editedItem.value.component = value;
};

const handleComponentTypeChange = (value: string) => {
  editedItem.value.componentType = value;
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
