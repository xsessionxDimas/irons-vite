<template>
  <div class="col-3 text-left">
      <h4 class="fitter-badge">
          <img src="/media/icons/bumaau/person-circle.png" width="20" height="20" alt="warning" />
          {{ mechanicName }}
      </h4>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
} from "vue";

defineProps({
  mechanicName: {
    required: true,
    type: String
  }
});
</script>

<style scoped>
.fitter-badge {
  border-radius: 10px;
  color: black !important;
  background-color: rgb(204, 237, 255) !important;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0px;
  display: inline-flex;
  padding: 6px 10px;
  align-items: center;
}

.fitter-badge img {
  vertical-align: middle;
  margin-right: 6px;
}
</style>
