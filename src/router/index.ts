import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouterView,
} from "vue-router";
import { useBreadcrumbsStore } from "../store/templates/useBreadcrumbStore";
import { useConfigStore } from "../store/templates/useConfigStore";
import { Mutations, Actions } from "../store/enums/StoreEnums";
import { breadcrumbMapper } from "../core/data/menu-mapper";
// ADM Routes
import BusinessPartnerRoutes from "./iron-lake/BusinessPartnerRoutes";
import EquipmentRoutes from "./iron-lake/EquipmentRoutes";
import TaskRoutes from "./iron-lake/TaskRoutes";
import MaintenanceRoutes from "./iron-lake/MaintenanceRoutes";
import ParameterRoutes from "./iron-lake/ParameterRoutes";
import CrackAssignmentRoutes from "./iron-lake/CrackAssignmentRoutes";
import ReportRoutes from "./iron-lake/ReportRoutes";
import EmployeeRoutes from "./iron-lake/EmployeeRoutes";
import AssetsRoutes from "./iron-lake/AssetsRoutes";
import MasterRoutes from "./iron-lake/MasterRoutes";
import ConfigIronPortal from "./iron-lake/ConfigRoutes";
import ILOrganizationUnitRoutes from './iron-lake/IronlakeOrganizationUnitRoutes'
import RoleManagementRoutes from "./iron-lake/RoleManagementRoutes";
// IronPortal Routes
import IronPortalDashboardRoutes from "./iron-portal/IronPortalDashboardRoutes";
import IronPortalConfigurationRoutes from "./iron-portal/IronPortalConfigurationRoutes";
import IronPortalTransactionalRoutes from "./iron-portal/IronPortalTransactionalRoutes";
import IronPortalDashboardMenuRoutes from "./iron-portal/IronPortalDashboardMenuRoutes";
import IronPortalHistoricalRoutes from "./iron-portal/IronPortalHistoricalRoutes";
import {
  useNewCameraStore
} from "../store/pinia/application/refactor/useNewCameraStore";
import { aesDecode } from "../core/helpers/encryption";
import { nextTick } from "vue";
import { db } from "../database/schema/DexieSchema";
import { useAnalyticApi } from "../analytics/api/analyticApi";



const staticTitle = "BUMA AUSTRALIA";

