import { createComponent } from "../../../../../js/component-generator.js";

const tagName = 'component-springboot-librerias-spring-cloud-load-balancers';
const htmlFilename = 'load-balancers.html';

const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
createComponent(tagName, baseUrl + htmlFilename);
