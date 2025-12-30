import { createComponent } from "https://antoniocortes.github.io/base-webpage/js/component-generator.js";

const tagName = 'component-springboot-test-ejemplos';
const htmlFilename = 'ejemplos.html';

const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
createComponent(tagName, baseUrl + htmlFilename);
