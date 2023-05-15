import { app } from "@/core/services/firebaseInit"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; 

import { userConverter } from '@/modules/users/model/user'
import { DateTime } from "luxon";
import { User } from "@/modules/users/model/user";

export { 
  addUser,
  getUser,
  recordUserLogin, 
  updateUser,
}

const COLLECTION_KEY = "users";
const db = getFirestore(app);

/**
 * Returns a user object. Firestore restricts this request to the user logged in with the same uid.
 * @param {*} uid 
 * @returns 
 */
const getUser = async function(uid) {
  if (!uid) return null;
  const ref = doc(db, COLLECTION_KEY, uid).withConverter(userConverter);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

/**
 * Adds a new user record to the datastore
 * @param {*} authUser 
 * @returns the newly created id
 */
const addUser = async function(authUser) {
  let user = new User({
    displayName: authUser.displayName,
    email: authUser.email,
    lastLoggedInDate: DateTime.now(),
  })
  await setDoc(doc(db, COLLECTION_KEY, authUser.uid).withConverter(userConverter), user);
  return true;
}

/**
 * Records that a user has logged in, setting the date
 * @param {*} uid 
 * @param {*} datetime a luxon date 
 * @returns the full user record
 */
const recordUserLogin = async function(uid, datetime) {
  if (uid) {
    const ref = doc(db, COLLECTION_KEY, uid).withConverter(userConverter);
    await setDoc(ref, { lastLoggedInDate: datetime }, { merge: true });
    return getUser(uid);
  } else {
    return null;
  }
}

/**
 * Updates user record
 * @param {User} user 
 */
const updateUser = async function(user) {
  if (user?.uid) {
    const ref = doc(db, COLLECTION_KEY, user.uid).withConverter(userConverter);
    return await setDoc(ref, user, {merge: true})
  } else {
    return null;
  }
}
