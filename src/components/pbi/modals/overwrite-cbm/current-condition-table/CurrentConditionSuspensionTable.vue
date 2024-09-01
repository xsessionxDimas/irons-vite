<template>
  <table class="table table-bordered" v-loading="props.loading">
    <caption></caption>
    <thead>
      <tr style="background:#f4f6f8">
        <th scope="col" class="table-header ps-3">No</th>
        <th scope="col" class="table-header">Measurement Location</th>
        <th scope="col" class="table-header">Measurement Value</th>
        <th scope="col" class="table-header">UoM</th>
        <th scope="col" class="table-header">Status</th>
        <th scope="col" class="table-header"></th>
      </tr>
    </thead>
    <tbody v-if="currentCondition">
      <tr>
        <th scope="row" class="ps-3 align-middle">{{ currentCondition.taskNo }}</th>
        <th scope="row" class="align-middle">{{ currentCondition.measurementLocation }}</th>
        <th scope="row" class="align-middle">
          <el-input v-model="currentCondition.measurementValue" placeholder="Measurement Value" class="input-measurement_value" readonly />
        </th>
        <th scope="row" class="align-middle">{{ currentCondition.uom }}</th>
        <th scope="row" class="align-middle">
          <div class="px-0 py-0 mx-0 my-0 d-flex align-items-center">
            <div class="little-box p-3 me-2" :class="[squareColor(currentCondition.rating)]"></div>
            {{ currentCondition.rating }}
          </div>
        </th>
        <th scope="row" class="align-bottom">
          <div v-if="currentCondition.updatedBy!.name" class="row px-0 mx-0">
            <div class="pb-1 pt-0 my-0 timestamp-task text-end">
              {{ currentCondition.updatedBy!.name }}, {{ currentCondition.updatedDate! }}
            </div>
          </div>
        </th>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import {
  defineProps
} from "vue";

const props = defineProps({
  currentCondition: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
  },
})

const squareColor = (value) => {
  let color = ""
  switch (value) {
    case "Out Spec":
      color = "red"
      break;
    case "Out of spec":
      color = "red"
      break;
    case "In spec":
      color = "green"
      break;
    default:
      break;
  }
  return color
}
</script>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/defect.panel.scss";
</style>
