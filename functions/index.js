const admin = require("firebase-admin");
admin.initializeApp();

const adminFunctions = require("./adminFunctions");
const emailFunctions = require("./emailFunctions");
exports.assignAdminClaim = adminFunctions.assignAdminClaim;
exports.emailOnReview = emailFunctions.emailOnReview;
