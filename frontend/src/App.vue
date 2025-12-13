<script>
import Sidebar from './components/Sidebar/Sidebar.vue'
import { sidebarWidth } from './components/state'
// Import CSS & JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
export default {
  components: { Sidebar },
  setup() {
    return { sidebarWidth }
  }
}
</script>
<template>
  <div>
    <router-view />
  </div>

</template>

<style>
/* Global styles are now in style.css */
</style>