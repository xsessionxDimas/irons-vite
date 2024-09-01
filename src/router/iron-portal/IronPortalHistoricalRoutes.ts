export default function IronPortalDashboardRoutes(staticTitle: string) {
  return [
    {
      path: '/ironportal/iron-portal-historical/comp-health',
      name: 'componenthealthdata',
      meta: {
        title: `${staticTitle} - IronPortal - Component Health Data`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ '@/views/iron-portal/iron-portal-historical/component-health-data/Index.vue')
      },
    },
  ]
}
