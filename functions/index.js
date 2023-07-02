
/**
 * These cloud functions are used to assign the admin role to a given user.
 *
 * Steps to assign new user admin role;
 * 1. login in to site = this will create a new user in the users collection.
 * 2. Copy the user's UID into the assignAdminClaim function at the end of this
 *  file
 * 3. Re-deploy the app
 * 4. Create a new firestore collection called "tempoAssignClaim"
 * 5. Create a new document in the collection with id equal to the users UID.
 * 6. This will trigger the assignAdminClaim cloud function and assign the
 * user as an admin
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const FieldValue = require("firebase-admin").firestore.FieldValue;

import {
  onDocumentCreated,
  Change,
  FirestoreEvent
} from "firebase-functions/v2/firestore";


admin.initializeApp();
// /**
//  * UnauthenticatedError
//  */
// class UnauthenticatedError extends Error {
//   /**
//    * Constructor
//    * @param {*} message
//    */
//   constructor(message) {
//     super(message);
//     this.message = message;
//     this.type = "UnauthenticatedError";
//   }
// }

// /**
//  *
//  */
// class NotAnAdminError extends Error {
//   /**
//    *
//    * @param {*} message
//    */
//   constructor(message) {
//     super(message);
//     this.message = message;
//     this.type = "NotAnAdminError";
//   }
// }

// /**
//  *
//  */
// class InvalidRoleError extends Error {
//   /**
//    *
//    * @param {*} message
//    */
//   constructor(message) {
//     super(message);
//     this.message = message;
//     this.type = "InvalidRoleError";
//   }
// }

// /**
//  *
//  * @param {*} role
//  * @return {*} role
//  */
// function roleIsValid(role) {
//   // To be adapted with your own list of roles
//   const validRoles = ["admin"];
//   return validRoles.includes(role);
// }

// /**
//  *
//  */
// exports.createUser = functions.https.onCall(async (data, context) => {
//   try {
//     // Checking that the user calling the Cloud Function is authenticated
//     if (!context.auth) {
//       throw new UnauthenticatedError("The user is not authenticated.");
//     }

//     // Checking that the user calling the Cloud Function is an Admin user
//     // uid of the user calling the Cloud Function
//     const callerUid = context.auth.uid;
//     const callerUserRecord = await admin.auth().getUser(callerUid);
//     if (!callerUserRecord.customClaims.admin) {
//       throw new NotAnAdminError("Only Admin users can create new users.");
//     }

//     // Checking that the new user role is valid
//     const role = data.role;
//     if (!roleIsValid(role)) {
//       throw new InvalidRoleError("The " + role + " role is not a valid role");
//     }

//     const userCreationRequest = {
//       userDetails: data,
//       status: "Pending",
//       createdBy: callerUid,
//       createdOn: FieldValue.serverTimestamp(),
//     };

//     const userCreationRequestRef =
//     await admin.firestore().collection("userCreationRequests")
//         .add(userCreationRequest);

//     const newUser = {
//       email: data.email,
//       emailVerified: false,
//       password: data.password,
//       displayName: data.firstName + " " + data.lastName,
//       disabled: false,
//     };

//     const userRecord = await admin
//         .auth()
//         .createUser(newUser);

//     const userId = userRecord.uid;

//     const claims = {};
//     claims[role] = true;

//     await admin.auth().setCustomUserClaims(userId, claims);

//     await admin.firestore().collection("users").doc(userId).set(data);

//     await userCreationRequestRef.update({status: "Treated"});

//     return {result: "The new user has been successfully created."};
//   } catch (error) {
//     if (error.type === "UnauthenticatedError") {
//       throw new functions.https.HttpsError("unauthenticated", error.message);
//     } else if (error.type === "NotAnAdminError" ||
//     error.type === "InvalidRoleError") {
//       throw new
//       functions.https.HttpsError("failed-precondition", error.message);
//     } else {
//       throw new
//       functions.https.HttpsError("internal", error.message);
//     }
//   }
// });

exports.assignAdminClaim = functions.firestore
    .document("tempoAssignClaim/{tempoId}")
    .onCreate((snap, context) => {
      const claims = {};
      claims["admin"] = true;

      // andrewtokeley@gmail.com
      return admin.auth()
          .setCustomUserClaims("ETscmyGrhXMGZvuJDGmwCKn4HJk1", claims);
      // .setCustomUserClaims("FY7Cci1CCYglbGUGQftmCJplsEW2", claims);
    });


    /**
     * When a review is added send admin an email
     */
exports.sendNewRecommendationEmail = onDocumentCreated("emails/{emailId}", (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    return;
  }
  const data = snapshot.data();
  
  // check whether the review is part of a new recommendation
  if (data.recommendationId) {
    
  } else {

  }

})