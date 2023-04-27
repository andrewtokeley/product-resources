import { app } from "@/core/services/firebaseInit"
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"; 

import { Lookup, lookupConverter } from '@/modules/resources/model/lookup'

export { refreshTags, refreshResourceTypes, getTags, getResourceTypes, getTagsByGroup }

const COLLECTION_KEY = "lookups";
const RESOURCE_TYPES_ID = "resource-types"
const TAG_ID = "tags"
const db = getFirestore(app);

const refreshTags = async function() {
  await deleteLookup(TAG_ID);
  const lookup = new Lookup({id:TAG_ID, items:[
    {key:'strategy', value:'Strategy', groups: ['General']},
    {key:'marty-cagan', value:'Marty Cagan', groups: ['Popular Authors']},
    {key:'teresa-torres', value:'Teresa Torres', groups: ['Popular Authors']},
    {key:'rich-mirinov', value:'Rich Mirinov', groups: ['Popular Authors']},
    {key: 'leadership', value:'Leadership', groups: ['General']},
    {key: 'teaming', value:'Teaming', groups: ['General']},
    {key: 'stakeholder', value:'Stakeholder Management', groups: ['General']},
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

const getTags = async function() {
  const lookup = await getLookup(TAG_ID);
  return lookup.items;
}

const getTagsByGroup = async function() {
  console.log('g')
  const tags = await getTags()

  // get unique groups
  let g = tags.map ( t => t.groups);
  let groups = new Set(g.flat())
  var result = [];
  groups.forEach( g => {
    result.push({groupName: g, tags: tags.filter(t => t.groups.includes(g))});
  })
  return result;
}

const getResourceTypes = async function() {
  const lookup = await getLookup(RESOURCE_TYPES_ID);
  return lookup.items;
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