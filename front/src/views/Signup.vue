<template>
  <div class="signup">
    <h2 class="text-center">Signup</h2>
    <form @submit.prevent="signup">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" v-model="username" required />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" v-model="email" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" v-model="password" required />
      </div>
      <button type="submit" class="btn btn-primary w-100">Signup</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async signup() {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}auth/signup/`, {
          username: this.username,
          email: this.email,
          password: this.password
        });
        console.log(response.data); // Handle successful signup
      } catch (error) {
        console.error(error); // Handle error
      }
    }
  }
};
</script>

<style scoped>
.signup {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
</style>
