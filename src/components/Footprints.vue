<script setup lang="ts">
defineProps<{ color: string }>()
const steps = Array.from({ length: 6 }, (_, i) => ({ x: i * 32, y: i % 2 ? 0 : 10, flip: i % 2 === 1 }))
</script>

<template>
  <svg class="feet" viewBox="0 0 200 40" aria-hidden="true">
    <g
      v-for="(s, i) in steps"
      :key="i"
      class="foot"
      :style="{ animationDelay: 0.9 + i * 0.35 + 's' }"
      :transform="`translate(${s.x + 8} ${s.y}) ${s.flip ? 'scale(-1 1) translate(-18 0)' : ''}`"
      :fill="color"
    >
      <ellipse cx="9" cy="16" rx="6" ry="9" />
      <circle cx="3.5" cy="4.5" r="2" />
      <circle cx="7.5" cy="2.5" r="2" />
      <circle cx="11.5" cy="2.8" r="1.8" />
      <circle cx="14.5" cy="5" r="1.6" />
    </g>
  </svg>
</template>

<style scoped>
.feet { width: 200px; height: 40px; overflow: visible; }
.foot { opacity: 0; animation: step 0.4s ease-out forwards; }
@keyframes step { from { opacity: 0; } to { opacity: 0.75; } }
</style>
