import { Resource } from '../model/resource'

export {  searchResources, getResource }

const searchResources = function(searchTerm) {
  return new Promise(function (resolve) {
    let result = [];
    if (searchTerm == "s") {
      result.push(new Resource({id: "1", tag: searchTerm, displayName:"It Doesn't Have to be Crazy at Work", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401aaec465a8fd8efb3e0a4_crazy.jpg", category: "Book", authors: ["Jason Fried", "David Heinemeier Hansson"]}))
      result.push(new Resource({id: "2", displayName:"Empowered", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401a19d8f2d076a53b7158f_inspired.jpg", category: "Book", authors: ["Marty Cagan","Chris Jones"]}))
      result.push(new Resource({id: "3", displayName:"Inspired: How to Create Tech Products Customers Love (Silicon Valley Product Group) 2nd Edition", imageUrl:"https://m.media-amazon.com/images/I/71cv-b7-DzL._AC_UF1000,1000_QL80_.jpg", category: "Book", authors: ["Marty Cagan"]}))
      result.push(new Resource({id: "4", displayName:"Good Strategy, Bad Strategy", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401ab6db421f85ef5425402_goodbad.jpg", category: "Book", authors: ["Richard Rumelt"]}))
      result.push(new Resource({id: "5", displayName:"Good to Great: Why Some Companies Make the Leap and Others Don't", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401aa411c54895b7cd1aa57_goodtogreat.jpg", category: "Book", authors: ["Jim Collins"]}))
      result.push(new Resource({id: "6", displayName:"How to build a cult-like brand | Laura Modi (Bobbie)", description:"Interviews with world-class product leaders and growth experts to uncover concrete, actionable, and tactical advice to help you build, launch, and grow your own product.", imageUrl:"https://images.podpage.com/https%3A%2F%2Fsubstackcdn.com%2Ffeed%2Fpodcast%2F10845%2Fpost%2F113964811%2F89db3aa60e2500f8da945a0f0839558d.jpg?auto=format&dpr=2&q=50&w=600&s=42880fbb79c4b4394e6ba9f9b9cce489", category: "Podcast Episode", authors: ["Lenny"]}))
      result.push(new Resource({id: "7", displayName:"Lenny's Podcast", description:"deswede sdfsdf s sdf s", category: "Podcast Episode", imageUrl: "https://images.podpage.com/https%3A%2F%2Fsubstackcdn.com%2Ffeed%2Fpodcast%2F10845%2Fpost%2F113964811%2F89db3aa60e2500f8da945a0f0839558d.jpg?auto=format&dpr=2&q=50&w=600&s=42880fbb79c4b4394e6ba9f9b9cce489", authors: ["Lenny"]}))
      result.push(new Resource({d: "8", publishedDate: new Date(), displayName:"The Product Experience", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"Heres's the descr", category: "Podcast Episode", authors: ["Lenny"]}))
      result.push(new Resource({d: "9", displayName:"Lenny's Podcast", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"This is a podcast...", category: "Podcast", authors: ["Lenny"]}))
      result.push(new Resource({d: "9", displayName:"Lenny's Podcast", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"This is a podcast...", category: "Podcast", authors: ["Lenny"]}))
      result.push(new Resource({d: "9", displayName:"Lenny's Podcast", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"This is a podcast...", category: "Podcast", authors: ["Lenny"]}))
      result.push(new Resource({d: "9", publishedDate: new Date(), displayName:"Lenny's Podcast", imageUrl:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQN1t2TQiVAh5QyrpJXQYIdrJsaOI8GRGsuDJFMiw9ZCA0P4Us-", description:"This is a podcast...", category: "Podcast", authors: ["Lenny"]}))
    }
    resolve(result)
  });
}

/**
 * 
 * @param {String} id the id of the resource
 * @returns a new Resource instance 
 */
const getResource = function(id) {
  return new Promise(function (resolve, reject) {
    searchResources("s").then( result => {
      const resource = result.find( r => r.id == id )
      if (resource) {
        resolve(resource)
      } else {
        reject("resource not found")
      }      
    });
  });
}
