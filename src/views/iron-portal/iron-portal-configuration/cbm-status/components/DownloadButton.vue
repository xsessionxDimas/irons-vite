<template>
  <el-dropdown
    trigger="click"
    class="btn btn-small btn-icon duotune-icon px-2 my-5"
    @command="handleDownload"
  >
    <el-tooltip
      class="box-item"
      effect="dark"
      placement="top"
      content="Download Excel"
    >
      <span class="svg-icon svg-icon-2x">
        <inline-svg src="/media/svg/buttons/download-excel.svg" />
      </span>
    </el-tooltip>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="General">Download General</el-dropdown-item>
        <el-dropdown-item command="Specific">Download Specific</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup(_, { emit }) {
    const handleDownload = (command) => {
      emit("handle-download", command);
    };
    return { handleDownload };
  },
});
</script>
