<template>
  <div class="report mb-4">
    <div class="report_section_header">
      <h4 class="title ps-3">Equipment Information</h4>
    </div>
    <div class="report_section_body">
      <div class="row-grid row-grid-4-col">
        <Input label="Unit Number" :value="data.equipment" />
        <Input label="Serial Number" :value="data.serialNumber || ''" />
        <Input label="Work Order" :value="data.workOrder" />
        <Input label="Machine SMU" :value="data.smu" />
      </div>
      <template v-if="data.smuBy && data.smuDate">
        <div class="row pe-3 text-nowrap">
          <div class="d-flex justify-content-end pb-1 my-0 timestamp-task avoid">
            <span>
              {{ data.smuBy.name }}, {{ data.smuDate }}
            </span>
          </div>
        </div>
      </template>
      <div class="row-grid" :class="swingAndTravel ? 'row-grid-3-col' : 'row-grid-2-col'">
        <Input label="Actual Service Start" :value="data.serviceStart" />
        <Input label="Hour Meter Offset" :value="hmOffset" />
        <template v-if="swingAndTravel">
          <Input label="Travel Hours" :value="traveHours" />
        </template>
      </div>
      <div class="row-grid" :class="swingAndTravel ? 'row-grid-2-col' : ''">
        <Input label="Actual Service Finish" :value="data.serviceEnd" />
        <template v-if="swingAndTravel">
          <Input label="Swing Hours" :value="swingHours" />
        </template>
      </div>
    </div>
    <div class="report_section_header_subtitle">
      <h4 class="title ps-3">Service Labour Personnel</h4>
    </div>
    <div class="report_section_body">
      <div class="table-report">
        <TableRow
          :header="true"
          :data="['Name', 'Shift', 'Start Date', 'Finish Date']"
       />
        <TableRow
          v-for="mechanic in data.servicePersonnels"
          :key="mechanic.key"
          :data="[
            mechanic.mechanic.name,
            mechanic.shift,
            mechanic.serviceStart,
            mechanic.serviceEnd,
          ]"
       />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from "vue";
import { General } from "@/core/types/entities/dma/e-form/general/General";
import Input from "../component/Input.vue";
import TableRow from "../component/TableRowServiceLabour.vue";
import { isNull, isUndefined } from "lodash";

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<General>,
  },
});

const data = computed(() => {
  return props.data;
});

const hmOffset = computed(() => {
  if (isUndefined(data.value.hmOffset) || isNull(data.value.hmOffset) || data.value.hmOffset == "") {
    return "Not Applicable"
  } else {
    return String(data.value.hmOffset)
  }
})

const traveHours = computed(() => {
  if (!isUndefined(data.value.travelHour)) {
    return String(data.value.travelHour)
  }
  return ""
})
const swingHours = computed(() => {
  if (!isUndefined(data.value.swingHour)) {
    return String(data.value.swingHour)
  }
  return ""
})
const swingAndTravel = computed(() => {
  return (data.value.swingHour || data.value.swingHour == '') || (data.value.travelHour || data.value.travelHour == '')
})

</script>
<style lang="scss">
.report_section_body {
  .row-grid {
    display: grid;
    &-2-col {
      grid-template-columns: 1fr 1fr;
      grid-gap: 1.25rem;
    }
    &-3-col {
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 1rem;
    }
    &-4-col {
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-gap: 1rem;
    }
  }
  .table-report {
    .row {
      border: 1px solid #eff2f5;
      &.table-header-background-color {
        background-color: #f9fafb;
      }
    }
  }
}
</style>
