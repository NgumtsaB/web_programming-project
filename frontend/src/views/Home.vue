<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Level Up Your <span class="highlight">Experience</span></h1>
        <p class="hero-subtitle">Discover the latest releases and exclusive deals on the best titles.</p>
        <div class="hero-buttons">
          <button class="primary-btn">Shop Now</button>
          <button class="secondary-btn">View Offers</button>
        </div>
      </div>
      <div class="hero-decoration"></div>
    </section>

    <!-- Promotions Section -->
    <section class="promo-section">
      <div class="promo-banner">
        <div class="promo-text">
          <h2>Winter Sale is Live!</h2>
          <p>Up to 50% off on top RPGs and Action games.</p>
        </div>
        <button class="promo-btn">Browse Sale</button>
      </div>
    </section>

    <!-- Featured Games -->
    <section class="section-container">
      <div class="section-header">
        <h2>Trending Now</h2>
        <a href="/products" class="view-all">View All Games &rarr;</a>
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
import { ref } from 'vue';
import GameCard from '../components/GameCard.vue';

const games = ref([
  { id: 1, name: "CyberQuest 2077", genre: "Action RPG", price: 59.99, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600" },
  { id: 2, name: "Mystic Legends", genre: "Adventure", price: 44.50, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=600" },
  { id: 3, name: "Turbo Racer X", genre: "Racing", price: 29.99, image: "https://images.unsplash.com/photo-1511882150382-421056ac8ba7?auto=format&fit=crop&q=80&w=600" },
  { id: 4, name: "Space Odyssey", genre: "Sci-Fi Sim", price: 39.99, image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=600" },
]);

const addToCart = (id) => {
  console.log('Added to cart:', id);
  // Ideally call a cart store/service here
};
</script>

<style scoped>
.home-page {
  /* Using a dark gradient background for the whole page if needed, OR relies on global dark mode */
  min-height: 100vh;
  padding-bottom: 60px;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 80vh; /* Premium tall hero */
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=1600') center/cover no-repeat;
  color: white;
  margin-bottom: 40px;
  border-bottom: 1px solid #333;
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
}

.hero-title .highlight {
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #e2e8f0;
  margin-bottom: 32px;
  font-weight: 300;
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
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}

.primary-btn:hover {
  transform: translateY(-2px);
  background: #2563eb;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
}

.secondary-btn {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  color: white;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

/* Promotions Section */
.promo-section {
  max-width: 1200px;
  margin: 0 auto 60px;
  padding: 0 20px;
}

.promo-banner {
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  padding: 40px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
}

.promo-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  pointer-events: none;
}

.promo-text h2 {
  font-size: 2rem;
  margin: 0 0 8px;
  color: white;
}

.promo-text p {
  font-size: 1.2rem;
  color: #a5b4fc;
  margin: 0;
}

.promo-btn {
  background: white;
  color: #312e81;
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
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 2rem;
  color: white; /* ensuring visibility */
  margin: 0;
}

.view-all {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.view-all:hover {
  color: #60a5fa;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
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
