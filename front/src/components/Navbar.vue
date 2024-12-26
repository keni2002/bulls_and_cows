<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">Bulls and Cows</RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link active" aria-current="page" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/features">Features</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/pricing">Pricing</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link disabled" aria-disabled="true" to="#">Disabled</RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <button class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="@/assets/profile-placeholder.svg" alt="Profile Picture" class="profile-pic" />
              <span class="username">User Name</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><RouterLink class="dropdown-item" to="/profile">Edit Profile</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/login">Login</RouterLink></li>
              <li><RouterLink class="dropdown-item" to="/logout">Logout</RouterLink></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 5px;
}

.username {
  margin-left: 5px;
}
</style>
