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
        <resource-type-select v-model="resourceType"></resource-type-select>
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
          <th><a @click="sortBy('displayName')" class="sortHeading" :class="sortHeadingClasses('displayName')">Name</a></th>
          <th><a @click="sortBy('authorsList')" class="sortHeading" :class="sortHeadingClasses('authorsList')">Authors</a></th>
          <th ><a @click="sortBy('numberOfRecommendations')" class="sortHeading" :class="sortHeadingClasses('numberOfRecommendations')">Reviews</a></th>
          <th></th>
        </tr>
      </thead>
      
      <tbody>
        <tr v-for="resource in resources" :key="resource.id" @click="handlePreviewClick(resource)">
          <td>
            <resource-image :hideActions="true" :preview="true" :resource="resource"></resource-image>
          </td>
          <td>{{ resource.displayName }}</td>
          <td>{{ resource.authorsList }}</td>
          <td class="centred">
            <a v-if="resource.numberOfRecommendations > 0" @click.prevent="handleRecommendationsClick">{{resource.numberOfRecommendations}}</a>
            <span v-else>-</span>
          </td>
          <td>
            <div class="actions">
              <base-icon @click="handlePreviewClick(resource)" title="Preview">preview</base-icon>
              <base-icon @click="handleEditClick(resource)" title="Edit Resource">edit</base-icon>
              <base-icon @click="handleDeleteClick(resource)" title="Delete Resource">delete</base-icon>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <loading-symbol class="loader" v-else></loading-symbol>
    <edit-resource-dialog :resource="resource" v-if="showEdit" @added="handleAdded" @saved="handleSaved" @close="showEdit = false"></edit-resource-dialog>
    <resource-detail v-if="showView" :resource="resource" mode="view" @close="showView = false"></resource-detail>
    <!-- <edit-resource-dialog v-if="showAdd" @close="showAdd = false"></edit-resource-dialog> -->
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
import EditResourceDialog from './EditResourceDialog.vue';
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue';
import ResourceTypeSelect from '@/modules/resources/components/ResourceTypeSelect.vue';
import BaseButton from '@/core/components/BaseButton.vue';
import ConfirmationDialog from '@/core/components/ConfirmationDialog.vue';

import { deleteResource, getResourcesFull } from '@/modules/resources/services/resource-service';
import { Resource } from '@/modules/resources/model/resource';
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';

export default {
  name: 'manage-resources',
  components: { ResourceImage, BaseIcon, EditResourceDialog, BaseButton, ResourceTypeSelect, ConfirmationDialog, LoadingSymbol, ResourceDetail },
  data() {
    return {
      resource: Resource,
      resources: [],
      showEdit: false,
      showAdd: false,
      showView: false,
      showDeleteConfirm: false,
      resourceType: {},
      isDeleting: false,
      isLoading: true,
      sortedBy: String,
      sortedByOrder: { displayName: 'desc' },
    }
  },
  mounted() {
    this.resourceType = { key: 'books', value: "Books"}
  },
  watch: {
    resourceType(value) {
      this.isLoading = true;
      getResourcesFull(value.key).then( (resources) => {
        this.resources = resources;
        this.sortBy('displayName');
        this.isLoading = false;
      })
    } 
  },
  methods: {
    sortHeadingClasses(propName) {
      var classes = {
        sorted: false,
        asc: false,
        desc: false,
      }
      classes.sorted = this.sortedBy == propName;
      classes.asc = this.sortedByOrder[propName] == 'asc';
      classes.desc = this.sortedByOrder[propName] == 'desc';
      console.log(classes);
      return classes;
    },
    sortBy(propName) {
      this.sortedBy = propName;
      if (this.sortedByOrder[propName] == 'desc') {
        this.sortedByOrder[propName] = 'asc'
      } else {
        this.sortedByOrder[propName] = 'desc'
      }
      let order = this.sortedByOrder[propName]
      console.log('sort');
      this.resources.sort( (a,b) => { 
        if(a[propName] < b[propName]) { return order == 'asc' ? -1 : 1; }
        if(a[propName] > b[propName]) { return order == 'desc' ? -1 : 1; }
        return 0;
      })
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
    handleSaved(resource) {
      // copy the saved object into the selected resource
      this.resource.displayName =  resource.displayName;
      this.resource.imageUrl =  resource.imageUrl;
      this.resource.authors =  resource.authors;
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
        console.log(index);
        if (index >= 0) {
          this.resources.splice(index,1);
        }
        this.resource == null;
      } catch (error) {
        console.log(error);
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
  margin-bottom: 10px;
  margin-right: 10px;
  /* padding-right: 10px; */
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