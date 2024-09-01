<template>
  <table class="table table-bordered" v-loading="props.loading">
    <caption></caption>
    <thead>
      <tr style="background:#f4f6f8">
        <th scope="col" class="table-header ps-3">No</th>
        <th scope="col" class="table-header">Measurement Location</th>
        <th scope="col" class="table-header">Previous Value</th>
        <th scope="col" class="table-header">Current Value</th>
        <th scope="col" class="table-header">UoM</th>
        <th scope="col" class="table-header">Rating</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row" class="ps-3 align-middle">{{ itemService.number }}</th>
        <th scope="row" class="align-middle">{{ itemService.text }}</th>
        <th scope="row" class="align-middle">
          <el-input v-model="previousMeasurement" placeholder="Previous Value" class="input-previous_value" readonly />
        </th>
        <th scope="row" class="align-middle">
          <el-input
            v-model="measurement"
            placeholder="Current Value"
            class="input-current_value"
            readonly
          />
        </th>
        <th scope="row" class="align-middle">{{ itemService.uom }}</th>
        <th scope="row" class="align-middle">
          <div class="input-eform-status">
            <el-input
              v-model="rating"
              :class="`pe-3 ${itemService.color}`"
              disabled
            />
          </div>
        </th>
      </tr>
      <tr>
        <td class="timestamp-task text-end m-auto pe-3 pt-0 pb-3" colspan="9">
          {{ itemService.timestamp.name }}, {{ itemService.timestamp.date }}
        </td>
      </tr>
      <tr v-if="itemService.isReplacementAdjustment">
        <th scope="row"></th>
        <th scope="row" class="align-middle">Replacement</th>
        <th scope="row"></th>
        <th scope="row" class="align-middle">
          <el-input v-model="replacementMeasurement" placeholder="Current Value" class="input-current_value" readonly />
        </th>
        <th scope="row" class="align-middle">{{ itemService.uom }}</th>
        <th scope="row" class="align-middle">
          <div class="input-eform-status">
            <el-input
              v-model="replacementRating"
              :class="`pe-3 ${itemService.colorReplacementRating}`"
              disabled
            />
          </div>
        </th>
      </tr>
      <tr v-if="itemService.isReplacementAdjustment">
        <td class="timestamp-task text-end m-auto px-3 pt-0 pb-3" colspan="9">
          {{ itemService.replacementTimestamp.name }}, {{ itemService.replacementTimestamp.date }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import {
  defineProps,
  reactive,
  toRefs,
  watch,
} from "vue";

const props = defineProps({
  itemService: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
  },
})

const state = reactive({ ...props.itemService });
const { measurement, rating, previousMeasurement, replacementMeasurement, replacementRating } = toRefs(state);
watch(
  () => {
    return props.itemService
  },
  (newValue) => {
    Object.assign(state, newValue);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/defect.panel.scss";

  .align-top {
    vertical-align: top;
  }
</style>
