<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';

// Import CSS & JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const route = useRoute();
const showHeader = computed(() => {
  return !['/login', '/register'].includes(route.path);
});
</script>

<template>
  <div>
    <Header v-if="showHeader" />
    <main :class="{ 'main-content': showHeader }">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Global styles are now in style.css */

.main-content {
  padding-top: 80px; /* Offset for fixed header */
  min-height: 100vh;
}
</style>