<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    title="Edit Site"
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
    <el-form
      class="row g-4 my-4"
      :label-position="'top'">
      <div class="col-md-12 fv-row fv-plugins-icon-container">
        <el-form-item class="m-0">
          <template #label>
            <span class="required">Site ID</span>
          </template>
          <el-input
            maxlength="4"
            v-model="formData.siteId"
            placeholder="Add Site ID"
            @input="handleSiteIdChange"
          >
          </el-input>
        </el-form-item>
      </div>
      <div class="col-md-12 fv-row fv-plugins-icon-container">
        <el-form-item class="m-0">
          <template #label>
            <span class="required">Site Code</span>
          </template>
          <el-input
            maxlength="4"
            v-model="formData.siteCode"
            placeholder="Add Site Code"
            @input="handleSiteCodeChange"
          >
          </el-input>
        </el-form-item>
      </div>
      <div class="col-md-12 fv-row fv-plugins-icon-container">
        <el-form-item class="m-0">
          <template #label>
            <span class="required">Site Name</span>
          </template>
          <el-input
            max-length="3"
            v-model="formData.siteName"
            placeholder="Add Site Name"
            @input="handleSiteNameChange"
          >
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="secondary"
          @click="handleCloseModal()"
          :disabled="formStore.loading"
          >Close</el-button
        >
        <el-button
          type="primary"
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
  computed
} from 'vue';
import {
  useSiteFormStore
} from "@/store/pinia/iron-lake/business-partner/site/useSiteFormStore";
import TextInput from "@/components/inputs/TextInput.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccessTitle,
  swalAlertErrorTitle
} from "@/core/helpers/sweet-alert";
import {
  DraftItem
} from '@/core/types/entities/iron-lake/business-partner/site/DraftItem';
import {
  useSiteBulkStore
} from '@/store/pinia/iron-lake/business-partner/site/useSiteBulkStore';

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useSiteFormStore();
const bulkStore = useSiteBulkStore();

/* refs*/
const isVisible = toRef(props, "visibility");
const formData: ComputedRef<DraftItem> = computed(() => {
  return formStore.formDraftData;
});

/* computed */
const errors = computed(() => {
  return formStore.errors;
});

const isError = computed(() => {
  return formStore.isError;
});

/* validation schema */
const inputValidation = Yup.object().shape({
  siteId: Yup.string().required("Site is mandatory"),
  siteCode: Yup.string().required("Site Code is mandatory"),
  siteName: Yup.string().required("Site Name is mandatory"),
});

/* methods */
const resetFormValue = () => {
  formStore.stateFormData.siteKeyId = 0;
  handleSiteIdChange("");
  handleSiteCodeChange("");
  handleSiteNameChange("");
  handleStatusChange(false);
};

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  handleResetError();
  formStore.resetState();
  emits("handle-close", isReload);
};
const handleSiteIdChange = (value: string) => {
  formData.value.siteId = value;
};
const handleSiteNameChange = (value: string) => {
  formData.value.siteName = value;
};
const handleSiteCodeChange = (value: string) => {
  formData.value.siteCode = value;
};
const handleStatusChange = (value: boolean) => {
  formData.value.isActive = value;
};
const handleSubmitData = async () => {
  handleResetError();
  bulkStore.stateAlert.show = false;
  formStore.stateLoadingMessage = "Submitting Data";
  await inputValidation
    .validate(formData.value, {
      abortEarly: false,
    })
    .catch((error) => {
      formStore.setErrors(error.errors);
    });
  if (isError.value) return;
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
      swalAlertErrorTitle("Failed to Submit", "", "Ok");
    }
  });
};
const handleResetError = () => {
  formStore.setErrors([] as string[]);
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/core/components/mixins/_typography.scss";
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
