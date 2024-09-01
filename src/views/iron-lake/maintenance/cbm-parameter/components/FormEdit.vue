<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    title="Edit CBM Parameter"
    :width="500"
    :close-on-click-modal="false"
    :show-close="false"
    @close="handleCloseModal()"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError"
      />
    </transition>
    <el-form class="row g-4 my-4" :label-position="'top'">
      <div class="col-12 fv-row fv-plugins-icon-container">
        <el-form-item class="m-0">
          <template #label>
            <span class="">Description</span>
          </template>
          <el-input
            v-model="formData.taskDescription"
            disabled
            placeholder="Description"
          >
          </el-input>
        </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
        <el-form-item class="m-0">
          <template #label>
            <span class="">Equipment Model</span>
          </template>
          <el-input
            v-model="formData.equipmentModel"
            disabled
            placeholder="Equipment Model"
          >
          </el-input>
        </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
        <el-form-item class="m-0">
          <template #label>
            <span class="">Service Size</span>
          </template>
          <el-input
            v-model="formData.serviceSize"
            disabled
            placeholder="Equipment Model"
          >
          </el-input>
        </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
        <el-form-item label="Component">
          <template #label>
                  <span class="required">Component</span>
                </template>
            <el-select
              class="w-100"
              v-model="formData.component"
              placeholder="Component"
              clearable
              filterable
            >
              <el-option
                v-for="item in components"
                :key="item.value"
                :label="item.label"
                :value="item.label.split(' | ')[0]"
              />
            </el-select>
          </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
        <el-form-item>
          <template #label>
                  <span class="required">CBM Group</span>
                </template>
            <el-select
              class="w-100"
              v-model="formData.cbmGroup"
              placeholder="CBM Group"
              clearable
              filterable
            >
              <el-option
                v-for="item in cbmGroup"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
        <div class="align-items-center fv-row">
          <div
            class="align-items-center justify-content-between form-control form-control-lg"
          >
            <div class="col-12 fv-row fv-plugins-icon-container">
              <el-form-item class="m-0">
                <template #label>
                  <span class="">Rating</span>
                </template>
                <el-input
                  v-model="formData.rating"
                  :placeholder="`Rating`"
                  :disabled="true"
                >
                </el-input>
              </el-form-item>
            </div>
            <div class="col-12 fv-row fv-plugins-icon-container mt-2">
            <el-form-item class="m-0">
              <template #label>
                  <span :class="editableCondition ? 'required':''">Type Parameter</span>
                </template>
            <el-select
              class="w-100"
              v-model="formData.typeParameter"
              placeholder="Type Parameter"
              :disabled="!editableCondition"
              filterable
            >
              <el-option
                v-for="item in typeParameter"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
            </div>
            <div class="grid mt-2">
              <div
                class="d-flex gap-2 justify-content-between align-items-center"
              >
                <div class="w-100">
                  <el-form-item class="m-0">
                    <template #label>
                      <span :class="editableCondition ? 'required':''">Status</span>
                    </template>
                  </el-form-item>
                </div>
                <div class="w-100">
                  <el-form-item class="m-0">
                    <template #label>
                      <span :class="editableCondition ? 'required':''">Min Value</span>
                    </template>
                  </el-form-item>
                </div>
                <div class="w-100">
                  <el-form-item class="m-0">
                    <template #label>
                      <span :class="editableCondition ? 'required':''">Max Value</span>
                    </template>
                  </el-form-item>
                </div>
                <div class="w-100">
                  <el-form-item class="m-0">
                    <template #label>
                      <span class="">UoM</span>
                    </template>
                  </el-form-item>
                </div>
                <div class="">
                </div>
              </div>
              <template v-for="(data, idx) in formCbm" :key="idx">
                <div
                  class="d-flex gap-2 justify-content-between align-items-center mt-2"
                >
                  <div class="w-100">
                    <el-form-item class="m-0">
                      <el-select
                        option
                        placeholder="Status"
                        v-model="data.status"
                        :disabled="!editableCondition"
                      >
                        <el-option
                          v-for="(item, i) in status"
                          :key="i"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="w-100">
                    <el-form-item class="m-0">
                      <el-input
                        v-model="data.minValue"
                        :placeholder="`Min Values`"
                        :disabled="!editableCondition"
                        @input="handleValueInputMinValue(idx)"
                        >
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="w-100">
                    <el-form-item class="m-0">
                      <el-input
                        v-model="data.maxValue"
                        placeholder="Max Value"
                        :disabled="!editableCondition"
                        @input="handleValueInputMaxValue(idx)"
                        >
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="w-100">
                    <el-form-item class="m-0">
                      <el-input
                        v-model="data.uom"
                        placeholder="UoM"
                        :disabled="true"
                        >
                      </el-input>
                    </el-form-item>
                  </div>
                  <div>
                    <el-tooltip
                      v-if="formCbm.length > 1 && editableCondition"
                      class="box-item"
                      effect="dark"
                      content="Delete"
                      placement="top"
                    >
                      <span
                        class="svg-icon svg-icon-btech-danger-500 d-inline-block m-0"
                        style="cursor: pointer"
                        @click="handleRemoveParameter(data)"
                      >
                      <inline-svg
                        src="/media/icons/bumaau/delete.svg"
                        style="width: 1.25rem; height: 1.25rem"
                      />
                  </span>
                </el-tooltip>
                  </div>
                </div>
              </template>
              <div class="grid">
                <div
                  class="w-100 btn-addparam"
                  v-if="editableCondition"
                >
                  <div
                    class="btn-addparam-text d-flex gap-2 align-items-center justify-content-center"
                    @click="handleAddParameter(formData.cbmParameter[formData.cbmParameter.length - 1].uom)"
                  >
                    <i class="fas fa-plus fs-6 text-btech-secondary-500"></i>
                    Add Parameter
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary"
          @click="handleCloseModal(false)"
          :disabled="formStore.loading"
          >Cancel</el-button
        >
        <el-button
          class="btn btn-btech-secondary"
          @click="handleSubmitData"
          :disabled="formStore.loading"
          >Submit</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  ComputedRef,
  toRef,
  defineProps,
  defineEmits,
  computed,
  ref,
  PropType,
} from 'vue';
import TextInput from "@/components/inputs/TextInput.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertError,
  swalAlertSuccessTitle,
  swalAlertErrorTitle
} from "@/core/helpers/sweet-alert";
import Icon from '@/components/ironlake/Icon.vue';
import SelectInput from "@/components/inputs/SelectInput.vue";
import {
  useCbmParameterListStore
} from '@/store/pinia/iron-lake/maintenance/cbm-parameter/useCbmParameterListStore';
import {
  useCbmParameterFormStore
} from '@/store/pinia/iron-lake/maintenance/cbm-parameter/useCbmParameterFormStore';
import {
  useCbmParameterBulkStore
} from '@/store/pinia/iron-lake/parameter/cbm-parameter/useCbmParameterBulkStore';
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';
import {
  CbmParameter,
  ListItem
} from '@/core/types/entities/iron-lake/maintenance/cbm-parameter/ListItem';
import { List, values } from 'lodash';
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
  cbmData: {
    type: Object as PropType<ListItem>,
    default: null,
  },
});
const emits = defineEmits(["handle-close", "input"]);

