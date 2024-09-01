export default function ReportRoutes(staticTitle: string) {
  return [
    {
      path: '/ironlake/report/report-ironform',
      name: 'historicaldmaeform',
      meta: {
        title: `${staticTitle} - Iron Lake - Report - Report IronForms`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/report/report-dma/Index.vue')
      },
    },
    {
      path: '/ironlake/report/taskkey-monitoring',
      name: 'taskkeymonitoring',
      meta: {
        title: `${staticTitle} - Iron Lake - Report - TaskKey Monitoring`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/report/task-key-monitoring/Index.vue')
      },
    },
  ]
}
