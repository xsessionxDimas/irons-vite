<template>
  <div class="report mb-4 prevent-split">
    <div class="report_section_header avoid">
      <h4 class="title ps-3">Defect Identified</h4>
    </div>
    <div class="report_body">
      <!-- items -->
      <div class="item my-2 avoid grid-template-defect prevent-split">
          <div
            class="label vertical-center"
          >
            No
          </div>
          <div class="label vertical-center">
            Task Description - Defect Description
          </div>
          <div
            class="label vertical-center"
          >
            Priority
          </div>
          <div
            class="label vertical-center"
          >
            Review Status
          </div>
          <div
            class="label vertical-center"
          >
            Work Order
          </div>
          <div
            class="label vertical-center"
          >
            Repair Status
          </div>
        </div>
        <template v-for="index in sortTaskKeys(Object.keys(headersDisplay))" :key="index">
          <template v-if="!checkServiceCleanedAndReplaced(index)">
            <div class="grid-template-defect-multi-header item my-2 avoid prevent-split">
              <span class="label">{{ headersDisplay[index][0].taskNo.split(';')[0] }}</span>
              <span class="label d-flex align-items-center defect-identified-task" v-html="displayDesc(formatHtml(headersDisplay[index][0].taskDesc))"></span>
            </div>
            <template v-for="item in headersDisplay[index]" :key="item.id">
              <div class="item my-2 avoid prevent-split">
                <!-- left -->
                <div class="grid-template-defect">
                  <div
                    class="btn-detail px-3 label py-2 rounded text-center height-fit"
                  >
                  </div>
                  <div class="label vertical-center text-break" style="word-break: break-word;white-space: break-spaces;" v-html="item.descriptionDefect">
                  </div>
                  <div class="horizontal-vertical-center" :class="declineStatus(item)">
                    <div
                    class="little-box d-flex justify-content-center align-items-center vertical-center"
                    :class="priorityClass(item.priority)"
                  >
                    <span style="font-weight: 600; color: white">{{
                      item.priority
                    }}</span>
                  </div>
                  </div>
                  <!-- form name -->
                  <div class="vertical-center">
                    <template v-if="item.plannerStatus == 'Decline' || item.status == 'Decline'">
                      <div
                        class="btn-detail px-3 label py-2 rounded text-center height-fit red-bg text-dark-red"
                      >
                        Declined
                      </div>
                    </template>
                    <template v-else>
                      <div
                        class="btn-detail px-3 label py-2 rounded text-center height-fit"
                        :class="formClass(item.id)"
                      >
                        Detailed Information
                      </div>
                    </template>
                  </div>
                  <!-- mou -->
                  <div
                    class="label height-fit"
                    :class="visibilityClass(item)"
                  >
                    <div class="d-flex flex-column">
                      <input
                        type="text"
                        class="form-control mou"
                        v-model="item.defectWorkorder"
                        placeholder="Input Work Order"
                        :disabled="true"
                      />
                    </div>
                  </div>
                  <!-- repair -->
                  <div class="height-fit" :class="declineStatus(item)">
                    <div
                      class="px-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center"
                      :class="repairedClass(item.id)"
                    >
                      <img src="/media/svg/dma/icons/Repair.png" alt="" />
                    </div>
                  </div>
                </div>
                <div class="text-end create-by">
                  {{ item.createdBy.name }}, {{ item.updatedDate != "" ? item.updatedDate : item.createdDate }}
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="item my-2 avoid prevent-split">
                <!-- left -->
                <div class="grid-template-defect">
                  <div
                    class="btn-detail px-3 label py-2 rounded text-center height-fit"
                  >
                  {{ headersDisplay[index][0].taskNo.split(';')[0] }}
                  </div>
                  <div class="label vertical-center text-break" style="word-break: break-word;white-space: break-spaces;" v-html="displayDesc(formatHtml(headersDisplay[index][0].taskDesc))">
                  </div>
                  <div class="horizontal-vertical-center" :class="declineStatus(headersDisplay[index][0])">
                    <div
                    class="little-box d-flex justify-content-center align-items-center vertical-center"
                    :class="priorityClass(headersDisplay[index][0].priority)"
                  >
                    <span style="font-weight: 600; color: white">{{
                      headersDisplay[index][0].priority
                    }}</span>
                  </div>
                  </div>
                  <!-- form name -->
                  <div class="vertical-center">
                  </div>
                  <!-- mou -->
                  <div
                    class="label height-fit invisible"
                  >
                  </div>
                  <!-- repair -->
                  <div class="height-fit" :class="declineStatus(headersDisplay[index][0])">
                    <div
                      class="px-3 little-box rounded-circle d-flex p-3 justify-content-center align-items-center"
                      :class="repairedClass(headersDisplay[index][0].id)"
                    >
                      <img src="/media/svg/dma/icons/Repair.png" alt="" />
                    </div>
                  </div>
                </div>
                <div class="text-end create-by">
                  {{ headersDisplay[index][0].createdBy.name }}, {{ headersDisplay[index][0].updatedDate != "" ? headersDisplay[index][0].updatedDate : headersDisplay[index][0].createdDate }}
                </div>
              </div>
          </template>
        </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form/defects/useDefectsStore";
