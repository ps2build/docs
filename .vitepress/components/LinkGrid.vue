<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{
  items: { title: string; text: string; link: string }[]
}>()
</script>

<template>
  <div class="link-grid">
    <a v-for="item in items" :key="item.link" :href="withBase(item.link)" class="link-grid-item">
      <span class="link-grid-title">{{ item.title }}</span>
      <span class="link-grid-text">{{ item.text }}</span>
    </a>
  </div>
</template>

<style scoped>
.link-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 16px 0;
}

.link-grid-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-left: 3px solid var(--vp-c-brand-3);
  border-radius: 6px;
  text-decoration: none;
  transition: border-color 0.15s, background-color 0.15s;
}

.link-grid-item:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
}

.link-grid-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.link-grid-text {
  font-size: 14px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

@media (max-width: 959px) {
  .link-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 559px) {
  .link-grid {
    grid-template-columns: 1fr;
  }
}
</style>
