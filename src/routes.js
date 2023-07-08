import Login from './modules/login/views/LoginView'
import Logout from './modules/login/views/LogoutView'
import Search from './modules/search/views/SearchResults'
import ResourceTypes from './modules/resources/views/ResourceTypes'
import ManageResources from './modules/admin/views/ManageResources'
import ManageLookups from './modules/admin/views/ManageLookups'
import ManageReviews from './modules/admin/views/ManageReviews'
import About from './modules/about/views/AboutView'
import Home from './modules/home/views/ResourcesHome'
import UserProfile from './modules/users/views/UserProfile'
import RecommendationView from './modules/recommendations/views/RecommendationView'
import RecommendationConfirmation from '@/modules/recommendations/views/RecommendationConfirmation';
import TermsOfService from '@/modules/about/views/TermsOfService';
import PrivacyView from '@/modules/about/views/PrivacyView';
import UserReviews from '@/modules/reviews/views/UserReviews';
import EmailTemplates from '@/modules/admin/views/EmailTemplates'

export default [
  {path: '/login', component:Login, meta: { hideHeader: false, page_title: 'Login' } },
  {path: '/logout', component:Logout, meta: { hideHeader: false, page_title: 'Logout' } },

  // home page
  {path: '/', component:Home, meta: { clearSearch: true, page_title: 'Home' }},
  
  // profile page
  {name: 'user-profile', path: '/profile', component:UserProfile, meta: { requiresAuth: true, page_title: 'Profile', hideNavigation: true}},

  {name: 'user-review', path: '/:usernameOrUid', component:UserReviews, meta: {page_title: 'Reviews', hideNavigation: false }},

  // search across all resources
  {name: 'search', path: '/search/:searchTerm', component:Search, meta: { page_title: 'Search' }},
  
  // show all resources in a category
  {name: 'search-tag', path: '/tag/:tagId', component:Search, meta: { clearSearch: true, page_title: 'By Tag' }},
  
  // show all resources of a type 
  {path: '/type/:typeId', component:ResourceTypes, meta: { page_title: 'By Type'}},
  {path: '/type/:typeId/:tagId', component:ResourceTypes, meta: { page_title: 'By Type' }},

  {path: '/recommend', component: RecommendationView, meta: { requiresAuth: true, page_title: 'New Recommendation', hideNavigation: false }},
  {path: '/recommend/:typeId', component: RecommendationView, meta: { requiresAuth: true, page_title: 'Recommendation', hideNavigation: false }},
  {path: '/recommend/confirm', component: RecommendationConfirmation, meta: {  page_title: 'Recommendation Confirmed', hideNavigation: false}},

  {path: '/review/:resourceId', component: RecommendationView, meta: { requiresAuth: true, page_title: 'Review', hideNavigation: false }},
  
  {path: '/about', component:About, meta: { page_title: 'About', hideNavigation: true} },
  {path: '/terms', component:TermsOfService, meta: { page_title: 'Terms', hideNavigation: true} },
  {path: '/privacy', component:PrivacyView, meta: { page_title: 'Privacy', hideNavigation: true} },

  {path: '/admin/resources/', component:ManageResources, meta: { requiresAuth: true, requiresAdmin: true, page_title: 'Admin Resources' } },

  {path: '/admin/reviews', component:ManageReviews, meta: { requiresAuth: true, requiresAdmin: true, page_title: 'Admin Reviews' } },

  {path: '/admin/lookups', component:ManageLookups, meta: { requiresAuth: true, requiresAdmin: true, page_title: 'Admin Lookups'} },
  
  {path: '/admin/email', component:EmailTemplates, meta: { requiresAuth: true, requiresAdmin: true, page_title: 'Admin Email'} },

]