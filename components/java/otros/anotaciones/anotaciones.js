import { createComponent } from "../../../../js/component-generator.js";

const tagName = 'component-java-otros-anotaciones';
const htmlFilename = 'anotaciones.html';

const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
createComponent(tagName, baseUrl + htmlFilename);
