<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Catalogue</h1>

    <!-- FILTRES -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

      <!-- Filtre catégorie -->
      <div>
        <label class="block font-semibold mb-2">Catégorie</label>
        <select v-model="filters.category" @change="fetchProducts"
                class="w-full border rounded p-2">
          <option value="">Toutes les catégories</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <!-- Prix min -->
      <div>
        <label class="block font-semibold mb-2">Prix min</label>
        <input type="number" v-model="filters.minPrice" @input="updateFilters"
               class="w-full border rounded p-2" placeholder="0">
      </div>

      <!-- Prix max -->
      <div>
        <label class="block font-semibold mb-2">Prix max</label>
        <input type="number" v-model="filters.maxPrice" @input="updateFilters"
               class="w-full border rounded p-2" placeholder="200">
      </div>
    </div>

    <!-- AFFICHAGE PRODUITS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="product in filteredProducts" :key="product.id"
           class="border rounded-lg shadow hover:shadow-lg transition p-4">

        <img :src="product.images[0] "
             class="w-full h-40 object-cover rounded mb-3"/>

        <h2 class="text-lg font-bold">{{ product.title }}</h2>
        <p class="text-sm text-gray-600 mb-2">{{ product.description }}</p>
        <p class="text-xl font-semibold text-blue-600">{{ product.price }} €</p>
        <Product_Modal v-bind:revele="revele" v-bind:toggleModale="toggleModale"></Product_Modal>
        <button class="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" v-on:click="toggleModale">
          Voir détail
        </button>
       

      </div>
    </div>
  </div>
</template>
<style>
   
</style>

<script setup>
import { ref, computed, onMounted } from "vue";
import Product_Modal from "../components/Product_Modal.vue";
import ProductService from "../services/services/ProductService.js";

const revele = ref(false);
const toggleModale = () => {
  revele.value = !revele.value;
};

const categories = ref([]);
const products = ref([]);

const filters = ref({
  category: "",
  minPrice: 0,
  maxPrice: 999999
});

onMounted(async () => {
  categories.value = await ProductService.getCategories();
  products.value = await ProductService.getProducts();
});

const filteredProducts = computed(() => {
  return ProductService.filtre(products.value, filters.value);
});

function updateFilters() {
  // rien à faire, le computed se met à jour automatiquement
}
</script>


<style>
/* Optionnel : styles supplémentaires */
</style>
