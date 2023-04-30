<template>
  <div class="base-select">
    <div class="select"
      :class="{ 
          'base-select__select--borderless': options.borderless ?? false,
          'base-select__select--is-centred': options.centred ?? false,
          'base-select__select--has-hover-effect': options.hoverEffect ?? true, 
          'base-select__select--has-underline-effect': options.underlineEffect ?? true, 
          'base-select__select--is-large': options.large ?? false, 
          'base-select__select--is-white': options.white ?? false, 
        }">
        
      <select 
        v-model="selectedKey"
        :placeholder="options.placeholder ? options.placeholder : ''"
        @change="handleSelect"
        >
        <option 
            v-for="option in derivedSelectOptions" 
            :key="option.key"
            :value="option.key">{{option.value}}</option>
      </select>
    </div>
  </div>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
  name: "base-select",
  
  emits: ["update:modelValue"],

  props: {
    // The bound key of the select, set by clients using the v-model property
    //modelValue: String,

    /**
     * Bound object that represents one of the items in the selectOptions array, or null, if nothing is selected
     */
    modelValue: Object,

    /**
     * Array containing the available items to select from. 
     * Each item must contain both a key and a value property, both of which must resolve to a string
     */
    selectOptions: Array,

    nullOption: Object,

    /**
     * Optional object literal to control how the input is displayed. Properties include;
     * - hoverEffect: if true, hovering over input presents a grey background
     * - underlineEffect: if true, when input has focus a blue underline will be presented
     * - centred: if true, the contents of the input will be centred
     * - white: text will be white, rather than the default light grey
     * - placeholder: input placeholder
     */
    options: {
      type: Object,
      default: function() {
        return {
          borderless: false,
          hoverEffect: true,
          underlineEffect: true,
          centred: false,
          large: false,
          white: false,
          placeholder: "",
          descriptionText: null,
          inlineErrors: false,
          readOnly: false,
          includeBlankOption: false,
        }
      }
    },
  },

computed: {
    selectedKey: {
      get() {
        if (this.modelValue) {
          return this.modelValue.key ?? null;
        }
        return null;
      },
      set() {
        
      }
    },

    derivedSelectOptions() {
      if (this.options.includeBlankOption) {
        return [{value: "Not Selected", key: null },...this.selectOptions];
      }
      return this.selectOptions;
    }

  },

  methods: {

    handleSelect(event) {
      let newKey = event.target.value;
      
      // clear the placeholder text - note it may not be there if there's already a value set.
      // if (this.$refs.placeholder) {
      //   this.$refs.placeholder.innerText = '';
      // }

      // let the parent know which selected item has changed

      // check if the null option was selected
      console.log('sseell')
      if (newKey == '') {
        this.$emit("update:modelValue", this.nullOption);
      } else {
        let selectedItem = this.selectOptions.find( s => s.key == newKey);
        if (selectedItem) {
          this.$emit("update:modelValue", selectedItem);
        }
      }
    },
    
  }
});
</script>

<style >

/* :root {
  --select-border: #777;
  --select-focus: blue;
  --select-arrow: var(--select-border);
} */

select {
  /* A reset of styles, including removing the default dropdown arrow */
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0 1em 0 10px;
  margin: 0;
  width: 100%;
  height:40px;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  color: var(--prr-darkgrey);
  /* Stack above custom arrow */
  /* z-index: 1; */

  /* Remove focus outline, will add on alternate element */
  outline: none;
}

.select select, .select::after {
  grid-area: select;
}

.select {
  display: grid;
  grid-template-areas: 'select';
  align-items: center;
  position: relative;

  min-width: 15ch;
  height:40px;

  background: var(--prr-extralightgrey);
  border: 1px white solid;
  border-bottom-color: var(--prr-mediumgrey);
  font-size: var(--prr-font-size-normal);
  border-radius: 5px 5px 0px 0px;
    
  padding: 0px 0px;
  margin-bottom: 10px;
  cursor: pointer;
  
}

.select:hover, select:focus {
  background: var(--prr-lightgrey);
  border-bottom-width: 1px;
  border-radius: 5px 5px 0px 0px;
}

/* .select > select:focus {
  background: var(--prr-lightgrey);
} */

.select::after, .select:focus::after {
  content: "";
  justify-self: end;
  width: 0.8em;
  height: 0.5em;
  margin-right: 10px;
  background-color: var(--prr-darkgrey);
  clip-path: polygon(100% 0%, 0 0%, 50% 100%);
}

/* select:focus + .focus {
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border-bottom: 1px solid var(--prr-green);
  border-radius: inherit;
} */

select[multiple] {
  padding-right: 0;

  /*
   * Safari will not reveal an option
   * unless the select height has room to 
   * show all of it
   * Firefox and Chrome allow showing 
   * a partial option
   */
  height: 6rem;
  outline-color: #777;
  /* option {
    white-space: normal;

     //Only affects Chrome
    outline-color: var(--select-focus);
  } */
}

.base-select__select--disabled {
  cursor: not-allowed;
  background-color: #eee;
  background-image: linear-gradient(to top, #ddd, #eee 33%);
}

label {
  font-size: 1.125rem;
  font-weight: 500;
}

.base-select__select + label {
  margin-top: 2rem;
}

.select--placeholder {
  padding: 10px;
  position: absolute;
  color: var(--prr-mediumgrey);
}

</style>