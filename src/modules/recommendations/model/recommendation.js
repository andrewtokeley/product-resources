import { Timestamp } from "firebase/firestore";
const { DateTime } = require("luxon");
import { isObjectValid, validateProperty, validateObject, validateUrl, validateMandatoryProperty } from "@/core/model/validation";
export { Recommendation, recommendationConverter };

class Recommendation {

  constructor(config) {
    // review
    this.id = config.id;
    this.resourceName = config.resourceName;
    this.comment = config.comment;
    this.resourceType = config.resourceType;
    this.resourceUrl = config.resourceUrl;
    this.dateApproved = config.dateApproved;
    this.dateCreated = config.dateCreated;
    this.recommendedByUid = config.recommendedByUid;
    this.recommendedByName = config.recommendedByName;

    // only set once the recommendation has been approved and a resource document has been created.
    this.resourceId = config.resourceId
    this.approved = config.approved;
    
  }

  static default() {
    // returns a default instance with some defaults
    return new Recommendation({ 
      resourceType: 'books',
      approved: false
    });
  }

  get dateCreatedFormatted() {
    if (this.dateCreated && this.dateCreated.isValid) {
      return this.dateCreated.toLocaleString(DateTime.DATETIME_FULL);
    }
    return null;
  }

  /**
   * Validation schema for use in isObjectValid(object, schema)
   */
  get schema() {
    return {
      // resourceName: (value) => {
      //   return validateMandatoryProperty('resourceName', value);
      // },
      // resourceType: (value) => {
      //   return validateMandatoryProperty('resourceType', value);
      // },
      resourceUrl: (value) => {
        const mandatoryCheck = validateMandatoryProperty('resourceUrl', value);
        if (!mandatoryCheck.success) {
          return mandatoryCheck;
        } else {
          return validateUrl(value);        
        }
      }
    }
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
    if (recommendation.comment != null) result.comment = recommendation.comment;
    if (recommendation.resourceName != null) result.resourceName = recommendation.resourceName;
    if (recommendation.resourceType != null) result.resourceType = recommendation.resourceType;
    if (recommendation.resourceUrl != null) result.resourceUrl = recommendation.resourceUrl;
    
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
    // whether it's null or not we want to add this field to determine whether a recommendation has been linked
    result.resourceId = recommendation.resourceId;

    if (recommendation.approved != null) result.approved = recommendation.approved;
    
    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);

    const config = {
      id: snapshot.id,
      resourceId: data.resourceId,
      comment: data.comment,
      recommendedByUid: data.recommendedByUid,
      recommendedByName: data.recommendedByName,
      resourceName: data.resourceName,
      resourceUrl: data.resourceUrl,
      dateCreated: data.dateCreated ? DateTime.fromJSDate(data.dateCreated.toDate()) : null,
      dateApproved: data.dateApproved ? DateTime.fromJSDate(data.dateApproved.toDate()) : null,
      approved: data.approved ?? false,
      resourceType: data.resourceType,
    }
    return new Recommendation(config);
  }
};
