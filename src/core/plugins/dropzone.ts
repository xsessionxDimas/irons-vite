import { App } from "vue";
import Dropzone from "dropzone";

/**
 * Initialize Dropzone component
 * @param app vue instance
 */
export function initDropzone(app: App<Element>) {
  app.use(Dropzone);
}
