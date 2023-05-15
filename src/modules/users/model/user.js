import { Timestamp } from "firebase/firestore";
const { DateTime } = require("luxon");

export { User, userConverter };

class User {
  constructor(config) {
    this.uid = config?.uid;
    this.displayName = config?.displayName;
    this.email = config?.email;
    this.lastLoggedInDate = config?.lastLoggedInDate;
  }
  static default() {
    return new User();
  }
}

/**
 * FirestoreDataConverter implementation for User instances
 */
var userConverter = {
  toFirestore: function (user) {
    const result = {};
    if (user.displayName) { result.displayName = user.displayName }
    if (user.email) { result.email = user.email; }
    if (user.lastLoggedInDate) { result.lastLoggedInDate = Timestamp.fromDate(user.lastLoggedInDate.toJSDate()); }
    
    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    const config = {
      uid: snapshot.id,
      displayName: data.displayName,
      email: data.email,
      lastLoggedInDate: data.lastLoggedInDate ? DateTime.fromJSDate(data.lastLoggedInDate.toDate()) : DateTime.local(),
    }

    return new User(config);
  }
};
