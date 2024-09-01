<template>
  <div class="p-2 check-truck-info d-flex">
    <div class="form-check p-0 icon">
      <img :src="image" class="img-fluid" v-loading="loading" />
    </div>
    <div class="form-check text ps-6">
      <span v-html="itemRef.value"></span>
    </div>
  </div>
</template>

<script lang='ts' setup>
import {
  defineProps,
  PropType,
  toRef,
  onBeforeMount,
  ref
} from 'vue'
import { Item } from '@/core/types/entities/dma/e-form/Item'
import { AxiosResponse } from 'axios';
import ApiService from '@/core/services/ApiService';

const props = defineProps({
  item: {
    required: true,
    type: Object as PropType<Item>
  },
})

const itemRef = toRef(props, 'item')
const loading = ref<boolean>(true)
const image = ref('')

onBeforeMount(async () => {
  if (itemRef.value.icon) {
    const params = {
      id: itemRef.value.icon.value,
      ver: 'v1',
    }
    try {
      const GET_IMAGE_API_URL = `${process.env.VUE_APP_BASE_URL_DIGITAL}/utility/api/master_attachment/download_by_id`
      const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL, "", new URLSearchParams(params).toString())
      const buffer = response.data;
      const blob = new Blob([buffer]);
      const urlCreator = window.URL || window.webkitURL
      image.value = urlCreator.createObjectURL(blob)
      loading.value = false
    } catch (error) {
      loading.value = false
    }
  }
})

</script>

<style lang="scss" scoped>
.check-truck-info {
  .text {
    font-size: 14px;
    line-height: 20px;
    color: #212B36;
  }
}
</style>
