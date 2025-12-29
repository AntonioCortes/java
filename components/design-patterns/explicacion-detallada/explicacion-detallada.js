import { createComponent } from "../../../js/component-generator.js";

const tagName = 'component-design-patterns-explicacion-detallada';
const htmlFilename = 'explicacion-detallada.html';

const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
createComponent(tagName, baseUrl + htmlFilename);
