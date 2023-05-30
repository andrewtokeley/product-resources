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
          <th v-if="activeTab == 'pending'" style="width:200px"><a @click="sortBy('dateCreated')" class="sortHeading" :class="sortHeadingClasses('dateCreated')">Created</a></th>
          <th v-else style="width:200px"><a @click="sortBy('dateApproved')" class="sortHeading" :class="sortHeadingClasses('dateApproved')">Approved</a></th>
          <th style="width:200px"><a @click="sortBy('reviewedByName')" class="sortHeading" :class="sortHeadingClasses('reviewedByName')">Reviewed By</a></th>
          <th style="width:200px"><a @click="sortBy('source')" class="sortHeading" :class="sortHeadingClasses('source')">Source</a></th>
          <th style="width:200px"><a @click="sortBy('statusDescription')" class="sortHeading" :class="sortHeadingClasses('statusDescription')">Linked to Resource</a></th>
          <th style="width:200px"></th>
        </tr>
      </thead>
      
      <tbody v-for="review in visibleReviews" :key="review.id" @click="handleEditReview(review)">
        <tr>
          <td v-if="activeTab == 'pending'">{{ review.dateCreatedFormatted }}</td>
          <td v-else>{{ review.dateApprovedFormatted }}</td>
          <td>{{ review.reviewedByName }}</td>
          <td>{{ review.source }}</td>
          <td v-if="review.resourceId">
            <a @click.prevent.stop="handleShowResourceDetail(review)" >{{ review.statusDescription }}</a>
          </td>
          <td v-else>
            {{ review.statusDescription }}
          </td>
          <td rowspan="2" class="underline">
            <div class="actions">
              <base-button v-if="!review.approved" :disabled="!review.canApprove" @click.stop="setApproval(review, true)">Approve</base-button>
              <base-button v-else @click.stop="setApproval(review, false)" :isSecondary="true">Un-Approve</base-button>
              <base-icon :menu="menuItems(review)">more_vert</base-icon>
            </div>
          </td>
        </tr>
        <tr >
          <td class="underline" colspan="4">
            <div class="reason-text">"{{ review.reason }}"</div>
          </td>
        </tr>
      </tbody>
    </table>
    <loading-symbol v-else class="loader" ></loading-symbol>
    
    <edit-review-dialog
      v-if="showEdit" 
      :review="selectedReview"
      @close="showEdit = false"
      @saved="handleReviewSaved">
    </edit-review-dialog>

    <resource-detail 
      v-if="showLinkedResource" 
      :resource="linkedResource"
      :showUnapprovedReviews="true"
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
import { cloneDeep } from 'lodash';
import { getResource } from '@/modules/resources/services/resource-service';
const { DateTime } = require('luxon');

import { Review } from '@/modules/reviews/model/review';

export default {
  name: 'manage-reviews',
  components: { BaseIcon, ConfirmationDialog, LoadingSymbol, EditReviewDialog, ResourceDetail, BaseButton },
  data() {
    return {
      selectedReview: Review,
      pendingReviews: null,
      approvedReviews: null,
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
    await this.filterByApproval(false);
    this.sortBy('dateCreated', 'desc');
    this.isLoading = false;
  },
  methods: {
    async filterByApproval(state) {
      
      if (state == 'approved') {
        this.activeTab = 'approved';
        // show approved only
        if (!this.approvedReviews) {
          this.approvedReviews = await getReviewsByApproval(true);
        }
        this.visibleReviews = this.approvedReviews;
      } else {
        this.activeTab = 'pending';
        // show pending only
        if (!this.pendingReviews) {
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

      this.visibleReviews.sort( (a,b) => { 
        if(a[propName] < b[propName]) { return order == 'asc' ? -1 : 1; }
        if(a[propName] > b[propName]) { return order == 'asc' ? 1 : -1; }
        return 0;
      })

    },

    async setApproval(review, approve) {
      const result = await setReviewApprove(review, approve);
      if (!result) return;

      const index = this.visibleReviews.indexOf(review);
      if (index >= 0) {
        this.visibleReviews[index].approved = approve;
        this.visibleReviews[index].dateApproved = DateTime.now();
        // if we're approving and we've already retrieved the approved reviews
        // add it to the top of the approvedReviews array and remove from pending 
        if (approve) {
          if (this.approvedReviews?.length > 0) {
            this.approvedReviews = [review, ...this.approvedReviews];
          }
          this.pendingReviews.splice(index, 1);
          this.visibleReviews = this.pendingReviews;
        } 
        // if we're un-approving and we've already retrieved the pending reviews
        // add it to the top of the pendingReviews array and remove from approved
        else {
          if (this.pendingReviews?.length > 0) {
            this.pendingReviews = [review, ...this.pendingReviews];
          }
          this.approvedReviews.splice(index, 1);
          this.visibleReviews = this.approvedReviews;
        }
      }
    },

    async handleShowResourceDetail(review) {
      const resourceId = review.resourceId;
      if (resourceId) {
        this.linkedResource = await getResource(resourceId);
        if (this.linkedResource) {
          this.showLinkedResource = true;
        }
      }
    },

    handleReviewSaved(review) {
      this.selectedReview = cloneDeep(review);
      let index = this.visibleReviews.findIndex( r => r.id == review.id )
      if (index >= 0) {
        this.visibleReviews[index] = this.selectedReview;
      }
      this.showEdit = false;
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
        await deleteReview(this.selectedReview);
        let index = this.visibleReviews.indexOf(this.selectedReview);
        if (index >= 0) {
          this.visibleReviews.splice(index,1);
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

tbody td.underline {
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

.reason-text {
  margin: 10px 0px 10px 25px; 
  color: var(--prr-mediumgrey);
  white-space: pre-wrap;
}
</style>