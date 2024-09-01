<template>
  <div class="mt-5 ps-0">
    <div class="row vcp mx-0 py-4 d-flex justify-content-between risk-assessment-title">
      <div class="col title ps-6">Take photo of completed Pre-Task Risk Assessment Form <span class="text-danger">(required)</span></div>
      <div class="col-2 col-md-1">
        <div class="row justify-content-center">
        <template v-if="imageValues && imageValues.length > 0">
          <div class="col-6 ps-0 pe-1">
            <button class="btn btn-sm btn-icon btn-bg-success" @click="handleShowModal" style="background-color: #18AF4A;">
              <label class="text-white">+{{ imageValues.length }}</label>
            </button>
          </div>
        </template>
        </div>
      </div>
    </div>
  </div>
  <ImagePreviewWithTimestamp
  :images="imageValues"
  :visibility="modalVisibility"
  @on-close="handleHideModal" />
</template>

<script lang="ts" setup>
import { useCameraStore } from "@/store/pinia/application/useCameraStore";
import {
  computed,
  defineProps,
  ref,
  PropType
} from "vue";
import { orderBy } from "lodash";
import ImagePreviewWithTimestamp from "@/components/camera/ImagePreviewWithTimestamp.vue";
import { Item } from "@/core/types/entities/dma/e-form/Item";
import {
  sortRiskAssesmentValue
} from "@/core/helpers/string-to-imageinfo-converter";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";

const props = defineProps({
  ready: {
    required: true,
    type: Boolean,
  },
  data: {
    required: true,
    type: Array as PropType<Item[]>
  }
});

const modalVisibility = ref<boolean>(false)

const getPreriskPhoto = () => {
  console.log('call this', props.data)
  let imgArr = [] as any[]
  if (!Array.isArray(props.data[0].value)) return imgArr
  const sorted = sortRiskAssesmentValue(props.data[0].value as any[])
  imgArr = sorted.filter((value, index, self) => {
    return index === self.findIndex((t) => {
      const ct = t.image as ImageInfo
      const cv = value.image as ImageInfo
      return ct.filename === cv.filename
    })
  })
  const final = [] as any[]
  let keys = imgArr.map((i) => {
    return i.updatedBy.id
  })
  keys = [...new Set(keys)]
  keys.forEach((i) => {
    let innerSort = imgArr.filter((f) => {
      return f.updatedBy.id == i
    })
    innerSort = orderBy(innerSort, (s) => {
      return s.updatedDate
    }).slice(0, 2)
    final.push(...innerSort)
  })
  return final
}
const imageValues = computed(() => {
  return getPreriskPhoto()
})

const handleShowModal = () => {
  modalVisibility.value = true
}

const handleHideModal = () => {
  modalVisibility.value = false
}
</script>

<style scoped>
.form-control,
.form-select {
  color: #919eab;
}
.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}
.h-120px {
  height: 120px !important;
}
.title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
}
</style>
