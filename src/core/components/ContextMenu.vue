<template>
  <div
      class="context-menu"
      :style="style"
      ref="context"
      tabindex="0"
      @blur="blur">
      <template v-for="menuItem in visibleMenuItems" :key="menuItem.id">
        <hr class="divider" v-if="menuItem.isDivider ?? false" />
        <div v-else-if="menuItem.isHeading">
          <div class="context-menu__row__heading">{{ menuItem.heading ?? "HEADING!" }}</div>
          <div class="context-menu__row__subHeading" v-if="menuItem.subHeading">{{ menuItem.subHeading }}</div>
          <hr class="divider short"/>
        </div>
        <a v-else
            class="context-menu__row"
            :class="{
                'context-menu__row--isCentred': menuItem.isFullWidth,
                'context-menu__row--isLabel': menuItem.isLabel ?? false,
                'context-menu__row--isDisabled': !(menuItem.isEnabled ?? true),
            }"
            :href="menuItem.link">
          <div v-if="!menuItem.isFullWidth" class="context-menu__row__icon" >
            <badge-count v-if="menuItem.badgeCount" class="badge"></badge-count>
            <icon
              v-if="menuItem.iconName ?? false"
              :options="{ hover: { backgroundColour: 'transparent' }, isClickable:  false }"
              
              >{{ menuItem.iconName }}
            </icon>  
          </div>
          <div class="context-menu__row__text" :class="{'context-menu__row__small': menuItem.isFullWidth}">
            <div class="context-menu__text">
              <span>{{ menuItem.name }}</span>
            </div>
            <div class="context-menu__row__subText" v-if="menuItem.subText" >
              {{ menuItem.subText }}
            </div>
          </div>
        </a>
    </template>
  </div>
</template>

<script>
import { nextTick } from "vue";
import BadgeCount from "./BadgeCount.vue";

export default {
  name: "ContextMenu",

  emits: ["opened", "close", "click"],

  components: {BadgeCount},

  beforeCreate() {
      // Not sure why this worked and importing Icon didn't. Something to do with the fact that
      // Icon contains ContextMenu which contains Icon...
      this.$options.components.Icon = require("./BaseIcon").default;
  },

  props: {
      // must be supplied so the context menu is position relatively to it.
      activateElement: {
          type: Object,
          default: undefined,
      },
      rightAligned: {
          type: Boolean,
          default: true,
      },
      items: {
          type: Array,
          required: true,
      },
  },

  data() {
      return {
          left: 0,
          top: 0,
          right: 0,
          //show: false,
          delayTimer: Object,
      };
  },

  computed: {
      // iconOptions() {
      //     let options = {...constants.ICON_OPTIONS.ON_WHITE};
      //     options.isClickable = true;
      //     return options;
      // },
      // get position of context menu

      style() {
          return {
              top: this.top + "px",
              left: this.left + "px",
          };
      },

      visibleMenuItems() {
          return this.items?.filter((item) => item.show ?? true);
      },
  },

  methods: {
      handleMenuItemClick(event, menuItem) {
          if (event) {
              event.stopPropagation();
          }
          if (menuItem.isClickable ?? true) {
              this.$emit("click", menuItem);
          }
      },

      blur() {
          let vm = this;
          this.delayTimer = setTimeout(function () {
              vm.close();
          }, 200);
      },

      // closes context menu
      close() {
          this.$emit("close");
      },

      open(activateElementBounds) {
          // updates position of context menu
          this.top = activateElementBounds.bottom;
          if (this.rightAligned) {
              this.left =
                  activateElementBounds.left -
                  (250 -
                      (activateElementBounds.right -
                          activateElementBounds.left));
          } else {
              this.left = activateElementBounds.left;
          }

          // make element focused (so blur event happens to close it)
          // @ts-ignore
          let vm = this;
          nextTick(() => vm.$refs.context.focus());
          this.show = true;
          this.$emit("opened");
      },

      isOpen() {
          return this.show;
      },
  },

  mounted() {
      this.open(this.activateElement.getBoundingClientRect());
  },
};
</script>
<style scoped>
.context-menu-mask {
  z-index: 100;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.context-menu {
  position: fixed;
  padding: 10px 0px;
  outline: none;
  width: 250px;
  z-index: 999;
  background: white;
  border-radius: 5px;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
      0 2px 6px 2px rgba(60, 64, 67, 0.15);
}

.context-menu__row, .context-menu__row__heading, .context-menu__row__subHeading {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  cursor: default;
  color: var(--prr-darkgrey);
  font-size: var(--prr-font-size-normal);
  /* height: 25px; */
  /* font-size: 0.875rem; */
  height: 1.25rem;
  text-decoration: none;
}

.context-menu__row:hover {
  background: var(--prr-lightgrey);
  cursor: pointer;
}

.context-menu__row__heading {
  font-weight: bold;
}
.context-menu__row__subHeading {
  color: var(--prr-mediumgrey);
}
.context-menu__row__heading, .context-menu__row__subHeading {
  margin-left: 40px;
  height: 0.5em;
} 

.context-menu__row--isLabel {
  color: var(--prr-mediumgrey);
  /* text-transform: uppercase; */
  /* font-weight: bold; */
}
.context-menu__row--isLabel:hover {
  background: transparent;
  cursor: default;
}

.context-menu__row--isDisabled {
  color: var(--prr-mediumgrey);
}

.context-menu__row--isDisabled:hover {
  cursor: default;
}

.context-menu__row--isSmallText {
  font-size: var(--prr-font-size-small);
}

.context-menu__row--isCentred {
  justify-content: center;
}

.context-menu__row__icon {
  position: relative;
  width: 30px;
  padding-right: 10px;
}

.context-menu__row__text {
  display: flex;
  flex-direction: column;
  /* color: black; */
}

.context-menu__row__subText,
.context-menu__row-full-width {
  font-size: var(--prr-font-size-small);
}

.context-menu__row__subText {
  justify-content: center;
}

.closeButton {
  top: 2px;
  right: 2px;
  position: absolute;
}

.divider.short {
  margin-left: 20px;
  margin-right: 20px;
  border-bottom: 1px solid var(--prr-lightgrey);
}

.context-menu__text {
  display:flex;
  flex-direction: row;
  justify-items: space-between;
}

.badge {
  /* display: inline; */
  position: absolute;
  left: 20px;
  top: 5px;
  z-index: 200;
  /* top: 0px;
  
  /* top: 0px;
  right: -30px; */
}
</style>