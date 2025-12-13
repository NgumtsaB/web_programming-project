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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>