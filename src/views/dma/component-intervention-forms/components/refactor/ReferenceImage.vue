<template>
  <div :class="[widthStyle, paddingBottomCondition]" class="pt-2 px-2 d-flex d-flex justify-content-center" v-loading="loading">
    <img :src="image" class="img-fluid" :style="imageStyle"/>
  </div>
</template>

<script lang="ts" setup>
import {
  getImageFromAPI,
  getReferenceUrlFromLocalDB,
  handleReplaceImageToLocalDB,
  getReferenceDataFromLocalDB
} from '@/core/helpers/ironforms/offline/reference-file';
import ApiService from '@/core/services/ApiService'
import { Reference } from '@/core/types/intervention/Reference'
import {
  ReferenceItemDetail
} from '@/core/types/intervention/ReferenceItemDetail'
import { TaskReference } from '@/database/schema/TaskReferences'
import { computed } from '@vue/reactivity'
import { useOnline } from '@vueuse/core'
import { AxiosResponse } from 'axios'
import { isEmpty } from 'lodash'
import {
  defineProps,
  onBeforeMount,
  PropType,
  ref
} from 'vue'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

const props = defineProps({
  item: {
    type: Object as PropType<ReferenceItemDetail>,
    required: true
  },
  generalStyle: {
    type: Boolean,
    default: true
  },
  reference: {
    type: Object as PropType<Reference>,
    required: true
  },
})

const online = useOnline()

const image = ref<string>('/media/svg/dma/warning.svg')
const loading = ref<boolean>(true)
const widthStyle = computed(() => {
  return props.item.style && props.item.style.breakPoint != 'none' ? `col-${props.item.style.breakPoint}` : "col"
})
const imageStyle = computed(() => {
  if (props.item.style && props.item.style.breakPoint == '1') {
    return 'width: 20px; height: 20px'
  }
  return ''
})
onBeforeMount(async () => {
  const params = {
    id: props.item.value.toString(),
    ver: 'v1',
  }
  try {
    const itemVal = props.item.value
    const urlCreator = window.URL || window.webkitURL
    if (!isOfflineOrSlowInternetConnection()) {
      let getNewImage = true
      const localAsset = await getReferenceDataFromLocalDB(itemVal) as TaskReference
      if (!isEmpty(localAsset)) {
        if (localAsset.createdDate) {
          const currentDate = new Date()
          const createdDate = localAsset.createdDate
          const timeDiff = currentDate.getTime() - createdDate.getTime()
          const dayDiff = timeDiff / (1000 * 60 * 60 * 24)
          if (dayDiff < 1) {
            getNewImage = false
          }
        }
      }
      if (getNewImage) {
        const blob = await getImageFromAPI(itemVal)
        image.value = urlCreator.createObjectURL(blob)
        // dump image
        handleReplaceImageToLocalDB(itemVal, "", blob)
      } else {
        image.value = await getReferenceUrlFromLocalDB(itemVal)
      }
    } else {
      image.value = await getReferenceUrlFromLocalDB(itemVal)
    }
    loading.value = false
  } catch (error) {
    loading.value = false
  }
})
const paddingBottomCondition = computed(() => {
  return "pb-2"
})
</script>
