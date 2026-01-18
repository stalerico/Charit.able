"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* global JSX HTMLElement */
const clsx_1 = __importDefault(require("clsx"));
const react_1 = __importDefault(require("react"));
const template_string_1 = require("./template-string");
function elementFactory(element) {
    return function (twClassName, ...args) {
        if (typeof twClassName === "object") {
            return (_a) => {
                var { children, className } = _a, props = __rest(_a, ["children", "className"]);
                return react_1.default.createElement(element, Object.assign({ className: (0, clsx_1.default)([
                        className,
                        (0, template_string_1.processTemplateString)({
                            template: twClassName,
                            args,
                            props: Object.assign({ children, className }, props),
                        }),
                    ]) }, props), children);
            };
        }
        if (typeof twClassName === "string") {
            return (_a) => {
                var { children, className } = _a, props = __rest(_a, ["children", "className"]);
                return react_1.default.createElement(element, Object.assign({ className: (0, clsx_1.default)([twClassName, className]) }, props), children);
            };
        }
        if (typeof twClassName === "function") {
            return (_a) => {
                var { children, className } = _a, props = __rest(_a, ["children", "className"]);
                //@ts-ignore
                const classNameFromProps = twClassName(Object.assign({ children }, props));
                return react_1.default.createElement(element, Object.assign({ className: (0, clsx_1.default)([classNameFromProps, className]) }, props), children);
            };
        }
        throw new TypeError(`Invalid type of twClassName : ${typeof twClassName}`);
    };
}
exports.default = elementFactory;
