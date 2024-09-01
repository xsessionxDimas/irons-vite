<template>
  <el-dialog
    v-model="isVisible"
    title="Detailed picture"
    width="80%"
    @close="handleCloseModal()">
    <template v-if="isLoading">
      <div class="text-center">
        <div v-loading="isLoading" style="height: 100px"></div>
      </div>
    </template>
    <template v-else>
      <div class="row my-4">
        <div v-for="(img) in a" :key="img.imgBlob" class="col-md-3 fv-row fv-plugins-icon-container p-2 rounded position-relative">
          <img :src="img.url" class="w-100 rounded" style="height: 200px; object-fit: fill" />
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  toRef,
  defineProps,
  defineEmits,
  computed,
  ref,
  onMounted,
  watch,
  PropType
} from "vue";
import { AxiosResponse } from "axios";
import ApiService from "@/core/services/ApiService";
import { Image } from "@/core/types/misc/Image";
import { cloneDeep } from "lodash";

const props = defineProps({
  visibility: {
    type: Boolean,
    default: false,
  },
  images: {
    type: Array as PropType<Image[]>
  }
});
const emits = defineEmits(["handle-close", 'handle-delete']);
const isLoading = ref(false);

/* refs*/
const isVisible = toRef(props, "visibility");

const imagesArr = computed(() => {
  return cloneDeep(props.images) as Array<Image>;
});

const imageUrls = ref([] as string[]);

const getUrl = async () => {
  imagesObject();
  isLoading.value = true;
  imageUrls.value = [];
  if (imagesArr.value?.length > 0) {
    let imgCount = 0;
    a.value.forEach(async (img: Image) => {
      const params = {
        fileUrl: `${img.fileName}`,
        ver: 'v1'
      };
      try {
        const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/attachment/download_by_url?${new URLSearchParams(params).toString()}`;
        const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL);
        const buffer = response.data;
        const blob = new Blob([buffer]);
        const urlCreator = window.URL || window.webkitURL;
        img.url = urlCreator.createObjectURL(blob);
        imgCount++;
        if (imgCount == imagesArr.value?.length) isLoading.value = false;
      } catch (error) {
        console.log('image', error);
      }
    });
  }
}

const a = ref([]) as any;

const imagesObject = (() => {
  const imgsProps = props.images;
  a.value = imgsProps;
});

onMounted(async () => {
  getUrl();
});

watch(imagesArr, async (newVal, oldVal) => {
  if (newVal?.length == 0) handleCloseModal()
  if (newVal?.length != oldVal?.length) {
    await getUrl();
  }
}, { deep: true });

/* handlers */
const handleCloseModal = () => {
  emits("handle-close", false);
};
</script>

<style lang="scss">
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
