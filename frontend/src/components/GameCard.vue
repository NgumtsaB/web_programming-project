<template>
  <div class="game-card">
    <div class="image-container">
      <img :src="image" :alt="name" class="game-image" />
      <div class="overlay">
        <button class="view-btn">Details</button>
      </div>
    </div>
    <div class="card-content">
      <div class="tag">{{ genre }}</div>
      <h3 class="game-title">{{ name }}</h3>
      <div class="price-row">
        <span class="price">{{ formattedPrice }}</span>
        <button class="add-cart-btn" @click="$emit('add-to-cart', id)">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: Number,
  name: String,
  genre: String,
  price: Number,
  image: String
});

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(props.price);
});

defineEmits(['add-to-cart']);
</script>

<style scoped>
.game-card {
  background: white; /* Light card background */
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e2e8f0; /* Light border */
  display: flex;
  flex-direction: column;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 0 15px rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
}

.image-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
  background-color: #f1f5f9; /* Placeholder bg */
}

.game-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.game-card:hover .game-image {
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover .overlay {
  opacity: 1;
}

.view-btn {
  background: white;
  color: #1a1a1a;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transform: translateY(10px);
  transition: transform 0.3s ease, background 0.2s;
}

.view-btn:hover {
  background: #f0f0f0;
}

.game-card:hover .view-btn {
  transform: translateY(0);
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
}

.tag {
  font-size: 0.75rem;
  color: #64748b; /* Muted text */
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.game-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b; /* Dark text */
  margin: 0;
  line-height: 1.3;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 8px;
}

.price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #3b82f6; /* Blue accent */
}

.add-cart-btn {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s;
}

.add-cart-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}
</style>
