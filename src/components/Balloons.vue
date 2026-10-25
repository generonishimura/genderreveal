<script setup lang="ts">
import type { Gender } from '../lib/code'

const props = defineProps<{ gender: Gender }>()
const shades = props.gender === 'boy' ? ['#8fb8d8', '#a9cbe6', '#6f9cc4', '#f6d58e', '#ffffff'] : ['#e8a5b3', '#f3b9c4', '#d98b9b', '#f6d58e', '#ffffff']
const balloons = Array.from({ length: 14 }, (_, i) => ({
  left: 6 + ((i * 41) % 88),
  color: shades[i % shades.length],
  size: 46 + ((i * 13) % 30),
  delay: (i % 7) * 0.35 + (i > 6 ? 0.6 : 0),
  dur: 6 + ((i * 7) % 4),
  sway: i % 2 ? 1 : -1,
}))
</script>

<template>
  <div class="balloons" aria-hidden="true">
    <svg
      v-for="(b, i) in balloons"
      :key="i"
      class="balloon"
      viewBox="0 0 60 120"
      :style="{ left: b.left + '%', width: b.size + 'px', animationDelay: b.delay + 's', animationDuration: b.dur + 's', '--sway': b.sway }"
    >
      <path d="M30 4C14 4 4 17 4 32c0 18 14 32 26 36 12-4 26-18 26-36C56 17 46 4 30 4z" :fill="b.color" />
      <path d="M27 68l3 6 3-6z" :fill="b.color" />
      <ellipse cx="20" cy="22" rx="5" ry="9" fill="#fff" opacity="0.45" transform="rotate(25 20 22)" />
      <path d="M30 74c-6 10 6 18 0 28s4 14 0 18" stroke="#b49a88" stroke-width="1.2" fill="none" />
    </svg>
  </div>
</template>

<style scoped>
.balloons { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 3; }
.balloon {
  position: absolute;
  bottom: -160px;
  filter: drop-shadow(0 6px 8px rgba(90, 60, 40, 0.15));
  animation: rise ease-in forwards;
}
@keyframes rise {
  0% { transform: translate(0, 0) rotate(0); }
  30% { transform: translate(calc(var(--sway) * 14px), -40vh) rotate(calc(var(--sway) * 4deg)); }
  60% { transform: translate(calc(var(--sway) * -10px), -80vh) rotate(calc(var(--sway) * -3deg)); }
  100% { transform: translate(calc(var(--sway) * 12px), -130vh) rotate(calc(var(--sway) * 3deg)); }
}
</style>
