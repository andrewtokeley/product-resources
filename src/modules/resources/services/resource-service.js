
import { Resource, resourceConverter } from '../model/resource'
import { app } from "@/core/services/firebaseInit"
import { getFirestore, orderBy, query, collection, doc, getDocs, getDoc, where, addDoc, setDoc, deleteDoc, limit, updateDoc } from "firebase/firestore"; 

import { useLookupStore } from '@/core/state/lookupStore';
import { linkRecommendationReviewToResource, unlinkReviewsFromResource } from '@/modules/reviews/services/review-service';
import { linkRecommendationToResource, unlinkRecommendationFromResource } from '@/modules/recommendations/services/recommendation-service';
import FirestoreKeys from "@/core/services/firebaseKeys";

const { DateTime } = require('luxon');

const db = getFirestore(app);

export { 
  getResource, 
  getResources,
  getTagsForResources, 
  getRelatedResources,
  getRecentlyAdded,
  getPendingResources,
  getPopularByType,
  approveResource, 
  unapproveResource, 
  searchByResourceTypes,
  searchByTagKey, 
  searchByText, 
  updateResource, 
  addResource, 
  deleteResource,
  // incrementReviewCount,
  // decrementReviewCount,
}

const COLLECTION_KEY = FirestoreKeys.ResourcesCollection.key;

// const incrementReviewCount = async function(resourceId) {
//   const ref = doc(db, COLLECTION_KEY, resourceId).withConverter(resourceConverter);
//   await updateDoc(ref, { reviewCount: increment(1) });
// }

// const decrementReviewCount = async function(resourceId) {
//   const ref = doc(db, COLLECTION_KEY, resourceId).withConverter(resourceConverter);
//   await updateDoc(ref, { reviewCount: increment(-1) });
// }

const getRecentlyAdded = async function(resultLimit) {
  const q =query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
  where("approved", "==", true),
  orderBy("createdDate", "desc"),
  limit(resultLimit)
  );
  
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Resource(doc.data()));
  });
  return result
}

const getPendingResources = async function(resultLimit) {
  if (!resultLimit) { resultLimit = 50 }
  const q =query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
  where("approved", "==", false),
  );
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Resource(doc.data()));
  });
  return result
}

const getPopularByType = async function(resourceType) {
  const q =query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
  where("resourceType", "==", resourceType),
  where("isFavourite", "==", true)
  );
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Resource(doc.data()));
  });
  return result
}

const getRelatedResources = async function(id) {
  const q =query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
  where("parentResourceId", "==", id),
  where("approved", "==", true),
  );
  
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Resource(doc.data()));
  });
  return result
}
/**
 * Returns approved or unapproved resources of the given types
 * @param {*} keys 
 * @param {*} resultLimit 
 * @param {*} approvedOnly 
 * @returns 
 */
const searchByResourceTypes = async function(keys, resultLimit, approval) {
  if (approval == null) { approval = true; }

  if (!resultLimit) { resultLimit = 50 }
  const q = query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
    where("resourceType", "in", keys), 
    where("approved", "==", approval),
    limit(resultLimit));
  
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Resource(doc.data()));
  });
  return result
};

/**
 * Returns resources matching the typeS and, optionlly, tag.
 * @param {*} type id of the resource type
 * @param {*} tag if of the tag
 * @param {*} resultLimit 
 * @returns 
 */
const getResources = async function(types, tag, resultLimit) {
  if (types == null || types.length == 0) return [];
  if (!resultLimit) { resultLimit = 50 }
  let q;
  if (tag) {
    q = query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
    where("resourceType", "in", types), 
    where("tags", "array-contains", tag),
    limit(resultLimit));
  } else {
    q = query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
      where("resourceType", "in", types), 
      limit(resultLimit));
  }
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Resource(doc.data()));
  });
  return result
};

const searchByTagKey = async function(tagKey) {
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(resourceConverter), 
    where("tags", "array-contains", tagKey),
    where("approved", "==", true)
  );
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Resource(doc.data()));
  });
  return result
};

// const searchByTag = async function(tagKeyValue) {
//   const q = query(collection(db, COLLECTION_KEY)
//     .withConverter(resourceConverter), where("tags", "array-contains", tagKeyValue));
//   const querySnapshot = await getDocs(q);
//   const result = [];
//   querySnapshot.forEach((doc) => {
//     result.push(new Resource(doc.data()));
//   });
//   return result
// };

/**
 * Searches only description, tagid, authors
 * @param {} text 
 * @returns 
 */
const searchByText = async function(text) {

  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(resourceConverter));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    let resource = new Resource(doc.data())
    if (resource.description) {
      if (resource.description.toLowerCase().includes(text.toLowerCase())) {
        result.push(resource);
      }
    }
  });
  return result
};

/**
 * Returns a full resource record
 * 
 * @param {String} id the id of the resource
 * @returns a new Resource instance 
 */
const getResource = async function(id) {
  if (!id) return null;
  const ref = doc(db, COLLECTION_KEY, id).withConverter(resourceConverter);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

const updateResource = async function(resource) {
  if (resource.id) {    
    const ref = doc(db, COLLECTION_KEY, resource.id).withConverter(resourceConverter);
    return await setDoc(ref, resource, {merge: true})
  } else {
    return null;
  }
}

/**
 * Adds a new resource and returns the auto id
 * @param {*} resource 
 * @returns 
 */
const addResource = async function(resource) {

  resource.createdDate = DateTime.now();

  let doc = await addDoc(collection(db, COLLECTION_KEY).withConverter(resourceConverter), resource);

  // if this resource is being added from a recommendation...
  if (resource.recommendationId) {
    await linkRecommendationToResource(resource.recommendationId, doc.id);
    await linkRecommendationReviewToResource(resource.recommendationId, doc.id);
  }
  return doc.id;
}

const deleteResource = async function(id) {
  const ref = doc(db, COLLECTION_KEY, id).withConverter(resourceConverter);
  await deleteDoc(ref);

  // unlink any reviews and recommendation
  await unlinkReviewsFromResource(id);
  await unlinkRecommendationFromResource(id)
}

const approveResource = async function(id) {
  if (id) {    
    const ref = doc(db, COLLECTION_KEY, id).withConverter(resourceConverter);
    return await updateDoc(ref, { approved: true });
  } else {
    return null;
  }
}

const unapproveResource = async function(id) {
  if (id) {    
    const ref = doc(db, COLLECTION_KEY, id).withConverter(resourceConverter);
    return await updateDoc(ref, { approved: false });
  } else {
    return null;
  }
}

/**
 * Returns an array of all the tags used to describe the resources.
 * @param {*} resource 
 * @returns 
 */
const getTagsForResources = function(resources) {
  var tags = resources.map( r => r.tags );
  tags = new Set(tags.flat());
  
  // get full tags
  const store = useLookupStore()
  const allFullTags = [...tags].map( t => store.tags.find ( st => st.key == t ));

  return allFullTags;
}