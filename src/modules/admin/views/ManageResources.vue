<template>
  <div class="manage-resources">
    <div class="header">
      <div>
        <h1>Resources</h1>
      </div>
    </div>
    <div class="tabs">
      <base-button :isSecondary="activeTab != 'recommendations'" @click="filterByStatus('recommendations')">Recommendations</base-button>
      <base-button :isSecondary="activeTab != 'draft'" @click="filterByStatus('draft')" >Draft</base-button>
      <base-button :isSecondary="activeTab != 'approved'" @click="filterByStatus('approved')">Approved</base-button>
    </div>
    <div class="action-strip">
      <div v-if="activeTab == 'approved'" class="action-items left" >
        <div class="label">Filter By:</div>
        <resource-type-select v-model="selectedResourceType"></resource-type-select>
      </div>
      <div class="action-items right">
        <base-button :disabled="isLoading" :isSecondary="true" @click="showExport = true">Export...</base-button>
        <base-button :disabled="isLoading" @click="handleAddResource">New Resource</base-button>
      </div>
      
    </div>
    <div class="record-count" v-if="visibleRecords.length > 0">
      <span>{{ visibleRecords.length }} results</span>
    </div>

    <table v-if="activeTab != 'recommendations' && !isLoading && visibleRecords?.length > 0">
      <thead>
        <tr>
          <th></th>
          <th><a @click="sortBy('displayName')" class="sortHeading" :class="sortHeadingClasses('displayName')">Name</a></th>
          <th><a @click="sortBy('dateCreated')" class="sortHeading" :class="sortHeadingClasses('dateCreated')">Created</a></th>
          <th v-if="activeTab == 'approved'" ><a @click="sortBy('isFavourite')" class="sortHeading" :class="sortHeadingClasses('isFavourite')">Favourite</a></th>
          <th v-else ><a @click="sortBy('approved')" class="sortHeading" :class="sortHeadingClasses('approved')">Status</a></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="resource in visibleRecords" :key="resource.id"  @click="handleEditClick(resource)">
          <td>
            <resource-image :hideActions="false" :preview="true" :resource="resource"></resource-image>
          </td>
          <td>{{ resource.displayName }}</td>
          <td>{{ resource.dateCreatedFormatted }}</td>
          <td v-if="activeTab == 'approved'">{{ resource.isFavourite ? "Yes" : "" }}</td>
          <td v-else>{{ resource.statusDescription }}</td>
          <td>
            <div class="actions">
              <base-button v-if="!resource.approved" :disabled="!resource.canApprove" @click.stop="setApproval(resource, true)">Approve</base-button>
              <base-button v-else @click.stop="setApproval(resource, false)" :isSecondary="true">Un-Approve</base-button>
              <base-icon @click="handlePreviewClick(resource)">visibility</base-icon>
              <base-icon :menu="menuItems(resource)">more_vert</base-icon>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <table v-if="activeTab == 'recommendations' && !isLoading && visibleRecords?.length > 0">
      <thead>
        <tr>
          <th style="width: 200px;">Url</th>
          <th style="width: 200px;"><a @click="sortBy('dateCreated')" class="sortHeading" :class="sortHeadingClasses('dateCreated')">Created</a></th>
          <th style="width: 200px;"><a @click="sortBy('recommendedByName')" class="sortHeading" :class="sortHeadingClasses('recommendedByName')">Recommended By</a></th>
          <th></th>
        </tr>
      </thead>
      <tbody class="body-hover" v-for="recommendation in visibleRecords" :key="recommendation.id">
        <tr>
          <td><a :href="recommendation.resourceUrl" target="_blank">{{ recommendation.resourceUrl }}</a></td>
          <td>{{ recommendation.dateCreatedFormatted }}</td>
          <td>{{ recommendation.recommendedByName }}</td>
          <td rowspan="2">
            <div class="actions">
              <base-button v-if="!recommendation.resourceId" :showSpinner="isCreatingResource"  @click.stop="createResourceFromRecommendation(recommendation)">Create Resource...</base-button>
              <base-icon :menu="recommendationMenuItems(recommendation)">more_vert</base-icon>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="3">Internal Note: {{recommendation.comment ?? '-'}}</td>
          
        </tr>
        <tr>
          <td class="review" colspan="3">"{{recommendation.review?.reason}}""</td>
          <td></td>
        </tr>

      </tbody>
    </table>

    <div v-if="visibleRecords.length == 0" class="no-results">
      Nothing to see here 😭
    </div>
    <loading-symbol v-if="isLoading" class="loader" ></loading-symbol>
    
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
      :show-unapproved-reviews="true"
      @close="showView = false" 
      @addRelated="handleAddRelated">
    </resource-detail>
    
    <confirmation-dialog 
      v-if="showDeleteConfirm"
      heading="Delete" 
      :message="deleteMessage"
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
import EditResourceDialog from './EditResourceDialog.vue';
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue';
import ResourceTypeSelect from '@/modules/resources/components/ResourceTypeSelect.vue';
import BaseButton from '@/core/components/BaseButton.vue';
import ConfirmationDialog from '@/core/components/ConfirmationDialog.vue';
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';

