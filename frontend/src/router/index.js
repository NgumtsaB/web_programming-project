import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Home from '../views/Home.vue'
import Product from '../views/Product.vue'  
import Products from '../views/Products.vue'  

import dashboard from '../views/adminDashboard.vue'

const routes = [
  {
    path: '/',
    component: Home  // "/" reste Home, visible même sans token
  },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/products', component: Products },
  { path: '/product', component: Product ,meta: { hideSidebar: true }},

 
   {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Middleware : protéger certaines routes sauf "/"
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // Protection pour toutes les pages sauf login, register et "/"
  if (!token && to.path !== '/login' && to.path !== '/register' && to.path !== '/' && to.path !== '/dashboard' && to.path !== '/products' && to.path !== '/product') {
    return next('/login')
  }

  // Empêche un utilisateur connecté d'aller sur login/register
  if (token && (to.path === '/login' || to.path === '/register')) {
    return next('/')
  }

  next()
})

export default router
