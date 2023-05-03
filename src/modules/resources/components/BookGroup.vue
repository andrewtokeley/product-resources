<template>
  <div class="book-group">
    <row-header :heading="_heading" :headingLink="headingLink"></row-header>    
    <div class="row" :class="{ singleRow: singleRow }">
      <book-card 
        v-for="resource in resources"
        :key="resource.id"
        :resource="resource" 
        @recommend="$emit('recommend', resource)" 
        @click="$emit('click', resource)">
      </book-card>
    </div>
  </div>
</template>

<script>
import BookCard from "./BookCard.vue"
import RowHeader from './RowHeader.vue';

export default {
  name: "book-group",
  components: { 
    BookCard,
    RowHeader,
  },

  emits: ['click', 'recommend'],

  props: {
    heading: String,
    headingLink: String,
    singleRow: {
      type: Boolean,
      default: false
    },
    includeItemCount:  {
      type: Boolean,
      default: true
    },
    resources: {
      type: Array,
      default: () => {[]}
    }
  },
  computed: {
    _heading() {
      var heading = this.heading;
      if (this.includeItemCount) {
        heading += ` (${this.resources.length})`;
      }
      return heading;
    },
    showHeaderLink() {
      return this.resources && this.headingLink;
    }
  }


}
</script>

<style scoped>

h1 {
  text-transform: uppercase;
}

.book-group {
  position: relative;
  width: 100%;
  overflow-x: scroll;
  padding: 5px;
}

.row {
  margin-left: 20px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap:15px;
  overflow: scroll;
}

.row.singleRow {
  flex-wrap: nowrap;
}


</style>