<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    title="Add New Employee"
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
            <span class="required">Full Name</span>
          </template>
          <el-input
            v-model="formData.name"
            placeholder="Write Employee Name"
            @input="handleNameChange"
          >
          </el-input>
        </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
        <el-form-item>
          <template #label>
            <span class="required">Position</span>
          </template>
          <el-select
            class="w-100"
            v-model="formData.position"
            placeholder="Select employee position"
            clearable
            filterable
          >
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
        <SelectInput
          :margin="false"
          class="m-0"
          :options="companies"
          :value="formData.company"
          name="Company"
          label="Company"
          placeholder="Select company"
          required
          @handleChange="handleCompanyChange"
        />
      </div>
      <div
        class="col-12 fv-row fv-plugins-icon-container"
        v-if="formData.company?.toString().toLocaleLowerCase() === 'external'"
      >
        <el-form-item label="Vendor">
          <el-select
            class="w-100"
            v-model="formData.vendor"
            placeholder="Select vendor"
            clearable
            filterable
            @change="handleVendorChange"
          >
            <el-option
              v-for="item in vendor"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container" v-if="isOtherVendor">
        <el-form-item class="m-0">
          <template #label>
            <span class="required">Custom Vendor</span>
          </template>
          <el-input
            v-model="otherVendor"
            placeholder="Write custom vendor"
            @input="handleCustomVendorChange"
          >
          </el-input>
        </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
        <el-form-item>
          <template #label>
            <span class="required">Site</span>
          </template>
          <el-select
            class="w-100"
            v-model="formData.siteName"
            placeholder="Site"
            :disabled="userDetail.isHO !== 1"
            clearable
            filterable
            @change="handleSiteChange"
          >
            <el-option
              v-for="item in sites"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
        <el-form-item label="Supervisor">
          <el-select
            class="w-100"
            v-model="formData.supervisor"
            placeholder="Select supervisor"
            clearable
            filterable
          >
            <el-option
              v-for="item in supervisors"
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
            <span>{{
              formData.company === "BUMA AU" ? "BUMA AU Email" : "Email"
            }}</span>
          </template>
          <el-input
            v-model="formData.email"
            :placeholder="`Write ${
              formData.company === 'BUMA AU' ? 'BUMA AU ' : 'Employee '
            }Email`"
            @input="handleEmailChange"
          >
          </el-input>
        </el-form-item>
      </div>
      <div class="col-12 fv-row fv-plugins-icon-container">
        <el-form-item class="m-0">
          <template #label class="label-new">
            <span>Employee ID</span>
          </template>
          <el-input
            v-model="formData.employeeCode"
            placeholder="Write Employee ID"
            @input="handleEmployeeCodeChange"
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
import SelectInput from "@/components/inputs/SelectInput.vue";
import {
  useEmployeeListStore
} from '@/store/pinia/administration/organization-unit/employee/useEmployeeListStore';
import {
  UploadItem
} from '@/core/types/entities/administration/organization-unit/employee/UploadItem';
import {
  useEmployeeBulkStore
} from '@/store/pinia/administration/organization-unit/employee/useEmployeeBulkStore';
import {
  useAuthenticationStore
} from '@/store/pinia/application/useAuthenticationStore';
import { Option } from '@/core/types/misc/Option';

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["handle-close", "input"]);

/* stores */
const formStore = useEmployeeFormStore();
const listStore = useEmployeeListStore();
const bulkStore = useEmployeeBulkStore();
const authStore = useAuthenticationStore();

/* refs*/
const photo = ref();
const previewPhoto = ref();
const otherVendor = ref("");
const isOtherVendor = ref(false);

const companies = ref([
  { value: "BUMA AU", label: "BUMA AU" },
  { value: "EXTERNAL", label: "EXTERNAL" },
]);

const isVisible = toRef(props, "visibility");
const formData: ComputedRef<UpsertItem> = computed(() => {
  return formStore.formData;
});

const formImageData: ComputedRef<UploadItem> = computed(() => {
  return formStore.formImageData;
});

/* computed */
const userDetail = computed(() => {
  return authStore.user;
});

const errors = computed(() => {
  return formStore.errors;
});
const isError = computed(() => {
  return formStore.isError;
});
const sites = computed(() => {
  if (userDetail.value.isHO === 1) {
    return listStore.stateLocationOption;
  } else {
    const site = [] as Option[];
    site.push({
      label: userDetail.value.Location,
      value: userDetail.value.SiteId,
    });
    return site;
  }
});

const supervisors = computed(() => {
  return listStore.stateDirectSupervisor;
});

const vendor = computed(() => {
  return listStore.stateVendorOption;
});

const roles = computed(() => {
  return listStore.statePositionOption;
});
/* validation schema */
const inputValidation = Yup.object().shape({
  company: Yup.string().required("Company is mandatory"),
  name: Yup.string()
    .min(3, (e) => {
      return `Minimum length of Full Name is ${e.min} characters.`;
    })
    .required("Name is mandatory"),
  position: Yup.string().required("Position is mandatory"),
  siteName: Yup.string().required("Site is mandatory"),
  isActive: Yup.string().required("Status is mandatory"),
});

/* methods */
const formReset = () => {
  handleEmployeeIdChange("");
  handleCompanyChange("BUMA AU");
  handleNameChange("");
  handleEmailChange("");
  handleSupervisorChange("");
  handleRoleChange("");
  handleVendorChange("");
  handleEmployeeCodeChange("");
  handleDeletePhoto();
  handleCustomVendorChange("");
  handleSiteChange("");
};

/* lifecycle hooks */

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  emits("handle-close", isReload);
};
const handleEmployeeIdChange = (value: string) => {
  formData.value.employeeId = value;
};
const handleCompanyChange = (value: string) => {
  formData.value.company = value;
};
const handleNameChange = (value: string) => {
  formData.value.name = value;
};
const handleEmailChange = (value: string) => {
  formData.value.email = value;
};
const handleVendorChange = (value: string) => {
  if (value.toLocaleLowerCase() === "add another vendor") {
    isOtherVendor.value = true;
    formData.value.vendor = "Add Another Vendor";
  } else {
    isOtherVendor.value = false;
    formData.value.vendor = value;
  }
};
const handleCustomVendorChange = (value: string) => {
  otherVendor.value = value;
};
const handleSupervisorChange = (value: string) => {
  formData.value.supervisor = value;
};
const handleRoleChange = (value: string) => {
  formData.value.position = value;
};
const handleProfileUrlChange = (value: string) => {
  formData.value.profileUrl = value;
};
const handleEmployeeCodeChange = (value: string) => {
  formData.value.employeeCode = value;
};
const handleImageChange = (value: File) => {
  formImageData.value.request = value;
};

const handleSiteChange = (value: string) => {
  handleSupervisorChange("");
  if (value !== "") {
    const selSite = listStore.stateLocationOption.filter((el) => {
      return el.label.includes(formData.value.siteName)
    });
    listStore.getLookupDirectSupervisor(selSite[0].value);
  } else {
    listStore.getLookupDirectSupervisor(userDetail.value.isHO !== 1 ? userDetail.value.SiteId : "");
  }
  formData.value.siteName = value;
};

const handleUploadPhoto = (e) => {
  const file = e.target.files[0];
  if (file.size > 300000) {
    swalAlertError("Image size cannot exceed 300KB", "Close");
  } else {
    previewPhoto.value = URL.createObjectURL(file);
    handleImageChange(file);
    // console.log(formImageData.value.request);
  }
};
const handleDeletePhoto = () => {
  previewPhoto.value = "";
  emits("input", {});
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
  if (previewPhoto.value) {
    formStore.uploadImage().then(() => {
      if (!formStore.isError) {
        formStore.insertData(formStore.stateUploadedImageData.url).then(() => {
          if (!formStore.isError) {
            swalAlertSuccessTitle(
              "Record has been submitted successfully",
              "",
              "Ok",
            ).then(() => {
              handleCloseModal(true);
            });
          }
        });
      } else {
        swalAlertErrorTitle("Failed to Submit", "", "Ok");
      }
    });
  } else {
    if (isOtherVendor.value) {
      formData.value.vendor = otherVendor.value;
    }
    formStore.insertData("").then(() => {
      if (!formStore.isError) {
        swalAlertSuccess("Record has been submitted successfully", "Ok").then(
          () => {
            handleCloseModal(true);
          },
        );
      } else {
        swalAlertErrorTitle("Failed to Submit", "", "Ok");
      }
    });
  }
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
