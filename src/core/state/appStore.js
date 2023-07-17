import { defineStore } from 'pinia'
import { registerUnapprovedReviewsCounter } from '@/modules/reviews/services/review-service';
import { registerUnapprovedRecommendationsCounter } from '@/modules/recommendations/services/recommendation-service';
import { registerUnapprovedResourcesCounter } from '@/modules/resources/services/resource-service';

export const appStore = defineStore( {
  id: 'appStore',
  state: () => ({
    unapprovedRecommendationsCount: 0,
    unapprovedReviewsCount: 0,
    unapprovedResourcesCount: 0,
  }),

  actions: {    
    async initialiseCounts() {
      console.log('initialise counts');
      this.unapprovedRecommendationsCount = 0;
      this.unapprovedReviewsCount = 0;
      this.unapprovedResourcesCount = 0;
      registerUnapprovedReviewsCounter();
      registerUnapprovedRecommendationsCounter();
      registerUnapprovedResourcesCounter();
    },
    
    async incrementUnapprovedReviewsCount(count) {
      this.unapprovedReviewsCount += count;
    },

    async incrementUnapprovedRecommendationsCount(count) {
      this.unapprovedRecommendationsCount += count;
    },

    async incrementUnapprovedResourcesCount(count) {
      this.unapprovedResourcesCount += count;
    },
  },
})