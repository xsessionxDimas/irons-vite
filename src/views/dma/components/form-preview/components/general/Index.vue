<template>
    <EquipmentInformation :data="data" :view-empty="viewEmpty"/>
    <SafetyPrecautions :data="data.safetyPrecaution"/>
    <RiskAssessment :ready="true" :data="data.riskAssesment" />
    <CheckBeforeTruck :data="data.checkBeforeTruck" :general="data"/>
  </template>
<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType
} from "vue";
import EquipmentInformation from '@/views/dma/components/form-preview/components/general/components/EquipmentInformation.vue';
import SafetyPrecautions from '@/views/dma/components/form-preview/components/general/components/SafetyPrecautions.vue';
import CheckBeforeTruck from '@/views/dma/components/form-preview/components/general/components/CheckBeforeTruck.vue';
import RiskAssessment from '@/views/dma/components/form-preview/components/general/components/RiskAssessment.vue';
import { General } from "@/core/types/entities/dma/e-form/general/General";

const props = defineProps({
  general: {
    required: true,
    type: Object as PropType<General>
  },
  viewEmpty: {
    type: Boolean,
    required: false,
    default: false
  }
});

const data = computed(() => {
  console.log(props.general)
  return props.general
})

</script>

