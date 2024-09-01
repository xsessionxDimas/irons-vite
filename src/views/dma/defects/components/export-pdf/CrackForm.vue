<template>
  <div class="hiddenContainer" v-if="!isEmpty(data)">
    <pdfexport ref="contentToExport">
      <div :id="id" class="defect-review-eform">
        <div class="report-header mb-2">
          <div class="el-dialog__title avoid prevent-split">
            Detailed Information for Crack Identification
          </div>
          <div class="el-dialog__title task-title avoid prevent-split" v-html="displayDesc(data.title)"></div>
          <div class="el-dialog__title task-title download-by avoid prevent-split">Downloaded by {{ timeStamp }}</div>
        </div>
        <div class="mt-1 py-2">
          <div class="row mb-1">
            <div class="col">
              <div class="form-floating approved-text-box" v-if="approvalData.approvedBy && approvalData.approvedDate">
                  <div class="form-control" style="white-space:break-spaces;">{{ approvalData.approvedDate }} — {{ approvalData.approvedBy.name }}</div>
                  <label>Approved</label>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-between">
          <div class="d-flex flex-row flex-grow-1 prevent-split">
            <div class="flex-fill">
              <div class="form-floating">
                <div type="text" class="form-control asset-number-disabled-div" v-html="data.assetNumber"></div>
                <label for="floatingInput">Asset Number</label>
              </div>
            </div>
            <div class="flex-fill ps-3">
              <div class="form-floating">
                <div type="text" class="form-control asset-number-disabled-div" v-html="serialNumber"></div>
                <label for="floatingInput">Serial Number</label>
              </div>
            </div>
            <div class="flex-fill ps-3">
              <div class="form-floating">
                <div type="text" class="form-control asset-number-disabled-div" v-html="formatOwnershipHTML"></div>
                <label for="floatingInput">Ownership</label>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2"></div>
        <div class="report task-group general-accordion py-1 px-5">
          <div class="avoid prevent-split">
            <h4 class="title ps-3">Photo of the crack identified (optional)</h4>
          </div>
          <div class="report_section_body">
            <template v-for="image in images" :key="image.id">
                <div class="my-1 d-flex justify-content-between avoid w-100">
                    <div class="p-2 d-flex">
                        <!-- images -->
                        <div class="d-flex flex-column">
                          <img :src="image.buffer" class="report_section_body--image" :style="image.dimension ? `height: ${image.dimension.height}px; width: ${image.dimension.width}px;`: ''" :alt="image.id">
                        <div class="image-carousel-description">
                            <div class="description-title">Description</div>
                            <div class="description-text">
                              <pre style="font-family: 'Public sans' !important; font-size: 14px;word-break: break-word;white-space: break-spaces;">{{ decodeURIComponent(image.desc) }}</pre>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </template>
          </div>
        </div>
        <!-- Reference Photo Crack -->
        <div class="mt-2"></div>
        <div class="report task-group general-accordion py-1 px-5" v-if="!isEmpty(referencePhoto)">
          <div class="report_section_header avoid prevent-split">
            <h4 class="title ps-3">{{ referencePhoto.title }}</h4>
          </div>
          <div class="report_section_body d-flex flex-row justify-content-center align-items-center avoid prevent-split">
            <img class="report_section_body--image" :src="referencePhoto.blob" alt="image" :style="`height: ${referencePhoto.dimension.height}px; width: ${referencePhoto.dimension.width}px;`" />
          </div>
        </div>
        <div class="mt-1 mb-2 avoid prevent-split">
          <div class="desc-wrapper">
            <p class="desc-wrapper-title">Defect Identified Description</p>
            <div class="desc-wrapper-content">
              <pre class="desc-wrapper-content-pre">{{ data.description }}</pre>
            </div>
          </div>
        </div>
        <div class="mt-1 mb-2">
          <div class="pe-0">
              <div class="form-floating" avoid>
                  <input type="text" class="form-control" disabled :value="data.raisedBy">
                  <label>Raised By</label>
              </div>
          </div>
        </div>
        <div class="mt-1 mb-2">
          <div class="row m-0">
            <div class="col-4 p-0 date">
                    <div class="form-floating avoid prevent-split">
                        <input type="text" class="form-control" disabled :value="data.date" />
                        <label>Date Raised</label>
                    </div>
                </div>
                <div class="col pe-0 d-flex">
                    <div class="d-flex flex-column flex-fill">
                      <div class="form-floating avoid prevent-split">
                        <input type="text" class="form-control" :value="formatNumberWithComma(data.plannedDuration)" disabled />
                        <label class="text-nowrap">How long will this crack repair take?</label>
                      </div>
                    </div>
                    <div class="ms-2 d-flex align-items-center">
                      <Label>Hours</Label>
                    </div>
                </div>
          </div>
        </div>
        <div class="mt-1 mb-2 avoid prevent-split">
          <div class="desc-wrapper">
            <p class="desc-wrapper-title">Defect Repair instruction</p>
            <div class="desc-wrapper-content">
              <pre class="desc-wrapper-content-pre">{{ data.instruction }}</pre>
            </div>
          </div>
        </div>
        <div class="mt-2"></div>
        <div class="mt-1 mb-3 px-3 previous-crack-container word-breaker">
          <div class="table-header-background-color p-1 text-center">
              Crack Length
          </div>
          <div class="row table-header-background-color p-1">
              <div class="col">Location</div>
              <div class="col-3">Previous</div>
              <div class="col-3">Current</div>
              <div class="col-1"></div>
          </div>
          <template v-for="(previousCrack, index) in data.previousCracks" :key="index">
              <div class="row my-1 d-flex align-items-center">
              <div class="col">
                  {{ previousCrack.locationId }} {{ previousCrack.locationId ? "." : "" }} Crack Length - {{ previousCrack.locationDesc }}
              </div>
              <div class="col-3">{{ formatNumberInput(previousCrack.previousCrack) }} {{ (previousCrack.previousCrack != '-' ? "mm" : "-") }}</div>
              <div class="col-3">
                  <input type="text" class="form-control" :value="previousCrack.currentCrack" disabled />
              </div>
              <div class="col-1"> mm</div>
              </div>
          </template>
        </div>
        <div class="mt-2"></div>
        <div class="report task-group general-accordion py-1 px-5">
          <div class="report_section_header avoid prevent-split">
            <h4 class="title ps-3">Priority</h4>
          </div>
          <div class="report_section_body">
            <div class="row p-3 m-1 priority-container avoid prevent-split" style="background: #F4F6F8; border-radius: 8px;">
                <div class="col-3">Priority</div>
                <div class="col-6">Action</div>
                <div class="col-3 text-break">Person Responsible</div>
              </div>
              <div class="row p-3 m-1 priority-container avoid prevent-split" v-if="data.priority == 'P1'">
                <div class="col-3 p-0">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="data.priority" value="P1" disabled>
                    <label class="form-check-label">
                      (P1) Immediate
                    </label>
                  </div>
                </div>
                <div class="col-6">Shall shut machine down and undertake repairs.</div>
                <div class="col-3 text-break">Maintenance Supervisor</div>
              </div>
              <div class="row p-3 m-1 priority-container avoid prevent-split" v-else-if="data.priority == 'P2'">
                <div class="col-3 p-0">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="data.priority" value="P2" disabled>
                    <label class="form-check-label">
                      (P2) Urgent
                    </label>
                  </div>
                </div>
                <div class="col-6">Shall complete within 7 days.</div>
                <div class="col-3 text-break">Maintenance Supervisor</div>
              </div>
              <div class="row p-3 m-1 priority-container avoid prevent-split" v-else-if="data.priority == 'P3'">
                <div class="col-3 p-0">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="data.priority" value="P3" disabled>
                    <label class="form-check-label">
                      (P3) Routine
                    </label>
                  </div>
                </div>
                <div class="col-6">Shall complete within 60 days.</div>
                <div class="col-3 text-break">Maintenance Planner</div>
              </div>
              <div class="row p-3 m-1 priority-container avoid prevent-split" v-else-if="data.priority == 'P4'">
                <div class="col-3 p-0">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="data.priority" value="P4" disabled>
                    <label class="form-check-label">
                      (P4) Monitor
                    </label>
                  </div>
                </div>
                <div class="col-6">Shall continue to inspect and monitor for 90 days.</div>
                <div class="col-3 text-break">Maintenance Planner</div>
              </div>
          </div>
        </div>
        <div class="mt-2"></div>
        <div class="report task-group general-accordion py-1 px-5">
          <div class="report_section_header avoid prevent-split">
            <h4 class="title ps-3">Parts Required</h4>
          </div>
          <div class="report_section_body">
            <div class="row p-3 m-1 priority-container avoid prevent-split" style="background: #F4F6F8; border-radius: 8px;">
                <div class="col-3">Part Number</div>
                <div class="col-5">Part Description</div>
                <div class="col-1">Qty</div>
                <div class="col"></div>
                <div class="col"></div>
              </div>
              <div class="row p-3 m-1 priority-container px-0 avoid prevent-split" v-for="(item, index) in data.parts" :key="index">
                <div class="col-3 px-0">
                  <div class="d-flex flex-column">
                    <input type="text" class="form-control" :value="item.partNumber" disabled />
                  </div>
                </div>
                <div class="col-5">
                  <div class="d-flex flex-column">
                    <input type="text" class="form-control" :value="item.partDescription" disabled />
                  </div>
                </div>
                <div class="col-1 px-1 d-flex justify-content-start">
                  <div class="d-flex flex-column">
                    <input class="form-control" :value="formatNumberWithComma(item.qty)" disabled />
                  </div>
                  <div class="ms-4 d-flex align-items-center" :class="index === 0 ? 'hidden' : ''">
                  </div>
                </div>
                <div class="col px-1 d-flex flex-column justify-content-start">
                  <div class="row p-0 m-0 h-100 w-100 align-items-center">
                    <SmallCamera :index="index" :item-value="item.images || []" :is-disabled="true" />
                  </div>
                </div>
                <div class="col px-1 d-flex flex-column justify-content-start position-relative">
                  <div class="row p-0 m-0 h-100 w-100 align-items-center">
                    <UploadAttachment :index="index" :item-value="item.attachment || []" :is-disabled="true"/>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div class="mt-2"></div>
        <div class="report task-group general-accordion py-1 px-5">
          <div class="report_section_header avoid prevent-split">
            <h4 class="title ps-3">Labour Required</h4>
          </div>
          <div class="report_section_body">
            <div class="row p-3 m-1 priority-container avoid prevent-split" style="background: #F4F6F8; border-radius: 8px;">
                <div class="col-6">Labour Activity</div>
                <div class="col-2">Qty</div>
                <div class="col-2 word-breaker">Hours Each</div>
                <div class="col-2 word-breaker">Total Hours</div>
            </div>
            <div class="row p-3 m-1 priority-container ps-0 avoid prevent-split" v-for="(item) in data.labours" :key="item.position">
                <div class="col-6 px-0">
                  <div class="d-flex flex-column">
                    <input type="text" class="form-control" :value="item.position" disabled />
                  </div>
                </div>
                <div class="col-2  d-flex justify-content-start">
                  <div class="d-flex flex-column">
                    <input class="form-control" :value="formatNumberWithComma(item.qty)"
                    disabled />
                  </div>
                </div>
                <div class="col-2 d-flex justify-content-start">
                  <div class="d-flex flex-column">
                    <input class="form-control" :value="formatNumberWithComma(item.hireEach)"
                    disabled />
                  </div>
                </div>
                <div class="col-2 d-flex justify-content-start">
                  <div class="d-flex flex-column">
                    <input class="form-control" :value="formatNumberWithComma(item.totalHours)"
                    disabled />
                  </div>
                </div>
            </div>
          </div>
        </div>
        <div class="mt-2"></div>
        <div class="report task-group general-accordion py-1 px-5">
          <div class="report_section_header avoid prevent-split">
            <h4 class="title ps-3">Other Resources Required (optional)</h4>
          </div>
          <div class="report_section_body">
            <div class="p-2 d-flex" v-for="(item, index) in data.resources" :key="index">
              <div class="d-flex flex-fill flex-column">
                <input type="text" class="form-control avoid prevent-split" :value="item" disabled />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2"></div>
        <div class="report task-group general-accordion py-1 px-5">
          <div class="report_section_header avoid prevent-split">
            <h4 class="title ps-3">Crack Symptom</h4>
          </div>
          <div class="report_section_body">
            <div class="p-2 d-flex" v-for="(item) in data.symptoms" :key="item">
              <div class="d-flex flex-fill flex-column">
                  <input type="text" class="form-control avoid prevent-split" :value="item.split(':')[0]" disabled />
                  <div class="mt-2 avoid prevent-split" v-if="item.split(':')[0] === 'Other'">
                    <div class="desc-wrapper">
                      <p class="desc-wrapper-title">Description</p>
                      <div class="desc-wrapper-content">
                        <pre class="desc-wrapper-content-pre">{{ stringGroupExtractor(item) }}</pre>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2"></div>
        <div class="report task-group general-accordion py-1 px-5">
          <div class="report_section_header avoid prevent-split">
            <h4 class="title ps-3">Crack Cause</h4>
          </div>
          <div class="report_section_body">
            <div class="p-2 d-flex" v-for="(item, index) in data.causes" :key="index">
              <div class="d-flex flex-fill flex-column">
                  <input type="text" class="form-control avoid prevent-split" :value="item.split(':')[0]" disabled />
                  <div class="mt-2 avoid prevent-split" v-if="item.split(':')[0] === 'Other'">
                    <div class="desc-wrapper">
                      <p class="desc-wrapper-title">Description</p>
                      <div class="desc-wrapper-content">
                        <pre class="desc-wrapper-content-pre">{{ stringGroupExtractor(item) }}</pre>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </pdfexport>
    <pdfexport ref="contentToExportPart">
      <div v-if="partPrintIndex == 0">Attachment Photo and File - Parts Required</div>
      <template v-if="partPrintIndex >= 0 && data.parts[partPrintIndex]">
      <div>{{ partPrintIndex + 1 }}. {{ data.parts[partPrintIndex].partNumber }} {{ data.parts[partPrintIndex].partDescription }}</div>
       <!--loop image  -->
        <template v-for="image in imageParts[partPrintIndex]" :key="image.id">
            <div class="my-1 d-flex justify-content-between avoid w-100">
                <div class="p-2 d-flex">
                    <!-- images -->
                    <div class="d-flex flex-column">
                      <img :src="image.buffer" class="report_section_body--image" :style="image.dimension ? `height: ${image.dimension.height}px; width: ${image.dimension.width}px;`: ''" :alt="image.id">
                      <div class="image-carousel-description">
                        <div class="description-title">Description</div>
                        <div class="description-text">
                          <pre style="font-family: 'Public sans', sans-serif !important; font-size: 14px;word-break: break-word;white-space: break-spaces;">{{ decodeURIComponent(image.desc) }}</pre>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </template>
      </template>
    </pdfexport>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineExpose,
  defineEmits,
  ref,
  h,
  markRaw,
  defineComponent,
  nextTick
} from 'vue'
import {
  formatNumberWithComma,
  reformatNumberWithComma
} from '@/core/helpers/number-format'
import { displayDesc } from '@/core/helpers/manipulate-html-string'
import { ElLoading } from 'element-plus';
import {
  useHistoricalEformDmaStore
} from '@/store/pinia/report/history/dma/useHistoricalEformDmaStore';
import {
  useAttachmentStore
} from "@/store/pinia/dma/e-form/attachments/useAttachmentStore"
import {
  dataURLtoFile
} from '@/core/helpers/manipulate-file'
import { v4 as uuidv4 } from 'uuid';
import {
  calculateProportionalDimensions,
  formatOwnership,
  mergeObjects
} from '@/store/pinia/dma/e-form/helpers';
import {
  drawDOM,
  exportPDF,
} from '@progress/kendo-drawing';
import { PDFExport } from "@progress/kendo-vue-pdf";
import {
  stringToImageInfoConvert
} from '@/core/helpers/string-to-imageinfo-converter';
import {
  Dimensions,
  ImageItem,
  LoadedImageBuffer,
  LoadedImageData
} from '@/core/types/entities/report/history/historical-eform-dma/ImageItem';
import PDFMerger from 'pdf-merger-js/browser';
import {
  stringGroupExtractor
} from "@/core/helpers/ironforms/defects-form/defect-form"
import SmallCamera from "@/components/dma/defect/parts-component/SmallCamera.vue"
import UploadAttachment from "@/components/dma/defect/parts-component/UploadAttachment.vue"
import {
  cloneDeep,
  isArray,
  isEmpty
} from 'lodash';
import {
  ILoadingInstance
} from 'element-plus/lib/el-loading/src/loading.type';
import {
  CrackYesDetail,
} from "@/core/types/entities/dma/e-form/defects/DefectCrackYesDetail";

