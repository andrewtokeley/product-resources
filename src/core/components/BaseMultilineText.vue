<template>
  <div class="base-multiline-text">
    <textarea
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
      v-model="value"
      :maxLength="_options.maximumLength"
      :rows="_options.numberOfLines"
      :readonly="_options.readOnly"
      :placeholder="_options.placeholder"
      class="base-multiline-text__textarea"
      :class="{
        'base-multiline-text__textarea--has-error': errorMessage?.length > 0,
        'base-multiline-text__textarea--disabled': disabled,
      }"
    />
    <div
      class="base-multiline-text__characterCount"
      :class="{
        'base-multiline-text__characterCount--disabled': disabled,
      }"
    >
      {{ characterCount }}
    </div>
    <div v-if="_options.inlineErrors" class="base-multiline-text__errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script>

export default {
  name: "base-multiline-text",

  emits: ["update:modelValue", "blur"],

  props: {
    // The bound value of the input, set by clients using the v-model property
    modelValue: String,
    errorMessage: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false,
    },

    // Optional object literal to control how the input is displayed. Properties include;
    //
    //  - maximumLength: number of characters allowed in field
    //  - showCharacterCount: if true, will display count / maximumLength
    //  - numberOfLines: number of lines to display
    //  - placeholder: placeholder text
    // }
    options: {},

    // Optional delayed validation configuration. Should return {delay, callback} where delay is milliseconds to wait between key presses
    // and callback is   a promise that will be called after delay. Good for expensive valiation processes you don't want to call
    // after every key press.
    validation: {
      required: false,
      type: Object,
      default: function () {
        return {
          delay: 200,
          callback: () => {
            return Promise.resolve(true);
          },
        };
      },
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
      // errorMessage: "",
    };
  },

  computed: {
    _options() {
      return {
        showCharacterCount: this.options.showCharacterCount ?? false,
        maximumLength: this.options.maximumLength ?? 300,
        numberOfLines: this.options.numberOfLines ?? 4,
        placeholder: this.options.placeholder ?? "",
        readOnly: this.options.readOnly ?? false,
        inlineErrors: this.options.inlineErrors ?? false,
      }
    },
    characterCount() {
      if (this._options.showCharacterCount) {
        if (this._options.maximumLength && this.value) {
          return this.value.length + " / " + this._options.maximumLength;
        }
      }
      return "";
    },
    value: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        // don't want to do anything here because we only want to let the client know about the value
        // change after it's successfully been validated/saved asynchronously (see validation())
        // We still need an empty implementation so the value property is writable though
        console.log("value set" + newValue);
      },
    },
  },

  methods: {
    validate(event) {
      // const vm = this;
      const newValue = event.target.value;

      // set a timer to delay the check - this allows a number of keys to be pressed before we call validation callback
      if (this.validation) {
        clearTimeout(this.validationDelayTimer);

        // this.validationDelayTimer = setTimeout(function () {
        //   // only bother validating if the value is different.
        //   if (newValue != vm.lastValue) {
        //     vm.validation
        //       .callback(newValue)
        //       .then(() => {
        //         vm.lastValue = newValue;
        //         vm.errorMessage = "";
        //         vm.$emit("update:modelValue", newValue);
        //       })
        //       .catch((error) => {
        //         vm.errorMessage = error;
        //       });
        //   } else {
        //     console.log("nothing");
        //   }
        // }, this.validation.delay);
      } else {
        this.$emit("update:modelValue", newValue);
      }
    },

    beforeUnmount() {
      // make sure we don't have the timer still going
      clearTimeout(this.validationDelayTimer);
    },
  },
};

</script>

<style>
.base-multiline-text__textarea {
  /* Remove default styles first - e.g. iOS safari adds inner top border by default */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  color: var(--prr-darkgrey);
  background: var(--prr-extralightgrey);
  border: 1px white solid;
  border-bottom-color: var(--prr-mediumgrey);
  border-radius: 5px 5px 0px 0px;
  width: 100%;
  padding: 10px 10px;
  box-sizing: border-box;
  font-family: var(--prr-font-family);
  font-size: var(--prr-font-size-normal);
  outline: none;
  resize: none;
  /* margin-bottom: 20px; */
}

.base-multiline-text__textarea:hover {
  background: var(--prr-lightgrey);
  border-bottom-width: 1px;
  border-radius: 5px 5px 0px 0px;
}

.base-multiline-text__textarea:focus {
  background: var(--prr-lightgrey);
  border-bottom-color: var(--prr-blue);
}

.base-multiline-text__characterCount {
  position: relative;
  top: 0px;
  float: right;
  height: 20px;
  font-size: var(--prr-font-size-small);
  color: var(--prr-mediumgrey);
}

.base-multiline-text__characterCount--disabled {
  color: transparent;
}

.base-multiline-text__textarea--has-error {
  border: 1px solid var(--prr-red);
}

.base-multiline-text__textarea--has-error:focus {
  border: 1px solid var(--prr-red);
}

.base-multiline-text__errorMessage {
  position: relative;
  top: -20px;
  color: var(--prr-red);
  font-size: var(--prr-font-size-small);
}

.base-multiline-text__textarea--disabled {
  background: var(--prr-extralightgrey);
  border-bottom-color: var(--prr-extralightgrey);
  color: var(--prr-lightgrey);
}

.base-multiline-text__textarea--disabled:focus,
.base-multiline-text__textarea--disabled:hover {
  background: var(--prr-extralightgrey);
}
</style>