<template>
  <el-dialog
    v-model='isVisible'
    title='Detailed picture'
    width='90%'
    @closed='handleCloseModal()'
    top="2vh"
    @opened="handleOpened"
    destroy-on-close
  >
    <div class="row fullscreen-dialog-image-preview">
      <div class="bg-secondary"></div>
      <el-carousel ref="carousel" indicator-position="none" trigger="click" :height="carouselHeight" :interval="2147483647" arrow="always" @change="onImageChange" loop="false">
        <el-carousel-item v-for="(img) in images" :key="img.imgBlob">
          <img :src='img.url' class='carousel-image' alt="photo" />
        </el-carousel-item>
      </el-carousel>
      <div class="rotate-button" @click="handleRotate">
        <NwImg src="/media/icons/bumaau/rotate.png" width="60" />
      </div>
      <div class="image-carousel-description">
        <div class="description-title">Description</div>
        <div class="description-text"><pre style="font-family: 'Public sans', sans-serif !important; font-size: 12px; text-wrap:unset">{{ imageDesc }}</pre></div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang='ts' setup>
import { KeyValue } from '@/core/types/misc/KeyValue'
import {
  toRef,
  defineProps,
  defineEmits,
  PropType,
  ref,
  watch
} from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { ImageFull } from '@/core/types/entities/dma/ImageInfo'

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    required: true
  },
  images: {
    required: true,
    type: Array as PropType<ImageFull[]>
  },
  newVersion: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['handle-close'])
const isLargeScreen = useMediaQuery('(min-width: 1000px)')
const carousel = ref()
const imageDesc = ref('')
const isVisible = toRef(props, 'visibility')
const keyValues = ref<KeyValue[]>([])
const imageElement = ref<HTMLImageElement>()
const rotateDegres = ref(0)
const loading = ref(false)
const carouselHeight = ref('0px')
const defaultHeight = ref<number>(0)
const defaultWidth = ref<number>(0)
const realHeight = ref<number>(0)
const realWidth = ref<number>(0)
const imageIndex = ref<number>(0)

const handleOpened = async () => {
  rotateDegres.value = 0
  keyValues.value = []
  if (props.images.length < 1) return
  loading.value = true
  carouselHeight.value = '300px'
  window.setTimeout(() => {
    const index = 0
    imageIndex.value = index
    imageDesc.value = decodeURI(props.images[index].description)
    imageElement.value = document.getElementsByClassName('carousel-image')[index] as HTMLImageElement
    realHeight.value = imageElement.value.height
    realWidth.value = imageElement.value.width
    defaultHeight.value = 600
    defaultWidth.value = 600
    if (realWidth.value < 500 && realHeight.value < 250) {
      imageElement.value.style.width = realWidth.value + 'px'
      imageElement.value.style.height = realHeight.value + 'px'
      carouselHeight.value = '300px'
    } else if (realWidth.value > 600 && realHeight.value < 250) {
      imageElement.value.style.width = realWidth.value + 'px'
      imageElement.value.style.height = 'auto'
      carouselHeight.value = '300px'
    } else {
      imageElement.value.style.height = isLargeScreen.value ? '600px' : '450px'
      imageElement.value.style.width = 'auto'
      carouselHeight.value = isLargeScreen.value ? '600px' : '450px'
    }
    loading.value = false
  }, 500)
}
const onImageChange = (index: number) => {
  rotateDegres.value = 0
  imageDesc.value = decodeURI(props.images[index].description)
  imageElement.value = document.getElementsByClassName('carousel-image')[index] as HTMLImageElement
  realHeight.value = imageElement.value.height
  realWidth.value = imageElement.value.width
  imageElement.value.style.transform = `rotate(${rotateDegres.value}deg)`
  if (realWidth.value < 500 && realHeight.value < 250) {
    imageElement.value.style.width = realWidth.value + 'px'
    imageElement.value.style.height = realHeight.value + 'px'
    carouselHeight.value = '300px'
  } else if (realWidth.value > 600 && realHeight.value < 250) {
    imageElement.value.style.width = realWidth.value + 'px'
    imageElement.value.style.height = 'auto'
    carouselHeight.value = '300px'
  } else {
    imageElement.value.style.height = isLargeScreen.value ? '600px' : '450px'
    imageElement.value.style.width = 'auto'
    carouselHeight.value = isLargeScreen.value ? '600px' : '450px'
  }
}
const handleCloseModal = () => {
  keyValues.value = []
  emits('handle-close')
}
const handleRotate = () => {
  if (rotateDegres.value == 360) {
    rotateDegres.value = 0
  }
  rotateDegres.value = rotateDegres.value + 90
  const element = imageElement.value as HTMLImageElement
  if (rotateDegres.value == 90 || rotateDegres.value == 270) {
    resizeWhenRotate(element)
  } else {
    if (realWidth.value < 500 && realHeight.value < 250) {
      element.style.width = realWidth.value + 'px'
      element.style.height = realHeight.value + 'px'
      carouselHeight.value = '300px'
    } else if (realWidth.value > 600 && realHeight.value < 250) {
      element.style.width = realWidth.value + 'px'
      element.style.height = 'auto'
      carouselHeight.value = '300px'
    } else {
      element.style.height = isLargeScreen.value ? '600px' : '450px'
      element.style.width = 'auto'
      carouselHeight.value = isLargeScreen.value ? '600px' : '450px'
    }
  }
  element.style.transform = `rotate(${rotateDegres.value}deg)`
}

const resizeWhenRotate = (element: HTMLImageElement) => {
  const scaleResize = defaultWidth.value / realWidth.value
  element.style.width = `${defaultWidth.value}px`
  element.style.height = `${realHeight.value * scaleResize + 300}px`
  carouselHeight.value = `${realWidth.value * scaleResize + 50}px`
}
watch(isLargeScreen, () => {
  const element = document.getElementsByClassName('carousel-image')[imageIndex.value] as HTMLImageElement
  if (rotateDegres.value == 90 || rotateDegres.value == 270) {
    resizeWhenRotate(element)
  } else {
    if (!element) return
    if (realWidth.value < 500 && realHeight.value < 250) {
      element.style.width = realWidth.value + 'px'
      element.style.height = realHeight.value + 'px'
      carouselHeight.value = '300px'
    } else if (realWidth.value > 600 && realHeight.value < 250) {
      element.style.width = realWidth.value + 'px'
      element.style.height = 'auto'
      carouselHeight.value = '300px'
    } else {
      element.style.height = isLargeScreen.value ? '600px' : '450px'
      element.style.width = 'auto'
      carouselHeight.value = isLargeScreen.value ? '600px' : '450px'
    }
  }
})

</script>

<style lang='scss'>
.carousel-image {
  object-fit: contain;
}
.el-carousel__item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.rotate-button {
  margin-left: auto;
  margin-right: auto;
  bottom: 0;
  text-align: center;
  cursor: pointer;
}
.fullscreen-dialog-image-preview {
  .el-carousel__arrow {
    height: 48px;
    width: 48px;
    background-color: #22b14c;
    opacity: 0.65;
    i {
      color: white;
    }
  }
  .el-carousel__arrow i {
    color: white;
    font-size: 30px;
    font-weight: bolder;
  }
  .image-carousel-description {
    margin-top: 1%;
    .description {
      &-title {
        font-weight: 700;
      }
      &-text {
        min-height: 21px;
      }
    }
  }
}
.circle {
    position: absolute;
    top: 12%;
    left: 12%;
    bottom: 12%;
    right: 12%;
    border-radius: 100%;
    opacity: 0.65;
    &.grey-color {
      background-color: grey;
    }
}
</style>
