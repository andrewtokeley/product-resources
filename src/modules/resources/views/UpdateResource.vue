<template>
  <div class="page" :class="{ isWorking: isWorking }">
    
    <div class="content">
      <div class="wrapper">
        <h1 v-if="title">{{ title }}</h1>
        <h1 v-else>Add New Resource</h1>
        <p>
          All changes will be immediately visible to users.
        </p>
        <div class="grid">
          
          <div class="entry">
            <base-input
              v-model="resource.displayName"
              :options="{ 
                maximumLength: 30,
                placeholder: 'Add title'}"
            ></base-input>
            <div class="helpText">
              This could be the book name, article heading, episode title or show name.
            </div>
          </div>
          <base-icon class="icon">notes</base-icon>
          <div class="entry">
            <base-multiline-text
              v-model="resource.description"
              :options="{ 
                placeholder: 'Add description',
                numberOfLines: 10,
                maximumLength: 1000, 
                showCharacterCount: true}"
            ></base-multiline-text>
          </div>

          <!-- <div class="entry">
            <base-check-box
              label="Allow people to subscribe to updates"
              :leftAlign="true"
              v-model="adventure.allowSubscribe">
            </base-check-box>
          </div> -->
          <!-- <div class="entry">
            <base-input
              :options="{ 
                placeholder: 'Proposed start marker',
                descriptionText: 'Where you intend to start your adventure (Optional) ' }"
            ></base-input>
          </div>

          <div class="entry">
            <base-input
              :options="{ placeholder: 'Proposed end marker',
              descriptionText: 'Where you intend to end your adventure (Optional) ' }"
            ></base-input>
            
          </div> -->
          
        </div>
        <div class="buttonStrip">
          <div class="buttonStrip--left">
            <base-button
              :isDestructive="true"
              @click="handleDeleteOpen"
              >Delete</base-button
          >
          </div>
          <div class="buttonStrip--right">
            <base-button
              :isSecondary="true"
              @click="$router.push(`/`)"
              >Cancel</base-button
            >
            <base-button @click="handleSave">Save</base-button
            >
          </div>
        </div>
      </div>
    </div>

    <modal-dialog v-if="showDeleteAlert" title="Delete" :actions="deleteActions" @close="showDeleteAlert = false;">
      <p>Are you sure?</p>
      <p>This will delete all checkins, images...</p>  
    </modal-dialog>

  </div>
</template>

<script>
import BaseInput from "@/core/components/BaseInput.vue"
import BaseButton from "@/core/components/BaseButton.vue"
import BaseIcon from "@/core/components/BaseIcon.vue"
import BaseMultilineText from "@/core/components/BaseMultilineText.vue";
import ModalDialog from "@/core/components/ModalDialog";

// import {
//   addAdventure,
//   getAdventure,
//   updateAdventure,
// } from "../../api/firestoreAdventures";
import { getResource, updateResource } from "@/modules/resources/services/resource-service"
import { Resource } from "@/modules/resources/model/resource"

//const { DateTime } = require("luxon");

export default {
  name: "UpdateResource",
  components: {
    BaseInput,
    BaseButton,
    BaseIcon,
    BaseMultilineText,
    ModalDialog,
  },

  data() {
    const vm = this;
    return {
      showDeleteAlert: false,
      isWorking: true,
      resource: {
        type: Resource,
        default: new Resource({}),
      },
      title: "",
      deleteActions: [
        { id: 0, 
          title: "Cancel", 
          isSecondary: true,
          handle: () => {
            vm.showDeleteAlert = false;
          }
        },
        { id: 1, 
          title: "Delete", 
          isDestructive: true,
          handle: () => {
            vm.handleDelete();
            vm.showDeleteAlert = false;
          }
        }
      ],
    };
  },

  computed: {
    // iconOptions() {
    //   return constants.ICON_OPTIONS.ON_WHITE;
    // },
  },

  mounted() {
    const id = this.$route.params.id;
    if (id) {
      this.getRsource(id);
    } else {
      this.title = "New Resource";
    }
  },

  methods: {
    getRsource(id) {
      const vm = this;
      getResource(id).then((resource) => {
        
        if (resource) {
          vm.resource = resource;
          vm.title = "Update";
        } else {
          vm.title = "Error!";
        }
      });
    },

    handleDeleteOpen() {
      this.showDeleteAlert = true;
    },

    handleDelete() {
      console.log('do delete'); 
    },

    handleSave() {
      this.isWorking = true;
      const vm = this;

      if (this.resource.id) {
        //this is an existing resource, update...
        updateResource(this.resource).then( () => {
          vm.$router.push(`/`);
        }).catch( (error) => {
          console.log(error);
        });
      } else {
        //this is a new resource
        updateResource(this.resource).then(() => {
          this.isWorking = false;
          vm.$router.push(`/`);
        }).catch( (error) => {
          console.log(error);
        }
        );
      }
    },
  },
};

</script>

<style scoped>
.page .working {
  cursor: progress;
}

.content {
  position: relative;
  top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
}

.wrapper {
  border-radius: 10px;
  max-width: 600px;
  background: white;
  width: 80%;
  padding: 20px;
}

.wrapper h1 {
  font-size: 1.5em;
}

.wrapper p {
  color: var(--prr-mediumgrey);
  margin-bottom: 20px;
}

.wrapper .buttonStrip {
  display: flex;
  justify-content:space-between;
}

.wrapper .buttonStrip-left {
  display: flex;
  justify-content:flex-start;
}

.wrapper .buttonStrip-right {
  display: flex;
  justify-content:flex-end;
}

.grid {
  display: grid;
  grid-template-columns: 30px 1fr;
  margin-bottom: 20px;
}

.grid .icon {
  padding-top: 10px;
  grid-column: 1 / 2;
  align-self: flex-start;
}

.grid .entry {
  grid-column: 2 / 3;
  align-self: flex-start;
}

.grid .entry .helpText {
  font-size: 0.8em;
  color: var(--prr-mediumgrey);
  padding-left: 10px;
  padding-bottom: 20px;
}
</style>