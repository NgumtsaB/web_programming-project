<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Level Up Your <span class="highlight">Experience</span></h1>
        <p class="hero-subtitle">Discover the latest releases and exclusive deals on the best titles.</p>
        <div class="hero-buttons">
          <button class="primary-btn" @click="router.push('/products')">Shop Now</button>
          <button class="secondary-btn" @click="router.push('/products')">View Offers</button>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="features-section">
      <div class="features-grid">
        <div class="feature-item">
          <div class="feature-icon">🚀</div>
          <h3>Instant Delivery</h3>
          <p>Get your digital keys immediately after purchase.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🛡️</div>
          <h3>Secure Payment</h3>
          <p>100% secure transactions with top payment providers.</p>
        </div>
        <div class="feature-item">
          <div class="feature-icon">💬</div>
          <h3>24/7 Support</h3>
          <p>Our team is here to help you anytime, anywhere.</p>
        </div>
      </div>
    </section>

    <!-- New Arrivals -->
    <section class="section-container">
      <div class="section-header">
        <h2>New Arrivals</h2>
        <a href="/products" class="view-all">View All &rarr;</a>
      </div>
      <div class="games-grid">
        <GameCard 
          v-for="game in newArrivals" 
          :key="game.id"
          :id="game.id"
          :name="game.name"
          :genre="game.genre"
          :price="game.price"
          :image="game.image"
          @add-to-cart="addToCart"
        />
      </div>
    </section>

    <!-- Promotions Section -->
    <section class="promo-section">
      <div class="promo-banner">
        <div class="promo-text">
          <h2>Winter Sale is Live!</h2>
          <p>Up to 50% off on top RPGs and Action games.</p>
        </div>
        <button class="promo-btn" @click="router.push('/products')">Browse Sale</button>
      </div>
    </section>

    <!-- Trending Games -->
    <section class="section-container">
      <div class="section-header">
        <h2>Trending Now</h2>
        <a href="/products" class="view-all">View All &rarr;</a>
      </div>
      <div class="games-grid">
        <GameCard 
          v-for="game in games" 
          :key="game.id"
          :id="game.id"
          :name="game.name"
          :genre="game.genre"
          :price="game.price"
          :image="game.image"
          @add-to-cart="addToCart"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import GameCard from '../components/GameCard.vue';
import api from '../services/api.js';

const router = useRouter();
const games = ref([]);
const newArrivals = ref([]);
const categories = ref([]);

const fetchGames = async () => {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      api.get('/products'),
      api.get('/categories')
    ]);
    
    categories.value = categoriesRes.data;
    const categoryMap = new Map(categories.value.map(c => [c.id, c.name]));

    const allGames = productsRes.data.map(product => ({
      id: product.id,
      name: product.title,
      genre: categoryMap.get(product.category_id) || 'Unknown',
      price: product.price,
      image: Array.isArray(product.images) && product.images.length > 0 
        ? product.images[0] 
        : (typeof product.images === 'string' ? product.images : 'https://via.placeholder.com/300x200'),
      description: product.description,
      stock: product.stock
    }));

    games.value = allGames.slice(0, 4);
    newArrivals.value = allGames.slice(0, 4).reverse(); // Just simulation for now
  } catch (error) {
    console.error("Failed to fetch games:", error);
  }
};

const addToCart = (id) => {
  console.log('Added to cart:', id);
};

onMounted(() => {
  fetchGames();
});
</script>

<style scoped>
.home-page {
  padding-bottom: 80px;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 60vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* Light theme hero background */
  background: linear-gradient(135deg, #eff6ff 0%, #f1f5f9 100%);
  margin-bottom: 60px;
  border-bottom: 1px solid #e2e8f0;
}

.hero-content {
  z-index: 2;
  max-width: 800px;
  padding: 20px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.1;
  letter-spacing: -1px;
  color: #1e293b;
}

.hero-title .highlight {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 32px;
  font-weight: 400;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.primary-btn {
  background: #3b82f6;
  color: white;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  background: #2563eb;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.secondary-btn {
  background: white;
  color: #3b82f6;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border: 2px solid #3b82f6;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: #eff6ff;
  transform: translateY(-2px);
}

/* Features Section */
.features-section {
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 0 20px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  text-align: center;
}

.feature-item {
  padding: 20px;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.feature-item h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.feature-item p {
  color: #64748b;
  line-height: 1.5;
}

/* Promotions Section */
.promo-section {
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 0 20px;
}

.promo-banner {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  padding: 40px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
}

.promo-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

.promo-text h2 {
  font-size: 2rem;
  margin: 0 0 8px;
  color: white;
}

.promo-text p {
  font-size: 1.2rem;
  color: #ddd6fe;
  margin: 0;
}

.promo-btn {
  background: white;
  color: #4f46e5;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  z-index: 10;
  transition: transform 0.2s;
}

.promo-btn:hover {
  transform: scale(1.05);
}

/* Featured Games Section */
.section-container {
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 0 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 2rem;
  color: #1e293b;
  margin: 0;
  font-weight: 700;
}

.view-all {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.view-all:hover {
  color: #2563eb;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .promo-banner {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
}
</style>
