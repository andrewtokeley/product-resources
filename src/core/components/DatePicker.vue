<template>
  <div class="date-picker" :class="{ 'date-picker--is-centred': _options.centred }">
    <flat-pickr ref="datePickerWrap" v-model="value" :config="pickerConfig" :placeholder="_options.placeholder" ></flat-pickr>
    <!-- <base-icon class="clear-icon" @click="clearDate">close</base-icon> -->
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
const { DateTime } = require('luxon');

// import BaseIcon from './BaseIcon.vue';

export default {
  name: "date-picker",
  emits: ['update:modelValue'],
  
  components: {
    flatPickr,
    // BaseIcon
  },

  props: {
 
    modelValue: {
      type: DateTime,
      default: null
    },
    options: {
      type: Object,
      default: function() {
        return {
          centred: false,
        }
      }
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    enableTime: {
      type: Boolean,
      default: false,
    }

  },

  // data() {
  //   return {
  //     // Configuration for the flatPickr
  //     pickerConfig: {
  //       dateFormat: "Y-m-d",
  //       altFormat: "F j, Y",
  //       altInput: true,
  //       clickOpens: !this.readOnly,
  //       disableMobile: "true",
  //     }
  //   }
  // },
  
  methods: {
    clearDate() {
      if (!this.$refs.datePickerWrap) {
        return;
      }
      this.$refs.datePickerWrap.fp.clear();
    },
  },

  computed: {
    pickerConfig() {
      return {
        dateFormat: "Z",
        altInput: true,
        altFormat: this.enableTime ? 'd M, Y h:iK' : 'd M, Y',
        time_24hr: true,
        clickOpens: !this.readOnly,
        disableMobile: true,
        enableTime: this.enableTime,
      }
    },
    _options() {
      return {
        centred: this.options.centred ?? false,
        placeholder: this.options.placeholder ?? "Enter date",
      }
    },

    formattedDate() {
      if (this.value) {
        return DateTime.fromISO(this.value).toLocaleString(DateTime.DATE_HUGE);  
      }
      return "";
    },

    value: {
      get() {
        // convert Luxon date into a JS date
        if (this.modelValue) {
          return this.enableTime ? this.modelValue.toISO() : this.modelValue.toISODate();
        } else {
          return null;
        }
      },
      set(value) {
        // convert back to Luxon date
        const date = DateTime.fromISO(value);
        this.$emit('update:modelValue', date);
      }
    }
  }
}


</script>

<style>

.date-picker--is-centred input {
  text-align: center;
}

.date-picker input {
  /* Remove default styles first - e.g. iOS safari adds inner top border by default */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  cursor: pointer;
  padding: 0px 0px 0px 10px;
  height: 40px;
  width: 100%;
  border-radius: 3px 3px 0px 0px;
  border: 1px solid white;
  border-bottom-color: var(--prr-mediumgrey);
  box-sizing: border-box;
  font-family: var(--prr-font-family);
  font-size: var(--prr-font-size-normal);
  color: var(--prr-darkgrey);
  outline: none;
  background: var(--prr-extralightgrey);
  margin-bottom: 10px;
} 

.date-picker input:hover {
  background: var(--prr-lightgrey);
}

.date-picker input:active {
  border-bottom-color: var(--prr-blue);
}

.clear-icon {
  float:right;
}
</style>