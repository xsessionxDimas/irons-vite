export default function IronPortalDashboardMenuRoutes(staticTitle: string) {
  return [
    {
      path: '/ironportal/ironportal-dashboard/cbm-compliance',
      name: 'ironportaldashboardcbmcompliance',
      meta: {
        title: `${staticTitle} - IronPortal - CBM Compliance Report`,
      },
      component: () => {
        return import('@/views/iron-portal/dashboard-menu/cbm-compliance/Index.vue')
      },
    }
  ]
}
