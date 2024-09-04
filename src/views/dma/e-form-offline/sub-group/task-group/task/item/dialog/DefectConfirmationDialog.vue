<template>
  <el-dialog
    v-model="showDialog"
    title="Does the defect identified require"
    custom-class="defect-requires-dialog"
    :width="dialogSize"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="30vh" :center="true" @closed="onFormClosed">
    <div class="row pt-3 pb-3 text-dark modal-title">
      <div class="p-3 m-1 d-flex">
        <div class="form-check">
            <input class="form-check-input" type="radio" v-model="type" value="Less than 30 minutes labour and less than $250 in parts" />
        </div>
        <div class="d-flex flex-column">
          <div><span><b>Less than</b> 30 minutes labour <b><u>and</u> less than</b> $250 in parts</span></div>
        </div>
      </div>
      <div class="p-3 m-1 d-flex">
        <div class="form-check">
            <input class="form-check-input" type="radio" v-model="type" value="More than 30 minutes labour and less than $250 in parts" />
        </div>
        <div class="d-flex flex-column">
          <div><span><b>More than</b> 30 minutes labour <b><u>and</u> less than</b> $250 in parts</span></div>
        </div>
      </div>
      <div class="p-3 m-1 d-flex">
        <div class="form-check">
            <input class="form-check-input" type="radio" v-model="type" value="More than 30 minutes labour and more than $250 in parts" />
        </div>
        <div class="d-flex flex-column">
          <div><span><b>More than</b> 30 minutes labour <b><u>and</u> more than</b> $250 in parts</span></div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer" style="display:block; text-align:right">
        <el-button @click="handleClose" style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2)">Cancel</el-button>
        <el-button class="button-OK-confirmation" type="success" @click.prevent="handleSubmit" style="background:#18AF4A; box-shadow: 0px 8px 16px rgba(0, 171, 85, 0.24); color: white">Submit</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from '@vue/reactivity';
import { defineProps, defineEmits } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { TypeEmitParam } from '../../../../../../../../views/dma/e-form-offline/types/TypeEmitParam';

const props = defineProps(['show']);

// eslint-disable-next-line func-call-spacing
const emits = defineEmits<{
  (event: 'close'): void
  (event: 'submit', params: TypeEmitParam): void
}>()

const type = ref('Less than 30 minutes labour and less than $250 in parts')

const isLargeScreen = useMediaQuery('(min-width: 1100px)')
const isSmallScreen = useMediaQuery('(min-width: 767px) and (max-width: 900px)')

const dialogSize = computed(() => {
  return isSmallScreen.value ? "70%" : isLargeScreen.value ? "40%" : "55%";
});

const handleSubmit = () => {
  emits('submit', {
    type: type.value,
    callback: undefined
  })
}

const showDialog = computed(() => {
  return props.show
});
const handleClose = () => {
  emits("close")
}

const onFormClosed = () => {
  type.value = 'Less than 30 minutes labour and less than $250 in parts';
};
</script>
<style lang="scss">
@import "@/assets/sass/pages/defect.form.scss";
.defect-requires-dialog {
  span {
        font-size: 1.2rem;
    }
    .el-dialog__title {
        font-size: 18px  !important;
        font-weight: 800  !important;
    }
}
</style>
