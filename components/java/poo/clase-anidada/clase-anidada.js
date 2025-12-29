import { createComponent } from "../../../../js/component-generator.js";

const tagName = 'component-java-poo-clase-anidada';
const htmlFilename = 'clase-anidada.html';

const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
createComponent(tagName, baseUrl + htmlFilename);
