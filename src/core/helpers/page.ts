import { useErrorHandleStore} from '../../store/templates/useErrorStore'
import { useMenuStore } from '../../store/templates/useMenuStore'
import {
  Mutations as ErrorHandleMutations
} from "../../store/enums/ErrorHandleEnum";
import { Actions as StoreActions } from "../../store/enums/StoreEnums";
import { setCurrentPageBreadcrumbs } from "../../core/helpers/breadcrumb";

const store = useErrorHandleStore();
const pageStore = useMenuStore();

const initiatePage = ({ pageName, activePage, pageTitle, breadcrumbs, reportPageName }) => {
  store[ErrorHandleMutations.SET_ERROR_PAGES](pageName);
  pageStore[StoreActions.ACTIVE_PAGE](activePage);
  setCurrentPageBreadcrumbs(pageTitle, breadcrumbs)
}

const closePage = ({ pageName, startTime, reportPageName, eventName }) => {
  store[ErrorHandleMutations.SET_ERROR_PAGES](pageName.value);
}

export { initiatePage, closePage }


// write a linked list class in typescript
