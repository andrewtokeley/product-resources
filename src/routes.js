import Login from './modules/login/views/LoginView'
import Search from './modules/search/views/SearchResults'
import ResourceTypes from './modules/resources/views/ResourceTypes'
import ManageResources from './modules/admin/views/ManageResources'
import ManageLookups from './modules/admin/views/ManageLookups'
import ManageReviews from './modules/admin/views/ManageReviews'
import Approve from './modules/recommendations/views/ApproveRecommendations'
import About from './modules/about/views/AboutView'
import Home from './modules/home/views/ResourcesHome'
import UserProfile from './modules/users/views/UserProfile'
import RecommendationView from './modules/recommendations/views/RecommendationView'

export default [
  {path: '/login', component:Login, meta: { hideHeader: false }},
  
  // home page
  {path: '/', component:Home, meta: { clearSearch: true }},
  
  // profile page
  {path: '/profile', component:UserProfile, meta: { requiresAuth: true }},
  
  // search across all resources
  {path: '/search/:searchTerm', component:Search},
  
  // show all resources in a category
  {path: '/tag/:tagId', component:Search, meta: { clearSearch: true }},
  
  // show all resources of a type 
  {path: '/type/:typeId', component:ResourceTypes},

  // recommend something
  {path: '/recommend', component: RecommendationView, meta: { requiresAuth: true }},
  // recommend a resource of a given type
  {path: '/recommend/:typeId', component: RecommendationView, meta: { requiresAuth: true }},
  
  {path: '/review/:resourceId', component: RecommendationView, meta: { requiresAuth: true }},

  // approve recommendations
  {path: '/approve', component:Approve},
  
  {path: '/about', component:About},
  
  {path: '/admin/resources', component:ManageResources, meta: { requiresAuth: true, requiresAdmin: true } },

  {path: '/admin/reviews', component:ManageReviews, meta: { requiresAuth: true, requiresAdmin: true } },

  {path: '/admin/tags', component:ManageLookups, meta: { requiresAuth: true } },

]