
export { Lookup, lookupConverter };

/**
 * A lookup instance has an id that represents the type of lookup (e.g. resource-types or tags) and 
 * a set of items. Each item has at least a key and value pair, and may include other meta data.
 */
class Lookup {
  constructor(config) {
    this.id = config.id;
    
    /**
     * This array contains the key/value pairings but also extra meta data
     */
    if (config.items) {
      this.items = config.items.sort((a,b) => a.value > b.value ? 1 : -1);
    } else {
      this.items = [];
    }
    
    /**
     * This array contains only the key/value pairings
     */
    this.keyValues = this.items.map ( i => { return { key: i.key, value: i.value }} );
    
  }
}

// class LookupItem {
//   constructor(config){
//     this.key = config.key
//     this.value = config.value
//     this.order = config.order
//     this.meta = config.meta
//   }

//   static default() {
//     return new LookupItem( {})
//   }

//   /**
//    * May not need this anymore?
//    */
//   get keyValue() {
//     return { key: this.key, value: this.value }
//   }
// }

/**
 * FirestoreDataConverter implementation for User instances
 */
var lookupConverter = {
  toFirestore: function (lookup) {
    const result = {};
    if (lookup.id != null) { result.id = lookup.id }
    if (lookup.items != null) { result.items = lookup.items }
    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    const config = {
      id: snapshot.id,
      items: data.items,
    }

    return new Lookup(config);
  }
};
