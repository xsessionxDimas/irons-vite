<template>
  <div class="menu-item pointer position-relative" :class="{ opened: expanded }" :style="[depth == 0 ? 'height: calc(100vh - 40px);overflow: auto;' : '']">
    <div
      class="label"
      :class="{
        link: depth == 2,
        active: (data.model === route.params?.model && data.psType == route.params?.pstype && depth > 0)
      }"
      @click="nodeClick(data.psType as string, data.model as string)"
      :style="{ paddingLeft: depth * 20 + 20 + 'px' }">
      <div class="left" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        <em v-if="data.icon" :class="data.icon"></em>
        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" :class="{bold: depth == 0}">{{ data.label }}</span>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <button
      v-if="depth == 0"
      class="btn-taskcollection py-2 fw-bolder"
      @mouseover="onMouseIn"
      @mouseleave="onMouseOut"
      :class="activeClass"
      @click="handleOpenTaskCollection()">
        <div class="d-flex justify-content-center align-items-center gap-2">
          <img :src="activeIcon" alt="icon" style="width: 18px; height: 16px;">
          <span>
            Task Collection
          </span>
        </div>
      </button>
    </div>
    <div class="d-flex justify-content-center">
      <input
        v-if="depth == 0"
        type="text"
        style="width: 90%;background: white;"
        class="form-control form-control-solid rounded search-placeholder-label"
        placeholder="Search"
        v-model="searchString"
       />
    </div>
    <div
      v-show="depth == 0 || data.collapsible"
      class="items-container"
      style="height: fit-content; overflow: visible;"
      ref="container"
    >
      <menu-item
        v-for="(item, index) in children"
        :key="index"
        :children="item.children || []"
        :data="item"
        :depth="depth + 1"
      />
    </div>
    <div v-if="depth > 1" class="icon-service-sheet" v-show="data.model != 'General'">
      <img src="/media/svg/dma/version-history/icon-service-sheet.png" alt="icon">
      <img src="/media/svg/dma/version-history/icon-service-sheet-hover.png" alt="icon" class="icon-hover" @click="handleOpenForm(data.model, data.psType)">
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  TreeItem,
} from '@/core/types/misc/TreeNode'
import {
  defineProps,
  ref,
  PropType,
  computed,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  useVersionHistory
} from "@/store/pinia/dma/version-history/useVersionHistory"

defineProps({
  children: {
    type: Array as PropType<TreeItem[]>,
    required: true
  },
  data: {
    type: Object as PropType<TreeItem>,
    required: true
  },
  depth: {
    type: Number,
    required: true
  }
})

const router = useRouter()
const route = useRoute()
const store = useVersionHistory()

/* refs */
const expanded = ref<boolean>(true)
const container = ref<HTMLElement>()
const hoverState = ref<boolean>(false)

const searchString = computed({
  get: () => {
    return store.searchString
  },
  set: (val) => {
    store.setSearchMenu(val)
  }
})

const activeClass = computed(() => {
  return route.params?.menu === 'taskcollection' ? 'btn-taskcollection-active' : ''
})

const activeIcon = computed(() => {
  const path = route.params?.menu === 'taskcollection' || hoverState.value ? 'active' : 'inactive'
  return `/media/svg/dma/side-menu/${path}/collection.png`
})

const onMouseIn = () => {
  hoverState.value = true
}

const onMouseOut = () => {
  hoverState.value = false
}

const nodeClick = (psType: string, model: string) => {
  if (psType && model) {
    router.push(`/ironforms/versionhistory/${model}/${psType}`)
  } else if (model) {
    store.setCollapse(model)
  }
}

const handleOpenForm = (model, psType) => {
  const routeData = router.resolve({
    name: 'formpreview',
    params: {
      model: model,
      pstype: psType
    }
  });
  window.open(routeData.href, '_blank');
}

const handleOpenTaskCollection = () => {
  router.push(`/ironforms/versionhistory/taskcollection`)
}
</script>

<style lang="scss" scoped>
.menu-item {
  position: relative;
  width: 100%;
  .label {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    white-space: nowrap;
    user-select: none;
    height: 50px;
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 14px;
    color: #6a6a6a;
    transition: all 0.3s ease;
    > div {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    i {
      font-size: 20px;
      color: #6e6e6e;
      transition: all 0.3s ease;
      &.expand {
        font-size: 16px;
        color: #cacaca;
        &.opened {
          transform: rotate(180deg);
        }
      }
    }
    &.small-item {
      width: fit-content;
    }
  }
  .bold {
    font-weight: bold;
  }
  .link {
    &:hover {
      background: #deedff;
      cursor: pointer;
    }
  }
  .active {
    background: #deedff;
    cursor: pointer;
  }
  .items-container {
    width: 100%;
    left: calc(100% + 6px);
    transition: height 0.3s ease;
    overflow: hidden;
    &.small-menu {
      width: fit-content;
      position: absolute;
      background: #fff;
      box-shadow: 0 0 10px #ebebeb;
      top: 0;
      .label {
        width: 100% !important;
        padding-left: 20px !important;
      }
    }
  }

  .btn-taskcollection {
    width: 90%;
    margin-bottom: 10px;
    border: 2px solid #DFE3E8;
    color: #6a6a6a;
    border-radius: 5px;
    background-color: transparent;
  }

  .btn-taskcollection-active {
    background-color: #18AF4A;
    border: 2px solid #18AF4A;
    color: #fff;
  }

  .btn-taskcollection:hover {
    background-color: #18AF4A;
    border: 2px solid #18AF4A;
    color: #fff;
    transition: all ease-in .2s;
  }
  .tc-active {
    background-color: #18AF4A;
    border: 2px solid #18AF4A;
    color: #fff;
  }
}
.icon-service-sheet {
  position: absolute;
  right: 10px;
  top: 15px;
  z-index: 1;

  img {
    width: 18px;
    height: 20px;
    cursor: pointer;
  }

  .icon-hover {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
  }
  &:hover {
    .icon-hover {
      display: inline;
    }
  }
}
</style>
