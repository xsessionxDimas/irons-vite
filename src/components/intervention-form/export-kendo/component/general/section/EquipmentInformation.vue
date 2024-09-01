<template>
  <div class="report mb-4">
    <div class="report_section_header">
      <h4 class="title ps-3">Equipment Information</h4>
    </div>
    <div class="report_section_body pt-0">
    <div class="p-2 me-0 equipment-information-intervention">
          <div class="row" style="width:101%">
            <div class="col-12 pe-0 pb-2 avoid">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="data.equipment">
                <label for="floatingInput">Unit Number</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2 avoid">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="data.equipmentModel">
                <label for="floatingInput">Equipment Model</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2 avoid">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="data.sitedesc">
                <label for="floatingInput">Location</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2 avoid">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="data.smu">
                <label for="floatingInput">Condition Rating SMU</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2 avoid">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="newDateAUCurrent(data.sampleDate)">
                <label for="floatingInput">Condition Rating Date</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2 avoid">
              <table class="components-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Component Life (hours)</th>
                    <th>BUMA AU Target (hours)</th>
                    <th>Component Life (percentage)</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="cmp in components" :key="cmp.componentId">
                    <tr>
                      <td>{{ cmp.componentDescription }}</td>
                      <td>{{ (+cmp.componentHm).toFixed() }}</td>
                      <template v-if="cmp.componentTarget">
                        <td>{{ (+cmp.componentTarget).toFixed() }}</td>
                        <td>{{ percentage(cmp) }}%</td>
                      </template>
                      <template v-else>
                        <td>N/A</td>
                        <td>N/A</td>
                      </template>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div class="col-12 pe-0 pb-2 avoid">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="`${data.followUpPriority} ${data.followUpPriorityUom}`">
                <label for="floatingInput">Follow-up Priority</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2 avoid">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="data.smuDue">
                <label for="floatingInput">SMU Due</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2 avoid">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="data.estimationCompletionDate ? newDateAUCurrent(data.estimationCompletionDate): ''">
                <label for="floatingInput">Est. Completion Date</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2 avoid">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="data.sapWorkOrder">
                <label for="floatingInput">SAP Work Order</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2 avoid">
              <div class="form-floating mb-3">
                <div class="form-control">
                  <pre class="pre-class" v-html="data.interventionReason ?? ''"></pre>
                </div>
                <label for="floatingInput">Intervention Reason</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2 avoid">
              <div class="form-floating mb-3">
                <div class="form-control">
                  <pre class="pre-class" v-html="data.interventionDiagnosis ?? ''"></pre>
                </div>
                <label for="floatingInput">Intervention Description</label>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType } from "vue";
import {
  ComponentInterventionGeneral
} from "@/core/types/entities/dma/component-intervention/ComponentInterventionGeneral";
import { newDateAUCurrent } from "@/core/helpers/date-format";
import { Component } from "@/core/types/intervention/Component";

const props = defineProps({
  data: {
    required: true,
    type: Object as PropType<ComponentInterventionGeneral>,
  },
})

const data = computed(() => {
  return props.data;
})
const components = computed(() => {
  let comps = [] as Component[]
  if (!props.data.components || props.data.components.length < 1) {
    comps.push({
      componentId: +props.data.componentId,
      componentCode: props.data.componentCode,
      componentDescription: props.data.componentDescription,
      componentHm: props.data.componentHm,
      componentTarget: undefined
    })
  } else {
    comps = props.data.components
  }
  return comps
})
const percentage = (component: Component) => {
  const raw = +component.componentHm / (component.componentTarget as number)
  const num = raw
  const floored = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)
  if (floored) {
    return (+floored[0] * 100).toFixed()
  }
  return ""
}
</script>
<style lang="scss">
.pre-class {
  text-wrap: unset;
  margin-bottom: 0;
  font-family: 'Public Sans';
  font-size: 12px;
}
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
.equipment-information-intervention {
  div {
    &.form-control {
      background-color: #eff2f5;
      height: fit-content;
      text-align: justify;
      min-height: 48.85px;
    }
  }
}
.components-table {
  width: 100%;
  color: #919EAB;
  font-size: 14px;
  font-weight: 600;
}
table.components-table thead {
  background-color: #EFF2F5;
  font-weight: bold !important;
  color: #212B36 !important;
  opacity: 0.65;
}
table.components-table th,
table.components-table tr td {
  height: calc(3.5rem + 2px);
  padding: 1rem 1rem;
  line-height: 1.5;
}
table.components-table tr td {
  font-size: 12px;
  color: #919EAB;
}
table.components-table tr th,
table.components-table tr td {
  border: 1px solid #e6e8ea
}
</style>
