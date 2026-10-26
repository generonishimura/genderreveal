<script setup lang="ts">
import { ref } from 'vue'
import { buildRevealUrl, makeCode, type Gender } from '../lib/code'
import { sleep } from '../lib/fx'

type Step = 'form' | 'sealing' | 'done'
const step = ref<Step>('form')
const from = ref('')
const choice = ref<Gender | null>(null)
const url = ref('')
const code = ref('')
const copied = ref(false)
const canShare = typeof navigator.share === 'function'

async function seal() {
  if (!choice.value) return
  code.value = makeCode(choice.value)
  url.value = buildRevealUrl(code.value, from.value.trim())
  step.value = 'sealing'
  await sleep(2200)
  // 完成画面では選んだ性別を表示しない(のぞき見対策)
  choice.value = null
  step.value = 'done'
}

async function copy() {
  try {
    await navigator.clipboard.writeText(url.value)
  } catch {
    const el = document.getElementById('share-url') as HTMLInputElement | null
    el?.select()
    document.execCommand('copy')
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 1600)
}

function share() {
  navigator
    .share({ title: '大切なお知らせが届きました', text: 'タップして、赤ちゃんの性別を見てみてね。', url: url.value })
    .catch(() => {})
}

function restart() {
  step.value = 'form'
  url.value = ''
  code.value = ''
}
</script>

<template>
  <main class="page host">
    <svg class="mobile" viewBox="0 0 220 120" aria-hidden="true">
      <path d="M20 14h180" stroke="#c9a98a" stroke-width="3" stroke-linecap="round" />
      <g class="hang h1">
        <line x1="50" y1="14" x2="50" y2="54" stroke="#c9a98a" stroke-width="1.5" />
        <path d="M58 58a16 16 0 11-14-20 12 12 0 1014 20z" fill="var(--gold)" />
      </g>
      <g class="hang h2">
        <line x1="110" y1="14" x2="110" y2="74" stroke="#c9a98a" stroke-width="1.5" />
        <path d="M110 70c-8-10-22-4-16 8 3 6 16 14 16 14s13-8 16-14c6-12-8-18-16-8z" fill="var(--girl)" />
      </g>
      <g class="hang h3">
        <line x1="170" y1="14" x2="170" y2="46" stroke="#c9a98a" stroke-width="1.5" />
        <path d="M170 44l5 10 11 1-8 7 3 11-11-6-10 6 3-11-9-7 11-1z" fill="var(--boy)" />
      </g>
    </svg>

    <header>
      <p class="title script">Baby Reveal</p>
      <p class="sub maru">赤ちゃんの性別を<br />ドキドキの演出で 発表しよう</p>
    </header>

    <Transition name="fade" mode="out-in">
      <section v-if="step === 'form'" key="form" class="card form">
        <label class="field">
          <span>おなまえ <small>(発表画面に出ます・なくてもOK)</small></span>
          <input v-model="from" type="text" maxlength="30" placeholder="たなか家" />
        </label>

        <p class="label">赤ちゃんは どっち?</p>
        <div class="choices">
          <button
            v-for="g in ['boy', 'girl'] as const"
            :key="g"
            type="button"
            class="choice"
            :class="[g, { on: choice === g, off: choice && choice !== g }]"
            :aria-pressed="choice === g"
            @click="choice = g"
          >
            <svg viewBox="0 0 64 64" class="onesie" aria-hidden="true">
              <path d="M22 8c2 5 6 7 10 7s8-2 10-7l12 6 6 14-9 4-3-6v26c0 4-3 6-7 6h-3c-2 0-3-2-3-4h-6c0 2-1 4-3 4h-3c-4 0-7-2-7-6V26l-3 6-9-4 6-14z" fill="currentColor" />
              <circle cx="32" cy="30" r="2" fill="#fff" opacity="0.8" />
              <circle cx="32" cy="38" r="2" fill="#fff" opacity="0.8" />
            </svg>
            <span class="maru">{{ g === 'boy' ? '男の子' : '女の子' }}</span>
            <svg v-if="choice === g" class="check" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="11" fill="currentColor" />
              <path d="M7 12.5l3.2 3L17 9" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <p class="note">選んだ内容は URL を見ても分かりません。<br />まわりに人がいないか 確かめてから選んでね。</p>
        <button class="btn" type="button" :disabled="!choice" @click="seal">ひみつを封筒にしまう</button>
      </section>

      <section v-else-if="step === 'sealing'" key="sealing" class="sealing">
        <svg viewBox="0 0 200 150" class="envelope" aria-hidden="true">
          <rect x="10" y="30" width="180" height="110" rx="10" fill="#fffaf3" stroke="#e3cfb5" stroke-width="2" />
          <path d="M10 40l90 60 90-60" fill="none" stroke="#e3cfb5" stroke-width="2" />
          <path class="flap" d="M12 34l88 62 88-62z" fill="#f3e3cc" stroke="#e3cfb5" stroke-width="2" stroke-linejoin="round" />
          <g class="seal">
            <circle cx="100" cy="96" r="18" fill="var(--ribbon)" />
            <path d="M100 104c-4-5-11-2-8 4 1.5 3 8 7 8 7s6.5-4 8-7c3-6-4-9-8-4z" transform="translate(0 -14)" fill="#fbe6ea" />
          </g>
        </svg>
        <p class="maru">ひみつを 封筒に しまっています…</p>
      </section>

      <section v-else key="done" class="card done">
        <p class="maru big rise">発表用のURLが できました</p>
        <p class="muted small rise" style="--d: 0.06s">このURLを 家族や友だちに 送ってね。<br />開くと、プレゼントの箱が届きます。</p>
        <input id="share-url" class="rise" style="--d: 0.12s" :value="url" type="text" readonly @focus="($event.target as HTMLInputElement).select()" />
        <div class="row rise" style="--d: 0.18s">
          <button class="btn" type="button" @click="copy">{{ copied ? 'コピーしました' : 'URLをコピー' }}</button>
          <button v-if="canShare" class="btn soft" type="button" @click="share">送る</button>
        </div>
        <p class="code rise" style="--d: 0.24s">ひみつのコード <span>{{ code }}</span></p>
        <button class="btn ghost rise" style="--d: 0.3s" type="button" @click="restart">最初から作りなおす</button>
      </section>
    </Transition>
  </main>
