
<script setup>
import { useRouter } from 'vue-router'
import { AuthService } from '../services/authService.js'

const router = useRouter()
</script>
<template>
  <div class="home-page">
    <!-- Header -->
    <header class="header">
      <h1 class="logo">GameZone</h1>
      <nav>
        <ul class="nav-links">
          <li><a href="#">Accueil</a></li>
          <li><a href="#">Jeux</a></li>
          <li><a href="#">News</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>
    </header>

    <!-- Hero / Featured Game -->
    <section class="hero">
      <h2>Jeu en vedette : CyberQuest</h2>
      <p>Plonge dans un monde futuriste plein d’aventures et de mystères.</p>
      <button>Jouer Maintenant</button>
    </section>

    <!-- Latest Games -->
    <section class="latest-games">
      <h2>Dernières sorties</h2>
      <div class="games-grid">
        <div v-for="game in games" :key="game.id" class="game-card">
          <img :src="game.image" :alt="game.name" />
          <h3>{{ game.name }}</h3>
          <p>{{ game.genre }}</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2025 GameZone. Tous droits réservés.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      games: [
        { id: 1, name: "CyberQuest", genre: "Action/Aventure", image: "https://via.placeholder.com/150" },
        { id: 2, name: "Mystic World", genre: "RPG", image: "https://via.placeholder.com/150" },
        { id: 3, name: "Speed Racer", genre: "Course", image: "https://via.placeholder.com/150" },
      ],
    };
  },
};
</script>

<style scoped>
.home-page {
  font-family: Arial, sans-serif;
  color: #fff;
  background-color: #121212;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #1f1f1f;
}

.logo {
  font-size: 1.8rem;
  color: #ff3e00;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background-color: #222;
}

.hero button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #ff3e00;
  border: none;
  color: #fff;
  cursor: pointer;
}

.latest-games {
  padding: 40px 20px;
}

.games-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.game-card {
  background-color: #1f1f1f;
  padding: 20px;
  border-radius: 10px;
  width: 200px;
  text-align: center;
}

.game-card img {
  width: 100%;
  border-radius: 5px;
}

.footer {
  text-align: center;
  padding: 20px;
  background-color: #1f1f1f;
}
</style>
