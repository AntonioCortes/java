import { createComponent } from "../../../../js/component-generator.js";

const tagName = 'component-java-programacion-funcional-metodos-streams';
const htmlFilename = 'metodos-streams.html';

const baseUrl = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
createComponent(tagName, baseUrl + htmlFilename);
