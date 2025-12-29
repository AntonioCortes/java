import { createComponent } from "../../../../js/component-generator.js";

const tagName = 'component-java-tipos-de-datos-tipos-primitivos';
const htmlFilename = 'tipos-primitivos.html';

const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
createComponent(tagName, baseUrl + htmlFilename);
