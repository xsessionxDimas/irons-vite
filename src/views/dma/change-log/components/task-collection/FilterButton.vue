<template>
  <el-popover
    placement="bottom"
    :width="480"
    trigger="click"
    :visible="listStore.filterVisibility"
  >
    <template #reference>
      <button
        class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md m-0"
        @click="handleFilterClicked">
        <icon name="filter" size="24" />
        Filter
      </button>
    </template>
    <template #default>
      <div class="p-2 d-flex flex-column gap-8">
        <div class="employee-filter-header d-flex gap-2 align-items-center">
          <p class="m-0 fw-700 text-large">Filter Data</p>
          <div v-loading="listStore.loadingFilter" style="height: 30px"></div>
        </div>
        <section class="d-flex flex-column gap-8">
          <el-form
            label-position="top"
            class="ironlake-form d-flex flex-column gap-6">
                <el-form-item label="Model">
                  <el-select
                    class="w-100"
                    v-model="data.modelId"
                    placeholder="Select Model"
                    clearable
                    filterable
                    @change="handleChangeFilter()">
                    <el-option
                      v-for="item in modelOptions"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Service Size">
                  <el-select
                    class="w-100"
                    v-model="data.psTypeId"
                    placeholder="Select Service Size"
                    clearable
                    filterable
                    @change="handleChangeFilter()">
                    <el-option
                      v-for="item in serviceSizeOptions"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Version">
                  <el-select
                    class="w-100"
                    v-model="data.version"
                    placeholder="Select Version"
                    clearable
                    filterable
                    @change="handleChangeFilter()">
                    <el-option
                      v-for="item in versionOptions"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Release Date">
                  <el-select
                    class="w-100"
                    v-model="data.releaseDate"
                    placeholder="Select Release Date"
                    clearable
                    filterable
                    @change="handleChangeFilter()">
                    <el-option
                      v-for="item in releaseDateOptions"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Task Description">
                  <el-input
                    class="w-100"
                    v-model="data.description"
                    placeholder="All"
                  />
                </el-form-item>
                <el-form-item label="Sub Task">
                  <el-select
                    class="w-100"
                    v-model="data.subTask"
                    placeholder="Select Sub Task"
                    clearable
                    filterable
                    @change="handleChangeFilter()">
                    <el-option
                      v-for="item in subTaskOptions"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Task Category">
                  <el-select
                    class="w-100"
                    v-model="data.category"
                    placeholder="Select Sub Task"
                    clearable
                    filterable
                    @change="handleChangeFilter()">
                    <el-option
                      v-for="item in categoryOptions"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Status">
                  <el-select
                    class="w-100"
                    v-model="data.status"
                    placeholder="Select Sub Task"
                    clearable
                    filterable
                    @change="handleChangeFilter()">
                    <el-option label="Show all" value="" />
                    <el-option label="Active" value="Active" />
                    <el-option label="Inactive" value="Inactive" />
                  </el-select>
                </el-form-item>
          </el-form>
        </section>
        <div class="d-flex justify-content-between">
          <div>
            <button class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md me-auto" @click="onReset">
              Reset
            </button>
          </div>
          <div class="d-flex gap-4 align-items-center">
            <button class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md" @click="handleCloseFilter">
              Close
            </button>
            <button class="btn btn-btech-secondary btech-md" @click="onClick">Apply</button>
          </div>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import {
  defineEmits,
  computed,
  ref
} from "vue";
import Icon from "@/components/ironlake/Icon.vue";
import {
  useTaskCollection
} from "@/store/pinia/dma/task-collection/useTaskCollection";
import {
  FilterData
} from "@/core/types/entities/dma/task-collection/FilterData";
import {
  generateOptionWithDefault
} from "@/core/helpers/mapOption";
import { sortBy } from 'lodash'

const listStore = useTaskCollection();

const data = ref<FilterData>({
  modelId: "",
  psTypeId: "",
  version: "",
  releaseDate: "",
  category: "",
  description: "",
  subTask: "",
  status: "Active",
  page: 1,
  pageSize: 20,
});
defineExpose({
  data
})
const emit = defineEmits(["applyFilter", "loadFilterData"]);

