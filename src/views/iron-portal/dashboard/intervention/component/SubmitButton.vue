<template>
  <el-button
    v-if="
      formIntervention.interventionHeaderId == 0 ||
      formIntervention.interventionHeaderId == null
    "
    id="submit-button"
    type="success"
    :disabled="formIntervention.interventionExecutionId > 4"
    @click="handleSubmitData"
    v-loading="props.isLoading"
    element-loading-background="#2d2b39b3"
  >
    Submit
  </el-button>
  <el-button
    v-else
    id="revise-button"
    type="success"
    :disabled="
      formIntervention.interventionExecutionId > 4 || !formIntervention.userRevise || (formIntervention.interventionStatus == 'Declined' && props.selectedHeader == 'Declined')
    "
    @click="handleSubmitData"
  >
    Revise
  </el-button>
</template>

<script lang="ts" setup>
const props = defineProps({
  formIntervention: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  },
  selectedHeader: {
    type: String,
    required: false,
  }
});
const emit = defineEmits(["clicked"]);

const handleSubmitData = () => {
  emit("clicked");
};
</script>
