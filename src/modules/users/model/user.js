import { Timestamp } from "firebase/firestore";
const { DateTime } = require("luxon");
import { validateUrl } from "@/core/model/validation";
import Result from "@/core/model/Result";

export { User, userConverter };

class User {
  constructor(config) {
    this.uid = config?.uid;
    this.displayName = config?.displayName;
    this.email = config?.email;
    this.website = config?.website;
    this.lastLoggedInDate = config?.lastLoggedInDate;
  }
  static default() {
    return new User();
  }
  /**
   * Validation schema for use in isObjectValid(object, schema)
   */
  get schema() {
    return {
      website: (value) => {
        // first do mandatory check
        if (!value || value.length == 0) {
          return Result.failure("Must enter url.");
        }
        return validateUrl(value);        
      },
      displayName: (value) => {
        if (!value || value.length == 0) {
          return Result.failure("Must enter display name.");
        }
        return Result.success(value);
      }
    }
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
    if (user.website) { result.website = user.website; }
    if (user.lastLoggedInDate) { result.lastLoggedInDate = Timestamp.fromDate(user.lastLoggedInDate.toJSDate()); }
    
    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    const config = {
      uid: snapshot.id,
      displayName: data.displayName,
      email: data.email,
      website: data.website,
      lastLoggedInDate: data.lastLoggedInDate ? DateTime.fromJSDate(data.lastLoggedInDate.toDate()) : DateTime.local(),
    }

    return new User(config);
  }
};
