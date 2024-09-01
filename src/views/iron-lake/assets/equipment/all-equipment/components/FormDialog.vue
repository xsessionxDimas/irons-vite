<template>
  <!-- custom-class is deprecated in latest element plus version -->
  <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    :title="`${formStore.isNewForm ? 'New' : 'Edit'} Equipment`"
    modal-class="ironlake-dialog"
    :width="
      (listStore.stateOnlyEquipment && !formStore.stateIsDraftForm) ||
      (!listStore.stateOnlyEquipment && !formStore.stateIsDraftForm) ||
      (listStore.stateOnlyEquipment && formStore.stateIsDraftForm)
        ? 1240
        : 480
    "
    :align-center="true"
    :close-on-click-modal="false"
    :show-close="false"
    @close="handleCloseModal()"
    @closed="resetFormDialog()"
  >
    <template #default>
      <transition name="fade">
        <ErrorAlert
          v-if="isError"
          :errorMessages="errors"
          @reset-form="handleResetError"
        />
      </transition>
      <section class="container-fluid p-0 m-0">
        <div class="row m-0">
          <div
            class="p-0 pe-4"
            :class="
              (listStore.stateOnlyEquipment && !formStore.stateIsDraftForm) ||
              (!listStore.stateOnlyEquipment && !formStore.stateIsDraftForm) ||
              (listStore.stateOnlyEquipment && formStore.stateIsDraftForm)
                ? 'col-7'
                : 'col'
            "
          >
            <FormEquipment ref="formEqpRef" />
          </div>
          <div
            v-if="
              (listStore.stateOnlyEquipment && !formStore.stateIsDraftForm) ||
              (!listStore.stateOnlyEquipment && !formStore.stateIsDraftForm) ||
              (listStore.stateOnlyEquipment && formStore.stateIsDraftForm)
            "
            class="col-5 p-0"
          >
            <FormComponent />
          </div>
        </div>
      </section>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary"
          @click="handleCancelForm"
          :disabled="formStore.loading"
        >
          Cancel
        </el-button>
        <el-button
          class="btn btn-btech-secondary"
          @click="handleSubmitData"
          :disabled="formStore.loading"
        >
          Submit
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  toRef,
  computed,
  defineProps,
  defineEmits,
  ref,
} from "vue";
import {
  useFormStore
} from "@/store/pinia/iron-lake/equipment/all-equipment/useFormStore";
import {
  useListStore
} from "@/store/pinia/iron-lake/equipment/all-equipment/useListStore";

import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import FormEquipment from "./FormEquipment.vue";
import FormComponent from "./FormComponent.vue";

import { simpleFormatDateShortAU } from "@/core/helpers/date-format";

const listStore = useListStore();

const formStore = useFormStore();
const formItem = computed({
  get() {
    return formStore.stateFormItem[0];
  },
  set(newValue) {
    formStore.stateFormItem[0] = newValue;
  },
});

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const isVisible = toRef(props, "visibility");

// close (with animation) and closed (dialog popup disappear)
const emits = defineEmits(["handle-close"]);
const handleCloseModal = async (isReload = false) => {
  emits("handle-close", isReload);
  // To reset component in list expand table
  if (formStore.stateFormItem[0].equipmentUnitId) {
    listStore.resetListComp(formStore.stateFormItem[0].equipmentUnitId)
  }
};
const resetFormDialog = () => {
  showComponentWarning.value = false;
  formStore.resetFormItem();
  handleResetError();
  formEqpRef.value.showWarning = false;
};

/* error validation modules */
const errors = computed(() => {
  return formStore.errors;
});
const isError = computed(() => {
  return formStore.isError;
});

