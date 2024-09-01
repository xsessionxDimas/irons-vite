<template>
  <div class="ps-3 d-flex justify-content-between mb-5 avoid prevent-split">
        <!-- left -->
        <!-- P1 -->
        <div class="d-flex justify-content-center">
          <!-- box -->
          <div
            class="little-box red d-flex p-3 justify-content-center align-items-center vertical-center"
          >
            <span style="font-weight: 600; color: white">P1</span>
          </div>
          <p class="legend-label vertical-center px-3">Immediate</p>
        </div>
        <!-- P2 -->
        <div class="d-flex justify-content-center">
          <!-- box -->
          <div
            class="little-box gold d-flex p-3 justify-content-center align-items-center vertical-center"
          >
            <span style="font-weight: 600; color: white">P2</span>
          </div>
          <p class="legend-label vertical-center px-3">Urgent</p>
        </div>
        <!-- P3 -->
        <div class="d-flex justify-content-center">
          <!-- box -->
          <div
            class="little-box yellow d-flex p-3 justify-content-center align-items-center vertical-center"
          >
            <span style="font-weight: 600; color: white">P3</span>
          </div>
          <p class="legend-label vertical-center px-3">Routine</p>
        </div>
        <!-- P4 -->
        <div class="d-flex justify-content-center">
          <!-- box -->
          <div
            class="little-box green d-flex p-3 justify-content-center align-items-center vertical-center"
          >
            <span style="font-weight: 600; color: white">P4</span>
          </div>
          <p class="legend-label vertical-center px-3">Monitor</p>
        </div>
        <!-- right -->
        <div class="d-flex flex-row">
          <!-- P1 -->
          <div class="d-flex justify-content-center">
            <!-- box -->
            <div
              class="little-box rounded-circle red d-flex p-3 justify-content-center align-items-center vertical-center"
            >
              <img src="/media/svg/dma/icons/Repair.png" alt="" />
            </div>
            <p class="legend-label vertical-center px-3">Not Repaired</p>
          </div>
          <!-- P4 -->
          <div class="d-flex justify-content-center">
            <!-- box -->
            <div
              class="little-box rounded-circle green d-flex p-3 justify-content-center align-items-center vertical-center"
            >
              <img src="/media/svg/dma/icons/Repair.png" alt="" />
            </div>
            <p class="legend-label vertical-center px-3">Repaired</p>
          </div>
        </div>
      </div>
</template>
<style>
.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}
.vcp__body {
  overflow: inherit !important;
}
</style>
<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.panel.scss";
</style>
