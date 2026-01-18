"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTemplateString = void 0;
const processTemplateString = ({ template, args, props, }) => args
    .map((arg) => (typeof arg === "function" ? arg(props) : arg))
    .reduce((acc, cur, i) => acc + cur + template[i + 1], template[0]);
exports.processTemplateString = processTemplateString;
