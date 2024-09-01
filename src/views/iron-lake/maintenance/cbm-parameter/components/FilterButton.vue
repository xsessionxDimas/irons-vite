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
        @click="handleFilterClicked"
      >
        <icon name="filter" size="24" />
        Filter
      </button>
    </template>
    <template #default>
      <div class="p-2 d-flex flex-column gap-8">
        <div class="employee-filter-header">
          <p class="m-0 fw-700 text-large">Filters</p>
        </div>
        <section class="d-flex flex-column gap-8">
          <el-form
            label-position="top"
            class="ironlake-form d-flex flex-column gap-6"
          >
                <el-form-item>
                  <template #label>
                    <span>Description</span>
                  </template>
                  <el-input
                    v-model="data.description"
                    placeholder="Input Description"
                    @input="(value) => (data.description = value)"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item label="Equipment Model">
                  <el-select
                    class="w-100"
                    v-model="data.equipmentModelId"
                    placeholder="Select Equipment Model"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in equipmentModel"
                      :key="item.value"
                      :label="item.label !== '' ? item.label : ' '"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Service Size">
                  <el-select
                    class="w-100"
                    v-model="data.serviceSize"
                    placeholder="Select Service Size"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in serviceSize"
                      :key="item.value"
                      :label="item.label !== '' ? item.label : ' '"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Rating">
                  <el-select
                    class="w-100"
                    v-model="data.rating"
                    placeholder="Select Rating"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in rating"
                      :key="item.value"
                      :label="item.label !== '' ? item.label : ' '"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Type Parameter">
                  <el-select
                    class="w-100"
                    v-model="data.typeParameterId"
                    placeholder="Select Type Parameter"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in typeParameter"
                      :key="item.value"
                      :label="item.label !== '' ? item.label : ' '"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="Component">
                  <el-select
                    class="w-100"
                    v-model="data.componentId"
                    placeholder="Select Component"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in components"
                      :key="item.value"
                      :label="item.label !== '' ? item.label : ' '"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="CBM Group">
                  <el-select
                    class="w-100"
                    v-model="data.cbmGroupId"
                    placeholder="Select CBM Group"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in cbmGroup"
                      :key="item.value"
                      :label="item.label !== '' ? item.label : ' '"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item class="mt-4">
                  <div
                    class="d-flex align-items-center gap-4 form-control form-control-lg"
                  >
                    <el-checkbox
                      v-model="data.isSync"
                      size="small"
                      label="Show parameter with missing value"
                    />
                  </div>
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
  computed,
  defineEmits,
  ref
} from "vue";
import TextInput from "@/components/inputs/TextInput.vue";
import Icon from "@/components/ironlake/Icon.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import {
  useCbmParameterListStore
} from "@/store/pinia/iron-lake/maintenance/cbm-parameter/useCbmParameterListStore";
import {
  FilterData
} from "@/core/types/entities/iron-lake/maintenance/cbm-parameter/FilterData";

const listStore = useCbmParameterListStore();

const data = ref<FilterData>({
  description: "",
  equipmentModelId: null,
  serviceSize: "",
  typeParameterId: null,
  componentId: null,
  cbmGroupId: null,
  rating: "",
  isSync: false,
  page: 1,
  pageSize: 20,
});
defineExpose({
  data
})
const rating = computed(() => {
  return listStore.stateRatingOption;
});
const visible = ref(false);
const typeParameter = computed(() => {
  return listStore.stateTypeParameterOption;
});
const cbmGroup = computed(() => {
  return listStore.stateCbmGroupOption;
});
const serviceSize = computed(() => {
  return listStore.stateServiceSizeOption;
});
const equipmentModel = computed(() => {
  return listStore.stateEquipmentModelOption;
});
const components = computed(() => {
  return listStore.stateComponentOption;
});
const emit = defineEmits(["applyFilter"]);
const onClick = () => {
  emit("applyFilter", data);
};
const handleFilterClicked = () => {
  data.value.description = listStore.stateLastUsedFilterData.description;
  data.value.equipmentModelId = listStore.stateLastUsedFilterData.equipmentModelId;
  data.value.serviceSize = listStore.stateLastUsedFilterData.serviceSize;
  data.value.componentId = listStore.stateLastUsedFilterData.componentId;
  data.value.cbmGroupId = listStore.stateLastUsedFilterData.cbmGroupId;
  data.value.typeParameterId = listStore.lastUsedFilterData.typeParameterId;
  data.value.rating = listStore.stateLastUsedFilterData.rating;
  data.value.isSync = listStore.stateLastUsedFilterData.isSync;
  listStore.setFilterVisibility(!listStore.filterVisibility)
};
const handleCloseFilter = () => {
  data.value.description = listStore.stateLastUsedFilterData.description;
  data.value.equipmentModelId = listStore.stateLastUsedFilterData.equipmentModelId;
  data.value.serviceSize = listStore.stateLastUsedFilterData.serviceSize;
  data.value.componentId = listStore.stateLastUsedFilterData.componentId;
  data.value.cbmGroupId = listStore.stateLastUsedFilterData.cbmGroupId;
  data.value.typeParameterId = listStore.lastUsedFilterData.typeParameterId;
  data.value.rating = listStore.stateLastUsedFilterData.rating;
  data.value.isSync = listStore.stateLastUsedFilterData.isSync;
  listStore.setFilterVisibility(!listStore.filterVisibility)
};
const onReset = () => {
  data.value.description = "";
  data.value.equipmentModelId = null;
  data.value.serviceSize = "";
  data.value.componentId = null;
  data.value.typeParameterId = null;
  data.value.cbmGroupId = null;
  data.value.rating = "";
  data.value.isSync = false;
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
    content: url("../../../../../../public/media/icons/bumaau/search.svg");
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
