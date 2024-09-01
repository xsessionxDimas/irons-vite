export default function IronPortalTransactionalRoutes(staticTitle: string) {
  return [
    {
      path: "/ironportal/iron-portal-transactional/cycle",
      name: "cycle",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Transactional - Cycle`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-transactional/cycle/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-transactional/counter-reading",
      name: "counterreading",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Transactional - Counter Reading`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-transactional/counter-reading/Index.vue")
      },
    },
    {
      path: "/ironportal/iron-portal-transactional/comp-replace",
      name: "componentreplacement",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Transactional - Component Replacement`,
      },
      component: () => {
        return import(/* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-transactional/component-replacement/Index.vue")
      },
    },
  ]
}
