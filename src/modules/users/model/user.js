import { Timestamp } from "firebase/firestore";
const { DateTime } = require("luxon");
import Result from "@/core/model/Result";
import { validateUrl } from "@/core/model/validation";

export { User, UserPrivate, userConverter, userPrivateConverter };

class User {
  constructor(config) {
    this.uid = config?.uid;
    this.displayName = config?.displayName;
    this.summary = config?.summary;
    this.website = config?.website;
    this.jobTitle = config?.jobTitle;
    this.username = config?.username;
  }
 
  static default() {
    return new User();
  }

  /**
   * Validation schema for use in isObjectValid(object, schema)
   */
  get schema() {
    return {
      displayName: (value) => {
        if (!value || value.length == 0) {
          return Result.failure("Must enter display name.");
        } else if (value.length > 100) {
          return Result.failure("Display name too long.");
        }
        return Result.success(value);
      },
      jobTitle: (value) => {
        if (value && value.length >= 100) {
          return Result.failure("Job title too long.");
        }
        return Result.success(value);
      },
      website: (value) => {
        if (this.website) {
          return validateUrl(value);        
        }
        return Result.success();
      },
      // username: (value) => {
      //   if (!value || value.length == 0) {
      //     return Result.failure("Must enter a username.");
      //   } else if (value.length > 30 || value.length < 5) {
      //     return Result.failure("Username must be between 5 and 30 characters.");
      //   }
      //   return Result.success(value);
      // }
    }
  }
}

class UserPrivate {
  constructor(config) {
    this.uid = config.uid;
    this.email = config?.email;
    this.lastLoggedInDate = config?.lastLoggedInDate;
  }
}

/**
 * FirestoreDataConverter implementation for User instances
 */
var userConverter = {
  toFirestore: function (user) {
    const result = {};
    if (user.displayName) { result.displayName = user.displayName }
    if (user.jobTitle != undefined) { result.jobTitle = user.jobTitle }
    if (user.summary != undefined) { result.summary = user.summary }
    // don't send the username
    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    const config = {
      uid: snapshot.id,
      displayName: data.displayName,
      jobTitle: data.jobTitle,
      summary: data.summary,
      username: data.username,
    }

    return new User(config);
  }
};

/**
 * FirestoreDataConverter implementation for User instances
 */
var userPrivateConverter = {
  toFirestore: function (user) {
    const result = {};
    if (user.email) { result.email = user.email; }
    if (user.lastLoggedInDate) { result.lastLoggedInDate = Timestamp.fromDate(user.lastLoggedInDate.toJSDate()); }
    
    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    const config = {
      uid: snapshot.id,
      email: data.email,
      lastLoggedInDate: data.lastLoggedInDate ? DateTime.fromJSDate(data.lastLoggedInDate.toDate()) : DateTime.local(),
    }

    return new UserPrivate(config);
  }
};