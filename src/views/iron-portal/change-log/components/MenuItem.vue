<template>
  <div class="menu-item pointer position-relative" :class="{ opened: expanded }" :style="[depth == 0 ? 'height: calc(100vh - 40px);overflow: auto;' : '']">
    <div
      class="label"
      :class="{
        link: depth == 2,
        active: (data.menuName == selectedMenu.menuName && data.versionHistoryId == selectedMenu.versionHistoryId)
      }"
      @click="nodeClick(data)"
      :style="{ paddingLeft: depth * 20 + 20 + 'px' }">
      <div class="left" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        <em v-if="data.icon" :class="data.icon"></em>
        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" :class="{bold: depth == 0}">{{ data.menuName }}</span>
      </div>
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
        v-for="(item, index) in subMenu"
        :key="index"
        :subMenu="item.subMenu || []"
        :data="item"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  TreeItem,
} from '@/core/types/entities/iron-portal/iron-portal-version-history/TreeData'
import {
  defineProps,
  ref,
  PropType,
  computed,
} from 'vue'
import { useRouter } from 'vue-router'
import {
  useVersionHistory
} from "@/store/pinia/iron-portal/version-history/useVersionHistory"

defineProps({
  subMenu: {
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
const store = useVersionHistory()

/* refs */
const expanded = ref<boolean>(true)
const container = ref<HTMLElement>()

const selectedMenu = computed(() => {
  return store.selectedMenu
})

const searchString = computed({
  get: () => {
    return store.searchString
  },
  set: (val) => {
    store.setSearchMenu(val)
  }
})

const nodeClick = (menu: TreeItem) => {
  if (menu.subMenu) {
    store.setCollapse(menu.menuName)
    return
  }
  store.setSelectedMenu(menu)
}

const handleOpenForm = (menuName) => {
  const routeData = router.resolve({
    name: 'changelogIronportal',
    params: {
      menuName: menuName
    }
  });
  window.open(routeData.href, '_blank');
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
