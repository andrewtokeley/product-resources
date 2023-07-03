import { onDocumentUpdated,} from "firebase-functions/v2/firestore";
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Function will create an emails document whenever a new review record is added. 
 */
exports.emailOnReview = onDocumentUpdated("reviews/{docId}", (event) => {
  
  const snapshot = event.data;
  if (!snapshot) {
      console.log("No data associated with the event");
      return;
  }
  const review = snapshot.data();

  const emailObject = {
    to: 'tokes@andrewtokeley.com',
    message: {
      subject: 'New Review',
      html: 'New recommendation from ' + review.reviewedByName
    }
  }
  return admin.firestore().doc('emails').set(emailObject);
});