<template>
  <div class="base-button-group">
    <div class="button-group">
      <button 
        tabindex="0" 
        type="button">
        <slot></slot>
      </button>
      <div class="button-group--toggle" >
        <button 
          aria-label="More options" 
          aria-haspopup="listbox" 
          type="button" 
          @click="toggleButtonGroup">
          <svg class="xui-icon" focusable="false" height="5" viewBox="0 0 10 5" width="10">
            <path d="M0 0l5 5 5-5z" role="presentation"></path>
          </svg>
        </button>
      </div>
    </div>
    <div class="button-group-items" v-if="showButtonGroup"
      :class="{
        'vertical-align-top': verticalAlign == 'top',
        'horizontal-align-left': horizontalAlign == 'left' }">
      <ul>
        <li v-for="item in buttonGroup" :key="item.id">
          <button @click="handleClickButtonGroupItem(item)"><span>{{ item.text }}</span></button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'base-button-group',

  emits: ['click'],

  props: {
    buttonGroup: {
      type: Array,
      default: function() { return []},
    },
    verticalAlign: {
      type: String,
      default: 'bottom',
    },
    horizontalAlign: {
      type: String,
      default: 'right',
    }
  },

  data() {
    return {
      showButtonGroup: false,
    }
  },

  methods: {
    handleClickButtonGroupItem(item) {
      this.showButtonGroup = false;
      this.$emit('click', item);
    },
    toggleButtonGroup() {
      this.showButtonGroup = !this.showButtonGroup;
    },
  }
}
</script>

<style scoped>

.base-button-group {
  display: inline-block;
  position: relative;
  padding: 0px 20px;
  margin-left: 10px;
}
.button-group {
  display: flex;
  flex-direction: row;
  gap:0px;
}
.button-group button {
  position: relative;
  display: inline-block;
	text-align: center;
  text-decoration: none;
  font-size: var(--prr-font-size-normal);
  font-weight: var(--prr-font-weight);
  height: 40px;
  font-weight: 600;
  min-width: 120px;
  transition: background 400ms;
  border: 1px transparent solid;
  background: white;
  color: var(--prr-blue);
  border: 1px var(--prr-lightgrey) solid;
}

.button-group > button {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border-right: 0px;
}

.button-group--toggle button {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  min-width: 40px;
}

.button-group-items {
  position: absolute;
  overflow: hidden;
  min-width: 220px;
  right: 20px;
  top: 45px;
  background: white;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3),
      0 2px 6px 2px rgba(60, 64, 67, 0.15);
}

.button-group-items.vertical-align-top {
  top: auto;
  bottom: 45px;
}
.button-group-items.horizontal-align-left {
  left: 20px;
  right: auto;
}

.button-group-items ul {
  list-style: none;
  margin:0px;
  margin-top: 10px;
  padding:0px;
}

.button-group-items li button {
  height: 40px;
  width:100%;
  background: transparent;
  border: 0px;
  text-align: left;
  font-size: var(--prr-font-size-normal);
  margin:0px;
  padding:0px 20px;
  color: var(--prr-darkgrey);
  cursor: pointer;
  word-wrap: ;
}
.button-group-items li button span {
  max-width: 250px;
  overflow: hidden;
  white-space: nowrap;
  display: block;
  text-overflow: ellipsis;
}
.button-group-items li:hover {
  background: var(--prr-extralightgrey);
}
</style>