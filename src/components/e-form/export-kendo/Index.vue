<template>
  <div :class="isHidden ? 'hidden' : 'hiddenContainer'">
    <pdfexport ref="contentToExport">
      <div id="General" class="dma-historical-eform">
        <Header :title="formHeader" />
        <SubHeader ref="subHeader" :subHeader="generalDataForm" v-if="generalDataForm" />
        <General ref="general" :general="generalDataForm" v-if="generalDataForm" />
      </div>
      <template v-for="serviceSheet in serviceSheetsForm" :key="serviceSheet.id">
        <div class="page-break" />
        <SubGroup
          :data="serviceSheet.subGroup[0]"
          v-if="serviceSheet.groupName != 'DEFECT_IDENTIFIED_SERVICE'"
        />
        <DefectIdentified
          v-else-if="serviceSheet.groupName == 'DEFECT_IDENTIFIED_SERVICE'"
        />
      </template>
    </pdfexport>
    <pdfexport ref="emptyContent">
      <div></div>
    </pdfexport>
  </div>
</template>

<script lang="ts" setup>
import {
  h,
  markRaw,
  ref,
  computed,
  defineExpose,
  defineProps,
  defineEmits,
  defineComponent,
  onUnmounted
} from "vue";
import _, { find } from "lodash";
import { AxiosResponse } from "axios";
import { ElLoading } from "element-plus";
import { PDFExport, savePDF } from "@progress/kendo-vue-pdf";

import Header from "./component/Header.vue";
import SubHeader from "@/components/intervention-form/export-kendo/component/general/SubHeader.vue";
import General from "./component/general/General.vue";
import SubGroup from "./component/sub-group/SubGroup.vue";
import DefectIdentified from "./component/defect/DefectIdentified.vue";

import {
  usePreviewFormStore
} from "@/store/pinia/dma/preview-form/usePreviewFormStore";
import {
  useHistoricalEformDmaStore
} from "@/store/pinia/report/history/dma/useHistoricalEformDmaStore";
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form/defects/useDefectsStore";
import {
  useDefectsFormStore
} from "@/store/pinia/dma/e-form/defects/useDefectsFormStore";
import ApiService from "@/core/services/ApiService";

const props = defineProps({
  fileName: {
    type: String,
    default: "Report.pdf",
  },
  addTimeStamp: {
    type: String,
    default: "",
  },
});
defineComponent({
  components: {
    pdfexport: PDFExport,
  },
});
const emits = defineEmits(["onDownloadFinish"])

const isHidden = ref<boolean>(true);
const contentToExport = ref();
const previewDefectFormStore = usePreviewFormStore();
const defectFormStore = useDefectsFormStore()
const generalDataForm = computed(() => {
  return previewDefectFormStore.generalForm;
});
const formHeader = computed(() => {
  if (generalDataForm.value) {
    const formName = generalDataForm.value.form;
    const version = generalDataForm.value.version || "";
    return `${formName} (Ver. ${version})`;
  }
  return "";
});
const groups = computed(() => {
  return previewDefectFormStore.groups;
});
const serviceSheetsForm = computed(() => {
  const filteredSheets = previewDefectFormStore.serviceSheets.filter((item) => {
    return (
      item.groupName === "DEFECT_IDENTIFIED_SERVICE" ||
      item.subGroup[0]?.taskGroup.length > 1
    );
  });
  // Sort the sheets
  const idToIndexMap = {};
  groups.value.forEach((item, index) => {
    idToIndexMap[item.id] = index;
  });
  const sortedSheets = filteredSheets.slice().sort((a, b) => {
    return idToIndexMap[a.id] - idToIndexMap[b.id]
  });
  return sortedSheets
});

const pageTemplate = markRaw({
  render: function () {
    return h('div', {
      style: {
        position: 'absolute',
        bottom: '10px',
        right: '15px'
      }
    },
    [props.addTimeStamp])
  }
})
const handleDownload = async () => {
  isHidden.value = false;
  savePDF(
    contentToExport.value,
    {
      forcePageBreak: '.page-break',
      paperSize: "A4",
      scale: 0.6,
      margin: {
        top: "1.3cm",
        left: "1cm",
        right: "1cm",
        bottom: "1.3cm"
      },
      fileName: props.fileName,
      pageTemplate: pageTemplate,
      keepTogether: '.prevent-split',
    },
    () => {
      isHidden.value = true;
      previewDefectFormStore.resetPreview();
      historyEformStore.resetImageList();
      emits("onDownloadFinish", generalDataForm.value)
      loading.value.close();
    }
  )
};

