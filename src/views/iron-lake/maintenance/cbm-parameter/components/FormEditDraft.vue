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
        <el-form-item class="m-0">
          <template #label>
            <span class="">Rating</span>
          </template>
          <el-input
            v-model="formData.rating"
            disabled
            placeholder="Rating"
          >
          </el-input>
        </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
          <el-form-item>
            <template #label>
              <span :class="editableCondition ? 'required' : ''">Type Parameter</span>
            </template>
            <el-select
              class="w-100"
              v-model="formData.typeParameter"
              placeholder="Type Parameter"
              clearable
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
      <div class="col-12 fv-row fv-plugins-icon-container">
          <el-form-item>
            <template #label>
              <span class="required">Component</span>
            </template>
            <el-select
              class="w-100"
              v-model="formData.component"
              placeholder="Component"
              clearable
              filterable
              :disabled="parsedRating() === 'calibration' ? false : parsedRating() === 'automatic' ? false : parsedRating() === 'automatic_previous' ? false : parsedRating() === 'normal' ? false : parsedRating() === 'manual' ? false : true"
            >
              <el-option
                v-for="item in components"
                :key="item.value"
                :label="item.label"
                :value="item.label"
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
              :disabled="parsedRating() === 'calibration' ? false : parsedRating() === 'automatic' ? false : parsedRating() === 'automatic_previous' ? false : parsedRating() === 'normal' ? false : parsedRating() === 'manual' ? false : true"
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
        <el-form-item class="m-0">
          <template #label>
            <span>UoM</span>
          </template>
          <el-input
            v-model="formData.uom"
            placeholder="UoM"
            :disabled="true"
          >
          </el-input>
        </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
          <el-form-item>
            <template #label>
              <span :class="editableCondition ? 'required' : ''">Status</span>
            </template>
            <el-select
              class="w-100"
              v-model="formData.status"
              placeholder="Status Converter"
              clearable
              filterable
              :disabled="!editableCondition"
            >
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
        <el-form-item class="m-0">
          <template #label>
            <span :class="editableCondition ? 'required' : ''">Min Value</span>
          </template>
          <el-input
            v-model="formData.minValue"
            placeholder="Min Value"
            :disabled="!editableCondition"
            @input="handleValueInputMinValue"
          >
          </el-input>
        </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
        <el-form-item class="m-0">
          <template #label>
            <span :class="editableCondition ? 'required' : ''">Max Value</span>
          </template>
          <el-input
            v-model="formData.maxValue"
            placeholder="Max Value"
            :disabled="!editableCondition"
            @input="handleValueInputMaxValue"
          >
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          class="btn btn-outline btn-outline-btech-secondary btn-active-light-btech-secondary"
          @click="handleCloseModal()"
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
import {
  useEmployeeFormStore
} from "@/store/pinia/administration/organization-unit/employee/useEmployeeFormStore";
import {
  UpsertItem
} from "@/core/types/entities/administration/organization-unit/employee/UpsertItem";
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
  ListItem
} from '@/core/types/entities/iron-lake/maintenance/cbm-parameter/ListItem';
import {
  DraftItem
} from '@/core/types/entities/iron-lake/maintenance/cbm-parameter/DraftItem';
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["handle-close", "input"]);

/* stores */
const formStore = useCbmParameterFormStore();
const listStore = useCbmParameterListStore();
const bulkStore = useCbmParameterBulkStore();
const authStore = useAuthenticationStore();

const isVisible = toRef(props, "visibility");
const formData: ComputedRef<DraftItem> = computed(() => {
  return formStore.stateFormDraftData;
});

const sampleInput = ref('')

/* computed */
const parsedRating = (() => {
  let value = '';
  if (formData.value.rating) {
    value = formData.value.rating.toLocaleLowerCase();
  }
  return value
})
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
const statusConverter = computed(() => {
  return listStore.stateStatusConverter;
});

const editableCondition = computed(() => {
  const condition = ['automatic', 'calibration'];
  return condition.some((el) => {
    return formData.value.rating.toLocaleLowerCase().includes(el)
  })
})

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

/* methods */
// const formReset = () => {}

/* handlers */
const handleCloseModal = (isReload = false) => {
  // formReset();
  handleResetError();
  emits("handle-close", isReload);
};

const handleValueInputMinValue = () => {
  const value = formData.value.minValue
  formData.value.minValue = `${value.replace(/[^\d.-/>/</ ]+/g, '')}`
}

const handleValueInputMaxValue = () => {
  const value = formData.value.maxValue
  formData.value.maxValue = `${value.replace(/[^\d.-/>/</ ]+/g, '')}`
}


const handleSubmitData = async () => {
  handleResetError();
  // bulkStore.stateAlert.show = false
  formStore.stateLoadingMessage = "Submitting Data";
  formStore.updateDraft().then(() => {
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