defineComponent({
  components: {
    pdfexport: PDFExport,
  },
});

const emits = defineEmits(["onDownloadFinish"])
const id = uuidv4()
const contentToExport = ref();
const contentToExportPart = ref();
const loading = ref<ILoadingInstance>();
const partPrintIndex = ref(-1)

const historyEformStore = useHistoricalEformDmaStore()
const attachmentStore = useAttachmentStore()

const data = computed(() => {
  const downloadData = historyEformStore.DefectDetailDownload
  if ('previousCracks' in downloadData) {
    return historyEformStore.DefectDetailDownload as CrackYesDetail
  }
  return {} as CrackYesDetail
})

const serialNumber = computed(() => {
  return historyEformStore.SerialNumber
})

const ownership = computed(() => {
  return historyEformStore.OwnerShip
})

const timeStamp = computed(() => {
  return historyEformStore.TimeStamp
})

const filename = computed(() => {
  return historyEformStore.FileName
})

const addPartAttachment = computed(() => {
  return historyEformStore.IsAttachmentIncludeDownload
})

const approvalData = computed(() => {
  return historyEformStore.ApprovalDefectDownload
})

const referencePhoto = computed(() => {
  const data = cloneDeep(historyEformStore.ReferencePhoto)
  if (!isEmpty(data)) {
    data.dimension = calculateMaxWidthImage(data)
  }
  return data
})

