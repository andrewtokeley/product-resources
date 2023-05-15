
import { Resource, resourceConverter } from '../model/resource'
import { app } from "@/core/services/firebaseInit"
import { getFirestore, orderBy, query, collection, doc, getDocs, getDoc, where, addDoc, setDoc, deleteDoc, limit, updateDoc } from "firebase/firestore"; 
import { getAllRecommendations } from '@/modules/recommendations/services/recommendation-service';

import { useLookupStore } from '@/core/state/lookupStore';

const { DateTime } = require('luxon');

const db = getFirestore(app);

export { 
  getTagsForResources, 
  approveResource, 
  unapproveResource, 
  getResourcesFull, 
  getRelatedResources,
  searchByResourceTypes,
  searchByTagKey, 
  searchByText, 
  getResource, 
  updateResource, 
  addResource, 
  deleteResource,
  getRecentlyAdded,
}

const COLLECTION_KEY = "resources";

/**
 * @param {*} type 
 * Returns a Resource instance, injecting a recommendations array property
 * @param {*} resultLimit 
 */
const getResourcesFull = async function(type, resultLimit) {
  // get all, including the un-approved
  var resources = await searchByResourceTypes([type], resultLimit, false);
  var recommendations = await getAllRecommendations()
  for (var i = 0; i<resources.length; i++) {
    let resource = resources[i];
    resource.recommendations = recommendations.filter( r => r.resourceId == resource.id );
    resource.numberOfRecommendations = resource.recommendations.length;
  }
  return resources;
}

const getRecentlyAdded = async function(resultLimit) {
  const q =query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
  orderBy("createdDate", "asc"),
  limit(resultLimit)
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

const searchByResourceTypes = async function(keys, resultLimit, approvedOnly) {
  let _approvedOnly = (approvedOnly == null) ? true : approvedOnly;
  if (!resultLimit) { resultLimit = 50 }
  var q;
  if (_approvedOnly) {
    q = query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
    where("resourceType", "in", keys), 
    where("approved", "==", true),
    limit(resultLimit));
  } else {
    q = query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
    where("resourceType", "in", keys), 
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
    .withConverter(resourceConverter), where("tags", "array-contains", tagKey));
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

const addResource = async function(resource) {
  resource.createdDate = DateTime.now();
  let doc = await addDoc(collection(db, COLLECTION_KEY).withConverter(resourceConverter), resource);
  return doc.id;
}

const deleteResource = async function(id) {
  const ref = doc(db, COLLECTION_KEY, id).withConverter(resourceConverter);
  return await deleteDoc(ref);
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