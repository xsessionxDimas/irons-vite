<template>
  <div class="row">
    <table class="table sync-table">
      <thead>
        <tr>
          <th class="ps-2 py-5" scope="col">Work Order</th>
          <th class="ps-2 py-5" scope="col">Form</th>
          <th class="ps-2 py-5" scope="col">Equipment</th>
          <th class="ps-2 py-5" scope="col">PS Type</th>
          <th class="px-2 py-5" scope="col">Waiting for Syncronization</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="records.length == 0">
          <tr>
            <td class="ps-2 text-center fs-3" colspan="5" scope="row">
              <div class="d-flex justify-content-center">
                <div class="badge-finished">All data already syncronized</div>
              </div>
            </td>
          </tr>
        </template>
        <template v-else v-for="item in records" :key="item.id">
          <tr>
            <th class="ps-2" scope="row">{{ item.workOrder }}</th>
            <td class="ps-2">{{ item.form }}</td>
            <td class="ps-2">{{ item.equipment }}</td>
            <td class="ps-2">{{ item.psType ? item.psType : '-'}}</td>
            <td class="px-2">{{ item.pendingTask }}</td>
          </tr>
        </template>
      </tbody>
    </table>
    <!-- header -->
    <!-- list -->
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  PropType
} from 'vue';
import {
  PendingTask
} from "@/core/types/entities/dma/pending-task-monitor/PendingTask";

defineProps({
  records: {
    required: true,
    type: Array as PropType<PendingTask[]>
  },
});
</script>

<style scoped lang="scss">
.sync-table {
  thead {
    background-color: #F4F6F8;
    tr {
      :first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      :last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }

      th {
        font-weight: 700
      }
    }
  }
  .badge-finished {
    border: 3px solid #1fdb5d;
    padding: 5px;
    border-radius: 10px;
    color: white;
    background: #1fdb5d;
  }
}
</style>
