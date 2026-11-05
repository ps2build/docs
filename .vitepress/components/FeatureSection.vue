<script setup lang="ts">
defineProps<{
  index: string
  title: string
  text?: string
  flip?: boolean
  wide?: boolean
}>()
</script>

<template>
  <section :class="['feature', { flip, wide }]">
    <div class="copy">
      <span class="index">{{ index }}</span>
      <h2>{{ title }}</h2>
      <p v-if="text">{{ text }}</p>
    </div>
    <div class="visual"><slot /></div>
  </section>
</template>

<style scoped>
.feature {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 48px;
  align-items: center;
  margin-top: 56px;
  padding-top: 56px;
  border-top: 1px solid var(--vp-c-divider);
}

.feature.flip .copy {
  order: 2;
}

.feature.wide {
  grid-template-columns: 1fr;
  gap: 28px;
}

.index {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: var(--vp-c-brand-1);
}

.copy h2 {
  margin: 8px 0 12px;
  padding: 0;
  border: 0;
  font-size: 34px;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.copy p {
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.visual {
  min-width: 0;
}

.visual :deep(ul) {
  margin: 0;
  padding-left: 0;
  list-style-position: inside;
}

@media (max-width: 799px) {
  .feature {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .feature.flip .copy {
    order: 0;
  }
}
</style>
