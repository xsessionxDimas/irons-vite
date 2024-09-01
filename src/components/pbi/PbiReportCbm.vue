<template>
  <div
    v-loading="loading"
    ref="reportContainer"
    class="my-5"
    style="height: 90vh"
  ></div>
</template>

<script lang="ts" setup>
import {
  computed,
  ComputedRef,
  onMounted,
  ref,
  defineProps,
  defineEmits,
  onUnmounted
} from "vue";
import { Actions } from "../../store/enums/PbiEmbeddedEnums";
import * as pbi from "powerbi-client";
import { usePbiEmbeddedStore } from '../../store/templates/usePbiEmbeddedStore'
import { PbiConfig } from "../../core/types/entities/PbiConfig";
import { dateToUTC } from "../../core/helpers/date-format";
import { useRouter } from "vue-router";

const props = defineProps([
  "reportName",
  "analyticPage",
  "visibletab",
  "idPageName",
  "showFilter",
  "isPublic",
  "pbiReportId",
  "pbiWorkspaceId",
  "isHideVisualHeaders",
  "isTransparent",
  "background"
])
const emits = defineEmits(["handle-click"])
const store = usePbiEmbeddedStore();
const router = useRouter();

// HTML REFS
const reportContainer = ref<HTMLDivElement>();
let report;
const minutesBeforeExpiration = 5;
const intervalTime = 300000;
const intervalValue = ref<number>(0);

// start: COMPUTED ==============================================
const loading: ComputedRef<boolean> = computed(() => {
  return store.getIsDashboardConfigLoading;
});
const generatePageName: ComputedRef<string> = computed(() => {
  return `${props.analyticPage}-${props.idPageName}`;
});
const pbiConfig: ComputedRef<PbiConfig> = computed(() => {
  return store.getDashboardConfigPbi;
});
// end: COMPUTED ==============================================

// start: METHODS ===============================================
const setConfigObject = () => {
  const configObject = {
    type: "report",
    tokenType: pbi.models.TokenType.Embed || "",
    accessToken: pbiConfig.value.embedToken.token || "",
    embedUrl: pbiConfig.value.embedReport[0].embedUrl || "",
    id: pbiConfig.value.embedReport[0].reportId || "", // Report Id
    permissions: pbi.models.Permissions.All,
    settings: {
      // background: props.isTransparent ? pbi.models.BackgroundType.Transparent : props.background,
      panes: {
        filters: {
          visible: false,
        },
        pageNavigation: {
          visible:
            typeof props.visibletab == "undefined"
              ? true
              : props.visibletab,
        },
      },
      visualSettings: {
        visualHeaders: [
          {
            settings: {
              visible: props.isHideVisualHeaders ? false : true,
            }
          }
        ]
      },
    },
  };

  if (props.isTransparent) {
    configObject.settings["background"] = pbi.models.BackgroundType.Transparent;
  }
  return configObject
}

