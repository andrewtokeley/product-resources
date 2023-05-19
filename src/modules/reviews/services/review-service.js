
import { Review, reviewConverter } from '@/modules/reviews/model/review';
import { app } from "@/core/services/firebaseInit"
import { updateDoc, getFirestore, collection, doc, getDoc,getDocs, query, where, addDoc, setDoc, deleteDoc, limit, getCountFromServer } from "firebase/firestore"; 
const { DateTime } = require("luxon");

const db = getFirestore(app);

export { getReview, 
  getReviews,
  getReviewsForResource, 
  getFeaturedReviews,
  linkRecommendationReviewToResource,
  updateReview, 
  addReview, 
  getReviewsByApproval,
  getUnapprovedReviewsCount,
  deleteReview,
  setReviewApprove,
}

const COLLECTION_KEY = "reviews";

const linkRecommendationReviewToResource = async function(recommendationId, resourceId) {
  const q = query(collection(db, COLLECTION_KEY).withConverter(reviewConverter), 
    where("recommendationId", "==", recommendationId),
  );
  const querySnapshot = await getDocs(q);
  // should only be one, but link each to the resouceId
  querySnapshot.forEach((doc) => {
    let review = doc.data();
    review.resourceId = resourceId;
    updateReview(review);
  });
  return true; 
}

const getUnapprovedReviewsCount = async function() {
  const q = query(collection(db, COLLECTION_KEY).withConverter(reviewConverter), 
    where("approved", "==", false),
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count; 
}

/**
 * Return a recommendation record
 * @param {*} id 
 * @returns 
 */
const getReview = async function(id) {
  const ref = doc(db, COLLECTION_KEY, id).withConverter(reviewConverter);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

/**
 * Get's the reviews for a resource, optionally including unapproved ones. Note only admin role can see unapproved reviews.
 * @param {} resourceId 
 * @returns 
 */
const getReviewsForResource = async function(resourceId, includeUnApproved) {
  console.log('get reviews...')
  if (includeUnApproved == null) {
    includeUnApproved = false;
  }
  var q;
  if (includeUnApproved) {
    q = query(collection(db, COLLECTION_KEY)
    .withConverter(reviewConverter), 
    where("resourceId", "==", resourceId));
  } else {
    q = query(collection(db, COLLECTION_KEY)
    .withConverter(reviewConverter), 
    where("resourceId", "==", resourceId),
    where("approved", "==", true));
  }
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Review(doc.data()));
  });
  return result 
}

const getReviews = async function(resultLimit) {
  if (!resultLimit) { resultLimit = 100 }
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(reviewConverter), limit(resultLimit));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Review(doc.data()));
  });
  return result 
}

/**
 * Returns reviews by approval status
 * @returns array of Review instances
 */
const getReviewsByApproval = async function(approved) {
  const q = query(collection(db, COLLECTION_KEY).withConverter(reviewConverter), 
    where("approved", "==", approved),
  );
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Review(doc.data()));
  });
  return result 
}


const getFeaturedReviews = async function(maximum) {
  var results = [];
  var attempts = 0;
  // just in case you get some dupicates we have a few goes at getting unique set
  var maxAttempts = 3;
  if (!maximum) { maximum = 2 }

  while (results.length < maximum && attempts < maxAttempts) {
    let randomKey = doc(collection(db, COLLECTION_KEY)).id;
    const q = query(collection(db, COLLECTION_KEY).withConverter(reviewConverter), 
      where('id', ">=", randomKey),
      where('approved', "==", true),
      limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size == 1) {
      querySnapshot.forEach((doc) => {
        let review = new Review(doc.data());
        // ensure they are for different resources
        if (results.find( r => r.id == review.id)) {
          attempts += 1;
        } else {
          results.push(review);
        }
      });
    } else {
      attempts += 1;
    }
  }
  return results; 
}

const updateReview = async function(review) {
  if (review.id) {    
    const ref = doc(db, COLLECTION_KEY, review.id).withConverter(reviewConverter);
    return await setDoc(ref, review, {merge: true})
  } else {
    return null;
  }
}

const addReview = async function(review) {
  review.dateCreated = DateTime.now();
  review.approved = false;
  let doc = await addDoc(collection(db, COLLECTION_KEY).withConverter(reviewConverter), review);
  return doc.id;
}

const deleteReview = async function(id) {
  const ref = doc(db, COLLECTION_KEY, id).withConverter(reviewConverter);
  return await deleteDoc(ref);
}

const setReviewApprove = async function(id, approve) {
  if (id) {    
    const ref = doc(db, COLLECTION_KEY, id).withConverter(reviewConverter);
    return await updateDoc(ref, { approved: approve });
  } else {
    return null;
  }
}
