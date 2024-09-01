<template>
  <el-dialog
    v-model='isVisible'
    title='Preview Media'
    width='90%'
    @closed='handleCloseModal()'
    top="2vh"
    @opened="handleOpened"
    destroy-on-close
  >
    <div class="row fullscreen-dialog-image-preview">
      <div class="bg-secondary"></div>
      <img :src="url || ''" alt="photo" />
    </div>
    <div class="image-carousel-description">
      <div class="description-title">Description</div>
      <div class="description-text"><pre style="font-family: 'Public sans', sans-serif !important; font-size: 12px; text-wrap:unset">{{ data.Description }}</pre></div>
    </div>
  </el-dialog>
</template>

<script lang='ts' setup>
import {
  toRef,
  defineProps,
  defineEmits,
  PropType,
  ref,
} from 'vue'
import {
  ListItem,
} from "@/core/types/entities/iron-lake/media-library/ListItem";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
  url: {
    required: true,
    type: String
  },
  data: {
    required: true,
    type: Object as PropType<ListItem>
  },
})
const emits = defineEmits(['handleCloseModal'])
const isVisible = toRef(props, 'visibility')
const rotateDegres = ref(0)

const handleOpened = async () => {
  rotateDegres.value = 0
}
const handleCloseModal = () => {
  emits('handleCloseModal')
}
</script>