const formatNumberInput = (input) => {
  return formatNumberWithComma(reformatNumberWithComma(input))
}

type Image<T> = {
  dimension: T;
};

function calculateMaxWidthImage<T extends Dimensions>(image: Image<T>): Dimensions {
  if (image.dimension.width > 850) {
    return calculateProportionalDimensions(image.dimension.width, image.dimension.height, 850);
  }
  return image.dimension;
}

const images = ref<ImageItem[]>([])
const imageParts = ref<ImageItem[][]>([])

const handleDataFetch = () => {
  loading.value = ElLoading.service({
    lock: true,
    text: 'Generating PDF',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  images.value = []
  imageParts.value = []
  let promises: Promise<ImageItem>[] = []
  // defect photos
  if (data.value.images && data.value.images.length > 0) {
    const images = stringToImageInfoConvert(data.value.images)
    images.forEach((img) => {
      promises.push(new Promise((resolve) => {
        historyEformStore.loadImage(img.filename).then((res) => {
          resolve(res as ImageItem)
        }).catch(() => {
          resolve({} as ImageItem)
        })
      }))
    })
  }
  if (addPartAttachment.value) {
    // parts photos
    if (data.value.parts && data.value.parts.length > 0) {
      data.value.parts.forEach((part) => {
        if (isArray(part.images) && part.images.length > 0) {
          const images = stringToImageInfoConvert(part.images)
          images.forEach((img) => {
            promises.push(new Promise((resolve) => {
              historyEformStore.loadImage(img.filename).then((res) => {
                resolve(res as ImageItem)
              })
            }))
          })
        }
      })
    }
  }

  Promise.allSettled(promises).then(async (res) => {
    const result = res.map((val) => {
      if (val.status === "fulfilled" && val.value != null) {
        return val.value
      }
    }).filter((val) => {
      return val !== undefined
    }) as LoadedImageBuffer[]

    // all promises result status == fulfilled, add to list
    // else => Download without image
    if (res.length > 0 && result.length > 0) {
      // merging defect images (optional)
      const defectImage: LoadedImageData[] = data.value.images.map((img) => {
        return {
          id: img.filename,
          desc: img.description,
        }
      })
      images.value = mergeObjects(result, defectImage);

      // get max width dimension
      images.value.forEach((img) => {
        img.dimension = calculateMaxWidthImage(img)
      })

      const imagePartTempOnlyIdDesc: LoadedImageData[][] = []
      // merging parts images
      if (addPartAttachment.value) {
        data.value.parts.forEach((part) => {
          const imagePartTemp: LoadedImageData[] = []
          part.images.forEach((img) => {
            imagePartTemp.push({
              id: img.filename,
              desc: img.description,
            })
          })
          imagePartTempOnlyIdDesc.push(imagePartTemp)
        })

        imageParts.value = imagePartTempOnlyIdDesc.map((imgs) => {
          const temp = mergeObjects(result, imgs) as ImageItem[];
          temp.forEach((img) => {
            img.dimension = calculateMaxWidthImage(img)
          })
          return temp
        })
      }
    }
    setTimeout(async () => {
      await handleDownload()
    }, 1000);
  })
}

const pageTemplate = markRaw({
  render: function () {
    return h('div', {
      style: {
        position: 'absolute',
        bottom: '10px',
        right: '15px'
      }
    })
  }
})

const handleDownload = async () => {
  const optionDOM = {
    forcePageBreak: '.page-break',
    paperSize: "A4",
    scale: 0.6,
    fileName: filename.value,
    pageTemplate: pageTemplate,
    keepTogether: '.prevent-split',
    margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" }
  }

  const optionExport = { ...optionDOM, margin: "1cm" }
  drawDOM(contentToExport.value, optionDOM).then((group) => {
    try {
      // Exporting PDF Form Template
      return exportPDF(group, optionExport);
    } catch (error) {
      historyEformStore.resetAfterDownload()
      loading.value?.close()
      return null
    }
  }).then(async (dataUri) => {
    if (dataUri) {
      const template = await dataURLtoFile(dataUri, "temp.pdf")
      const merger = new PDFMerger();
      // Add PDF Form Template to Merger (to merge with parts template)
      await merger.add(template);

      if (addPartAttachment.value && data.value.parts.length > 0) {
        for (let idx = 0; idx < data.value.parts.length; idx++) {
          partPrintIndex.value = idx;

          // Use Vue's $nextTick to wait for the template update
          await nextTick();

          // Exporting PDF Parts Images
          const group = await drawDOM(contentToExportPart.value, optionDOM);
          const dataUri = await exportPDF(group, optionExport);
          const template = dataURLtoFile(dataUri, "temp.pdf");
          await merger.add(template);
          // loop add part pdf
          const attacthments = data.value.parts[idx].attachment
          if (attacthments && attacthments.length > 0) {
            for (let id = 0; id < attacthments.length; id++) {
              const blobFetch = await attachmentStore.downloadAttachmentPDF(attacthments[id].url)
              const b = new Blob([blobFetch], { type: 'application/pdf' })
              const file = new File([b], "temp.pdf")
              await merger.add(file)
            }
          }
        }
      }
      await merger.save(filename.value);
      emits("onDownloadFinish")
    }
  }).catch((error) => {
    console.log(error)
  }).finally(() => {
    historyEformStore.resetAfterDownload()
    loading.value?.close()
  });
};

defineExpose({
  handleDataFetch
})

const formatOwnershipHTML = computed(() => {
  return formatOwnership(ownership.value)
})

</script>
<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.ori.scss";
@import "@/assets/sass/pages/custom.defect.crack.dialog.scss";

.defect-review-eform {
  .task-title {
    color: #212B36;
    font-weight: 400 !important;
    font-size: 14px !important;
    line-height: 20px;
    &.download-by {
      color: #637381;
      font-size: 14px !important;
      font-weight: 400 !important;
      line-height: 20px;
    }
  }

  .desc-wrapper {
    padding: 5px 10px;
    border: 1px solid #e4e6ef;
    background: #eff2f5;
    border-radius: 0.475rem;
  }
  .desc-wrapper-title {
    font-size: 13px;
    color: grey;
    font-family: 'Public sans', sans-serif !important;
  }
  .desc-wrapper-content pre {
    margin-top: 4px;
  }
  .desc-wrapper-content-pre {
    font-size: 13px;
    color: #212b36;
    font-family: 'Public sans', sans-serif !important;
  }
  .report{
    font-family: 'Public sans', sans-serif !important;
    border-radius: 8px;
    border: 1px solid rgba(145, 158, 171, 0.24);
    padding: 12px !important;
    &_section {
      &_header {
        padding-bottom: 12px;
        &_subtitle {
          .title {
            font-size: 14px;
          }
        }
      }
      &_body {
        padding: 0px;
        &--image {
          // max-width: 100%;
          // height: auto;
          object-fit: contain;
        }
      }
    }
  }
  .form-control {
    color: #919EAB;
    font-family: 'Public Sans';
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
  }

  div {
    &.form-control {
        &.asset-number-disabled-div {
            padding-top: 2rem;
            padding-bottom: 2rem;
            background-color: #EFF2F5;
        }
    }
  }
}
</style>

<style lang="scss" scoped>
  .hiddenContainer {
  z-index: -999;
  position: relative;
  height: 0;
  overflow: hidden;
}
</style>
