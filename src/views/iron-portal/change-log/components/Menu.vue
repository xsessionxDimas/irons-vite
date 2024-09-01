<template>
  <div class="menu overflow-auto">
    <MenuItem
      :data="dataMenu"
      :subMenu="dataMenu.subMenu"
      :depth="0"
    ></MenuItem>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import {
  TreeItem
} from '@/core/types/entities/iron-portal/iron-portal-version-history/TreeData'
import MenuItem from './MenuItem.vue'

defineProps({
  dataMenu: {
    required: true,
    type: Object as PropType<TreeItem>
  }
})

</script>
<style lang="scss" scoped>
.menu {
  min-height: 100vh;
  width: 300px;
  transition: all .3s ease;
  overflow: auto;
  i {
    position: fixed;
    left: 250px;
    font-size: 20px;
    top: 15px;
    user-select: none;
    cursor: pointer;
    transition: all .3s ease;
  }
  &.small-menu {
    overflow: inherit;
    width: 60px;
    padding-top: 50px;
    i {
      left: 20px;
    }
  }
}
</style>
