<script setup lang="ts">
import { withBase } from 'vitepress'
import { osIcons } from './os-icons'

defineProps<{
  before?: { title: string; code: string }
  after?: { title: string; code: string }
  platformsLabel?: string
  platforms?: { id: string; name: string }[]
  actions?: { text: string; link: string; primary?: boolean }[]
  links?: { text: string; link: string }[]
}>()
</script>

<template>
  <section class="showcase">
    <div v-if="before && after" class="compare">
      <figure class="panel panel-before">
        <figcaption>{{ before.title }}</figcaption>
        <pre><code>{{ before.code }}</code></pre>
      </figure>
      <figure class="panel panel-after">
        <figcaption>{{ after.title }}</figcaption>
        <pre><code>{{ after.code }}</code></pre>
      </figure>
    </div>

    <div v-if="actions" class="actions">
      <a
        v-for="a in actions"
        :key="a.link"
        :href="withBase(a.link)"
        :class="['btn', a.primary ? 'btn-brand' : 'btn-alt']"
      >{{ a.text }}</a>
    </div>

    <div v-if="platforms" class="platforms">
      <span class="platforms-label">{{ platformsLabel }}</span>
      <span v-for="p in platforms" :key="p.id" class="platform">
        <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" v-html="osIcons[p.id]" />
        {{ p.name }}
      </span>
    </div>

    <nav v-if="links" class="links">
      <a v-for="l in links" :key="l.link" :href="withBase(l.link)">{{ l.text }}</a>
    </nav>
  </section>
</template>

<style scoped>
.showcase {
  margin: 24px 0 8px;
}

.compare {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 16px;
  align-items: stretch;
}

.panel {
  margin: 0;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-code-block-bg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-after {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 1px var(--vp-c-brand-soft), 0 8px 28px var(--vp-c-brand-soft);
}

figcaption {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
}

.panel-after figcaption {
  color: var(--vp-c-brand-1);
}

pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  flex: 1;
}

code {
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--vp-c-text-1);
  white-space: pre;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 28px 0 8px;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 0 22px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s, border-color 0.2s;
}

.btn-brand {
  background: var(--vp-button-brand-bg);
  color: var(--vp-button-brand-text);
}

.btn-brand:hover {
  background: var(--vp-button-brand-hover-bg);
}

.btn-alt {
  background: var(--vp-button-alt-bg);
  color: var(--vp-button-alt-text);
}

.btn-alt:hover {
  background: var(--vp-button-alt-hover-bg);
}

.platforms {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px 48px;
  margin: 48px 0 20px;
  padding: 32px 0;
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.platforms-label {
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-text-3);
}

.platform {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.platform svg {
  fill: currentColor;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  justify-content: center;
  font-size: 14px;
}

.links a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.links a:hover {
  color: var(--vp-c-brand-1);
}

@media (max-width: 959px) {
  .compare {
    grid-template-columns: 1fr;
  }
}
</style>
