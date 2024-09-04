<template>
  <router-view></router-view>
</template>

<style lang="scss">
@import "~bootstrap/dist/css/bootstrap.min.css";
@import "~sweetalert2/dist/sweetalert2.css";
@import "~@fortawesome/fontawesome-free/css/all.min.css";
@import "~dropzone/dist/dropzone.css";
@import "~element-plus/lib/theme-chalk/index.css";


// Main demo style scss
@import "./assets/sass/plugins";
@import "./assets/sass/style";

</style>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useConfigStore } from "./store/templates/useConfigStore"
import { Mutations } from "./store/enums/StoreEnums";


export default defineComponent({
  name: "app",
  setup() {
    const store = useConfigStore();

    onMounted(() => {
      store[Mutations.OVERRIDE_LAYOUT_CONFIG]();
    });
  }
});
</script>
