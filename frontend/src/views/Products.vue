<template>
  <div class="main-container">
    <!-- Header removed (global in App.vue) -->
  <div class="page-container">
    <!-- Products grid - DOIT ÊTRE AVANT la sidebar pour le flux naturel -->
    <div class="products-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="product-card"
      >
        <img 
          :src="product.images[0]" 
          alt="product image" 
          class="product-image"
        />
        <div class="product-info">
          <p class="product-description">{{ product.title }}</p>
          <p class="product-price">${{ product.price.toFixed(2) }}</p>
        </div>
        <div class="product-actions">
          <button 
            class="view-cart-btn" 
            @click="openModal(product.id)"
          >
            View Details
          </button>
          <button 
            class="add-cart-btn" 
            @click.stop="addToCart(product)"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>

    <!-- Filters sidebar - DOIT ÊTRE APRÈS pour le positionnement fixed -->
    <div class="filters-sidebar">
      <h1 class="filter-title">Filter</h1>
      <div class="filter-section">
        <label class="filter-label">Categories</label>
        <select class="filter-select" v-model="filters.category" @change="fetchProducts">
          <option value="">All categories</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>
      <div class="filter-section">
        <label class="filter-label">Rating</label>
        <select class="filter-select" v-model="filters.sortOrder" @change="updateFilters">
          <option value="">Select</option>
          <option value="desc">Highest</option>
          <option value="asc">Lowest</option>
        </select>
      </div>
      <div class="filter-section">
        <label class="filter-label">Price range</label>
        <div class="price-inputs">
          <div class="price-input-group">
            <span class="price-prefix">Min</span>
            <input type="number" 
                   class="price-input" 
                   placeholder="0" v-model="filters.minPrice" @input="updateFilters">
          </div>
          <div class="price-separator">-</div>
          <div class="price-input-group">
            <span class="price-prefix">Max</span>
            <input type="number" 
                   class="price-input" 
                   placeholder="200" v-model="filters.maxPrice" @input="updateFilters">
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Product_Modal 
      v-if="selectedProduct"
      :revele="modalVisible"
      :product="selectedProduct"
      @close="closeModal"
    />   
  </div>
</div>
</template>



<style>
.main-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}    
.filters-sidebar {
  width: 25%; 
  padding: 30px 25px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  border-left: 1px solid #e2e8f0;
  position: fixed;
  right: 0;
  top: 80px;
  height: calc(100vh - 70px);
  overflow-y: auto;
  box-shadow: -2px 0 20px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.filter-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  color: #1e293b;
  position: relative;
  padding-bottom: 15px;
}

.filter-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

.filter-section {
  margin-bottom: 28px;
}

.filter-label {
  display: block;
  font-weight: 600;
  margin-bottom: 12px;
  color: #475569;
  font-size: 15px;
  letter-spacing: 0.3px;
}

.filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background-color: white;
  font-size: 15px;
  color: #334155;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-select:hover {
  border-color: #94a3b8;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.price-input-group {
  flex: 1;
  position: relative;
}

.price-prefix {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.price-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background-color: white;
  font-size: 15px;
  color: #334155;
  transition: all 0.3s ease;
}

.price-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.price-input:hover {
  border-color: #94a3b8;
}

.price-separator {
  color: #94a3b8;
  font-weight: 600;
  font-size: 18px;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.filters-sidebar::-webkit-scrollbar {
  width: 6px;
}

.filters-sidebar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.filters-sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.filters-sidebar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.page-container {
  display: flex;
    margin-top: 0;
}

.products-grid {
  
  flex: 1;
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-right: 30%;
  box-sizing: border-box;
  margin-top: 20px;
}


.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
  flex-grow: 1;
}

.product-description {
  font-size: 15px;
  color: #334155;
  margin-bottom: 10px;
  min-height: 40px;
}

.product-price {
  font-weight: 700;
  color: #8b5cf6;
  font-size: 16px;
}

.add-cart-btn {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 10px;
  width: 50%;
  font-weight: 600;
  border-top: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background 0.2s;
}
.view-cart-btn{
  background: white;
  color: #8b5cf6;
  border: none;
  padding: 10px;
  width: 50%;
  font-weight: 600;
  border-top: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background 0.2s;
}




</style>

<script setup>
import { ref, computed, onMounted } from "vue";
import Product_Modal from "../components/Product_Modal.vue";
import ProductService from "../services/services/ProductService.js";
// import Header from "../components/Header.vue"; // Global now
import cartService from "../services/CartService.js";
import axios from "axios";

function addToCart(product) {
  cartService.addToCart(product); // Met à jour localStorage ET notifie les listeners
  console.log("Cart updated:", cartService.getCart());
}







const modalVisible = ref(false);
const selectedProduct = ref(null);
const revele = ref(false);
const toggleModale = () => {
  revele.value = !revele.value;
};
const categories = ref([]);
const products = ref([]);

async function openModal(productId) {
  try {
    const product = await axios.get(`http://localhost:3000/products/${productId}`);
    selectedProduct.value = product.data;
    modalVisible.value = true;
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error("Erreur lors du chargement du produit :", error);
  }
}


function closeModal() {
  modalVisible.value = false;
  selectedProduct.value = null;
  document.body.style.overflow = 'auto';
}
const filters = ref({
  category: "",
  minPrice: 0,
  maxPrice: 999999,
  sortOrder: ""
});

onMounted(async () => {
  categories.value = await ProductService.getCategories();
  products.value = await ProductService.getProducts();
});

const filteredProducts = computed(() => {
  let result =  ProductService.filtre(products.value, filters.value);
  if (filters.value.sortOrder === "asc") {
    result = result.sort((a, b) => a.price - b.price);
  } else if (filters.value.sortOrder === "desc") {
    result = result.sort((a, b) => b.price - a.price);
  }

  return result;
});

function updateFilters() {
  
}

</script>