const authPage = (to, from, next) => {
  if (localStorage.getItem('user-menu')) {
    const availableMenu = JSON.parse(aesDecode(localStorage.getItem('user-menu') || '', import.meta.env.VITE_APP_ENC_SALT as string))
    const isAuth = availableMenu.filter((menu) => {
      return menu.MenuName.includes(to.path)
    })
    if (isAuth.length < 1) {
      next({ name: '401' });
    } else {
      next();
    }
  } else {
    next({ name: 'signin' })
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => {
      return import("../layout/NoSideLayout.vue");
    },
    children: [
      {
        path: "/dashboard",
        name: "mydashboard",
        meta: {
          title: `${staticTitle} - Dashboard`,
          analytic: {
            module: 'irons',
            productCode: 'general',
            menu: 'dashboard',
            action: 'view'
          }
        },
        component: () => {
          return import(/* webpackChunkName: "ironforms" */ "../views/Dashboard.vue");
        },
      },
      {
        path: "/personal-info",
        name: "personalinfo",
        meta: {
          title: `${staticTitle} - Personal Info`,
        },
        component: () => {
          return import("../views/Profile.vue");
        },
      },
    ],
  },
  {
    path: "/",
    redirect: "/dashboard",
    component: () => {
      return import("../layout/FullscreenLayout.vue");
    },
    children: [
      // ================================================================
      // ========================== Ash Silo ============================
      // ================================================================
      {
        path: "/ash-silo",
        name: "ashsilo",
        meta: {
          title: `${staticTitle} - Ash Silo Dashboard`,
        },
        beforeEnter: authPage,
        component: () => {
          return import("../views/ash-silo/pbi-embedded/Index.vue")
        },
      },
    ],
  },
  // ================================================================
  // ================= IronPortal Version History ===================
  // ================================================================
  {
    path: "/ironportal/versionhistory",
    name: "changelogIronportal",
    meta: {
      analytic: {
        module: 'irons',
        productCode: 'ironportal',
        menu: 'version history',
        action: 'view'
      }
    },
    component: () => {
      return import(/* webpackChunkName: "ironportal" */ "../views/iron-portal/change-log/Index.vue");
    }
  },
  {
    path: "/",
    component: () => {
      return import("../layout/Layout.vue");
    },
    children: [
      // ================================================================
      // ========================== IronPortal ==========================
      // ================================================================
      {
        path: "/ironportal",
        name: "ironportal",
        beforeEnter: authPage,
        meta: {
          title: `${staticTitle} - IronPortal`,
          analytic: {
            module: 'irons',
            productCode: 'ironportal',
            menu: 'dashboard',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/iron-portal/Landing.vue")
        },
      },
      {
        path: "/ironportal/iron-portal-configuration",
        component: RouterView,
        beforeEnter: authPage,
        children: IronPortalConfigurationRoutes(staticTitle, "IronPortal"),
        redirect: "/ironportal/iron-portal-configuration/type"
      },
      {
        path: "/ironportal/iron-portal-transactional",
        component: RouterView,
        beforeEnter: authPage,
        children: IronPortalTransactionalRoutes(staticTitle),
        redirect: "/ironportal/iron-portal-transactional/counter-reading"
      },
      // ================================================================
      // ======================= Administration =========================
      // ================================================================
      {
        path: "/administration",
        name: "administration",
        meta: {
          title: `${staticTitle} - Administration`
        },
        component: () => {
          return import("../views/administration/Landing.vue")
        },
      },
      // ================================================================
      // =============== Ironlake menus with Breadcrumbs ================
      // ================================================================
      {
        path: "/ironlake",
        name: "ironlake",
        meta: {
          title: `${staticTitle} - Iron Lake`
        },
        component: () => {
          return import(/* webpackChunkName: "ironlake" */ "../views/iron-lake/Landing.vue")
        },
        beforeEnter: authPage,
      },
      {
        path: "/ironlake/business-partner",
        component: RouterView,
        beforeEnter: authPage,
        children: BusinessPartnerRoutes(staticTitle),
      },
      {
        path: "/ironlake/equipment",
        component: RouterView,
        beforeEnter: authPage,
        children: EquipmentRoutes(staticTitle),
      },
      {
        path: "/ironlake/maintenance",
        component: RouterView,
        beforeEnter: authPage,
        children: MaintenanceRoutes(staticTitle),
      },
      {
        path: "/ironlake/task",
        component: RouterView,
        beforeEnter: authPage,
        children: TaskRoutes(staticTitle),
      },
      {
        path: "/ironlake/parameter",
        component: RouterView,
        beforeEnter: authPage,
        children: ParameterRoutes(staticTitle),
      },
      {
        path: "/ironlake/crack-assignment",
        component: RouterView,
        beforeEnter: authPage,
        children: CrackAssignmentRoutes(staticTitle),
      },
      {
        path: "/ironlake/report",
        component: RouterView,
        beforeEnter: authPage,
        children: ReportRoutes(staticTitle),
      },
      {
        path: "/ironlake/employee-management",
        component: RouterView,
        beforeEnter: authPage,
        children: EmployeeRoutes(staticTitle),
      },
      {
        path: "/ironlake/organization-unit",
        component: RouterView,
        beforeEnter: authPage,
        children: ILOrganizationUnitRoutes(staticTitle),
      },
      {
        path: "/ironlake/role-management",
        component: RouterView,
        beforeEnter: authPage,
        children: RoleManagementRoutes(staticTitle),
      },
      {
        path: "/ironlake/config",
        component: RouterView,
        beforeEnter: authPage,
        children: ConfigIronPortal(staticTitle, 'IronLake'),
      },
    ],
  },
  // ================================================================
  // ========================= Iron Lake ============================
  // ================================================================
  {
    path: "/",
    component: () => {
      return import("../layout/IronLakeLayout.vue");
    },
    beforeEnter: authPage,
    children: [
      {
        path: "/ironlake/asset",
        component: RouterView,
        beforeEnter: authPage,
        children: AssetsRoutes(staticTitle),
      },
      {
        path: "/ironlake/master",
        component: RouterView,
        beforeEnter: authPage,
        children: MasterRoutes(staticTitle),
      },
    ],
  },
  // ================================================================
  // ===================== IronPortal Dashboard =====================
  // ================================================================
  {
    path: "/",
    component: () => {
      return import("../layout/IronPortalLayout.vue");
    },
    beforeEnter: authPage,
    children: [
      {
        path: "/ironportal-dashboard",
        name: "ironportaldashboard",
        meta: {
          title: `${staticTitle} - IronPortal`
        },
        component: () => {
          return import(/* webpackChunkName: "ironportal" */ "../views/iron-portal/dashboard/Landing.vue")
        },
      },
      {
        path: "/ironportal-dashboard",
        component: RouterView,
        children: IronPortalDashboardRoutes(staticTitle),
      },
    ],
  },
  // ================================================================
  // ================= IronPortal Dashboard No Menu =================
  // ================================================================
  {
    path: "/",
    component: () => {
      return import("../layout/IronPortalLayoutNoMenu.vue");
    },
    beforeEnter: authPage,
    children: [
      {
        path: "/ironportal/ironportal-dashboard",
        component: RouterView,
        children: IronPortalDashboardMenuRoutes(staticTitle)
      },
    ],
  },
  // ================================================================
  // ================ IronPortal Historical No Menu =================
  // ================================================================
  {
    path: "/",
    component: () => {
      return import("../layout/IronPortalLayoutNoMenu.vue");
    },
    beforeEnter: authPage,
    children: [
      {
        path: "/ironportal/iron-portal-historical",
        component: RouterView,
        children: IronPortalHistoricalRoutes(staticTitle),
        redirect: "/ironportal/iron-portal-historical/comp-health"
      },
    ],
  },
  {
    path: "/",
    component: () => {
      return import("../components/page-layouts/Auth.vue");
    },
    children: [
      {
        path: "/sign-in",
        name: "signin",
        meta: {
          analytic: {
            module: 'irons',
            productCode: 'general',
            menu: 'sign-in',
            action: 'view'
          }
        },
        component: () => {
          return import("../views/crafted/authentication/basic-flow/SignIn.vue");
        },
      },
      {
        path: "/sign-in-dma",
        name: "signindma",
        component: () => {
          return import("../views/crafted/authentication/basic-flow/SignInDMA.vue");
        },
      },
      {
        path: "/password-reset",
        name: "passwordreset",
        component: () => {
          return import(
            "../views/crafted/authentication/basic-flow/PasswordReset.vue"
          );
        },
      },
    ],
  },
  {
    // the 404 route, when none of the above matches
    path: "/404",
    name: "404",
    component: () => {
      return import("../views/crafted/authentication/Error404.vue");
    },
  },
  {
    path: "/500",
    name: "500",
    component: () => {
      return import("../views/crafted/authentication/Error500.vue");
    },
  },
  {
    path: "/401",
    name: "401",
    component: () => {
      return import("../views/crafted/authentication/Error401.vue");
    },
  },
  {
    path: "/ash-silo-report",
    name: "ashsiloreport",
    component: () => {
      return import("../views/public/Index.vue");
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


export default {
  install(app) {
    router.install(app)
    router.afterEach((to, from, failure) => {
      (async function () {
        if (!failure) {
          nextTick(async () => {
            const analyticApi = useAnalyticApi();
            if (analyticApi && analyticApi.provider) {
              const user = await db.userInfo.toCollection().first()
              if (user && user.Email) {
                const userAnalyticPayload = {
                  uniqueId: user.EmployeeId.toString(),
                  name: user.Name,
                  email: user.Email
                }
                const analyticService = analyticApi.provider;
                /* need to set user */
                analyticService.setUser(userAnalyticPayload)
                if (!analyticService.isUserIdentified) return
                const args = to.meta.analytic as AnalyticApiAppInfo & Pick<AnalyticApiOptions, 'productCode'>;
                if (args) {
                  console.log(args)
                  const eventName = `${args.module}_${args.productCode}_${args.menu}_`;
                  analyticService.eventAction(eventName, "view", to.fullPath, args);
                }
              }
            }
          });
          const counter = await db.reloadCounter.toArray()[0]
          if (counter) {
            counter.counter = 1
          }
        }
      })();
    });

    router.onError(async (error) => {
      if (/loading chunk \d* failed./i.test(error.message) || (/loading CSS chunk \d* failed./i.test(error.message))) {
        const counter = await db.reloadCounter.toArray()[0]
        if (!counter) {
          await db.reloadCounter.add({
            counter: 1
          })
        } else {
          if (counter.counter > 5) return
        }
        window.location.reload()
      }
    })

    router.beforeEach(async (to, _from, next) => {
      if (to.fullPath == '/404' && to.redirectedFrom?.path.includes('code=')) {
        return {
          path: '/sign-in',
          force: true
        }
      }

      const cameraStore = useNewCameraStore()      
      const store = useBreadcrumbsStore();
      const configStore = useConfigStore();

      if (to.name == 'ironforms' && _from.name == 'componentinterventionforms' && cameraStore.IsVisible) {
        next(false)
        return ''
      }
      try {
        // reset config to initial state
        configStore[Mutations.RESET_LAYOUT_CONFIG]();
        if (to) {
          store[Actions.SET_BREADCRUMB_ACTION](breadcrumbMapper[to.name as string]);
        }// Scroll page to top on every route change
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
        const title = to.meta.title ? to.meta.title : `${staticTitle}`;
        document.title = `${title}`;
        next();
      } catch (err) {
        console.error(err);
      }
    });
  },
};
