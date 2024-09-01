<template>
    <div class="row px-5 mt-5">
        <!-- button here -->
        <div class="d-flex flex-column col-sm-4 col-md-3 col-lg-2" v-for="(menu, index) in data" :key="menu.Path" style="cursor: pointer;">
            <div @click="onButtonClick(menu.Path, menu.MenuName)"  :class="[disabledMenuArray[index] ? 'menu-button-disabled' : '']" class="home-icon border border-1 rounded rounded-3 p-5 pr-1 mb-5 h-100 position-relative" style="box-shadow: 0px 24px 48px rgba(145, 158, 171, 0.2);">
              <!-- icon -->
              <img :src="menu.Icon ? `/media/logos/bumaau/${menu.Icon.toLowerCase()}`: ''" class="w-24px h-24px" style="height: 43px" :alt="menu.MenuName" />
              <div class="mt-5" style="font-weight: 600">{{ menuMapping(menu.MenuName) }}</div>
              <div class="outstanding-notif" v-if="getBadge(menu.MenuId) > 0">{{ getBadge(menu.MenuId) }}</div>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  PropType,
  computed,
  onBeforeMount,
  ref,
} from "vue";
import navigator from "@/core/mixins/navigator";
import { Menu } from "@/core/types/entities/dma/Menu";
import { useOnline } from '@vueuse/core'
import { useMenuStore } from "@/store/pinia/application/useMenuStore";
import {
  usePendingTaskMonitorListStore
} from "@/store/pinia/dma/pending-task-monitor/usePendingTaskMonitorListStore"
import {
  isOfflineOrSlowInternetConnection
} from "@/core/helpers/internet-connection"

const props = defineProps({
  data: {
    required: true,
    type: Array as PropType<Menu[]>
  }
})

const emits = defineEmits(["submitEForm", "triggerCamera"])
const online = useOnline()
const store = useMenuStore()
const pendingStore = usePendingTaskMonitorListStore()
const { redirectByName } = navigator()
const counter = ref(0)

const disabledMenuArray = computed(() => {
  return props.data.map((menu) => {
    if (isOfflineOrSlowInternetConnection()) {
      if (menu.MenuName == 'Digital Service Forms' || menu.MenuName == 'Component Intervention Forms' || menu.MenuName == 'Offline Sync Monitoring') return false
      return true
    }
  })
})

const outstandindBadge = computed(() => {
  return store.outstandingBadge
})

onBeforeMount(async () => {
  counter.value = await pendingStore.getPendingWOCount()
})

const getBadge = (menuId: number) => {
  if (menuId == 171) {
    return counter.value
  }
  return outstandindBadge.value.find((x) => {
    return x.menuId == menuId
  })?.outstanding ?? 0
}

const menuMapping = (menuName: string) => {
  if (menuName === "e-Form") {
    return "Digital Service Forms";
  }
  if (menuName === "Approval") {
    return "Digital Service Approvals";
  }
  return menuName;
}

const onButtonClick = (menuName: string, menuLable = "") => {
  const formattedName = menuName.split("/")[2].replaceAll(" ", "").replaceAll("-", "").toLowerCase()
  const offlineMenus = [
    'componentinterventionforms',
    'eformoffline',
    'eformv2',
    'pendingtaskmonitor'
  ]
  if (isOfflineOrSlowInternetConnection()) {
    if (!offlineMenus.includes(formattedName)) {
      return
    }
  }
  const offlineCapabilityMenu = [
    'componentinterventionforms',
    'eform',
    'eformoffline',
    'eformv2',
    'interimengineservice'
  ]
  if (offlineCapabilityMenu.includes(formattedName) || formattedName == 'sosprintlabel') {
    emits("submitEForm", formattedName)
  } else {
    if (menuLable.includes("Guide")) {
      window.open(menuName, '_blank')?.focus()
    } else {
      redirectByName(formattedName)
    }
    emits("triggerCamera")
  }
}
</script>

<style lang="scss" scoped>
  @import "@/assets/sass/core/components/menu/notif-menu.scss";

  .home-icon:not(.menu-button-disabled):hover {
    background-color: #18AF4A;
    color: white;
  }
  .col-md-4 {
    width:24% !important;
  }
  .menu-button-disabled{
    cursor:not-allowed;
  }
</style>
