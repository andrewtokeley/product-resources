import { app } from "./firebaseInit";
import { getAnalytics, logEvent } from "firebase/analytics";

export { logSearchEvent, logResourceSelect, logPageViewFromRouteLocation }

const analytics = getAnalytics(app);
const logAppEvent = function(eventName, eventParameters) {
  logEvent(analytics, eventName, eventParameters);
}

/**
 * 
 * @param {*} searchTerm keyword being search for
 * @param {*} scope scope of the seach, valid options include, 'global',
 * @param {*} returnedResults 'true' if the search returned results, otherwise 'false'
 */
const logSearchEvent = function(searchTerm, scope, returnedResults) {
  logAppEvent('search', { 
    search_term: searchTerm, 
    search_scope: scope,
    search_results: returnedResults
  });
}

const logResourceSelect = function(resource) {
  logAppEvent('select_item', {
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
  logAppEvent('page_view', {
    page_location: routeLocation.fullPath,
    page_path: routeLocation.path,
    page_title: routeLocation.meta.page_title,
  });
}
