<template>
   <div class="fv-row">
    <!--begin::Label-->
    <label class="form-label fs-6 fw-bolder text-dark">{{ label }}</label>
    <!--end::Label-->

    <!--begin::Input-->
    <slot />
    <!--end::Input-->
    <div class="fv-plugins-message-container">
      <div class="fv-help-block">
        <ErrorMessage :name="name" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ErrorMessage } from "vee-validate"

export default defineComponent({
  components: {
    ErrorMessage
  },
  props: {
    name: {
      required: true,
      type: String
    },
    label: {
      required: false,
      type: String
    }
  }
})
</script>
