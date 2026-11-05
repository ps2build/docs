<script setup lang="ts">
import { osIcons } from './os-icons'

const platforms = [
  { id: 'windows', name: 'Windows' },
  { id: 'linux', name: 'Linux' },
  { id: 'macos', name: 'macOS' },
]
</script>

<template>
  <div class="tiles">
    <div v-for="p in platforms" :key="p.id" class="tile">
      <svg viewBox="0 0 24 24" width="56" height="56" aria-hidden="true" v-html="osIcons[p.id]" />
      <span>{{ p.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 36px 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.tile svg {
  fill: var(--vp-c-brand-1);
}
</style>
