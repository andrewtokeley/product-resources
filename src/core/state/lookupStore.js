import { defineStore } from 'pinia'
import { getResourceTypes, getTags } from '@/modules/resources/services/lookup-service'

export const useLookupStore = defineStore( {
  id: 'lookup',
  state: () => ({
    tags: [],
    resourceTypes: [],
  }),

  actions: {    
    async fetchLookups() {
      const tagLookup = await getTags();
      this.tags = tagLookup.items;

      const resourceTypeLookup = await getResourceTypes();
      this.resourceTypes = resourceTypeLookup.items;
    },
  },
})