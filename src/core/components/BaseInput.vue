<template>
  <div class="base-input">
    <div class="base-input__input-block">
      <input type="text" 
        ref="input"
        @input="handleInput" 
        @blur="$emit('blur')"
        @focus="$emit('focus')"
        v-model="value"
        :maxLength="_options.maximumLength"
        :placeholder="_options.placeholder"
        class="base-input__input" 
        :readonly="_options.readOnly"
        :class="{ 
          'base-input__input--borderless': _options.borderless,
          'base-input__input--is-centred': _options.centred,
          'base-input__input--has-hover-effect': _options.hoverEffect, 
          'base-input__input--has-underline-effect': _options.underlineEffect, 
          'base-input__input--is-large': _options.large, 
          'base-input__input--is-blue': _options.blue, 
          'base-input__input--is-white': !_options.blue, 
          'base-input__input--has-error': errorMessage && errorMessage.length > 0,
        }"
      />
    </div>
    <div v-if="_options.descriptionText" class='base-input__descriptionText' v-html="_options.descriptionText"></div>
    <div v-if="_options.inlineErrors" class='base-input__errorMessage'>{{ errorMessage }}</div>
  </div>
</template>

<script>

import { defineComponent } from "vue";

export default defineComponent({
  name: "base-input",
  
  // components: {
  //   Icon,
  // },

  emits: ["update:modelValue", "focus", "blur", "error"],

  props: {
    id: String,
    errorMessage: {
      type: String,
      default: ''
    },
    // isMandatory: {
    //   type: Boolean,
    //   default: false,
    // },
    // The bound value of the input, set by clients using the v-model property
    modelValue: String,
    options: Object,

    /**
     * Optional delayed validation configuration. Should return object with properties
     * - onBlur: if true the validation is called onBlur rather than after keypresses 
     * - delay: milliseconds to wait before calling callback
     * - callback: promise that accepts the current input value and resolves with (result, reason), the
     * result of the validation and, if validation fails, the reason.
     * 
     * and callback is a promise that will be called after delay. The callback with resolve with the result of the validation 
     * and an extra paramenter for an error message if invalid. Good for expensive valiation processes you don't want to call.
     * after every key press (or on blur if onBlur is true)
     */
    validation: {
      required: false,
      type: Object,
      default: function () { return { onBlur: false, delay: 200, callback: () => { return Promise.resolve(true) }}},
    },
    hasFocus: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      validationDelayTimer: Object,
      validationMessage: "",
      lastValue: null,
    }
  },
  
  computed: {
    _options() {
      
      return {
        borderless: this.options?.borderless ? this.options.borderless : false,
        hoverEffect: this.options?.hoverEffect ? this.options.hoverEffect : true,
        underlineEffect: this.options?.underlineEffect ? this.options.underlineEffect : true,
        centred: this.options?.centred ? this.options.centred : false,
        large: this.options?.large ? this.options.large : false,
        white: this.options?.white ? this.options.white : false,
        placeholder: this.options?.placeholder ? this.options.placeholder : "",
        descriptionText: this.options?.descriptionText ? this.options.descriptionText : null,
        inlineErrors: this.options?.inlineErrors ? this.options.inlineErrors : false,
        readOnly: this.options?.readOnly ? this.options.readOnly : false,
        forceLowerCase: this.options?.forceLowerCase ? this.options.forceLowerCase : false,
      }
    },

    // showInlineError() {
    //   return (this.options.inlineErrors ?? false) && this.errorMessage.length > 0;
    // },
    // showErrorBlock() {
    //   return this.options.inlineErrors ?? false;
    // },
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

  mounted() {
    if (this.hasFocus) {
      setTimeout(() => { this.$refs.input.focus() }, 300)
    }
  },

  methods: {
    runValidation(value) {
      const vm = this;
      
      // set a timer to delay the check - this allows a number of keys to be pressed before we call validation callback
      clearTimeout(this.validationDelayTimer);
      
      // if we don't cancel in the meantime this function will be called in a few ms.
      this.validationDelayTimer = setTimeout(function () {
        // only bother validating if the value is different.
        if (value != vm.lastValue) {
          vm.lastValue = value;
          vm.validation.callback(value)
            // .then( (response) => {
            //   if (response.result) {
            //     // clear error, we're good!
            //     vm.errorMessage = null;
            //   } else {
            //     // let the user know there's a problem
            //     vm.errorMessage = response.message ?? "Error";
            //     vm.$emit('error', vm.id, response.message)
            //   }
            // })
            // .catch( (error) => {
            //   vm.errorMessage = error ?? "Error";
            // })
        }
      }, this.validation.delay);
    },

    handleInput(event) {
      let newValue = event.target.value;
      if (this._options.forceLowerCase) {
        newValue = newValue.toLowerCase();
      }
      this.$emit("update:modelValue", newValue);
      this.$emit("input", event);
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
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
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
  /* box-sizing: border-box; */
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
  /* border-bottom-color: var(--prr-red);
  border-width: 1px; */
  border: 1px solid var(--prr-red);
}

.base-input__input--has-error:focus {
  /* border-bottom-color: var(--prr-red);
  border-width: 1px; */
  border: 1px solid var(--prr-red);
}

.base-input__errorMessage {
  position: relative;
  padding-top:5px;
  height: 15px;
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