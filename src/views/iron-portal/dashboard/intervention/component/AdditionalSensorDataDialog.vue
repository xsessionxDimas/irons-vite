<template>
  <el-dialog
    v-model="isVisible"
    title="Additional Sensor Data"
    :show-close="false"
    width="40%"
    lock-scroll
    v-loading="formStore.loading"
  >
    <div v-loading="formStore.loading">
      <transition name="fade">
        <ErrorAlert
          v-if="isError"
          :errorMessages="errors"
          @reset-form="handleResetError" />
      </transition>
      <div class="my-3 word_break">
        Do you want to add another sensor parameter critically in the current Intervention Form:
      </div>
      <div v-for="sensor in additionalSensorData" :key="sensor.id" class="mb-2 ms-2">
        <input type="checkbox" v-model="sensor.isCheck" class="me-3">
        <span v-html="formatText(sensor.interventionReason)"></span>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="secondary" @click="handleSubmitData(false)">No</el-button>
        <el-button :disabled="formStore.loading" type="primary" @click="handleSubmitData(true)">Add & Revise Intervention Form</el-button>
      </span>
    </template>
  </el-dialog>
  </template>

<script lang="ts" setup>
import {
  toRef,
  defineProps,
  ref,
  computed
} from 'vue';
import {
  useInterventionFormStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionFormStore";
import ErrorAlert from "@/components/alert/ErrorAlert.vue";

import {
  AdditionalSensorData
} from "@/core/types/entities/iron-portal/dashboard/intervention/FormIntervention";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  },
});

/* stores */
const formStore = useInterventionFormStore();

/* refs*/
const isVisible = toRef(props, "visibility");

const formIntervention = computed(() => {
  return formStore.formIntervention;
});

/* computed */
const errors = ref([])
const isError = ref(false)

const additionalSensorData = computed((): AdditionalSensorData[] => {
  return formStore.listAdditionalSensorData;
})

/* methods */
const formatText = (text: string) => {
  return text.replace(/CRITICAL/gi, '<span class="text-critical">CRITICAL</span>').replace(/CAUTION/gi, '<span class="text-caution">CAUTION</span>').replace(/NORMAL/gi, '<span class="text-normal-inv">NORMAL</span>');
}

/* handlers */
const handleSubmitData = async (isRevise: boolean) => {
  handleResetError();
  const result = await formStore.postAdditionalSensorData(isRevise)
  if (result.isError) {
    isError.value = true
    errors.value.push(result.message)
  } else {
    formStore.setIsAdditionalSensorExist(false)
    await formStore.getDataFromKeyPbi(formIntervention.value.keyPbi)
  }
}
const handleResetError = () => {
  isError.value = false
  errors.value = []
}
</script>

<style scoped>
.word_break {
  word-break: break-word !important;
}
</style>
