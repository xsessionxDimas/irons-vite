<template>
    <!-- Kolom Submitted by -->
    <div class="col">
      <DataSubmitted
        label="Submitted by:"
        :name="'Fitter - ' + submittedBy.name"
        :value="submittedBy.date"
        :roundedLeft="true"
      />
    </div>
    <!-- Kolom Approved by (SPV) -->
    <div class="col">
      <DataSubmitted
        label="Approved by Supervisor:"
        :name="approvedSPV.name"
        :value="approvedSPV.date"
      />
    </div>
    <!-- Kolom Approved by (Planner) -->
    <div class="col">
      <DataSubmitted
        label="Approved by Planner:"
        :name="approvedPlanner.name"
        :value="approvedPlanner.date"
        :roundedRight="true"
      />
    </div>
  </template>

<script lang="ts" setup>
import DataSubmitted from "../component/DataSubmitted.vue";
import { defineProps } from "vue";
import { PropType } from "vue";

type DataSubmittedPDF = {
  name: string;
  date: string;
};


const props = defineProps({
  submittedBy: {
    type: Object as PropType<DataSubmittedPDF>,
    required: true,
  },
  approvedSPV: {
    type: Object as PropType<DataSubmittedPDF>,
    required: true,
  },
  approvedPlanner: {
    type: Object as PropType<DataSubmittedPDF>,
    required: true,
  },
});
</script>
./DataSubmitted.vue