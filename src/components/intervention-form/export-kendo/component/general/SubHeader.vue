<template>
  <Submitted :data="subHeader" />
</template>

<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { General } from "@/core/types/entities/dma/e-form/general/General";
import {
  ComponentInterventionGeneral
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionGeneral";
import Submitted from "./section/Submitted.vue";


const props = defineProps({
  subHeader: {
    required: true,
    type: Object as PropType<General | ComponentInterventionGeneral>,
  },
});
</script>
