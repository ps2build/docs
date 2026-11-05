<script setup lang="ts">
import { editorIcons } from './editor-icons'

const editors = [
  { id: 'clion', name: 'CLion' },
  { id: 'vscodium', name: 'VSCodium' },
  { id: 'neovim', name: 'Neovim' },
  { id: 'vim', name: 'Vim' },
  { id: 'emacs', name: 'Emacs' },
  { id: 'sublime', name: 'Sublime Text' },
  { id: 'zed', name: 'Zed' },
]
</script>

<template>
  <div class="tiles">
    <div v-for="e in editors" :key="e.id" class="tile">
      <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path :d="editorIcons[e.id]" /></svg>
      <span>{{ e.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.tile svg {
  fill: var(--vp-c-brand-1);
}
</style>
