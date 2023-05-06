export { defaultImageUrl }

const defaultImageUrl = function(resourceType) {
  switch (resourceType) {
    case 'podcasts': return require('@/assets/missing-podcasts.png');
    case 'books': return require('@/assets/missing-books.png');
    default: return require('@/assets/missing-image.png');
  }  
} 
