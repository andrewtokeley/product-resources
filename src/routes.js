import Search from './modules/resources/views/ResourcesSearch'
import Login from './modules/login/views/LoginView'
export default [
  {path: '/', component:Search},
  {path: '/:category', component:Search},
  {path: '/:category/:searchTerm', component:Search},
  {path: '/login', component:Login}
]