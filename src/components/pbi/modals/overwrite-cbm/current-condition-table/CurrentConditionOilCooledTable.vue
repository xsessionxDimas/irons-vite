<template>
  <table class="table table-bordered" v-loading="loading">
    <caption></caption>
    <thead>
      <tr style="background: #f4f6f8">
        <th scope="col" style="width: 5%" class="table-header ps-3">No</th>
        <th scope="col" style="width: 15%" class="table-header">Measurement Location</th>
        <th scope="col" style="width: 15%" class="table-header">Tool</th>
        <th scope="col" style="width: 10%" class="table-header">A</th>
        <th scope="col" style="width: 10%" class="table-header">B</th>
        <th scope="col" style="width: 15%" class="table-header">Piston Movement (B-A)</th>
        <th scope="col" style="width: 5%" class="table-header">UoM</th>
        <th scope="col" style="width: 10%" class="table-header">Percent Worn</th>
        <th scope="col" style="width: 10%" class="table-header">Rating</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row" class="ps-3 align-middle">
          {{ itemService.number }}
        </th>
        <th scope="row" class="align-middle">
          {{ itemService.text }}
        </th>
        <th scope="row" class="align-middle">
          <el-select
            v-model="tool"
            readonly
          >
            <el-option value="BIRRANA">Birrana Gauge</el-option>
            <el-option value="CAT_GAUGE">CAT Gauge</el-option>
          </el-select>
        </th>
        <th scope="row" class="align-middle">
          <el-input v-model="itemService.pistonAValue" readonly />
        </th>
        <th scope="row" class="align-middle">
          <el-input v-model="itemService.pistonBValue" readonly />
        </th>
        <th scope="row" class="align-middle">
          <el-input v-model="itemService.pistonResultValue" readonly />
        </th>
        <th scope="row" class="align-middle">
          {{ itemService.uom }}
        </th>
        <th scope="row" class="align-middle">
          {{ percentage }}%
        </th>
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
        <td class="timestamp-task text-end m-auto px-3 pt-0 pb-3" colspan="9">
          {{ itemService.timestamp.name }},
          {{ itemService.timestamp.date }}
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
  computed
} from "vue";

const props = defineProps({
  itemService: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
  },
});

const state = reactive({ ...props.itemService });
const { measurement, rating } = toRefs(state);
watch(
  () => {
    return props.itemService
  },
  (newValue) => {
    Object.assign(state, newValue);
  },
  { deep: true }
);

const tool = computed(() => {
  return props.itemService.tool == "BIRRANA" ? "Birrana Gauge" : "CAT Gauge"
})
const percentage = computed(() => {
  return parseFloat(props.itemService.pistonPercentageValue) * 100
})
</script>
