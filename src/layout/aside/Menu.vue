<template>
  <!--begin::Search Menu-->
  <div class="d-flex align-items-center position-relative my-0 p-5" id="menu-search">
    <input
      type="text"
      v-model="search"
      class="form-control form-control-solid ps-15 rounded search-placeholder-label"
      placeholder="Search menu"
   />
  </div>
  <!--end::Search Menu-->
  <!--begin::Menu wrapper-->
  <div
    id="kt_aside_menu_wrapper"
    ref="scrollElRef"
    class="hover-scroll-overlay-y"
    data-kt-scroll="true"
    data-kt-scroll-activate="{default: false, lg: true}"
    data-kt-scroll-dependencies="#kt_aside_logo, #kt_aside_footer"
    data-kt-scroll-height="auto"
    data-kt-scroll-offset="0"
    data-kt-scroll-wrappers="#kt_aside_menu">
    <!--begin::Menu-->
    <div
      id="#kt_header_menu"
      class="
        menu
        menu-column
        menu-title-gray-800
        menu-state-title-primary
        menu-state-icon-primary
        menu-state-bullet-primary
        menu-arrow-gray-500
        sidebar-overflow"
      data-kt-menu="true">
      <template v-for="(item, i) in basicMenu" :key="i">
        <div v-if="item.IsMenu" class="menu-item">
          <!-- @NOTE CONDITION IF url in MenuName is EXTERNAL Link -->
            <a
              v-if="item.MenuName.includes('https://')"
              target="_blank"
              :href="item.MenuName"
              class="menu-link">
              <span class="menu-bullet">
                <span class="bullet bullet-dot"></span>
              </span>
              <span class="menu-title sidebar-menu-item">{{ item.PageName }}</span>
            </a>
            <router-link
              v-else
              v-slot="{ href, isActive, isExactActive }"
              :to="{ path: item.MenuName }">
              <a
                :class="[isActive && 'active', isExactActive && 'active', isExactActive && 'subMenuActive']"
                href="javascript:void(0)"
                class="menu-link"
                @click="redirectByLink(href)">
                <span class="menu-bullet">
                  <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title sidebar-menu-item">{{ item.PageName }}</span>
              </a>
            </router-link>
        </div>
        <div v-if="!item.IsMenu" class="menu-item">
          <div :class="{ show: hasActiveChildren(item.PageName.toLowerCase()) }"
              class="menu-item menu-accordion"
              data-kt-menu-sub="accordion"
              data-kt-menu-trigger="click">
              <span class="menu-link">
              <span class="menu-icon">
                  <em :class="'fas fa-cog'" class="bi fs-3"></em>
                </span>
                <span class="menu-title sidebar-menu-item">{{ item.PageName }}</span>
                <span class="menu-arrow"></span>
              </span>
              <div
                :class="{ show: hasActiveChildren(item.PageName.toLocaleLowerCase()) }"
                 class="menu-sub menu-sub-accordion">
                <template v-for="(item2, k) in item.Children" :key="k">
                  <div v-if="item2.IsMenu" class="menu-item">
                      <!-- @NOTE CONDITION IF url in MenuName is EXTERNAL Link -->
                      <a
                        v-if="item2.MenuName.includes('https://')"
                        target="_blank"
                        :href="item2.MenuName"
                        class="menu-link">
                        <span class="menu-bullet">
                          <span class="bullet bullet-dot"></span>
                        </span>
                        <span class="menu-title sidebar-menu-item">{{ item2.PageName }}</span>
                      </a>
                      <!--
                        item2.MenuId != 224 untuk meng-hide menu Revise and Overwrite Authority
                        karena menu tersebut hanya untuk keperluan pengecekan apakah user yg login
                        punya hak revise berdasarkan user group
                       -->
                      <router-link
                        v-else-if="item2.MenuId != 224"
                        v-slot="{ href, isActive, isExactActive }"
                        :to="{ path: item2.MenuName }">
                        <a
                          :class="[isActive && 'active', isExactActive && 'active', isExactActive && 'subMenuActive']"
                          href="javascript:void(0)"
                          class="menu-link"
                          @click="redirectByLink(href)">
                          <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                          </span>
                          <span class="menu-title sidebar-menu-item">{{ item2.PageName }}</span>
                        </a>
                      </router-link>
                  </div>
                  <div v-if="!item2.IsMenu" :class="{ show: hasActiveChildren(item2.MenuName),
                    hover: hasActiveChildren(item2.MenuName)}"
                    class="menu-item menu-accordion "
                    data-kt-menu-sub="accordion"
                    data-kt-menu-trigger="click">
                    <span class="menu-link">
                      <span class="menu-bullet">
                        <span class="bullet bullet-dot"></span>
                      </span>
                      <span class="menu-title">{{ item2.PageName }}</span>
                      <span class="menu-arrow"></span>
                    </span>
                    <div
                      class="menu-sub menu-sub-accordion">
                      <template v-for="(item3, j) in item2.Children" :key="j">
                        <div class="menu-item"  style="margin-left:15px">
                          <router-link
                            v-slot="{ href, isActive, isExactActive }"
                            :to="{ path : item3.MenuName }">
                            <a
                              class="menu-link"
                              :class="[isActive && 'active', isExactActive && 'active']"
                              href="javascript:void(0)"
                              @click="redirectByLink(href)">
                              <span class="menu-bullet">
                                <span class="bullet bullet-dot"></span>
                              </span>
                              <span class="menu-title">{{ item3.PageName }}</span>
                            </a>
                          </router-link>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
          </div>
        </div>
      </template>
      <div class="menu-item">
        <div class="menu-content">
          <div class="separator mx-1 my-4"></div>
        </div>
      </div>
    </div>
    <!--end::Menu-->
  </div>
  <!--end::Menu wrapper-->
