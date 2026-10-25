<script setup lang="ts">
import { isValidCode } from './lib/code'
import HostView from './components/HostView.vue'
import RevealView from './components/RevealView.vue'
import InvalidView from './components/InvalidView.vue'
import SkyBackground from './components/SkyBackground.vue'

const params = new URLSearchParams(location.search)
const code = (params.get('c') ?? '').toUpperCase()
const from = (params.get('f') ?? '').slice(0, 30)
const mode = !params.has('c') ? 'host' : isValidCode(code) ? 'reveal' : 'invalid'
</script>

<template>
  <SkyBackground />
  <HostView v-if="mode === 'host'" />
  <RevealView v-else-if="mode === 'reveal'" :code="code" :from="from" />
  <InvalidView v-else />
</template>
