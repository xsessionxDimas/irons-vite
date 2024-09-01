<template>
  <div
    class="card border min-h-100"
    :class="
      formStore.stateIsFocusComp === true
        ? 'overlay overlay-block overflow-hidden'
        : ''
    "
  >
    <section class="card-body p-4">
      <div
        :class="formStore.stateIsFocusComp === true ? 'overlay-wrapper' : ''"
      >
        <h2 class="text-btech-info-500 mb-8">Equipment</h2>
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
                      <span class="required">Site</span>
                    </template>
                    <el-select
                      v-model="formItem.siteName"
                      placeholder="eg. Blackwater"
                      clearable
                      filterable
                      :disabled="
                        userDetail.isHO === 0 && !formStore.stateIsDraftForm
                      "
                      @focus="focusFormEquipment"
                      @blur="blurFormEquipment"
                    >
                      <el-option
                        v-for="item in formStore.siteOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <div v-if="isEqpForm()" class="col p-0">
                  <el-form-item>
                    <template #label>
                      <span class="required">Ownership</span>
                    </template>
                    <el-select
                      v-model="formItem.ownership"
                      placeholder="eg. Hired"
                      clearable
                      filterable
                      @focus="focusFormEquipment"
                      @blur="blurFormEquipment"
                      @change="handleOptionChanges($event, 'ownership')"
                    >
                      <el-option
                        v-for="item in formStore.ownershipOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <div v-if="isEqpForm()" class="col p-0"></div>
              </div>
            </section>
            <section class="container p-0">
              <div class="row m-0 gap-4">
                <div class="col p-0">
                  <el-form-item>
                    <template #label>
                      <span class="required"> Equipment No. </span>
                    </template>
                    <el-input
                      v-model="formItem.equipmentUnit"
                      placeholder="eg. DT0700"
                      maxlength="20"
                      :disabled="
                        !formStore.stateIsNewForm && !formStore.stateIsDraftForm
                      "
                      clearable
                      @focus="focusFormEquipment"
                      @blur="blurFormEquipment"
                    >
                    </el-input>
                  </el-form-item>
                </div>
                <div v-if="isEqpForm()" class="col p-0">
                  <el-form-item>
                    <template #label>
                      <span class="required"> Equipment Group </span>
                    </template>
                    <el-select
                      v-model="formItem.group"
                      placeholder="eg. Dozer"
                      clearable
                      filterable
                      @focus="focusFormEquipment"
                      @blur="blurFormEquipment"
                      @change="handleOptionChanges($event, 'group')"
                    >
                      <el-option
                        v-for="item in formStore.eqpGroupOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <div v-if="isEqpForm()" class="col p-0">
                  <el-form-item>
                    <template #label>
                      <span class="required"> Equipment Brand </span>
                    </template>
                    <el-select
                      v-model="formItem.brandName"
                      placeholder="eg. KOMATSU"
                      clearable
                      filterable
                      @focus="focusFormEquipment"
                      @blur="blurFormEquipment"
                      @change="handleOptionChanges($event, 'brandName')"
                    >
                      <el-option
                        v-for="item in formStore.eqpBrandOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </section>
            <section v-if="isEqpForm()" class="container p-0">
              <div class="row m-0 gap-4">
                <div class="col p-0">
                  <el-form-item>
                    <template #label>
                      <span class="required"> Equipment Model </span>
                    </template>
                    <el-select
                      v-model="formItem.model"
                      placeholder="eg. 623F"
                      clearable
                      filterable
                      @focus="focusFormEquipment"
                      @blur="blurFormEquipment"
                      @change="handleOptionChanges($event, 'model')"
                    >
                      <el-option
                        v-for="item in formStore.eqpModelOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <div class="col p-0">
                  <el-form-item>
                    <template #label>
                      <span>Serial No.</span>
                    </template>
                    <el-input
                      v-model="formItem.serialNo"
                      placeholder="eg. 20"
                      maxlength="20"
                      @focus="focusFormEquipment"
                      @blur="blurFormEquipment"
                    >
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col p-0"></div>
              </div>
            </section>
            <section class="container p-0">
              <div class="row m-0 gap-4">
                <div
                  v-if="isEqpForm()"
                  class="col p-0 align-self-stretch"
                  :class="
                    !formStore.isNewForm && !formStore.stateIsDraftForm
                      ? ''
                      : 'order-3'
                  "
                >
                  <el-form-item
                    v-if="!formStore.isNewForm && !formStore.stateIsDraftForm"
                    class="h-100 d-flex flex-column justify-content-end"
                  >
                    <template #label>
                      <div>
                        <p class="m-0">
                          Engine Hour Meter/ <br />Service Meter (SMU)
                          <el-tooltip
                            class="box-item"
                            effect="dark"
                            placement="top"
                            :visible="ehmTooltipVisible"
                          >
                            <template #content>
                              Data is from IronPortal Transactional →
                              <span
                                class="ironlake-redirect"
                                style="cursor: pointer"
                                @click="goToCounter()"
                                ><u>Counter Reading</u></span
                              >
                            </template>
                            <span
                              class="svg-icon svg-icon-btech-secondary-500 me-1"
                              style="cursor: pointer"
                            >
                              <inline-svg
                                src="/media/icons/bumaau/help.svg"
                                style="width: 1.25rem; height: 1.25rem"
                              />
                            </span>
                          </el-tooltip>
                        </p>
                      </div>
                    </template>
                    <el-input
                      v-model="formItem.engineHourMeter"
                      placeholder="eg. 20"
                      maxlength="20"
                      :disabled="true"
                      @focus="focusFormEquipment"
                      @blur="blurFormEquipment"
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
                      <p class="m-0">Hour Meter Offset <br /></p>
                    </template>
                    <el-input
                      v-model="formItem.engineHourMeterOffset"
                      placeholder="eg. 10"
                      maxlength="20"
                      @focus="focusFormEquipment"
                      @blur="blurFormEquipment"
                      @input="ehmOffsetNumber()"
                    >
                    </el-input>
                  </el-form-item>
                </div>
                <div class="col p-0">
                  <el-form-item
                    class="h-100 d-flex flex-column justify-content-end"
                  >
                    <template #label>
                      <span>Hour Meter Offset Reset Date</span>
                    </template>
                    <el-date-picker
                      v-model="formItem.resetDate"
                      type="date"
                      placeholder="eg. 10.10.2023"
                      format="DD.MM.YYYY"
                      @focus="focusDatepicker"
                      @blur="blurDatepicker"
                    />
                  </el-form-item>
                </div>
              </div>
            </section>
            <section
              v-if="!formStore.isNewForm && !formStore.isDraftForm"
              class="container p-0"
            >
              <div class="row m-0 gap-4">
                <div class="col p-0">
                  <el-form-item>
                    <template #label>
                      <span>Status</span>
                    </template>
                    <el-switch v-model="formItem.isActive" />
                  </el-form-item>
                </div>
                <div class="col p-0"></div>
                <div class="col p-0"></div>
                <div class="col p-0"></div>
              </div>
            </section>
          </el-form>
        </Form>
      </div>
      <div
        v-if="formStore.stateIsFocusComp"
        class="overlay-layer bg-dark bg-opacity-25"
        style="z-index: 9999"
      ></div>
    </section>
    <el-dialog
      v-model="modalNewOption"
      title="Add Other Option"
      width="30%"
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
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onUnmounted,
  ref,
  watch
} from "vue";
import { useRouter } from "vue-router";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  useListStore
} from "@/store/pinia/iron-lake/equipment/all-equipment/useListStore";
import {
  useFormStore
} from "@/store/pinia/iron-lake/equipment/all-equipment/useFormStore";

