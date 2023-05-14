import { Timestamp } from "firebase/firestore";
const { DateTime } = require("luxon");
import Result from "@/core/model/Result";
import { isObjectValid, validateProperty, validateObject, validateUrl } from "@/core/model/validation";
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
    this.approved = config.approved;
  }

  static default() {
    // returns a default instance where all the fields, and their child properties are available.
    return new Recommendation({ 
      resourceType: 'books',
      allowPublishReason: true,
      allowPublishName: false,
      approved: false,
    });
  }

  /**
   * Validation schema for use in isObjectValid(object, schema)
   */
  get schema() {
    return {
      resourceUrl: (value) => {
        // first do mandatory check
        if (!value || value.length == 0) {
          return Result.failure("Must enter url.");
        }
        return validateUrl(value);        
      },
      reason: (value) => {
        if (!value || value.length == 0) {
          return Result.failure("People will want to know why you love this resource!");
        }
        return Result.success();
      },
      website: (value) => {
        if (!value || value.length == 0) {
          return Result.success();
        }
        return validateUrl(value);  
      }

    }
  }

  get datePublishedFormatted() {
    if (this.datePublished && this.datePublished.isValid) {
      return this.datePublished.toLocaleString(DateTime.DATE_FULL);
    }
    return null;
  }

  get isValid() {
    return isObjectValid(this, this.schema);
  }

  validate() {
    return validateObject(this, this.schema);
  }

  validateProperty(propertyName) {
    return validateProperty(this, this.schema, propertyName);  
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
    if (recommendation.approved != null) result.approved = recommendation.approved;
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
      approved: data.approved ?? false,
    }

    return new Recommendation(config);
  }
};
