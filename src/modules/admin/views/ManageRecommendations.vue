<template>
  <div class="manage-reviews">
    <div class="header">
      <div>
        <h1>Recommendations/Reviews</h1>
      </div>
    </div>
    <div class="action-strip">
      <div class="action-items" >
        <div class="label">Show:</div>
        <base-select v-model="filterBy" :selectOptions="filterOptions"></base-select>
      </div>
    </div>
    <table v-if="!isLoading">
      <thead>
        <tr>
          <th><a @click="sortBy('typeDescription')" class="sortHeading" :class="sortHeadingClasses('typeDescription')">Type</a></th>
          <th><a @click="sortBy('resourceName')" class="sortHeading" :class="sortHeadingClasses('displayName')">Resource</a></th>
          <th><a @click="sortBy('recommendedByUid')" class="sortHeading" :class="sortHeadingClasses('recommendedByUid')">Recommended UID</a></th>
          <th><a @click="sortBy('recommendedByName')" class="sortHeading" :class="sortHeadingClasses('recommendedByName')">Recommended By Name</a></th>
          <th ><a @click="sortBy('approved')" class="sortHeading" :class="sortHeadingClasses('approved')">Status</a></th>
          <th></th>
        </tr>
      </thead>
      
      <tbody>
        <tr v-for="recommendation in filteredRecommendations" :key="recommendation.id" @click="handleEditClick(recommendation)">
          <td>{{ recommendation.isReview ? "Review" : "Recommendation" }}</td>
          <td><a :href="recommendation.resourceUrl" target="_blank">{{recommendation.resourceName}}</a></td>
          <td>{{ recommendation.recommendedByUid }}</td>
          <td>{{ recommendation.recommendedByName }}</td>
          <td>{{ recommendation.statusDescription }}</td>
          <td>
            <div class="actions">
              <base-icon :menu="menuItems(recommendation)">more_vert</base-icon>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <loading-symbol class="loader" v-else></loading-symbol>
    
    <confirmation-dialog 
      v-if="showDeleteConfirm"
      heading="Delete Resource" 
      message="Are you sure?"
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
import BaseSelect from '@/core/components/BaseSelect.vue';
import ConfirmationDialog from '@/core/components/ConfirmationDialog.vue';
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';

import { deleteRecommendation, getUnapprovedRecommendations, updateRecommendation } from '@/modules/recommendations/services/recommendation-service';
import { Recommendation } from '@/modules/recommendations/model/recommendation';
export default {
  name: 'manage-resources',
  components: {BaseIcon, ConfirmationDialog, LoadingSymbol, BaseSelect},
  data() {
    return {
      selectedRecommendation: Recommendation,
      recommendations: [],
      filteredRecommendations: [],
      showEdit: false,
      showView: false,
      showDeleteConfirm: false,
      filterBy: 'none',
      isDeleting: false,
      isLoading: true,
      sortedBy: 'resourceName',
      sortedByOrder: {},
    }
  },
  computed: {
    filterOptions() {
      return [
        { key: 'all', value: "All" },
        { key: 'reviews', value: "Reviews" },
        { key: 'recommendations', value: "Recommendations" },
      ];
    }
  },
  async mounted() {
    console.log('loading...')
    this.isLoading = true;
    this.recommendations = await getUnapprovedRecommendations();
    console.log(this.recommendations);
    this.isLoading = false;
    // this.sortBy(this.sortedBy, false);
    
    this.filterBy = 'all';
  },
  watch: {
    filterBy(value) {
      if (value == 'reviews') {
        this.filteredRecommendations = this.recommendations.filter( r => r.isReview );
      } else if (value == 'recommendations') {
        this.filteredRecommendations = this.recommendations.filter( r => !r.isReview );
      } else {
        this.filteredRecommendations = this.recommendations;
      }
    } 
  },
  methods: {
    menuItems(recommendation) {
      return {
        menuItems: [
          {
            name: "Create New Resource...",
            iconName: 'new',
            action: () => {
              this.handleCreateResource(recommendation);
            }
          },
          {
            name: "Delete...",
            iconName: 'delete',
            action: () => {
              this.handleDeleteClick(recommendation);
            }
          },
          { 
            isDivider: true,
          },
          {
            name: "Approve",
            show: !recommendation.approved,
            isClickable: recommendation.canApprove,
            action: () => {
              this.setApproval(recommendation, true);
            }
          },
          {
            name: "Un-Approve",
            show: recommendation.approved,
            action: () => {
              this.setApproval(recommendation, false);
            }
          }]
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

      this.filteredRecommendations.sort( (a,b) => { 
        if(a[propName] < b[propName]) { return order == 'asc' ? -1 : 1; }
        if(a[propName] > b[propName]) { return order == 'desc' ? -1 : 1; }
        return 0;
      })
    },

    setApproval(recommendation, approved) {
      if (recommendation.canApprove) {
        recommendation.approved = approved;
        updateRecommendation(recommendation);
      }
    },
    handleEditClick(recommendation) {
      console.log(recommendation);
    },
    handleDeleteClick(recommendation) {
      this.selectedRecommendation = recommendation;
      this.showDeleteConfirm = true
    },
    async doDelete() {
      try {
        this.isDeleting = true;
        await deleteRecommendation(this.selectedRecommendation.id);
        let index = this.recommendations.indexOf(this.selectedRecommendation);
        if (index >= 0) {
          this.recommendations.splice(index,1);
        }
        this.selectedRecommendation == null;
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