<template>
  <div class="equipment-information-intervention mt-5 ps-0">
    <el-collapse v-model="activeTaskGroupEquipment" class="general-accordion task-group py-1 px-5 mb-3">
      <el-collapse-item name="Equipment Information">
        <template #title>
          <h4 class="subtitle ps-3">Equipment Information</h4>
        </template>
        <div class="p-2 me-0">
          <div class="row" style="width:101%">
            <div class="col-12 pe-0 pb-2">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="intervention.equipment">
                <label for="floatingInput">Unit Number</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="intervention.equipmentModel">
                <label for="floatingInput">Equipment Model</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="intervention.sitedesc">
                <label for="floatingInput">Location</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="intervention.smu">
                <label for="floatingInput">Condition Rating SMU</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="newDateAUCurrent(intervention.sampleDate)">
                <label for="floatingInput">Condition Rating Date</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2">
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
            <div class="col-12 pe-0 pb-2">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="`${intervention.followUpPriority} ${intervention.followUpPriorityUom}`">
                <label for="floatingInput">Follow-up Priority</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="intervention.smuDue">
                <label for="floatingInput">SMU Due</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="intervention.estimationCompletionDate ? newDateAUCurrent(intervention.estimationCompletionDate): ''">
                <label for="floatingInput">Est. Completion Date</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" disabled :value="intervention.sapWorkOrder">
                <label for="floatingInput">SAP Work Order</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2">
              <div class="form-floating mb-3">
                <div class="form-control">
                  <pre class="pre-class" v-html="intervention.interventionReason ?? ''"></pre>
                </div>
                <label for="floatingInput">Intervention Reason</label>
              </div>
            </div>
            <div class="col-12 pe-0 pb-2">
              <div class="form-floating mb-3">
                <div class="form-control">
                  <pre class="pre-class" v-html="intervention.interventionDiagnosis ?? ''"></pre>
                </div>
                <label for="floatingInput">Intervention Description</label>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  defineProps,
  PropType
} from 'vue'
import { newDateAUCurrent } from '@/core/helpers/date-format'
import { Intervention } from '@/core/types/intervention/Intervention'
import { Component } from '@/core/types/intervention/Component'

const props = defineProps({
  defaultAccordionOpen: {
    type: Boolean,
    required: false,
    default: true
  },
  intervention: {
    type: Object as PropType<Intervention>,
    required: true
  }
})

/* refs */
const activeTaskGroupEquipment = ref(props.defaultAccordionOpen ? 'Equipment Information' : '')

/* computed */
const components = computed(() => {
  let comps = [] as Component[]
  if (!props.intervention.components || props.intervention.components.length < 1) {
    comps.push({
      componentId: props.intervention.componentId,
      componentCode: props.intervention.componentCode,
      componentDescription: props.intervention.componentDescription,
      componentHm: props.intervention.componentHm,
      componentTarget: undefined
    })
  } else {
    comps = props.intervention.components
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

<style lang="scss" scoped>
 @import "@/assets/sass/pages/floating-label.scss";
</style>

<style lang="scss">
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
.pre-class {
  text-wrap: unset;
  margin-bottom: 0;
  font-family: 'Public Sans';
  font-size: 12px;
}
.interventionDiagnostics-control,
.interventionDiagnostics-select {
  color: #919EAB;
}

.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}

.vcp__body {
  overflow: inherit !important;
}

.title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color:#212B36;
}

.subtitle {
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
}

.no-float {
  height: 48px;
}
.relative-hidder {
  position: inherit !important;
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

.label-font {
  font-size: 13px;
  font-weight: 600;
  color: #212B36 !important;
  opacity: 0.65;
}
.text-font {
  width: 100%;
  margin-top: .5rem;
  border: none;
  color: #212B36;
  font-size: 14px;
  color: #919EAB;
  border: none;
}

@media only screen and (max-width: 767px) {
  .no-float {
    height: 44px;
  }
}
</style>
