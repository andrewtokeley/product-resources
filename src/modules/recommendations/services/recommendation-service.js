
import { Recommendation, recommendationConverter } from '../model/recommendation'
import { app } from "@/core/services/firebaseInit"
import { updateDoc, documentId, getFirestore, collection, doc, getDoc,getDocs, query, where, addDoc, setDoc, deleteDoc, limit } from "firebase/firestore"; 
const { DateTime } = require("luxon");

const db = getFirestore(app);

export { getRecommendation, 
  getRecommendations, 
  updateRecommendation, 
  addRecommendation, 
  getNewResourceRecommendations,
  getUnapprovedRecommendations,
  deleteRecommendation,
  getFeaturedRecommendations,
  getAllRecommendations,
  approveRecommendation,
  unapproveRecommendation,
}

const COLLECTION_KEY = "recommendations";

const getRecommendation = async function(id) {
  const ref = doc(db, COLLECTION_KEY, id).withConverter(recommendationConverter);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

const getNewResourceRecommendations = async function() {
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(recommendationConverter), where("resourceId", "==", null));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Recommendation(doc.data()));
  });
  return result 
}

const getUnapprovedRecommendations = async function() {
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(recommendationConverter), where("approved", "==", false));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Recommendation(doc.data()));
  });
  return result 
}

const getAllRecommendations = async function(resultLimit) {
  if (!resultLimit) { resultLimit = 100 }
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(recommendationConverter), limit(resultLimit));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Recommendation(doc.data()));
  });
  return result 
}

const getRecommendations = async function(resourceId) {
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(recommendationConverter), where("resourceId", "==", resourceId));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Recommendation(doc.data()));
  });
  return result 
}

const getFeaturedRecommendations = async function(maximum) {
  var results = [];
  var attempts = 0;
  // just in case you get some dupicates we have a few goes at getting unique set
  var maxAttempts = 3;
  if (!maximum) { maximum = 2 }

  while (results.length < maximum && attempts < maxAttempts) {
    let randomKey = doc(collection(db, COLLECTION_KEY)).id;
    const q = query(collection(db, COLLECTION_KEY).withConverter(recommendationConverter), 
      where(documentId(), ">=", randomKey),
      // where("resourceType.key", "==", referenceTypeKey),
      limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size == 1) {
      querySnapshot.forEach((doc) => {
        let recommendation = new Recommendation(doc.data());
        // ensure they are for different resources
        if (results.find( r => r.resourceId == recommendation.resourceId)) {
          attempts += 1;
        } else {
          results.push(recommendation);
        }
      });
    }
  }
  return results; 
}

const updateRecommendation = async function(recommendation) {
  if (recommendation.id) {    
    const ref = doc(db, COLLECTION_KEY, recommendation.id).withConverter(recommendationConverter);
    return await setDoc(ref, recommendation, {merge: true})
  } else {
    return null;
  }
}

const addRecommendation = async function(recommendation) {
  recommendation.dateCreated = DateTime.now();
  recommendation.approved = false;
  let doc = await addDoc(collection(db, COLLECTION_KEY).withConverter(recommendationConverter), recommendation);
  return doc.id;
}

const deleteRecommendation = async function(id) {
  const ref = doc(db, COLLECTION_KEY, id).withConverter(recommendationConverter);
  return await deleteDoc(ref);
}

const approveRecommendation = async function(id) {
  if (id) {    
    const ref = doc(db, COLLECTION_KEY, id).withConverter(recommendationConverter);
    return await updateDoc(ref, { approved: true });
  } else {
    return null;
  }
}

const unapproveRecommendation = async function(id) {
  if (id) {    
    const ref = doc(db, COLLECTION_KEY, id).withConverter(recommendationConverter);
    return await updateDoc(ref, { approved: false });
  } else {
    return null;
  }
}