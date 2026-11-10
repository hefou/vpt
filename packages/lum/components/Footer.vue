<script setup lang="ts">
import { useData } from 'vitepress'
import { computed, onMounted, ref } from 'vue'
import { getLocaleKey, isExternal } from '../composables'
import type { FooterData } from '../types'
import { Icon, Image, Link } from './common'

const props = defineProps<{ Footer_Data: FooterData }>()

const localeKey = getLocaleKey()

const footer = computed<NonNullable<FooterData>>(() => {
  const localized = props.Footer_Data?.i18n?.[localeKey.value]
  return {
    ...props.Footer_Data,
    ...localized,
    author: localized?.author ?? props.Footer_Data?.author ?? undefined,
    beian: localized?.beian ?? props.Footer_Data?.beian ?? undefined,
    group: localized?.group ?? props.Footer_Data?.group ?? [],
    noIcon: localized?.noIcon ?? props.Footer_Data?.noIcon ?? false,
  }
})

const footerAuthor = computed(() => footer.value.author ?? null)
const beian = computed(() => footer.value.beian ?? {})
const icp = computed(() => beian.value.icp)
const police = computed(() => beian.value.police)

const currentYear = ref('')
onMounted(() => (currentYear.value = new Date().getFullYear().toString()))

const { frontmatter } = useData()
const isHome = computed(() => {
  return !!(frontmatter.value.isHome ?? frontmatter.value.layout === 'home')
})
</script>

<template>
  <footer v-if="isHome" class="footer">
    <div v-if="footer.group?.length" class="list-container">
      <section v-for="(section, i) in footer.group" :key="section.title + i">
        <h3 class="list-title">
          <Icon v-if="section.icon" class="icon-space" :icon="section.icon" size="12" />
          <Image v-else-if="section.image" class="image-inline" :image="section.image" size="12" />
          {{ section.title }}
        </h3>
        <ul class="list-links">
          <li v-for="(link, i) in section.links" :key="link.name + i">
            <Icon v-if="link.icon" class="icon-space" :icon="link.icon" size="12" />
            <Image v-else-if="link.image" class="image-inline" :image="link.image" size="12" />
            <Link :href="link.link" :rel="link.rel" :target="link.target"
              :no-icon="footer.noIcon || section.noIcon || link.noIcon || !isExternal(link.link ?? '')">
              {{ link.name }}
            </Link>
          </li>
        </ul>
      </section>
    </div>

    <div v-if="footer.beian?.icp || footer.beian?.police || footer.author" class="footer-info">
      <template v-if="footer.beian?.icp || footer.beian?.police">
        <span v-if="footer.beian?.icp?.number" class="footer-infotext">
          <template v-if="footer.beian?.showIcon">
            <Icon v-if="footer.beian.icp.icon" class="icon-space" :icon="footer.beian.icp.icon" size="12" />
            <Image v-else-if="footer.beian.icp.image" class="image-inline" :image="footer.beian.icp.image" size="12" />
            <Image v-else class="image-inline" image="https://i.theojs.net/logo/miit.webp" size="12" loading="eager" />
          </template>
          <Link :href="icp?.link || 'https://beian.miit.gov.cn/'" :rel="icp?.rel || 'nofollow'" :target="icp?.target"
            no-icon>
            {{ icp?.number }}
          </Link>
        </span>

        <span class="info-spacing"></span>

        <span v-if="police?.number" class="footer-infotext">
          <template v-if="footer.beian?.showIcon">
            <Icon v-if="police?.icon" class="icon-space" :icon="police.icon" size="12" />
            <Image v-else-if="police?.image" class="image-inline" :image="police.image" size="12" />
            <Image v-else class="image-inline" image="https://i.theojs.net/logo/mps.webp" size="12" loading="eager" />
          </template>
          <Link :href="police?.link || 'https://beian.mps.gov.cn/'" :rel="police?.rel" :target="police?.target" no-icon>
            {{ police?.number }}
          </Link>
        </span>
      </template>

      <span class="info-spacing-copyright"></span>

      <span v-if="footer.author?.name" class="footer-infotext">
        <Icon v-if="footer.author.icon" class="icon-space" :icon="footer.author.icon" size="12" />
        <Image v-else-if="footer.author.image" class="image-inline" :image="footer.author.image" size="12" />
        <Icon v-else class="icon-space" :icon="'ri:copyright-line'" size="12" />
        <Link :href="footerAuthor?.link || `https://github.com/${footerAuthor?.name}`" :rel="footerAuthor?.rel"
          :target="footerAuthor?.target" no-icon>
          {{ footerAuthor?.startYear ? `${footerAuthor.startYear} - ` : '' }}{{ currentYear }}
          {{ footerAuthor?.name }}
          {{ footerAuthor?.text || 'All Rights Reserved.' }}
        </Link>
      </span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(---Footer-bg);
  width: 100%;
}

.footer a {
  position: relative;
  transition:
    color 0.25s,
    opacity 0.25s,
    text-decoration-color 0.25s;
}

.footer a:hover {
  color: var(---Footer-link-hover);
  -webkit-text-decoration: underline solid;
  text-decoration: underline solid;
  text-underline-offset: 4px;
}

.list-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  row-gap: 1.25em;
  justify-items: center;
  margin: 1.25em auto;
  max-width: 65%;
}

.list-title {
  margin-bottom: 0.5em;
  font-weight: 600;
  font-size: 0.75em;
  line-height: 1.5;
}

.list-links {
  font-weight: 500;
  font-size: 0.75em;
  line-height: 2.4;
}

.list-links a {
  opacity: 0.75;
}

.list-links a:hover {
  opacity: 1;
}

.iconify {
  display: inline-block;
  flex-shrink: 0;
}

.icon-space {
  margin-right: 0.3em;
}

.footer-info {
  margin: 0.875em 0;
  text-align: center;
}

.footer-infotext {
  display: inline-block;
  margin: 0;
  font-weight: 500;
  font-size: 0.75em;
  line-height: 1.6;
}

.info-spacing,
.info-spacing-copyright {
  margin-left: 1em;
}

.image-inline {
  display: inline-block;
  vertical-align: -0.125em;
  margin-right: 0.3em;
}

@media (max-width: 768px) {
  .info-spacing-copyright {
    margin-left: -1em;
  }
}
</style>
