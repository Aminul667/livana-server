"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanData = exports.extractMonthInfo = void 0;
const extractMonthInfo = (dateString) => {
    const cleanDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1");
    const dateObj = new Date(cleanDateString);
    const availableMonth = dateObj.toLocaleString("default", { month: "long" });
    const availableMonthNumber = dateObj.getMonth() + 1;
    return { availableMonth, availableMonthNumber };
};
exports.extractMonthInfo = extractMonthInfo;
const cleanData = (payload) => {
    console.log(payload);
};
exports.cleanData = cleanData;
