<template>
  <section
    id="table-actions"
    class="mb-6 d-flex"
    :class="
      bulkStore.stateDraftData.length > 0
        ? 'justify-content-between'
        : 'justify-content-end'
    "
  >
    <section
      v-if="bulkStore.stateDraftData.length > 0"
      class="mb-3 d-flex justify-content-between"
    >
      <p class="m-0 card-table-title">Equipment List</p>
    </section>
    <div class="align-self-center d-flex gap-2 ironlake-table-toolbar">
      <el-popover
        placement="bottom-end"
        :visible="showFilterPopover"
        :width="800"
        @after-leave="handleHideFilterForm"
      >
        <template #reference>
          <el-button
            class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md m-0"
            @click="showFilterPopover = !showFilterPopover"
          >
            <span
              class="svg-icon svg-icon-btech-secondary-500 d-inline-block mr-2"
            >
              <inline-svg
                src="/media/icons/bumaau/filter_list.svg"
                style="width: 1.25rem; height: 1.25rem"
              />
            </span>
            Filter
          </el-button>
        </template>
        <template #default>
          <div class="p-2 d-flex flex-column gap-8">
            <section>
              <p class="m-0 popover-title">Filters</p>
            </section>
            <section class="d-flex flex-column gap-6">
              <el-form
                :model="dataFilter"
                label-position="top"
                class="ironlake-form d-flex flex-column gap-6"
              >
                <section class="container p-0">
                  <div class="row m-0 gap-4">
                    <div class="col p-0">
                      <el-form-item label="Site">
                        <el-select
                          v-model="dataFilter.siteId"
                          placeholder="eg. Blackwater"
                          clearable
                          filterable
                          :disabled="userDetail.isHO === 0"
                        >
                          <el-option
                            v-for="item in listStore.siteOption"
                            :key="item.value"
                            :label="item.label !== '' ? item.label : ' '"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col p-0">
                      <el-form-item label="Ownership">
                        <el-select
                          v-model="dataFilter.ownershipId"
                          placeholder="eg. Hired"
                          clearable
                          filterable
                        >
                          <el-option
                            v-for="item in listStore.ownershipOption"
                            :key="item.value"
                            :label="item.label !== '' ? item.label : ' '"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col p-0"></div>
                    <div class="col p-0"></div>
                  </div>
                </section>
                <section class="container p-0">
                  <div class="row m-0 gap-4">
                    <div class="col p-0">
                      <el-form-item label="Equipment No">
                        <el-select
                          v-model="dataFilter.equipmentNoId"
                          placeholder="eg. DT0700"
                          clearable
                          filterable
                        >
                          <el-option
                            v-for="item in listStore.eqpNoOption"
                            :key="item.value"
                            :label="item.label !== '' ? item.label : ' '"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col p-0">
                      <el-form-item label="Equipment Group">
                        <el-select
                          v-model="dataFilter.equipmentGroupId"
                          placeholder="eg. Dozer"
                          clearable
                          filterable
                        >
                          <el-option
                            v-for="item in listStore.eqpGroupOption"
                            :key="item.value"
                            :label="item.label !== '' ? item.label : ' '"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col p-0">
                      <el-form-item label="Equipment Brand">
                        <el-select
                          v-model="dataFilter.brandId"
                          placeholder="eg. KOMATSU"
                          clearable
                          filterable
                        >
                          <el-option
                            v-for="item in listStore.eqpBrandOption"
                            :key="item.value"
                            :label="item.label !== '' ? item.label : ' '"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col p-0">
                      <el-form-item label="Equipment Model">
                        <el-select
                          v-model="dataFilter.equipmentModelId"
                          placeholder="eg. 623F"
                          clearable
                          filterable
                        >
                          <el-option
                            v-for="item in listStore.eqpModelOption"
                            :key="item.value"
                            :label="item.label !== '' ? item.label : ' '"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </section>
                <section class="container p-0">
                  <div class="row m-0 gap-4">
                    <div class="col p-0">
                      <el-form-item
                        class="h-100 d-flex flex-column justify-content-end"
                      >
                        <template #label>
                          <p class="m-0">
                            Engine Hour Meter/ <br />Service Meter (SMU)
                          </p>
                        </template>
                        <el-input
                          v-model="dataFilter.engineHourMeter"
                          placeholder="eg. 20"
                          maxlength="20"
                          minlength="3"
                          @input="ehmNumber()"
                        >
                        </el-input>
                      </el-form-item>
                    </div>
                    <div class="col p-0">
                      <el-form-item
                        class="h-100 d-flex flex-column justify-content-end"
                      >
                        <template #label>
                          <span>Hour Meter Offset</span>
                        </template>
                        <el-input
                          v-model="dataFilter.engineHourMeterOffset"
                          placeholder="eg. 10"
                          maxlength="20"
                          minlength="3"
                          @input="ehmOffsetNumber()"
                        >
                        </el-input>
                      </el-form-item>
                    </div>
                    <div class="col p-0">
                      <el-form-item
                        label="Component"
                        class="h-100 d-flex flex-column justify-content-end"
                      >
                        <el-input
                          v-model="dataFilter.component"
                          placeholder="eg. HYDCY-CCYLCRX"
                          maxlength="20"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div class="col p-0"></div>
                  </div>
                </section>
                <section class="container p-0">
                  <div class="row m-0 gap-4">
                    <div class="col p-0">
                      <el-form-item>
                        <template #label>
                          <span>Status</span>
                        </template>
                        <el-select
                          v-model="dataFilter.status"
                          placeholder="eg. Active"
                          clearable
                          filterable
                        >
                          <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="col p-0"></div>
                    <div class="col p-0"></div>
                    <div class="col p-0"></div>
                  </div>
                </section>
              </el-form>
            </section>
            <section class="d-flex justify-content-end gap-3">
              <button
                class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md me-auto"
                @click="handleResetFilter"
              >
                Reset
              </button>
              <button
                class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md"
                @click="showFilterPopover = false"
              >
                Close
              </button>
              <button
                class="btn btn-btech-secondary btech-md"
                @click="handleAppliedFilter"
              >
                Apply
              </button>
            </section>
          </div>
        </template>
      </el-popover>
      <el-button
        class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md m-0"
        @click="handleExport"
      >
        <span class="svg-icon svg-icon-btech-secondary-500 d-inline-block mr-2">
          <inline-svg
            src="/media/icons/bumaau/download.svg"
            style="width: 1.25rem; height: 1.25rem"
          />
        </span>
        Export
      </el-button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  useListStore
} from "../../../../../../store/pinia/iron-lake/equipment/all-equipment/useListStore";
import {
  useBulkStore
} from "../../../../../../store/pinia/iron-lake/equipment/all-equipment/useBulkStore";
import {
  reqFilterBody
} from "../../../../../../core/types/entities/iron-lake/equipment/all-equipment/FilterData";
import {
  useAuthenticationStore
} from "../../../../../../store/pinia/application/useAuthenticationStore";
import { saveAs } from "file-saver";

