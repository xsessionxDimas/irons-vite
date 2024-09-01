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
import {
  useOnline
} from '@vueuse/core'
import {
  getImageFromAPI,
  getReferenceUrlFromLocalDB,
  handleReplaceImageToLocalDB
} from '@/core/helpers/ironforms/offline/reference-file'
import {
  useGeneralFormStore
} from '@/store/pinia/dma/e-form-offline/useGeneralFormStore'
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

const props = defineProps({
  item: {
    required: true,
    type: Object as PropType<Item>
  },
})

const itemRef = toRef(props, 'item')
const loading = ref<boolean>(true)
const image = ref('')
const online = useOnline()
const generalStore = useGeneralFormStore()

onBeforeMount(async () => {
  if (itemRef.value.icon) {
    const params = {
      id: itemRef.value.icon.value,
      ver: 'v1',
    }
    try {
      const urlCreator = window.URL || window.webkitURL
      let url = ""
      if (!isOfflineOrSlowInternetConnection()) {
        const blob = await getImageFromAPI(itemRef.value.icon.value)
        url = urlCreator.createObjectURL(blob)
        // dump image
        handleReplaceImageToLocalDB(
          itemRef.value.icon.value,
          generalStore.stateGeneralForm.workOrder,
          blob,
          itemRef.value.key,
          'task',
          generalStore.eformStore.employee.id
        )
      } else {
        url = await getReferenceUrlFromLocalDB(itemRef.value.icon.value)
      }
      image.value = url
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