const emptyContent = ref();
const handleDownloadEmptyDocument = async () => {
  savePDF(
    emptyContent.value,
    {
      paperSize: "A4",
      scale: 0.6,
      margin: "1cm",
      fileName: 'Report.pdf'
    },
    () => {
      previewDefectFormStore.resetPreview();
      historyEformStore.resetImageList();
      loading.value.close();
    }
  );
};

const historyEformStore = useHistoricalEformDmaStore();
const defectStore = useDefectsStore();
const authStore = useAuthenticationStore();
const errorMessage = computed(() => {
  return previewDefectFormStore.errorMessage;
});
const loading = ref<any>();
const general = ref();
const handleFetchItem = async (item) => {
  loading.value = ElLoading.service({
    lock: true,
    text: "Generating PDF",
    background: "rgba(0, 0, 0, 0.7)",
  });
  previewDefectFormStore.setModelAndPsTypeId(
    `${item.brand} ${item.equipmentModel}`,
    item.psType,
    item.workOrder,
    item.unitNumber
  );
  await previewDefectFormStore.postGenerateServiceSheet(
    authStore.user.EmployeeId,
    authStore.user.Name,
    authStore.user.SiteId
  );
  await defectFormStore.getOwnershipDefectForm(item.unitNumber)
  previewDefectFormStore.setSerialNumberGeneral(defectFormStore.SerialNumber)
  let promises: any[] = [];

  if (!_.isEmpty(serviceSheetsForm.value)) {
    serviceSheetsForm.value.forEach((group) => {
      group.subGroup.forEach((subgroup) => {
        subgroup.taskGroup.forEach((taskgroup) => {
          taskgroup.task.forEach((task) => {
            if (task.taskType == "inline") {
              task.items.forEach((item) => {
                if (item.itemType == "image") {
                  promises.push(
                    new Promise((resolve) => {
                      loadImage(item.value).then((res) => {
                        resolve(res);
                      });
                    })
                  );
                }
              });
            } else {
              task.items.forEach((item) => {
                for (const property in item) {
                  if (item[property].itemType == "image" && task.taskType != "collapsibleTable") {
                    promises.push(
                      new Promise((resolve) => {
                        loadImage(item[property].value).then((res) => {
                          resolve(res);
                        });
                      })
                    );
                  }
                }
              });
            }
          });
        });
      });
    });

    if (generalDataForm.value) {
      generalDataForm.value.checkBeforeTruck.items.forEach((item) => {
        if (item.category == 'html' && item.icon) {
          promises.push(
            new Promise((resolve) => {
              loadImage(item.icon.value).then((res) => {
                resolve(res);
              });
            })
          );
        }
      })
    }

    Promise.all(promises).then(async (res) => {
      res.forEach((val) => {
        let x = find(historyEformStore.imageList, ["id", val.id]);
        if (!x) {
          historyEformStore.setImageList(val);
        }
      });
      if (generalDataForm.value) {
        await defectStore.getDefectsData(item.workOrder.toString());
        await handleDownload();
      } else {
        await handleDownloadEmptyDocument();
      }
    });
    return {
      status: true,
      message: "",
    };
  } else {
    loading.value.close();
    return {
      status: false,
      message: errorMessage.value,
    };
  }
};

const loadImage = async (filename) => {
  const params = {
    id: `${filename}`,
    ver: "v1",
  };
  try {
    const GET_IMAGE_API_URL = `${import.meta.env.VITE_APP_BASE_URL_DIGITAL}/utility/api/master_attachment/download_by_id`;
    await ApiService.getBlob(
      GET_IMAGE_API_URL,
      "",
      new URLSearchParams(params).toString()
    );
    const response: AxiosResponse<Blob> = await ApiService.getBlob(
      GET_IMAGE_API_URL,
      "",
      new URLSearchParams(params).toString()
    );
    const buffer = response.data;
    const blob = new Blob([buffer]);
    const urlCreator = window.URL || window.webkitURL;
    return {
      id: filename,
      buffer: urlCreator.createObjectURL(blob),
    };
  } catch (e) {
    console.log(e);
    return null;
  }
};

defineExpose({
  handleFetchItem,
});

onUnmounted(() => {
  loading.value?.close();
})
</script>

<style lang="scss" scoped>
.hidden {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  overflow: hidden;
  height: 0;
}
.hiddenContainer {
  z-index: -999;
  position: relative;
}
</style>

<style lang="scss">
.dma-historical-eform {
  .before {
    page-break-before: always;
  }
  .after {
    page-break-after: always;
  }
  .avoid {
    page-break-inside: avoid;
  }
  .title {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
  }
  .report {
    font-family: "Public sans", sans-serif !important;
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
        padding: 12px;
      }
    }
  }
}
</style>
