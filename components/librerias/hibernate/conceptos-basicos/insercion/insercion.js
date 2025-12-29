import { createComponent } from "../../../../../js/component-generator.js";

const tagName = 'component-librerias-hibernate-conceptos-basicos-insercion';
const htmlFilename = 'insercion.html';

const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
createComponent(tagName, baseUrl + htmlFilename);
