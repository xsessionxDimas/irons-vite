<template>
  <div class="wrapper d-flex flex-column flex-fill">
    <div class="d-flex justify-content-between align-items-center">
        <p class="page-title">Service Completion Approval</p>
        <div>
          <online-status></online-status>
        </div>
    </div>
    <div class="col-12 w-100% bg-white">
      <h1 class="my-6"></h1>
      <ApprovalList />
    </div>
  </div>
</template>

<script setup lang="ts">
import ApprovalList from './components/list/Index.vue'
import OnlineStatus from '@/components/sensors/OnlineStatus.vue'

</script>
<style lang="scss" scoped>
  @import "@/assets/sass/pages/defect-review.scss";
</style>
