<template>
  <div class="demo-pagination-block">
    <div class="d-flex align-items-center">
      <span class="text-blue-gray-300">
        {{ translate('SHOWING', t, te) }} {{ start }} {{ translate('TO', t, te)}} {{ props.endPaginationIndex }} {{ translate('OF', t, te)}} {{ props.totalPage }} {{ translate('ENTRIES', t, te)}}
      </span>
      <div class="ml-auto">
        <el-pagination
          :class="customClassPagination"
          background
          :currentPage="props.currentPage"
          :page-sizes="[10, 20, 50]"
          :layout="layout"
          :total="props.totalPage"
          :page-size="props.totalPageSize"
          @size-change="handleSizeChange"
          @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import {
  computed,
  defineProps,
  defineEmits,
} from 'vue'
import { translate } from "@/core/helpers/language"
import { useI18n } from "vue-i18n"

const props = defineProps({
  totalPageSize: {
    default: 0
  },
  totalPage: {
    default: 0
  },
  startPaginationIndex: {
    default: -1
  },
  endPaginationIndex: {
    default: 0
  },
  pageSizes: {
    required: false,
    default: [1, 2, 5, 10, 20, 50, 100]
  },
  isPageSizeChange: {
    required: false,
    default: false
  },
  currentPage: {
    required: true,
    type: Number,
    default: 1
  },
  customClassPagination: {
    default: ""
  }
});

const emits = defineEmits(["raise-size-change", "raise-page-change"]);

const { t, te } = useI18n()
const handleSizeChange = (value) => {
  emits("raise-size-change", value);
}

const handlePageChange = (value) => {
  emits("raise-page-change", value)
}

// start index
const start = computed(() => {
  if (props.startPaginationIndex === -1) {
    return props.startPaginationIndex + 2
  } else if (props.endPaginationIndex === 0) {
    return props.startPaginationIndex
  } else {
    return props.startPaginationIndex + 1
  }
})
const layout = computed(() => {
  const addSize = props.isPageSizeChange ? 'sizes, ' : ''
  return `${addSize}prev, pager, next`
})
</script>

<style scoped>
.ml-auto {
  margin-left: auto;
}
.el-pager li {
  color: #90A4AE !important;
}
</style>
