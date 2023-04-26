<template>
      <div class="content" :class="{ working: isWorking }">        
        
        <div class="grid">

          <div class="entry">
            <base-input
              v-model="resource.displayName"
              :options="{ 
                maximumLength: 300,
                placeholder: 'Add title'}"
            ></base-input>
          </div>

          <base-icon class="icon">person</base-icon>
          <div class="entry">
            <base-input
              v-model="authorsList"
              :options="{ 
                placeholder: 'Add Author'}"
            ></base-input>
            <div class="helpText">
              If more than one author, separate with commas.
            </div>
          </div>
          
          <base-icon class="icon">image</base-icon>
          <div class="entry">
            <base-input
              v-model="resource.imageUrl"
              :options="{ 
                placeholder: 'Add Image URL'}"
            ></base-input>
          </div>

          <base-icon class="icon">link</base-icon>
          <div class="entry">
            <base-input
              v-model="resource.resourceUrl"
              :options="{ 
                placeholder: 'Add Resource URL'}"
            ></base-input>
          </div>
          
          <base-icon class="icon">calendar_month</base-icon>
          <div class="entry">
            <date-picker v-model="resource.publishedDate"></date-picker>
          </div>
          
          <div class="entry">
            <base-select
              v-model="resource.resourceType"
              :selectOptions="resourceTypes.items"
              :options="{ 
                placeholder: 'Select Type'}"
            ></base-select>
          </div>
          
          <base-icon class="icon">notes</base-icon>
          <div class="entry">
            <base-multiline-text
              v-model="resource.description"
              :options="{ 
                placeholder: 'Add description',
                numberOfLines: 10,
                maximumLength: 1000, 
                showCharacterCount: true}"
            ></base-multiline-text>
          </div>

          <div v-if="resource.tags" class="entry">
            <div class="openingText">
              Select which tags apply to this resource.
            </div>
            <tag-selector v-model="resource.tags"></tag-selector>
          </div>
        
        </div>
        <div class="buttonStrip">
          <div class="buttonStrip--left">
            <base-button
              :isDestructive="true"
              @click="handleDeleteOpen"
              >Delete</base-button
          >
          </div>
          <div class="buttonStrip--right">
            <base-button
              :isSecondary="true"
              @click="$router.back()"
              >Cancel</base-button
            >
            <base-button @click="handleSave">Save</base-button
            >
          </div>
        </div>
        <modal-dialog v-if="showDeleteAlert" title="Delete" :actions="deleteActions" @close="showDeleteAlert = false;">
        <p>Are you sure?</p>
        <p>This will delete all checkins, images...</p>  
      </modal-dialog>
    </div>
  
</template>

<script>
import BaseInput from "@/core/components/BaseInput.vue"
import BaseButton from "@/core/components/BaseButton.vue"
import BaseIcon from "@/core/components/BaseIcon.vue"
import BaseMultilineText from "@/core/components/BaseMultilineText.vue";
import BaseSelect from "@/core/components/BaseSelect";
import DatePicker from "@/core/components/DatePicker";

import ModalDialog from "@/core/components/ModalDialog";
import { getResource, updateResource, addResource } from "@/modules/resources/services/resource-service"
import { getResourceTypes } from "@/modules/resources/services/lookup-service"

import { Resource } from "@/modules/resources/model/resource"
import TagSelector from '@/modules/resources/components/TagSelector.vue';

export default {
  name: "UpdateResource",
  components: {
    BaseInput,
    BaseButton,
    BaseIcon,
    BaseMultilineText,
    BaseSelect,
    ModalDialog,
    DatePicker,
    TagSelector,
  },

  emits: ['saved'],

  props: {
    resourceId: {
      type: String,
      default: null
    }
  },

  data() {
    const vm = this;
    return {
      temp: [{key: 'kkk', value: 'vvv'}],
      resource: {
        type: Resource,
        default: () => {}
      },
      resourceTypeItem: null,
      resourceTypes: [],
      authorsList: "",
      showDeleteAlert: false,
      isWorking: true,
      deleteActions: [
        { id: 0, 
          title: "Cancel", 
          isSecondary: true,
          handle: () => {
            vm.showDeleteAlert = false;
          }
        },
        { id: 1, 
          title: "Delete", 
          isDestructive: true,
          handle: () => {
            vm.handleDelete();
            vm.showDeleteAlert = false;
          }
        }
      ],
    };
  },

  computed: {
    authorsArray() {
      return this.authorsList.split(",")
    },
    title() {
      if (this.resource.id) {
        return this.resource.displayName
      } else {
        return "Add Resource"
      }
    }
  },

  async mounted() {
    this.isWorking = true;
    this.resourceTypes = await getResourceTypes();
    this.resource = await getResource(this.resourceId);
    if (this.resource.authors) {
      this.authorsList = this.resource.authors.join(',');
    }
    this.isWorking = false;
  },

  methods: {
    
    handleDeleteOpen() {
      this.showDeleteAlert = true;
    },

    handleDelete() {
      console.log('do delete'); 
    },

    async handleSave() {
      this.isWorking = true;
      this.resource.authors = this.authorsArray;

      if (this.resource.id) {
        //this is an existing resource, update...
        await updateResource(this.resource)        
      } else {
        //this is a new resource        
        await addResource(this.resource)
      }
      this.$emits('saved');
      this.isWorking = false;
    },
  },
  
};

</script>

<style scoped>
.content {
  background-color: white;
}
.content.working {
  display:none;
}

.content {
  position: relative;
  top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
}

.content h1 {
  font-size: 1.5em;
}

.content p {
  color: var(--prr-mediumgrey);
  margin-bottom: 20px;
}

.buttonStrip {
  display: flex;
  justify-content:space-between;
}

.buttonStrip-left {
  display: flex;
  justify-content:flex-start;
}

.buttonStrip-right {
  display: flex;
  justify-content:flex-end;
}

.grid {
  display: grid;
  grid-template-columns: 30px 1fr;
  margin-bottom: 20px;
}

.grid .icon {
  /* padding-top: 10px; */
  grid-column: 1 / 2;
  align-self: flex-start;
}

.grid .entry {
  grid-column: 2 / 3;
  align-self: flex-start;
}

.grid .entry .helpText {
  font-size: 0.8em;
  color: var(--prr-mediumgrey);
  padding-left: 10px;
  padding-bottom: 20px;
  margin-top:-20px;
}

.grid .entry .openingText {
  font-size: var(--prr-font-noomal);
  color: var(--prr-darkgrey);
  /* padding-left: 10px; */
  padding-bottom: 20px;
}
</style>