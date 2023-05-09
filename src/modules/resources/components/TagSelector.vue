<template>
  <div class="tag-selector">
      <ul>
        <li v-for="tag in tags" :key="tag.key" >
          <tag-button :enableHoverEffect="false" :selected="isSelected(tag.key)" @click="toggleSelection(tag.key)">{{tag.value}}</tag-button>
        </li>
      </ul>
  </div>
</template>

<script>
import { getTags } from "@/modules/resources/services/lookup-service"
import TagButton from "@/modules/resources/components/TagButton.vue"

export default {
  name: "tag-selector",

  components: {
    TagButton,
  },

  data() {
    return {
      tags: [],
      selectedTagKeys: [],
    }
  },

  props: {
    modelValue: {
      type: Array,
      default: () => {[]}
    }
  },

  emits: ['update:modelValue'],

  async mounted() {
    let lookup = await getTags();
    this.tags = lookup.keyValues;
    this.selectedTagKeys = this.modelValue;
  },

  methods: {
    toggleSelection(key) {
      console.log('tog')
      var index = this.selectedTagKeys.indexOf(key);
      if (index > -1) {
        this.selectedTagKeys.splice(index, 1);
      } else {
        this.selectedTagKeys.push(key);
      }
      this.$emit('update:modelValue', this.selectedTagKeys);
    },

    isSelected(key) {
      return this.selectedTagKeys.includes(key);
    }
  }
}
</script>

<style scoped>

.tag-selector {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
}

.tag-selector ul {
  list-style-type: none;
  padding-left: 0px;
  margin-top: 0px;
}

.tag-selector li {
  padding: 5px;
  display: inline-block;
}
</style>