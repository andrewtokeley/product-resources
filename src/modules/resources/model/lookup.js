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
    this.items = config.items.sort((a,b) => a.value > b.value ? 1 : -1);

    /**
     * This array contains only the key/value pairings
     */
    this.keyValues = this.items.map ( item => {
      return { key: item.key, value: item.value }
    });

  }
}

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
    console.log('fire')
    const config = {
      id: snapshot.id,
      items: data.items,
    }

    return new Lookup(config);
  }
};