/* stores */
const formStore = useCbmParameterFormStore();
const listStore = useCbmParameterListStore();
const formData: ComputedRef<ListItem> = computed(() => {
  return formStore.formEditData;
});
const formCbm: ComputedRef<CbmParameter[]> = computed(() => {
  return formStore.formCbmData;
});
const tempFormData = ref({
  taskKey: formStore.formEditData.taskKey,
  equipmentModel: formStore.formEditData.equipmentModel,
  serviceSize: formStore.formEditData.serviceSize,
  component: formStore.formEditData.component,
  typeParameter: formStore.formEditData.typeParameter,
  cbmGroup: formStore.formEditData.cbmGroup,
  rating: formStore.formEditData.rating,
  taskDescription: formStore.formEditData.taskDescription,
  isActive: formStore.formEditData.isActive,
  taskNo: formStore.formEditData.taskNo,
  taskNoDetail: formStore.formEditData.taskNoDetail,
  modifiedBy: formStore.formEditData.modifiedBy,
  modifiedOn: formStore.formEditData.modifiedOn,
  cbmParameter: formStore.formEditData.cbmParameter,
} as ListItem)
const isVisible = toRef(props, "visibility");

/* computed */

const errors = computed(() => {
  return formStore.errors;
});
const isError = computed(() => {
  return formStore.isError;
});
const components = computed(() => {
  return listStore.stateComponentOption;
});
const cbmGroup = computed(() => {
  return listStore.stateCbmGroupOption;
});
const typeParameter = computed(() => {
  return listStore.stateTypeParameterOption;
});
const status = computed(() => {
  if (formData.value.typeParameter.toLocaleLowerCase() === 'suspension') {
    return [
      { label: 'In Spec', value: 'In Spec' },
      { label: 'Out of spec', value: 'Out of spec' },
    ];
  } else {
    return [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
      { label: 'X', value: 'X' },
    ]
  }
});
const rating = computed(() => {
  return listStore.stateRatingOption;
});

