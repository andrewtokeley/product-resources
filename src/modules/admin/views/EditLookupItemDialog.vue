<template>
  <modal-dialog 
    :title="title"
    :subTitle="editItem.value"
    :fullscreen="false" 
    :isLoading="isWorking"
    @close="$emit('close')" 
    @buttonClick="handleButtonClick"
    :buttonActions="buttons">
    <div class="content"> 
      
      <div class="label tight">{{ keyDescription }}</div>
      <base-input
        :hasFocus="isNew"
        v-model="editItem.key"
        :options="{ readOnly: !isNew }"
      ></base-input>

      <div class="double-line">
        <div>
          <div class="label">Display value</div>
          <base-input
          :hasFocus="!isNew"
          :errorMessage="errorMessage['value']"
          v-model="editItem.value"
          :options="{   
            maximumLength: 100,
            placeholder: 'Add Value'}"
          ></base-input>
        </div>
        <div>
          <div class="label">Order (Optional)</div>
          <base-input
            v-model="editItem.order"
            :options="{placeholder: 'Add OrderBy Value'}"
          ></base-input>
          <div class="description">If not provided valies will be ordered by description.</div>
          
        </div>
      </div>

      <div class="label">Description</div>
      <div class="description">This will be displayed to users when filtering by resource types or tags.</div>
      <base-multiline-text
        v-model="editItem.description"
        :errorMessage="errorMessage['description']"
        :options="{ 
          placeholder: 'Add Description',
          numberOfLines: 10,
          maximumLength: 1000, 
          showCharacterCount: true}"
      ></base-multiline-text>

      <div class="subheading">Optional Meta Data</div>
      
      <div class="label">Groups (comma delimited)</div>
      <div class="description">
        A lookup can belong to one or many groups. Include commas between group names. 
        The '_General' group will be automatically added to all lookups. 
      </div>
      <base-input
        :errorMessage="errorMessage['groups']"
        v-model="editItem.groups"
        :options="{   
          maximumLength: 300,
          placeholder: 'Add Groups' }"
      ></base-input>

      <div class="label">Material Icon Name</div>
      <div class="description">
        Lookups can have an icon attributed to it. Currently this is only used for resource types.
      </div>
      <div class="double-line">
        <base-input
          v-model="editItem.icon"
          :options="{   
            maximumLength: 100,
            placeholder: 'Add Icon Name' }"
        ></base-input>
        <span class="material-symbols-outlined">
          {{ editItem.icon }}
        </span>
      </div>

      <div class="label">Show on Home Page</div>
      <div class="description">
        If selected, the tag or resource type will be used as a group on the home page.
      </div>
      <base-check-box 
        v-model="editItem.showOnHomePage"
        label="Show on homepage?"
        :leftAlign="true">
      </base-check-box>

    </div>
  </modal-dialog>
</template>

<script>
import BaseInput from "@/core/components/BaseInput.vue";
import BaseMultilineText from "@/core/components/BaseMultilineText.vue";
import ModalDialog from '@/core/components/ModalDialog.vue';
import BaseCheckBox from '@/core/components/BaseCheckBox.vue';

import { cloneDeep } from 'lodash';
import { LookUpKey, addLookupItem, updateLookupItem } from '@/modules/resources/services/lookup-service';

export default {
  components: { 
    BaseInput,
    BaseMultilineText,
    ModalDialog,
    BaseCheckBox,
  },
  name: "edit-lookup-item",
  emits: ['close', 'saved', 'added'],
  data() {
    return {
      editItem: {},
      isWorking: true,
      modalTitle: '...',
      errorMessage: [],
      keyDescription: '',
    }
  },

  props: {
    item: {},
    lookupKey: {
      type: String,
      required: true,
    }
  },

  async mounted() {
    this.isWorking = true;

    this.keyDescription = "Unique id " + (!this.isNew ? '(read only)' : '');
    // take a copy we can edit
    this.editItem =  cloneDeep(this.item);

    this.isWorking = false;
  },
  
  computed: {
    title() {
      let prefix = this.isNew ? "New" : "Edit";
      if (this.lookupKey == LookUpKey.tags) {
        return  `${prefix} Tag`;
      } else if (this.lookupKey == LookUpKey.resourceTypes) {
        return  `${prefix} Resource Type`;
      } else {
        return prefix; 
      }
    },
    isNew() {
      return this.item.key == null;
    },
    buttons() {
      var actions = [];
      actions.push( {
        id: 'cancel',
        title: "Cancel",
        isSecondary: true,
      });
      actions.push( {
        id: 'save',
        title: "Save",
        isPrimary: true,
        show: !this.isNew
      });
      actions.push( {
        id: 'add',
        title: "Add as Draft",
        isPrimary: true,
        show: this.isNew
      });
      return actions;
    },
  },

  methods: {
    
    // setTitle() {  
    //   if (this.editItem.value?.length > 0) {
    //     this.modalTitle = "Edit Item";
    //   } else {
    //     this.modalTitle = "Add Item"
    //   }
    // },

    async handleButtonClick(button) {
      if (button.id == 'add') {
        await addLookupItem(this.lookupKey, this.editItem);
        this.$emit('added', this.editItem);
      }
      if (button.id == 'save') {
        await updateLookupItem(this.lookupKey, this.item, this.editItem);
        this.$emit('saved', this.editItem);
      }
      if (button.id == 'cancel') {
        this.$emit('close');
      }
    },
  }
}
</script>

<style scoped>

.double-line{
display: flex;
flex-direction: row;
align-items: top;
justify-content: space-around;
gap:20px;
/* not sure why I need to set this? */
/* height: 50px; */
}
.double-line :nth-child(2), .double-line :nth-child(1) {
  width:100%;
}
.label {
  font-weight: bold;
color: var(--prr-darkgrey);
margin-top: 20px;
margin-bottom: 5px;
}

.label::after {
  content: ':';
}

.label.tight {
margin-top: 0px;
}

.subheading {
  margin-top: 15px;
  font-weight: bold;
  text-transform: uppercase;
}

.description {
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>