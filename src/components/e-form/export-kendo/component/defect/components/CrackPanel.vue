<template>
  <div class="report mb-4 prevent-split">
    <div class="report_section_header avoid">
      <h4 class="title ps-3">Crack Identified</h4>
    </div>
    <div class="report_body">
      <div class="item my-2 avoid grid-template-defect prevent-split">
          <div
            class="label vertical-center"
          >
            No
          </div>
          <div class="label vertical-center">
            Task Description
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
        <template v-for="item in headers" :key="item.id">
          <div class="item my-2 avoid prevent-split">
            <div class="grid-template-defect my-2">
              <!-- left -->
              <div
                class="label d-flex align-items-center"
              >
                {{ item.taskNo }}
              </div>
              <div class="label vertical-center">
                <span class="text-break defect-identified-task" v-html="displayDesc(formatHtml(item.taskDesc))"></span>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import {
  useDefectsStore
} from "@/store/pinia/dma/e-form/defects/useDefectsStore";
import {
  formatHtml,
  displayDesc
} from '@/core/helpers/manipulate-html-string'

/* stores */
const store = useDefectsStore();

const headers = computed(() => {
  return store.ApprovalData.CrackHeaders;
});

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

const declineStatus = (item) => {
  if (item.plannerStatus == 'Decline') {
    return 'invisible'
  } else {
    return item.status == 'Decline' ? 'invisible' : ''
  }
}

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
</script>
<style lang="scss">
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
