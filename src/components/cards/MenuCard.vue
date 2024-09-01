<template>
  <div class="card h-100">
    <div class="card-header" style="border-bottom:none !important; m">
      <h4 class="card-title card-subheader fw-600">
        <span
          class="svg-icon svg-icon-2x svg-icon-success d-block my-2"
          style="margin-right: 15px">
          <img alt="Logo" :src="iconPath" class="h-40px logo" />
        </span>
        {{ cardHeader }}
      </h4>
    </div>
    <div class="card-body card-subtitle">{{ cardText }}</div>
    <div class="card-footer" style="border-top: none">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    iconPath: {
      type: String,
    },
    cardHeader: {
      type: String,
    },
    cardText: {
      type: String,
    },
  },
});
</script>

<style scoped>
.fas {
  color: #4D4D4D;
}
.card {
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.card .card-header {
  padding: 24.5px 17px 0 17px;
}

.card .card-body {
  padding: 16px 17px 0 17px;
  margin-bottom: 17px;
}

.card .card-footer {
  padding: 0 17px 24px 17px;
}
</style>
