import { Timestamp } from "firebase/firestore";
const { DateTime } = require("luxon");

export { Resource, resourceConverter };

class Resource {
  constructor(config) {
    this.id = config.id;
    this.displayName = config.displayName;
    this.resourceUrl = config.resourceUrl;
    this.description = config.description;
    this.publishedDate = config.publishedDate;
    this.imageUrl = config.imageUrl;
    this.authors = config.authors;
    this.resourceType = config.resourceType;
    this.tags = config.tags;
    this.parentResourceId = config.parentResourceId;
    this.parentResourceName = config.parentResourceName;
    this.relatedResources = config.relatedResources;
    this.source = config.source;
  }

  static default() {
    // returns a default instance where all the fields, and their child properties are available.
    return new Resource({ authors: [], tags: [] });
  }
}

/**
 * FirestoreDataConverter implementation for User instances
 */
var resourceConverter = {
  toFirestore: function (resource) {
    const result = {};
    // if (resource.id != null) { result.id = resource.id }
    if (resource.description != null) { result.description = resource.description }
    if (resource.resourceType != null) { result.resourceType = resource.resourceType }
    if (resource.resourceUrl != null) { result.resourceUrl = resource.resourceUrl }
    if (resource.displayName != null) { result.displayName = resource.displayName }
    if (resource.publishedDate != null) { result.publishedDate = Timestamp.fromDate(resource.publishedDate.toJSDate()); }
    if (resource.authors != null) { result.authors = resource.authors.map( a => a.trim()) }
    if (resource.imageUrl != null) { result.imageUrl = resource.imageUrl }
    if (resource.tags != null) { result.tags = resource.tags }
    if (resource.parentResourceId != null) { result.parentResourceId = resource.parentResourceId }
    if (resource.parentResourceName != null) { result.parentResourceName = resource.parentResourceName }
    if (resource.relatedResources != null) { result.relatedResources = resource.relatedResources }
    if (resource.source != null) { result.source = resource.source }
    return result;
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);

    const config = {
      id: snapshot.id,
      displayName: data.displayName,
      resourceUrl: data.resourceUrl,
      description: data.description,
      publishedDate: data.publishedDate ? DateTime.fromJSDate(data.publishedDate.toDate()) : null,
      imageUrl: data.imageUrl,
      authors: data.authors,
      resourceType: data.resourceType,
      tags: data.tags ?? [],
      parentResourceId: data.parentResourceId,
      parentResourceName: data.parentResourceName,
      relatedResources: data.relatedResources,
      source: data.source,
    }

    return new Resource(config);
  }
};
