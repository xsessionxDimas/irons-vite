<template>
  <div class="report mb-4">
    <div class="report_section_header">
      <h4 class="title ps-3">Take photo of completed Pre-Task Risk Assessment Form <span class="text-danger">(required)</span></h4>
    </div>
    <div class="report_body" v-if="riskData">
      <template v-for="risk in riskPhotos" :key="(risk.image as ImageInfo).filename">
        <div class="my-1 rounded avoid prevent-split" style="border: 1px solid rgba(145, 158, 171, 0.32)">
            <div class="p-2 d-flex">
                <!-- images -->
                <div class="d-flex flex-column">
                  <span style="font-size: 11px; font-weight: 5000;">{{ imageTypeGenerator(risk.updatedBy.id, (risk.image as ImageInfo).filename) }}</span>
                  <div class="d-flex justify-content-center">
                  <Image :img="(risk.image as ImageInfo).filename" :pre-risk="true" />
                  </div>
                  <div class="image-carousel-description" style="text-align: left">
                    <div class="description-title">Description</div>
                    <div class="description-text"><pre style="font-family: 'Public sans', serif !important; font-size: 14px">{{ decodeURI((risk.image as ImageInfo).description) }}</pre></div>
                  </div>
                </div>
            </div>
            <span style="font-size: 11px; display: block; text-align: right;">{{ `${risk.updatedBy.name}, ${risk.updatedDate}` }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  defineProps,
  PropType,
  watch,
} from "vue";
import { Item } from "@/core/types/entities/dma/e-form/Item";
import { AxiosResponse } from "axios";
import ApiService from "@/core/services/ApiService";
import {
  useHistoricalEformDmaStore
} from "@/store/pinia/report/history/dma/useHistoricalEformDmaStore";
import { ImageInfo } from "@/core/types/entities/dma/ImageInfo";
import Image from "../component/Image.vue";
import {
  RiskAssesmentValue
} from "@/core/types/intervention/RiskAssesmentValue";
import { orderBy } from "lodash";

const historicalStore = useHistoricalEformDmaStore();

const riskPhotos = ref<RiskAssesmentValue[]>([])
const downloadedFile = ref<string[]>([])

const props = defineProps({
  data: {
    required: true,
    type: Array as PropType<Item[]>,
  },
});

const riskData = computed(() => {
  return props.data;
})

const loadImage = async (filename: string) => {
  if (downloadedFile.value.includes(filename)) return
  downloadedFile.value.push(filename)
  const params = {
    fileUrl: `${filename}`,
    ver: 'v1',
  }
  try {
    const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/${import.meta.env.VITE_APP_API_AM_DMA}/api/attachment/download_by_url?${new URLSearchParams(params).toString()}`
    await ApiService.getBlob(GET_IMAGE_API_URL)
    const response: AxiosResponse<Blob> = await ApiService.getBlob(GET_IMAGE_API_URL)
    const buffer = response.data;
    const blob = new Blob([buffer]);
    const urlCreator = window.URL || window.webkitURL
    historicalStore.setImageList({
      id: filename,
      buffer: urlCreator.createObjectURL(blob)
    })
  } catch (e) {
    console.log(e);
  }
}

const imageTypeGenerator = (fitterId: string, filename: string) => {
  let photos = riskPhotos.value.filter((x) => {
    return x.updatedBy.id == fitterId
  })
  photos = orderBy(photos,
    ['imageType', 'updatedDate'])
  const index = photos.findIndex((x) => {
    return (x.image as ImageInfo).filename == filename
  })
  return index == 0 ? "Front Page" : "Back Page"
}

const riskAssesmentValueConverter = (oldValues: RiskAssesmentValue[]) => {
  if (!oldValues) {
    return [] as RiskAssesmentValue[]
  }
  const convertedValue = [] as RiskAssesmentValue[]
  oldValues.forEach((data) => {
    if (typeof data.image == 'string') {
      data.image = {
        filename: data.image,
        description: data.image.includes('^') ? data.image.split('^')[1] : ''
      }
    }
    convertedValue.push(data)
  })
  return convertedValue
}

const sortRiskAssesmentValue = (data: RiskAssesmentValue[]) => {
  return orderBy(data, [
    (row) => {
      return row.updatedBy.name
    },
    (row) => {
      return row.updatedDate
    }
  ], ['asc', 'desc'])
}

watch(
  () => {
    return riskData.value;
  },
  async () => {
    downloadedFile.value = []
    riskPhotos.value = [] as RiskAssesmentValue[]
    if (riskData.value && riskData.value.length > 0) {
      if (Array.isArray(props.data[0].value)) {
        const risks = props.data[0].value as any[]
        let images = riskAssesmentValueConverter(risks)
        images = sortRiskAssesmentValue(images)
        const final = [] as RiskAssesmentValue[]
        let keys = images.map((i) => {
          return i.updatedBy.id
        })
        keys = [...new Set(keys)]
        keys.forEach((i) => {
          let innerSort = images.filter((f) => {
            return f.updatedBy.id == i
          })
          innerSort = orderBy(innerSort, (s) => {
            return s.updatedDate
          }).slice(0, 2)
          final.push(...innerSort)
        })
        riskPhotos.value = final
      }
      console.log(riskPhotos.value)
      for (let i = 0; i < riskPhotos.value.length; i++) {
        console.log('start index', i)
        await loadImage((riskPhotos.value[i].image as ImageInfo).filename)
        console.log('finish index', i)
      }
    }
  },
  {
    deep: true
  }
);
</script>
<style lang="scss" scoped>
.title {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
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
</style>
