<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo-section">
        <router-link to="/" class="logo-link">
          <h1 class="logo">GameZone</h1>
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="nav-section">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/products" class="nav-link" active-class="active">
              Products
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link" active-class="active">
              About
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" class="nav-link" active-class="active">
              Contact
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Actions (Cart, User) -->
      <div class="actions-section">
        <button class="cart-btn" @click="toggleCart">
          <svg class="cart-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
            <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
        </button>
        
        <button class="user-btn" @click="toggleUserMenu">
          <svg class="user-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import cartService from "../services/CartService.js";

// utilise getCartRef() pour récupérer le ref réactif
const cartCount = computed(() => {
  const cartRef = cartService.getCartRef();
  return cartRef.value.reduce((total, item) => total + item.quantity, 0);
});



</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.logo-section {
  flex: 1;
}

.logo-link {
  text-decoration: none;
}

.logo {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0;
}

/* Navigation */
.nav-section {
  flex: 2;
  display: flex;
  justify-content: center;
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 40px;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #3b82f6;
  background-color: #f1f5f9;
}

.nav-link.active {
  color: #3b82f6;
  background-color: #eff6ff;
  font-weight: 600;
}

/* Actions */
.actions-section {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.cart-btn, .user-btn {
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.cart-btn:hover, .user-btn:hover {
  background-color: #f1f5f9;
}

.cart-icon, .user-icon {
  color: #475569;
}

.cart-count {
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: 600;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .header-container {
    padding: 0 15px;
    height: 60px;
  }
  
  .logo {
    font-size: 24px;
  }
  
  .nav-list {
    gap: 20px;
  }
  
  .nav-link {
    font-size: 14px;
    padding: 6px 12px;
  }
}
</style>
