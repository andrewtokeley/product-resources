<template>
  <div class="manage-resources">
    <div class="header">
      <div>
        <h1>Resources</h1>
      </div>
    </div>
    <div class="action-strip">
      
      <div class="action-items" >
        <div class="label">Filter By:</div>
        <base-select v-model="selectedStatus" :selectOptions="statusList"></base-select>
        <resource-type-select v-model="selectedResourceType"></resource-type-select>
      </div>
      <div class="action-items">
        <base-button :disabled="isLoading" :isSecondary="true" @click="showExport = true">Export...</base-button>
        <base-button :disabled="isLoading" @click="handleAddResource">New Resource</base-button>
      </div>
    </div>
    <table v-if="!isLoading">
      <thead>
        <tr>
          <th></th>
          <th colspan="2"><a @click="sortBy('displayName')" class="sortHeading" :class="sortHeadingClasses('displayName')">Name</a></th>
          <th ><a @click="sortBy('approved')" class="sortHeading" :class="sortHeadingClasses('approved')">Status</a></th>
          <th></th>
        </tr>
      </thead>
      
      
        <template v-for="resource in resources" :key="resource.id" >
          <tbody>
            <tr @click="handleEditClick(resource)">
              <td rowspan="2">
                <resource-image :hideActions="false" :preview="true" :resource="resource"></resource-image>
              </td>
              <td>{{ resource.displayName }}</td>
              <!-- <td class="centred">
                <a v-if="resource.numberOfRecommendations > 0" @click.prevent="handleRecommendationsClick">{{resource.numberOfRecommendations}}</a>
                <span v-else>-</span>
              </td> -->
              <td rowspan="2">{{ resource.statusDescription }}</td>
              <td rowspan="2">
                <div class="actions">
                  <base-icon :menu="menuItems(resource)">more_vert</base-icon>
                </div>
              </td>
            </tr>
            <tr>
              <td>Submitted by:</td>
            </tr>
          </tbody>
        </template>
    </table>
    <loading-symbol class="loader" v-else></loading-symbol>
    
    <edit-resource-dialog 
      :resource="resource" 
      v-if="showEdit" 
      @added="handleAdded" 
      @saved="handleSaved" 
      @close="showEdit = false">
    </edit-resource-dialog>
    
    <resource-detail 
      v-if="showView" 
      :resource="resource" 
      @close="showView = false" 
      @updatedApproval="handleApproval"
      @addRelated="handleAddRelated">
    </resource-detail>
    
    <confirmation-dialog 
      v-if="showDeleteConfirm"
      heading="Delete Resource" 
      :message="`Are you sure you want to delete the resource, ${resource.displayName}?`"
      confirmLabel="Delete"
      :isPerformingAction="isDeleting"
      @cancel="showDeleteConfirm = false"
      @close="showDeleteConfirm = false"
      @confirm="doDelete">
    </confirmation-dialog>
  </div>  
</template>

<script>
import ResourceImage from '@/modules/resources/components/ResourceImage.vue';
import BaseIcon from '@/core/components/BaseIcon.vue';
import BaseSelect from '@/core/components/BaseSelect.vue';
import EditResourceDialog from './EditResourceDialog.vue';
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue';
import ResourceTypeSelect from '@/modules/resources/components/ResourceTypeSelect.vue';
import BaseButton from '@/core/components/BaseButton.vue';
import ConfirmationDialog from '@/core/components/ConfirmationDialog.vue';
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';

import { deleteResource, getResourcesFull, updateResource } from '@/modules/resources/services/resource-service';
import { cloneDeep } from 'lodash';
import { Resource } from '@/modules/resources/model/resource';

