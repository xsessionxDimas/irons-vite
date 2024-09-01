<!-- eslint-disable no-undef -->
<template>
    <el-dialog
    v-model="isVisible"
    title="Preview"
    width="80%"
    custom-class="show-pdf"
    :close-on-click-modal="false"
    :close-on-press-escape = "false"
    @close="handleCloseModal()">
      <template v-if="isError">
        <div class="row text-center my-10">
          <span class="text-danger">{{ errorMessage }}</span>
        </div>
      </template>
      <template v-else>
        <!-- button -->
        <div class="row justify-content-end pt-4 pe-10">
          <div class="div page-controller" style="margin-left: auto;">
            <button type="button" :disabled="page <= 1" @click="page--" class="btn btn-success btn-sm ok-button">❮</button>
              {{ page }} / {{ pageCount }}
            <button type="button" :disabled="page >= pageCount" @click="page++" class="btn btn-success btn-sm ok-button">❯</button>
          </div>
        </div>
        <!-- pdf embed -->
        <div class="image-carousel-description">
          <div class="description-title">Description</div>
          <div class="description-text"><pre style="font-family: 'Public sans', sans-serif !important; font-size: 12px; text-wrap:unset">{{ data.Description }}</pre></div>
        </div>
      </template>
    </el-dialog>
  </template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  toRef,
  ref,
  PropType
} from 'vue'
import {
  ListItem,
} from "@/core/types/entities/iron-lake/media-library/ListItem";

const props = defineProps({
  visibility: {
    type: Boolean,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  data: {
    required: true,
    type: Object as PropType<ListItem>
  },
});
const emits = defineEmits(["handleCloseModal"]);
const page = ref(1)
const pageCount = ref(1)
const pdfRef = ref(null) as any
const errorMessage = ref('')
const isError = ref(false)

const isVisible = toRef(props, "visibility")

const handleDocumentRender = () => {
  pageCount.value = pdfRef.value.pageCount
}

const handleOnClick = (event) => {
  event.preventDefault()
}

const handleCloseModal = () => {
  page.value = 1
  emits("handleCloseModal")
}
</script>

  <style lang="scss">
    .ok-button {
      background-color: #18AF4A;
    }
    .page-controller {
      width: -moz-max-content; /* Firefox */
      width: -webkit-max-content; /* Chrome */
      width: max-content;
    }

    .el-dialog {
      &.show-pdf {
        .el-dialog__title {
          color: white!important;;
        }
      }
    }
  </style>

