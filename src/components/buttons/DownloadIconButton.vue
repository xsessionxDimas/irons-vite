<template>
  <el-tooltip
    class="box-item"
    effect="dark"
    content="Download Excel"
    placement="top"
  >
    <div
      class="btn btn-small btn-icon duotune-icon px-2 my-5"
      @click="handleDownload()"
    >
      <span class="svg-icon svg-icon-2x">
        <inline-svg src="/media/svg/buttons/download-excel.svg" />
      </span>
    </div>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup(_, { emit }) {
    const handleDownload = () => {
      emit("handle-download");
    };
    return { handleDownload };
  },
});
</script>
