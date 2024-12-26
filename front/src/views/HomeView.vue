<template>
  <div class="home-container">
    <div class="image-container">
      <h1 class="title">Bulls and Cows</h1>
      <img src="@/assets/cow.jpeg" alt="Bulls and Cows" class="img-fluid rounded shadow-sm" />
    </div>
    <div class="login-button-container">
      <RouterLink to="/login" class="btn btn-primary btn-lg">Login</RouterLink>
    </div>
    <div class="github-button-container">
      <a href="https://github.com/keni2002/bulls_and_cows" target="_blank" class="btn btn-outline-dark btn-sm">
        <i class="bi bi-github" style="font-size: 1.5rem;"></i>
        Contribute to the project
      </a>
    </div>
    <footer class="footer mt-auto py-3 bg-light">
      <div class="container">
        <p class="mb-0">&copy; 2016-{{ currentYear }} Yerbis Universes, Inc. Todos los derechos reservados</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  padding: 20px;
}

.github-button-container {
  margin-bottom: 10px;
  text-align: center;
}

.title {
  font-size: 2rem;
  margin-bottom: 20px;
}

.image-container {
  margin-bottom: 20px;
}

.login-button-container {
  margin-bottom: 20px;
}

.footer {
  padding: 10px;
  background-color: #f8f9fa;
  border-top: 1px solid #e7e7e7;
  text-align: center;
}
</style>
