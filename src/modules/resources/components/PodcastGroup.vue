<template>
  <div class="group">
    <row-header :title="heading" :link="headingLink"></row-header>    
    <ul>
      <li v-for="resource in resources" :key="resource.id">
        <podcast-card :resource="resource" @click="$emit('click', resource)"></podcast-card>
      </li>
    </ul>
  </div>
</template>

<script>
import PodcastCard from './PodcastCard.vue'
import RowHeader from './RowHeader.vue'

export default {
  name: "podcast-group",
  emits: ['click'],
  components: { 
    PodcastCard,
    RowHeader,
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
  padding-left:0px;
}

.group li {
  display: inline-block;
  padding-left: 20px;
  padding-left:0px;
}
</style>