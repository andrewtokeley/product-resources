<template>
  <div class="manage-lookups">
    <div class="header">
      <div>
        <h1>Manage Lookups</h1>
      </div>
    </div>
    <div class="action-strip">
      <div class="action-items" >
        <div class="label">Lookup: </div>
        <base-select v-model="selectedLookupId" :selectOptions="lookupOptions"></base-select>
      </div>
      <div class="action-items">
        <!-- <base-button :disabled="isLoading" :isSecondary="true" @click="loadDefaultResourceTypes">Load Defaults</base-button> -->
        <base-button :disabled="isLoading" @click="handleAddItem">New Item</base-button>
      </div>
    </div>
    <table v-if="!isLoading">
      <thead>
        <tr>
          <th><a @click="sortBy('order')" class="sortHeading" :class="sortHeadingClasses('order')">Order</a></th>
          <th><a @click="sortBy('value')" class="sortHeading" :class="sortHeadingClasses('value')">Value</a></th>
          <th><a @click="sortBy('key')" class="sortHeading" :class="sortHeadingClasses('key')">Key</a></th>
          <th ><a @click="sortBy('description')" class="sortHeading" :class="sortHeadingClasses('description')">Description</a></th>
          <th ><a :class="sortHeadingClasses('groupList')">Groups</a></th>
          <th></th>
        </tr>
      </thead>
      
      <tbody>
        <tr v-for="item in lookup.items" :key="item.key" @click="handleEditClick(item)">
          <td>{{ item.order }}</td>
          <td>{{ item.value }}</td>
          <td>{{ item.key }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.groups }}</td>
          <td>
            <div class="actions">
              <base-icon @click="handleDeleteClick(item)" title="Delete">delete</base-icon>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <loading-symbol class="loader" v-else></loading-symbol>
    
    <edit-lookup-item-dialog
      :item="selectedItem" 
      :lookupKey="selectedLookupId"
      v-if="showEdit" 
      @added="handleAdded" 
      @saved="handleSaved" 
      @close="showEdit = false">
    </edit-lookup-item-dialog>
    
    <confirmation-dialog 
      v-if="showDeleteConfirm"
      heading="Delete" 
      :message="`Are you sure you want to delete the lookup item, ${selectedItem.value}`"
      confirmLabel="Delete"
      :isPerformingAction="isDeleting"
      @cancel="showDeleteConfirm = false"
      @close="showDeleteConfirm = false"
      @confirm="doDelete">
    </confirmation-dialog>
  </div>  
</template>

<script>
import BaseIcon from '@/core/components/BaseIcon.vue';
import EditLookupItemDialog from '@/modules/admin/views/EditLookupItemDialog.vue';
import BaseButton from '@/core/components/BaseButton.vue';
import ConfirmationDialog from '@/core/components/ConfirmationDialog.vue';
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';

import { getLookup, deleteLookupItem, LookUpKey } from '@/modules/resources/services/lookup-service';
import { cloneDeep } from 'lodash';
import { Lookup } from '@/modules/resources/model/lookup';
import BaseSelect from '@/core/components/BaseSelect.vue';
import { useLookupStore } from '@/core/state/lookupStore';

