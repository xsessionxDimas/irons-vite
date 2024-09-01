import { useBreadcrumbsStore } from "../../store/templates/useBreadcrumbStore";
import { Actions } from "../../store/enums/StoreEnums";
import { BreadCrumbItem } from "../types/misc/BreadcrumbItem";

const store = useBreadcrumbsStore();

/**
 * Sets current page breadcrumbs
 * @param {string} pageTitle Current page title
 * @param {Array<string>} breadcrumbs Current page breadcrumbs
 */
export const setCurrentPageBreadcrumbs = (
  pageTitle: string,
  breadcrumbs: Array<BreadCrumbItem>
): void => {
  store[Actions.SET_BREADCRUMB_ACTION]({
    title: pageTitle,
    pageBreadcrumbPath: breadcrumbs,
  });
};

/**
 * Sets current page breadcrumbs
 * @param {string} title Current page title name
 */
export const setCurrentPageTitle = (title: string): void => {
  store[Actions.SET_BREADCRUMB_ACTION]({
    title: title,
  });
};
