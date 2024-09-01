<template>
  <div class="fv-row">
    <label class="form-label fs-6 fw-bolder text-dark">{{ label }}</label>
    <el-form-item prop="startDate">
      <el-time-picker
        class="w-100"
        v-model="inputValue"
        :placeholder="placeholder"
        :name="name"
        :format="format"
        :valueFormat="valueFormat"
     />
    </el-form-item>
    <div class="fv-plugins-message-container">
      <div class="fv-help-block">
        <ErrorMessage :name="name" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";

export default defineComponent({
  props: {
    value: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    label: {
      required: false,
      type: String,
    },
    placeholder: {
      required: false,
      type: String,
      default: "Select Time"
    },
    format: {
      required: false,
      type: String,
      default: "hh:mm A"
    },
    valueFormat: {
      required: false,
      type: String,
      default: "hh:mm A"
    }
  },
  emits: ["handleChange"],
  setup(props, { emit }) {
    // computeds start
    const inputValue = computed({
      get: () => {
        return props.value;
      },
      set: (val) => {
        if (!val) val = ""
        emit("handleChange", val);
      },
    });
    return {
      inputValue,
    };
  },
});
</script>
