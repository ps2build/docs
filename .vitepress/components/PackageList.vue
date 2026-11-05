<script setup lang="ts">
defineProps<{
  items: { name: string; url?: string }[]
}>()
</script>

<template>
  <p class="package-list">
    <template v-for="(pkg, i) in items" :key="pkg.name">
      <a v-if="pkg.url" :href="pkg.url"><code>{{ pkg.name }}</code></a>
      <code v-else>{{ pkg.name }}</code
      ><span v-if="i < items.length - 1">, </span>
    </template>
  </p>
</template>
