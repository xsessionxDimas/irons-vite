<!-- eslint-disable no-undef -->
<template>
    <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="New Data"
    width="40%"
    @close="handleCloseModal()">
        <transition name="fade">
            <ErrorAlert
                v-if="isError"
                :errorMessages="errors"
                @reset-form="handleResetError" />
        </transition>
        <Form id="kt_filter_form" class="row g-9 my-4"  v-loading="formStore.loading">
            <AutoComplete
              :value="formData.MaintenancePlant"
              label="Maintenance Plant"
              name="MaintenancePlant"
              :options="maintenancePlantOption"
              placeholder="Add Maintenance Plant"
              @handle-change="handleMaintenancePlantChange" />
            <AutoComplete
              :value="formData.Customer"
              label="Customer"
              name="Customer"
              placeholder="Add Customer"
              :options="customerOption"
              @handle-change="handleCustomerChange" />
        </Form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handleSubmitData"  :disabled="formStore.loading">Submit</el-button>
                <el-button type="secondary" @click="handleCloseModal"  :disabled="formStore.loading">Close</el-button>
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
  onMounted
} from 'vue';
import {
  useCustomerAssignmentFormStore
} from "@/store/pinia/iron-lake/business-partner/customer-assignment/useCustomerAssignmentFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/business-partner/customer-assignment/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import AutoComplete from "@/components/inputs/AutoComplete.vue";


const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useCustomerAssignmentFormStore();
const authStore = useAuthenticationStore();

/* refs*/
const isVisible = toRef(props, "visibility");
const formData: ComputedRef<UpsertItem> = computed(() => {
  return formStore.formData;
});

/* computed */
const errors = computed(() => {
  return formStore.errors;
});
const isError = computed(() => {
  return formStore.isError;
});
const maintenancePlantOption = computed(() => {
  return formStore.maintenancePlantWithDescOption
})
const customerOption = computed(() => {
  return formStore.customerWithDescOption
})

/* validation schema */
const inputValidation = Yup.object().shape({
  MaintenancePlant: Yup.string().required("Maintenance Plant is mandatory"),
  Customer: Yup.string().required("Customer is mandatory")
});

/* methods */
const formReset = () => {
  handleMaintenancePlantChange("");
  handleCustomerChange("");
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  emits("handle-close", isReload);
}
const handleMaintenancePlantChange = (value: string) => {
  formData.value.MaintenancePlant = value
  if (value) {
    const maintenancePlant = formStore.maintenancePlantLookupArr.find((el) => {
      return el.maintenancePlant === value
    })
    formData.value.MaintenancePlantDescription = maintenancePlant!.maintenancePlantDescription
  } else {
    formData.value.MaintenancePlant = ""
    formData.value.MaintenancePlantDescription = ""
  }
}
const handleCustomerChange = (value: string) => {
  formData.value.Customer = value
}
const handleSubmitData = async () => {
  handleResetError();
  await inputValidation.validate(formData.value, {
    abortEarly: false,
  }).catch((error) => {
    formStore.setErrors(error.errors);
  });
  if (isError.value) return;
  swalAlertConfirmation("Are you sure you want to submit ?").then(async (res) => {
    if (res.isConfirmed) {
      formStore.insertData(authStore.user.Name).then(() => {
        if (!formStore.isError) {
          swalAlertSuccess("Form has been successfully submitted!", "Ok")
            .then(() => {
              handleCloseModal(true);
            });
        }
      });
    }
  });
}
const handleResetError = () => {
  formStore.setErrors([] as string[]);
}

onMounted(() => {
  formStore.getMaintenancePlantLookup()
  formStore.getCustomerLookup()
})
</script>
