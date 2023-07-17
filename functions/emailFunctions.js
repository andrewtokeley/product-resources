const functions = require("firebase-functions");
const admin = require("firebase-admin");

/**
 * Function will trigger an email to the admin advising that a new
 * review has been submitted.
 */
exports.emailOnReviewSubmitted = functions.firestore
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

/**
 * Function will trigger when a review has been approved and
 * send an email to the creator.
 */
exports.emailOnReviewApproved = functions.firestore
    .document("reviews/{docId}")
    .onUpdate( async (change, context) => {
      const previousReviewState = change.before.data();
      const review = change.after.data();

      // only consider newly approved reviews that haven't
      // previously been approved.
      const approved =
        review.approved &&
        !previousReviewState.approved &&
        previousReviewState.dateApproved == null;

      if (approved) {
        // get reviewer's email
        let email = null;
        const snap = await admin.firestore()
            .collection(`users/${review.reviewedByUid}/private`)
            .doc("secure").get();
        const userPrivate = snap.data();
        email = userPrivate.email;

        // get name of resource
        let resource = null;
        if (review.resourceId) {
          const snap = await admin.firestore()
              .collection("resources").doc(review.resourceId).get();
          resource = snap.data();
        }

        if (email && resource) {
          // create email record, sending in review and resource data
          const templateData = {
            ...review,
            ...resource,
          };
          const emailObject = {
            to: email,
            template: {
              name: "review-approved",
              data: templateData,
            },
          };
          return admin.firestore().collection("emails").add(emailObject);
        } else {
          console.log("Can't send approval email - missing email or resource.");
        }
      }
    });
