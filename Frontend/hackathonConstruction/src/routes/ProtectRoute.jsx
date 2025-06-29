import Auth from "../pages/Auth.jsx"
import Main from "../pages/Main.jsx"

export const privateRoutes = [
  {path:'/main', component: Main, exact: true}
]

export const publicRoutes = [
    {path:'/auth', component: Auth, exact: true},
]