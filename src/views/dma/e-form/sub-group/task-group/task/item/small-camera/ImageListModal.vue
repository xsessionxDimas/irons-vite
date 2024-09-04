<template>
  <el-dialog
    v-model='isVisible'
    title='Detailed picture'
    width='80%'
    @close='handleCloseModal()'
  >
    <template v-if='isLoading'>
      <div class='text-center'>
        <div v-loading='isLoading' style='height: 100px'></div>
        <span v-if='isDeleteImage'>deleting image...</span>
      </div>
    </template>
    <template v-else>
      <div class='row my-4'>
        <div v-for='(img, index) in a' :key='img.imgBlob' class='col-md-3 fv-row fv-plugins-icon-container p-2 rounded position-relative'>
          <div class="bg-secondary">
            <img :src='img.url' class='w-100 rounded' style='height: 200px; object-fit: contain' @click="handleShowFullScreen(img.imgBlob)"/>
            <template v-if='showDeleteButton'>
              <inline-svg  @click='confirmDeleteButton(index)' class='delete-image-button' src='/media/svg/dma/image-close-button-red.svg' />
            </template>
          </div>
        </div>
      </div>
      <template v-if="showRemainingPhotosMessage">
        <div class="row mt-7 mb-0">
          <h5 style="font-size: 15px; font-weight: 900" class="font-weight-bold text-dark">Mandatory to keep at least one photo as an evidence.</h5>
        </div>
      </template>
    </template>
  </el-dialog>
  <Confirmation :visibility='DeleteConfirmation' caption='Are you sure want to delete this image?'
    @on-no-confirm='cancelDelete'
    @on-yes-confirm='confirmDelete' />
  <template v-if="showFullImage">
    <FullScreenDialog
    :images="(images as string[])"
    :visibility="showFullImage"
    :image="fullImageShowed"
    @handle-close="closeFullScreenImage"/>
  </template>
</template>

<script lang='ts' setup>
import {
  toRef,
  defineProps,
  defineEmits,
  computed,
  ref,
  onMounted,
  watch,
  PropType
} from 'vue';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import ApiService from '@/core/services/ApiService';
import { cloneDeep } from 'lodash';
import Confirmation from '@/components/dialog/Confirmation.vue';
import FullScreenDialog from '@/components/camera/FullScreenDialog.vue';
import { ImageInfo } from '@/core/types/entities/dma/ImageInfo';

/* stores */
const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
  images: {
    type: Array as PropType<string[]|ImageInfo[]>
  },
  showDeleteButton: {
    type: Boolean,
    default: true
  },
  showRemainingPhotosMessage: {
    default: false,
    type: Boolean
  }
});
const emits = defineEmits(['handle-close', 'handle-delete']);
const isLoading = ref(false)
const showFullImage = ref(false)
const fullImageShowed = ref("")

const handleShowFullScreen = (image) => {
  const index = a.value.findIndex((item) => {
    return item.imgBlob == image
  })
  const imageInfo = a.value[index]
  if (index > 0) {
    const front = a.value.slice(index)
    const back = a.value.slice(0, index)
    a.value = [...front, ...back]
  }
  fullImageShowed.value = imageInfo.url
  showFullImage.value = true
}

const closeFullScreenImage = () => {
  fullImageShowed.value = ""
  showFullImage.value = false
}

/* refs*/
const isVisible = toRef(props, 'visibility');

const imagesArr = computed(() => {
  return cloneDeep(props.images) as Array<any>
})

const imageUrls = ref([] as string[])
const DeleteConfirmation = ref(false)
const selectedImage = ref('')
const isDeleteImage = ref(false)

const getUrl = async () => {
  imagesObject()
  isLoading.value = true
  imageUrls.value = []
  if (imagesArr.value?.length > 0) {
    let imgCount = 0
    a.value.forEach(async (img) => {
      const params = {
        fileUrl: `${img.imgBlob}`,
        ver: 'v1',
      }
      try {
        const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/attachment/download_by_url?${new URLSearchParams(params).toString()}`
        const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL)
        const buffer = response.data;
        const blob = new Blob([buffer]);
        const urlCreator = window.URL || window.webkitURL
        img.url = urlCreator.createObjectURL(blob)
        imgCount++
        if (imgCount == imagesArr.value?.length) isLoading.value = false
      } catch (error) {
        console.log('image', error);
      }
    })
  }
}

const a = ref([]) as any

const imagesObject = (() => {
  const imgsProps = props.images
  a.value = imgsProps?.map((img) => {
    return {
      imgBlob: img.filename as string,
      url: ''
    }
  })
})

const confirmDeleteButton = (index) => {
  if (!props.images || props.images.length == 0) return;
  selectedImage.value = props.images[index] as string;
  DeleteConfirmation.value = true
}

const cancelDelete = () => {
  DeleteConfirmation.value = false
}

const confirmDelete = () => {
  DeleteConfirmation.value = false
  deleteImage()
}

const deleteImage = async () => {
  const params = {
    ver: 'v1',
    fileUrl: selectedImage.value
  }
  const body = { }
  const DELETE_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/attachment/delete_by_url?${new URLSearchParams(params).toString()}`
  try {
    isLoading.value = true
    isDeleteImage.value = true
    await ApiService.post(`${DELETE_IMAGE_API_URL}`, body as AxiosRequestConfig)
    // remove image key from the array
    emits('handle-delete', selectedImage.value)
  } catch (error) {
    console.log('delete image', error);
  } finally {
    isLoading.value = false
    isDeleteImage.value = false
    if (props.images?.length == 0) handleCloseModal()
  }
}

onMounted(async () => {
  getUrl()
})

watch(imagesArr, async (newVal, oldVal) => {
  if (newVal?.length == 0) handleCloseModal()
  if (newVal?.length != oldVal?.length) {
    await getUrl()
  }
}, { deep: true })

/* handlers */
const handleCloseModal = () => {
  emits('handle-close', false);
};
</script>

<style lang='scss'>
.delete-image-button {
  position: absolute;
  height: 24px;
  width: 24px;
  top: 5%;
  right: 5%;

  :hover {
    cursor: pointer;
  }
}
</style>
