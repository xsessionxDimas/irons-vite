export default function EquipmentRoutes(staticTitle: string) {
  return [
    {
      path: '/ironlake/equipment/object-type',
      name: 'objecttype',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Object Type`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/object-type/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/planner-group',
      name: 'plannergroup',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Planner Group`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/planner-group/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/maintenance-work-center',
      name: 'maintenanceworkcenter',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Maintenance Work Center`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/maintenance-work-center/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/cost-center',
      name: 'costcenter',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Cost Center`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/cost-center/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/wbs-element',
      name: 'wbselement',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - WBS Element`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/wbs-element/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/equipment-type',
      name: 'equipmenttype',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Equipment Type`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/equipment-type/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/equipment-group',
      name: 'equipmentgroup',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Equipment Group`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/equipment-group/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/equipment-number',
      name: 'equipmentnumber',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Equipment Number`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/equipment-number/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/level',
      name: 'level',
      meta: {
        title: `${staticTitle} - Iron Lake - Level`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/level/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/equipment-model',
      name: 'equipmentmodel',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment Model`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/equipment-model/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/equipment-status',
      name: 'equipmentstatus',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Equipment Status`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/equipment-status/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/component-type',
      name: 'componenttype',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Component Type`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/component-type/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/component',
      name: 'component',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Component`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/component/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/component-assignment',
      name: 'componentassignment',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Component Assignment`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/component-assignment/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/equipment-assignment',
      name: 'equipmentassignment',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Equipment Assignment`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/equipment-assignment/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/characteristic-value',
      name: 'characteristicvalue',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Characteristic Value`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/characteristic-value/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/characteristic-type-value',
      name: 'characteristictypevalue',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Characteristic Type Value`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/characteristic-type-value/Index.vue')
      },
    },
    // {
    //   path: '/ironlake/equipment/equipment-status',
    //   name: 'equipmentstatus',
    //   meta: {
    //     title: `${staticTitle} - Iron Lake - Equipment - Equipment Status`,
    //   },
    //   component: () => {
    //     return import('@/views/iron-lake/equipment/equipment-status/Index.vue')
    //   },
    // },
    {
      path: '/ironlake/equipment/equipment-char-value',
      name: 'equipmentcharacteristicvalue',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Equipment Characteristic Value`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/equipment-characteristic-value/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/class-characteristic',
      name: 'classcharacteristic',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Class Characteristic`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/class-characteristic/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/class',
      name: 'class',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Class`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/class/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/characteristic-type',
      name: 'characteristictype',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Characteristic Type`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/characteristic-type/Index.vue')
      },
    },
    {
      path: '/ironlake/equipment/status',
      name: 'status',
      meta: {
        title: `${staticTitle} - Iron Lake - Equipment - Status`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/equipment/status/Index.vue')
      },
    },
    {
      path: '/ironlake/assets/equipment/all-equipment',
      name: 'all_equipment',
      meta: {
        title: `${staticTitle} - Iron Lake - All Equipment`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironlake" */ '@/views/iron-lake/assets/equipment/all-equipment/Index.vue')
      },
    },
  ]
}
