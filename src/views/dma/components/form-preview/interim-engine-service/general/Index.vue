<template>
    <EquipmentInformation :data="data"/>
    <SafetyPrecautions :data="data.safetyPrecaution"/>
    <RiskAssessment :ready="true" :data="data.riskAssesment" />
  </template>
<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType
} from "vue";
import EquipmentInformation from '@/views/dma/components/form-preview/interim-engine-service/general/components/EquipmentInformation.vue';
import SafetyPrecautions from '@/views/dma/components/form-preview/components/general/components/SafetyPrecautions.vue';
import RiskAssessment from '@/views/dma/components/form-preview/components/general/components/RiskAssessment.vue';
import { General } from "@/core/types/entities/dma/e-form/general/General";

const props = defineProps({
  general: {
    required: true,
    type: Object as PropType<General>
  }
});

const data = computed(() => {
  return props.general
})

</script>

