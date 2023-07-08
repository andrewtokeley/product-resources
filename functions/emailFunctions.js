const functions = require("firebase-functions");
const admin = require("firebase-admin");

/**
 * Function will create an emails document whenever a new
 * review record is added.
 */
exports.emailOnReview = functions.firestore
    .document("reviews/{docId}")
    .onCreate( async (snap, context) => {
      const review = snap.data();
      if (!review) {
        console.log("No data associated with the event");
        return;
      }

      // Get the recommendation and resource objects related
      // to the review.
      // These will both be sent to be used by the email templates.
      let resource = null;
      let recommendation = null;
      let template = null;

      // This is a review for an existing resource
      if (review.resourceId) {
        template = "review";
        const snap = await admin.firestore()
            .collection("resources").doc(review.resourceId).get();
        resource = snap.data();
      }

      if (review.recommendationId) {
        template = "recommendation";
        const snap = await admin.firestore()
            .collection("recommendations").doc(review.recommendationId).get();
        recommendation = snap.data();
      }

      const templateData = {
        ...review,
        ...resource,
        ...recommendation};
      const emailObject = {
        to: "andrewtokeley@gmail.com",
        template: {
          name: template,
          data: templateData,
        },
      };
      return admin.firestore().collection("emails").add(emailObject);
    });
