<template>
    <div class="row px-2 my-2">
        <div class="silinder-title">{{  title }}</div>
        <table style="margin-top: 10px; width: 99%; border: 1px solid rgba(145, 158, 171, 0.24); background: #F9FAFB; height: 40px;">
          <thead style="padding: 5px; height: 40px; text-align: left;">
            <th style="text-align: center;">Item</th>
            <th>Measurement Location</th>
            <th>Comment</th>
            <th style="width:200px">Measurement Value</th>
            <th>UoM</th>
            <th style="width: 250px;">Status</th>
          </thead>
          <tbody style="background: white; padding: 5px; height: 40px; text-align: left;">
            <tr v-for="task in convertedTask" :key="task.key">
              <td style="text-align: center;"><Label :value="(task.items[1].value as string)" /></td>
              <td><Label :value="(task.items[2].value as string)" /></td>
              <td><Input :value="((task.items[3]?.value ?? '') as string)" /></td>
              <td><Input :value="(task.items[4].value as string)" /></td>
              <td><Label :value="(task.items[5].value as string)" /></td>
              <td style="width: 250px;"><StatusInfo
                :value="(task.items[6].value as string)"
                :updated-by="(task.items[6].updatedBy as Audit)"
                :updated-date="task.items[6].updatedDate"
                 /></td>
            </tr>
          </tbody>
        </table>
      </div>
</template>

<script lang="ts" setup>
import { Task } from '@/core/types/entities/dma/e-form/Task';
import Label from './Label.vue'
import Input from './Input.vue'
import StatusInfo from './StatusInfo.vue'
import {
  PropType,
  defineProps,
  computed
} from 'vue'
import { Audit } from '@/core/types/intervention/Audit';
import { convertCalibrationTask } from "@/store/pinia/dma/e-form/helpers"

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  tasks: {
    type: Array as PropType<Task[]>,
    required: true
  },
})

const convertedTask = computed(() => {
  return convertCalibrationTask(props.tasks)
})
</script>