const editableCondition = computed(() => {
  const condition = ['automatic', 'calibration'];
  return condition.some((el) => {
    return formData.value.rating.toLocaleLowerCase().includes(el)
  })
})

/* validation schema */
const inputValidation = Yup.object().shape({
  company: Yup.string().required("Company is mandatory"),
  name: Yup.string()
    .min(3, (e) => {
      `Minimum length of Full Name is ${e.min} characters.`;
    })
    .required("Name is mandatory"),
  position: Yup.string().required("Position is mandatory"),
  siteName: Yup.string().required("Site is mandatory"),
  vendor: Yup.string().required("Vendor is mandatory"),
  isActive: Yup.string().required("Status is mandatory"),
});

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  emits("handle-close", isReload);
};

const handleValueInputMinValue = (e: number) => {
  const value = formData.value.cbmParameter[e].minValue
  formData.value.cbmParameter[e].minValue = `${value.replace(/[^\d.-/>/</ ]+/g, '')}`
}

const handleValueInputMaxValue = (e: number) => {
  const value = formData.value.cbmParameter[e].maxValue
  formData.value.cbmParameter[e].maxValue = `${value.replace(/[^\d.-/>/</ ]+/g, '')}`
}

const handleAddParameter = (uom: string) => {
  formStore.formCbmData.push({
    cbmParameterId: null,
    status: "",
    minValue: "",
    maxValue: "",
    uom: uom,
  } as CbmParameter);
};

const handleRemoveParameter = (item: CbmParameter) => {
  const index = formStore.formCbmData.findIndex((el) => {
    return (
      item.cbmParameterId === el.cbmParameterId &&
      item.status === el.status &&
      item.minValue === el.minValue &&
      item.maxValue === el.maxValue &&
      item.uom === el.uom
    )
  })
  if (index !== -1) {
    formStore.formCbmData.splice(index, 1);
  }
}

const handleSubmitData = async () => {
  handleResetError();
  formStore.stateLoadingMessage = "Submitting Data";
  formStore.setPayload(formData.value)
  formStore.updateData().then(() => {
    if (!formStore.isError) {
      swalAlertSuccessTitle(
        "Record has been submitted successfully",
        "",
        "Ok",
      ).then(() => {
        handleCloseModal(true);
      });
    } else {
      swalAlertErrorTitle("Failed to Update", "", "Ok");
    }
  })
  console.log(formStore.stateFormData);
};
const handleResetError = () => {
  formStore.setErrors([] as string[]);
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/core/components/mixins/_typography.scss";

.box-sitename {
  max-height: 200px;
  overflow-y: scroll;
  padding: 15px;
  border: 1px solid #d2d2d2;
  border-radius: 5px;
}
.checkbox {
  border: #000;
}
.box-photo {
  padding: 10px;
  position: relative;
}
.btn-clear-photo {
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 100%;
  background-color: #d2d2d2;
  cursor: pointer;
}
.btn-clear-photo:hover {
  background-color: #a2a2a2;
}
.btn-addparam {
  border: 1px solid #d2d2d2;
  border-radius: 5px;
  padding: 5px;
  margin-top: 5px;
  cursor: pointer;
  color: #01a3ff;
}
:deep(.el-form-item) {
  margin: 0;
  label {
    padding: 0;
    margin-bottom: 0.375rem;
    @include paragraph-sm();
    font-weight: 700;
  }
}
</style>
