<script setup lang="ts">
import type { IconType, ImageType, LinkType, RelType, SizeType, TargetType } from '../types'
import { Icon, Image, Link } from './common'

const pill = defineProps<{
  name: string
  link?: LinkType
  rel?: RelType
  target?: TargetType
  icon?: IconType
  image?: ImageType
  size?: SizeType
}>()
</script>

<template>
  <Link :class="['link', 'ignore-header', { 'no-icon-img': !pill.icon && !pill.image }]" :href="pill.link"
    :rel="pill.rel" :target="pill.target" no-icon>
    <Icon v-if="pill.icon" :icon="pill.icon" :size="pill.size || '14'" />
    <Image v-else-if="pill.image" :image="pill.image" :size="pill.size || '14'" />
    <span class="name" v-html="pill.name"></span>
  </Link>
</template>

<style scoped>
.link {
  display: inline-flex;
  align-items: center;
  vertical-align: -1px;
  gap: 0.25em;
  transition:
    color 0.25s,
    transform 0.25s,
    box-shadow 0.25s,
    border-color 0.25s,
    background-color 0.25s;
  margin: 0 0.125em;
  border: 1px solid var(---Pill-border);
  border-radius: 0.5em;
  background-color: var(---Pill-bg);
  padding: 0 0.25em;
  height: 1.375em;
  font-size: 1rem;
  text-decoration: none !important;
  white-space: nowrap;
}

.link.no-icon-img {
  vertical-align: 1.5px;
}

.link.-link {
  color: var(---Pill-name);
}

.link.-link:hover {
  transform: var(---Pill-transform-hover);
  box-shadow: var(---Pill-boxshadow-hover);
  border-color: var(---Pill-border-hover);
  background-color: var(---Pill-bg-hover);
  color: var(---Pill-name-hover);
}

.link.-link:active {
  transform: var(---Pill-transform-active);
}

.vp-doc h1>.link {
  vertical-align: top;
  margin-top: 2px;
}

.vp-doc h2>.link {
  vertical-align: top;
  margin-top: 1px;
}

.vp-doc h3>.link {
  vertical-align: top;
  margin-top: 1px;
}

.vp-doc h4>.link,
.vp-doc h5>.link,
.vp-doc h6>.link {
  vertical-align: top;
  line-height: 18px;
}

.vp-doc td>.link {
  vertical-align: -1px;
  font-size: 1em;
}

.vp-doc td>.link.no-icon-img {
  vertical-align: 1.5px;
}

.iconify {
  flex-shrink: 0;
  color: var(---iconify-defColor);
}

.name {
  font-weight: 500;
  font-size: 0.875em;
}
</style>
