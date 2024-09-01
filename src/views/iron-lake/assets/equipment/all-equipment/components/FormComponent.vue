<template>
  <div
    class="card border min-h-100"
    :class="
      formStore.stateIsFocusEqp === true
        ? 'overlay overlay-block overflow-hidden'
        : ''
    "
  >
    <section class="card-body p-4">
      <div :class="formStore.stateIsFocusEqp === true ? 'overlay-wrapper' : ''">
        <h2 class="text-btech-info-500 mb-8">Component</h2>
        <transition name="fade">
          <MetronicAlert
            v-model:show-alert="showComponentWarning"
            variant="warning"
            :desc="warningMessage"
          />
        </transition>
        <div
          v-if="!formStore.stateIsDraftForm"
          class="d-flex gap-2 justify-content-end mb-4"
        >
          <el-button
            class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md m-0"
            @click="handleAddOtherComponent"
          >
            <i class="fas fa-plus fs-6 pe-2 text-btech-secondary-500"></i>
            Add Other Component
          </el-button>
          <el-button
            class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary btech-md m-0"
            @click="showAddComponentDialog"
          >
            <i class="fas fa-plus fs-6 pe-2 text-btech-secondary-500"></i>
            Add Component
          </el-button>
        </div>
        <el-table
          v-if="!formStore.stateIsDraftForm"
          v-loading="listStore.stateCompListLoading"
          :data="formComponents"
          :max-height="!formStore.isNewForm ? 380 : 300"
          style="width: 100%"
          header-cell-class-name="ironlake-table-cell-header"
          cell-class-name="ironlake-table-cell"
        >
          <el-table-column width="160" label="Code">
            <template #default="scope">
              <section v-if="!scope.row.componentIsOther">
                <span>{{ scope.row.componentCode }}</span>
              </section>
              <section v-else>
                <el-input
                  v-model="scope.row.componentCode"
                  placeholder="eg. HYDCY-CCYLCRX"
                  maxlength="20"
                  size="small"
                  @focus="focusFormComponent"
                  @blur="blurFormComponent"
                >
                </el-input>
              </section>
            </template>
          </el-table-column>
          <el-table-column prop="componentName" label="Name">
            <template #default="scope">
              <section v-if="!scope.row.componentIsOther">
                <span>{{ scope.row.componentName }}</span>
              </section>
              <section v-else>
                <el-input
                  v-model="scope.row.componentName"
                  placeholder="eg. Body Steel"
                  maxlength="20"
                  size="small"
                  @focus="focusFormComponent"
                  @blur="blurFormComponent"
                >
                </el-input>
              </section>
            </template>
          </el-table-column>
          <el-table-column header-align="center" fixed="right" width="40">
            <template #default="scope">
              <div class="d-flex justify-content-center gap-6">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  content="Delete"
                  placement="top"
                >
                  <span
                    class="svg-icon svg-icon-btech-danger-500 d-inline-block m-0"
                    style="cursor: pointer"
                    @click="removeComponent(scope)"
                  >
                    <inline-svg
                      src="/media/icons/bumaau/delete.svg"
                      style="width: 1.25rem; height: 1.25rem"
                    />
                  </span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-form
          v-else
          ref="ruleFormRef"
          :model="formItem"
          label-position="top"
          class="ironlake-form d-flex flex-column gap-6"
        >
          <section class="container p-0">
            <div class="row m-0 gap-4">
              <div class="col p-0">
                <el-form-item>
                  <template #label>
                    <span>Code</span>
                  </template>
                  <el-select
                    v-model="formItem.componentCode"
                    placeholder="eg. HYDCY-CCYLCRX"
                    clearable
                    filterable
                    @focus="focusFormComponent"
                    @blur="blurFormComponent"
                    @change="handleOptionChanges($event, 'componentCode')"
                  >
                    <el-option
                      v-for="item in formStore.componentOption"
                      :key="item.componentCode"
                      :label="item.componentCode"
                      :value="item.componentCode"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <div class="col p-0">
                <el-form-item>
                  <template #label>
                    <span>Name</span>
                  </template>
                  <el-select
                    v-model="formItem.componentName"
                    placeholder="eg. Hired"
                    clearable
                    filterable
                    @focus="focusFormComponent"
                    @blur="blurFormComponent"
                    @change="handleOptionChanges($event, 'componentName')"
                  >
                    <el-option
                      v-for="item in formStore.componentOption"
                      :key="item.componentName"
                      :label="item.componentName"
                      :value="item.componentName"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </section>
        </el-form>
      </div>
      <div
        v-if="formStore.stateIsFocusEqp"
        class="overlay-layer bg-dark bg-opacity-25"
        style="z-index: 9999"
      ></div>
    </section>
  </div>
  <!-- ADD COMPONENT DIALOG -->
  <el-dialog
    v-model="showAddCompDialog"
    title="Add Component"
    modal-class="ironlake-dialog"
    width="40%"
    :align-center="true"
    :close-on-click-modal="false"
    :show-close="false"
    @opened="toggleSelectedComponent()"
  >
    <div class="position-relative">
      <div class="input-wrapper">
        <input
          v-model="searchComponent"
          type="text"
          class="form-control mb-4"
          placeholder="Search components"
        />
      </div>
    </div>
    <template v-if="loadCompTable">
      <div v-loading="loadCompTable" style="height: 100px"></div>
    </template>
    <el-table
      v-else
      ref="componentTableRef"
      :data="computedComponentTable"
      style="width: 100%"
      :max-height="250"
      header-cell-class-name="ironlake-table-cell-header"
      cell-class-name="ironlake-table-cell"
      @selection-change="handleSelectComponent"
    >
      <el-table-column
        type="selection"
        :align="'center'"
        :header-align="'center'"
      />
      <el-table-column width="170" label="Component Code">
        <template #default="scope">{{ scope.row.componentCode }}</template>
      </el-table-column>
      <el-table-column prop="componentName" label="Component Name" />
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary"
          @click="handleCancelComponentDialog"
        >
          Cancel
        </el-button>
        <el-button
          class="btn btn-btech-secondary"
          :disabled="componentToAdd.length < 1"
          @click="handleAddComponent()"
        >
          Add
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- ADD NEW OPTION DIALOG -->
  <el-dialog
    v-model="modalNewOption"
    title="Add Other Option"
    width="30%"
    modal-class="ironlake-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    @closed="hideModalNewOption"
  >
    <el-form-item class="m-0">
      <el-input
        v-model="newOptionData"
        placeholder="Write other option"
        maxlength="20"
        clearable
      >
      </el-input>
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancelNewOption(optionKeyToUpdate)">
          Cancel
        </el-button>
        <el-button
          type="primary"
          @click="handleAddNewOption(optionKeyToUpdate)"
        >
          Add
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
// components
import MetronicAlert from "@/components/ironlake/MetronicAlert.vue";
import { ElTable } from "element-plus";
// stores
import {
  useFormStore
} from "@/store/pinia/iron-lake/equipment/all-equipment/useFormStore";
import {
  useListStore
} from "@/store/pinia/iron-lake/equipment/all-equipment/useListStore";

