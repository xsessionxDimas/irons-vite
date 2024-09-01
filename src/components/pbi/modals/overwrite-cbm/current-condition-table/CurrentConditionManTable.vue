<template>
  <table class="table table-bordered" v-loading="loading">
    <thead>
      <tr style="background: #f4f6f8">
        <th scope="col" class="table-header ps-3">No</th>
        <th scope="col" class="table-header">Measurement Location</th>
        <th scope="col" class="table-header">Rating</th>
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
  toRefs,
  watch,
  reactive
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
const { rating } = toRefs(state);
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
