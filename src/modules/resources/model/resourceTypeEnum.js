/**
 * Enum (of sorts) to define the keys used for collections and some application documents
 */
export default class ResourceTypeEnum {
  
  static Books = new ResourceTypeEnum("books", "Book")
  static Podcasts = new ResourceTypeEnum("podcasts", "Podcast")
  static PodcastEpisodes = new ResourceTypeEnum("episodes", "Episode")
  static Articles = new ResourceTypeEnum("posts", "Post")
  static Websites = new ResourceTypeEnum("websites", "Website")
  static Videos = new ResourceTypeEnum("videos", "Video")
  static People = new ResourceTypeEnum("people", "Person")

  static all() {
    return [
      ResourceTypeEnum.Books,
      ResourceTypeEnum.Podcasts,
      ResourceTypeEnum.PodcastEpisodes,
      ResourceTypeEnum.Articles,
      ResourceTypeEnum.Websites,
      ResourceTypeEnum.Videos,
      ResourceTypeEnum.People,
    ]
  }

  static fromKey(key) {
    return ResourceTypeEnum.all().find( r => r.key == key);
  }

  constructor(key, singular) {
    this.key = key;
    this.singular = singular;
  }
}
