const menuMapper = {
  mydashboard: "/dashboard",
  personalinfo: "/personal-info",
  todolist: "/todo-list",
  approval: "/todo-list/approval",
  revise: "/todo-list/revise",
  draft: "/todo-list/draft",
  cancel: "/todo-list/cancel",
  approvalhistory: "/todo-list/approval-history",
  hrgsservice: "/hrgs-service",
  leave: "/hrgs-service/leave",
  leaverequest: "/hrgs-service/leave/leave-request",
  pscmservice: "/pscm-service",
  masterdata: "/pscm-service/master-data",
  conditiontypemaster: "/pscm-service/master-data/condition-type",
  materialtypemaster: "/pscm-service/master-data/material-type",
  mapvalclasstomattype: "/pscm-service/master-data/map-valclass",
  mapmatgrouptovalclass: "/pscm-service/master-data/map-matgroup",
  pricelist: "/pscm-service/pricelist",
  taskhistory: "/task-history",
  archive: "/task-history/archive",
  current: "/task-history/current",
}

const breadcrumbMapper = {
  mydashboard: {
    title: "Dashboard",
    pageBreadcrumbPath: ["Home"]
  },
  personalinfo: {
    title: "Personal Info",
    pageBreadcrumbPath: ["Home"]
  },
  todolist: {
    title: "To Do List",
    pageBreadcrumbPath: ["Home"]
  },
  approval: {
    title: "Approval",
    pageBreadcrumbPath: ["To Do List"]
  },
  revise: {
    title: "Revise",
    pageBreadcrumbPath: ["To Do List"]
  },
  draft: {
    title: "Draft",
    pageBreadcrumbPath: ["To Do List"]
  },
  cancel: {
    title: "Cancel",
    pageBreadcrumbPath: ["To Do List"]
  },
  approvalhistory: {
    title: "Approval History",
    pageBreadcrumbPath: ["To Do List"]
  },
  hrgsservice: {
    title: "HR & GS Service",
    pageBreadcrumbPath: ["Home"]
  },
  leave: {
    title: "Leave",
    pageBreadcrumbPath: ["Home", "HR & GS Service"]
  },
  leaverequest: {
    title: "Leave Request",
    pageBreadcrumbPath: ["Home", "HR & GS Service"]
  },
  pscmservice: {
    title: "PSCM Service",
    pageBreadcrumbPath: ["Home"]
  },
  masterdata: {
    title: "Master Data",
    pageBreadcrumbPath: ["Home", "PSCM Service"]
  },
  conditiontypemaster: {
    title: "Condition Type",
    pageBreadcrumbPath: ["Home", "PSCM Service", "Master Data"]
  },
  materialtypemaster: {
    title: "Material Type",
    pageBreadcrumbPath: ["Home", "PSCM Service", "Master Data"]
  },
  mapvalclasstomattype: {
    title: "Map Valuation Class To Material Type",
    pageBreadcrumbPath: ["Home", "PSCM Service", "Master Data"]
  },
  mapmatgrouptovalclass: {
    title: "Map Material Group To Valuation Class",
    pageBreadcrumbPath: ["Home", "PSCM Service", "Master Data"]
  },
  pricelist: {
    title: "Pricelist",
    pageBreadcrumbPath: ["Home", "PSCM Service"]
  },
  taskhistory: {
    title: "Task History",
    pageBreadcrumbPath: ["Home"]
  },
  archive: {
    title: "Archive",
    pageBreadcrumbPath: ["Home", "Task History"]
  },
  current: {
    title: "Current",
    pageBreadcrumbPath: ["Home", "Task History"]
  },
  masterthemes: {
    title: "Theme",
    pageBreadcrumbPath: ["Home"]
  },
}

export { menuMapper, breadcrumbMapper }
