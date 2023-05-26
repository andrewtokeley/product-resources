import { app } from "@/core/services/firebaseInit"
import { writeBatch, getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; 

import { userConverter, userPrivateConverter } from '@/modules/users/model/user'
// import { userConverter, userPrivateConverter } from '@/modules/users/model/user'
import { DateTime } from "luxon";
import { User, UserPrivate } from "@/modules/users/model/user";

export { 
  addUser,
  getUser,
  recordUserLogin, 
  updateUser,
}

const COLLECTION_KEY = "users";
const COLLECTION_PRIVATE_KEY = "private";
const DOCUMENT_PRIVATE_KEY = 'secure';
const db = getFirestore(app);

/**
 * Returns a public user object.
 * 
 * @param {*} uid 
 * @returns User instance
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
 * Adds a new user record to the datastore, including private data. 
 * Only authenticated users can call this and only with their authUser instance.
 * 
* @param {*} authUser as returned from firebase authentication
 * @returns the true if successful
 */
const addUser = async function(authUser) {
  const user = new User({
    displayName: authUser.displayName,
  });
  const userPrivate = new UserPrivate({
    email: authUser.email,
    lastLoggedInDate: DateTime.now(),
  });
  
  let batch = writeBatch(db);
  const ref = doc(db, COLLECTION_KEY, authUser.uid).withConverter(userConverter);
  const refPrivate = doc(db, COLLECTION_KEY, authUser.uid, COLLECTION_PRIVATE_KEY, DOCUMENT_PRIVATE_KEY).withConverter(userPrivateConverter);
  
  batch.set(ref, user);
  batch.set(refPrivate, userPrivate);
  await batch.commit();

  return true;
}

/**
 * Records that a user has logged in, updating any authUser properties into the user record and 
 * setting the login date.
 * @param {*} authUser user record as returns by firebase auth
 * @returns true if successful
 */
const recordUserLogin = async function(uid) {
  if (uid) {
    const ref = doc(db, COLLECTION_KEY, uid, COLLECTION_PRIVATE_KEY, DOCUMENT_PRIVATE_KEY).withConverter(userPrivateConverter);
    const user = new UserPrivate({lastLoggedInDate: DateTime.now()});
    await setDoc(ref, user, { merge: true });
    return true;
  } else {
    return false;
  }
  
  
}

/**
 * Updates the public fields of a user record (can only update your own records, but anyone can read)
 * @param {User} user public user record 
 */
const updateUser = async function(user) {
  if (user?.uid) {
    const ref = doc(db, COLLECTION_KEY, user.uid).withConverter(userConverter);
    return await setDoc(ref, user, {merge: true})
  } else {
    return null;
  }
}
