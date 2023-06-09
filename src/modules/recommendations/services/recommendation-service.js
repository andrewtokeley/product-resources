
import { Recommendation, recommendationConverter } from '../model/recommendation'
import { app } from "@/core/services/firebaseInit"
import { deleteUnlinkedReviewsForRecommendation, getReviewForRecommendation } from '@/modules/reviews/services/review-service';
import { updateDoc, getFirestore, collection, doc, getDoc,getDocs, query, where, addDoc, setDoc, deleteDoc, limit, getCountFromServer } from "firebase/firestore"; 
import FirestoreKeys from '@/core/services/firebaseKeys';

const { DateTime } = require("luxon");

const db = getFirestore(app);

export { getRecommendation, 
  getRecommendations, 
  getUnlinkedRecommendations,
  getUnlinkedRecommendationsCount,
  updateRecommendation, 
  addRecommendation, 
  deleteRecommendation,
  approveRecommendation,
  unapproveRecommendation,
  linkRecommendationToResource,
  unlinkRecommendationFromResource
}

const COLLECTION_KEY = FirestoreKeys.RecommendationsCollection.key;

/**
 * Return a recommendation record
 * @param {*} id 
 * @returns 
 */
const getRecommendation = async function(id) {
  const ref = doc(db, COLLECTION_KEY, id).withConverter(recommendationConverter);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

const unlinkRecommendationFromResource = async function(resourceId) {
  const q = query(collection(db, COLLECTION_KEY).withConverter(recommendationConverter), 
  where("resourceId", "==", resourceId),
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    let recommendation = doc.data();
    recommendation.resourceId = null;
    recommendation.approved = false;
    await updateRecommendation(recommendation);
  });
  return true; 
}

const linkRecommendationToResource = async function(recommendationId, resourceId) {
  const ref = doc(db, COLLECTION_KEY, recommendationId);
  await setDoc(ref, { resourceId: resourceId }, { merge: true });
  return true; 
}

const getUnlinkedRecommendationsCount = async function() {
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(recommendationConverter), 
    where("approved", "==", false),
    where("resourceId", "==", null),
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count; 
}

const getUnlinkedRecommendations = async function() {
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(recommendationConverter), 
    where("approved", "==", false),
    where("resourceId", "==", null),
  );
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach(async (doc) => {
    let recommendation = new Recommendation(doc.data())
    result.push(recommendation);
  });

  for (let i=0; i<result.length;i++) {
    // grab the review for this recommendation
    let review = await getReviewForRecommendation(result[i].id);
    result[i].review = review;
  }
  return result 
}

const getRecommendations = async function(resultLimit) {
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
  // this is how we know it hasn't been linked yet.
  recommendation.resourceId = null;
  let doc = await addDoc(collection(db, COLLECTION_KEY).withConverter(recommendationConverter), recommendation);
  return doc.id;
}

/**
 * Deletes a recommendation record and any associated reviews (should only be one) that haven't been linked to a resource yet.
 * @param {*} id 
 * @returns 
 */
const deleteRecommendation = async function(recommendationId) {
  const ref = doc(db, COLLECTION_KEY, recommendationId).withConverter(recommendationConverter);
  await deleteDoc(ref);
  await deleteUnlinkedReviewsForRecommendation(recommendationId);
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
