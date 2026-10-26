<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { genderOf, type Gender } from '../lib/code'
import { chime, heartbeat, muted, pop, setMuted, sleep, vibrate } from '../lib/fx'
import { confetti } from '../lib/confetti'
import GiftBox from './GiftBox.vue'
import Balloons from './Balloons.vue'
import Footprints from './Footprints.vue'

const props = defineProps<{ code: string; from: string }>()
const gender: Gender = genderOf(props.code)
const home = import.meta.env.BASE_URL

type Stage = 'intro' | 'tease1' | 'tease2' | 'confirm' | 'suspense' | 'revealed'
const stage = ref<Stage>('intro')
const motion = ref<'idle' | 'hop' | 'shake' | 'pulse' | 'open'>('idle')
const glow = ref<'none' | 'gold' | 'boy' | 'girl'>('none')
const beat = ref(0.9)
const caption = ref('')
const count = ref<string | null>(null)
const sound = ref(!muted)
const canvas = ref<HTMLCanvasElement | null>(null)
const runId = ref(0)

const fromLabel = computed(() => (props.from ? `${props.from} から` : ''))
const headline = computed(() => {
  switch (stage.value) {
    case 'intro':
      return '大切なお知らせが 届きました'
    case 'tease1':
      return 'あれ…? 中で なにか動いたみたい'
    case 'tease2':
      return 'もう少しで わかりそう…'
    case 'confirm':
      return 'リボンが ほどけてきた…'
    default:
      return caption.value
  }
})
const hint = computed(() => {
  switch (stage.value) {
    case 'intro':
      return 'そっと タップしてみてね'
    case 'tease1':
      return 'もう一回 タップ'
    case 'tease2':
      return 'えいっ! と タップ'
    default:
      return ''
  }
})
const answer = gender === 'boy' ? { en: "It's a Boy!", ja: '男の子です', color: 'var(--boy-deep)' } : { en: "It's a Girl!", ja: '女の子です', color: 'var(--girl-deep)' }

function toggleSound() {
  sound.value = !sound.value
  setMuted(!sound.value)
}

function tapGift() {
  if (stage.value === 'intro') {
    pop()
    vibrate(20)
    stage.value = 'tease1'
    motion.value = 'hop'
  } else if (stage.value === 'tease1') {
    pop()
    vibrate([20, 40, 20])
    stage.value = 'tease2'
    motion.value = 'shake'
    glow.value = 'gold'
  } else if (stage.value === 'tease2') {
    vibrate(30)
    stage.value = 'confirm'
    motion.value = 'idle'
  }
}

function notYet() {
  stage.value = 'tease2'
  motion.value = 'idle'
  glow.value = 'gold'
}

async function start() {
  const id = ++runId.value
  const alive = () => id === runId.value
  stage.value = 'suspense'
  document.body.dataset.tint = 'dark'
  glow.value = 'gold'
  motion.value = 'pulse'

  // 心音がだんだん速くなる
  caption.value = 'ドキドキ…'
  for (let i = 0; i < 7 && alive(); i++) {
    beat.value = Math.max(0.45, 1.1 - i * 0.1)
    heartbeat()
    vibrate([40, 120, 30])
    await sleep(beat.value * 1000)
    if (i === 3) caption.value = 'ドキドキ… ドキドキ…'
  }

  // カウントダウン
  caption.value = ''
  for (const n of ['3', '2', '1']) {
    if (!alive()) return
    count.value = n
    pop()
    vibrate(25)
    await sleep(950)
  }
  count.value = null

  // 青とピンクで光が入れかわり、だんだん遅くなる
  caption.value = 'どっちかな…?'
  let delay = 80
  let current: Gender = 'girl'
  while (delay < 560 && alive()) {
    current = current === 'boy' ? 'girl' : 'boy'
    glow.value = current
    await sleep(delay)
    delay *= 1.14
  }
  if (!alive()) return
  // 最後に一度だけ、反対の色でためてから止める
  const other: Gender = gender === 'boy' ? 'girl' : 'boy'
  glow.value = other
  caption.value = '…?'
  await sleep(1100)
  if (!alive()) return
  glow.value = 'none'
  caption.value = ''
  await sleep(450)
  if (!alive()) return

  // 発表
  glow.value = gender
  motion.value = 'open'
  document.body.dataset.tint = gender
  stage.value = 'revealed'
  chime()
  vibrate([80, 60, 220])
  if (canvas.value) confetti(canvas.value, gender)
}

function replay() {
  runId.value++
  delete document.body.dataset.tint
  stage.value = 'intro'
  motion.value = 'idle'
  glow.value = 'none'
  caption.value = ''
  count.value = null
}

onBeforeUnmount(() => {
  runId.value++
  delete document.body.dataset.tint
})
</script>

