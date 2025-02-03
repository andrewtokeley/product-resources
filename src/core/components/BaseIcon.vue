<template>
<div class="icon" :class="{'icon--spinning': showSpinner}" :style="rotateStyle" >
  <div ref="iconDiv"
      :title="title" class="icon" 
      :class="{ 
        'material-icons': isMaterialIconProp, 
        'icon--clickable': _options.isClickable ?? true 
      }" 
      @click.prevent.stop="handleClick" >
    <svg v-if="!isMaterialIconProp">
      <path :d="_options.svgPath" />
    </svg>
    <span ref="icon_span" class="icon__text material-symbols-outlined">
      <slot></slot>
    </span>
    <div v-if="toolTip" class="tooltip" :class="{'enabled': toolTip}">{{toolTip}}</div>
  </div>
  
  <transition name="fade">
    <context-menu v-if="showContextMenu"
      ref="menu"
      :items="menu?.menuItems"
      :activateElement="iconDivElement" 
      :rightAligned="menu?.rightAligned ?? true"
      @click="handleMenuClick"
      @close="showContextMenu = false">
    </context-menu>
  </transition>

  </div>

</template>

<script>
import { defineComponent } from "vue";
import ContextMenu from "@/core/components/ContextMenu.vue"

export default defineComponent({
  name: "BaseIcon",
  
  components: {
    ContextMenu,
  },

  emits: ["click", "menuClick"],

/**
 * options: 
 */
  props: {
    title: {
      type: String,
      default: "",
    },
    rotate: {
      type: Number,
      default: 0
    },
    toolTip: {
      type: String,
      default: null,
    },
    showSpinner: {
      type: Boolean,
      default: false,
    },
    menu: {
      type: Object,
      default: () => {

      }
    },
    options: {
      type: Object,
      default: () => {
        return {}
      },
      required: false,
    }
  },

  data() {
    return {
      showContextMenu: false,
      isMouseOver: Boolean,
      isContextMenuOpen: false,
      iconDivElement: this.$refs.iconDiv,
    };
  },

  mounted() {
    if (this.options.stop == true) {
      console.log('stop');
    }
    this.iconDivElement = this.$refs.iconDiv;
    this.showContextMenu = false;    
    this.isMouseOver = false;
    if (this.isMaterialIcon) {
      // set default state
      this.$refs.icon_span.style.fontSize = this._options.size;
      this.$refs.icon_span.style.color = this._options.colour;

      this.$refs.iconDiv.style.width = this._options.background.size;
      this.$refs.iconDiv.style.height = this._options.background.size;
      this.$refs.iconDiv.style.borderRadius = this._options.background.borderRadius;
      this.$refs.iconDiv.style.backgroundColor = this._options.background.colour;
      if (this._options.showShadow) {
        this.$refs.iconDiv.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.3)';
      }

    }
    this.addListeners();
  },

  computed: {

    _options() {
      return {
        size: this.options.size ?? "26px",
        colour: this.options.colour ?? "var(--prr-lightgray)",
        background: {
          size: this.options.background?.size ?? "40px",
          borderRadius: this.options.background?.borderRadius ?? "20px",
          colour: this.options.background?.colour ?? "transparent"
        },
        hover: {
          colour: this.options.hover?.colour ?? "var(--prr-lightgray)",
          backgroundColour: this.options.hover?.backgroundColour ?? "rgba(60,64,67,.08)"
        },
        isMaterialIcon: this.options.isMaterialIcon ?? true,
        isClickable: this.options.isClickable ?? true,
        showShadow: this.options.showShadow ?? false,
      }
    },

    rotateStyle() {
      
      if (this.rotate > 0) {
        return { transform: 'rotate('+ this.rotate +'deg)' };
      } 
      return {};
    },

    visibleMenuItems() {
      return this.menu.menuItems.filter( (m) => {
        if (m.show != undefined) {
          return m.show;
        } 
        return true;
      });
    },
    contextMenuOpen() {
      const menu =  this.$refs.menu;
      if (menu) {
        return menu.isOpen();
      }
      return false;
    },

    isMaterialIconProp() {
      return this.$slots.default().length > 0
    },
  },

  methods: {

    handleMenuClick(menuItem) {
      this.showContextMenu = false;
      this.$emit('menuClick', menuItem);
      if (menuItem.action) {
        this.$refs.menu.close();
        menuItem.action();
      }
    },

    isMaterialIcon() {
      return this._options.icon.materialIcon;
    },

    addListeners() {
      const vm = this;

      vm.$refs.iconDiv.addEventListener("mouseenter", () => {
        vm.isMouseOver = true;
        //vm.showContextMenu = vm.menu ? true : false;
        
        // change the background colour based on options
        if (vm._options.hover) {
          vm.$refs.iconDiv.style.color = vm._options.hover.colour;
          vm.$refs.iconDiv.style.backgroundColor = vm._options.hover.backgroundColour;
        }
      });

      this.$refs.iconDiv.addEventListener("mouseleave", () => {
        vm.isMouseOver = false;
        // vm.showContextMenu = false;
        //vm.showContextMenu = false;
        if (vm._options.background) {
          // return to default state. A race condition existed when you closed the sidebar by pressing
          // the cross and this code ran after the component was unmounted.
          if (vm.$refs.iconDiv) {
            vm.$refs.iconDiv.style.color = vm._options.colour ?? "black";
            vm.$refs.iconDiv.style.backgroundColor = vm._options.background.colour ?? "white";
          }
          
        }
      });
    },

    handleClick() {
      if (this.menu) {
        this.showContextMenu = !this.showContextMenu;
      } else {
        if (this._options.isClickable ?? true) {
          this.$emit("click");
        }
      }
    },

  },
});
</script>

<style scoped>

div {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.icon {
  cursor: default;
  position: relative;
  background: transparent;
  transition: background 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon--clickable {
  cursor: pointer;
}

/* not using :hover to more easily control whether hover effect happens when context menu open */
.hover {
  background: rgba(255, 255, 255, 0.2);
}

svg {
  width: 20px;
  height: 20px;
}

path {
  stroke: white;
  stroke-width: 1px;
  fill: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.0s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* SPINNER */
.icon--spinning::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border: 4px solid transparent;
    border-top-color: var(--prr-blue);
    border-radius: 50%;
    animation: button-loading-spinner 1s ease infinite;
}

.icon--spinning .icon__text {
  visibility: hidden;
  opacity: 0;
}

.tooltip.enabled {
  opacity: 1;
}
.tooltip {
  position: absolute;
  opacity: 0;
  white-space: nowrap;
  width:170px;
  /* padding: 10px 30px 0px 30px; */
  line-height: 35px;
  height: 35px;
  top:-60px;
  border-radius: 5px;
  background: var(--prr-darkgrey);
  color: white;
  text-align: center;
  font-size: var(--prr-font-size-normal);
  transition: opacity 0.3s;
}
.tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

@keyframes button-loading-spinner {
    from {
        transform: rotate(0turn);
    }
    to {
        transform: rotate(1turn);
    }
}
</style>
