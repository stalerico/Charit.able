"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let config;
const initConfig = () => {
    try {
        if (process.env.NODE_ENV === "test") {
            config = {};
            return;
        }
    }
    catch (e) { }
    try {
        config = require("../../../clsc.config");
    }
    catch (e) {
        config = {};
    }
};
initConfig();
const initElements = (elements) => {
    const { include, exclude } = config;
    if (include) {
        return include;
    }
    if (exclude) {
        return elements.filter((element) => !exclude.includes(element));
    }
    return elements;
};
exports.default = initElements;
