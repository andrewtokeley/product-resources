<template>
  <div class="group">
    <h1 v-if="showHeaderLink">
        <router-link :to="headingLink">{{ heading }}</router-link>
    </h1>
    <h1 v-else>{{ heading }}</h1>
    <ul>
      <li v-for="resource in resources" :key="resource.id">
        <book-card :resource="resource" @recommend="$emit('recommend', resource)" @click="$emit('click', resource)"></book-card>
      </li>
    </ul>
  </div>
</template>

<script>
import BookCard from "./BookCard.vue"

export default {
  name: "book-group",
  components: { 
    BookCard,
  },

  emits: ['click', 'recommend'],

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

<style>

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