<template>
  <el-tooltip
    class="box-item"
    effect="dark"
    content="Upload Excel"
    placement="top"
  >
    <div
      class="btn btn-small btn-icon duotune-icon px-2 my-5"
      @click="handleModalToggle()"
    >
      <span class="svg-icon svg-icon-2x">
        <inline-svg src="/media/svg/buttons/Uploaded-file.svg" />
      </span>
    </div>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup(_, { emit }) {
    const handleModalToggle = () => {
      emit("show-dialog", null);
    };
    return { handleModalToggle };
  },
});
</script>
