<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '../services/authService.js'

const email = ref('')
const password = ref('')
const message = ref(null)
const type = ref(null)

const router = useRouter()

async function login() {
  try {
    const res = await AuthService.login({
      email: email.value,
      password: password.value
    })

    // stocker le token
    localStorage.setItem('token', res.data.token)
    type.value = 'success'
    message.value = 'Connexion réussie !'

    // redirection vers /home
    setTimeout(() => {
      router.push('/home')
    }, 1000)
  } catch (error) {
    type.value = 'error'
    message.value = error.response?.data?.message || 'Erreur lors de la connexion.'
  }
}
</script>

<template>
  <div class="login-page">
    <h2>Connexion</h2>

    <p v-if="message" :style="{ color: type === 'error' ? 'red' : 'green' }">
      {{ message }}
    </p>

    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />

      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: #1f1f1f;
  color: #fff;
  border-radius: 10px;
  text-align: center;
}
input {
  display: block;
  width: 90%;
  margin: 10px auto;
  padding: 10px;
  border-radius: 5px;
  border: none;
}
button {
  padding: 10px 20px;
  background-color: #42b883;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
}
button:hover {
  background-color: #369c6f;
}
</style>
