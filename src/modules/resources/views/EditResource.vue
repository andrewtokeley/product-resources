<template>
  <div class="content" :class="{ working: isWorking }">        
    
      <div class="line">
        <div class="entry">
          <base-input
            v-model="local.displayName"
            @input="update('displayName', $event.target.value)"
            :options="{ 
              maximumLength: 300,
              inlineErrors: false,
              placeholder: 'Add title'}"
          ></base-input>
      </div>
      </div>

      <div class="split-line">
        <div class="entry">
          <base-select
            v-model="local.resourceType"
            @input="update('resourceType', $event.target.value)"
            :selectOptions="resourceTypes.items"
            :options="{ 
              placeholder: 'Select Type'}"
          ></base-select>
        </div>

        <div class="entry">
          <authors-list 
            v-model="local.authors"
            @input="update('authors', $event.target.value)"
          >
          </authors-list>
        </div>
      </div>

      <div class="split-line">
        <div class="entry">
          <date-picker 
            v-model="local.publishedDate"
            @input="update('publishedDate', $event.target.value)"
          ></date-picker>
        </div>
        <div class="entry"></div>
      </div>

      <div class="line">
        <div class="entry">
          <base-input
            v-model="local.imageUrl"
            @input="update('imageUrl', $event.target.value)"
            :options="{ 
              placeholder: 'Add Image URL'}"
          ></base-input>
        </div>
      </div>

      <div class="line">
        <div class="entry">
          <base-input
            v-model="local.resourceUrl"
            @input="update('resourceUrl', $event.target.value)"
            :options="{ 
              placeholder: 'Add Resource URL'}"
          ></base-input>
        </div>
      </div>
      
      <div class="line">
        <div class="entry">
          <base-multiline-text
            v-model="local.description"
            @input="update('description', $event.target.value)"
            :options="{ 
              placeholder: 'Add description',
              numberOfLines: 10,
              maximumLength: 1000, 
              showCharacterCount: true}"
          ></base-multiline-text>
        </div>
      </div>

      <div v-if="local.tags" class="line">
        <div class="entry">
          <p>Select which tags apply to this resource.</p>
          <tag-selector 
            v-model="local.tags"
            @input="update('tags', $event.target.value)"
          ></tag-selector>
        </div>
      </div> 

    </div>
</template>

<script>
import BaseInput from "@/core/components/BaseInput.vue";
import BaseMultilineText from "@/core/components/BaseMultilineText.vue";
import BaseSelect from "@/core/components/BaseSelect";
import DatePicker from "@/core/components/DatePicker";
import TagSelector from "@/modules/resources/components/TagSelector";
import AuthorsList from "@/modules/resources/components/AuthorsList"

import { Resource } from '@/modules/resources/model/resource';
import { cloneDeep, tap, set } from 'lodash';
import { getResourceTypes } from '../services/lookup-service';

export default {
  components: { 
    BaseInput,
    BaseMultilineText,
    BaseSelect,
    DatePicker,
    TagSelector,
    AuthorsList,
  },
  name: "edit-resource",

  data() {
    return {
      isWorking: false,
      resourceTypes: [],
    }
  },

  props: {
    modelValue: Object,
  },

  async mounted() {
    this.resourceTypes = await getResourceTypes();
  },
  
  computed: {
    local() {
      return this.modelValue ? this.modelValue : Resource.default()
    },
  },

  methods: {
    update(key, value) {
      const copy = tap(cloneDeep(this.local), v => set(v, key, value));
      this.$emit('input', copy)
    },
  }
}
</script>

<style scoped>


.line, .split-line {
  display:flex;
  flex-direction: row;
  justify-content:stretch;
}

.split-line {
  display:flex;
  flex-direction: row;
  justify-content:space-between;
  column-gap: 10px;
}

.entry {
  width: 100%;
}
/* .split-line .entry {
  width: 40%;
} */
</style>