// Cancel and Submit Form module
const handleCancelForm = () => {
  handleCloseModal(false);
};
const showComponentWarning = ref(false);
const warningMessage = ref("");
const hasEmptyString = (
  arr: {
    componentCode: string;
    componentName: string;
    componentIsOther?: boolean;
  }[],
): boolean => {
  let emptyCounter = 0;
  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];

    for (const key in obj) {
      if (
        key !== "componentIsOther" &&
        obj.componentIsOther &&
        obj[key] === ""
      ) {
        emptyCounter++;
      }
    }
  }
  if (emptyCounter > 0) {
    return true;
  }
  return false;
};
const checkBlankComponent = (): boolean => {
  const result = hasEmptyString(formStore.stateComponentTable);
  showComponentWarning.value = result;
  if (showComponentWarning.value) {
    warningMessage.value =
      "Component needs to have Component Code and Name";
  }
  return result;
};
const isComponentDraftBlank = () => {
  const obj = {
    code: formItem.value.componentCode,
    name: formItem.value.componentName,
  };
  let hasEmpty = false;
  let emptyCounter = 0;
  for (const key in obj) {
    if (obj[key] === "") {
      emptyCounter++;
    }
  }
  if (0 < emptyCounter && emptyCounter < 2) {
    hasEmpty = true;
  }
  showComponentWarning.value = hasEmpty;
  if (showComponentWarning.value) {
    warningMessage.value =
      "Component needs to have Component Code and Name";
  }
  return hasEmpty;
};
const formEqpRef = ref();
const handleSubmitData = async () => {
  formItem.value.engineHourMeterOffset =
    formItem.value.engineHourMeterOffset === "" ||
    formItem.value.engineHourMeterOffset === null
      ? "0"
      : formItem.value.engineHourMeterOffset;
  if (!formStore.isDraftForm) {
    checkBlankComponent();
  } else {
    formStore.stateIsError = false;
    isComponentDraftBlank();
  }
  if (!listStore.stateOnlyEquipment && formStore.stateIsDraftForm) {
    await formEqpRef.value.inputValidationHMO
      .validate(formStore.stateFormItem[0], {
        abortEarly: false,
      })
      .then(() => {
        formStore.stateIsError = false;
      })
      .catch((error) => {
        formStore.setErrors(error.errors);
      });
  } else {
    await formEqpRef.value.inputValidation
      .validate(formStore.stateFormItem[0], {
        abortEarly: false,
      })
      .then(() => {
        formStore.stateIsError = false;
      })
      .catch((error) => {
        formStore.setErrors(error.errors);
      });
  }
  if (
    formStore.isError ||
    checkBlankComponent() ||
    (formStore.stateIsDraftForm &&
      listStore.stateOnlyEquipment &&
      isComponentDraftBlank())
  ) {
    return;
  }

  // TODO: change this solution later
  const cacheDate = {
    value: formItem.value.resetDate,
  };
  if (typeof formItem.value.resetDate === "string") {
    formItem.value.resetDate = simpleFormatDateShortAU(
      formItem.value.resetDate,
    );
  } else if (
    formItem.value.resetDate &&
    typeof formItem.value.resetDate === "object"
  ) {
    // This else if is for ts solution
    const stringDate = new Date(formItem.value.resetDate).toString();
    formItem.value.resetDate = simpleFormatDateShortAU(stringDate);
  }
  formStore.insertData(listStore.stateOnlyEquipment).then((response) => {
    if (!response?.data.result.isError) {
      formStore.resetFormItem();
      return handleCloseModal(true);
    }
    formItem.value.resetDate = cacheDate.value;
  });
};
const handleResetError = () => {
  formStore.setErrors([] as string[]);
};
</script>

<style lang="scss">
.ironlake-dialog {
  &.el-overlay {
    .el-dialog {
      .el-dialog__header {
        padding: 1.5rem 1.5rem 2rem;
        border: none;
        .el-dialog__title {
          font-size: 1.125rem;
        }
        .el-dialog__headerbtn {
          background-color: transparent;
          padding: 0;
          border: none;
          .el-dialog__close {
            font-size: 1.5rem;
          }
        }
      }
      .el-dialog__body {
        padding: 0 1.5rem;
      }
      .el-dialog__footer {
        padding: 2rem 1.5rem 1.5rem;
      }
    }
  }
}

.ironlake-select {
  width: 180px !important;
}
</style>

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

.eqp-list-header {
  background-color: #e6f6ff;
}

.eqp-list {
  @include paragraph-sm();
  &:hover,
  &.active {
    background-color: #ccedff;
    color: #016299;
  }
}

:deep(.ironlake-table-cell) {
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #ddd;
  .cell {
    padding: 0;
    @include paragraph-sm();
  }
  &:first-child {
    padding-left: 1rem;
  }
  &:last-child {
    padding-right: 1rem;
  }
}

:deep(.ironlake-table-cell-header) {
  padding: 1rem 0.5rem;
  color: #000;
  .cell {
    padding: 0;
    @include paragraph-md();
    font-weight: 600;
  }
  &:first-child {
    padding-left: 1rem !important;
  }
  &:last-child {
    padding-right: 1rem;
  }
}

:deep(.el-table__fixed-right) {
  height: 100% !important;
  .el-table__fixed-body-wrapper {
    height: 100% !important;
  }
}

.rounded-badge-success {
  background-color: green;
}

.rounded-badge-error {
  background-color: red;
}

.input-wrapper::before {
  display: inline-block;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  content: url(../../../../../../../public/media/icons/bumaau/search.svg);
  position: absolute;
  left: 10px; /* Adjust as needed to position the icon */
  top: 58%; /* Adjust as needed to vertically center the icon */
  transform: translateY(-50%);
}

.form-control {
  padding-left: 32px; /* Adjust as needed to provide enough space for the icon */
}

:deep(.el-input-number) {
  &.el-input-number--small {
    width: 100% !important;
  }
}
</style>
