import { createComponent } from "../../../../js/component-generator.js";

const tagName = 'component-springboot-test-integracion';
const htmlFilename = 'integracion.html';

const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
createComponent(tagName, baseUrl + htmlFilename);