// stores
const listStore = useListStore();
const bulkStore = useBulkStore();
const authStore = useAuthenticationStore();
const userDetail = computed(() => {
  return authStore.user;
});

// filter form module
const statusOptions = [
  {
    label: "All",
    value: null,
  },
  {
    label: "Active",
    value: true,
  },
  {
    label: "Inactive",
    value: false,
  },
];
const showFilterPopover = ref<boolean>(false);
const dataFilter = ref<reqFilterBody>({
  siteId: userDetail.value.isHO === 1 ? null : userDetail.value.SiteId,
  ownershipId: null,
  equipmentNoId: null,
  equipmentGroupId: null,
  brandId: null,
  equipmentModelId: null,
  engineHourMeter: null,
  engineHourMeterOffset: null,
  component: "",
  componentTypeId: null,
  componentLifeHour: null,
  status: null,
  onlyEquipment: listStore.stateOnlyEquipment,
  page: 1,
  pageSize: 20,
});
defineExpose({
  dataFilter,
});
const handleHideFilterForm = () => {
  const appliedFilter = listStore.stateFilterForm;
  dataFilter.value = {
    siteId: appliedFilter.siteId,
    ownershipId: appliedFilter.ownershipId,
    equipmentNoId: appliedFilter.equipmentNoId,
    equipmentGroupId: appliedFilter.equipmentGroupId,
    brandId: appliedFilter.brandId,
    equipmentModelId: appliedFilter.equipmentModelId,
    engineHourMeter: appliedFilter.engineHourMeter,
    engineHourMeterOffset: appliedFilter.engineHourMeterOffset,
    component: appliedFilter.component,
    componentTypeId: appliedFilter.componentTypeId,
    componentLifeHour:
      appliedFilter.componentLifeHour === null
        ? undefined
        : appliedFilter.componentLifeHour,
    status: appliedFilter.status,
    onlyEquipment: appliedFilter.onlyEquipment,
    page: appliedFilter.page,
    pageSize: appliedFilter.pageSize,
  };
};
const handleResetFilter = () => {
  dataFilter.value = {
    siteId: userDetail.value.isHO === 1 ? null : userDetail.value.SiteId,
    ownershipId: null,
    equipmentNoId: null,
    equipmentGroupId: null,
    brandId: null,
    equipmentModelId: null,
    engineHourMeter: null,
    engineHourMeterOffset: null,
    component: "",
    componentTypeId: null,
    componentLifeHour: null,
    status: null,
    onlyEquipment: listStore.stateOnlyEquipment,
    page: 1,
    pageSize: 20,
  };
};
const emit = defineEmits(["close-expand"]);
const handleAppliedFilter = () => {
  emit("close-expand");
  listStore.setAppliedFilter(dataFilter.value);
  showFilterPopover.value = false;
};

