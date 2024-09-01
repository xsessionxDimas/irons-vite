<template>
  <div class="full-page d-flex overflow-hidden vh-100">
    <div style="width:300px; border-right:1px solid #ECECEC;">
      <div class="logo-wrapper d-flex align-items-center ms-1" @click="redirectToDashboard">
        <img style="cursor:pointer" src="/media/logos/logo-whitebg.png" alt="" class="h-40px logo" />
      </div>
      <Menu :data-menu="dataMenu"></Menu>
    </div>
    <div v-if="menu !== 'taskcollection'" class="d-flex flex-fill p-10">
        <Content :model="model" :ps-type="psType" :blob-url="blobUrl"></Content>
    </div>
    <div v-else class="d-flex flex-fill p-10">
      <TaskCollection />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Menu from './components/Menu.vue'
import Content from './components/Content.vue'
import TaskCollection from './components/TaskCollection.vue'
import navigator from '@/core/mixins/navigator'
import {
  computed,
  onBeforeMount,
  watch,
  onUnmounted
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'
import {
  useVersionHistory
} from "@/store/pinia/dma/version-history/useVersionHistory"
import { db } from '@/database/schema/DexieSchema'

const { redirectByName } = navigator()
const route = useRoute()
const store = useVersionHistory()
const router = useRouter()

const dataMenu = computed(() => {
  return store.stateTreeData
})
const menu = computed(() => {
  return route.params?.menu as string ?? ""
})
const model = computed(() => {
  return route.params?.model as string ?? ""
})
const psType = computed(() => {
  return route.params?.pstype as string ?? ""
})
const blobUrl = computed(() => {
  if (model.value == 'General') {
    const menu = store.stateMenuVersionHistory.find((menu) => {
      return menu.label === 'General Features'
    })
    if (menu) {
      return menu.children[0].fileUrl
    }
  } else if (model.value && psType.value) {
    const modelString = model.value.replaceAll("--", "/")
    const modelLevel = store.stateMenuVersionHistory.find((menu) => {
      return menu.model == modelString
    })
    if (modelLevel) {
      const psTypeLevel = modelLevel.children.find((child) => {
        return child.psType == psType.value
      })
      if (psTypeLevel) {
        return psTypeLevel.fileUrl
      }
    }
  }
  return ""
  // return `https://digitaldevbumaausta001.blob.core.windows.net/utility/DMA/BA-SE-P38`
})

const redirectToDashboard = () => {
  redirectByName('ironforms')
}

onBeforeMount(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading the page',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  try {
    const userInfo = await db.userInfo.limit(1).first()
    const siteId = userInfo?.SiteId

    if (siteId) {
      await store.getMenuVersionHistory(siteId);

      let modelParam;
      let psTypeParam;

      // skip search model & pstype if selected menu is task collection
      if (route.params?.menu) {
        return
      }

      if (route.params?.model && route.params?.pstype) {
        modelParam = route.params?.model
        psTypeParam = route.params?.pstype
        store.setSelectedEquipment(modelParam, psTypeParam)
        store.setCollapse(modelParam)
      } else {
        store.setInit()
        modelParam = store.selectedEquipment?.equipmentModel
        psTypeParam = store.selectedEquipment?.psType
      }

      if ((modelParam && psTypeParam)) {
        router.push(`/ironforms/versionhistory/${modelParam}/${psTypeParam}`);
      }
    } else {
      // assuming haven't login
      router.push({ name: "signindma" });
    }
  } catch (error) {
    redirectToDashboard();
  } finally {
    loading.close();
  }
})

watch(() => {
  return model.value || psType.value || menu.value
}, () => {
  if (menu.value !== 'taskcollection') {
    if (model.value && psType.value) {
      router.push(`/ironforms/versionhistory/${model.value}/${psType.value}`)
    } else {
      store.setInit()
      if (store.selectedEquipment.equipmentModel && store.selectedEquipment.psType) {
        router.push(`/ironforms/versionhistory/${store.selectedEquipment.equipmentModel}/${store.selectedEquipment.psType}`)
      }
    }
  }
}, {
  deep: true
})

onUnmounted(() => {
  store.resetInstance()
})
</script>

<style scoped>
.button-wrapper-left {
  position: fixed;
  left: 0;
  bottom: 10px;
  width: 300px
}
</style>
