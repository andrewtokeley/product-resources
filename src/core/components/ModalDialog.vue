<template>
  <div class="modal__mask" @click='$emit("close")'>
    <loading-symbol class="loader" v-show="isLoading"></loading-symbol>
    <div class="modal" v-if="!isLoading" :class="{ 'modal--fullscreen': fullscreen }" @click='preventClickPropogation'>
        <div v-if="showBackButton" class="backButton" @click="$emit('backButtonClick')">
          <base-icon @click="$emit('backButtonClick')">arrow_back_ios_new</base-icon>
          <span>BACK</span>
        </div>
        <div  class="modal__iconActions" >
          <template v-for="action in iconActions" :key="action.id">
            <base-icon v-if="action.show" @click="$emit('iconClick', action)">{{  action.iconName }}</base-icon>
          </template>
          <base-icon @click='$emit("close")'>close</base-icon>
        </div>

        <div class="titleBlock">
          <div class="title" v-if="title">
            <h1 :title="title">
              <span v-if="titleIcon" class="material-symbols-outlined">{{ titleIcon }}</span>
              {{ title }}
            </h1>
          </div>
          <div v-if="subTitle"><h2 :title="subTitle">{{ subTitle }}</h2></div>
        </div>

        <div class="modal__content">
          <slot></slot>
        </div>
        
        <div v-if="buttonActions" class="modal__footer">
          <div>
            <template v-for="action in buttonActions" :key="action.id">
              <base-button v-if="action.align == 'left' && (action.show ?? true)"
                :class="action.align"
                :disabled="action.disabled"
                :isPrimary="action.isPrimary"
                :isSecondary="action.isSecondary"
                :isDestructive="action.isDestructive"
                :showSpinner="action.showSpinner"
                :iconName="action.iconName"
                @click="$emit('buttonClick', action)"
                >{{ action.title }}</base-button
              >
            </template>
          </div>
          <div>
            <template v-for="action in buttonActions" :key="action.id">
              <base-button v-if="action.align != 'left' && (action.show ?? true)"
                :class="action.align"
                :disabled="action.disabled"
                :isPrimary="action.isPrimary"
                :isSecondary="action.isSecondary"
                :isDestructive="action.isDestructive"
                :showSpinner="action.showSpinner"
                :iconName="action.iconName"
                @click="$emit('buttonClick', action)"
                >{{ action.title }}</base-button
              >
            </template>
          </div>
        </div>
      
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import BaseButton from "./BaseButton";
import BaseIcon from "./BaseIcon";
import LoadingSymbol from "./LoadingSymbol.vue";

export default defineComponent({
  name: "modal-dialog",
  emits: ["close", "iconClick", "buttonClick", "backButtonClick"],
  components: { BaseButton, BaseIcon, LoadingSymbol },

  props: {
    titleIcon: {
      type: String,
      default: null,
    },
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
    iconActions: {
      type: Array,
      default: () => {[]}
    },
    buttonActions: {
      type: Array,
      default: () => {[]}
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    showBackButton: {
      type: Boolean,
      default: false,
    }
  },

  mounted() {
    document.body.classList.add("modal-open");
    this.attachListeners()
  },

  unmounted() {
    document.body.classList.remove("modal-open");
  },
  
  methods: {
    
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
  max-width: 800px;
  min-width: 400px;
  max-height: 90%;
  background-color: white;
  border-radius: 5px;
  padding: 45px 0px 20px 0px;
  box-sizing: border-box;
  overflow: hidden;
}

.backButton {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  top: 10px;
  left: 10px;
  cursor: pointer;
}
.loader {
  align-items: center;
}

.modal--fullscreen {
  width: 95%;
  height: 90%;
  max-height: 750px;
  min-height: 450px;
  max-width: 900px;
  /* padding: 45px 0px 20px 0px; */
  border-radius: 10px;
}

.titleBlock {
  margin:5px 5px 5px 30px;
}

.titleBlock .material-symbols-outlined {
  margin-right: 10px;
}
.titleBlock .title {
  display:flex;
  flex-direction: row;
  align-items: top;
}
.titleBlock h1 {
  overflow-x: hidden;
  line-height:normal;
  text-overflow: ellipsis;
  margin: 0px;
  margin-bottom: 10px;
  padding: 0px;
}
.titleBlock h2 {
  overflow-x: hidden;
  line-height:normal;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0px;
  margin-left:0px;
  margin-bottom: 20px;
  color: var(--prr-mediumgrey);
}
.modal__iconActions {
  display: flex;
  flex-direction: row;
  position:absolute;
  right: 10px;
  top: 10px;
}
.modal__iconActions .icon {
  padding-left:10px;
}

/* .modal__heading {
  height: 30px;
  font-weight: bold;
  font-size: var(--prr-font-size-large);
  display: flex;
  align-items: center;
} */

.modal__content {
  font-size: 1em;
  flex-grow: 1;
  overflow-y: scroll;
  padding: 0px 35px 0px 30px;
  margin-bottom: 50px;
  margin-right: 5px;
}

.modal__footer {
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* box-sizing: border-box; */
  margin: 10px 20px 20px 20px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(0,0,0,.5);
  -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}

@media only screen and (max-width: 600px) {
  .modal {
    max-width: 95%;
  }
}
</style>