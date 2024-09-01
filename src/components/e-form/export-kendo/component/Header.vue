<template>
  <div class="row avoid" id="header">
    <div class="col-6">
      <h4 class="title">e-Form</h4>
    </div>
    <div class="col-6">
      <h4 class="form-name">{{ title }}</h4>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
} from "vue";

const props = defineProps({
  title: {
    required: true,
    type: String,
  }
});

const title = computed(() => {
  return props.title
})
</script>

<style lang="scss" scoped>
.row {
  font-family: 'Public sans', sans-serif !important;
  .title {
    font-size: 20px;
    line-height: 30px;
  }
  .form-name {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: right;
  }
}
</style>
