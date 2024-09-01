<template>
  <div class="my-3 py-3 px-5 approval-box">
    <h6 class="text-green">Approved by {{ props.approvedBy }}</h6>
    <span>{{ date }} - {{ name }}</span>
  </div>
  <div class="my-3 py-3 px-5 approval-box">
    <h6 class="text-green">Approval Comment</h6>
    <span>{{ comment }}</span>
  </div>
</template>

<script lang="ts" setup>
import {
  defineProps,
} from "vue";

const props = defineProps({
  approvedBy: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
});
</script>

<style scoped>
.text-green {
  color: #5e8155
}
.approval-box {
  background-color: #eefbea;
  border:#54d62c 1px solid;
  width: 100%;
  border-radius: 0.75rem;
}
</style>
