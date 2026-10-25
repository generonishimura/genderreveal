(() => {
  // 性別はサーバーに保存せず、コードのハッシュ値の偶奇で表す。
  // コードを見ただけでは男女が分からないようにするため。
  const SALT = "gender-reveal-v1";
  const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const CODE_LEN = 8;

  function hash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  function genderOf(code) {
    return (hash(SALT + code) >>> 7) & 1 ? "girl" : "boy";
  }

  function randomCode() {
    const buf = new Uint32Array(CODE_LEN);
    crypto.getRandomValues(buf);
    return Array.from(buf, (n) => CHARS[n % CHARS.length]).join("");
  }

  function makeCode(gender) {
    let code;
    do { code = randomCode(); } while (genderOf(code) !== gender);
    return code;
  }

  function isValidCode(code) {
    return new RegExp(`^[${CHARS}]{${CODE_LEN}}$`).test(code);
  }

  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const code = (params.get("c") || "").toUpperCase();

  if (!params.has("c")) initHost();
  else if (isValidCode(code)) initReveal(code, params.get("f") || "");
  else $("invalid").hidden = false;

  function initHost() {
    $("host").hidden = false;
    const buttons = document.querySelectorAll(".choice");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const g = btn.dataset.g;
        buttons.forEach((b) => b.classList.toggle("dim", b !== btn));
        const c = makeCode(g);
        const url = new URL(location.href.split("?")[0]);
        url.searchParams.set("c", c);
        const from = $("from").value.trim();
        if (from) url.searchParams.set("f", from);
        $("url").value = url.toString();
        $("code").textContent = c;
        $("result").hidden = false;
      });
    });
    $("copy").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText($("url").value);
      } catch {
        $("url").select();
        document.execCommand("copy");
      }
      $("copy").textContent = "コピーしました";
      setTimeout(() => ($("copy").textContent = "コピー"), 1500);
    });
    if (navigator.share) {
      $("share").hidden = false;
      $("share").addEventListener("click", () => {
        navigator.share({ title: "Gender Reveal", text: "赤ちゃんの性別を発表します。タップして見てね。", url: $("url").value }).catch(() => {});
      });
    }
    $("again").addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("dim"));
      $("result").hidden = true;
    });
  }

  function initReveal(code, from) {
    $("reveal").hidden = false;
    if (from) $("fromText").textContent = `${from} より`;
    const gender = genderOf(code);
    const gift = $("gift");
    const hint = $("hint");
    const title = $("title");
    let step = 0;
    let busy = false;

    // 3回タップでようやく開く。タップごとに少しずつじらす。
    const teases = [
      { text: "まだかな…もう一回タップ", cls: "wiggle" },
      { text: "あと少し…最後のタップ", cls: "shake" },
    ];

    gift.classList.add("wiggle");
    gift.addEventListener("click", async () => {
      if (busy || step > teases.length) return;
      vibrate(30);
      if (step < teases.length) {
        gift.className = "gift " + teases[step].cls;
        hint.textContent = teases[step].text;
        step++;
        return;
      }
      step++;
      busy = true;
      hint.hidden = true;
      await countdown(title);
      await roulette(gender);
      gift.className = "gift open";
      title.textContent = "赤ちゃんは…";
      const answer = $("answer");
      answer.textContent = gender === "boy" ? "男の子です!" : "女の子です!";
      answer.hidden = false;
      document.body.className = "final-" + gender;
      vibrate([80, 60, 200]);
      confetti(gender);
      $("makeOwn").hidden = false;
    });
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function vibrate(p) {
    if (navigator.vibrate) navigator.vibrate(p);
  }

  async function countdown(title) {
    for (const n of ["3", "2", "1"]) {
      title.innerHTML = `<span class="count">${n}</span>`;
      vibrate(20);
      await sleep(900);
    }
    title.textContent = "赤ちゃんは…";
  }

  // 背景を青とピンクで交互に点滅させ、だんだん遅くして止める
  async function roulette(gender) {
    const body = document.body;
    let delay = 70;
    let current = "boy";
    while (delay < 520) {
      current = current === "boy" ? "girl" : "boy";
      body.className = "flash-" + current;
      await sleep(delay);
      delay *= 1.13;
    }
    if (current !== gender) {
      body.className = "flash-" + gender;
      await sleep(600);
    }
    body.className = "";
    await sleep(700);
  }

  function confetti(gender) {
    const canvas = $("confetti");
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);
    const colors = gender === "boy"
      ? ["#ffffff", "#bfe0fa", "#2f80c9", "#ffd166"]
      : ["#ffffff", "#ffd1e0", "#e0457b", "#ffd166"];
    const pieces = Array.from({ length: 180 }, () => ({
      x: innerWidth / 2,
      y: innerHeight / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 16 - 4,
      r: Math.random() * 6 + 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: colors[(Math.random() * colors.length) | 0],
    }));
    const start = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of pieces) {
        p.vy += 0.3;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        ctx.restore();
      }
      if (t - start < 6000) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(start);
  }
})();
