<template>
  <el-tooltip
    class="box-item"
    effect="dark"
    content="Add Data"
    placement="top"
  >
    <div
      class="btn btn-small btn-icon duotune-icon px-2 my-5"
      @click="handleAction()"
    >
      <span class="svg-icon svg-icon-2x">
        <inline-svg src="/media/icons/duotune/arrows/arr075.svg" />
      </span>
    </div>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup(_, { emit }) {
    const handleAction = () => {
      emit("handle-action");
    };
    return { handleAction };
  },
});
</script>
