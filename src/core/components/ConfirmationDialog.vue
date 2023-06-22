<template>
  <modal-dialog 
    :title="heading" 
    :subTitle="subTitle"
    :buttonActions="buttonActions" 
    @close="$emit('close')" 
    @buttonClick="handleButtonClick" >
    <p>{{ message }}</p>
  </modal-dialog>
</template>

<script>
import ModalDialog from './ModalDialog.vue'
export default {
  name: 'confirmation-dialog',
  components: { ModalDialog },
  emits: ['confirm', 'cancel', 'close'],
  props: { 
    confirmLabel: {
      type: String,
      default: 'OK'
    },
    heading: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: 'Are you sure?'
    },
    isPerformingAction: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    buttonActions() {
      return [
        {
          id: 'cancel',
          title: "Cancel",
          isSecondary: true,
        },
        {
          id: 'confirm',
          title: this.confirmLabel,
          isDestructive: true,
          showSpinner: this.isPerformingAction,
        }
      ]
    },
  },
  methods: {
    handleButtonClick(button) {
      if (button.id == 'cancel') {
        this.$emit('close');
      }
      if (button.id == 'confirm') {
        this.$emit('confirm');
      }
    }
  }
}
</script>