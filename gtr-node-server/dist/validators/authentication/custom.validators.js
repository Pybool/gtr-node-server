"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
exports.validateEmail = validateEmail;
exports.validatePhone = validatePhone;
exports.validateLongText = validateLongText;
exports.validateBase64Images = validateBase64Images;
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePhone(phoneNumber) {
    const numericPhoneNumber = phoneNumber.replace(/\D/g, "");
    const nigerianPhoneNumberRegex = /^(?:\+234|0)([789]\d{9})$/;
    return nigerianPhoneNumberRegex.test(numericPhoneNumber);
}
function validateLongText(comment, wordLimit = 500) {
    const trimmedComment = comment.trim();
    const words = trimmedComment.split(/\s+/);
    return words.length <= wordLimit;
}
function validateBase64Images(base64Images) {
    if (!Array.isArray(base64Images)) {
        base64Images = [base64Images];
    }
    function isBase64JPEGImage(str) {
        const base64JPEGRegex = /^data:image\/jpeg;base64,([A-Za-z0-9+/=])+$/;
        return base64JPEGRegex.test(str);
    }
    for (const item of base64Images) {
        if (typeof item !== "string" || !isBase64JPEGImage(item)) {
            return false;
        }
    }
    return true;
}
exports.utils = {
    joinStringsWithSpace: (stringsArray) => {
        return stringsArray.join(" ");
    },
};
