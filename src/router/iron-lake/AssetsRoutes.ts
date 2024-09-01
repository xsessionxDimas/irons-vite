export default function AssetRoutes(staticTitle: string) {
  return [
    {
      path: "outstanding-service",
      name: "asset-outstanding_service",
      meta: {
        title: `${staticTitle} - Iron Lake - Asset - Outstanding Service`,
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironlake" */ "@/views/iron-lake/task/daily-schedule/Index.vue"
        );
      },
    },
    {
      path: "cbm-parameter",
      name: "asset-cbm_parameter",
      meta: {
        title: `${staticTitle} - Iron Lake - Asset - CBM Parameter`,
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironlake" */ "@/views/iron-lake/maintenance/cbm-parameter/Index.vue"
        );
      },
    },
    {
      path: "media-library",
      name: "asset-media_library",
      meta: {
        title: `${staticTitle} - Iron Lake - Asset - Media Library`,
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironlake" */ "@/views/iron-lake/media-library/Index.vue"
        );
      },
    },
  ];
}

