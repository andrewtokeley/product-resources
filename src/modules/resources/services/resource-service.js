import { Resource } from '../model/resource'

export {  searchResources, getResource }

const searchResources = function(searchTerm) {
  return new Promise(function (resolve) {
    let result = [];
    if (searchTerm == "s") {
      result.push(new Resource({id: "1", tag: searchTerm, displayName:"Inspired", imageUrl:"https://m.media-amazon.com/images/I/71cv-b7-DzL._AC_UF1000,1000_QL80_.jpg", category: "Book", authors: ["Marty Cagan"]}))
      result.push(new Resource({id: "2", displayName:"Inspired", imageUrl:"https://m.media-amazon.com/images/I/71cv-b7-DzL._AC_UF1000,1000_QL80_.jpg", category: "Podcast", authors: ["Marty Cagan"]}))
      result.push(new Resource({id: "3", displayName:"Inspired: How to Create Tech Products Customers Love (Silicon Valley Product Group) 2nd Edition", imageUrl:"https://m.media-amazon.com/images/I/71cv-b7-DzL._AC_UF1000,1000_QL80_.jpg", category: "Book", authors: ["Marty Cagan"]}))
      result.push(new Resource({id: "3", displayName:"Good Strategy, Bad Strategy", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401ab6db421f85ef5425402_goodbad.jpg", category: "Book", authors: ["Richard Rumelt"]}))
      result.push(new Resource({id: "3", displayName:"Good to Great: Why Some Companies Make the Leap and Others Don't", imageUrl:"https://uploads-ssl.webflow.com/5c7b3cd55c229322e94ab73d/6401aa411c54895b7cd1aa57_goodtogreat.jpg", category: "Book", authors: ["Jim Collins"]}))
      result.push(new Resource({id: "3", displayName:"Inspired", imageUrl:"https://m.media-amazon.com/images/I/71cv-b7-DzL._AC_UF1000,1000_QL80_.jpg", category: "Article", authors: ["Marty Cagan"]}))
    }
    resolve(result)
  });
}

const getResource = function(id) {
  return new Promise(function (resolve) {
    let result = new Resource({
      id: id, 
      displayName:`Inspired: How to Create Tech Products Customers Love (Silicon Valley Product Group) 2nd Edition`, 
      authors: "[Marty Cagan]", 
      description:`Learn to design, build, and scale products consumers can’t get enough of\n\n
                 How do today’s most successful tech companies―Amazon, Google, Facebook, Netflix, Tesla―design, develop, and deploy the products that have earned the love of literally 
                 billions of people around the world? Perhaps surprisingly, they do it very differently than most tech companies. In INSPIRED, technology product management thought leader 
                 Marty Cagan provides readers with a master class in how to structure and staff a vibrant and successful product organization, and how to discover and deliver technology 
                 products that your customers will love―and that will work for your business.`,
      imageUrl:"https://m.media-amazon.com/images/I/71cv-b7-DzL._AC_UF1000,1000_QL80_.jpg", 
      category: "Book"})
    resolve(result)
  });
}
