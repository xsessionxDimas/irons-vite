<template>
  <div
    class="btn btn-sm btn-light d-flex align-items-center px-3 my-5"
    :class="{ disabled: isDisabled }"
  >
    <router-link v-if="!isDisabled" v-slot="{ href }" :to="{ name: routeName }">
      <a
        href="javascript:void(0)"
        @click="redirectByLink(href)"
        class="text-gray-600"
        :disabled="isDisabled"
        >Add Data</a
      >
    </router-link>
    <div v-else>Add Data</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import navigator from "@/core/mixins/navigator";

export default defineComponent({
  props: {
    routeName: String,
    isDisabled: Boolean,
  },
  setup() {
    const { redirectByLink } = navigator();
    return {
      redirectByLink,
    };
  },
});
</script>

<style scoped>
.disabled {
  color: #e0e0e0;
}
</style>
