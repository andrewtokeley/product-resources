import { app } from "@/core/services/firebaseInit"
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"; 

import { Lookup, lookupConverter } from '@/modules/resources/model/lookup'

export { refreshTags, refreshResourceTypes, getTags, getResourceTypes, getTagItemsByGroup }

const COLLECTION_KEY = "lookups";
const RESOURCE_TYPES_ID = "resource-types"
const TAG_ID = "tags"
const db = getFirestore(app);

const refreshTags = async function() {
  await deleteLookup(TAG_ID);
  const lookup = new Lookup({id:TAG_ID, items:[
    {key:'strategy', value:'Strategy', groups: ['_General'], description: "This is a strategy description" },
    {key:'marty-cagan', value:'Marty Cagan', groups: ['Popular Voices']},
    {key:'teresa-torres', value:'Teresa Torres', groups: ['Popular Voices']},
    {key:'rich-mirinov', value:'Rich Mirinov', groups: ['Popular Voices']},
    {key:'andrew-tokeley', value:'Andrew Tokeley', groups: ['Popular Voices']},
    {key: 'leadership', value:'Leadership', groups: ['_General']},
    {key: 'teaming', value:'Teaming', groups: ['_General']},
    {key: 'stakeholder', value:'Stakeholder Management', groups: ['_General']},
    {key: 'analytics', value:'Analytics', groups: ['_General']},
    {key: 'okr', value:'OKRs', groups: ['_General']},
    {key: 'decision', value:'Decision Making', groups: ['_General']},
    {key: 'fundamentals', value:'Fundamentals', groups: ['_General']},
    {key: 'discovery', value:'Discovery', groups: ['_General']},
    {key: 'innovation', value:'Innovation', groups: ['_General']},
    {key: 'growth', value:'Growth', groups: ['_General']},
]});
  await addLookup(lookup)
  return lookup;
}

const refreshResourceTypes = async function() {
  await deleteLookup(RESOURCE_TYPES_ID);
  const lookup = new Lookup({id:RESOURCE_TYPES_ID, items:[
    {key:'books', value:'Book'},
    {key:'podcasts', value:'Podcast'},
    {key:'episodes', value:'Podcast Episode'},
    {key:'posts', value:'Post'},
    {key:'websites', value:'Website'},
  ]})
  await addLookup(lookup)
  return lookup;
}

const addLookup = async function(lookup) {
  const ref = doc(db, COLLECTION_KEY, lookup.id).withConverter(lookupConverter);
  return await setDoc(ref, lookup)
}

const deleteLookup = async function(lookupId) {
  const ref = doc(db, COLLECTION_KEY, lookupId).withConverter(lookupConverter);
  return await deleteDoc(ref)
}

/**
 * 
 * @returns lookup instance, with properties items and keyValues.
 */
const getTags = async function() {
  return await getLookup(TAG_ID);
}

/**
 * 
 * @returns array containing objects with properties groupName and tags, where tags is the 
 * full lookup item of the tags in the group 
 */
const getTagItemsByGroup = async function() {
console.log('stop')
  const lookup = await getTags();

  let g = lookup.items.map ( t => t.groups);
  let groups = new Set(g.flat())
  var result = [];
  groups.forEach( g => {
    var tags = lookup.items.filter(t => t.groups.includes(g));
    result.push({groupName: g, tags: tags });
  });
  return result;
}

/**
 * 
 * @returns lookup instance, with properties items and keyValues.
 */
const getResourceTypes = async function() {
  return await getLookup(RESOURCE_TYPES_ID);
}

const getLookup = async function(lookupId) {
  const ref = doc(db, COLLECTION_KEY, lookupId).withConverter(lookupConverter);
  const docSnap = await getDoc(ref)
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}