import { deleteResource, searchByResourceTypes, getPendingResources, updateResource, addResource, getResource } from '@/modules/resources/services/resource-service';
import { deleteRecommendation, getUnlinkedRecommendations } from '@/modules/recommendations/services/recommendation-service';

import { cloneDeep } from 'lodash';
import { Resource } from '@/modules/resources/model/resource';
import { Recommendation } from '@/modules/recommendations/model/recommendation';

export default {
  name: 'manage-resources',
  components: { ResourceImage, BaseIcon, EditResourceDialog, BaseButton, ResourceTypeSelect, ConfirmationDialog, LoadingSymbol, ResourceDetail },
  data() {
    return {
      selectedResource: Resource,
      selectedRecommendation: Recommendation,
      parentResource: Resource,
      recommendations:null,
      pendingResources:null,
      approvedResources: {}, // property for each resource type that's been retrieved
      visibleRecords: [],
      showEdit: false,
      showAdd: false,
      showView: false,
      showRecommend: false,
      showDeleteConfirm: false,
      deleteMessage: 'Are you sure?',
      selectedResourceType: 'podcasts',
      isDeleting: false,
      isLoading: true,
      isCreatingResource: false,
      sortedBy: 'displayName',
      sortedByOrder: {},
      statusList: [],
      selectedStatus: null,
      activeTab: 'recommendations',
    }
  },
  async mounted() {
    // trigger watch
    // this.selectedResourceType = 'books';
    this.statusList = [
      { key:'approved', value: 'Approved'} ,
      { key:'draft', value: 'Pending'} ,
    ];

    const resourceId = this.$route.query.edit;
    if (resourceId) {
      this.selectedResource = await getResource(resourceId);
      if (this.selectedResource) {
        this.selectedResourceType = this.selectedResource.resourceType;
        await this.filterByStatus('approved');
        this.showEdit = true;
      }
    } else {
      await this.filterByStatus('recommendations');
    }

    this.sortBy('dateCreated', 'desc');
  },
  watch: {
    selectedResourceType() {
      // you can only apply this filter on approved tab, so refresh for this new type
      this.filterByStatus('approved');
    } 
  },
  methods: {
    recommendationMenuItems(recommendation) {
      return {
        menuItems: [
          {
            name: "Delete...",
            iconName: "delete",
            action: () => {
              this.handleDeleteRecommendationClick(recommendation);
            }
          },
        ]
      }
    },
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

    sortBy(propName, order) {
      this.sortedBy = propName;

      // if no order is provided toggle from last ordering
      const toggle = (order == undefined || order == null)
      if (toggle) {  
        // reverse the order
        if (this.sortedByOrder[propName] == 'asc') {
          order = 'desc'
        } else {
          order = 'asc'
        }
      }

      // remember the order for next toggle
      this.sortedByOrder[propName] = order;

      this.visibleRecords.sort( (a,b) => { 
        if(a[propName] < b[propName]) { return order == 'asc' ? -1 : 1; }
        if(a[propName] > b[propName]) { return order == 'asc' ? 1 : -1; }
        return 0;
      })
    },

    async filterByStatus(status) {
      this.isLoading = true;
      this.activeTab = status;
      var results = [];
      if (status == 'approved') {
        // check if we have retrieved resources for the selected resource type
        results = this.approvedResources[this.selectedResourceType];
        if (!results) {
          results = await searchByResourceTypes([this.selectedResourceType], 100, true);
          this.approvedResources[this.selectedResourceType] = results;
        }
      } else if (status == 'draft') {
        results = this.pendingResources;
        if (!results) {
          results = await getPendingResources(100);
          this.pendingResources = results;
        }
      } else if (status == 'recommendations') {
        results = this.recommendations;
        if (!results) {
          results = await getUnlinkedRecommendations()
          // results = recommendations.map( r => {
          //   let resource = Resource.fromRecommendation(r)
          //   resource.comment = r.recommendationComment ?? "No comment";
          //   return resource;
          // });
          console.log('lll')
          this.recommendations = results;
        }
      }
      this.visibleRecords = results;
      // console.log(this.visibleRecords.length);
      this.isLoading = false;
    },

    async createResourceFromRecommendation(recommendation) {
      this.isCreatingResource = true;
      let resource = Resource.fromRecommendation(recommendation);
      resource.displayName = "New Resource";
      const id = await addResource(resource);
      resource.id = id;
      //remove the recommendation from the table and add to drafts
      let index = this.recommendations.indexOf(recommendation)
      if (index >= 0) {
        this.recommendations.splice(index, 1);
        this.pendingResources?.unshift(resource);
        this.filterByStatus('draft');
      } 
      this.isCreatingResource = false;
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
      this.pendingResources?.unshift(resource);
      this.filterByStatus('draft');
      this.showEdit = false;
    },

    setApproval(resource, approve) {
      resource.approved = approve;
      updateResource(resource);

      const index = this.visibleRecords.indexOf(resource);
      if (index >= 0) {
        this.visibleRecords[index].approved = approve;
        
        // if we're approving and we've already retrieved the approved reviews
        // add it to the top of the approvedReviews array and remove from pending 
        if (approve) {
          if (this.approvedResources[this.selectedResourceType]) {
            this.approvedResources[this.selectedResourceType].unshift(resource);
          }
          this.pendingResources?.splice(index, 1);
          this.visibleRecords = this.pendingResources;
        } 
        // if we're un-approving and we've already retrieved the pending reviews
        // add it to the top of the pendingReviews array and remove from approved
        else {
          if (this.pendingResources) {
            this.pendingResources.unshift(resource);
          }
          this.approvedResources[this.selectedResourceType]?.splice(index, 1);
          this.visibleRecords = this.approvedResources[this.selectedResourceType];
        }
      }
    },

    handleSaved(resource) {
      // copy the saved object back into the table/selected element
      this.selectedResource = cloneDeep(resource);
      let index = this.visibleRecords.findIndex( r => r.id == resource.id )
      if (index >= 0) {
        this.visibleRecords[index] = this.selectedResource;
      }
      this.showEdit = false;
    },

    handleDeleteRecommendationClick(recommendation) {
      this.selectedResource = null;
      this.selectedRecommendation = recommendation;
      this.deleteMessage = `Are you sure you want to delete the recommendation by ${recommendation.recommendedByName}.`;
      this.showDeleteConfirm = true
    },

    handleDeleteClick(resource) {
      this.selectedResource = resource;
      this.selectedRecommendation = null;
      this.deleteMessage = `Are you sure you want to delete the resource, "${resource.displayName}".`;
      this.showDeleteConfirm = true
    },

    async doDelete() {
      try {
        this.isDeleting = true;
        var deleteRecord;
        var deleted = false;
        if (this.selectedRecommendation) {
          deleteRecord = this.selectedRecommendation;
          await deleteRecommendation(this.selectedRecommendation.id);
          deleted = true;
        } 
        if (this.selectedResource) {
          deleteRecord = this.selectedResource;
          await deleteResource(this.selectedResource.id);
          // force refresh of recommendations (hacky!) since the one linked to the deleted resource
          // will now be unlinked.
          this.recommendations = null;
          deleted = true;
        }
        if (deleted) {          
          let index = this.visibleRecords.indexOf(deleteRecord);
          if (index >= 0) {
            this.visibleRecords.splice(index,1);
          }
          this.selectedResource == null;
          this.selectedRecommendation == null;
        }
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

tbody > tr:last-child td {
  border-bottom: 1px solid var(--prr-lightgrey);
}
tbody td.centred {
  text-align: center;
}

td {
  padding: 5px 5px 5px 10px;
  /* border-bottom: 1px solid var(--prr-lightgrey); */
  overflow: hidden;
  max-width: 200px;
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

tbody.body-hover:hover {
  background: var(--prr-extralightgrey);
  cursor: pointer;
}
tbody.body-hover:hover .actions {
  visibility: visible;
}

.review {
  font-style: italic;
  color: var(--prr-mediumgrey);
  padding: 15px 25px;
  white-space: pre-wrap;
}
.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  border: 1px solid var(--prr-lightgrey);
  /* font-size: var(--prr-font-size-large); */
}

.record-count {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>