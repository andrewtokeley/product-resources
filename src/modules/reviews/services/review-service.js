
import { Review, reviewConverter } from '@/modules/reviews/model/review';
import { app } from "@/core/services/firebaseInit"
import { updateDoc, getFirestore, collection, doc, getDoc,getDocs, query, where, addDoc, setDoc, deleteDoc, limit, getCountFromServer } from "firebase/firestore"; 
const { DateTime } = require("luxon");
import { Timestamp } from "firebase/firestore";

const db = getFirestore(app);

export { getReview, 
  getReviews,
  getReviewsForResource, 
  getReviewForRecommendation,
  getReviewsByUser,
  getFeaturedReviews,
  linkRecommendationReviewToResource,
  unlinkReviewsFromResource,
  updateReview, 
  addReview, 
  getReviewsByApproval,
  getUnapprovedReviewsCount,
  deleteReview,
  setReviewApprove,
  deleteUnlinkedReviewsForRecommendation,
}

const COLLECTION_KEY = "reviews";


const getReviewsByUser = async function (uid) {
  const q = query(collection(db, COLLECTION_KEY).withConverter(reviewConverter), 
  where("reviewedByUid", "==", uid),
  where("approved", "==", true),
  );
  let results = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    results.push(doc.data());
  });
  return results; 
}

const unlinkReviewsFromResource = async function(resourceId) {
  const q = query(collection(db, COLLECTION_KEY).withConverter(reviewConverter), 
  where("resourceId", "==", resourceId),
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (doc) => {
    let review = doc.data();
    review.resourceId = null;
    review.approved = false;
    await updateReview(review);
  });
  return true; 
};

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
 * 
 * @param {} resourceId 
 * @returns 
 */
const getReviewsForResource = async function(resourceId, includeUnApproved) {
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

const getReviewForRecommendation = async function(recommendationId) {
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(reviewConverter),
    where("recommendationId", "==", recommendationId),
    limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size == 1) {
    return new Review(querySnapshot.docs[0].data());
  }
  return null;
}

/**
 * Get all reviews up to the limit
 * @param {*} resultLimit 
 * @returns 
 */
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

/**
 * Deletes any reviews that are associated with a recommendation but have not been linked to a resource yet.
 * @param {*} recommendationId 
 * @returns 
 */
const deleteUnlinkedReviewsForRecommendation = async function(recommendationId) {
  const q = query(collection(db, COLLECTION_KEY).withConverter(reviewConverter), 
    where('recommendationId', "==", recommendationId),
    where('resourceId', '==', null));
  const querySnapshot = await getDocs(q);
  let results = [];
  querySnapshot.forEach((doc) => {
    results.push(doc.ref);
  });
  for (let i = 0; i< results.length; i++) {
    await delete(results[i]);
  }
  return true;
}

const setReviewApprove = async function(id, approve) {
  
  if (id) {    
    const ref = doc(db, COLLECTION_KEY, id).withConverter(reviewConverter);
    return await updateDoc(ref, { 
      approved: approve,
      dateApproved: approve ? Timestamp.fromDate(new Date()) : null });
  } else {
    return null;
  }
}
