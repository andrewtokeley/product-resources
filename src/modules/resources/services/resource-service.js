
import { Resource, resourceConverter } from '../model/resource'
import { app } from "@/core/services/firebaseInit"
import { getFirestore, query, collection, doc, getDocs, getDoc, where, addDoc, setDoc, deleteDoc, limit, updateDoc } from "firebase/firestore"; 
import { getAllRecommendations } from '@/modules/recommendations/services/recommendation-service';
const db = getFirestore(app);

export {  
  approveResource, 
  unapproveResource, 
  getResourcesFull, 
  searchByResourceTypes, 
  searchByTag, 
  searchByText, 
  getResource, 
  updateResource, 
  addResource, 
  deleteResource 
}

const COLLECTION_KEY = "resources";

/**
 * @param {*} type 
 * Returns a Resource instance, injecting a recommendations array property
 * @param {*} resultLimit 
 */
const getResourcesFull = async function(type, resultLimit) {
  var resources = await searchByResourceTypes([type], resultLimit);
  var recommendations = await getAllRecommendations()
  for (var i = 0; i<resources.length; i++) {
    let resource = resources[i];
    resource.recommendations = recommendations.filter( r => r.resourceId == resource.id );
    resource.numberOfRecommendations = resource.recommendations.length;
  }
  return resources;
}

const searchByResourceTypes = async function(keys, resultLimit) {
  if (!resultLimit) { resultLimit = 50 }
  const q = query(collection(db, COLLECTION_KEY).withConverter(resourceConverter), 
    where("resourceType.key", "in", keys), limit(resultLimit));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Resource(doc.data()));
  });
  return result
};

const searchByTag = async function(tagKeyValue) {
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(resourceConverter), where("tags", "array-contains", tagKeyValue));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Resource(doc.data()));
  });
  return result
};

const searchByText = async function(text) {

  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(resourceConverter))
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
 * 
 * @param {String} id the id of the resource
 * @returns a new Resource instance 
 */
const getResource = async function(id) {
  const ref = doc(db, COLLECTION_KEY, id).withConverter(resourceConverter);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    console.log('stop');
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