export default {
  name: 'manage-lookups',
  components: { BaseIcon, EditLookupItemDialog, BaseButton, ConfirmationDialog, LoadingSymbol, BaseSelect },
  data() {
    return {
      // resource: Resource,
      // parentResource: Resource,
      lookup: Lookup,
      selectedItem: {},
      showEdit: false,
      showAdd: false,
      showView: false,
      showDeleteConfirm: false,
      isDeleting: false,
      isLoading: true,
      sortedBy: null,
      sortedByOrder: {},
      selectedLookupId: '',
      lookupOptions: [],
    }
  },
  async mounted() {
    // trigger watch
    this.lookupOptions = [
      { key: LookUpKey.tags, value: 'Tags'},
      { key: LookUpKey.resourceTypes, value: 'Resource Types'}
    ];
    // this will trigger the watch event and retrieve/sort data.
    this.selectedLookupId = LookUpKey.tags;
  },
  watch: {
    selectedLookupId(lookupId) {
      this.isLoading = true;
      this.sortedBy = null;
      getLookup(lookupId).then ( (result) => {
        if (result) {
          this.lookup = result
          // get default sort order
          if (!this.sortedBy) {
            if (result.items.find( r => r.order && r.order.length > 0)) {
              this.sortedBy = 'order'
            } else {
              this.sortedBy = 'key'
            }
          }
          this.sortBy(this.sortedBy, false);
        }
        this.isLoading = false;
      })
    }
  },

  methods: {
    // async loadDefaultResourceTypes() {
    //   console.log('load')
    //   await updateDefaultResourceTypes();
    // },
    sortHeadingClasses(propName) {
      var classes = {
        sorted: false,
        asc: false,
        desc: false,
      }
      classes.sorted = this.sortedBy == propName;
      classes.asc = this.sortedByOrder[propName] == 'asc';
      classes.desc = this.sortedByOrder[propName] == 'desc';
      return classes;
    },

    sortBy(propName, toggle) {
      this.sortedBy = propName;
      let _toggle = toggle ?? true;

      var order = this.sortedByOrder[propName] ?? 'asc';
      if (_toggle) {  
        // reverse the order
        if (this.sortedByOrder[propName] == 'desc') {
          order = 'asc'
        } else if (this.sortedByOrder[propName] == 'asc') {
          order = 'desc'
        }
      }

      // remember the order for next toggle
      this.sortedByOrder[propName] = order;

      // sort the items
      console.log(`sort by ${propName}, ${this.sortedByOrder[propName]}`)
      this.lookup.items.sort( (a,b) => { 
        let aa = a[propName] ?? '';
        let bb = b[propName] ?? '';
        if(aa < bb) { return order == 'asc' ? -1 : 1; }
        if(aa > bb) { return order == 'desc' ? -1 : 1; }
        return 0;
      })
    },

    handleAddItem() {
      this.selectedItem = {};
      this.showEdit = true;
    },

    handleEditClick(item) {
      this.selectedItem = item
      this.showEdit = true;
    },

    async handleAdded(item) {
      this.selectedItem = item;
      this.lookup.items.unshift(item);
      this.showEdit = false;
    },

    async handleSaved(item) {
      // copy the saved object back into the table/selected element
      this.selectedItem = cloneDeep(item);
      let index = this.lookup.items.findIndex( t => t.key == item.key )
      if (index >= 0) {
        this.lookup.items[index] = this.selectedItem;
      }

      // refresh the lookup state, this will ensure the rest of the app have access to the latest changes
      let store = useLookupStore()
      store.fetchLookups();

      this.showEdit = false;
    },

    handleDeleteClick(item) {
      this.selectedItem = item;
      this.showDeleteConfirm = true
    },

    /**
     * Saves the entire lookup object and all the items
     */
    // async save() {
    //   await updateLookup(this.tagLookup);
    // },

    async doDelete() {
      try {
        this.isDeleting = true;
        
        // remove from firestore
        await deleteLookupItem(this.selectedLookupId, this.selectedItem);

        // remove from local items array
        let index = this.lookup.items.indexOf(this.selectedItem);
        if (index >= 0) {
          this.lookup.items.splice(index,1);
        }
        
      } catch (error) {
        this.isDeleting = false;
      }
      this.isDeleting = false;
      this.showDeleteConfirm = false;
    },
  }
}

</script>

<style scoped>
.loader {
  margin-top: 40px;
}
.label {
  font-size: var(--prr-font-size-normal);
  margin: 0 10px 10px 10px;
}
.action-items {
  display: flex;
  align-items: center;
  
}

.header {
  margin-top:50px;
  height: 50px;
}

.header h1 {
  margin: 0px;
  padding: 0px;
}
.header :nth-child(1) {
  float: left;
}

.action-strip {
  width: 100%;
  display: flex;
  justify-content: space-between;
  outline: 1px solid var(--prr-lightgrey);
  padding: 10px;
  box-sizing: border-box;
}
table {
  width: 100%;
  outline: 1px solid var(--prr-lightgrey);
  border-spacing: 0px;
  margin-bottom: 200px;
}

thead th {
  border-bottom: 1px solid var(--prr-darkgrey);
  height: 40px;
  padding-left: 10px;
  background: var(--prr-extralightgrey);
}

th {
  font-weight: bold;
  text-align: left;
  min-width: 100px;
}

th.right-aligned {
  text-align: right;
}

th a.sorted.asc::after, th a.sorted.desc::after {
  content: "";
  justify-self: end;
  width: 0.8em;
  height: 0.5em;
  margin-right: 10px;
  background-color: var(--prr-darkgrey);
  display: inline-block;
  margin-left: 10px;
}

th a.sorted.asc::after {
  clip-path: polygon(0% 100%, 100% 100%, 50% 0%);
}
th a.sorted.desc::after {
  clip-path: polygon(100% 0%, 0 0%, 50% 100%);
}

tbody td {
  /* border-bottom: 2px solid var(--prr-lightgrey); */
  border-bottom: 1px solid #ccced2;
  padding: 5px 10px;
}

tbody td.centred {
  text-align: center;
}

tr .actions {
  display:flex;
  justify-content: flex-end;
  visibility: hidden;
}
tr:hover .actions {
  visibility: visible;
}

tbody tr:hover {
  background: var(--prr-extralightgrey);
  cursor: pointer;
}
</style>