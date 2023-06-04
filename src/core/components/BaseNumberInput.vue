<template>
  <div class="numberInput">
    <div v-if="label" class="label">{{ label }}</div>
    <div v-if="!readOnly" class="selection">
      <div v-if='!hideButtons' class="material-symbols-outlined down" @click.stop="decrement" >remove</div>
      <input type="number" v-model.number="value" :placeholder="placeholder" />
      <div v-if='!hideButtons' class="material-symbols-outlined up" @click.stop="increment">add</div>
      <span class="inlineLabel" v-if="inlineLabel">{{ inlineLabel }}</span>
    </div>
    <div v-if="readOnly" class="selection" :class="{ smallText: smallText }">
      <span class="inlineLabel" v-if="inlineLabel">{{value}} {{inlineLabel}}</span>
    </div>
    <div v-if="descriptionText" class='numberInput__descriptionText' v-html="descriptionText"></div>
  </div>
</template>

<script>

export default {
  name: "base-number-input",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Number,
      default: null,
    },
    placeholder: String,
    label: String,
    inlineLabel: String,
    smallText: {
      type: Boolean,
      default: false,
    },
    readOnly: Boolean,
    minimum: {
      type: Number,
      default: 0
    },
    maximum: {
      type: Number,
      default: 1000
    },
    step: {
      type: Number,
      default: 1,
    },
    hideButtons: {
      type: Boolean,
      default: false,
    },
    descriptionText: {
      type: String,
      default: '',
    }
  },

  data() {
    return {
      isEditing: false,
    }
  },

  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },

  methods: {
    decrement() {
      if (this.value > this.minimum) {
        this.value -= this.step;
      }
    },
    increment() {
      if (this.value < this.maximum) {
        this.value += this.step;
      }
    },
    toggleEditMode() {
      if (!this.canEdit) {
        return;
      }

      this.isEditing = !this.isEditing;
    }
  }
};
</script>

<style scoped>

.numberInput {
  padding-top: 5px;
  padding-bottom: 20px;
}

.numberInput.hover:hover {
  background: var(--ish-lightgrey);
  cursor: pointer;
}

div.hide, div.show {
  transition: all 400ms;
}

.hide {
  height: 0px;
  opacity: 0;
}

.show {
  height: 32px;
  opacity: 1;
}

.smallText {
  font-size: 12px;
}

.numberInput__descriptionText {
  padding-top:5px;
  font-size: var(--ish-font-size-small);
  color: var(--ish-mediumgrey);
}

/* Webkit - remove arrows */
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox - remove arrows */
input[type=number] {
  -moz-appearance: textfield;
}

input[type=number] {

  color: var(--ish-darkgrey);
  background: var(--ish-extralightgrey);
  border: 1px var(--ish-extralightgrey) solid;
  border-bottom-color: var(--ish-mediumgrey);
  font-size: var(--ish-font-size-normal);
  /* border-radius:5px 5px 0px 0px; */
  height: 50px;
  width: 70px;
  outline: none;
  padding: 0px 10px;
  box-sizing: border-box;
  text-align: center;
}

input[type=number]:hover {
  background:  var(--ish-lightgrey);
  border: 1px var(--ish-lightgrey) solid;
  border-bottom-color: var(--ish-mediumgrey);
}

input[type=number]:focus {
  border-bottom-color: var(--ish-blue);
}

.label {
  padding-top: 30px;
  font-size: var(--ish-font-size-normal);
  color: dimgray;
  }

.inlineLabel {
  padding-left: 10px;
  font-weight: 300;
}

.selection {
  display:flex;
  justify-items: flex-start;
  align-items: center;
  height: 50px;
}

.selection.smallText {
  height: 10px;
}

.down {
  border-radius: 5px 0px 0px 5px;
}

.up {
  border-radius: 0px 5px 5px 0px;
}

.up, .down {
  background-color: var(--ish-lightgrey);
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>