// store defining module
const listStore = useListStore();
const formStore = useFormStore();

// warning alert module
const showComponentWarning = ref(false);
const warningMessage = ref("");

// components list module
const formComponents = computed(() => {
  return formStore.componentsTable;
});
// form field items
const formItem = computed({
  get() {
    return formStore.stateFormItem[0];
  },
  set(newValue) {
    formStore.stateFormItem[0] = newValue;
  },
});
// add new component module
interface ComponentItems {
  componentCode: string;
  componentName: string;
}
const showAddCompDialog = ref(false);
const searchComponent = ref("");
const loadCompTable = ref(false);
const showAddComponentDialog = () => {
  showAddCompDialog.value = true;
};
const toggleSelectedComponent = () => {
  loadCompTable.value = true;
  for (const element of formStore.stateComponentTable) {
    const addedIndex = computedComponentTable.value.findIndex((obj) => {
      return (
        obj.componentCode === element.componentCode &&
        obj.componentName === element.componentName
      );
    });
    if (addedIndex !== -1 && componentTableRef.value) {
      componentTableRef.value.toggleRowSelection(
        computedComponentTable.value[addedIndex],
        true,
      );
    }
  }
  loadCompTable.value = false;
};
const computedComponentTable = computed(() => {
  const filtered = formStore.componentFilterOption.filter((item) => {
    return (
      !searchComponent.value ||
      item.componentCode
        .toLowerCase()
        .includes(searchComponent.value.toLowerCase()) ||
      item.componentName
        .toLowerCase()
        .includes(searchComponent.value.toLowerCase())
    );
  });
  return filtered;
});
const componentToAdd = ref<ComponentItems[]>([]);
const componentTableRef = ref<InstanceType<typeof ElTable>>();
const handleCancelComponentDialog = () => {
  searchComponent.value = "";
  componentTableRef.value?.clearSelection();
  showAddCompDialog.value = false;
};
const handleAddComponent = () => {
  searchComponent.value = "";
  componentToAdd.value.forEach((element) => {
    const isExisting = formStore.stateComponentTable.some((obj) => {
      return (
        obj.componentCode === element.componentCode &&
        obj.componentName === element.componentName
      );
    });
    if (isExisting) {
      return element;
    }
    formStore.stateComponentTable.push(element);
    return formStore.stateComponentTable;
  });

  showAddCompDialog.value = false;
};
const handleSelectComponent = (selectedValue: ComponentItems[]) => {
  componentToAdd.value = selectedValue;
};
const removeComponent = (data) => {
  const indexToRemove = formStore.stateComponentTable.findIndex((item) => {
    return (
      item.componentCode === data.row.componentCode &&
      item.componentName === data.row.componentName
    );
  });
  if (indexToRemove !== -1) {
    formStore.stateComponentTable.splice(indexToRemove, 1);
    componentTableRef.value?.toggleRowSelection(
      formStore.componentFilterOption[indexToRemove],
      false,
    );
  }
  componentToAdd.value = formStore.stateComponentTable;
};
// add other component module
const handleAddOtherComponent = () => {
  const newOtherComponent = {
    componentCode: "",
    componentName: "",
    componentIsOther: true,
  };
  formStore.stateComponentTable.unshift(newOtherComponent);
};
// Dropdown new option module for components
const modalNewOption = ref(false);
const otherLabel = ref("");
const optionKeyToUpdate = ref("");
const handleOptionChanges = (selectedValue: string, formItemKey: string) => {
  optionKeyToUpdate.value = formItemKey;
  if (selectedValue.includes("Other")) {
    otherLabel.value = selectedValue;
    modalNewOption.value = true;
  }
};
const newOptionData = ref("");
const handleAddNewOption = (keyToUpdate: string) => {
  formItem.value[keyToUpdate] = newOptionData.value;
  modalNewOption.value = false;
};
const handleCancelNewOption = (keyToReset: string) => {
  formItem.value[keyToReset] = "";
  modalNewOption.value = false;
};
const hideModalNewOption = () => {
  newOptionData.value = "";
};

// focus/blur field module
const focusFormComponent = () => {
  formStore.stateIsFocusComp = true;
};
const blurFormComponent = () => {
  formStore.stateIsFocusComp = null;
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/core/components/mixins/_typography.scss";

.ironlake-form {
  :deep(.el-form-item) {
    margin: 0;
    label {
      padding: 0;
      margin-bottom: 0.375rem;
      @include paragraph-md();
      font-weight: 700;
    }
    .el-form-item__content {
      flex: 0;
      .el-input {
        .el-input__inner {
          border-radius: 8px;
          padding: 0.375rem 0.625rem;
          @include paragraph-md();
        }
        &.el-date-editor {
          .el-input__inner {
            padding-left: calc(0.75rem + 25px);
          }
        }
        .el-input__prefix {
          margin-left: 0.375rem;
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
