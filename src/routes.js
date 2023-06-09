import Login from './modules/login/views/LoginView'
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
import UserReviews from '@/modules/users/views/UserReviews';

export default [
  {path: '/login', component:Login, meta: { hideHeader: false, analytics_title: 'Login' } },
  
  // home page
  {path: '/', component:Home, meta: { clearSearch: true, analytics_title: 'Home' }},
  
  // profile page
  {name: 'user-profile', path: '/profile', component:UserProfile, meta: { requiresAuth: true, analytics_title: 'User Profile'}},

  {name: 'user-review', path: '/user/:userUid', component:UserReviews, analytics_title: 'User Review' },

  // search across all resources
  {name: 'search', path: '/search/:searchTerm', component:Search, meta: { analytics_title: 'Search Keyword' }},
  
  // show all resources in a category
  {name: 'search-tag', path: '/tag/:tagId', component:Search, meta: { clearSearch: true, analytics_title: 'Search Tag' }},
  
  // show all resources of a type 
  {path: '/type/:typeId', component:ResourceTypes, meta: { analytics_title: 'Resource Type'}},
  {path: '/type/:typeId/:tagId', component:ResourceTypes, meta: { analytics_title: 'Resource Type' }},

  {path: '/recommend', component: RecommendationView, meta: { requiresAuth: true, meta: { analytics_title: 'Recommend'} }},
  {path: '/recommend/:typeId', component: RecommendationView, meta: { requiresAuth: true, analytics_title: 'Recommend' }},
  {path: '/recommend/confirm', component: RecommendationConfirmation, meta: {  analytics_title: 'Recommend'}},

  {path: '/review/:resourceId', component: RecommendationView, meta: { requiresAuth: true, analytics_title: 'Review' }},
  
  {path: '/about', component:About, meta: { analytics_title: 'About'} },
  {path: '/terms', component:TermsOfService, meta: { analytics_title: 'Terms'} },
  {path: '/privacy', component:PrivacyView, meta: { analytics_title: 'Privacy'} },

  {path: '/admin/resources/', component:ManageResources, meta: { requiresAuth: true, requiresAdmin: true, analytics_title: 'Admin Resources' } },

  {path: '/admin/reviews', component:ManageReviews, meta: { requiresAuth: true, requiresAdmin: true, analytics_title: 'Admin Reviews' } },

  {path: '/admin/tags', component:ManageLookups, meta: { requiresAuth: true, requiresAdmin: true, analytics_title: 'Admin Lookups'} },

]