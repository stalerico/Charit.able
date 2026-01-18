"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tw = void 0;
/**
 *
 * @param {TemplateStringsArray} template
 * @returns {string}
 *
 * @description This function is helper function for tailwind intellisense. It does not support about any arguments passed into it.
 */
const tw = (template) => typeof template === "string" ? template : template[0];
exports.tw = tw;
