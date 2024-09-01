<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    :title="getTitle()"
    width="60%"
    @open="handleOpenModal"
    @close="handleCloseModal"
  >
    <transition name="fade">
      <ErrorAlert
        v-if="isError"
        :errorMessages="errors"
        @reset-form="handleResetError" />
    </transition>
    <Form id="kt_filter_form" class="row g-2 my-4">
      <ElementTextInput
        :value="formData.recAction"
        :readonly="props.isPreview"
        placeholder="Add Intervention Check"
        label="Intervention Check"
        name="InterventionCheck"
        textInputType="textarea"
        :max="255"
        @handleChange="handleInterventionCheckChange" />
      <SelectInput
        :value="formData.typeTaskId"
        :is-disabled="props.isPreview"
        placeholder="Add Task Type"
        label="Task Type"
        name="TypeTask"
        @handleChange="handleTypeTaskChange"
        :options="listStore.typeTaskOptions" />
      <AutoComplete
        v-if="formData.typeTaskId == 3 || formData.typeTaskId == 10"
        :is-disabled="props.isPreview"
        :value="formData.uom"
        placeholder="Add UoM"
        label="UoM"
        name="Uom"
        @handleChange="handleUomChange"
        :options="listStore.uomOptions" />
    </Form>
    <div v-if="availableCbmForTypeTaskId.includes(formData.typeTaskId)" class="mb-5">
      <span>Is the Intervention Check required to assign to specific component?</span>
      <div class="my-3">
        <el-switch v-model="isComponentRequired" :active-text="isComponentRequired ? 'Required' : 'Not Required'" @change="handleSwitch" :disabled="props.isPreview" />
      </div>
      <div v-if="isComponentRequired">
        <SelectInput
          :value="tempComponentList"
          :is-disabled="props.isPreview"
          placeholder="Choose component"
          name="componentList"
          :options="componentOption"
          :isMultiple="true"
          @handle-change="handleComponentListChange"
        />
      </div>
    </div>
    <div v-if="formData.recAction && formData.typeTaskId">
      <h5 class="form-label fs-5 fw-bolder text-dark">
        Preview
      </h5>
      <div v-loading="loadingConditionOptions">
        <PreviewTable
          :taskNo="formData.sequence"
          :typeTask="formData.typeTaskId"
          :task="formData.recAction"
          :optionsSelectCondition="listStore.conditionOptions"
          :uom="formData.uom"
        />
      </div>
    </div>
    <template #footer v-if="!props.isPreview">
      <span class="dialog-footer">
        <el-button type="secondary" @click="handleCloseModal">Cancel</el-button>
        <el-button type="primary" @click="handleSubmitData">Submit</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  toRef,
  defineProps,
  defineEmits,
  ref,
  computed
} from 'vue';
import {
  useInterventionListStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionListStore";
import {
  useInterventionFormStore
} from '@/store/pinia/iron-portal/dashboard/intervention/useInterventionFormStore';
import { Form } from "vee-validate";
import * as Yup from "yup";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";
import ElementTextInput from "@/components/inputs/ElementTextInput.vue";
import SelectInput from "@/components/inputs/SelectInput.vue";
import PreviewTable from './PreviewTable.vue'
import AutoComplete from "@/components/inputs/AutoComplete.vue";
import {
  AdditionalTaskUpsertItem,
  ComponentListItem
} from '@/core/types/entities/iron-portal/dashboard/intervention/UpsertItem';

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(["handle-close", "handle-submit"]);

/* stores */
const listStore = useInterventionListStore();
const formStore = useInterventionFormStore();

const isComponentRequired = ref(false)
const tempComponentList = ref([] as string[])

const availableCbmForTypeTaskId = [
  5, // CBM Automatic 1
  6, // CBM Automatic 2
  7, // Condition Rating with Photo
  8, // Condition Rating with Photo and Defect Task
  9, // Condition Rating & Photo with Not Applicable Task
  10, // Condition Rating with Input Value and Photo
  11, // CBM Replacemen
]

/* refs*/
const isVisible = toRef(props, "visibility");

const formData = computed((): AdditionalTaskUpsertItem => {
  return listStore.formDataAdditional;
});

const loadingConditionOptions = computed(() => {
  return listStore.loadingConditionOptions;
});

const componentOption = computed(() => {
  return formStore.componentOption;
})

/* computed */
const errors = ref<string[]>([])
const isError = ref(false)

/* validation schema */
const inputValidation = Yup.object().shape({
  recAction: Yup.string().required("Intervention Check is mandatory").nullable(),
  typeTaskId: Yup.number().required("Task Type is mandatory").nullable(),
  uom: Yup.string().when("typeTaskId", {
    is: (typeTaskId) => {
      return (typeTaskId == 3 || typeTaskId == 10)
    },
    then: Yup.string().required("UoM is mandatory").nullable()
  }),
});

/* methods */
const getTitle = () => {
  if (props.isPreview) return "Additional Task Details"
  return props.isEdit ? "Edit Other Additional Intervention Check" : "Add Other Additional Intervention Check"
}
const formReset = () => {
  handleInterventionCheckChange("");
  handleTypeTaskChange(0);
  listStore.resetFormAdditionalTask()
  isComponentRequired.value = false
  tempComponentList.value = [] as string[]
};

/* handlers */
const handleOpenModal = () => {
  const notDeletedComponents: Array<ComponentListItem> = getNonDeletedComponents()
  if (notDeletedComponents.length > 0) {
    isComponentRequired.value = true
    formData.value.listComponent.forEach((e) => {
      if (!e.isDeleted && e.componentName) {
        tempComponentList.value.push(e.componentName);
      }
    })
  }
}
const handleCloseModal = (isReload = false) => {
  handleResetError();
  formReset();
  emits("handle-close", isReload);
};
const handleInterventionCheckChange = (value: string) => {
  formData.value.recAction = value;
};
const handleUomChange = (value: string) => {
  formData.value.uom = value;
  handleResetError();
};
const handleTypeTaskChange = async (value: number) => {
  handleResetError();
  formData.value.typeTaskId = value;
  handleUomChange("");
  if (value) {
    await listStore.getLookupConditionOption(value);
  }
  if (!availableCbmForTypeTaskId.includes(value)) {
    handleSwitch(false)
  }
};
const handleComponentListChange = (value) => {
  tempComponentList.value = value
}
const handleSwitch = (value) => {
  if (value) {
    const notDeletedComponents: Array<ComponentListItem> = getNonDeletedComponents()
    tempComponentList.value = notDeletedComponents.map((e) => {
      return e.componentName;
    })
  } else {
    isComponentRequired.value = false
    tempComponentList.value = [] as string[]
  }
}
const handleSubmitData = async () => {
  isError.value = false

  handleResetError();
  await inputValidation.validate(formData.value, {
    abortEarly: false,
  }).catch((error) => {
    isError.value = true
    errors.value = error.errors;
  });

  if (isError.value) return;

  const isDuplicate = await listStore.checkIsAdditionalTaskDuplicate(formData.value);
  if (isDuplicate) {
    isError.value = true
    errors.value = ["Intervention check already exist"];
    return;
  }
  if (formData.value.listComponent.length == 0) {
    formData.value.listComponent = tempComponentList.value.map((componentName) => {
      return {
        componentName: componentName,
        isDeleted: false
      }
    })
  } else {
    const removedComponent = formData.value.listComponent.filter((existing) => {
      const tempId = tempComponentList.value.findIndex((tempComponentName) => {
        return tempComponentName == existing.componentName
      })
      
      if (existing.isDeleted && tempId == -1) return existing
      if (tempId == -1) return existing
    })

    formData.value.listComponent = removedComponent.map((e) => {
      return {
        componentName: e.componentName,
        isDeleted: true
      }
    })
    tempComponentList.value.forEach((e) => {
      if (e) {
        formData.value.listComponent.push({
          componentName: e,
          isDeleted: false
        })
      }
    })
  }
  console.log(formData.value.listComponent)

  emits("handle-submit", formData.value);
}
const handleResetError = () => {
  isError.value = false
  errors.value = []
}

const getNonDeletedComponents = (): Array<ComponentListItem> => {
  return formData.value.listComponent.filter((e) => {
    return !e.isDeleted
  })
}

const getLabelOptions = (typeId) => {
  if (typeId) {
    return listStore.typeTaskOptions.find((item) => {
      return item.value == typeId
    })?.label
  }
  return ""
}
</script>

