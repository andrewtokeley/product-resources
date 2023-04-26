export { Lookup, lookupConverter };

class Lookup {
  constructor(config) {
    this.id = config.id;
    this.items = config.items;
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
    const config = {
      id: snapshot.id,
      items: data.items,
    }

    return new Lookup(config);
  }
};
