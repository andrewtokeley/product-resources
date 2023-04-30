<template>
  <div>
      <label v-if="leftAlign" class="base-check-box base-check-box--left">
        <input class="base-check-box__input" type="checkbox" id="id" v-model="checked" @change="$emit('change', checked)" />
          <span class="base-check-box__background base-check-box__background--left"></span>
          <span class="base-check-box__checkmark"></span>
        <span class="base-check-box__label">{{ label }}</span>
      </label>
      <label v-else class="base-check-box base-check-box--right">
        <span class="base-check-box__label">{{ label }}</span>
        <input class="base-check-box__input" type="checkbox" id="id" v-model="checked" @change="$emit('change', checked)" />
        <span class="base-check-box__background base-check-box__background--right"></span>
        <span class="base-check-box__checkmark"></span>
      </label>
    </div>
</template>

<script>

export default {
  name: "base-check-box",
  
  emits: ["update:modelValue", "change"], 

  props: {
    // The bound value of the checkbox, set by clients using the v-model property - will be true or false
    modelValue: Boolean,
    id: String,
    label: String,
    leftAlign: {
      type: Boolean,
      default: false,
    }
  },

  computed: {
    checked: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      }
    }
  },

};

</script>

<style scoped=true>
.base-check-box {
  display: block;
  position: relative;
  /* padding-left: 45px; */
  cursor: pointer;
  font-size: var(--prr-font-size-normal);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.base-check-box--right {
    justify-content: flex-end;
}

.base-check-box--left {
    justify-content: flex-start;
}

/* Hide the browser's default checkbox */
.base-check-box__input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.base-check-box__checkmark {
  /* position: absolute;
  top: 2px;
  left: 5px; */
  height: 14px;
  width: 14px;
  background-color:transparent;
  border-radius: 3px;
  border: 2px solid var(--prr-darkgrey);
  transition: all 0.3s ease;
  margin-right: 7px;
  margin-left: 7px;
  z-index: 1;
  /* display:flex;
  justify-content: center;
  align-items: center; */
}

/* Style the tick inside the checkmark */
.base-check-box .base-check-box__checkmark:after {
  margin-left:3px;
  margin-top:3px;
  width:4px;
  height:8px;
  border-width: 0 2px 2px 0px;
  border-style: solid;
  border-color: white;
  transform: rotate(45deg);
  transform-origin: right;
}

.base-check-box__background {
  transition: background-color 0.2s ease;
  position: absolute;
  height: 32px;
  width: 32px;
  background-color: transparent;
  border-radius: 15px;
  display:flex;
  justify-content: center;
  align-items: center;
}

.base-check-box__background--right {
  right: 0px;
}

.base-check-box__background--left {
  left: 0px;
}

/* On mouse-over, add a grey background color */
.base-check-box:hover input ~ .base-check-box__background {
  background-color: var(--prr-lightgrey);  
}

/* On mouse-over, add a grey background color */
.base-check-box:hover input ~ .base-check-box__checkmark {
  border-color: black;  
}

/* When the checkbox is checked, add a blue background */
.base-check-box input:checked ~ .base-check-box__checkmark {
  background-color: var(--prr-blue);
  border-color: var(--prr-blue);
}

/* Create the checkmark/indicator (hidden when not checked) */
.base-check-box__checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.base-check-box input:checked ~ .base-check-box__checkmark:after {
  display: block;
}





.base-check-box__label {
  color: var(--prr-darkgrey);
  font-size: var(--prr-font-size-normal);
}
</style>