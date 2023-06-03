<template>
  <modal-dialog 
    title="Edit Review"
    :fullscreen="true" 
    :isLoading="isWorking"
    @close="$emit('close')" 
    @buttonClick="handleButtonClick"
    :buttonActions="buttons">
    <div class="content"> 

      <div class="label">Review ID</div>
      ID: {{ editReview.id }}
      
      <div class="label">Reviewed By</div>
      <base-input
        v-model="editReview.reviewedByName">
      </base-input>
      <base-input
        v-model="editReview.reviewedByUid">
      </base-input>
      <hr class="divider" />
      
      <div class="label">Review</div>
      <base-multiline-text
        v-model="editReview.reason">
      </base-multiline-text>
      <base-check-box 
        v-model="editReview.isFeatured"
        label="Feature on Home Page"
        :leftAlign="true"></base-check-box>
      <hr class="divider" />
      <div class="label">Linked To</div>
      <p class="link-broken" v-if="isLinkBroken">Link broken</p>
      <base-input
        v-model="editReview.resourceId">
      </base-input>
      <base-input
        v-model="editReview.resourceName">
      </base-input>
    </div>
  </modal-dialog>
</template>

<script>
import BaseMultilineText from "@/core/components/BaseMultilineText.vue";
import ModalDialog from '@/core/components/ModalDialog.vue';
import BaseInput from '@/core/components/BaseInput.vue';
import BaseCheckBox from "@/core/components/BaseCheckBox.vue";
import { Review } from '@/modules/reviews/model/review';
import { cloneDeep } from 'lodash';
import { validateProperty } from '@/core/model/validation';
import { updateReview } from '@/modules/reviews/services/review-service';
import { getResource } from '@/modules/resources/services/resource-service';

export default {
  components: { 
    BaseMultilineText,
    ModalDialog,
    BaseInput,
    BaseCheckBox,
  },
  name: "edit-review",
  emits: ['close', 'saved'],
  data() {
    return {
      editReview: Review,
      isWorking: true,
      isLinkBroken: false,
      errorMessage: [],
    }
  },

  props: {
    review: Review,
  },

  async mounted() {
    this.isWorking = true;
    this.editReview =  cloneDeep(this.review);
    this.isWorking = false;
    this.checkLink();
  },
  
  computed: {
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
      });
      return actions;
    },
  },

  methods: {
    checkLink() {
      const this_ = this;
      if (this.review.resourceId) {
        console.log('check')
        getResource(this.review.resourceId).then( (resource) => {
          if (resource) {
            this_.isLinkBroken = false;
            this_.editReview.resourceName = resource.displayName;
          } else {
            this_.isLinkBroken = true;
          }
        });
      }
    },
    validate(prop) {
      let result = validateProperty(this.editReview, this.editReview.schema, prop);
      this.errorMessage[prop] = result.errorMessage;
      if (result.data) {
        this.editReview[prop] = result.data;
      }
    },
    
    async handleButtonClick(button) {
      if (button.id == 'save') {
        await updateReview(this.editReview);
        this.$emit('saved', this.editReview);
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
align-items: center;
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

.link-broken {
  color: var(--prr-red);
}
</style>