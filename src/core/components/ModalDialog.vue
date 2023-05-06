<template>
  <div class="modal__mask" @click='$emit("close")'>
    <div class="modal" :class="{ 'modal--fullscreen': fullscreen }" @click='preventClickPropogation'>
      <loading-symbol class="loader" v-if="isLoading"></loading-symbol>
      <template v-else>
        <div  class="modal__iconActions" >
          <template v-for="action in iconActions" :key="action.id">
            <base-icon v-if="action.show" @click="$emit('iconClick', action)">{{  action.iconName }}</base-icon>
          </template>
          <base-icon @click='$emit("close")'>close</base-icon>
        </div>

        <div v-if="title"><h1 :title="title">{{ title }}</h1></div>
        <div v-if="subTitle"><h2 :title="subTitle">{{ subTitle }}</h2></div>

        <div class="modal__content">
          <slot></slot>
        </div>
        
        <div v-if="buttonActions" class="modal__footer">
          <template v-for="action in buttonActions" :key="action.id">
            <base-button
              v-if="action.show ?? true"
              :disabled="action.disabled"
              :isPrimary="action.isPrimary"
              :isSecondary="action.isSecondary"
              :isDestructive="action.isDestructive"
              :showSpinner="action.showSpinner"
              @click="$emit('buttonClick', action)"
              >{{ action.title }}</base-button
            >
          </template>
        </div>
      </template>
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
  emits: ["close", "iconClick", "buttonClick"],
  components: { BaseButton, BaseIcon, LoadingSymbol },

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
      default: true,
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
  max-width: 500px;
  min-width: 450px;
  max-height: 90%;
  background-color: white;
  border-radius: 5px;
  padding: 45px 0px 20px 0px;
  box-sizing: border-box;
  overflow: hidden;
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

.modal h1 {
  overflow-x: hidden;
  line-height:normal;
  /* white-space: nowrap; */
  text-overflow: ellipsis;
  margin:5px 30px;
}
.modal h2 {
  overflow-x: hidden;
  line-height:normal;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 5px 30px 20px 30px;
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
  padding: 0px 35px 0px 40px;
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
  justify-content: flex-end;
  align-items: center;
  /* box-sizing: border-box; */
  margin: 10px 20px 20px 20px;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
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