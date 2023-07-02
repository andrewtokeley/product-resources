
import { Email } from "@/modules/email/model/email";
import { app } from "@/core/services/firebaseInit"
import { getFirestore, collection, doc, getDocs, addDoc } from "firebase/firestore"; 
import FirestoreKeys from "@/core/services/firebaseKeys";

export { sendEmail }

const { DateTime } = require('luxon');
const db = getFirestore(app);
const COLLECTION_KEY = FirestoreKeys.EmailCollection.key;

/**
 * Adds a record to the emails collection, ready to be picked up by the cloud function email trigger.
 * @param {Email} email 
 * @returns id of the added record
 */
const sendEmail = async function(email) {
  email.createdDate = DateTime.now();
  let doc = await addDoc(collection(db, COLLECTION_KEY).withConverter(emailConverter), email);
  return doc.id;
}