/* region master data options */
const modelOptions = computed(() => {
  return generateOptionWithDefault(listStore.stateFilterLookupData.listModelId)
})
const serviceSizeOptions = computed(() => {
  return generateOptionWithDefault(listStore.stateFilterLookupData.listPsTypeid)
})
const versionOptions = computed(() => {
  return generateOptionWithDefault(listStore.stateFilterLookupData.listVersion, 'Latest Version')
})
const releaseDateOptions = computed(() => {
  return generateOptionWithDefault(listStore.stateFilterLookupData.listReleaseDate)
})
const subTaskOptions = computed(() => {
  return generateOptionWithDefault(listStore.stateFilterLookupData.listSubtask)
})
const categoryOptions = computed(() => {
  return generateOptionWithDefault(listStore.stateFilterLookupData.listCategroy)
})
/* end of regions */


const handleChangeFilter = () => {
  listStore.stateFilterLookupParams.category = data.value.category
  listStore.stateFilterLookupParams.psTypeId = data.value.psTypeId
  listStore.stateFilterLookupParams.modelId = data.value.modelId
  listStore.stateFilterLookupParams.status = data.value.status
  listStore.stateFilterLookupParams.subTask = data.value.subTask
  listStore.stateFilterLookupParams.version = data.value.version
  listStore.stateFilterLookupParams.releaseDate = data.value.releaseDate
  listStore.stateFilterLookupParams.description = data.value.description
  emit("loadFilterData")
}
const onClick = () => {
  emit("applyFilter", data);
};
const handleFilterClicked = () => {
  data.value.description = listStore.stateLastUsedFilterData.description
  data.value.modelId = listStore.stateLastUsedFilterData.modelId
  data.value.psTypeId = listStore.stateLastUsedFilterData.psTypeId
  data.value.version = listStore.stateLastUsedFilterData.version
  data.value.releaseDate = listStore.stateLastUsedFilterData.releaseDate
  data.value.category = listStore.stateLastUsedFilterData.category
  data.value.subTask = listStore.stateLastUsedFilterData.subTask
  data.value.status = listStore.stateLastUsedFilterData.status
  listStore.setFilterVisibility(!listStore.filterVisibility)
  handleChangeFilter()
};
const handleCloseFilter = () => {
  data.value.description = listStore.stateLastUsedFilterData.description
  data.value.modelId = listStore.stateLastUsedFilterData.modelId
  data.value.psTypeId = listStore.stateLastUsedFilterData.psTypeId
  data.value.version = listStore.stateLastUsedFilterData.version
  data.value.releaseDate = listStore.stateLastUsedFilterData.releaseDate
  data.value.category = listStore.stateLastUsedFilterData.category
  data.value.subTask = listStore.stateLastUsedFilterData.subTask
  data.value.status = listStore.stateLastUsedFilterData.status
  listStore.setFilterVisibility(!listStore.filterVisibility)
  handleChangeFilter()
};
const onReset = () => {
  data.value.description = ""
  data.value.modelId = ""
  data.value.psTypeId = ""
  data.value.version = ""
  data.value.releaseDate = ""
  data.value.category = ""
  data.value.subTask = ""
  data.value.status = "Active"
  data.value.page = 1,
  data.value.pageSize = 20,
  handleChangeFilter()
  listStore.setPage(1)
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/core/components/mixins/_typography.scss";

.card-table-title {
  @include heading-h6();
  font-weight: 700;
}

.ironlake-input {
  position: relative;
  display: flex;
  line-height: unset;

  :deep(.el-input__inner) {
    padding: 0.5rem 0.75rem;
    padding-left: calc(0.75rem + 1.25rem + 0.75rem);
    font-family: "Public Sans";
    font-size: 0.875rem !important;
    line-height: 1.25rem;
    height: fit-content;
  }

  &::before {
    content: url("/media/icons/bumaau/search.svg");
    position: absolute;
    top: 0.5rem;
    left: 0.75rem;
    display: inline-flex;
    width: 1.25rem;
    height: 1.25rem;
  }
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
  font-family: "Public Sans";
  font-size: 0.875rem;
  // font-weight: 600;
  line-height: 1.25rem;
}

.popover-title {
  @include paragraph-lg();
  font-weight: 700;
}
.el-checkbox__label {
  font-size: 10px;
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
      .el-checkbox__label {
        @include paragraph-sm();
      }
    }
  }
}
</style>
