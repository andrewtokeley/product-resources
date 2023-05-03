<template>
  <div class="page">
    <header-bar></header-bar>
    <div class="content">
      <section class="featured">
        <featured-card class="card" v-for="recommendation in featured" :key="recommendation.id" :recommendation="recommendation"></featured-card>
      </section>
      
      <section class="featured">
        <book-group heading="Popular Books" headingLink="/type/books" :resources="topBooks" :includeItemCount="false" :singleRow="true"></book-group>
      </section>
      
      <section class="featured">
        <book-group heading="Popular Podcasts"  headingLink="/type/podcasts"  :resources="topPodcasts" :includeItemCount="false" :singleRow="true"></book-group>
      </section>

    </div>
  </div>
</template>

<script>
import HeaderBar from "@/core/components/HeaderBar.vue";
import FeaturedCard from "@/modules/home/components/FeaturedCard.vue";
import { getFeaturedRecommendations } from '@/modules/recommendations/services/recommendation-service';
import { searchByResourceTypes } from '@/modules/resources/services/resource-service';
import BookGroup from '@/modules/resources/components/BookGroup.vue';

export default {
  name: 'resources-home',
  components: { HeaderBar, FeaturedCard, BookGroup },
  data() {
    return {
      featured: [],
      topBooks: [],
      topPodcasts: [],
    }
  },
  async mounted() {
    // this.featured = await getFeaturedRecommendations('podcasts', 2);
    this.featured = await getFeaturedRecommendations(2);
    this.topBooks = await searchByResourceTypes(['books'], 5);
    this.topPodcasts = await searchByResourceTypes(['podcasts'], 5);
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  max-width: 860px;
  overflow: hidden;
}

section {
  margin-top:30px;
  border-radius: 20px;
  background: var(--prr-extralightgrey);
  overflow: hidden;
}
section.featured {
  width: 100%;
  display:flex;
  justify-content: space-around;
  gap:20px;
  flex-wrap: wrap;  
}

.featured .card {
  width: 400px;
  overflow: hidden;
}

</style>