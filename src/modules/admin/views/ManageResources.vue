<template>
  <div class="manage-resources">
    <div class="header">
      <div>
        <h1>Resources</h1>
      </div>
    </div>
    <div class="tabs">
      <base-button :isSecondary="activeTab != 'recommended'" @click="filterByStatus('recommended')">Recommended</base-button>
      <base-button :isSecondary="activeTab != 'pending'" @click="filterByStatus('pending')" >Pending</base-button>
      <base-button :isSecondary="activeTab != 'approved'" @click="filterByStatus('approved')">Approved</base-button>
    </div>
    <div class="action-strip">
      <div v-if="activeTab == 'approved'" class="action-items left" >
        <div class="label">Filter By:</div>
        <base-select v-if="false" v-model="selectedStatus" :selectOptions="statusList"></base-select>
        <resource-type-select v-model="selectedResourceType"></resource-type-select>
      </div>
      <div class="action-items right">
        <base-button :disabled="isLoading" :isSecondary="true" @click="showExport = true">Export...</base-button>
        <base-button :disabled="isLoading" @click="handleAddResource">New Resource</base-button>
      </div>
      
    </div>
    <span class="record-count" v-if="visibleResources">{{ visibleResources.length }} results</span>
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
        <tr v-for="resource in visibleResources" :key="resource.id"  @click="handleEditClick(resource)">
          <td>
            <resource-image :hideActions="false" :preview="true" :resource="resource"></resource-image>
          </td>
          <td>{{ resource.displayName }}</td>
          <td>{{ resource.dateCreatedFormatted }}</td>
          <td>{{ resource.statusDescription }}</td>
          <td>
            <div class="actions">
              <base-button v-if="!resource.approved" :disabled="!resource.canApprove" @click.stop="setApproval(resource, true)">Approve</base-button>
              <base-button v-else @click.stop="setApproval(resource, false)" :isSecondary="true">Un-Approve</base-button>
              <base-icon :menu="menuItems(resource)">more_vert</base-icon>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <loading-symbol class="loader" v-else></loading-symbol>
    
    <edit-resource-dialog 
      :resource="selectedResource" 
      v-if="showEdit" 
      @added="handleAdded" 
      @saved="handleSaved" 
      @close="showEdit = false">
    </edit-resource-dialog>
    
    <resource-detail 
      v-if="showView" 
      :resource="selectedResource" 
      @close="showView = false" 
      @addRelated="handleAddRelated">
    </resource-detail>
    
    <confirmation-dialog 
      v-if="showDeleteConfirm"
      heading="Delete Resource" 
      :message="`Are you sure you want to delete the resource, ${selectedResource.displayName}?`"
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

import { deleteResource, searchByResourceTypes, getPendingResources, updateResource } from '@/modules/resources/services/resource-service';
import { cloneDeep } from 'lodash';
import { Resource } from '@/modules/resources/model/resource';
import { getUnlinkedRecommendations } from '@/modules/recommendations/services/recommendation-service';

