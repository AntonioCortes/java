import { createComponent } from "../../../../js/component-generator.js";

const tagName = 'component-springboot-conceptos-basicos-dependency-injection';
const htmlFilename = 'dependency-injection.html';

const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
createComponent(tagName, baseUrl + htmlFilename);
