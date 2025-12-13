<template>
  <div class="bloc-modale" v-if="revele">
    <div class="overlay" @click="close"></div>

    <div class="modale card">
      <div class="btn-modale btn btn-danger" @click="close">x</div>

      <!-- Affichage détaillé du produit -->
      <h1>{{ product.title }}</h1>
      <img 
        v-if="Array.isArray(product.images) && product.images.length" 
        :src="product.images[0]" 
        alt="product image" 
        style="width:100%; max-height:300px; object-fit:cover; margin-bottom:20px;"
      >
      <img 
        v-else-if="typeof product.images === 'string'" 
        :src="product.images" 
        alt="product image" 
        style="width:100%; max-height:300px; object-fit:cover; margin-bottom:20px;"
      >
      <div v-else style="height: 200px; background: #eee; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
        No Image Available
      </div>
      <p><strong>Price:</strong> ${{ product.price.toFixed(2) }}</p>
      <p><strong>Description:</strong> {{ product.description }}</p>
      <p><strong>Category ID:</strong> {{ product.category_id }}</p>
      <!-- Ajouter plus de champs si nécessaire -->

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  revele: Boolean,
  product: Object
})

const emit = defineEmits(["close"])

function close() {
  emit("close")
}
</script>


<style scoped>
.bloc-modale {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.modale {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  position: relative;
  z-index: 2;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

  .btn-modale {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
  z-index: 3;
}

</style>