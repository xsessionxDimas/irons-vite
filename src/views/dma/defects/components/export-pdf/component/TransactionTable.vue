<template>
  <div class="row px-2 my-2">
    <div class="silinder-title">{{ title }}</div>
    <table
      style="
        margin-top: 10px;
        width: 99%;
        background: #f9fafb;
        height: 40px;
      "
    >
      <tr class="prevent-split table-header">
        <th style="text-align: center">Item</th>
        <th>Measurement Location</th>
        <th>Comment</th>
        <th style="width: 200px">Measurement Value</th>
        <th>UoM</th>
        <th>Status</th>
      </tr>
      <template v-for="task in convertedTask" :key="task.key">
        <tr class="prevent-split table-body">
          <td style="text-align: center">
            <Label :value="(task.items[1].value as string)" />
          </td>
          <td><Label :value="(task.items[2].value as string)" /></td>
          <td><Input :value="((task.items[3]?.value ?? '') as string)" /></td>
          <td><Input :value="(task.items[4].value as string)" /></td>
          <td><Label :value="(task.items[5].value as string)" /></td>
          <td>
            <StatusInfo
              :value="(task.items[6].value as string)"
              :updated-by="(task.items[6].updatedBy as Audit)"
              :updated-date="task.items[6].updatedDate"
            />
          </td>
        </tr>
        <tr class="prevent-split timestamp" v-if="task.items[6].value && task.items[6].updatedBy" style="">
          <td colspan="6">
            <div class="d-flex justify-content-end pb-1 timestamp-task col-12 offset-0 pe-3">
              {{ task.items[6].updatedBy.name }}, {{ task.items[6].updatedDate }}
            </div>
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { Task } from "@/core/types/entities/dma/e-form/Task";
import Label from "@/views/dma/components/defects/suspension-cylinder-height/form/template/sub-group/table-item/Label.vue";
import Input from "@/views/dma/components/defects/suspension-cylinder-height/form/template/sub-group/table-item/Input.vue";
import StatusInfo from "./transaction-table-component/StatusInfo.vue";
import { PropType, defineProps, computed } from "vue";
import { Audit } from "@/core/types/intervention/Audit";
import { convertCalibrationTask } from "@/store/pinia/dma/e-form/helpers";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  tasks: {
    type: Array as PropType<Task[]>,
    required: true,
  },
});

const convertedTask = computed(() => {
  return convertCalibrationTask(props.tasks)
})
</script>

<style lang="scss" scoped>
tr {
  &.table-header {
    height: 40px;
    border: 1px solid rgba(145, 158, 171, 0.24);
    td {
      text-align: left;
      padding: 5px;
      font-weight: 600;
    }
  }

  &.table-body {
    background: white;
    height: 40px;
    border-left: 1px solid rgba(145, 158, 171, 0.24);
    border-right: 1px solid rgba(145, 158, 171, 0.24);

    td {
      text-align: left;
    }
  }

  &.timestamp {
    background: white;
    border: 1px solid rgba(145, 158, 171, 0.24);
    border-top: none;
    border-bottom: none;

    &:last-child {
      border-bottom: 1px solid rgba(145, 158, 171, 0.24);
    }
  }
}
</style>
