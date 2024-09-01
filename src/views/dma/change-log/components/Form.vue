<template>
<el-dialog
    v-model="dialogVisible"
    width="90%"
    center
    @closed="onFormClosed"
    :destroy-on-close="true">
    <template #title>
      <span class="el-dialog__title">Version Document Generator</span>
    </template>
</el-dialog>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  toRef
} from 'vue';

const props = defineProps({
  visibility: {
    required: true,
    type: Boolean
  }
})

const emits = defineEmits(["closeForm"])

const onFormClosed = () => {
  emits("closeForm")
}

const dialogVisible = toRef(props, "visibility")
</script>
