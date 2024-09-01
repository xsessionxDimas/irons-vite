<template>
  <!-- custom-class is deprecated in latest element plus version -->
  <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    :title="`${
      formStore.isNewForm ? 'New' : 'Edit'
    } Daily Outstanding Service`"
    modal-class="ironlake-dialog"
    :width="800"
    :align-center="true"
    :close-on-click-modal="false"
    :show-close="false"
    @close="handleCloseModal()"
    @closed="resetFormDialog()"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError"
      />
    </transition>
    <Form>
      <el-form
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
                  <span class="required">Equipment No.</span>
                </template>
                <el-select
                  v-model="formItem.unitNumber"
                  placeholder="eg. DT0700"
                  clearable
                  filterable
                  @change="lookupServiceSize"
                >
                  <el-option
                    v-for="item in formStore.unitNumberOption"
                    :key="item.value"
                    :label="item.label.split(' | ')[0]"
                    :value="item.label.split(' | ')[0]"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="col p-0">
              <el-form-item>
                <template #label>
                  <span class="required">SMU Due (hours)</span>
                </template>
                <el-input
                  v-model="formItem.smuDue"
                  maxlength="10"
                  placeholder="Write SMU Due (hours)"
                  @input="smuDueNumberOnly()"
                >
                </el-input>
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
                  <span class="required"> Work Order </span>
                </template>
                <el-input
                  v-model="formItem.workOrder"
                  maxlength="10"
                  placeholder="Write your work order"
                  :disabled="
                    !formStore.stateIsNewForm && !formStore.stateIsDraftForm
                  "
                  @input="workOrderNumberOnly()"
                >
                </el-input>
              </el-form-item>
            </div>
            <div class="col p-0"></div>
            <div class="col p-0"></div>
          </div>
        </section>
        <section class="container p-0">
          <div class="row m-0 gap-4">
            <div class="col p-0">
              <el-form-item>
                <template #label>
                  <span class="required">Service Size</span>
                </template>
                <el-select
                  v-model="formItem.psType"
                  placeholder="Choose service size"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in formStore.psTypeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                  <template #empty>
                    <p
                      class="m-0 text-center py-3 px-2 fs-7 text-btech-info-500"
                    >
                      Equipment No. isn't mapped to any Service Size
                    </p>
                  </template>
                </el-select>
              </el-form-item>
            </div>
            <div class="col p-0">
              <el-form-item>
                <template #label>
                  <span class="required">Planned Service Date</span>
                </template>
                <el-date-picker
                  v-model="formItem.dateService"
                  type="date"
                  placeholder="Choose date of service"
                  format="DD.MM.YYYY"
                  :clearable="false"
                />
              </el-form-item>
            </div>
            <div class="col p-0">
              <el-form-item>
                <template #label>
                  <span class="required">Shift</span>
                </template>
                <el-select
                  v-model="formItem.shift"
                  placeholder="Choose shift"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in formStore.shiftOption"
                    :key="item.value"
                    :label="item.label"
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
              <el-form-item>
                <template #label>
                  <span class="required">Start Date</span>
                </template>
                <el-date-picker
                  v-model="formItem.startDate"
                  type="date"
                  placeholder="Start date"
                  format="DD.MM.YYYY"
                  :default-value="new Date()"
                  :clearable="false"
                />
              </el-form-item>
            </div>
            <div class="col p-0">
              <el-form-item>
                <template #label>
                  <span class="required">End Date</span>
                </template>
                <el-date-picker
                  v-model="formItem.endDate"
                  type="date"
                  placeholder="End date"
                  format="DD.MM.YYYY"
                  :clearable="false"
                />
              </el-form-item>
            </div>
            <div class="col p-0"></div>
          </div>
        </section>
      </el-form>
    </Form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary"
          @click="handleCloseModal(false)"
          :disabled="formStore.loading"
          >Cancel</el-button
        >
        <el-button class="btn btn-btech-secondary" @click="handleSubmitData">
          Submit
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { toRef, computed } from "vue";
import {
  useDailyScheduleFormStore
} from "@/store/pinia/iron-lake/task/daily-schedule/useDailyScheduleFormStore";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  normalizeDate,
  simpleFormatDateShortAU,
} from "@/core/helpers/date-format";

const formStore = useDailyScheduleFormStore();
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
const lookupServiceSize = (equipmentNo: string) => {
  formStore.stateFormItem[0].psType = "";
  formStore.lookupServiceSize(equipmentNo);
};

const emits = defineEmits(["handle-close"]);
const handleCloseModal = async (isReload = false) => {
  emits("handle-close", isReload);
};
const resetFormDialog = () => {
  formItem.value.dateService = normalizeDate(
    new Date(formItem.value.dateService),
  );
  formItem.value.startDate = normalizeDate(new Date(formItem.value.startDate));
  formItem.value.endDate = normalizeDate(new Date(formItem.value.endDate));
  formStore.resetFormItem();
  handleResetError();
};

/* computed */
const errors = computed(() => {
  return formStore.errors;
});
const isError = computed(() => {
  return formStore.isError;
});

/* validation schema */
const inputValidation = Yup.object().shape({
  unitNumber: Yup.string().required("Equipment No. is required"),
  smuDue: Yup.string().required("SMU Due is required"),
  workOrder: Yup.string().required("Work Order is required"),
  psType: Yup.string().required("Service Size is required"),
  shift: Yup.string().required("Shift is required"),
  dateService: Yup.date()
    .required("Planned Service Date is required")
    .typeError("Planned Service Date is required"),
  startDate: Yup.date()
    .required("Start Date is required")
    .typeError("Start Date is required"),
  endDate: Yup.date()
    .required("End Date is required")
    .min(Yup.ref("startDate"), "End date must be later than start date")
    .typeError("End Date is required"),
});
const smuDueNumberOnly = () => {
  formItem.value.smuDue = formItem.value.smuDue!.replace(/\D/g, "");
};
const workOrderNumberOnly = () => {
  formItem.value.workOrder = formItem.value.workOrder!.replace(/\D/g, "");
};

const handleSubmitData = async () => {
  await inputValidation
    .validate(formItem.value, {
      abortEarly: false,
    })
    .then(() => {
      formStore.stateIsError = false;
    })
    .catch((error) => {
      formStore.setErrors(error.errors);
    });
  if (isError.value) return;

  const cacheDate = {
    dateService: formItem.value.dateService,
    startDate: formItem.value.startDate,
    endDate: formItem.value.endDate
  }

  formItem.value.dateService = simpleFormatDateShortAU(
    formItem.value.dateService,
  );
  formItem.value.startDate = simpleFormatDateShortAU(formItem.value.startDate);
  formItem.value.endDate = simpleFormatDateShortAU(formItem.value.endDate);

  formStore.insertData().then((response) => {
    formItem.value.dateService = cacheDate.dateService;
    formItem.value.startDate = cacheDate.startDate;
    formItem.value.endDate = cacheDate.endDate;
    if (!response?.data.result.isError) {
      formStore.resetFormItem();
      handleCloseModal(true);
    }
  });
};
const handleResetError = () => {
  formStore.setErrors([] as string[]);
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
