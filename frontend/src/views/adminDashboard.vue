<script setup>
import SidebarAdmin from '../components/SidebarAdmin.vue'
</script>

<template>
  <div class="admin-layout">
    <SidebarAdmin />

    <div class="content">
      <router-view />
      <p>pa</p>
    </div>
  </div>
</template>


