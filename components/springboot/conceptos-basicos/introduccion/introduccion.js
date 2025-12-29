import { createComponent } from "../../../../js/component-generator.js";

const tagName = 'component-springboot-conceptos-basicos-introduccion';
const htmlFilename = 'introduccion.html';

const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
createComponent(tagName, baseUrl + htmlFilename);
