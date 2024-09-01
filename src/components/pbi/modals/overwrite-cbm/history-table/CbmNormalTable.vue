<template>
  <div class="condition-modified my-5" v-if="props.isModifying">
    <!-- condition modify -->
    <table class="table table-bordered">
      <caption></caption>
      <thead>
        <tr style="background: #f4f6f8">
          <th scope="col" class="table-header ps-2">Task</th>
          <th scope="col" class="table-header">Measurement Location</th>
          <th scope="col" class="table-header">Rating</th>
          <th scope="col" class="table-header"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="ps-2">{{ modifiedObject.taskNo }}</th>
          <th scope="row">{{ measurementLocation }}</th>
          <th scope="row">
            <div class="div px-0 px-0 mx-0 my-0 w-100 h-100 input-eform-status">
              <el-select
                v-model="modifiedObject.measurementRating"
                placeholder="Rating"
                :class="dropDownColor(modifiedObject.measurementRating)"
                @change="validateForm"
              >
                <el-option
                  v-for="item in ['A', 'B', 'C', 'X']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
              <div>
                <span
                  v-show="errorInput.measurementRating.isShowError"
                  class="text-danger font-weight-bold"
                  >This field is required</span
                >
              </div>
            </div>
          </th>
          <th scope="row">
            <SmallCameraModify
              :images="modifiedObject.images"
              :is-mandatory="false"
              @on-handle-images="handleModifiedImage"
            />
          </th>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="history-modified">
    <!-- history modified -->
    <div class="row w-100 table table-bordered">
      <div class="row w-100 ms-0" style="background: #f4f6f8">
        <div class="col-1 py-3 table-header">Task</div>
        <div class="col-4 py-3 table-header">Measurement Location</div>
        <div class="col-4 py-3 table-header">Rating</div>
        <div class="col-1 py-3 table-header"></div>
        <div class="col-2 py-3 table-header">Action</div>
      </div>
      <div
        v-if="
          detailCbm && detailCbm.historyModified && detailCbm.historyModified.detail.history.length > 0
        "
      >
        <template
          v-for="(item, index) in detailCbm.historyModified.detail.history"
          :key="index"
        >
          <div class="row px-0 mx-0 row-histories">
            <div class="d-flex align-items-center col-1 table-value">
              <span>{{ item.items[0].value }}</span>
            </div>
            <div class="d-flex align-items-center col-4 table-value">
              <span>{{ getMeasurementLocation(item) }}</span>
            </div>
            <div class="d-flex align-items-center col-4 table-value">
              <InputHistory :item="getRatingData(item.items)" />
            </div>
            <div class="col-1 table-value">
              <SmallCamera
                :item="getPhotoData(item)"
                :is-updated-by-current-user="item.updatedBy.id == authStore.user.EmployeeId"
                @showPreviewImages="showPreviewImages"
              />
            </div>
            <div class="d-flex align-items-center col-2 table-value">
              {{
                detailCbm.historyModified.detail.history.length - 1 == index
                  ? "IronForms"
                  : "IronPortal"
              }}
            </div>
          </div>
          <div v-if="item.updatedBy!.name" class="row px-0 mx-0">
            <div class="d-flex justify-content-end pb-1 pt-0 my-0 timestamp-task">
              {{ item.updatedBy!.name }}, {{ item.updatedDate! }}
            </div>
          </div>
        </template>
      </div>
      <template v-else>
        <div class="col-12 table-header text-center py-8">No Data Recorded</div>
      </template>
    </div>
  </div>
  <template v-if="modalImagePreview">
    <ImagePreview
    :type="'task'"
    :re-render="false"
    :images="imagesForPreview"
    :show-delete-button="false"
    :is-mandatory="false"
    :visibility="modalImagePreview"
    :is-monitoring="true"
    :show-mandatory-caption="false"
    @on-close="closeImagePreview" />
  </template>