const setPBI = () => {
  // CONFIG PBI
  try {
    if (typeof pbiConfig.value !== "undefined") {
      const reportLoadConfig = setConfigObject();

      let powerbi = new pbi.service.Service(
        pbi.factories.hpmFactory,
        pbi.factories.wpmpFactory,
        pbi.factories.routerFactory,
      );
      if (reportContainer.value) {
        report = powerbi.embed(reportContainer.value, reportLoadConfig);
      }

      report.off("loaded");
      if (!props.showFilter) {
        report.on("loaded", async () => {
          // ==============================================================
          // START :: EVENT SELECT DATA TABLE PUSH ROUTE TO EQUIPMENT    ==
          // ==============================================================

          // report.off removes all event handlers for a specific event
          report.off("dataSelected");

          // report.on will add an event listener.
          report.on("dataSelected", function (event) {
            let tempFilter = {
              siteCode: "",
              componentName: "",
              modelUnit: "",
              equipment: ""
            };
            event.detail.dataPoints[0].identity.forEach((e) => {
              if (e.target.column == "site_code") {
                tempFilter.siteCode = e.equals;
              } else if (e.target.column == "component_name") {
                tempFilter.componentName = e.equals;
              } else if (e.target.column == "model_unit") {
                tempFilter.modelUnit = e.equals;
              } else if (e.target.column == "equipment") {
                tempFilter.equipment = e.equals;
              }
            });
            if (
              tempFilter.siteCode != "" &&
              tempFilter.componentName != "" &&
              tempFilter.modelUnit != "" &&
              tempFilter.equipment != ""
            ) {
              router.push(`/ironportal-dashboard/equipment/${tempFilter.siteCode}/${tempFilter.componentName}/${tempFilter.modelUnit}/${tempFilter.equipment}`)
            }
          });

          // ==============================================================
          // END :: EVENT SELECT DATA TABLE PUSH ROUTE TO EQUIPMENT      ==
          // ==============================================================
        });
      }
      report.off("rendered");

      report.off("pageChanged");
      report.on("pageChanged", function (event) {
        handleAnalytic(event.detail.newPage.displayName);
      });

      report.on("error", async function (error) {
        if (error.detail == "TokenExpired") {
          await getAndSetPBIEmbedded(() => {
            updateToken();
          });
        }
        report.off("error");
      });

      report.off("buttonClicked");
      report.on("buttonClicked", (event) => {
        handleClick(event);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleClick = (event) => {
  if (event.detail.type == "WebUrl") {
    getVisuals(report);
  } else if (event.detail.type == "PageNavigation") {
    handleAnalytic(getActivePageName(report));
  }
};

const handleAnalytic = (pageActiveName) => {
  const pageName = pageActiveName;
  const reportPageName = props.analyticPage;
  const payload = {
    nik: "nik",
    email: "email",
    jobtitle: "jobtitle",
    site: "site",
    page: `${reportPageName} - ${pageName}`,
    counter: 1,
  };
  // setUserId(analytics, "email");
  // logEvent(analytics, "buma_au_page_visit", payload);
};

const getAndSetPBIEmbedded = async (callback) => {
  await store[Actions.GET_PBI_CONFIG]({
    reportName: props.reportName,
    pageName: generatePageName.value,
    isPublic: props.isPublic,
    reportId: props.pbiReportId,
    workspaceId: props.pbiWorkspaceId
  });
  callback();
};

const getActivePageName = async (reportPBI) => {
  const pages = await reportPBI.getPages();
  const activePage = pages.filter(function (page) {
    return page.isActive;
  })[0];
  return activePage.displayName;
};

const getVisuals = async (reportPBI) => {
  try {
    const pages = await reportPBI.getPages();

    // Retrieve active page.
    const activePage = pages.filter(function (page) {
      return page.isActive;
    })[0];

    const visuals = await activePage.getVisuals();
    const models = pbi.models;

    type data = {
      data: string | null;
      name: string;
    };

    let finalData = [] as data[];
    const slicer = visuals.filter(function (visual) {
      if (visual.type == "tableEx") {
        finalData.push({
          data: null,
          name: visual.title,
        });
        return true;
      }
    });

    for (let index = 0; index < slicer.length; index++) {
      const result = await slicer[index].exportData(
        models.ExportDataType.Summarized,
      );
      finalData[index].data = result.data;
    }
    emits("handle-click", {
      data: finalData,
      workbookName: activePage.displayName,
    });
  } catch (errors) {
    console.log(errors);
  }
};

const updateToken = async () => {
  await report.setAccessToken(pbiConfig.value.embedToken.token);
  await report.refresh();
};

const checkTokenAndUpdate = () => {
  // Get the current time
  const currentDate = new Date();
  const currentUTC = dateToUTC(currentDate);
  const expiration = Date.parse(pbiConfig.value.embedToken.expiration);

  // Time until token expiration in milliseconds
  const timeUntilExpiration = expiration - currentUTC;
  const timeToUpdate = minutesBeforeExpiration * 60 * 1000;

  // Update the token if it is about to expired
  if (timeUntilExpiration <= timeToUpdate) {
    getAndSetPBIEmbedded(function () {
      updateToken();
    });
  }
};
// end: METHODS ===============================================

onMounted(async () => {
  await getAndSetPBIEmbedded(() => {
    setPBI();
  });

  intervalValue.value = setInterval(() => {
    checkTokenAndUpdate();
  }, intervalTime) as any;
});

onUnmounted(() => {
  if (intervalValue.value) {
    clearInterval(intervalValue.value);
  }
});
</script>
