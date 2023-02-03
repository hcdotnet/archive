"use strict";
/* Collects version information from sources and compiled them into a cohesive list. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWbmVersions = void 0;
const fs_1 = require("fs");
function getWbmVersions(path) {
    return JSON.parse((0, fs_1.readFileSync)(path, "utf8"));
}
exports.getWbmVersions = getWbmVersions;
