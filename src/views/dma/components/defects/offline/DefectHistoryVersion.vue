<template>
  <div class="d-flex justify-content-between">
    <div>
        <span>View version</span>
    </div>
    <div>
        <el-select
            v-model="value"
            placeholder="Select"
            size="large"
            style="width: 400px"
            @change="changeVersion"
            >
            <el-option
                v-for="date in versionDates"
                :key="date"
                :label="date"
                :value="date"
            />
        </el-select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ChangeDefectVersionParam
} from '@/views/dma/e-form-offline/types/ChangeDefectVersionParam'
import {
  ref,
  defineProps,
  defineEmits,
  defineExpose,
  PropType
} from 'vue'

const props = defineProps({
  versionDates: {
    required: true,
    type: Object as PropType<string[]>
  },
})

const value = ref(props.versionDates[0] ?? '')

// eslint-disable-next-line func-call-spacing
const emits = defineEmits<{
    (event: 'change-version', param: ChangeDefectVersionParam): void
  }>()

const changeVersion = (value: string) => {
  emits('change-version', {
    versionDate: value,
    callback: undefined
  })
}

const resetToLatest = () => {
  value.value = props.versionDates[0]
  emits('change-version', {
    versionDate: props.versionDates[0],
    callback: undefined
  })
}

defineExpose({
  resetToLatest
})

</script>