<template>
  <main class="page reveal" :class="'s-' + stage" :style="{ '--beat': beat + 's' }">
    <button class="sound" type="button" :aria-label="sound ? '音を消す' : '音を出す'" @click="toggleSound">
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        <path v-if="sound" d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" />
        <path v-else d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    </button>

    <!-- 各スロットは子要素を同じマスに重ねて表示するので、切り替え中もレイアウトが動かない -->
    <div class="slot top">
      <Transition name="fade">
        <div v-if="stage !== 'revealed'" :key="headline" class="lead">
          <p class="from maru">{{ fromLabel }}</p>
          <h1 class="headline maru">{{ headline }}</h1>
        </div>
        <div v-else class="answer">
          <p class="en script pop" :style="{ color: answer.color }">{{ answer.en }}</p>
          <p class="ja maru rise" style="--d: 0.12s">{{ answer.ja }}</p>
        </div>
      </Transition>
    </div>

    <div class="stagebox">
      <button class="giftbtn" type="button" :disabled="!['intro', 'tease1', 'tease2'].includes(stage)" aria-label="プレゼントをタップ" @click="tapGift">
        <GiftBox :motion="motion" :glow="glow" />
      </button>
      <Transition name="count">
        <div v-if="count" :key="count" class="count script">{{ count }}</div>
      </Transition>
    </div>

    <div class="slot bottom">
    <Transition name="fade">
      <p v-if="hint" :key="hint" class="hint">{{ hint }}</p>
      <div v-else-if="stage === 'confirm'" class="card confirm">
        <p class="maru q rise" style="--d: 0.25s">ほんとうに 見ちゃう?</p>
        <div class="row">
          <button class="btn pop" style="--d: 0.33s" type="button" @click="start">見る!</button>
          <button class="btn soft pop" style="--d: 0.39s" type="button" @click="notYet">まだ心の準備が…</button>
        </div>
      </div>
      <div v-else-if="stage === 'revealed'" class="card done">
        <Footprints :color="answer.color" />
        <p class="maru msg rise" style="--d: 0.95s">
          <template v-if="from">{{ from }} に<br /></template>
          {{ gender === 'boy' ? '男の子' : '女の子' }}の赤ちゃんが やってきます。<br />あたたかく 見守ってね。
        </p>
        <div class="row">
          <button class="btn soft pop" style="--d: 1.05s" type="button" @click="replay">もう一度 見る</button>
          <a class="btn ghost rise" style="--d: 1.11s" :href="home">わたしも作る</a>
        </div>
      </div>
    </Transition>
    </div>

    <Balloons v-if="stage === 'revealed'" :gender="gender" />
    <canvas ref="canvas" class="confetti"></canvas>
  </main>
</template>

<style scoped>
.reveal { min-height: 100vh; min-height: 100dvh; justify-content: center; padding-top: 64px; gap: 8px; }
.slot { display: grid; width: 100%; justify-items: center; }
.slot > * { grid-area: 1 / 1; }
.slot.top { min-height: 128px; align-items: end; }
.slot.bottom { min-height: 228px; align-items: start; }
.lead { display: flex; flex-direction: column; gap: 10px; align-items: center; }
.sound {
  position: fixed;
  top: 14px;
  right: 14px;
  z-index: 5;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 250, 243, 0.85);
  box-shadow: var(--shadow);
  cursor: pointer;
  display: grid;
  place-items: center;
}
.from { margin: 0; color: var(--ink-soft); letter-spacing: 0.08em; }
.headline { margin: 0; font-size: 22px; font-weight: 500; line-height: 1.6; transition: color 1s; }
.s-suspense .headline, .s-suspense .from { color: #f5e6d6; }
.stagebox { position: relative; display: grid; place-items: center; }
.giftbtn { border: 0; background: none; padding: 0; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.giftbtn:disabled { cursor: default; }
.hint { margin: 8px 0 0; color: var(--ink-soft); animation: blink 1.8s ease-in-out infinite; }
@keyframes blink { 50% { opacity: 0.35; } }
.count {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 130px;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}
.count-enter-active { animation: countIn 0.9s var(--e); }
.count-leave-active { transition: opacity 0.15s; }
.count-leave-to { opacity: 0; }
@keyframes countIn { 0% { transform: scale(2.2); opacity: 0; } 30% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.9); opacity: 0.9; } }

.confirm .q { font-size: 18px; margin: 4px 0 16px; }
.confirm { animation: cardIn 0.9s var(--e) 0.2s both; }
.row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
.row a { text-decoration: none; }

.answer { align-self: center; }
.answer p { margin: 0; }
.en { font-size: 64px; line-height: 1; transform: rotate(-4deg); }
.ja { font-size: 26px; margin-top: 8px !important; letter-spacing: 0.1em; }
.done { display: flex; flex-direction: column; align-items: center; gap: 14px; z-index: 4; animation: cardIn 0.9s var(--e) 0.7s both; }
@keyframes cardIn { from { opacity: 0; transform: translateY(24px) scale(0.985); filter: blur(6px); } 60% { filter: blur(0); } to { opacity: 1; transform: none; filter: blur(0); } }
.msg { margin: 0; line-height: 1.9; font-size: 15px; }

.confetti { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 4; }
.s-suspense::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background: radial-gradient(circle at 50% 52%, rgba(255, 230, 190, 0.25) 0, transparent 45%);
  pointer-events: none;
}
</style>
