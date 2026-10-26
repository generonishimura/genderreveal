<script setup lang="ts">
defineProps<{ color: string }>()
// 左から右へ歩く向き。つま先を右に向け、右足を下、左足(左右反転)を上に互い違いに置く
const steps = Array.from({ length: 6 }, (_, i) => ({ x: 4 + i * 34, y: i % 2 ? -1 : 15, flip: i % 2 === 1 }))
</script>

<template>
  <svg class="feet" viewBox="0 0 200 40" aria-hidden="true">
    <!-- 位置は外側の transform 属性で決め、アニメーションは内側の g にかける。
         CSS の transform は SVG の transform 属性を上書きしてしまうため -->
    <g
      v-for="(s, i) in steps"
      :key="i"
      :transform="`translate(${s.x} ${s.y}) rotate(90 9 13) ${s.flip ? 'translate(18 0) scale(-1 1)' : ''}`"
      :fill="color"
    >
      <g class="foot" :style="{ animationDelay: 0.85 + i * 0.08 + 's' }">
        <path d="M9 26C5.5 26 4.3 22.5 4.6 18.5 4.9 14.8 3.2 11.5 3.6 8.4 4 5.4 6.8 4.2 9.8 4.5 13.2 4.8 15 7.6 14.6 10.8 14.2 13.8 13.1 16 13.4 19.2 13.8 23.2 12.4 26 9 26z" />
        <circle cx="5" cy="3" r="2.1" />
        <circle cx="8.6" cy="1.5" r="1.7" />
        <circle cx="11.6" cy="1.8" r="1.5" />
        <circle cx="14" cy="3.4" r="1.3" />
        <circle cx="15.6" cy="5.8" r="1.1" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.feet { width: 200px; height: 40px; overflow: visible; }
.foot { opacity: 0; transform-box: fill-box; transform-origin: center; animation: step 0.9s var(--e) forwards; }
@keyframes step { from { opacity: 0; transform: scale(0.85); } to { opacity: 0.75; transform: none; } }
</style>
