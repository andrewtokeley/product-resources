<template>
  <div class="modal__mask" @click='$emit("close")'>
    <div class="modal" 
        :class="{ 
          'modal--fullscreen': fullscreen 
        }" 
        @click='preventClickPropogation'>
      <base-icon class="modal__close-button" @click='$emit("close")'>close</base-icon>
      <h1 v-if="title">
        {{ title }}
      </h1>
      <div class="modal__content">
        <slot></slot>
      </div>
      
      <div v-if="subTitle" class="modal__subTitle">
        <p>{{ subTitle }}</p>
      </div>

      <div v-if="actions" class="modal__footer">
        <template v-for="action in actions" :key="action.id">
          <base-button
            :isPrimary="action.isPrimary"
            :isSecondary="action.isSecondary"
            :isDestructive="action.isDestructive"
            :showSpinner="action.showSpinner"
            @click="handleClick(action)"
            >{{ action.title }}</base-button
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import BaseButton from "./BaseButton";
import BaseIcon from "./BaseIcon";

export default defineComponent({
  name: "modal-dialog",

  emits: ["close"],
  
  components: {
    BaseButton,
    // CloseDialogButton,
    BaseIcon,
  },

  props: {
    title: {
      type: String,
      default: "",
    },
    subTitle: {
      type: String,
      default: undefined,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    actions: Array,
  },

  mounted() {
    this.attachListeners()
  },

methods: {
  
    handleClick(action) {
      action.handle(action);
    },
    
    preventClickPropogation(e) {
      e.stopPropagation();
    },

    attachListeners() {
      document.addEventListener('keydown', this.escapeListener, { once: true });
    },

    escapeListener(evt) {
      // prevent the escape click propogating to other modals
      evt.stopPropagation();
      var isEscape = false;
      if ("key" in evt) {
        isEscape = evt.key === "Escape" || evt.key === "Esc";
      } else {
        isEscape = evt.keyCode === 27;
      }
      if (isEscape) {
        this.$emit('close');
      }
    }

  },


});
</script>

<style scoped>
.modal__mask {
  z-index: 1000;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  display:flex;
  flex-direction: column;
  position: relative;
  max-width: 500px;
  min-width: 350px;
  max-height: 90%;
  background-color: white;
  border-radius: 5px;
  padding: 20px 20px;
  box-sizing: border-box;
}

.modal__close-button {
  position:absolute;
  right: 10px;
  top: 10px;
}

.modal--fullscreen {
  width: 100%;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  padding: 60px 60px;
  border-radius: 0px;
}

.modal__heading {
  height: 30px;
  font-weight: bold;
  font-size: var(--ish-font-size-large);
  display: flex;
  align-items: center;
}

.modal__content {
  color: var(--ish-mediumgrey);
  font-size: 1em;
  padding-top: 1em;
  padding-bottom: 0em;
  box-sizing: border-box;
  flex-grow: 1;
  overflow-y: scroll;
}

.modal__subTitle {
  height: 40px;
  color: var(--ish-mediumgrey);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal__footer {
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
}

@media only screen and (max-width: 600px) {
  .modal {
    max-width: 95%;
  }
}
</style>