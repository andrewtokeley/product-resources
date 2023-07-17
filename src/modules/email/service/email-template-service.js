
import { EmailTemplate, emailTemplateConverter } from "@/modules/email/model/emailTemplate";
import { app } from "@/core/services/firebaseInit"
import { getFirestore, collection, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore"; 
import FirestoreKeys from "@/core/services/firebaseKeys";

export { getEmailTemplateTypes, getEmailTemplate, getEmailTemplates, updateEmailTemplate }

const db = getFirestore(app);
const COLLECTION_KEY = FirestoreKeys.EmailTemplatesCollection.key;

/**
 * Adds/Update a template
 * @param {EmailTemplate} email template
 * @returns id of the added record
 */
const updateEmailTemplate = async function(emailTemplate) {
  const ref = doc(db, COLLECTION_KEY, emailTemplate.id).withConverter(emailTemplateConverter);
  return await setDoc(ref, emailTemplate, {merge: true});
}

const getEmailTemplate = async function(id) {
  const ref = doc(db, COLLECTION_KEY, id).withConverter(emailTemplateConverter);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return new EmailTemplate({
      id: id,
      subject: null,
      text: null,
      html: '<p></p>',
    })
  }
}

const getEmailTemplates = async function() {
  const q = query(collection(db, COLLECTION_KEY).withConverter(emailTemplateConverter));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(doc.data());
  });
  return result
}

const getEmailTemplateTypes = function() {
  return [
    {key: 'review', value: 'New Review'},
    {key: 'recommendation', value: 'New Recommendation'},
    {key: 'review-approved', value: 'Review Approved'},
    // {key: 'recommendation-approved', value: 'Recommendation Approved'}, 
  ]
}