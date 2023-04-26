
import { Resource, resourceConverter } from '../model/resource'
import { app } from "@/core/services/firebaseInit"
import { getFirestore, query, collection, doc, getDocs, getDoc, where, addDoc, setDoc, deleteDoc } from "firebase/firestore"; 
const db = getFirestore(app);

export {  searchByResourceType, searchByTag, searchByText, getResource, updateResource, addResource, deleteResource }

const COLLECTION_KEY = "resources";

// const getAll = function() {
//   return new Promise(function (resolve) {

//     let result = [];
//     result.push(new Resource({id: "1", displayName:"It Doesn't Have to be Crazy at Work", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401aaec465a8fd8efb3e0a4_crazy.jpg", category: "Books", authors: ["Jason Fried", "David Heinemeier Hansson"]}))
//     result.push(new Resource({id: "2", displayName:"Empowered", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401a19d8f2d076a53b7158f_inspired.jpg", category: "Books", authors: ["Marty Cagan","Chris Jones"]}))
//     result.push(new Resource({id: "3", displayName:"Inspired: How to Create Tech Products Customers Love (Silicon Valley Product Group) 2nd Edition", imageUrl:"https://m.media-amazon.com/images/I/71cv-b7-DzL._AC_UF1000,1000_QL80_.jpg", category: "Books", authors: ["Marty Cagan"]}))
//     result.push(new Resource({id: "4", displayName:"Good Strategy, Bad Strategy", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401ab6db421f85ef5425402_goodbad.jpg", category: "Books", authors: ["Richard Rumelt"]}))
//     result.push(new Resource({id: "5", displayName:"Good to Great: Why Some Companies Make the Leap and Others Don't", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401aa411c54895b7cd1aa57_goodtogreat.jpg", category: "Books", authors: ["Jim Collins"]}))
//     result.push(new Resource({id: "6", displayName:"How to build a cult-like brand | Laura Modi (Bobbie)", description:"Interviews with world-class product leaders and growth experts to uncover concrete, actionable, and tactical advice to help you build, launch, and grow your own product.", imageUrl:"https://images.podpage.com/https%3A%2F%2Fsubstackcdn.com%2Ffeed%2Fpodcast%2F10845%2Fpost%2F113964811%2F89db3aa60e2500f8da945a0f0839558d.jpg?auto=format&dpr=2&q=50&w=600&s=42880fbb79c4b4394e6ba9f9b9cce489", category: "Podcast Episodes", authors: ["Lenny"]}))
//     result.push(new Resource({id: "7", parentResourceId: "9", parentResourceName:"Lenny's Podcast", displayName:"Show about somethinh on Lenny's Podcast", description:"deswede sdfsdf s sdf s", category: "Podcast Episodes", imageUrl: "https://images.podpage.com/https%3A%2F%2Fsubstackcdn.com%2Ffeed%2Fpodcast%2F10845%2Fpost%2F113964811%2F89db3aa60e2500f8da945a0f0839558d.jpg?auto=format&dpr=2&q=50&w=600&s=42880fbb79c4b4394e6ba9f9b9cce489", authors: ["Lenny"]}))
//     result.push(new Resource({d: "8", publishedDate: new Date(), displayName:"The Product Experience", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"Heres's the descr", category: "Podcast Episodes", authors: ["Lenny"]}))
//     result.push(new Resource({d: "9", displayName:"Lenny's Podcast", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"This is a podcast...", category: "Podcasts", authors: ["Lenny"]}))
//     result.push(new Resource({d: "10", displayName:"Tom's Podcast", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"This is a podcast...", category: "Podcasts", authors: ["Lenny"]}))
//     result.push(new Resource({d: "11", displayName:"Sam Harris", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"This is a podcast...", category: "Podcasts", authors: ["Lenny"]}))
//     result.push(new Resource({d: "12", publishedDate: new Date(), displayName:"Lenny's Podcast", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"This is a podcast...", category: "Podcasts", authors: ["Lenny"]}))
//     result.push(new Resource({id: "1", displayName:"It Doesn't Have to be Crazy at Work", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401aaec465a8fd8efb3e0a4_crazy.jpg", category: "Books", authors: ["Jason Fried", "David Heinemeier Hansson"]}))
//     result.push(new Resource({id: "2", displayName:"Empowered", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401a19d8f2d076a53b7158f_inspired.jpg", category: "Books", authors: ["Marty Cagan","Chris Jones"]}))
//     result.push(new Resource({id: "3", displayName:"Inspired: How to Create Tech Products Customers Love (Silicon Valley Product Group) 2nd Edition", imageUrl:"https://m.media-amazon.com/images/I/71cv-b7-DzL._AC_UF1000,1000_QL80_.jpg", category: "Books", authors: ["Marty Cagan"]}))
//     result.push(new Resource({id: "4", displayName:"Good Strategy, Bad Strategy", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401ab6db421f85ef5425402_goodbad.jpg", category: "Books", authors: ["Richard Rumelt"]}))
//     result.push(new Resource({id: "5", displayName:"Good to Great: Why Some Companies Make the Leap and Others Don't", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401aa411c54895b7cd1aa57_goodtogreat.jpg", category: "Books", authors: ["Jim Collins"]}))
//     result.push(new Resource({id: "6", displayName:"How to build a cult-like brand | Laura Modi (Bobbie)", description:"Interviews with world-class product leaders and growth experts to uncover concrete, actionable, and tactical advice to help you build, launch, and grow your own product.", imageUrl:"https://images.podpage.com/https%3A%2F%2Fsubstackcdn.com%2Ffeed%2Fpodcast%2F10845%2Fpost%2F113964811%2F89db3aa60e2500f8da945a0f0839558d.jpg?auto=format&dpr=2&q=50&w=600&s=42880fbb79c4b4394e6ba9f9b9cce489", category: "Podcast Episodes", authors: ["Lenny"]}))
//     result.push(new Resource({id: "7", parentResourceId: "9", parentResourceName:"Lenny's Podcast", displayName:"Show about somethinh on Lenny's Podcast", description:"deswede sdfsdf s sdf s", category: "Podcast Episodes", imageUrl: "https://images.podpage.com/https%3A%2F%2Fsubstackcdn.com%2Ffeed%2Fpodcast%2F10845%2Fpost%2F113964811%2F89db3aa60e2500f8da945a0f0839558d.jpg?auto=format&dpr=2&q=50&w=600&s=42880fbb79c4b4394e6ba9f9b9cce489", authors: ["Lenny"]}))
//     result.push(new Resource({d: "8", publishedDate: new Date(), displayName:"The Product Experience", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"Heres's the descr", category: "Podcast Episodes", authors: ["Lenny"]}))
//     result.push(new Resource({d: "9", displayName:"Lenny's Podcast", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"This is a podcast...", category: "Podcasts", authors: ["Lenny"]}))
//     result.push(new Resource({d: "10", displayName:"Tom's Podcast", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"This is a podcast...", category: "Podcasts", authors: ["Lenny"]}))
//     result.push(new Resource({d: "11", displayName:"Sam Harris", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"This is a podcast...", category: "Podcasts", authors: ["Lenny"]}))
//     result.push(new Resource({d: "12", publishedDate: new Date(), displayName:"Lenny's Podcast", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"This is a podcast...", category: "Podcasts", authors: ["Lenny"]}))
//     resolve(result)
//   });
// }

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
