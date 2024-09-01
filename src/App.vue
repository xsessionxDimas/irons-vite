<template>
  <router-view></router-view>
</template>

<style lang="scss">
@import "~sweetalert2/dist/sweetalert2.css";
@import "~@fortawesome/fontawesome-free/css/all.min.css";
@import "~dropzone/dist/dropzone.css";
@import "~element-plus/lib/theme-chalk/index.css";
@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins';
@import '~bootstrap/scss/utilities';

// Main demo style scss
@import "assets/sass/plugins";
@import "assets/sass/style";

// Dark mode demo style scss
//@import "assets/sass/plugins.dark";
//@import "assets/sass/style.dark";

// RTL version styles
//@import "assets/css/style.rtl.css";
</style>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
  name: "app",
});
</script>
