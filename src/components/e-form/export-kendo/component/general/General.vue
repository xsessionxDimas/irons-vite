<template>
  <HeaderTask title="General" />
  <EquipmentInformation :data="generalData" />
  <SafetyPrecautions :data="generalData.safetyPrecaution" />
  <CheckBeforeTruck :data="generalData.checkBeforeTruck" :general="generalData" />
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  PropType
} from "vue";
import { General } from "@/core/types/entities/dma/e-form/general/General";
import EquipmentInformation from "./section/EquipmentInformation.vue";
import SafetyPrecautions from "./section/SafetyPrecautions.vue";
import CheckBeforeTruck from "./section/CheckBeforeTruck.vue";
import HeaderTask from "../HeaderTask.vue";

const props = defineProps({
  general: {
    required: true,
    type: Object as PropType<General>,
  },
});

const generalData = computed(() => {
  return props.general;
});
</script>
