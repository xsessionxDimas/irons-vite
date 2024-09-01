<template>
  <tr>
    <td class="col-title">
      <p>{{ props.title }}</p>
    </td>
    <td class="col-value">
      <div class="d-flex flex-row align-items-center">
        <p class="colon">:</p>
        <p class="value ms-1">{{ props.value }}</p>
      </div>
    </td>
  </tr>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: false,
  }
})
</script>

<style lang="scss" scoped>
.col-title {
  width: 110px;
  p {
    font-size: 10px;
    font-weight: 700;
    line-height: 21px;
    margin-bottom: 0;
  }
}
.col-value {
  .colon {
    font-size: 10px;
    font-weight: 700;
    line-height: 16px;
    margin-bottom: 0;
  }
  .value {
    font-size: 10px;
    font-weight: 400;
    line-height: 16px;
    margin-bottom: 0;
  }
}
</style>
