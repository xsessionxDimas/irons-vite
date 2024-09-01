<template>
  <HeaderTask title="General" />
  <EquipmentInformation :data="generalData" />
  <Personnel :data="generalData" />
  <SafetyPrecautions :data="generalData.safetyPrecaution" />
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from "vue";
import {
  ComponentInterventionGeneral
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionGeneral";
import EquipmentInformation from "./section/EquipmentInformation.vue";
import SafetyPrecautions from "./section/SafetyPrecautions.vue";
import Personnel from './section/Personnel.vue';
import HeaderTask from "../HeaderTask.vue";

const props = defineProps({
  general: {
    required: true,
    type: Object as PropType<ComponentInterventionGeneral>,
  },
});

const generalData = computed(() => {
  return props.general;
});
</script>
