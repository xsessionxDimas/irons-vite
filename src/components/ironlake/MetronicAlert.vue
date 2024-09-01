<template>
  <div
    v-if="props.showAlert"
    class="alert d-flex align-items-center w-100 p-3 mb-6"
    :class="`bg-btech-${props.variant}`"
  >
    <!--begin::Icon-->
    <span
      class="svg-icon svg-icon-2 me-3"
      :class="`svg-icon-btech-${props.variant}-500`"
    >
      <inline-svg :src="`media/icons/bumaau/${props.variant}.svg`" />
    </span>
    <!--end::Icon-->

    <!--begin::Content-->
    <div
      class="d-flex flex-column pe-0 pe-sm-10"
      :class="`text-btech-${props.variant}-800`"
    >
      <span class="alert-desc">
        {{ props.desc }}
      </span>
    </div>
    <!--end::Content-->

    <!--begin::Close-->
    <span
      class="svg-icon svg-icon-4 ms-auto close-alert"
      :class="`svg-icon-btech-${props.variant}-800`"
      @click="emitShow('update:showAlert', false)"
    >
      <inline-svg src="/media/icons/bumaau/close.svg" />
    </span>
    <!--end::Close-->
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  defineEmits
} from "vue";

const props = defineProps({
  showAlert: {
    type: Boolean,
    default: false,
  },
  variant: {
    required: true,
    type: String,
  },
  desc: {
    required: true,
    type: String,
  },
});
const emitShow = defineEmits(["update:showAlert"]);
</script>

<style scoped lang="scss">
@import "@/assets/sass/core/components/mixins/_typography.scss";

.alert-desc {
  @include paragraph-sm();
}
.close-alert {
  cursor: pointer;
}
</style>
