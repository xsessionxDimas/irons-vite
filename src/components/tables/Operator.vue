<template>
  <div class="d-flex">
    <div class="d-flex align-items-center">
      <!--begin::Avatar-->
      <div class="symbol symbol-40px me-3 symbol-circle">
        <div
          :class="getCircleBackColor"
          class="symbol-label fs-2 fw-bold text-inverse-info text-uppercase"
        >
          {{ operatorInitial }}
        </div>
      </div>
      <!--end::Avatar-->
      <!--begin::Text-->
      <div class="flex-grow-1">
        <a href="#" class="text-dark text-hover-primary fs-6">{{ name }}</a>
        <span class="text-muted d-block">{{ id }}</span>
      </div>
      <!--end::Text-->
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent
} from "vue"
import {
  generateRandomColorClass
} from "@/core/helpers/color-class-extractor"

export default defineComponent({
  props: {
    operatorInitial: {
      required: false,
      default: "",
    },
    name: {
      required: true,
      default: "",
    },
    id: {
      required: false,
      default: "",
    },
  },
  setup() {
    const getCircleBackColor = computed(() => {
      return `bg-${generateRandomColorClass()}`
    })

    return {
      getCircleBackColor,
    }
  },
})
</script>
