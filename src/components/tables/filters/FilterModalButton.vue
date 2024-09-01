<template>
  <div class="btn btn-sm btn-light d-flex align-items-center px-4" @click="handleModalToggle(true)">
    <div class="text-gray-600">filter by</div>
    <span class="svg-icon svg-icon-1 ms-2 me-0">
      <inline-svg src="/media/svg/tables/filter-icon-button.svg" />
    </span>
  </div>

  <FilterDialogContainer :dialogVisible="dialogVisible" @handle-close="handleModalToggle"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import FilterDialogContainer from './parts/FilterDialogContainer.vue'

export default defineComponent({
  components: {
    FilterDialogContainer
  },
  setup() {
    const dialogVisible = ref(false)

    const handleModalToggle = (status: boolean) => {
      dialogVisible.value = status
    }
    return { dialogVisible, handleModalToggle }
  }
})
</script>


<style lang="scss" scoped>
  .btn-light {
    background-color: #fff !important;
  }
  .btn {
    width: 7.4rem;
    margin-left: auto;
  }
</style>
