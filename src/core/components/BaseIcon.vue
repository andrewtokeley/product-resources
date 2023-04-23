<template>
<div class="icon" :class="{'icon--spinning': showSpinner}" :style="rotateStyle" >
  <div ref="iconDiv" 
      :title="tooltip" class="icon" 
      :class="{ 
        'material-icons': isMaterialIconProp, 
        'icon--clickable': options.isClickable ?? true 
      }" 
      @click.prevent.stop="handleClick">
    <svg v-if="!isMaterialIconProp">
      <path :d="options.svgPath" />
    </svg>
    <span class="icon__text">
      <slot></slot>
    </span>
  </div>
  
  <transition name="fade">
    <context-menu v-if="showContextMenu"
      ref="menu"
      :items="menu.menuItems"
      :activateElement="iconDivElement" 
      :rightAligned="menu.rightAligned ?? true"
      @click="handleMenuClick"
      @close="showContextMenu = false">
    </context-menu>
  </transition>

  </div>

</template>

<script>
import { defineComponent } from "vue";
import ContextMenu from "@/core/components/ContextMenu.vue"
//import { constants } from "../../constants";

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
    tooltip: {
      type: String,
      default: "",
    },
    rotate: {
      type: Number,
      default: 0
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
        return {
          size: "26px",
          colour: "var(--prr-lightgray)",
          background: {
            size: "40px",
            borderRadius: "20px",
            colour: "transparent"
          },
          hover: {
            colour: "var(--prr-lightgray)",
            backgroundColour: "rgba(60,64,67,.08)"
          },
          isMaterialIcon: true,
          isClickable: true,
        }
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
    this.iconDivElement = this.$refs.iconDiv;
    this.showContextMenu = false;    
    this.isMouseOver = false;
    if (this.isMaterialIcon) {
      // set default state
      this.$refs.iconDiv.style.width = this.options.background.size ?? "40px";
      this.$refs.iconDiv.style.height = this.options.background.size ?? "40px";
      this.$refs.iconDiv.style.borderRadius = this.options.background.borderRadius ?? "2px";
      this.$refs.iconDiv.style.fontSize = this.options.size ?? "32px";
      this.$refs.iconDiv.style.color = this.options.colour ?? "black";
      this.$refs.iconDiv.style.backgroundColor = this.options.background.colour ?? "white";
    }
    this.addListeners();
  },

  computed: {
    
    rotateStyle() {
      
      if (this.rotate > 0) {
        return { transform: 'rotate('+ this.rotate +'deg)' };
      } 
      return {};
    },

    // derivedOptions() {
    //   if (this.options) {
    //     return this.options;
    //   } else {
    //     return {

    //     }
        
    //   }
      
    // },

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
      return this.options.icon.materialIcon;
    },

    addListeners() {
      const vm = this;

      vm.$refs.iconDiv.addEventListener("mouseenter", () => {
        vm.isMouseOver = true;
        // change the background colour based on options
        if (vm.options.hover) {
          vm.$refs.iconDiv.style.color = vm.options.hover.colour;
          vm.$refs.iconDiv.style.backgroundColor = vm.options.hover.backgroundColour;
        }
      });

      this.$refs.iconDiv.addEventListener("mouseleave", () => {
        vm.isMouseOver = false;
        if (vm.options.background) {
          // return to default state. A race condition existed when you closed the sidebar by pressing
          // the cross and this code ran after the component was unmounted.
          if (vm.$refs.iconDiv) {
            vm.$refs.iconDiv.style.color = vm.options.colour ?? "black";
            vm.$refs.iconDiv.style.backgroundColor = vm.options.background.colour ?? "white";
          }
          
        }
      });
    },

    handleClick() {
      if (this.menu) {
        this.showContextMenu = !this.showContextMenu;
      } else {
        if (this.options.isClickable ?? true) {
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
  transition: opacity 0.2s ease;
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

@keyframes button-loading-spinner {
    from {
        transform: rotate(0turn);
    }
    to {
        transform: rotate(1turn);
    }
}
</style>
