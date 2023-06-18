/**
 * Enum (of sorts) to define the keys used for collections and some application documents
 */
export default class FirestoreKeys {
  
  static ReviewsCollection = new FirestoreKeys("reviews")
  static ResourcesCollection = new FirestoreKeys("resources")
  static RecommendationsCollection = new FirestoreKeys("recommendations")
  static LookupsCollection = new FirestoreKeys("lookups")
  static UsersCollection = new FirestoreKeys("users")
  static UsersPrivateCollection = new FirestoreKeys("private")
  static UsernamesCollection = new FirestoreKeys("usernames")
  static UsersPrivateDocument = new FirestoreKeys("secure")
  constructor(key) {
    this.key = key;
  }
}
