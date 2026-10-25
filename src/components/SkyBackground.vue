<script setup lang="ts">
// 背景にゆっくり流れる雲と、またたく星を置く
const stars = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 53) % 100,
  top: (i * 37) % 70,
  size: 6 + ((i * 7) % 8),
  delay: (i % 6) * 0.7,
}))
const clouds = [
  { top: 8, scale: 1, dur: 70, delay: -10 },
  { top: 30, scale: 0.7, dur: 90, delay: -50 },
  { top: 62, scale: 0.85, dur: 80, delay: -30 },
]
</script>

<template>
  <div class="sky" aria-hidden="true">
    <svg
      v-for="(s, i) in stars"
      :key="'s' + i"
      class="star"
      viewBox="0 0 24 24"
      :style="{ left: s.left + '%', top: s.top + '%', width: s.size + 'px', animationDelay: s.delay + 's' }"
    >
      <path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" />
    </svg>
    <svg
      v-for="(c, i) in clouds"
      :key="'c' + i"
      class="cloud"
      viewBox="0 0 200 90"
      :style="{ top: c.top + '%', '--s': c.scale, animationDuration: c.dur + 's', animationDelay: c.delay + 's' }"
    >
      <path d="M40 80c-20 0-34-12-34-28s14-27 32-26c6-14 20-22 36-20 12-14 40-14 52 2 20-4 40 8 42 28 14 2 26 12 26 24 0 12-10 20-24 20z" />
    </svg>
    <div class="grain"></div>
  </div>
</template>

<style scoped>
.sky { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.star { position: absolute; fill: var(--gold); opacity: 0.55; animation: twinkle 3.6s ease-in-out infinite; }
@keyframes twinkle { 0%, 100% { opacity: 0.15; transform: scale(0.7); } 50% { opacity: 0.7; transform: scale(1); } }
.cloud {
  position: absolute;
  left: 0;
  width: 200px;
  fill: #fff;
  opacity: 0.85;
  filter: drop-shadow(0 6px 10px rgba(160, 120, 90, 0.08));
  animation: drift linear infinite;
}
@keyframes drift {
  from { transform: translateX(-220px) scale(var(--s)); }
  to { transform: translateX(calc(100vw + 20px)) scale(var(--s)); }
}
.grain {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.6 0 0 0 0 0.45 0 0 0 0 0.35 0 0 0 0.18 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
</style>