import { Form } from "vee-validate";
import * as Yup from "yup";

const formStore = useFormStore();
const formItem = computed({
  get() {
    return formStore.stateFormItem[0];
  },
  set(newValue) {
    formStore.stateFormItem[0] = newValue;
  },
});
const listStore = useListStore();
const isEqpForm = () => {
  return (
    (listStore.stateOnlyEquipment && !formStore.stateIsDraftForm) ||
    (!listStore.stateOnlyEquipment && !formStore.stateIsDraftForm) ||
    (listStore.stateOnlyEquipment && formStore.stateIsDraftForm)
  );
};
const authStore = useAuthenticationStore();
const userDetail = authStore.user;
const ehmNumber = () => {
  if (typeof formItem.value.engineHourMeter === "string") {
    formItem.value.engineHourMeter = formItem.value.engineHourMeter.replace(
      /\D/g,
      "",
    );
    const isNumber = parseInt(formItem.value.engineHourMeter);
    formItem.value.engineHourMeter = isNaN(isNumber) ? null : isNumber;
  }
};
const ehmOffsetNumber = () => {
  if (typeof formItem.value.engineHourMeterOffset === "string") {
    formItem.value.engineHourMeterOffset =
      formItem.value.engineHourMeterOffset.replace(/\D/g, "");
    const isNumber = parseInt(formItem.value.engineHourMeterOffset);
    formItem.value.engineHourMeterOffset = isNaN(isNumber) ? null : isNumber;
  }
};

