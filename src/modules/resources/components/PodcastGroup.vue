<template>
  <div class="group">
    <h1 v-if="showHeaderLink">
        <router-link :to="headingLink">{{ heading }}</router-link>
    </h1>
    <h1 v-else>{{ heading }}</h1>
    <ul>
      <li v-for="resource in resources" :key="resource.id">
        <podcast-card :resource="resource" @click="$emit('click', resource)"></podcast-card>
      </li>
    </ul>
  </div>
</template>

<script>
import PodcastCard from './PodcastCard.vue'

export default {
  name: "podcast-group",
  emits: ['click'],
  components: { 
    PodcastCard 
  },
  props: {
    heading: String,
    headingLink: String,
    resources: {
      type: Array,
      default: () => {[]}
    }
  },
  computed: {
    showHeaderLink() {
      return this.resources && this.headingLink;
    }
  }
}
</script>

<style scoped>
.group ul {
  list-style-type: none;
}

.group li {
  display: inline-block;
  padding-left: 20px;
}
</style>