import { sortTaskKeys } from "@/store/pinia/dma/e-form/helpers"
import {
  formatHtml,
  displayDesc
} from '@/core/helpers/manipulate-html-string';

/* stores */
const store = useDefectsStore();

/* computeds */
const headers = computed(() => {
  return store.ApprovalData.DefectHeaders;
});

const headersDisplay = computed(() => {
  const headerTemp = headers.value
  store.ApprovalData.DefectDetails.forEach((detail) => {
    const headerIndex = headers.value.findIndex((h) => {
      return h.id === detail.defectHeaderId;
    });
    if (headerIndex >= 0) {
      headerTemp[headerIndex].descriptionDefect = detail.detail.description
    }
    if (detail.detail.description == 'qwertyu') {
      console.log(detail)
    }
  })
  headerTemp.forEach((item) => {
    if (item.taskDesc && item.taskDesc.split(";")[1] && item.taskDesc.split(";")[1] != '') {
      item.taskNo = item.taskDesc.split(";")[0] + ";" + item.taskDesc.split(";")[1]
    }
  })
  const headerNoSMU = headerTemp.filter((obj) => {
    return obj.defectType !== 'machineSMU'
  })
  return headerNoSMU.reduce((groups, item) => {
    const group = (groups[item.taskNo] || []);
    group.push(item);
    groups[item.taskNo] = group;
    return groups;
  }, {}) as any;
})

/* methods */
const formClass = (headerId: string): string => {
  let cssClass = "light-yellow color-dark-yellow";
  const header = headers.value.find((h) => {
    return h.id === headerId;
  });
  if (header) {
    switch (header.status) {
      case "Submited":
        cssClass = "light-yellow color-dark-yellow";
        break;
      case "Acknowledge":
        cssClass = "light-green color-dark-green";
        break;
    }
    if (header.priority === undefined) {
      cssClass = "light-green color-dark-green";
    }
  }
  return cssClass;
};

const declineStatus = (item) => {
  if (item.plannerStatus == 'Decline') {
    return 'invisible'
  } else {
    return item.status == 'Decline' ? 'invisible' : ''
  }
}

const visibilityClass = (item) => {
  if (item.plannerStatus == "Decline") {
    return "invisible"
  } else {
    if (item.status == "Decline") {
      return "invisible"
    }
    return item.priority === undefined ? 'invisible' : ''
  }
}

const priorityClass = (priority: string): string => {
  let priorityClass = "";
  switch (priority) {
    case "P1":
      priorityClass = "red";
      break;
    case "P2":
      priorityClass = "gold";
      break;
    case "P3":
      priorityClass = "yellow";
      break;
    case "P4":
      priorityClass = "green";
      break;
  }
  return priorityClass;
};
const allowRepaired = (): string => {
  let className = " not-allowed";
  return className;
};
const repairedClass = (headerId: string): string => {
  let className = "";
  const header = headers.value.find((h) => {
    return h.id === headerId;
  });
  if (header) {
    className = header.repairedStatus === "Not-Repaired" ? "red" : "green";
    className = !header.priority ? "green" : className
    className += allowRepaired();
  }
  return className;
};

const checkServiceCleanedAndReplaced = (indexHeader) => {
  if (headersDisplay.value[indexHeader].length == 1) {
    if (headersDisplay.value[indexHeader][0].cbmRatingType == 'SERVICE_CLEANED_AND_REPLACED') {
      return true
    }
  }
  return false
}
</script>
<style>
.vcp {
  background: white;
  border: 1px solid rgba(145, 158, 171, 0.24);
  border-radius: 12px;
}
.vcp__body {
  overflow: inherit !important;
}
</style>
<style lang="scss" scoped>
@import "@/assets/sass/pages/defect.panel.scss";

.grid-template-defect {
  display: grid;
  grid-template-columns: 60px 406px 55px 144.61px 115px 43px;
  grid-gap: 5px;

  &-multi-header {
    display: grid;
    grid-template-columns: 60px auto;
    grid-gap: 5px;
  }
}
.height-fit {
  height: fit-content;
  margin: auto !important;
}
.horizontal-vertical-center {
  margin: auto !important;
}
.letter-space-hypen {
 letter-spacing: 1.5px;
}
</style>
<style lang="scss">
.dma-historical-eform {
  .label {
    ul {
      margin-bottom: 0 !important;
    }
  }
}
</style>
