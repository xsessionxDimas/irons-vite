export default function CrackAssignmentRoutes(staticTitle: string) {
  return [
    {
      path: '/ironlake/crack-assignment/task-crack',
      name: 'taskcrack',
      meta: {
        title: `${staticTitle} - Iron Lake - Crack Assignment - Task Crack`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/crack-assignment/task-crack/Index.vue')
      },
    },
    {
      path: '/ironlake/crack-assignment/location-crack',
      name: 'locationcrack',
      meta: {
        title: `${staticTitle} - Iron Lake - Crack Assignment - Location Crack`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/crack-assignment/location-crack/Index.vue')
      },
    },
    {
      path: '/ironlake/crack-assignment/assignment-lct-crack',
      name: 'assignment-location-crack',
      meta: {
        title: `${staticTitle} - Iron Lake - Crack Assignment - Assignment Location Crack`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/crack-assignment/assignment-location-crack/Index.vue')
      },
    },
  ]
}
