export default function TaskRoutes(staticTitle: string) {
  return [
    {
      path: '/ironlake/task/outstanding-service',
      name: 'dailyschedule',
      meta: {
        title: `${staticTitle} - Iron Lake - Task - Outstanding Service`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/task/daily-schedule/Index.vue')
      },
    },
    {
      path: '/ironlake/task/outstanding-service-v1',
      name: 'olddailyschedule',
      meta: {
        title: `${staticTitle} - Iron Lake - Task - Outstanding Service`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/task/daily-schedule-v1/Index.vue')
      },
    },
    {
      path: '/ironlake/task/closed-services',
      name: 'closedservices',
      meta: {
        title: `${staticTitle} - Iron Lake - Task - Closed Services`,
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
