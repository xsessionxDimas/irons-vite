import objectPath from "object-path";
import { Actions } from "../../store/enums/StoreEnums";
import { useBodyStore } from "../../store/templates/useBodyStore";
import { config } from "../../core/helpers/config";

const store = useBodyStore();

class LayoutService {
  /**
   * @description initialize default layout
   */
  public static init(): void {
    LayoutService.initLayout();
    LayoutService.initHeader();
    LayoutService.initToolbar();
    LayoutService.initAside();
    LayoutService.initFooter();
  }

  /**
   * @description init layout
   */
  public static initLayout(): void {
    store[Actions.ADD_BODY_ATTRIBUTE]({
      qulifiedName: "id",
      value: "kt_body",
    });

    if (objectPath.get(config.value, "loader.display")) {
      store[Actions.ADD_BODY_CLASSNAME]("page-loading-enabled");
      store[Actions.ADD_BODY_CLASSNAME]("page-loading");
    }
  }

  /**
   * @description init header
   */
  public static initHeader(): void {
    if (objectPath.get(config.value, "header.fixed.desktop")) {
      store[Actions.ADD_BODY_CLASSNAME]("header-fixed");
    }

    if (objectPath.get(config.value, "header.fixed.tabletAndMobile")) {
      store[Actions.ADD_BODY_CLASSNAME]("header-tablet-and-mobile-fixed");
    }
  }

  /**
   * @description init toolbar
   */
  public static initToolbar(): void {
    if (!objectPath.get(config.value, "toolbar.display")) {
      return;
    }

    store[Actions.ADD_BODY_CLASSNAME]("toolbar-enabled");

    if (objectPath.get(config.value, "toolbar.fixed")) {
      store[Actions.ADD_BODY_CLASSNAME]("toolbar-fixed");
    }
    store[Actions.ADD_BODY_CLASSNAME]("toolbar-tablet-and-mobile-fixed");
  }

  /**
   * @description init aside
   */
  public static initAside(): void {
    if (!objectPath.get(config.value, "aside.display")) {
      return;
    }

    // Enable Aside
    store[Actions.ADD_BODY_CLASSNAME]("aside-enabled");

    // Minimized
    if (
      objectPath.get(config.value, "aside.minimized") &&
      objectPath.get(config.value, "aside.toggle")
    ) {
      store[Actions.ADD_BODY_ATTRIBUTE]({
        qulifiedName: "data-kt-aside-minimize",
        value: "on",
      });
    }

    if (objectPath.get(config.value, "aside.fixed")) {
      // Fixed Aside
      store[Actions.ADD_BODY_CLASSNAME]("aside-fixed");
    }

    // Default minimized
    if (objectPath.get(config.value, "aside.minimized")) {
      store[Actions.ADD_BODY_ATTRIBUTE]({
        qulifiedName: "data-kt-aside-minimize",
        value: "on",
      });
    }
  }

  /**
   * @description init footer
   */
  public static initFooter(): void {
    // Fixed header
    if (objectPath.get(config.value, "footer.width") === "fixed") {
      store[Actions.ADD_BODY_CLASSNAME]("footer-fixed");
    }
  }
}

export default LayoutService;
