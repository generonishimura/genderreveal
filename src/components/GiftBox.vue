<script setup lang="ts">
defineProps<{
  motion: 'idle' | 'hop' | 'shake' | 'pulse' | 'open'
  glow: 'none' | 'gold' | 'boy' | 'girl'
}>()
</script>

<template>
  <div class="gift" :class="['m-' + motion, 'g-' + glow]">
    <div class="glow"></div>
    <div class="rays"></div>
    <svg viewBox="0 0 220 220" class="svg">
      <defs>
        <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="3" fill="#fff" opacity="0.55" />
          <circle cx="17" cy="17" r="2" fill="#fff" opacity="0.4" />
        </pattern>
      </defs>
      <ellipse cx="110" cy="206" rx="78" ry="9" fill="#a07a5a" opacity="0.15" class="shadow" />
      <g class="body">
        <rect x="34" y="96" width="152" height="108" rx="12" fill="var(--kraft)" />
        <rect x="34" y="96" width="152" height="108" rx="12" fill="url(#dots)" />
        <rect x="34" y="96" width="152" height="16" fill="var(--kraft-dark)" opacity="0.45" />
        <rect x="98" y="96" width="24" height="108" fill="var(--ribbon)" />
        <rect x="98" y="96" width="5" height="108" fill="#fff" opacity="0.25" />
      </g>
      <g class="lid">
        <rect x="24" y="70" width="172" height="34" rx="10" fill="#efd2aa" />
        <rect x="24" y="70" width="172" height="34" rx="10" fill="url(#dots)" />
        <rect x="98" y="70" width="24" height="34" fill="var(--ribbon)" />
        <g class="bow">
          <path d="M110 72c-14-30-52-34-48-10 2 12 26 14 48 10z" fill="var(--ribbon)" />
          <path d="M110 72c14-30 52-34 48-10-2 12-26 14-48 10z" fill="var(--ribbon)" />
          <path d="M104 74l-14 26 10-2 6 8 4-30zM116 74l14 26-10-2-6 8-4-30z" fill="#c97777" />
          <circle cx="110" cy="72" r="9" fill="#c97777" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.gift { position: relative; width: 240px; height: 240px; }
.svg { position: relative; width: 100%; height: 100%; overflow: visible; }
.body, .lid, .bow { transform-box: fill-box; }
.lid { transform-origin: 50% 100%; transition: transform 0.9s cubic-bezier(0.3, 1.5, 0.5, 1), opacity 0.9s; }
.bow { transform-origin: 50% 80%; }

.m-idle .svg { animation: breathe 3s ease-in-out infinite; }
.m-idle .bow { animation: bowSway 3s ease-in-out infinite; }
.m-hop .svg { animation: hop 0.9s cubic-bezier(0.3, 0, 0.4, 1) 2, breathe 3s ease-in-out 1.8s infinite; }
.m-shake .svg { animation: shake 0.16s linear infinite; }
.m-shake .lid { transform: translateY(-6px) rotate(-2deg); }
.m-pulse .svg { animation: pulse var(--beat, 0.9s) ease-in-out infinite; }
.m-open .lid { transform: translate(40px, -190px) rotate(38deg); opacity: 0; }

@keyframes breathe { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes bowSway { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
@keyframes hop {
  0%, 100% { transform: translateY(0) scale(1, 1); }
  20% { transform: translateY(4px) scale(1.06, 0.94); }
  45% { transform: translateY(-28px) scale(0.96, 1.05) rotate(-3deg); }
  70% { transform: translateY(0) scale(1.04, 0.96); }
}
@keyframes shake {
  0% { transform: translate(0, 0) rotate(0); }
  25% { transform: translate(-5px, 1px) rotate(-2.5deg); }
  50% { transform: translate(4px, -2px) rotate(2deg); }
  75% { transform: translate(-2px, 2px) rotate(-1deg); }
}
@keyframes pulse { 0%, 100% { transform: scale(1); } 15% { transform: scale(1.07); } 30% { transform: scale(0.99); } 45% { transform: scale(1.04); } }

.glow {
  position: absolute;
  inset: -40px;
  border-radius: 50%;
  opacity: 0;
  filter: blur(18px);
  transition: opacity 0.25s, background 0.25s;
}
.g-gold .glow { opacity: 0.8; background: radial-gradient(circle, #ffe9b8 0%, transparent 65%); }
.g-boy .glow { opacity: 1; background: radial-gradient(circle, var(--boy) 0%, transparent 65%); }
.g-girl .glow { opacity: 1; background: radial-gradient(circle, var(--girl) 0%, transparent 65%); }

.rays {
  position: absolute;
  left: 50%;
  top: 45%;
  width: 640px;
  height: 640px;
  margin: -320px 0 0 -320px;
  opacity: 0;
  background: repeating-conic-gradient(from 0deg, rgba(255, 255, 255, 0.55) 0deg 8deg, transparent 8deg 24deg);
  mask-image: radial-gradient(circle, #000 15%, transparent 65%);
  -webkit-mask-image: radial-gradient(circle, #000 15%, transparent 65%);
  transition: opacity 1.2s;
}
.m-open .rays { opacity: 1; animation: spin 24s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
