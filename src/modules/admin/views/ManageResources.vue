<template>
  <div class="manage-resources">
    <div class="header">
      <div>
        <h1>Resources</h1>
      </div>
    </div>
    <div class="tabs">
      <base-button :isSecondary="activeTab != 'live'" @click="filterByStatus('live')">Live</base-button>
      <base-button :isSecondary="activeTab != 'draft'" @click="filterByStatus('draft')" >Draft</base-button>
      <base-button :isSecondary="activeTab != 'recommended'" @click="filterByStatus('recommended')">Recommended</base-button>
    </div>
    <div class="action-strip">
      <div v-if="activeTab == 'live'" class="action-items left" >
        <div class="label">Filter By:</div>
        <base-select v-if="false" v-model="selectedStatus" :selectOptions="statusList"></base-select>
        <resource-type-select v-model="selectedResourceType"></resource-type-select>
      </div>
      <div class="action-items right">
        <base-button :disabled="isLoading" :isSecondary="true" @click="showExport = true">Export...</base-button>
        <base-button :disabled="isLoading" @click="handleAddResource">New Resource</base-button>
      </div>
    </div>
    <table v-if="!isLoading">
      <thead>
        <tr>
          <th></th>
          <th><a @click="sortBy('displayName')" class="sortHeading" :class="sortHeadingClasses('displayName')">Name</a></th>
          <th><a @click="sortBy('dateCreated')" class="sortHeading" :class="sortHeadingClasses('dateCreated')">Created</a></th>
          <th ><a @click="sortBy('approved')" class="sortHeading" :class="sortHeadingClasses('approved')">Status</a></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr  v-for="resource in filteredResources" :key="resource.id"  @click="handleEditClick(resource)">
          <td>
            <resource-image :hideActions="false" :preview="true" :resource="resource"></resource-image>
          </td>
          <td>{{ resource.displayName }}</td>
          <td>{{ resource.dateCreatedFormatted }}</td>
          <td>{{ resource.statusDescription }}</td>
          <td>
            <div class="actions">
              <base-icon :menu="menuItems(resource)">more_vert</base-icon>
            </div>
          </td>
        </tr>
      </tbody>
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

import { deleteResource, searchByResourceTypes, updateResource } from '@/modules/resources/services/resource-service';
import { cloneDeep } from 'lodash';
import { Resource } from '@/modules/resources/model/resource';
import { getUnlinkedRecommendations } from '@/modules/recommendations/services/recommendation-service';

export default {
  name: 'manage-resources',
  components: { ResourceImage, BaseIcon, BaseSelect, EditResourceDialog, BaseButton, ResourceTypeSelect, ConfirmationDialog, LoadingSymbol, ResourceDetail },
  data() {
    return {
      resource: Resource,
      parentResource: Resource,
      resources: [],
      filteredResources: [],
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
      activeTab: 'live',
    }
  },
  mounted() {
    // trigger watch
    this.selectedResourceType = 'books';
    this.statusList = [
      { key:'approved', value: 'Approved'} ,
      { key:'pending', value: 'Pending'} ,
    ];
    this.filterByStatus('live');
  },
  watch: {
    selectedResourceType(value) {
      this.isLoading = true;
      console.log('filter by' + value);
      searchByResourceTypes([value], 100, false).then( (resources) => {
        this.resources = resources;
        this.filteredResources = resources;
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

      this.filteredResources.sort( (a,b) => { 
        if(a[propName] < b[propName]) { return order == 'asc' ? -1 : 1; }
        if(a[propName] > b[propName]) { return order == 'desc' ? -1 : 1; }
        return 0;
      })
    },

    async filterByStatus(status) {
      this.activeTab = status;
      if (status == 'live') {
        this.filteredResources = this.resources.filter ( r => r.approved);
      } else if (status == 'draft') {
        this.filteredResources = this.resources.filter ( r => !r.approved);
      } else if (status == 'recommended') {
        const recommendations = await getUnlinkedRecommendations()
        let psuedoResources = recommendations.map( r => Resource.fromRecommendation(r));
        this.filteredResources = psuedoResources;
      }
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
  height: 60px;
  /* display: flex;
  justify-content: space-between; */
  outline: 1px solid var(--prr-lightgrey);
  padding: 10px;
  box-sizing: border-box;
}


.action-strip .action-items.left {
  float: left;
}
.action-strip .action-items.right {
  float: right;
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