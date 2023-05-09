import Login from './modules/login/views/LoginView'
import Search from './modules/search/views/SearchResults'
import ResourceTypes from './modules/resources/views/ResourceTypes'
import UpdateResource from './modules/resources/views/UpdateResource'
import ManageResources from './modules/admin/views/ManageResources'
import ManageRecommendations from './modules/admin/views/ManageRecommendations'
import Approve from './modules/recommendations/views/ApproveRecommendations'
import About from './modules/about/views/AboutView'
import Home from './modules/home/views/ResourcesHome'

export default [
  {path: '/login', component:Login, meta: { hideHeader: true }},
  
  // home page
  {path: '/', component:Home, meta: { clearSearch: true }},
  
  // search across all resources
  {path: '/search/:searchTerm', component:Search},
  
  // show all resources in a category
  {path: '/tag/:tagId', component:Search, meta: { clearSearch: true }},
  
  // show all resources of a type 
  {path: '/type/:typeId/', component:ResourceTypes},

  // approve recommendations
  {path: '/approve', component:Approve},
  
  {path: '/about', component:About},
  
  {path: '/admin/resources', component:ManageResources },

  {path: '/admin/recommendations', component:ManageRecommendations },

  {path: '/update/:id', component:UpdateResource},
  {path: '/add', component:UpdateResource},
]