</template>
<script lang="ts" setup>
import {
  computed,
  defineProps,
  ref
} from "vue";
import {
  useOverwriteCbmStore
} from "@/store/pinia/iron-portal/dashboard/pbi-equipment/overwrite-cbm/useOverwriteCbmStore";
import {
  CbmManual
} from "@/core/types/entities/iron-portal/dashboard/pbi-equipment/OverwriteType";
import { Item } from '@/core/types/entities/dma/e-form/Item';
import {
  useAuthenticationStore
} from "@/store/pinia/application/useAuthenticationStore";
import {
  ImageInfo
} from "@/core/types/entities/dma/ImageInfo";

import InputHistory from "../item/InputHistory.vue";
import SmallCamera from "../item/small-camera-history/SmallCamera.vue";
import SmallCameraModify from "../item/SmallCamera.vue";
import ImagePreview from '@/components/camera/ImagePreview.vue';

const props = defineProps({
  isModifying: {
    type: Boolean,
    required: true,
    default: false,
  },
  source: {
    type: String,
    required: false,
    default: 'serviceSheet'
  }
});

const overwriteStore = useOverwriteCbmStore();
const authStore = useAuthenticationStore();

const errorInput = computed(() => {
  return overwriteStore.inputError;
});

const modifiedObject = computed(() => {
  return overwriteStore.modifiedObjMan as CbmManual;
});

const detailCbm = computed(() => {
  return overwriteStore.detailCbm;
});

const validateForm = () => {
  overwriteStore.resetErrors();

  overwriteStore.setInputErrorCbmManual("", false);
  if (modifiedObject.value.measurementRating == "") {
    overwriteStore.setInputErrorCbmManual("This field is Required", true);
    overwriteStore.setErrors(["Please Check the form again"]);
  }
};

const dropDownColor = (value) => {
  let color: string | undefined;
  if (value == "A") {
    color = "a";
  } else if (value == "B") {
    color = "b";
  } else if (value == "C") {
    color = "c";
  } else if (value == "X") {
    color = "x";
  }
  return color;
};

const measurementLocation = computed(() => {
  let location = '';
  for (const element of detailCbm.value.historyModifiedDefault[0].items) {
    if (element.itemType === 'html') {
      location = element.value;
    }
  }
  if (location != '') {
    return location;
  } else {
    return detailCbm.value.currentCondition.measurementLocation;
  }
})

const getMeasurementLocation = (item) => {
  if (item.items[2].itemType != 'input') {
    return item.items[2].value;
  } else {
    const measurementObj = item.items.find((obj) => {
      return (
        obj.itemType == "html"
      );
    });
    return measurementObj.value
  }
}
const getRatingData = (items) => {
  const ratingObj = items.find((obj) => {
    return obj.categoryItemType == 'resultRating'
  })
  const ratingObj2 = items.find((obj) => {
    return obj.itemType == 'dropDown'
  })
  if (ratingObj) {
    return ratingObj
  } else if (ratingObj2) {
    return ratingObj2
  } else {
    return {} as Item
  }
}
const getPhotoData = (item) => {
  if (item.isUpdatePhoto != undefined && !item.isUpdatePhoto) {
    return [];
  }
  if (props.source == 'intervention') {
    return item.pictures;
  }
  const photoObj = item.items.find((obj) => {
    return obj.itemType == "smallCamera";
  });
  if (photoObj) {
    return photoObj.value;
  } else {
    return [];
  }
}

const handleModifiedImage = (images) => {
  overwriteStore.setImageManual(images);
};

const modalImagePreview = ref<boolean>(false);
const imagesForPreview = ref<ImageInfo[]>([]);
const closeImagePreview = () => {
  modalImagePreview.value = false;
}
const showPreviewImages = (val) => {
  imagesForPreview.value = val;
  modalImagePreview.value = true;
}
</script>
<style lang="scss" scoped>
.table {
  border: #e7eaee 2px solid;
}
.table-header .table-border-right-white {
  text-align: center;
  font-weight: 500 !important;
}
</style>
