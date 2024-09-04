<template>
  <section
    id="table-actions"
    class="mb-6 d-flex justify-content-end"
  >
    <div class="align-self-center d-flex gap-2 ironlake-table-toolbar">
      <el-date-picker
        v-model="dateRangeFilter"
        class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary"
        type="daterange"
        unlink-panels
        range-separator="-"
        start-placeholder="Start date"
        end-placeholder="End date"
        format="DD/MM/YYYY"
        :clearable="false"
        :shortcuts="dateRangeShortcuts"
        @change="handleDateRange"
      />
      <el-popover
        placement="bottom-end"
        :visible="showFilterPopover"
        :width="360"
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
                <el-form-item>
                  <template #label>
                    <span>ID</span>
                  </template>
                  <el-input
                    v-model="dataFilter.id"
                    placeholder="ID"
                    @input="handleInputID"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <template #label>
                    <span>Code</span>
                  </template>
                  <el-input
                    v-model="dataFilter.code"
                    placeholder="Code"
                    @input="(value: string) => (dataFilter.code = value)"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <template #label>
                    <span>Description</span>
                  </template>
                  <el-input
                    v-model="dataFilter.desc"
                    placeholder="Description"
                    @input="(value: string) => (dataFilter.desc = value)"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="Media Type">
                  <el-select
                    v-model="dataFilter.fileType"
                    placeholder="Write Media Type"
                    clearable
                    filterable
                    multiple
                  >
                    <el-option
                      v-for="item in formStore.fileTypeOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  useMediaLibraryListStore
} from "../../../../store/pinia/iron-lake/media-library/useMediaLibraryListStore";
import {
  useMediaLibraryFormStore
} from "../../../../store/pinia/iron-lake/media-library/useMediaLibraryFormStore";
import {
  formatDateForPostData,
  getLastMonthFirstDayDateHelper,
  getcurrentMonthLastDayDateHelper
} from "../../../../core/helpers/date-format";
import { reqBody } from "../../../../core/types/entities/iron-lake/media-library/FilterData";
import {
  validateNumberInput
} from "../../../../store/pinia/iron-lake/media-library/helper";

// stores
const listStore = useMediaLibraryListStore();
const formStore = useMediaLibraryFormStore();


// filter date module
const dateRangeFilter = ref<string[]>([]);
const pastToPresentByDay = (day: number) => {
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
  const end = new Date();
  return [start, end];
};
const lastMonth = () => {
  const startDate = getLastMonthFirstDayDateHelper()
  const endDate = getcurrentMonthLastDayDateHelper(startDate);

  return [startDate, endDate];
};
const dateRangeShortcuts = [
  {
    text: "Yesterday",
    value: pastToPresentByDay(1),
  },
  {
    text: "Last week",
    value: pastToPresentByDay(7),
  },
  {
    text: "Last month",
    value: lastMonth(),
  },
];
const handleDateRange = () => {
  listStore.stateFilterForm.startDate = formatDateForPostData(
    dateRangeFilter.value[0],
  );
  listStore.stateFilterForm.endDate = formatDateForPostData(
    dateRangeFilter.value[1],
  );
  listStore.setPage(1);
};

// filter form module
const showFilterPopover = ref<boolean>(false);
const dataFilter = ref<reqBody>({
  id: null,
  startDate: null,
  endDate: null,
  code: null,
  desc: null,
  fileType: null,
  order: "",
  page: 1,
  pageSize: 20,
});
defineExpose({
  dataFilter
});
const handleHideFilterForm = () => {
  const appliedFilter = listStore.stateFilterForm;
  dataFilter.value = {
    id: appliedFilter.id,
    fileType: appliedFilter.fileType,
    code: appliedFilter.code,
    desc: appliedFilter.desc,
    startDate: appliedFilter.startDate,
    endDate: appliedFilter.endDate,
    order: appliedFilter.order,
    page: appliedFilter.page,
    pageSize: appliedFilter.pageSize,
  };
};

const handleResetFilter = () => {
  dateRangeFilter.value = [];
  dataFilter.value = {
    id: null,
    startDate: null,
    endDate: null,
    code: null,
    desc: null,
    fileType: null,
    order: "",
    page: 1,
    pageSize: 20
  };
};

const handleAppliedFilter = () => {
  listStore.setAppliedFilter(dataFilter.value);
  showFilterPopover.value = false;
};

const handleInputID = (value) => {
  dataFilter.value.id = validateNumberInput(value);
}
</script>

<style lang="scss" scoped>
@import "../../../../assets/sass/core/components/mixins/_typography.scss";

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
    }
  }
}
</style>
