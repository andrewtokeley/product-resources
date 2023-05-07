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
      <div v-if="showAddRecommendation" class="add-resource-card">
        
          <base-icon @click="handleAddRecommendation"
            :options="{ size: '40px' }">add_circle</base-icon>
        
      </div>
    </div>
  </div>
</template>

<script>
import BookCard from "@/modules/resources/components/BookCard.vue"
import RowHeader from '@/modules/resources/components/RowHeader.vue';
import BaseIcon from "@/core/components/BaseIcon.vue";

export default {
  name: "book-group",
  components: { 
    BookCard,
    RowHeader,
    BaseIcon,
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
    },
    showAddRecommendation: {
      type: Boolean,
      default: false,
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
  },
  methods: {
    handleAddRecommendation() {
      console.log('gg')
      this.$router.replace({ query: { r: 'new'}});
      this.$forceUpdate();
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
  /* margin-left: 20px; */
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: flex-start;
  overflow: scroll;
  gap: 10px;
}

.row.singleRow {
  flex-wrap: nowrap;
  justify-content: space-evenly;
}

.add-resource-card {
  display:flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 15px;
  width: 140px;
  height: 205px;
  background: var(--prr-extralightgrey);
}

</style>