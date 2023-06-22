import { app } from "@/core/services/firebaseInit"
import { writeBatch, query, collection, limit, getDocs, where, getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; 

import { userConverter, userPrivateConverter } from '@/modules/users/model/user'
// import { userConverter, userPrivateConverter } from '@/modules/users/model/user'
import { DateTime } from "luxon";
import { User, UserPrivate } from "@/modules/users/model/user";
import FirestoreKeys from "@/core/services/firebaseKeys";

export { 
  getUser,
  getUserByUsername,
  usernameExists,
  updateUsername,
  addUser,
  recordUserLogin, 
  updateUser,
}

const COLLECTION_KEY = FirestoreKeys.UsersCollection.key;
const COLLECTION_PRIVATE_KEY = FirestoreKeys.UsersPrivateCollection.key;
const COLLECTION_USERNAMES_KEY = FirestoreKeys.UsernamesCollection.key;
const DOCUMENT_PRIVATE_KEY = FirestoreKeys.UsersPrivateDocument.key;
const db = getFirestore(app);

function generateRandomSequence() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let sequence = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    sequence += characters.charAt(randomIndex);
  }

  return sequence;
}

/**
 * Returns whether a username is available. This does not guarantee the username will still be available when setting it for a user.
 * @param {*} username 
 * @returns true if username available. 
 */
const usernameExists = async function(username) {
  if (!username) { return false; }
  const ref = doc(db, COLLECTION_USERNAMES_KEY, username);
  const docSnap = await getDoc(ref);
  return docSnap.exists();
 }

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

const getUserByUsername = async function(username) {
  if (!username) return null;
  const q = query(collection(db, COLLECTION_KEY)
    .withConverter(userConverter),
    where("username", "==", username),
    limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size == 1) {
    return new User(querySnapshot.docs[0].data());
  }
  return null;
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

  const username = generateRandomSequence();
  let exists = true;
  let attempts = 0;
  while (exists && attempts < 3) {
    exists = usernameExists(username);
    attempts += 1;
  }

  if (!exists) {
    // abort
    return false;
  }

  // set the username 
  batch.update(ref, { username: username });
  const newUsernameRef = doc(db, COLLECTION_USERNAMES_KEY, username);
  batch.set(newUsernameRef, { uid: authUser.uid });

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
    console.log('user');
    // update the username first
    await updateUsername(user.uid, user.username);
    
    // assuming that didn't throw exception...    
    
    const ref = doc(db, COLLECTION_KEY, user.uid).withConverter(userConverter);
    return await setDoc(ref, user, {merge: true})
  } else {
    return null;
  }
}

/**
 * Updates a user's username, ensuring it is unique
 * @param {*} uid 
 * @param {*} username 
 */
const updateUsername = async function(uid, username) {
  //remove any username that was previously set for this user
  const batch = writeBatch(db);

  const user = await getUser(uid);
  if (user) {
    
    if (user.username == username) {
      // no change
      return;
    }
    
    // update the username on the user document
    const prevUsername = user.username;
    const ref = doc(db, COLLECTION_KEY, uid);
    batch.update(ref, { username: username });

    // delete the previous username from the usernames collection
    if (prevUsername) {
      const previousUsernameRef = doc(db, COLLECTION_USERNAMES_KEY, prevUsername);
      batch.delete(previousUsernameRef);
    }

    // add the new username (and uid) to the usernames collection
    const newUsernameRef = doc(db, COLLECTION_USERNAMES_KEY, username);
    batch.set(newUsernameRef, { uid: uid });

    await batch.commit();
  }
}