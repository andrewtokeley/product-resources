import parser from 'rss-parser'

export { parseFeed }

const parseFeed = async function(url) {
  const feed = await parser.parseURL(url)
  console.log(feed.title); 

  feed.items.forEach(item => {
    console.log(item.title + ':' + item.link) // item will have a `bar` property type as a number
  });
}

