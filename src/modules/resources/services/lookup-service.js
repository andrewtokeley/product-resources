import { app } from "@/core/services/firebaseInit"
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayRemove, arrayUnion, writeBatch } from "firebase/firestore"; 

import { lookupConverter } from '@/modules/resources/model/lookup'

export { 
  getLookup,
  getTags, 
  getResourceTypes, 
  updateLookup, 
  updateLookupItem,
  addLookupItem,
  deleteLookupItem,
  groupTags,
}

const COLLECTION_KEY = "lookups";
// const RESOURCE_TYPES_ID = "resource-types"
// const TAG_ID = "tags"
const db = getFirestore(app);

export const LookUpKey = {
  resourceTypes: 'resource-types',
  tags: 'tags',
};

// const refreshTags = async function() {
//   await deleteLookup(LookUpKey.tags);
//   const lookup = new Lookup({id:LookUpKey.tags, items:[
//     {key:'strategy', value:'Strategy', meta: { groups: ['_General'], description: "If the opposite of your strategic choice sounds stupid, it might be a good idea, but it's not strategy" }},
//     {key:'marty-cagan', value:'Marty Cagan', meta: { groups: ['Popular Voices']}},
//     {key:'teresa-torres', value:'Teresa Torres', meta: { groups: ['Popular Voices']}},
//     {key:'rich-mirinov', value:'Rich Mirinov', meta: { groups: ['Popular Voices']}},
//     {key:'andrew-tokeley', value:'Andrew Tokeley', meta: { groups: ['Popular Voices']}},
//     {key: 'leadership', value:'Leadership', meta: { groups: ['_General']}},
//     {key: 'teaming', value:'Teaming', meta: { groups: ['_General']}},
//     {key: 'stakeholder', value:'Stakeholder Management', meta: { groups: ['_General']}},
//     {key: 'analytics', value:'Analytics', meta: { groups: ['_General']}},
//     {key: 'okr', value:'OKRs', meta: { groups: ['_General']}},
//     {key: 'decision', value:'Decision Making', meta: { groups: ['_General']}},
//     {key: 'fundamentals', value:'Fundamentals', meta: { groups: ['_General']}},
//     {key: 'discovery', value:'Discovery', meta: { groups: ['_General']}},
//     {key: 'innovation', value:'Innovation', meta: { groups: ['_General']}},
//     {key: 'growth', value:'Growth', meta: { groups: ['_General']}},
//     {key: 'b2b', value:'B2B', meta: { groups: ['_General']}},
// ]});
//   await addLookup(lookup)
//   return lookup;
// }

// const refreshResourceTypes = async function() {
//   await deleteLookup(LookUpKey.resourceTypes);
//   const lookup = new Lookup({id:LookUpKey.resourceTypes, items:[
//     {key:'books', value:'Books', description: 'Who doesn\'t like a great product book!', icon: "import_contacts"},
//     {key:'podcasts', value:'Podcasts', icon: "podcasts", description: "On your commute or on the run, podcasts are a great way to catch up on what's new."},
//     {key:'episodes', value:'Episodes', icon: "podcasts"},
//     {key:'posts', value:'Posts', icon: "feed"},
//     {key:'websites', value:'Websites', icon: "language", description: "A collection of hand-picked blog posts, articles and videos."},
//     {key:'videos', value:'Videos', icon: "videocam"},
//     {key:'people', value:'People', description: 'A few people stand out as having something to say and not being afraid to share it!', icon: "person"},
//   ]})
//   await addLookup(lookup)

//   // update all resource.resourceType.value entries too

//   return lookup;
// }

// const addLookup = async function(lookup) {
//   const ref = doc(db, COLLECTION_KEY, lookup.id).withConverter(lookupConverter);
//   return await setDoc(ref, lookup)
// }

// const deleteLookup = async function(lookupId) {
//   const ref = doc(db, COLLECTION_KEY, lookupId).withConverter(lookupConverter);
//   return await deleteDoc(ref)
// }

const updateLookup = async function(lookup) {
  if (lookup.id) {    
    const ref = doc(db, COLLECTION_KEY, lookup.id).withConverter(lookupConverter);
    return await setDoc(ref, lookup, {merge: true})
  } else {
    return null;
  }
}

const deleteLookupItem = async function(lookupId, item) {
  const ref = doc(db, COLLECTION_KEY, lookupId);
  await updateDoc(ref, {
    items: arrayRemove(item)
  })
}

const addLookupItem = async function(lookupId, item) {
  const ref = doc(db, COLLECTION_KEY, lookupId);
  await updateDoc(ref, {
    items: arrayUnion(item)
  })
}

const updateLookupItem = async function(lookupId, originalItem, newItem) {
  const ref = doc(db, COLLECTION_KEY, lookupId);
  const batch = writeBatch(db);
  batch.update(ref, { items: arrayRemove(originalItem) })
  batch.update(ref, { items: arrayUnion(newItem) })
  await batch.commit();
}

/**
 * 
 * @returns lookup instance, with properties items and keyValues.
 */
const getTags = async function() {
  return await getLookup(LookUpKey.tags);
}

/**
 * Groups the supplied tags by group
 * 
 * @returns array of objects for each group, with properties groupName, tags, where tags is the 
 * full Lookup instance.
 */
const groupTags = async function(tags) {
  let allGroups = tags.map ( t => {
    if (t.groups) {
      return t.groups.split(',')
    }
    return '_General';
  });
  let groups = new Set(allGroups.flat())
  var result = [];
  groups.forEach( g => {
    var tagsInGroup = [];
    if (g == '_General') {
      tagsInGroup = tags.filter(t => !(t.groups));
    } else {
      tagsInGroup = tags.filter(t => t.groups?.includes(g) ?? false);
    }
    result.push({groupName: g, tags: tagsInGroup });
  });
  
  return result;
}

/**
 * 
 * @returns lookup instance, with properties items and keyValues.
 */
const getResourceTypes = async function() {
  return await getLookup(LookUpKey.resourceTypes);
}

/**
 * 
 * @param {*} lookupId 
 * @returns {Lookup} lookup instance for the given id i.e. tags or resourceTypes
 */
const getLookup = async function(lookupId) {
  const ref = doc(db, COLLECTION_KEY, lookupId).withConverter(lookupConverter);
  const docSnap = await getDoc(ref)
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}