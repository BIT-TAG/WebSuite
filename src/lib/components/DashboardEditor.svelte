<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { DashboardNode } from '$lib/types/dashboard';
  
  const dispatch = createEventDispatcher();
  
  export let isOpen = false;
  export let node: DashboardNode | null = null;
  export let parentOptions: Array<{ id: string; name: string; type: string }> = [];
  
  let formData = {
    name: '',
    type: 'personal' as 'personal' | 'project' | 'team',
    description: '',
    icon: '📊',
    color: '#3b82f6',
    parentId: '',
    tags: [] as string[],
    permissions: {
      view: ['*'],
      edit: ['user'],
      admin: ['admin']
    }
  };
  
  let tagInput = '';
  let isLoading = false;
  
  const iconOptions = [
    '📊', '📈', '📉', '📋', '📁', '📂', '📄', '📝', '📑', '📇',
    '🏠', '🏢', '🏭', '🏪', '🏬', '🏦', '🏛️', '🏗️', '🏘️', '🏙️',
    '👤', '👥', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🔬', '👩‍🔬', '👨‍🎨', '👩‍🎨',
    '🎯', '🎪', '🎨', '🎭', '🎪', '🎲', '🎮', '🎸', '🎹', '🎺',
    '⚡', '⚙️', '⚖️', '⚗️', '⚰️', '⚱️', '⚽', '⚾', '🥎', '🏀'
  ];
  
  const colorOptions = [
    '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
  ];
  
  $: isEditing = node !== null;
  $: modalTitle = isEditing ? 'Dashboard bearbeiten' : 'Neues Dashboard erstellen';
  
  // Initialize form when node changes
  $: if (node) {
    formData = {
      name: node.name,
      type: node.type === 'main' ? 'personal' : node.type,
      description: node.description || '',
      icon: node.icon,
      color: node.color,
      parentId: node.parentId || '',
      tags: [...node.metadata.tags],
      permissions: { ...node.config.permissions }
    };
  } else {
    resetForm();
  }
  
  function resetForm() {
    formData = {
      name: '',
      type: 'personal',
      description: '',
      icon: '📊',
      color: '#3b82f6',
      parentId: '',
      tags: [],
      permissions: {
        view: ['*'],
        edit: ['user'],
        admin: ['admin']
      }
    };
    tagInput = '';
  }
  
  function addTag() {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      formData.tags = [...formData.tags, tag];
      tagInput = '';
    }
  }
  
  function removeTag(tagToRemove: string) {
    formData.tags = formData.tags.filter(tag => tag !== tagToRemove);
  }
  
  function handleTagKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  }
  
  async function handleSubmit() {
    if (!formData.name.trim()) return;
    
    isLoading = true;
    
    try {
      const data = {
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim() || undefined,
        icon: formData.icon,
        color: formData.color,
        parentId: formData.parentId || undefined,
        tags: formData.tags,
        permissions: formData.permissions
      };
      
      if (isEditing && node) {
        dispatch('update', { id: node.id, data });
      } else {
        dispatch('create', data);
      }
      
      handleClose();
    } catch (error) {
      console.error('Failed to save dashboard:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function handleClose() {
    isOpen = false;
    dispatch('close');
  }
  
  function handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }
</script>

{#if isOpen}
  <div class="modal-overlay" on:click={handleOverlayClick}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2 class="modal-title">{modalTitle}</h2>
        <button class="close-btn" on:click={handleClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      
      <form class="modal-body" on:submit|preventDefault={handleSubmit}>
        <!-- Basic Info -->
        <div class="form-section">
          <h3 class="section-title">Grundinformationen</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="name">Name *</label>
              <input
                id="name"
                type="text"
                bind:value={formData.name}
                placeholder="Dashboard Name"
                class="form-input"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="type">Typ</label>
              <select id="type" bind:value={formData.type} class="form-select" disabled={isEditing}>
                <option value="personal">Persönlich</option>
                <option value="project">Projekt</option>
                <option value="team">Team</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Beschreibung</label>
            <textarea
              id="description"
              bind:value={formData.description}
              placeholder="Kurze Beschreibung des Dashboards..."
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
          
          {#if parentOptions.length > 0}
            <div class="form-group">
              <label for="parent">Übergeordnetes Dashboard</label>
              <select id="parent" bind:value={formData.parentId} class="form-select">
                <option value="">Kein übergeordnetes Dashboard</option>
                {#each parentOptions as parent}
                  <option value={parent.id}>{parent.name} ({parent.type})</option>
                {/each}
              </select>
            </div>
          {/if}
        </div>
        
        <!-- Appearance -->
        <div class="form-section">
          <h3 class="section-title">Erscheinungsbild</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label>Icon</label>
              <div class="icon-grid">
                {#each iconOptions as icon}
                  <button
                    type="button"
                    class="icon-option"
                    class:active={formData.icon === icon}
                    on:click={() => formData.icon = icon}
                  >
                    {icon}
                  </button>
                {/each}
              </div>
            </div>
            
            <div class="form-group">
              <label>Farbe</label>
              <div class="color-grid">
                {#each colorOptions as color}
                  <button
                    type="button"
                    class="color-option"
                    class:active={formData.color === color}
                    style="background-color: {color}"
                    on:click={() => formData.color = color}
                  >
                    {#if formData.color === color}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tags -->
        <div class="form-section">
          <h3 class="section-title">Tags</h3>
          
          <div class="form-group">
            <label for="tag-input">Tags hinzufügen</label>
            <div class="tag-input-container">
              <input
                id="tag-input"
                type="text"
                bind:value={tagInput}
                placeholder="Tag eingeben und Enter drücken"
                class="form-input"
                on:keydown={handleTagKeydown}
              />
              <button type="button" class="add-tag-btn" on:click={addTag}>
                Hinzufügen
              </button>
            </div>
            
            {#if formData.tags.length > 0}
              <div class="tags-list">
                {#each formData.tags as tag}
                  <span class="tag">
                    {tag}
                    <button type="button" class="remove-tag" on:click={() => removeTag(tag)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </span>
                {/each}
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Permissions -->
        <div class="form-section">
          <h3 class="section-title">Berechtigungen</h3>
          
          <div class="form-group">
            <label for="view-permissions">Ansehen</label>
            <input
              id="view-permissions"
              type="text"
              bind:value={formData.permissions.view}
              placeholder="Komma-getrennte Liste (z.B. user1, team-a, *)"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="edit-permissions">Bearbeiten</label>
            <input
              id="edit-permissions"
              type="text"
              bind:value={formData.permissions.edit}
              placeholder="Komma-getrennte Liste"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="admin-permissions">Verwalten</label>
            <input
              id="admin-permissions"
              type="text"
              bind:value={formData.permissions.admin}
              placeholder="Komma-getrennte Liste"
              class="form-input"
            />
          </div>
        </div>
      </form>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" on:click={handleClose}>
          Abbrechen
        </button>
        <button 
          type="button" 
          class="btn btn-primary" 
          on:click={handleSubmit}
          disabled={!formData.name.trim() || isLoading}
        >
          {#if isLoading}
            Speichern...
          {:else}
            {isEditing ? 'Aktualisieren' : 'Erstellen'}
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 200ms ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .modal {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 16px;
    width: 90%;
    max-width: 700px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0; 
      transform: translateY(20px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  .modal-header {
    padding: 24px 32px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-secondary);
  }
  
  .modal-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .close-btn {
    background: var(--bg-hover);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .close-btn:hover {
    background: var(--accent-color);
    color: var(--accent-foreground);
    border-color: var(--accent-color);
  }
  
  .modal-body {
    padding: 32px;
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .form-section {
    margin-bottom: 32px;
  }
  
  .form-section:last-child {
    margin-bottom: 0;
  }
  
  .section-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .form-group label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 14px;
    transition: all 0.2s ease;
    font-family: inherit;
  }
  
  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .form-textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 8px;
    max-height: 120px;
    overflow-y: auto;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-secondary);
  }
  
  .icon-option {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
  }
  
  .icon-option:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
  }
  
  .icon-option.active {
    background: var(--accent-color);
    color: var(--accent-foreground);
    border-color: var(--accent-color);
  }
  
  .color-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }
  
  .color-option {
    width: 40px;
    height: 40px;
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .color-option:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .color-option.active {
    border-color: var(--text-primary);
    transform: scale(1.1);
    box-shadow: 0 0 0 2px var(--accent-color);
  }
  
  .tag-input-container {
    display: flex;
    gap: 8px;
  }
  
  .add-tag-btn {
    background: var(--accent-color);
    color: var(--accent-foreground);
    border: none;
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  
  .add-tag-btn:hover {
    background: var(--accent-hover);
  }
  
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }
  
  .tag {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--accent-light);
    color: var(--accent-color);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .remove-tag {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 2px;
    border-radius: 2px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .remove-tag:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  
  .modal-footer {
    padding: 24px 32px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    background: var(--bg-secondary);
  }
  
  .btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }
  
  .btn-secondary {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border);
  }
  
  .btn-secondary:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
  }
  
  .btn-primary {
    background: var(--accent-color);
    color: var(--accent-foreground);
  }
  
  .btn-primary:hover:not(:disabled) {
    background: var(--accent-hover);
  }
  
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .modal {
      width: 95%;
      max-height: 95vh;
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
      padding: 20px;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .icon-grid {
      grid-template-columns: repeat(8, 1fr);
    }
    
    .color-grid {
      grid-template-columns: repeat(5, 1fr);
    }
  }
</style>