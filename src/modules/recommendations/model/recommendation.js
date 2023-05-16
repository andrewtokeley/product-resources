import { Timestamp } from "firebase/firestore";
const { DateTime } = require("luxon");
import { isObjectValid, validateProperty, validateObject, validateUrl, validateMandatoryProperty } from "@/core/model/validation";
export { Recommendation, recommendationConverter };

class Recommendation {

  constructor(config) {
      
    this.id = config.id;
    this.recommendedByUid = config.recommendedByUid;
    this.recommendedByName = config.recommendedByName;
    this.resourceId = config.resourceId,
    this.resourceType = config.resourceType;
    this.resourceName = config.resourceName,
    this.resourceUrl = config.resourceUrl;
    this.reason = config.reason;
    this.dateCreated = config.dateCreated;
    this.dateApproved = config.dateApproved;
    this.isReview = config.isReview;
    this.approved = config.approved;
  }

  get canApprove() {
    return this.resourceId != null && this.reason?.length > 0 && this.recommendedByUid && this.recommendedByName;
  }

  static default() {
    // returns a default instance with some defaults
    return new Recommendation({ 
      resourceType: 'books',
      approved: false,
      isReview: false,
    });
  }

  /**
   * Validation schema for use in isObjectValid(object, schema)
   */
  get schema() {
    return {
      recommendedByUid: (value) => {
        return validateMandatoryProperty('recommendedByUid', value);
      },
      resourceName: (value) => {
        return validateMandatoryProperty('resourceName', value);
      },
      resourceUrl: (value) => {
        const mandatoryCheck = validateMandatoryProperty('resourceUrl', value);
        if (!mandatoryCheck.success) {
          return mandatoryCheck;
        } else {
          return validateUrl(value);        
        }
      },
      reason: (value) => {
        return validateMandatoryProperty('reason', value);
      },
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
    
    if (recommendation.recommendedByUid != null) result.recommendedByUid = recommendation.recommendedByUid;
    if (recommendation.recommendedByName != null) result.recommendedByName = recommendation.recommendedByName;
    if (recommendation.resourceName != null) result.resourceName = recommendation.resourceName;
    if (recommendation.resourceType != null) result.resourceType = recommendation.resourceType;
    if (recommendation.resourceUrl != null) result.resourceUrl = recommendation.resourceUrl;
    if (recommendation.resourceId != null) result.resourceId = recommendation.resourceId;
    if (recommendation.reason != null) result.reason = recommendation.reason;
    
    if (recommendation.dateCreated != null && recommendation.dateCreated.isValid) { 
      result.dateCreated = Timestamp.fromDate(recommendation.dateCreated.toJSDate()); 
    } else {
      result.dateCreated = null;
    }
    if (recommendation.dateApproved != null && recommendation.dateApproved.isValid) { 
      result.dateApproved = Timestamp.fromDate(recommendation.dateApproved.toJSDate()); 
    } else {
      result.dateApproved = null;
    }
    if (recommendation.isReview != null) result.isReview = recommendation.isReview;
    if (recommendation.approved != null) result.approved = recommendation.approved;
    
    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);

    const config = {
      id: snapshot.id,
      recommendedByUid: data.recommendedByUid,
      recommendedByName: data.recommendedByName,
      resourceName: data.resourceName,
      resourceUrl: data.resourceUrl,
      resourceId: data.resourceId,
      reason: data.reason,
      dateCreated: data.dateCreated ? DateTime.fromJSDate(data.dateCreated.toDate()) : null,
      dateApproved: data.dateApproved ? DateTime.fromJSDate(data.dateApproved.toDate()) : null,
      approved: data.approved ?? false,
      isReview: data.isReview ?? false,
      resourceType: data.resourceType,
    }

    return new Recommendation(config);
  }
};
