import { Timestamp } from "firebase/firestore";
const { DateTime } = require("luxon");
import { isObjectValid, validateObject, validateProperty, validateUrl } from "@/core/model/validation";
import Result from "@/core/model/Result";

export { Resource, resourceConverter };

class Resource {
  constructor(config) {
    this.id = config.id;
    this.displayName = config.displayName;
    this.resourceUrl = config.resourceUrl;
    this.description = config.description;
    this.createdDate = config.createdDate;
    this.publishedDate = config.publishedDate;
    this.audioLengthInSeconds = config.audioLengthInSeconds;
    this.imageUrl = config.imageUrl;
    this.authors = config.authors;
    this.resourceType = config.resourceType;
    this.tags = config.tags;
    this.parentResourceId = config.parentResourceId;
    this.parentResourceName = config.parentResourceName;
    this.parentResourceImageUrl = config.parentResourceImageUrl;
    this.relatedResources = config.relatedResources;
    this.source = config.source;
    this.approved = config.approved;
  }

  static default(type) {
    // returns a default instance where all the fields, and their child properties are available.
    if (!type) { type = 'books'}
    return new Resource({ 
      id: null,
      approved: false,
      displayName: 'New Resource', 
      resourceType: type,
      createdDate: DateTime.now(),
      authors: [], 
      tags: [] });
      
  }

  get statusDescription() {
    if (this.approved && this.isValid) {
     return "Approved";
    } else if (this.approved && !this.isValid) {
      return "Approved (invalid)";
    } else if (!this.approved && this.isValid) {
      return "Pending";
    } else if (!this.approved && !this.isValid) {
      return "Incomplete";
    } else {
      return "Unknown";
    }
  }

  get publishedDateFormatted() {
    if (this.publishedDate && this.publishedDate.isValid) {
      return this.publishedDate.toLocaleString(DateTime.DATE_FULL);
    }
    return null;
  }

  get pubishedDataAndLengthFormatted() {
    if (this.publishedDate && this.publishedDate.isValid) {
      var formatted = this.publishedDate.toLocaleString(DateTime.DATE_MED);
      if (this.audioLengthInSeconds) {
        formatted += this.audioLengthInSeconds   + "s";
      }
    }
    return formatted;
  }

  get authorsList() {
    return this.authors.join(', ');
  }

  get actionText() {
    switch (this.resourceType) {
      case 'books': return "Buy..."
      case 'podcasts': return "Listen..."
      case 'episodes': return "Listen..."
      default: return "Read..."
    }
  }

  get schema() {
    return {
      // Unless you're a child, you must have an image
      imageUrl: (value) => {
        if (this.parentResourceId == null) {
          if (!value || value?.length == 0) { 
            return Result.failure("Must enter an image url.");
          } else {
            return validateUrl(value);        
          }
        }
        return Result.success();
      },
      // Mandatory
      resourceUrl: (value) => {
        if (!value || value?.length == 0) { return Result.failure("Must enter resource url.");}
        return validateUrl(value);        
      },
      // Mandatory
      displayName: (value) => {
        if (!value || value?.length == 0) { return Result.failure("Must enter display name");}
        return Result.success();
      },
      // Mandatory
      description: (value) => {
        if (!value || value?.length == 0) { return Result.failure("Must enter a description");}
        return Result.success();
      },
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
var resourceConverter = {
  toFirestore: function (resource) {
    const result = {};
    
    if (resource.description != null) { result.description = resource.description }
    if (resource.approved != null) { result.approved = resource.approved }
    if (resource.resourceType != null) { result.resourceType = resource.resourceType }
    if (resource.resourceUrl != null) { result.resourceUrl = resource.resourceUrl }
    if (resource.displayName != null) { result.displayName = resource.displayName }
    if (resource.createDate != null && resource.createDate.isValid) { 
      result.createdDate = Timestamp.fromDate(resource.createdDate.toJSDate()); 
    } else {
      result.createdDate = null;
    }
    if (resource.publishedDate != null && resource.publishedDate.isValid) { 
      result.publishedDate = Timestamp.fromDate(resource.publishedDate.toJSDate()); 
    } else {
      result.publishedDate = null;
    }
    if (resource.audioLengthInSeconds != null) { result.audioLengthInSeconds = resource.audioLengthInSeconds }
    if (resource.authors != null) { result.authors = resource.authors.map( a => a.trim()) }
    if (resource.imageUrl != null) { result.imageUrl = resource.imageUrl }
    if (resource.tags != null) { result.tags = resource.tags }

    if (resource.parentResourceId != null) { result.parentResourceId = resource.parentResourceId }
    if (resource.parentResourceName != null) { result.parentResourceName = resource.parentResourceName }
    if (resource.parentResourceImageUrl != null) { result.parentResourceImageUrl = resource.parentResourceImageUrl }
    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);

    // tags: convert from the old { key:value} array to just array of string (key).
    if (data.tags && data.tags.length > 0) {
      if (data.tags[0].key) {
        data.tags = data.tags.map ( t => t.key )    
      }
    }
    
    // resourceType: convert from the old { key:value} object to just string (key)
    if (data.resourceType && data.resourceType.key) {
      data.resourceType = data.resourceType.key;
    }

    const config = {
      id: snapshot.id,
      displayName: data.displayName,
      resourceUrl: data.resourceUrl,
      description: data.description,
      publishedDate: data.publishedDate ? DateTime.fromJSDate(data.publishedDate.toDate()) : null,
      audioLengthInSeconds: data.audioLengthInSeconds,
      imageUrl: data.imageUrl,
      createdDate: data.createdDate ? DateTime.fromJSDate(data.createdDate.toDate()) : null,
      authors: data.authors,
      resourceType: data.resourceType,
      tags: data.tags ?? [],
      parentResourceId: data.parentResourceId,
      parentResourceName: data.parentResourceName,
      parentResourceImageUrl: data.parentResourceImageUrl,
      approved: data.approved ?? false,
    }
    return new Resource(config);
  }
};