const ehmNumber = () => {
  if (typeof dataFilter.value.engineHourMeter === "string") {
    dataFilter.value.engineHourMeter = dataFilter.value.engineHourMeter.replace(
      /\D/g,
      "",
    );
    const isNumber = parseInt(dataFilter.value.engineHourMeter);
    dataFilter.value.engineHourMeter = isNaN(isNumber) ? null : isNumber;
  }
};
const ehmOffsetNumber = () => {
  if (typeof dataFilter.value.engineHourMeterOffset === "string") {
    dataFilter.value.engineHourMeterOffset =
      dataFilter.value.engineHourMeterOffset.replace(/\D/g, "");
    const isNumber = parseInt(dataFilter.value.engineHourMeterOffset);
    dataFilter.value.engineHourMeterOffset = isNaN(isNumber) ? null : isNumber;
  }
};

// download list module
const handleExport = async () => {
  const blob = (await listStore.export()) as Blob;
  saveAs(
    new Blob([blob], {
      type: "application/octet-stream",
    }),
    `Master Data Equipment.xlsx`,
  );
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/core/components/mixins/_typography.scss";

.card-table-title {
  @include heading-h6();
  font-weight: 700;
}

.ironlake-table-toolbar {
  :deep(.el-range-editor) {
    &.el-input__inner {
      padding: 0.5rem 1rem;
      height: unset;
      width: 200px;
      min-height: 0;
      min-width: 200px;

      .el-input__icon {
        line-height: 1.25rem;
        margin: 0;
        color: #01a3ff;

        &.el-range__close-icon {
          display: none;
        }

        &.el-icon-date {
          margin-right: 0.5rem;
          padding: 0;
        }
      }

      &:hover {
        .el-range-input {
          background-color: #e6f6ff;
        }
      }

      .el-range-input {
        height: 1.25rem;
        width: 100%;
        color: #01a3ff;
        font-size: 0.875rem !important;
        line-height: 1.25rem;

        &:hover {
          background-color: #e6f6ff;
        }
      }

      .el-range-separator {
        padding: 0;
        color: #01a3ff;
        line-height: 1.25rem;
        height: auto;
      }
    }
  }
}

.ironlake-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  min-height: 0;
  font-size: 0.875rem;
  // font-weight: 600;
  line-height: 1.25rem;
}

.popover-title {
  @include paragraph-lg();
  font-weight: 700;
}

.ironlake-form {
  :deep(.el-form-item) {
    margin: 0;
    label {
      padding: 0;
      margin-bottom: 0.375rem;
      @include paragraph-sm();
      font-weight: 700;
    }
    .el-form-item__content {
      flex: 0;
      .el-input {
        .el-input__inner {
          border-radius: 8px;
          padding: 0.375rem 0.625rem;
          @include paragraph-sm();
        }
      }
      .el-select {
        width: 100%;
        .select-trigger {
          width: 100%;
        }
      }
      .el-input-number {
        .el-input {
          .el-input__inner {
            text-align: left;
          }
        }
      }
    }
  }
}

:deep(.ironlake-input-number) {
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
}
</style>
