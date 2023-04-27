
import { Resource, resourceConverter } from '../model/resource'
import { app } from "@/core/services/firebaseInit"
import { getFirestore, query, collection, doc, getDocs, getDoc, where, addDoc, setDoc, deleteDoc } from "firebase/firestore"; 
const db = getFirestore(app);

export {  searchByResourceType, searchByTag, searchByText, getResource, updateResource, addResource, deleteResource }

const COLLECTION_KEY = "resources";


const searchByResourceType = async function(key) {

  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(resourceConverter), where("resourceType.key", "==", key));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push(new Resource(doc.data()));
    result.push(new Resource(doc.data()));
    result.push(new Resource(doc.data()));
    result.push(new Resource(doc.data()));
    result.push(new Resource(doc.data()));
    result.push(new Resource(doc.data()));
    result.push(new Resource(doc.data()));
    result.push(new Resource(doc.data()));
  });
  return result
};

const searchByTag = async function(tag) {
console.log('se')
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(resourceConverter), where("tags", "array-contains", tag));
  const querySnapshot = await getDocs(q);
  const result = [];
  console.log('tag');
  querySnapshot.forEach((doc) => {
    result.push(new Resource(doc.data()));
    result.push(new Resource(doc.data()));
    result.push(new Resource(doc.data()));
    result.push(new Resource(doc.data()));
    result.push(new Resource(doc.data()));
    result.push(new Resource(doc.data()));
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
  return await addDoc(collection(db, COLLECTION_KEY).withConverter(resourceConverter), resource);
}

const deleteResource = async function(id) {
  const ref = doc(db, COLLECTION_KEY, id).withConverter(resourceConverter);
  return await deleteDoc(ref);
}
