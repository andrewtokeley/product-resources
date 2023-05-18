<template>
  <div class="manage-reviews">
    <div class="header">
      <div>
        <h1>Reviews</h1>
      </div>
    </div>
    <div class="tabs">
      <base-button :isSecondary="activeTab != 'pending'" @click="filterByApproval('pending')">Pending</base-button>
      <base-button :isSecondary="activeTab != 'approved'" @click="filterByApproval('approved')" >Approved</base-button>
    </div>
    <table v-if="!isLoading">
      <thead>
        <tr>
          <th><a @click="sortBy('resourceName')" class="sortHeading" :class="sortHeadingClasses('displayName')">Resource</a></th>
          <th><a @click="sortBy('reviewedByName')" class="sortHeading" :class="sortHeadingClasses('reviewedByName')">Reviewed By</a></th>
          <th ><a @click="sortBy('statusDescription')" class="sortHeading" :class="sortHeadingClasses('statusDescription')">Linked to Resource</a></th>
          <th ><a @click="sortBy('approved')" class="sortHeading" :class="sortHeadingClasses('approved')">Approval</a></th>
          <th></th>
        </tr>
      </thead>
      
      <tbody v-for="review in visibleReviews" :key="review.id" @click="handleEditReview(review)">
        <tr>
          <td>{{ review.resourceName }}</td>
          <td>{{ review.reviewedByName }}</td>
          <td v-if="review.resourceId">
            <a @click.prevent.stop="handleShowResourceDetail(review)" >{{ review.statusDescription }}</a>
          </td>
          <td v-else>
            {{ review.statusDescription }}
          </td>
          <td>{{ review.approved ? "Approved": "Pending" }}</td>
          <td rowspan="2">
            <div class="actions">
              <base-button v-if="!review.approved" :disabled="!review.canApprove" @click.stop="setApproval(review, true)">Approve</base-button>
              <base-button v-else @click.stop="setApproval(review, false)">Un-Approve</base-button>
              <base-icon :menu="menuItems(review)">more_vert</base-icon>
            </div>
          </td>
        </tr>
        <tr class="underline">
          <td  colspan="5">"{{ review.reason }}"</td>
        </tr>
      </tbody>
    </table>
    <loading-symbol class="loader" v-else></loading-symbol>
    
    <edit-review-dialog
      v-if="showEdit" 
      :review="selectedReview"
      @close="showEdit = false">
    </edit-review-dialog>

    <resource-detail 
      v-if="showLinkedResource" 
      :resource="linkedResource"
      @close="showLinkedResource = false">
    </resource-detail>

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
import BaseButton from '@/core/components/BaseButton.vue';
import ConfirmationDialog from '@/core/components/ConfirmationDialog.vue';
import LoadingSymbol from '@/core/components/LoadingSymbol.vue';
import EditReviewDialog from './EditReviewDialog.vue';
import ResourceDetail from '@/modules/resources/views/ResourceDetail.vue';

import { deleteReview, getReviewsByApproval, setReviewApprove } from '@/modules/reviews/services/review-service';

import { getResource } from '@/modules/resources/services/resource-service';
import { Review } from '@/modules/reviews/model/review';

export default {
  name: 'manage-reviews',
  components: { BaseIcon, ConfirmationDialog, LoadingSymbol, EditReviewDialog, ResourceDetail, BaseButton },
  data() {
    return {
      selectedReview: Review,
      pendingReviews: [],
      approvedReviews: [],
      visibleReviews: [],
      showLinkedResource: false,
      showEdit: false,
      showView: false,
      showDeleteConfirm: false,
      isDeleting: false,
      isLoading: true,
      sortedBy: 'reviewedByName',
      sortedByOrder: {},
      activeTab: 'pending',
    }
  },
  
  async mounted() {
    this.isLoading = true;
    this.filterByApproval(false);
    this.isLoading = false;
  },
  methods: {
    async filterByApproval(state) {
      
      if (state == 'approved') {
        this.activeTab = 'approved';
        // show approved only
        if (this.approvedReviews.length == 0) {
          this.approvedReviews = await getReviewsByApproval(true);
        }
        this.visibleReviews = this.approvedReviews;
      } else {
        this.activeTab = 'pending';
        // show pending only
        if (this.pendingReviews.length == 0) {
          this.pendingReviews = await getReviewsByApproval(false);
        }
        this.visibleReviews = this.pendingReviews;
      }
    },
    menuItems(review) {
      return {
        menuItems: [
          {
            name: "Edit",
            iconName: "edit",
            action:() => {
              this.handleEditReview(review);
            }
          },
          {
            name: "Delete...",
            iconName: 'delete',
            action: () => {
              this.handleDeleteClick(review);
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

    },

    setApproval(review, approve) {
      console.log('set approval');
      setReviewApprove(review.id, approve);
      const index = this.visibleReviews.indexOf(review);
      if (index >= 0) {
        this.visibleReviews[index].approved = approve;
      }
    },

    async handleShowResourceDetail(review) {
      const resourceId = review.resourceId;
      if (resourceId) {
        this.linkedResource = await getResource(resourceId);  
        this.showLinkedResource = true;
      }

    },

    handleEditReview(review) {
      this.selectedReview = review;
      this.showEdit = true;
    },

    handleDeleteClick(review) {
      this.selectedReview = review;
      this.showDeleteConfirm = true
    },

    async doDelete() {
      try {
        this.isDeleting = true;
        await deleteReview(this.selectedReview.id);
        let index = this.reviews.indexOf(this.selectedReview);
        if (index >= 0) {
          this.reviews.splice(index,1);
        }
        this.selectedReview == null;
      } catch (error) {
        this.isDeleting = false;
      }
      this.isDeleting = false;
      this.showDeleteConfirm = false;
    },

    async handlePreviewResource(review) {
      this.selectedReview = review;
      this.isLoading = true;
      this.resource = await getResource(review.resourceId)
      this.showView = true;
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

tbody tr.underline td {
  /* border-bottom: 2px solid var(--prr-lightgrey); */
  border-bottom: 1px solid #ccced2;
  padding: 5px 10px;
}

td {
  padding-left: 10px;
}

tbody td.centred {
  text-align: center;
}

tr .actions {
  display:flex;
  justify-content: flex-end;
  visibility: hidden;
}
tbody:hover .actions {
  visibility: visible;
}

tbody:hover {
  background: var(--prr-extralightgrey);
  cursor: pointer;
}
</style>