</template>

<style scoped>
.host { padding-top: 8px; }
.mobile { width: 220px; height: 110px; overflow: visible; }
.hang { transform-box: view-box; animation: swing 4s ease-in-out infinite; }
.h1 { transform-origin: 50px 14px; }
.h2 { transform-origin: 110px 14px; animation-delay: -1.3s; }
.h3 { transform-origin: 170px 14px; animation-delay: -2.6s; }
@keyframes swing { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
header { margin-top: -6px; }
.title { font-size: 56px; margin: 0; line-height: 1; color: var(--ink); }
.sub { margin: 8px 0 0; line-height: 1.8; color: var(--ink-soft); }

.form { display: flex; flex-direction: column; gap: 16px; text-align: left; }
.field { display: flex; flex-direction: column; gap: 8px; font-weight: 700; position: relative; z-index: 1; }
.field small { font-weight: 500; color: var(--ink-soft); }
input[type='text'] {
  width: 100%;
  padding: 14px 16px;
  font-size: 16px;
  font-family: inherit;
  color: var(--ink);
  background: #fff;
  border: 2px solid #eedfcb;
  border-radius: 14px;
  outline: none;
  transition: border-color 0.3s var(--e2);
}
input[type='text']:focus { border-color: var(--kraft-dark); }
.label { margin: 4px 0 0; font-weight: 700; }
.choices { display: flex; gap: 12px; }
.choice {
  position: relative;
  transition: transform 0.5s var(--e), opacity 0.3s var(--e2), border-color 0.3s var(--e2);
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 18px 0 14px;
  border-radius: 18px;
  border: 2px dashed transparent;
  cursor: pointer;
  font-size: 18px;
}
.choice.boy { background: var(--boy-tint); color: var(--boy-deep); }
.choice.girl { background: var(--girl-tint); color: var(--girl-deep); }
.choice.on { border-color: currentColor; transform: translateY(-3px); }
.choice.off { opacity: 0.45; }
.choice:active { transform: scale(0.97); }
.onesie { width: 58px; height: 58px; }
.choice.on .onesie { animation: wobble 0.6s; }
@keyframes wobble { 30% { transform: rotate(-8deg); } 60% { transform: rotate(6deg); } }
.check { position: absolute; top: 8px; right: 8px; width: 22px; height: 22px; }
.note { margin: 0; font-size: 13px; line-height: 1.7; color: var(--ink-soft); }
.form .btn { align-self: center; z-index: 1; }

.sealing { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px 0; }
.envelope { width: 220px; overflow: visible; }
.flap { transform-box: fill-box; transform-origin: 50% 0; animation: flap 0.9s var(--io) both; }
@keyframes flap { from { transform: scaleY(-1); } to { transform: scaleY(1); } }
.seal { transform-box: fill-box; transform-origin: center; animation: stamp 0.8s 0.9s var(--e) both; }
@keyframes stamp { from { transform: scale(1.8); opacity: 0; filter: blur(4px); } to { transform: scale(1); opacity: 1; filter: blur(0); } }

.done { display: flex; flex-direction: column; gap: 14px; }
.done > * { position: relative; z-index: 1; margin: 0; }
.big { font-size: 20px; }
.small { font-size: 14px; line-height: 1.8; }
.row { display: flex; gap: 10px; justify-content: center; }
.row .btn { flex: 1; padding-left: 12px; padding-right: 12px; }
.code { font-size: 13px; color: var(--ink-soft); }
.code span { font-family: ui-monospace, monospace; letter-spacing: 0.15em; color: var(--ink); }
</style>
