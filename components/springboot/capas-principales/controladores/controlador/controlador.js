import { createComponent } from "../../../../../js/component-generator.js";

const tagName = 'component-springboot-capas-principales-controladores-controlador';
const htmlFilename = 'controlador.html';

const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
createComponent(tagName, baseUrl + htmlFilename);
