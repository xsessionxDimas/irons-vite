export default function TaskRoutes(staticTitle: string) {
  return [
    {
      path: '/ironlake/task/daily-schedule',
      name: 'dailyschedule',
      meta: {
        title: `${staticTitle} - Iron Lake - Task - Daily Schedule`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/task/daily-schedule/Index.vue')
      },
    },
    {
      path: '/ironlake/task/history-daily-schedule',
      name: 'historydailyschedule',
      meta: {
        title: `${staticTitle} - Iron Lake - Task - History Daily Schedule`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/task/history-daily-schedule/Index.vue')
      },
    },
    {
      path: '/ironlake/task/history-crack',
      name: 'historycrack',
      meta: {
        title: `${staticTitle} - Iron Lake - Task - History Crack`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/task/history-crack/Index.vue')
      },
    },
  ]
}
