/**
  @NOTE
  ** Type menjadi CBM Parameter Name
  ** Model Weight menjadi Model Price Weight
  ** Mapping SOS menjadi Source Oil Data to BUMA Component
  ** Intervention Status menjadi Intervention Status and Follow Up Priority
  ** Recommended Action menjadi Intervention Checks
  ** Risk Management Rating menjadi Component Risk Rating Description
  ** CBM Status menjadi Criticality Logic
  ** CBM Threshold menjadi CBM Parameter Threshold
  ** Component Category menjadi Component Life Threshold
 */

export default function IronPortalConfigurationRoutes(staticTitle: string, menuType: string) {
  return [
    {
      path: "type",
      name: "ironlake-config-type",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - CBM Parameter Name`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/type/Index.vue"
        );
      },
    },
    {
      path: "operator",
      name: "ironlake-config-operator",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Operator`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/operator/Index.vue"
        );
      },
    },
    {
      path: "rating",
      name: "ironlake-config-rating",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Rating`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/rating/Index.vue"
        );
      },
    },
    {
      path: "code-group",
      name: "ironlake-config-code-group",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Code Group`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/code-group/Index.vue"
        );
      },
    },
    {
      path: "action",
      name: "ironlake-config-action",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Action`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/action/Index.vue"
        );
      },
    },
    {
      path: "param-object",
      name: "ironlake-config-parameterobject",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Parameter Object`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/parameter-object/Index.vue"
        );
      },
    },
    {
      path: "model-weight",
      name: "ironlake-config-modelweight",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Model Price Weight`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/model-weight/Index.vue"
        );
      },
    },
    {
      path: "comp-weight",
      name: "ironlake-config-component-weight",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Weight`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/component-weight/Index.vue"
        );
      },
    },
    {
      path: "week",
      name: "ironlake-config-week",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Week`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/week/Index.vue"
        );
      },
    },
    {
      path: "element",
      name: "ironlake-config-element",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Element`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/element/Index.vue"
        );
      },
    },
    {
      path: "dmg-category",
      name: "ironlake-config-damage-category",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Damage Category`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/damage-category/Index.vue"
        );
      },
    },
    {
      path: "damage",
      name: "ironlake-config-damage",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Damage`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/damage/Index.vue"
        );
      },
    },
    {
      path: "cbm-mapping",
      name: "ironlake-config-cbmmapping",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - CBM Mapping`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/cbm-mapping/Index.vue"
        );
      },
    },
    {
      path: "comp-status",
      name: "ironlake-config-componentstatus",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Status`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/component-status/Index.vue"
        );
      },
    },
    {
      path: "compstat-map",
      name: "ironlake-config-componentstatusmapping",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Status Mapping`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/component-status-mapping/Index.vue"
        );
      },
    },
    {
      path: "riskrank-mat",
      name: "ironlake-config-riskrankmaterial",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Risk Rank Material`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/risk-rank-material/Index.vue"
        );
      },
    },
    {
      path: "oem-interval",
      name: "ironlake-config-oeminterval",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - OEM Interval`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          /* webpackChunkName: "ironportal" */ "@/views/iron-portal/iron-portal-configuration/oem-interval/Index.vue"
        );
      },
    },
    {
      path: "item",
      name: "ironlake-config-item",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Item`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/item/Index.vue"
        );
      },
    },
    {
      path: "condition",
      name: "ironlake-config-condition",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Condition`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/condition/Index.vue"
        );
      },
    },
    {
      path: "inspection",
      name: "ironlake-config-inspection",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Inspection`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/inspection/Index.vue"
        );
      },
    },
    {
      path: "area",
      name: "ironlake-config-area",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Area`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/area/Index.vue"
        );
      },
    },
    {
      path: "com-strategy",
      name: "ironlake-config-componentstrategy",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Strategy`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/component-strategy/Index.vue"
        );
      },
    },
    {
      path: "cbm-area-map",
      name: "ironlake-config-cbmareamapping",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - CBM Area Mapping`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/cbm-area-mapping/Index.vue"
        );
      },
    },
    {
      path: "eqp-config",
      name: "ironlake-config-equipmentconfiginironportal",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Equipment Config In IronPortal`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/equipment-config-in-iron-portal/Index.vue"
        );
      },
    },
    {
      path: "map-sos",
      name: "ironlake-config-mappingsos",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Source Oil Data to BUMA Component`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/mapping-sos/Index.vue"
        );
      },
    },
    {
      path: "revise-user",
      name: "ironlake-config-reviseuser",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Revise User`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/revise-user/Index.vue"
        );
      },
    },
    {
      path: "int-status",
      name: "ironlake-config-interventionstatus",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Intervention Status and Follow Up Priority`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/intervention-status/Index.vue"
        );
      },
    },
    {
      path: "rec-action",
      name: "ironlake-config-recommendedaction",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Intervention Checks`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/recommended-action/Index.vue"
        );
      },
    },
    {
      path: "risk-mgt-rat",
      name: "ironlake-config-riskmanagementrating",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Risk Rating Description`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/risk-management-rating/Index.vue"
        );
      },
    },
    {
      path: "cbm-gap",
      name: "ironlake-config-cbmgapthreshold",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - CBM Compliance Gap Threshold`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/cbm-gap-threshold/Index.vue"
        );
      },
    },
    {
      path: "task-type",
      name: "ironlake-config-managementtasktype",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Task Type`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/management-task-type/Index.vue"
        );
      },
    },
    {
      path: "sos-map-bi",
      name: "ironlake-config-sosmapbi",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - SOS Mapping for BI`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/mapping-sos-bi/Index.vue"
        );
      },
    },
    {
      path: "cbm-status",
      name: "ironlake-config-cbmstatus",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Criticality Logic`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/cbm-status/Index.vue"
        );
      },
    },
    {
      path: "cbm-threshld",
      name: "ironlake-config-cbmthreshold",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - CBM Parameter Threshold`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/cbm-threshold/Index.vue"
        );
      },
    },
    {
      path: "comp-risk-rt",
      name: "ironlake-config-componentriskrating",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Risk Rating`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/component-risk-rating/Index.vue"
        );
      },
    },
    {
      path: "comp-categry",
      name: "ironlake-config-componentcategory",
      meta: {
        title: `${staticTitle} - IronPortal - IronPortal Configuration - Component Life Threshold`,
        parentMenu: menuType
      },
      component: () => {
        return import(
          "@/views/iron-portal/iron-portal-configuration/component-category/Index.vue"
        );
      },
    },
  ];
}
