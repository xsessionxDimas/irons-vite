<template>
  <div
    class="
      alert alert-dismissible alert-danger
      bg-light-danger
      d-flex
      flex-column flex-sm-row
      w-100
      p-5
      mb-5
    "
  >
    <div class="icon mb-4">
      <img src="/media/icons/bumaau/danger.png" width="64" height="64" alt="warning" />
    </div>
    <div class="d-flex flex-column text-danger pe-0 pe-sm-10">
      <h4 class="mb-2 text-danger">{{ alertTitle }}</h4>
      <ul>
        <li v-for="(item, index) in alertMessages" :key="index">
          <p class="m-0" style="word-break: normal;">{{ item }}</p>
        </li>
      </ul>
    </div>
    <button
      type="button"
      class="
        position-absolute position-sm-relative
        m-2 m-sm-0
        top-0
        end-0
        btn btn-icon
        ms-sm-auto
      "
      @click="handleClose"
    >
      <span class="svg-icon svg-icon-2x svg-icon-danger">
        <inline-svg src="/media/icons/duotune/arrows/arr061.svg" />
      </span>
    </button>
    <!--end::Close-->
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    errorMessages: {
      type: Array,
      default: () => {
        return [];
      },
    },
    messageTitle: {
      type: String,
      default: "Error in Input Field",
    },
  },
  emits: ["resetForm"],
  setup(props, { emit }) {
    // computeds start
    const alertTitle = computed(() => {
      return props.messageTitle;
    });
    const alertMessages = computed(() => {
      return props.errorMessages;
    });

    // methods start
    const handleClose = () => {
      emit("resetForm");
    };
    return { alertTitle, alertMessages, handleClose };
  },
});
</script>

