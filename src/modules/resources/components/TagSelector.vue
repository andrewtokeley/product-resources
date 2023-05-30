<template>
  <div class="tag-selector">
    <div v-for="tagGroup in tagGroups" :key="tagGroup.groupName" class="tag-group">
      <span v-if="showCategoryHeading(tagGroup)" class="tag-group-label">{{ tagGroup.groupName }}:</span>
      <ul class="tag-list" :class="{ column: singleColumn }">
        <li v-for="tag in tagGroup.tags" :key="tag.key" >
          <tag-button 
            :enableHoverEffect="singleSelect ? true :false" 
            :selected="isSelected(tag.key)"
            @click.stop="toggleSelection(tag.key)">
            {{tag.value}}
          </tag-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TagButton from "@/modules/resources/components/TagButton.vue"
import { groupTags } from "../services/lookup-service"
import { useLookupStore } from "@/core/state/lookupStore"

export default {
  name: "tag-selector",
  emits: ['click', 'update:modelValue'],
  components: {
    TagButton,
  },

  data() {
    return {
      tagGroups: [],
      lastSelectedKey: null,
      selectedTagKeys: [],
    }
  },

  props: {
    tags: {
      type: Array,
      default: null,
    },
    modelValue: {
      type: Array,
      default: () => {[]}
    },
    singleSelect: {
      type: Boolean,
      default: false,
    },
    singleColumn: {
      type: Boolean,
      default: false,
    }
  },

  async mounted() {
    let tags = this.tags;
    if (!tags || tags.length == 0) {
      const store = useLookupStore();
      tags = store.tags;
    }
    this.tagGroups = await groupTags(tags);
    this.selectedTagKeys = this.modelValue ?? [];
  },

  methods: {
    showCategoryHeading(tagGroup) {
      return tagGroup.groupName.toLowerCase() != '_general';
    },
    toggleSelection(key) {
      let isOn;
      var index = this.selectedTagKeys.indexOf(key);
      if (index > -1) {
        // unselect, remove from selected array
        this.selectedTagKeys.splice(index, 1);
        isOn = false;
      } else {
        // add to selected array. Remove previously selected if singleSelect
        if (this.singleSelect) {
          if (this.selectedTagKeys.length == 1) {
            this.$emit('click', this.selectedTagKeys[0], false);
            this.selectedTagKeys = [];
          }
        }
        this.selectedTagKeys.push(key);
        isOn = true;
      }
      // send complete selected array back to client
      this.$emit('click', key, isOn);
      this.$emit('update:modelValue', this.selectedTagKeys);
    },

    isSelected(key) {
      if (this.selectedTagKeys) {
        return this.selectedTagKeys.includes(key);
      }
      return false;
    }
  }
}
</script>

<style scoped>
.tag-selector {
  overflow-y:scroll;
}
.tag-list {
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  box-sizing: border-box;
}

.tag-list.column {
  flex-direction: column;
}

.tag-group-label {
  font-size: var(--prr-font-size-normal);
  margin-left:10px;
}

ul.tag-list {
  list-style-type: none;
  padding-left: 0px;
  margin-top: 0px;
  
}

.tag-list li {
  padding: 5px;
  display: inline-block;
}

</style>