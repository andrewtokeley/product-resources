<template>
  <div class="base-input">
    <div class="base-input__input-block">
      <input type="text" 
        @input="validate" 
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        v-model="value"
        :maxLength="options.maximumLength ?? 300"
        :placeholder="options.placeholder ? options.placeholder : ''"
        class="base-input__input" 
        :attribute="{readonly: options.readOnly ?? false }"
        :class="{ 
          'base-input__input--borderless': options.borderless ?? false,
          'base-input__input--is-centred': options.centred ?? false,
          'base-input__input--has-hover-effect': options.hoverEffect ?? true, 
          'base-input__input--has-underline-effect': options.underlineEffect ?? true, 
          'base-input__input--is-large': options.large ?? false, 
          'base-input__input--is-blue': options.blue ?? false, 
          'base-input__input--is-white': !options.blue ?? true, 
          'base-input__input--has-error': errorMessage.length > 0,
        }"
      />
    </div>
    <div v-if="options.descriptionText" class='base-input__descriptionText' v-html="options.descriptionText"></div>
    <div v-if="showErrorBlock" class='base-input__errorMessage'>{{ errorMessage }}</div>
  </div>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
  name: "base-input",
  
  // components: {
  //   Icon,
  // },

  emits: ["update:modelValue", "focus", "blur"],

  props: {
    // The bound value of the input, set by clients using the v-model property
    modelValue: String,

    // Optional object literal to control how the input is displayed. Properties include;
    // 
    //  - hoverEffect: if true, hovering over input presents a grey background
    //  - underlineEffect: if true, when input has focus a blue underline will be presented
    //  - centred: if true, the contents of the input will be centred
    //  - white: text will be white, rather than the default light grey
    //  - placeholder: input placeholder
    // }
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
          forceLowerCase: false,

        }
      }
    },

    // Optional delayed validation configuration. Should return {delay, callback} where delay is milliseconds to wait between key presses
    // and callback is   a promise that will be called after delay. The callback with resolve if valid and be rejected with an
    // appropriate error message if invalid. Good for expensive valiation processes you don't want to call.
    // after every key press.
    validation: {
      required: false,
      type: Object,
      default: function () { return { delay: 200, callback: () => { return Promise.resolve(true) }}},
    },

    // // Optional client validation configuration. Keep the validation simply as callback will be called whenever the inout
    // // changes, with no delay.
    // clientValidation: {
    //   required: false,
    //   type: Object,
    //   default: function () { return () => { return Promise.resolve(true) }}
    // },
  },

  data() {
    return {
      validationDelayTimer: Object,
      validationMessage: "",
      lastValue: null,
      errorMessage: "",
    }
  },

  computed: {
    showInlineError() {
      return (this.options.inlineErrors ?? false) && this.errorMessage.length > 0;
    },
    showErrorBlock() {
      return !(this.options.inlineErrors ?? false);
    },
    value: {
      get() {
        return this.modelValue;
      },
      set() {
        // don't want to do anything here because we only want to let the client know about the value
        // change after it's successfully been validated/saved asynchronously (see validation())
        // We still need an empty implementation so the value property is writable though
      }
    }
  },

  methods: {

    validate(event) {
      const vm = this;
      let newValue = event.target.value;
      if (this.options.forceLowerCase) {
        newValue = newValue.toLowerCase();
      }

      this.$emit("update:modelValue", newValue);

      // set a timer to delay the check - this allows a number of keys to be pressed before we call validation callback
      if (this.validation) {
        clearTimeout(this.validationDelayTimer);
        
        // if we don't cancel in the meantime this function will be called in a few ms.
        this.validationDelayTimer = setTimeout(function () {

          // only bother validating if the value is different.
          if (newValue != vm.lastValue) {
            vm.lastValue = newValue;
            vm.validation.callback(newValue)
              .then( () => {
                vm.errorMessage = "";
              })
              .catch( (error) => {
                vm.errorMessage = error ?? "";
              })
            }
          }, this.validation.delay);
      } else {
        //this.$emit("update:modelValue", newValue);
      } 
    },
    
    beforeUnmount() {
      // make sure we don't have the timer still going
      clearTimeout(this.validationDelayTimer);
    }
  }
});
</script>

<style>
.base-input {
  display: flex;
  flex-direction: column;
}

.base-input__input-block {
  display:flex;
}

.base-input__input {
  /* Remove default styles first - e.g. iOS safari adds inner top border by default */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  color: var(--prr-darkgrey);
  background: var(--prr-extralightgrey);
  border: 1px white solid;
  border-bottom-color: var(--prr-mediumgrey);
  font-size: var(--prr-font-size-normal);
  border-radius:5px 5px 0px 0px;
  height: 40px;
  width: 100%;
  outline: none;
  padding: 0px 10px;
  box-sizing: border-box;
}

.base-input__input--borderless {
  background: transparent;
  border: transparent;
}

.base-input__input--has-hover-effect.base-input__input--is-blue:hover {
  background:  var(--prr-bluehover);
  border-bottom-width: 1px;
  border-radius:5px 5px 0px 0px;
}

.base-input__input--has-hover-effect.base-input__input--is-white:hover {
  background:  var(--prr-lightgrey);
  border-bottom-width: 1px;
  border-radius:5px 5px 0px 0px;
}

.base-input__input--has-underline-effect:focus {
  background:  var(--prr-lightgrey);
  border-bottom-color: var(--prr-blue);
}

.base-input__input--is-centred {
  text-align: center;
}

.base-input__input--is-large {
  font-size: var(--prr-font-size-large);
}

.base-input__input--is-blue {
  color: white;
}

.base-input__input--has-error {
  border-bottom-color: var(--prr-red);
  border-width: 1px;
}

.base-input__input--has-error:focus {
  border-bottom-color: var(--prr-red);
  border-width: 1px;
}

.base-input__errorMessage {
  position: relative;
  padding-top:5px;
  height: 20px;
  color: var(--prr-red);
  font-size: var(--prr-font-size-small);
}

.base-input__errorMessage--inline {
  position: absolute;
  float: right;
  font-size: 24px;
  color: var(--prr-red);
}

.base-input__descriptionText {
  padding-top:5px;
  color: var(--prr-darkgrey);
  font-size: var(--prr-font-size-small);
}
</style>