<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let loading = true;
  let error = '';
  
  onMount(async () => {
    try {
      // Check if user has admin access
      const response = await fetch('/api/apps');
      if (!response.ok) {
        throw new Error('Access denied');
      }
      loading = false;
    } catch (err) {
      error = 'Admin access required. Please log in.';
      loading = false;
      // In a real app, redirect to login page
      setTimeout(() => {
        goto('/');
      }, 3000);
    }
  });
</script>

{#if loading}
  <div class="loading">
    <div class="spinner"></div>
    <p>Checking permissions...</p>
  </div>
{:else if error}
  <div class="error">
    <h1>Access Denied</h1>
    <p>{error}</p>
    <p>Redirecting to home page...</p>
  </div>
{:else}
  <div class="admin-layout">
    <nav class="admin-nav">
      <div class="nav-brand">
        <h1>WebSuite Admin</h1>
      </div>
      <div class="nav-links">
        <a 
          href="/admin/apps" 
          class="nav-link"
          class:active={$page.url.pathname === '/admin/apps'}
        >
          📱 Apps
        </a>
        <a 
          href="/admin/settings" 
          class="nav-link"
          class:active={$page.url.pathname === '/admin/settings'}
        >
          ⚙️ Settings
        </a>
      </div>
      <div class="nav-user">
        <span class="user-info">Development Admin</span>
        <button class="logout-btn">Logout</button>
      </div>
    </nav>
    
    <main class="admin-content">
      <slot />
    </main>
  </div>
{/if}

<style>
  .loading, .error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 2rem;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error {
    color: #dc2626;
  }
  
  .admin-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .admin-nav {
    background: #1f2937;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .nav-brand h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .nav-links {
    display: flex;
    gap: 1rem;
    flex: 1;
  }
  
  .nav-link {
    color: #d1d5db;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
    font-weight: 500;
  }
  
  .nav-link:hover {
    background: #374151;
    color: white;
  }
  
  .nav-link.active {
    background: #3b82f6;
    color: white;
  }
  
  .nav-user {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .user-info {
    font-size: 0.875rem;
    color: #d1d5db;
  }
  
  .logout-btn {
    background: #374151;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.2s;
  }
  
  .logout-btn:hover {
    background: #4b5563;
  }
  
  .admin-content {
    flex: 1;
    padding: 2rem;
    background: #f9fafb;
  }
</style>