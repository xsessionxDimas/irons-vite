<template>
    <div class="p-2 px-4 rounded-pill" style="background:#F9FAFB" v-if="visibility">
        <div class="d-flex align-items-center">
            <div class="flex-fill">
                <h4 class="mb-0">Service Duration Timer - {{ clock }}</h4>
            </div>
            <div>
                <template v-if="isStarted">
                    <button :disabled="isDisabled" class="btn btn-danger" @click="stopTimer">Finish</button>
                </template>
                <template v-else>
                    <!-- init -->
                    <!-- <button class="btn btn-danger" disabled>Stop</button> -->
                    <button :disabled="isDisabled" class="btn btn-danger" @click="stopTimer">Finish</button>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  defineEmits,
  ref,
  defineExpose,
  watch
} from 'vue';
import TimerClass from "@/core/classes/TimerClass";

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean,
  },
  isDisabled: {
    required: true,
    default: false,
  },
  isTimerStopped: {
    required: true,
    default: false
  }
})

const timer = ref(new TimerClass());
const clock = computed(() => {
  emits("onChange", timer.value.clock);
  return timer.value.clock;
});

const isTimerStop = computed(() => {
  return props.isTimerStopped
})

const emits = defineEmits(["onStart", "onChange", "onStop"]);
const isStarted = ref(false);

const continueTimer = () => {
  isStarted.value = true;
  timer.value.continue();
  emits("onStart", timer.value.clock);
}

const startTimer = () => {
  isStarted.value = true;
  timer.value.start();
  emits("onStart", timer.value.clock);
}
const stopTimer = () => {
  emits("onStop", timer.value.clock);
}

watch(isTimerStop, (newVal, oldVal) => {
  if (newVal) {
    isStarted.value = false;
    timer.value.stop();
  }
})

defineExpose({
  startTimer,
  timer,
  continueTimer
});
</script>

<style scoped>
    .btn-success {
        background-color: #18AF4A;
    }
</style>