export default {
  name: 'manage-resources',
  components: { ResourceImage, BaseIcon, BaseSelect, EditResourceDialog, BaseButton, ResourceTypeSelect, ConfirmationDialog, LoadingSymbol, ResourceDetail },
  data() {
    return {
      selectedResource: Resource,
      parentResource: Resource,
      recommendedResources:null,
      pendingResources:null,
      approvedResources: {}, // property for each resource type that's been retrieved
      visibleResources: [],
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
    // this.selectedResourceType = 'books';
    this.statusList = [
      { key:'approved', value: 'Approved'} ,
      { key:'pending', value: 'Pending'} ,
    ];
    this.filterByStatus('recommended');
  },
  watch: {
    selectedResourceType() {
      // you can only apply this filter on approved tab, so refresh for this new type
      this.filterByStatus('approved');
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
      this.isLoading = true;
      this.activeTab = status;
      var resources = [];
      if (status == 'approved') {
        // check if we have retrieved resources for the selected resource type
        resources = this.approvedResources[this.selectedResourceType];
        if (!resources) {
          resources = await searchByResourceTypes([this.selectedResourceType], 100, true);
          this.approvedResources[this.selectedResourceType] = resources;
        }
      } else if (status == 'pending') {
        resources = this.pendingResources;
        if (!resources) {
          resources = await getPendingResources(100);
          this.pendingResources = resources;
        }
      } else if (status == 'recommended') {
        resources = this.recommendedResources;
        if (!resources) {
          const recommendations = await getUnlinkedRecommendations()
          resources = recommendations.map( r => Resource.fromRecommendation(r));
          this.recommendedResources = resources;
        }
      }
      this.visibleResources = resources;
      this.isLoading = false;
    },

    handleAddRelated(parent) {
      this.showView = false;
      this.selectedResource = Resource.default();
      this.selectedResource.authors = parent.authors;
      this.selectedResource.parentResourceId = parent.id;
      this.selectedResource.parentResourceName = parent.displayName;
      this.selectedResource.parentResourceImageUrl = parent.imageUrl;
      this.showEdit = true;
    },

    handleRecommendClick(resource){
      this.selectedResource = resource;
      this.showRecommend = true;
    },
    // handleApproval(approved) {
    //   this.selectedResource.approved = approved;
    //   this.showView = false;
    // },

    handleAddResource() {
      this.selectedResource = Resource.default();
      this.showEdit = true;
    },

    handlePreviewClick(resource) {
      this.selectedResource = resource;
      this.showView = true;
    },

    handleEditClick(resource) {
      this.selectedResource = resource;
      this.showEdit = true;
    },

    handleAdded(resource) {
      this.selectedResource = resource;
      // add to the top of the pending list
      this.pendingResources.unshift(resource);
      this.filterByStatus('pending');
      this.showEdit = false;
    },

    setApproval(resource, approve) {
      resource.approved = approve;
      updateResource(resource);

      const index = this.visibleResources.indexOf(resource);
      if (index >= 0) {
        this.visibleResources[index].approved = approve;
        
        // if we're approving and we've already retrieved the approved reviews
        // add it to the top of the approvedReviews array and remove from pending 
        if (approve) {
          if (this.approvedResources[this.selectedResourceType]) {
            this.approvedResources[this.selectedResourceType].unshift(resource);
          }
          this.pendingResources?.splice(index, 1);
          this.visibleResources = this.pendingResources;
        } 
        // if we're un-approving and we've already retrieved the pending reviews
        // add it to the top of the pendingReviews array and remove from approved
        else {
          if (this.pendingResources) {
            this.pendingResources.unshift(resource);
          }
          this.approvedResources[this.selectedResourceType]?.splice(index, 1);
          this.visibleResources = this.approvedResources[this.selectedResourceType];
        }
      }
    },

    handleSaved(resource) {
      // copy the saved object back into the table/selected element
      this.selectedResource = cloneDeep(resource);
      let index = this.visibleResources.findIndex( r => r.id == resource.id )
      if (index >= 0) {
        this.visibleResources[index] = this.selectedResource;
      }
      this.showEdit = false;
    },

    handleDeleteClick(resource) {
      this.selectedResource = resource;
      this.showDeleteConfirm = true
    },

    async doDelete() {
      try {
        console.log('delete');
        this.isDeleting = true;
        await deleteResource(this.selectedResource.id);
        let index = this.visibleResources.indexOf(this.selectedResource);
        if (index >= 0) {
          this.visibleResources.splice(index,1);
        }
        this.selectedResource == null;
      } catch (error) {
        this.isDeleting = false;
      }
      this.isDeleting = false;
      this.showDeleteConfirm = false;
    },
    // handleRecommendationsClick() {
    //   this.$router.push('/admin/recommendations');
    // }
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
  height: 80px;
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