import { app } from "./firebaseInit";
import { getAnalytics, logEvent } from "firebase/analytics";

const analytics = getAnalytics(app);

export { logResourceSelect, logPageViewFromRouteLocation }

// const logPageView = function(location, path, title) {

// }

const logResourceSelect = function(resource) {
  console.log('log resource');
  logEvent(analytics, 'select_item', {
    item_list_id: resource.resourceType,
    items: [
      {
        item_id: resource.id,
        item_name: resource.displayName,
      }
    ]
  });
}

const logPageViewFromRouteLocation = function(routeLocation) {
  console.log('page_location ' + routeLocation.fullPath);
  console.log('page_path ' + routeLocation.path);
  console.log('page_title ' + routeLocation.meta.analytics_title);
  logEvent(analytics, 'page_view', {
    page_location: routeLocation.fullPath,
    page_path: routeLocation.path,
    page_title: routeLocation.meta.analytics_title,
  });
}