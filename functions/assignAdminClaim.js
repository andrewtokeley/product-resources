/**
 * Steps to assign new user admin role;
 * 1. login in to site = this will create a new user in the users collection.
 * 2. Copy the user's UID into the assignAdminClaim function at the end of this
 *  file
 * 3. Re-deploy the app
 * 4. Create a new firestore collection called "tempoAssignClaim"
 * 5  Create a security rule to prevent both read and write to this table - don't want anyone being able to give themselves admin rights!
 * 5. From console, create a new document in the collection with id equal to the users UID.
 * 6. This will trigger the assignAdminClaim cloud function and assign the
 * user as an admin
 * 7. You can then delete the function/collection, if needed
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * Fires when a new document is placed into the tempoAssignClaim table. The document id will be assumed to be the uid of the user to be made admin.
 * Firestore security rules prevent anyone from reading/writing to this table, only project admins can do this (and cloud function's of course)
 */
exports.assignAdminClaim = functions.firestore
    .document("tempoAssignClaim/{tempoId}")
    .onCreate((snap, context) => {
      const claims = {};
      claims["admin"] = true;

      // set to the uid of the user you want to make admin
      return admin.auth().setCustomUserClaims("ETscmyGrhXMGZvuJDGmwCKn4HJk1", claims);
    });
