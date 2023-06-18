import { defineStore } from 'pinia'
import { getFeaturedReviews } from '@/modules/reviews/services/review-service';

export const reviewStore = defineStore( {
  id: 'reviewStore',
  state: () => ({
    featuredReviews: [],
  }),

  actions: {    
    async fetchFeatured() {
      return await getFeaturedReviews(5);
    },
  },
})