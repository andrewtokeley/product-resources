import { defineStore } from 'pinia'
import { getFeaturedReviews } from '@/modules/reviews/services/review-service';

export const reviewStore = defineStore( {
  id: 'reviewStore',
  state: () => ({
    featuredReviews: [],
  }),

  actions: {    
    async fetchFeatured() {
      if (this.featuredReviews.length == 0) {
        this.featuredReviews = await getFeaturedReviews(5);
      }
    },
  },
})