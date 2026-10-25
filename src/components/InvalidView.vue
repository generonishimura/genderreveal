<script setup lang="ts">
const home = import.meta.env.BASE_URL
</script>

<template>
  <main class="page">
    <div class="card">
      <h1 class="maru">URLが正しくないみたい</h1>
      <p class="muted">送ってもらったURLを、もう一度確認してね。</p>
    </div>
    <a class="btn soft" :href="home">トップへ</a>
  </main>
</template>

<style scoped>
h1 { font-size: 22px; margin: 8px 0 12px; }
a { text-decoration: none; }
</style>
