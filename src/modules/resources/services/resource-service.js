
import { Resource, resourceConverter } from '../model/resource'
import { app } from "@/core/services/firebaseInit"
import { getFirestore, onSnapshot, orderBy, query, collection, doc, getDocs, getDoc, where, addDoc, setDoc, deleteDoc, limit, updateDoc } from "firebase/firestore"; 

import { useLookupStore } from '@/core/state/lookupStore';
import { linkRecommendationReviewToResource, unlinkReviewsFromResource } from '@/modules/reviews/services/review-service';
import { linkRecommendationToResource, unlinkRecommendationFromResource } from '@/modules/recommendations/services/recommendation-service';
import FirestoreKeys from "@/core/services/firebaseKeys";
import { appStore } from '@/core/state/appStore';

const { DateTime } = require('luxon');

const db = getFirestore(app);

export { 
  getResourcesByIds,
  getResource, 
  getResources,
  getTagsForResources, 
  getRelatedResources,
  getRecentlyAdded,
  getPendingResources,
  getPopularResources,
  approveResource, 
  unapproveResource, 
  searchByResourceTypes,
  searchByTagKey, 
  searchByText, 
  updateResource, 
  addResource, 
  deleteResource,
  registerUnapprovedResourcesCounter,
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

const getPopularResources = async function(resourceTypes) {
  const result = [];
  if (resourceTypes && resourceTypes.length > 0) {

    const q =query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
    where("resourceType", "in", resourceTypes),
    where("isFavourite", "==", true)
    );
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      result.push(new Resource(doc.data()));
    });
  }
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

const getResourcesByIds = async function(ids) {
  // there's no where id in functionality, but this will result in the same number of records being
  // returned, and hence no billing impact.
  let result = [];
  ids.forEach( async (id) => {
    const resource = await getResource(id);
    if (resource) {
      result.push(resource);
    }
  });
  return result;
}

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

const searchByTagKey = async function(tagKey, resultLimit) {
  if (!resultLimit) {
    resultLimit = 100;
  }
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(resourceConverter), 
    where("tags", "array-contains", tagKey),
    where("approved", "==", true),
    limit(resultLimit),
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
    if (resource.description && resource.displayName && resource.authors) {
      if (resource.description.toLowerCase().includes(text.toLowerCase()) ||
          resource.displayName.toLowerCase().includes(text.toLowerCase()) ||
          resource.authorsList.toLowerCase().includes(text.toLowerCase()) ) {
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

const registerUnapprovedResourcesCounter = async function() {
  const q = query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
    where("approved", "==", false),
  );
  
  onSnapshot(q, (snapshot) => {
    console.log('registerUnapprovedResourcesCounter');
    let count = 0;
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        count += 1;
      }
      if (change.type === "removed") {
        count -= 1;
      }
    });

    // save count to state
    const store = appStore();
    store.incrementUnapprovedResourcesCount(count);
  });
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

  // get the tag keys being used
  let tags = resources.map( r => r.tags );
  // strip out any empties 
  tags = tags.filter( t => t != null && t != undefined && t.length > 0 )
  tags = new Set(tags.flat());
  
  // get full tag lookup item
  const store = useLookupStore()
  let allFullTags = [...tags].map( t => store.tags.find ( st => st.key == t ));

  // remove any resource tags that don't exist in the master tag list anymore
  allFullTags = allFullTags.filter ( t => t != undefined );
  return allFullTags;
}