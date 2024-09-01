export default function MasterRoutes(staticTitle: string) {
  return [
    {
      path: "site",
      name: "master-site",
      meta: {
        title: `${staticTitle} - Iron Lake - Master - Site`,
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironlake" */ "@/views/iron-lake/business-partner/site/Index.vue"
        );
      },
    },
    {
      path: "employee",
      name: "master-employee",
      meta: {
        title: `${staticTitle} - Iron Lake - Master - Employee`,
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironlake" */ "@/views/iron-lake/employee-management/employee/Index.vue"
        );
      },
    },
    {
      path: "equipment",
      name: "master-equipment",
      meta: {
        title: `${staticTitle} - Iron Lake - Master - Equipment`,
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironlake" */ "@/views/iron-lake/assets/equipment/all-equipment/Index.vue"
        );
      },
    },
    {
      path: "media-library",
      name: "media-library",
      meta: {
        title: `${staticTitle} - Iron Lake - Master - Media Library`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/media-library/Index.vue')
      },
    },
  ];
}