</template>

<script lang="ts" setup>
import {
  onMounted,
  ref,
  computed,
  watch
} from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { ScrollComponent } from "@/assets/ts/components/_ScrollComponent";
import { MenuComponent } from "@/assets/ts/components/MenuComponent";
import navigator from "@/core/mixins/navigator";
import { useMenuStore } from "@/store/pinia/application/useMenuStore";
import { Menu } from "@/core/types/entities/Menu";

const store = useStore();
const route = useRoute();
const menuStore = useMenuStore();
const scrollElRef = ref<null | HTMLElement>(null);
let search = ref<string>('');

const { redirectByLink } = navigator();

const hasActiveChildren = (match: string) => {
  let pathSplit = route.path.split("/")
  const menuName = `/${pathSplit[1]}/${pathSplit[2]}`
  const parent = basicMenu.value.find((x) => {
    return x.PageName.toLowerCase() == match && x.MenuName == menuName
  })
  if (parent) {
    return parent.Children?.some((m) => {
      return m.MenuName == route.path
    })
  }
  return false
};

const activePage = computed(() => {
  return 'Test'
});

const basicMenu = computed(() => {
  if (typeof (menuStore.menu.getAllProductMenu) !== 'function') return [];
  const product = menuStore.menu.getAllProductMenu(activePage.value);
  product.forEach((p) => {
    /* set direct children */
    p.Children = menuStore.menu.getAllFeatureMenu(p.MenuId)
    /* set grand children */
    p.Children.forEach((f) => {
      f.Children = menuStore.menu.getAllChildMenu(f.MenuId)
    })
  })
  if (search.value) {
    let menu = [] as Menu[]
    product.forEach((p) => {
      const validMenu = searchMenu(p as Menu)
      if (validMenu) {
        menu.push(validMenu)
      }
    })
    return menu
  }
  return product
});

const searchMenu = (menu: Menu): Menu | undefined => {
  const childMenu = menu.Children.filter((c) => {
    return c.PageName.toLowerCase().includes(search.value.toLowerCase())
  })
  if (childMenu.length > 0) {
    menu.Children = childMenu
    return menu
  } else {
    if (menu.PageName.toLowerCase().includes(search.value.toLowerCase())) {
      return menu
    }
  }
  return undefined
}

onMounted(() => {
  ScrollComponent.reinitialization();
  MenuComponent.reinitialization();
  if (scrollElRef.value) {
    scrollElRef.value.scrollTop = 0;
  }
  console.log(route.path)
});

watch(basicMenu, async (newValue) => {
  if (newValue) {
    // trigger scroll to go to active sub menu
    setTimeout(() => {
          document.getElementsByClassName('subMenuActive')[0]?.scrollIntoView({
            behavior: 'smooth'
          })
    }, 200)
  }
}, { deep: true })
</script>

<style lang="scss" scoped>
@import "../../assets/sass/core/components/_variables.scss";

.fas {
  color: #4D4D4D;
}
.sidebar-overflow{
  height: 70vh;
}

.menu-accordion {
  margin: 1px 5px;
  .menu-link {
    .menu-icon {
      .svg-icon-default {
        color: #e0e0e0;
      }
    }
    .menu-title {
      color: #9e9e9e;
    }
    .menu-arrow {
      color: #9e9e9e;
    }
    &:hover:not(.disabled):not(.active) {
      background-color: $light-blue;
      border-radius: 10px;
      .menu-icon {
        .svg-icon-default {
          color: #1565c0;
        }
      }
      .menu-title {
        color: #0d47a1;
      }
      .menu-arrow {
        color: #1565c0;
      }
    }
  }
  &.show {
    .menu-link {
      &:hover {
        background-color: $light-blue;
        border-radius: 10px;
      }
      .menu-icon {
        .svg-icon-default {
          color: #1565c0;
        }
      }
      .menu-title {
        color: #0d47a1;
      }
      .menu-arrow {
        color: #1565c0;
      }
    }
  }
  .menu-sub-accordion {
    .menu-item {
      .menu-link {
        margin: 1px 0;
        .menu-title {
          color: #9e9e9e;
        }
        .menu-bullet {
          .bullet-dot {
            background-color: #eee;
          }
        }

        &:hover:not(.disabled):not(.active) {
          background-color: $light-blue;
          border-radius: 10px;
          .menu-title {
            color: #0d47a1;
          }
          .menu-bullet {
            .bullet-dot {
              background-color: #1565c0;
            }
          }
        }
        &.active {
          background-color: $light-blue;
          border-radius: 10px;
          .menu-title {
            color: #0d47a1;
          }
          .menu-bullet {
            .bullet-dot {
              background-color: #1565c0;
            }
          }
        }
      }
    }
  }
}

.feature-active {
  color: #0d47a1;
}


.menu-item {
  margin: 1px 5px;
  .menu-link {
    .menu-icon {
      .svg-icon-default {
        color: #e0e0e0;
      }
    }
    .menu-title {
      color: #9e9e9e;
      font-size: 12px !important;
    }
    &.active {
      background-color: $light-blue;
      border-radius: 10px;
      .menu-icon {
        .svg-icon-default {
          color: #1565c0;
        }
      }
      .menu-title {
        color: #0d47a1;
      }
    }
    &:hover {
      background-color: $light-blue;
      border-radius: 10px;
      .menu-icon {
        .svg-icon-default {
          color: #1565c0;
        }
      }
      .menu-title {
        color: #0d47a1 !important;
      }
    }
  }
}
</style>
