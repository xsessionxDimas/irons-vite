<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable no-undef -->
<template>
  <el-dialog
    v-model="isVisible"
    title="Condition Rating Date"
    width="40%"
    @close="handleCloseModal()"
    v-loading="formStore.loading"
    class="dialog-word_break"
  >
    <div v-loading="formStore.loading" class="my-5">
      <ul>
        <li v-for="(date, i) in props.dates" :key="i" class="my-2">
          {{ date }}
        </li>
      </ul>
    </div>
  </el-dialog>
  </template>

<script lang="ts" setup>
import {
  toRef,
  defineProps,
  defineEmits,
} from 'vue';
import {
  useInterventionFormStore
} from "@/store/pinia/iron-portal/dashboard/intervention/useInterventionFormStore";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false
  },
  dates: {
    type: Array
  }
});
const emits = defineEmits(["handle-close", "handle-submit"]);

/* stores */
const formStore = useInterventionFormStore();

/* refs*/
const isVisible = toRef(props, "visibility");

/* methods */

/* handlers */
const handleCloseModal = () => {
  emits("handle-close");
};
</script>
