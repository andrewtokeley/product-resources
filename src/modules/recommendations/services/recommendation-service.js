
import { recommendationConverter } from '../model/recommendation'
import { app } from "@/core/services/firebaseInit"
import { getFirestore, collection, doc, getDoc, addDoc, setDoc, deleteDoc } from "firebase/firestore"; 
const { DateTime } = require("luxon");

const db = getFirestore(app);

export { getRecommendation, updateRecommendation, addRecommendation, deleteRecommendation }

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
  let doc = await addDoc(collection(db, COLLECTION_KEY).withConverter(recommendationConverter), recommendation);
  return doc.id;
}

const deleteRecommendation = async function(id) {
  const ref = doc(db, COLLECTION_KEY, id).withConverter(recommendationConverter);
  return await deleteDoc(ref);
}