// Validation module
/* Schema */
const inputValidation = Yup.object().shape({
  siteName: Yup.string()
    .max(40, (rule) => {
      return `Site Name cannot be longer than ${rule.max} characters`;
    })
    .required("Site is required"),
  ownership: Yup.string()
    .nullable()
    .max(255, (rule) => {
      return `Ownership cannot be longer than ${rule.max} characters`;
    })
    .required("Ownership is required"),
  equipmentUnit: Yup.string()
    .max(20, (rule) => {
      return `Equipment No. cannot be longer than ${rule.max} characters`;
    })
    .required("Equipment No. is required"),
  group: Yup.string()
    .max(100, (rule) => {
      return `Equipment Group cannot be longer than ${rule.max} characters`;
    })
    .required("Equipment Group is required"),
  brandName: Yup.string()
    .max(20, (rule) => {
      return `Equipment Brand Name cannot be longer than ${rule.max} characters`;
    })
    .required("Equipment Brand Name is required"),
  model: Yup.string()
    .max(20, (rule) => {
      return `Equipment Model cannot be longer than ${rule.max} characters`;
    })
    .required("Equipment Model is required"),
});
const inputValidationHMO = Yup.object().shape({
  siteName: Yup.string()
    .max(40, (rule) => {
      return `Site Name cannot be longer than ${rule.max} characters`;
    })
    .required("Site is required"),
  equipmentUnit: Yup.string()
    .max(20, (rule) => {
      return `Equipment No. cannot be longer than ${rule.max} characters`;
    })
    .required("Equipment No. is required"),
});
defineExpose({
  inputValidation,
  inputValidationHMO,
});

// new option module
const modalNewOption = ref(false);
const optionKeyToUpdate = ref("");
const handleOptionChanges = (selectedValue: string, formItemKey: string) => {
  optionKeyToUpdate.value = formItemKey;
  if (selectedValue.includes("Other")) {
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
const isFocusForm = ref(false);
const focusFormEquipment = () => {
  formStore.stateIsFocusEqp = true;
  isFocusForm.value = true;
};
const blurFormEquipment = () => {
  formStore.stateIsFocusEqp = null;
  isFocusForm.value = false;
};
// special case for date pciker focus/blur
const isFocusDatepicker = ref(false);
const focusDatepicker = () => {
  formStore.stateIsFocusEqp = true;
  isFocusDatepicker.value = true;
};
const blurDatepicker = () => {
  isFocusDatepicker.value = false;
};
watch(
  () => {
    return isFocusDatepicker.value;
  },
  (newVal) => {
    if (newVal === false && !isFocusForm.value) {
      formStore.stateIsFocusEqp = false;
    }
  },
);

// go to counter reading module
const router = useRouter();
const ehmTooltipVisible = ref(true);
const goToCounter = () => {
  ehmTooltipVisible.value = false;
  router.push({ name: "counterreading" });
};

onUnmounted(() => {
  ehmTooltipVisible.value = true;
});
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

.ironlake-redirect {
  color: #01a3ff;
  &:hover {
    color: #016299;
  }
}
</style>
