import ResourcesView from './modules/resources/views/ResourcesView'
import LoginView from './modules/login/views/LoginView'
export default [
  {name: "home", path: '/', component:ResourcesView},
  {name: "login-view", path: '/login', component:LoginView}
]