<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    v-loading="formStore.loading"
    title="Update Data"
    width="60%"
    @close="handleCloseModal()"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <Form id="kt_filter_form" class="row g-4 my-4"  v-loading="formStore.loading">
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.equipment" label="Equipment Number" name="equipment"
          :options="listStore.equipmentOption" @handle-change="handleEquipmentNumberChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.objectType" label="Object Type" name="objectType"
          :options="listStore.objectTypeOption" @handle-change="handleObjectTypeChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.plannerGroup" label="Planner Group" name="plannerGroup"
          :options="listStore.plannerGroupOption" @handle-change="handlePlannerGroupChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.maintenanceWorkCenter" label="Maintenance Work Center"
          name="maintenanceWorkCenter" :options="listStore.maintenanceWorkCenterOption"
          @handle-change="handleMaintenanceWorkCenterChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.costCenter" label="Cost Center" name="costCenter"
          :options="listStore.costCenterOption" @handle-change="handleCostCenterChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.wbsElement" label="WBS Element" name="wbsElement"
          :options="listStore.wbsElementOption" @handle-change="handleWbsElementChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.level" label="Level" name="level" :options="listStore.levelOption"
          @handle-change="handleLevelChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.equipmentType" label="Equipment Type" name="equipmentType"
          :options="listStore.equipmentTypeOption" @handle-change="handleEquipmentTypeChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.equipmentGroup" label="Equipment Group" name="equipmentGroup"
          :options="listStore.equipmentGroupOption" @handle-change="handleEquipmentGroupChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.equipmentModel" label="Equipment Model" name="equipmentModel"
          :options="listStore.equipmentModelOption" @handle-change="handleEquipmentModelChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.equipmentStatus" label="Equipment Status" name="equipmentStatus"
          :options="listStore.equipmentStatusOption" @handle-change="handleEquipmentStatusChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.site" label="Site" name="site" :options="listStore.siteOption"
          @handle-change="handleSiteChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.planningPlant" label="Planning Plant" name="planningPlant"
          :options="listStore.planningPlantOption" @handle-change="handlePlanningPlantChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <AutoComplete :value="formData.maintenancePlant" label="Maintenance Plant" name="maintenancePlant"
          :options="listStore.maintenancePlantOption" @handle-change="handleMaintenancePlantChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput :value="formData.startDate ? formData.startDate.toString() : ''" placeholder="Add Start Date"
          label="Start Date" name="startDate" @handleChange="handlestartDateChange" />
      </div>
      <div class="col-md-6 fv-row fv-plugins-icon-container">
        <DatePickerInput :value="formData.endDate ? formData.endDate.toString() : ''" placeholder="Add End Date"
          label="End Date" name="endDate" @handleChange="handleendDateChange" />
      </div>
    </Form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleSubmitData" :disabled="formStore.loading">Submit</el-button>
        <el-button type="secondary" @click="handleCloseModal" :disabled="formStore.loading">Close</el-button>
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
  useEquipmentAssignmentFormStore
} from "@/store/pinia/iron-lake/equipment/equipment-assignment/useEquipmentAssignmentFormStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  UpsertItem
} from "@/core/types/entities/iron-lake/equipment/equipment-assignment/UpsertItem";
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import {
  swalAlertSuccess,
  swalAlertConfirmation
} from "@/core/helpers/sweet-alert";
import DatePickerInput from "@/components/inputs/DatePickerInput.vue";
import {
  useEquipmentAssignmentListStore
} from "@/store/pinia/iron-lake/equipment/equipment-assignment/useEquipmentAssignmentListStore";
import AutoComplete from "@/components/inputs/AutoComplete.vue";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close"]);

/* stores */
const formStore = useEquipmentAssignmentFormStore();
const authStore = useAuthenticationStore();
const listStore = useEquipmentAssignmentListStore();

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

/* validation schema */
const inputValidation = Yup.object().shape({
  equipment: Yup.string().required("Equipment Number is mandatory"),
  objectType: Yup.string().required("Object Type is mandatory"),
  plannerGroup: Yup.string().required("Planner Group is mandatory"),
  costCenter: Yup.string().required("Cost Center is mandatory"),
  wbsElement: Yup.string().required("WBS Element is mandatory"),
  level: Yup.string().required("Level is mandatory"),
  equipmentType: Yup.string().required("Equipment Type is mandatory"),
  equipmentGroup: Yup.string().required("Equipment Group is mandatory"),
  equipmentModel: Yup.string().required("Equipment Model is mandatory"),
  equipmentStatus: Yup.string().required("Equipment Status is mandatory"),
  site: Yup.string().required("Site is mandatory"),
  planningPlant: Yup.string().required("Planning Plant is mandatory"),
  maintenancePlant: Yup.string().required("Maintenance Plant is mandatory"),
  maintenanceWorkCenter: Yup.string().required("Maintenance Work Center is mandatory"),
  startDate: Yup.date().required("Start Date is mandatory").typeError("Start Date is mandatory"),
  endDate: Yup.date().required("End Date is mandatory").min(Yup.ref("startDate"), "End date must be later than start date").typeError("End Date is mandatory"),
});

/* methods */
const resetFormValue = () => {
  formData.value.equipmentAssignmentId = 0;
  handleEquipmentNumberChange("")
  handleObjectTypeChange("")
  handlePlannerGroupChange("")
  handleMaintenanceWorkCenterChange("")
  handleCostCenterChange("")
  handleWbsElementChange("")
  handleLevelChange("")
  handleEquipmentTypeChange("")
  handleEquipmentGroupChange("")
  handleEquipmentModelChange("")
  handleEquipmentStatusChange("")
  handleSiteChange("")
  handlePlanningPlantChange("")
  handleMaintenancePlantChange("")
  handlestartDateChange("")
  handleendDateChange("")
}

/* handlers */
const handleCloseModal = (isReload = false) => {
  resetFormValue();
  handleResetError();
  formStore.resetState();
  emits("handle-close", isReload);
}
const handleEquipmentNumberChange = (value: string) => {
  formData.value.equipment = value
}
const handleObjectTypeChange = (value: string) => {
  formData.value.objectType = value
}
const handlePlannerGroupChange = (value: string) => {
  formData.value.plannerGroup = value
}
const handleMaintenanceWorkCenterChange = (value: string) => {
  formData.value.maintenanceWorkCenter = value
}
const handleCostCenterChange = (value: string) => {
  formData.value.costCenter = value
}
const handleWbsElementChange = (value: string) => {
  formData.value.wbsElement = value
}
const handleLevelChange = (value: string) => {
  formData.value.level = value
}
const handleEquipmentTypeChange = (value: string) => {
  formData.value.equipmentType = value
}
const handleEquipmentGroupChange = (value: string) => {
  formData.value.equipmentGroup = value
}
const handleEquipmentModelChange = (value: string) => {
  formData.value.equipmentModel = value
}
const handleEquipmentStatusChange = (value: string) => {
  formData.value.equipmentStatus = value
}
const handleSiteChange = (value: string) => {
  formData.value.site = value
}
const handlePlanningPlantChange = (value: string) => {
  formData.value.planningPlant = value
}
const handleMaintenancePlantChange = (value: string) => {
  formData.value.maintenancePlant = value
}
const handlestartDateChange = (value: string) => {
  formData.value.startDate = value
}
const handleendDateChange = (value: string) => {
  formData.value.endDate = value
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
      formStore.updateData(authStore.user.Name).then(() => {
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
</script>
