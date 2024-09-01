<template>
  <div class="mt-5 ps-0">
    <div class="d-flex justify-content-between">
      <!-- left -->
      <div class="d-flex flex-row">
        <!-- P1 -->
        <div class="d-flex justify-content-center mb-5">
          <!-- box -->
          <div class="little-box red d-flex p-3 justify-content-center align-items-center">
            <span style="font-weight: 600; color: white">P1</span>
          </div>
          <p class="legend-label mx-3">Immediate</p>
        </div>
        <!-- P2 -->
        <div class="d-flex justify-content-center mb-5">
          <!-- box -->
          <div class="little-box gold d-flex p-3 justify-content-center align-items-center">
            <span style="font-weight: 600; color: white">P2</span>
          </div>
          <p class="legend-label mx-3">Urgent</p>
        </div>
        <!-- P3 -->
        <div class="d-flex justify-content-center mb-5">
          <!-- box -->
          <div class="little-box yellow d-flex p-3 justify-content-center align-items-center">
            <span style="font-weight: 600; color: white">P3</span>
          </div>
          <p class="legend-label mx-3">Routine</p>
        </div>
        <!-- P4 -->
        <div class="d-flex justify-content-center mb-5">
          <!-- box -->
          <div class="little-box green d-flex p-3 justify-content-center align-items-center">
            <span style="font-weight: 600; color: white">P4</span>
          </div>
          <p class="legend-label mx-3">Monitor</p>
        </div>
      </div>
      <!-- right -->
      <div class="d-flex flex-row">
        <!-- P1 -->
        <div class="d-flex justify-content-center mb-5">
          <!-- box -->
          <div class="little-box rounded-circle red d-flex p-3 justify-content-center align-items-center">
            <img src="/media/svg/dma/icons/Repair.png" alt="" />
          </div>
          <p class="legend-label mx-3">Incomplete</p>
        </div>
        <!-- P4 -->
        <div class="d-flex justify-content-center mb-5">
          <!-- box -->
          <div class="little-box rounded-circle green d-flex p-3 justify-content-center align-items-center">
            <img src="/media/svg/dma/icons/Repair.png" alt="" />
          </div>
          <p class="legend-label mx-3">Completed</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.panel.scss";
</style>
