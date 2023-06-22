<template>
  <modal-dialog
    title="Edit Review"
    :subTitle="review.resourceName"
    :buttonActions="buttons"
    @close="$emit('close')"
    @buttonClick="handleButtonClick">
    <base-multiline-text 
      v-model="reviewText"
      :disabled="isSaving"
      :options="{ numberOfLines: 10, 
        maximumLength: 500, 
        inlineErrors: false,
        showCharacterCount: true, 
        placeholder: 'Your Review'}">
    </base-multiline-text>
  </modal-dialog>
</template>

<script>
import ModalDialog from '@/core/components/ModalDialog.vue'
import BaseMultilineText from '@/core/components/BaseMultilineText.vue'
import { Review } from '../model/review'
import { updateReview } from '../services/review-service'
export default {
  components: { ModalDialog, BaseMultilineText },
  
  emits: ['close', 'saved'],

  props: {
    review: null,
  },
  data() {
    return { 
      isSaving: false,
      reviewText: String,
    }
  },

  computed: {
    buttons() {
      return [
      {
          id: 'cancel',
          title: "Cancel",
          isSecondary: true,
        },
        {
          id: 'save',
          title: "Save",
          showSpinner: this.isSaving,
        }
      ]
    }
  },

  mounted() {
    this.reviewText = this.review.reason;
  },
  
  methods: {
    handleButtonClick(button) {
      const id = button.id;

      if (id == 'cancel') {
        this.$emit('close');
      } else if (id == 'save') {
        this.handleSave();
      }
    },
    async handleSave() {
      this.isSaving = true;
      let updatedReview = new Review(this.review);
      updatedReview.reason = this.reviewText;
      await updateReview(updatedReview)
      this.isSaving = false;
      this.$emit('saved', updatedReview);
    },
  },
}
</script>