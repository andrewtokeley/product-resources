import { Timestamp } from "firebase/firestore";
const { DateTime } = require("luxon");
import Result from "@/core/model/Result";

export { Recommendation, recommendationConverter };

class Recommendation {

  constructor(config) {
    this.id = config.id;
    this.uid = config.uid;
    this.dateCreated = config.dateCreated;
    this.datePublished = config.datePublished;
    this.resourceType = config.resourceType;
    this.resourceUrl = config.resourceUrl;
    this.resourceId = config.resourceId,
    this.reason = config.reason;
    this.allowPublishReason = config.allowPublishReason;
    this.allowPublishName = config.allowPublishName;
    this.name = config.name;
    this.website = config.website;
  }

  static default() {
    // returns a default instance where all the fields, and their child properties are available.
    return new Recommendation({ 
      resourceType: {key:'books', value:'Book'},
      allowPublishReason: true,
      allowPublishName: false,
    });
  }

  addhttp(url) {
    if (!/^(?:f|ht)tps?:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
  }

  validateUrl(url) {
    let tryUrl = this.addhttp(url);
    try {
      let url = new URL(tryUrl);
      // mark as successful and send the modified URL back
      return Result.success(url.href);
    } catch (error) {
      return Result.failure("That URL doesn't look quite right.");
    }
  }

  /**
   * Validation routines for each property
   */
  get schema() {
    return {
      resourceUrl: (value) => {
        // first do mandatory check
        if (!value || value.length == 0) {
          return Result.failure("Must enter url.");
        }
        return this.validateUrl(value);        
      },
      name: (value) => {
        if (this.reason && (!value || value.length == 0)) {
          this.name = "Anon";
        }
        return Result.success();
      }
    }
  }

  /**
   * 
   * @returns whether all the properties are valid.
   */
  isValid() {
    console.log('val')
    var valid = true;
    let props = Object.getOwnPropertyNames(this);
    for (const i in props) {
      if (!this.errorStateFor(props[i]).result) {
        valid = false;
        break;
      }
    }
    return valid;
  }

  errorStateFor(propertyName) {
    let validation = this.schema[propertyName];
    if (validation) {
      return validation(this[propertyName])
    } else {
      return Result.success();
    }
  }

  get datePublishedFormatted() {
    if (this.datePublished && this.datePublished.isValid) {
      return this.datePublished.toLocaleString(DateTime.DATE_FULL);
    }
    return null;
  }

}

/**
 * FirestoreDataConverter implementation for User instances
 */
var recommendationConverter = {
  toFirestore: function (recommendation) {
    const result = {};
    console.log('rec')
    if (recommendation.uid != null) result.uid = recommendation.uid;
    if (recommendation.dateCreated != null && recommendation.dateCreated.isValid) { 
      result.dateCreated = Timestamp.fromDate(recommendation.dateCreated.toJSDate()); 
    } else {
      result.dateCreated = null;
    }
    if (recommendation.datePublished != null && recommendation.datePublished.isValid) { 
      result.datePublished = Timestamp.fromDate(recommendation.datePublished.toJSDate()); 
    } else {
      result.datePublished = null;
    }
    if (recommendation.resourceType != null) result.resourceType = recommendation.resourceType;
    if (recommendation.resourceUrl != null) result.resourceUrl = recommendation.resourceUrl;
    if (recommendation.resourceId != null) result.resourceId = recommendation.resourceId;
    if (recommendation.reason != null) result.reason = recommendation.reason;
    if (recommendation.allowPublishReason != null) result.allowPublishReason = recommendation.allowPublishReason;
    if (recommendation.allowPublishName != null) result.allowPublishName = recommendation.allowPublishName;
    if (recommendation.name != null) result.name = recommendation.name;
    if (recommendation.website != null) result.website = recommendation.website;

    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);

    const config = {
      id: snapshot.id,
      uid: data.uid,
      dateCreated: data.dateCreated ? DateTime.fromJSDate(data.dateCreated.toDate()) : null,
      datePublished: data.datePublished ? DateTime.fromJSDate(data.datePublished.toDate()) : null,
      resourceType: data.resourceType,
      resourceUrl: data.resourceUrl,
      resourceId: data.resourceId,
      reason: data.reason,
      allowPublishReason: data.allowPublishReason,
      allowPublishName: data.allowPublishName,
      name: data.name,
      website: data.website,
    }

    return new Recommendation(config);
  }
};
