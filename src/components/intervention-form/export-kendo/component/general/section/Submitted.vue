<template>
  <div class="row mb-5 mt-5 g-1" v-if="allDataAvailable">
    <NameAndTime
      :submittedBy="submittedBy"
      :approvedSPV="approvedBy.SPV"
      :approvedPlanner="approvedBy.Planner"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, PropType } from "vue";
import { General } from "@/core/types/entities/dma/e-form/general/General";
import {
  ComponentInterventionGeneral
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionGeneral";
import NameAndTime from "@/components/e-form/export-kendo/component/general/component/NameAndTime.vue";
import { getStatusInfo } from "@/store/pinia/report/history/dma/helpers";
import { isUndefined } from "lodash";


const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<General | ComponentInterventionGeneral>,
  },
});

const allDataAvailable = computed(() => {
  const data = props.data;
  return (
    data &&
    data.statusHistory &&
    submittedBy.value.name &&
    approvedBy.value.SPV.name &&
    approvedBy.value.Planner.name
  );
});

const defaultEmpty = {
  name: "",
  date: "",
};

const submittedBy = computed(() => {
  const data = props.data;
  return isUndefined(data.statusHistory)
    ? defaultEmpty
    : getStatusInfo(data.statusHistory, ["Submited"]);
});

const approvedBy = computed(() => {
  if (!isUndefined(props.data.statusHistory)) {
    const spvStatus = getStatusInfo(props.data.statusHistory, [
      "Close",
      "Approved (SPV)",
    ]);
    const plannerStatus = getStatusInfo(props.data.statusHistory, [
      "Completed",
    ]);
    return {
      SPV: spvStatus,
      Planner: plannerStatus,
    };
  } else {
    return {
      SPV: defaultEmpty,
      Planner: defaultEmpty,
    };
  }
});
</script>
