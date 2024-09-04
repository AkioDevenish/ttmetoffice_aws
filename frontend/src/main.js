import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import ThemeProvider from './components/ThemeProvider.vue';
import Dashboard from './pages/Dashboard.vue';
import './css/style.css';

// Define your routes
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  // Other routes...
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Create the Vue app
const app = createApp(App);

// Use the ThemeProvider as a plugin
app.use({
  install(app) {
    app.component('ThemeProvider', ThemeProvider);
  }
});

// Use the router
app.use(router);

// Mount the app
app.mount('#app');