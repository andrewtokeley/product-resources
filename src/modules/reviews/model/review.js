import { Timestamp } from "firebase/firestore";
const { DateTime } = require("luxon");
import { isObjectValid, validateProperty, validateObject, validateMandatoryProperty } from "@/core/model/validation";
export { Review, reviewConverter };

class Review {

  constructor(config) {
    this.id = config.id;
    this.resourceId = config.resourceId;
    this.resourceName = config.resourceName;
    this.recommendationId = config.recommendationId;
    this.reviewedByUid = config.reviewedByUid;
    this.reviewedByName = config.reviewedByName;
    this.reason = config.reason;
    this.dateCreated = config.dateCreated;
    this.dateApproved = config.dateApproved;
    this.approved = config.approved;
  }

  static default() {
    const review = new Review({
      approved: false,
    });
    return review;
  }

  get statusDescription() {
    if (this.resourceId != null && this.resourceId != undefined) {
      return "Linked";
    } else {
      return "Not Linked";
    }
  }

  get canApprove() {
    return (this.resourceId != null && this.resourceId != undefined)  && 
      this.reason?.length > 0 && 
      this.reviewedByUid && 
      this.reviewedByName;
  }

  /**
   * Validation schema for use in isObjectValid(object, schema)
   */
  get schema() {
    return {
      reviewedByUid: (value) => {
        return validateMandatoryProperty('reviewedByUid', value);
      },
      reviewedByName: (value) => {
        return validateMandatoryProperty('reviewedByName', value);
      },
      reason: (value) => {
        return validateMandatoryProperty('reason', value);
      }
    }
  }

  get dateApprovedFormatted() {
    if (this.dateApproved && this.dateApproved.isValid) {
      return this.dateApproved.toLocaleString(DateTime.DATE_FULL);
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
var reviewConverter = {
  toFirestore: function (review) {
    const result = {};
    if (review.recommendationId != null) result.recommendationId = review.recommendationId;
    if (review.reviewedByUid != null) result.reviewedByUid = review.reviewedByUid;
    if (review.reviewedByName != null) result.reviewedByName = review.reviewedByName;
    if (review.resourceName != null) result.resourceName = review.resourceName;
    if (review.resourceId != null) result.resourceId = review.resourceId;
    if (review.reason != null) result.reason = review.reason;
    
    if (review.dateCreated != null && review.dateCreated.isValid) { 
      result.dateCreated = Timestamp.fromDate(review.dateCreated.toJSDate()); 
    } else {
      result.dateCreated = null;
    }
    if (review.dateApproved != null && review.dateApproved.isValid) { 
      result.dateApproved = Timestamp.fromDate(review.dateApproved.toJSDate()); 
    } else {
      result.dateApproved = null;
    }
    if (review.approved != null) result.approved = review.approved;
    
    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);

    const config = {
      id: snapshot.id,
      recommendationId: data.recommendationId,
      reviewedByUid: data.reviewedByUid,
      reviewedByName: data.reviewedByName,
      reason: data.reason,
      resourceId: data.resourceId ?? null,
      resourceName: data.resourceName,
      dateCreated: data.dateCreated ? DateTime.fromJSDate(data.dateCreated.toDate()) : null,
      dateApproved: data.dateApproved ? DateTime.fromJSDate(data.dateApproved.toDate()) : null,
      approved: data.approved ?? false,
    }
    return new Review(config);
  }
};