import Login from './modules/login/views/LoginView'
import Search from './modules/resources/views/ResourcesSearch'
import UpdateResource from './modules/resources/views/UpdateResource'
import Home from './modules/resources/views/ResourcesHome'

export default [
  {path: '/login', component:Login, meta: { showHeader: false }},
  // home page
  {path: '/', component:Home, meta: { clearSearch: true }},
  // search across all resources
  {path: '/search/:searchTerm', component:Search},
  // show all resources in a category
  {path: '/:category', component:Search, meta: { clearSearch: true }},
  // search resources in a category
  {path: '/:category/:searchTerm', component:Search},

  {path: '/update/:id', component:UpdateResource},
  {path: '/add', component:UpdateResource},
]