export default {
  name: 'manage-resources',
  components: { ResourceImage, BaseIcon, BaseSelect, EditResourceDialog, BaseButton, ResourceTypeSelect, ConfirmationDialog, LoadingSymbol, ResourceDetail },
  data() {
    return {
      resource: Resource,
      parentResource: Resource,
      resources: [],
      showEdit: false,
      showAdd: false,
      showView: false,
      showRecommend: false,
      showDeleteConfirm: false,
      selectedResourceType: 'podcasts',
      isDeleting: false,
      isLoading: true,
      sortedBy: 'displayName',
      sortedByOrder: {},
      statusList: [],
      selectedStatus: null,
    }
  },
  mounted() {
    // trigger watch
    this.selectedResourceType = 'books';
    this.statusList = [
      { key:'approved', value: 'Approved'} ,
      { key:'pending', value: 'Pending'} ,
    ];
  },
  watch: {
    selectedResourceType(value) {
      this.isLoading = true;
      getResourcesFull(value).then( (resources) => {
        this.resources = resources;
        // resort the column, but don't toggle direction
        this.sortBy(this.sortedBy, false);
        this.isLoading = false;
      })
    } 
  },
  methods: {
    menuItems(resource) {
      return {
        menuItems: [
          {
            name: "Preview...",
            iconName: "preview",
            action: () => {
              this.handlePreviewClick(resource);
            }
          },
          { 
            isDivider: true,
            disabled: resource.approved || (!resource.approved && resource.isValid),
          },
          {
            name: "Approve",
            show: !resource.approved,
            isClickable: resource.isValid,
            isEnabled: resource.isValid,
            action: () => {
              this.setApproval(resource, true);
            }
          },
          {
            name: "Un-Approve",
            show: resource.approved,
            action: () => {
              this.setApproval(resource, false);
            }
          },
          { 
            isDivider: true,
          },
          {
            name: "Delete...",
            iconName: 'delete',
            action: () => {
              this.handleDeleteClick(resource);
            }
          },
        ]
        }
      },
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

      this.resources.sort( (a,b) => { 
        if(a[propName] < b[propName]) { return order == 'asc' ? -1 : 1; }
        if(a[propName] > b[propName]) { return order == 'desc' ? -1 : 1; }
        return 0;
      })
    },

    handleAddRelated(parent) {
      this.showView = false;
      this.resource = Resource.default();
      this.resource.authors = parent.authors;
      this.resource.parentResourceId = parent.id;
      this.resource.parentResourceName = parent.displayName;
      this.resource.parentResourceImageUrl = parent.imageUrl;
      this.showEdit = true;
    },

    handleRecommendClick(resource){
      this.resource = resource;
      this.showRecommend = true;
    },
    handleApproval(approved) {
      this.resource.approved = approved;
      this.showView = false;
    },
    handleAddResource() {
      this.resource = Resource.default();
      this.showEdit = true;
    },
    handlePreviewClick(resource) {
      this.resource = resource;
      this.showView = true;
    },
    handleEditClick(resource) {
      this.resource = resource;
      this.showEdit = true;
    },
    handleAdded(resource) {
      this.resource = resource;
      this.resources.unshift(resource);
      this.showEdit = false;
    },
    setApproval(resource, approved) {
      resource.approved = approved;
      updateResource(resource);
    },
    handleSaved(resource) {
      // copy the saved object back into the table/selected element
      this.resource = cloneDeep(resource);
      let index = this.resources.findIndex( r => r.id == resource.id )
      if (index >= 0) {
        this.resources[index] = this.resource;
      }
      this.showEdit = false;
    },
    handleDeleteClick(resource) {
      this.resource = resource;
      this.showDeleteConfirm = true
    },
    async doDelete() {
      try {
        this.isDeleting = true;
        await deleteResource(this.resource.id);
        let index = this.resources.indexOf(this.resource);
        if (index >= 0) {
          this.resources.splice(index,1);
        }
        this.resource == null;
      } catch (error) {
        this.isDeleting = false;
      }
      this.isDeleting = false;
      this.showDeleteConfirm = false;
    },
    handleRecommendationsClick() {
      this.$router.push('/admin/recommendations');
    }
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

tbody tr:last-child {
  /* border-bottom: 2px solid var(--prr-lightgrey); */
  /* border-bottom: 1px solid #ccced2; */
  border-bottom: 1px solid red;
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

tbody:hover {
  background: var(--prr-extralightgrey);
  cursor: pointer;
}
</style>