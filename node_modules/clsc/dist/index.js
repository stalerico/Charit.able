"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tw = void 0;
const html_elements_1 = __importDefault(require("./html-elements"));
const element_factory_1 = __importDefault(require("./element-factory"));
const template_tag_1 = require("./template-tag");
Object.defineProperty(exports, "tw", { enumerable: true, get: function () { return template_tag_1.tw; } });
function classed(component) {
    return (0, element_factory_1.default)(component);
}
html_elements_1.default.forEach((element) => {
    Object.defineProperty(classed, element, { value: (0, element_factory_1.default)(element) });
});
exports.default = classed;
