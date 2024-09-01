<template>
  <div
    class="btn btn-sm btn-light d-flex align-items-center px-3 my-5"
    @click="handleDownload()"
  >
    <div class="text-gray-600">
      Download <em class="bi bi-file-earmark-excel"></em>
    </div>
  </div>
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
