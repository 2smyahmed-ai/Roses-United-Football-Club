/* Roses United FC — site behaviour. Plain JS, no build step; works from file:// and any static host. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const D = window.RU, ES = window.RU_ES, UI = window.RU_UI;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
  let lang = store.get('ru-lang') === 'es' ? 'es' : 'en';
  const L = () => UI[lang];
  const tx = (o) => (o && typeof o === 'object' ? (o[lang] ?? o.en) : o);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------------- dates (league times are Pacific) ---------------- */
  const ptDate = (s) => new Date(s + (s < '2026-11-01T02:00' ? '-07:00' : '-08:00'));
  const ptParts = (date) => {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    const p = Object.fromEntries(f.formatToParts(date).map((x) => [x.type, x.value]));
    const dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
    const monIdx = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(p.month);
    const time = lang === 'es' ? `${p.hour}:${p.minute} ${p.dayPeriod === 'AM' ? 'a. m.' : 'p. m.'}` : `${p.hour}:${p.minute} ${p.dayPeriod}`;
    return { wd: L().days[dayIdx], mon: L().months[monIdx], day: p.day, time };
  };
  const games = () => D.season.games.map((g, i) => ({ ...g, i, date: ptDate(g.d) }));
  const upcoming = () => games().filter((g) => !g.res && g.date.getTime() + 2 * 36e5 > Date.now());
  const played = () => games().filter((g) => g.res).reverse();
  const outcome = (g) => (g.res[0] > g.res[1] ? 'w' : g.res[0] < g.res[1] ? 'l' : 'd');
  const initials = (n) => n.split(/\s+/).filter((w) => !/^(fc|sc|united)$/i.test(w)).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const mapUrl = (v) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(D.venues[v] || v + ' Pasadena CA');

  /* ---------------- i18n ---------------- */
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      const v = lang === 'es' ? ES[el.dataset.i18n] : null;
      el.innerHTML = v ?? el.dataset.en;
    });
    const h = $('.hero-h');
    if (h) h.setAttribute('aria-label', lang === 'es' ? 'Somos Roses United.' : 'We are Roses United.');
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }
  function setLang(l) {
    if (l === lang) return;
    lang = l; store.set('ru-lang', l);
    applyLang(); renderAll(); observeReveals(document); headerNext();
  }
  $$('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ---------------- slot renderers ---------------- */
  const R = {};

  R.nextmatch = (el) => {
    const g = upcoming()[0];
    if (!g) { el.innerHTML = ''; return; }
    const p = ptParts(g.date);
    el.innerHTML = `
      <a href="#/matches" class="nm reveal" aria-label="${esc(L().next)}: Roses United ${L().vs} ${esc(g.opp)}">
        <div class="nm-label">${L().next}<b>${p.wd} ${p.mon} ${p.day}</b></div>
        <div class="nm-teams">
          <div class="nm-team"><svg class="badge"><use href="#crest"/></svg><b>Roses</b></div>
          <span class="nm-vs">${L().vs}</span>
          <div class="nm-team"><span class="badge badge-opp">${initials(g.opp)}</span><b>${esc(g.opp)}</b></div>
        </div>
        <div class="nm-meta">
          <div class="countdown" data-countdown="${g.date.getTime()}"></div>
          <span class="nm-where"><svg><use href="#i-pin"/></svg>${p.time} · ${esc(g.venue)} · ${g.home ? L().home : L().away}</span>
        </div>
      </a>`;
  };

  const featureMatch = (g, big) => {
    const p = ptParts(g.date);
    const us = `<div class="fm-team"><svg class="badge"><use href="#crest"/></svg><b>Roses United</b></div>`;
    const them = `<div class="fm-team"><span class="badge badge-opp">${initials(g.opp)}</span><b>${esc(g.opp)}</b></div>`;
    return `
      <div class="mc-card feature-match${big ? ' reveal' : ''}">
        <h3>${L().next} · ${g.home ? L().home : L().away}</h3>
        <div class="fm-teams">${g.home ? us : them}<div class="fm-ko">${p.time.replace(/ (AM|PM|a\. m\.|p\. m\.)$/, '')}<small>${p.wd} ${p.mon} ${p.day} · ${p.time.split(' ').slice(1).join(' ')}</small></div>${g.home ? them : us}</div>
        <div class="countdown" data-countdown="${g.date.getTime()}"></div>
        <div class="fm-row">
          <a class="fm-where" href="${mapUrl(g.venue)}" target="_blank" rel="noopener"><svg><use href="#i-pin"/></svg>${esc(g.venue)} · ${L().directions}</a>
          <button class="ics" type="button" data-ics="${g.i}"><svg><use href="#i-cal"/></svg>${L().addCal}</button>
        </div>
      </div>`;
  };

  const fxRow = (g) => {
    const p = ptParts(g.date);
    const right = g.res
      ? `<span class="res">${g.res[0]}–${g.res[1]}</span><span class="pill ${outcome(g)}">${L()[{ w: 'win', d: 'draw', l: 'loss' }[outcome(g)]]}</span>`
      : `<button class="ics" type="button" data-ics="${g.i}" aria-label="${L().addCal}: ${esc(g.opp)}"><svg><use href="#i-cal"/></svg><span class="ics-t">${p.time}</span></button>`;
    return `
      <li class="fx">
        <div class="fx-date"><b>${p.day}</b><small>${p.mon}</small></div>
        <div class="fx-mid"><b>${g.home ? '' : '@ '}${esc(g.opp)}</b><span>${p.wd} · ${esc(g.venue)} · ${g.home ? L().home : L().away}</span></div>
        <div class="fx-r">${right}</div>
      </li>`;
  };

  const record = () => {
    const ps = played();
    const c = { w: 0, d: 0, l: 0, gf: 0, ga: 0 };
    ps.forEach((g) => { c[outcome(g)]++; c.gf += g.res[0]; c.ga += g.res[1]; });
    return { ...c, n: ps.length, form: ps.slice(0, 5).map(outcome) };
  };

  const recordCard = () => {
    const r = record();
    return `
      <div class="mc-card">
        <h3>${L().record} · ${tx(D.season.name)}</h3>
        <table class="table">
          <thead><tr><th>${L().team}</th><th>${L().P}</th><th>${L().W}</th><th>${L().D}</th><th>${L().L}</th><th>${L().GD}</th><th>${L().form}</th></tr></thead>
          <tbody><tr class="us"><td>Roses United U8</td><td>${r.n}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf - r.ga > 0 ? '+' : ''}${r.gf - r.ga}</td><td><div class="form-dots">${r.form.map((f) => `<i class="${f}" title="${L()[{ w: 'win', d: 'draw', l: 'loss' }[f]]}"></i>`).join('')}</div></td></tr></tbody>
        </table>
        <p class="mc-note"><svg><use href="#i-cal"/></svg><span>${L().syncNote}</span></p>
      </div>`;
  };

  R.mcpreview = (el) => {
    const up = upcoming();
    el.innerHTML = `
      <div class="wrap">
        <div class="sec-head sec-head-row">
          <div><p class="eyebrow eyebrow-ink">${esc(L().fixtures)} · ${tx(D.season.name)}</p><h2 class="display-l reveal">${L().mcPrevH}</h2></div>
          <a href="#/matches" class="link-arrow"><span>${L().allMatches}</span><svg><use href="#i-arrow"/></svg></a>
        </div>
        <div class="mc-grid">
          ${up[0] ? featureMatch(up[0], true) : ''}
          <div class="mc-card reveal"><h3>${L().upcoming}</h3><ul class="fx-list">${up.slice(1, 4).map(fxRow).join('')}</ul>
            <h3 style="margin-top:26px">${L().results}</h3><ul class="fx-list">${played().slice(0, 2).map(fxRow).join('')}</ul></div>
        </div>
      </div>`;
  };

  R.matchcentre = (el) => {
    const up = upcoming();
    const tab = el.dataset.tab || 'fx';
    el.innerHTML = `
      <div class="wrap">
        <div class="mc-grid">
          <div>
            ${up[0] ? featureMatch(up[0], false) : ''}
            <div class="mc-card" style="margin-top:18px">
              <div class="mc-tabs" role="tablist">
                <button role="tab" aria-selected="${tab === 'fx'}" data-tab="fx">${L().fixtures} (${up.length})</button>
                <button role="tab" aria-selected="${tab === 'rs'}" data-tab="rs">${L().results} (${played().length})</button>
              </div>
              <ul class="fx-list">${(tab === 'fx' ? up : played()).map(fxRow).join('')}</ul>
            </div>
          </div>
          <div>
            ${recordCard()}
            <div class="mc-card" style="margin-top:18px">
              <h3>${esc(D.season.league)} · ${tx(D.season.name)}</h3>
              <ul class="fx-list">${[...new Set(D.season.games.map((g) => g.venue))].map((v) => `
                <li class="fx" style="grid-template-columns:auto 1fr auto"><svg style="width:20px;height:20px;color:var(--rose-ink)"><use href="#i-pin"/></svg>
                <div class="fx-mid"><b>${esc(v)}</b><span>${esc((D.venues[v] || '').split(', ').slice(1).join(', '))}</span></div>
                <a class="ics" href="${mapUrl(v)}" target="_blank" rel="noopener">${L().directions}</a></li>`).join('')}</ul>
            </div>
          </div>
        </div>
      </div>`;
    $$('[data-tab]', el).forEach((b) => b.addEventListener('click', () => { el.dataset.tab = b.dataset.tab; R.matchcentre(el); tickCountdowns(); }));
  };

  /* ---- tactics board ---- */
  const pitchLines = `<svg class="lines" viewBox="0 0 105 68" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="rgba(255,255,255,.5)" stroke-width=".35">
    <rect x="2" y="2" width="101" height="64"/><line x1="52.5" y1="2" x2="52.5" y2="66"/><circle cx="52.5" cy="34" r="9.15"/>
    <rect x="2" y="13.85" width="16.5" height="40.3"/><rect x="86.5" y="13.85" width="16.5" height="40.3"/>
    <rect x="2" y="24.85" width="5.5" height="18.3"/><rect x="97.5" y="24.85" width="5.5" height="18.3"/>
    <path d="M18.5 26.7a9.15 9.15 0 0 1 0 14.6M86.5 26.7a9.15 9.15 0 0 0 0 14.6"/></g>
    <g fill="rgba(255,255,255,.6)"><circle cx="52.5" cy="34" r=".5"/><circle cx="13" cy="34" r=".4"/><circle cx="92" cy="34" r=".4"/></g></svg>`;

  const rand = (a, b) => a + Math.random() * (b - a);
  const AX = 68 / 105; // keep circles round on a 105x68 pitch
  const phasePos = {
    warm(t) {
      const pl = Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 + t * 0.55; return [50 + Math.cos(a) * 27 * AX, 50 + Math.sin(a) * 27]; });
      return { pl, coach: [50, 50], balls: pl.map(([x, y]) => [x, y, 0]), cones: Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return [50 + Math.cos(a) * 36 * AX, 50 + Math.sin(a) * 36, 1]; }), goals: 0 };
    },
    ball(t) {
      const pl = Array.from({ length: 10 }, (_, i) => { const c = i % 5, r = Math.floor(i / 5); return [18 + c * 16 + rand(-2.5, 2.5), 33 + r * 34 + rand(-4, 4)]; });
      const cx = 18 + ((Math.floor(t) % 5) * 16);
      return { pl, coach: [cx, 50], balls: pl.map(([x, y]) => [x + 2.4, y + 3, 1]), cones: Array.from({ length: 8 }, (_, i) => [10 + (i % 4) * 26.6, i < 4 ? 14 : 86, 1]), goals: 0 };
    },
    game(t) {
      const g = [[22, 30], [22, 70], [38, 20], [42, 52], [36, 82]].map(([x, y]) => [x + rand(-7, 9), y + rand(-7, 7)]);
      const o = [[78, 30], [78, 70], [62, 22], [58, 50], [64, 80]].map(([x, y]) => [x + rand(-9, 7), y + rand(-7, 7)]);
      const pl = [...g, ...o];
      const holder = pl[Math.floor(rand(0, 10))];
      const balls = pl.map(() => [50, 50, 0]); balls[0] = [holder[0] + 2, holder[1] + 2.5, 1];
      return { pl, coach: [50, 95], balls, cones: [[10, 8, 1], [90, 8, 1], [10, 92, 1], [90, 92, 1], [50, 8, 0], [50, 92, 0], [30, 8, 0], [70, 92, 0]], goals: 1 };
    },
    huddle(t) {
      const pl = Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 + 0.3; return [50 + Math.cos(a) * 9 * AX + rand(-.6, .6), 54 + Math.sin(a) * 9 + rand(-.6, .6)]; });
      return { pl, coach: [50, 38], balls: pl.map(() => [50, 40, 0]).map((b, i) => (i === 0 ? [53, 37, 1] : b)), cones: Array.from({ length: 8 }, (_, i) => [8 + i * 12, 94, 1]), goals: 0 };
    }
  };

  R.session = (el) => {
    const S = D.session;
    el.innerHTML = `
      <div class="wrap sess">
        <div class="sess-copy">
          <p class="eyebrow eyebrow-ink" style="color:var(--bib)">${L().sessEyebrow}</p>
          <h2 class="display-l reveal">${L().sessH}</h2>
          <div class="sess-tabs" role="tablist" aria-label="${esc(L().sessEyebrow)}">
            ${S.map((p, i) => `<button class="sess-tab" role="tab" type="button" aria-selected="false" data-i="${i}"><i>0${i + 1}</i><b>${tx(p.t)}</b><span class="bar"></span></button>`).join('')}
          </div>
          <p class="sess-desc" aria-live="polite"></p>
        </div>
        <div class="sess-board">
          <div class="board" role="img" aria-label="${esc(L().sessEyebrow)}">
            <div class="stripes"></div>${pitchLines}
            ${Array.from({ length: 8 }, () => '<i class="cone"></i>').join('')}
            <i class="goal"></i><i class="goal"></i>
            ${Array.from({ length: 10 }, (_, i) => `<i class="tok ${i < 5 ? 'g' : 'o'}"></i>`).join('')}
            <i class="tok k"></i>
            ${Array.from({ length: 10 }, () => '<i class="tok b"></i>').join('')}
            <figure class="board-photo"><img alt="" src="${S[0].img}.webp" loading="lazy"></figure>
          </div>
          <div class="board-cap"><span>${L().sessCap}</span><span>60:00</span></div>
        </div>
      </div>`;
    initBoard(el);
  };

  function initBoard(el) {
    const board = $('.board', el), tabs = $$('.sess-tab', el), desc = $('.sess-desc', el), photo = $('.board-photo img', el);
    const pl = $$('.tok.g, .tok.o', board), coach = $('.tok.k', board), balls = $$('.tok.b', board), cones = $$('.cone', board), goals = $$('.goal', board);
    const set = (n, [x, y], vis = 1) => { n.style.transform = `translate(${x * board.clientWidth / 100}px, ${y * board.clientHeight / 100}px)`; n.style.opacity = vis; };
    goals[0].style.left = '3%'; goals[0].style.top = '50%'; goals[0].style.transform = 'rotate(90deg)';
    goals[1].style.left = '97%'; goals[1].style.top = '50%'; goals[1].style.transform = 'rotate(-90deg)';
    let phase = 0, t = 0, timer = 0, jit = 0, visible = false;
    const dur = 5600;
    const draw = () => {
      const k = D.session[phase].k, pos = phasePos[k](t);
      pl.forEach((n, i) => set(n, pos.pl[i]));
      set(coach, pos.coach);
      balls.forEach((n, i) => set(n, pos.balls[i], pos.balls[i][2]));
      cones.forEach((n, i) => { const c = pos.cones[i]; n.style.left = c[0] + '%'; n.style.top = c[1] + '%'; n.style.opacity = c[2]; });
      goals.forEach((g) => (g.style.opacity = pos.goals));
    };
    const go = (i, user) => {
      phase = i; t = 0;
      tabs.forEach((b, j) => { b.classList.toggle('is-on', j === i); b.setAttribute('aria-selected', String(j === i)); b.style.setProperty('--dur', dur + 'ms'); });
      tabs[i].querySelector('.bar').replaceWith(Object.assign(document.createElement('span'), { className: 'bar' }));
      desc.textContent = tx(D.session[i].p);
      photo.style.opacity = 0;
      setTimeout(() => { photo.src = D.session[i].img + '.webp'; photo.onload = () => (photo.style.opacity = 1); }, 220);
      draw();
      clearTimeout(timer);
      if (!reduce && visible) timer = setTimeout(() => go((phase + 1) % D.session.length), user ? dur * 1.6 : dur);
    };
    tabs.forEach((b) => b.addEventListener('click', () => go(+b.dataset.i, true)));
    const loop = () => { if (visible && !reduce) { t += 1; draw(); } jit = setTimeout(loop, 1300); };
    new ResizeObserver(draw).observe(board);
    new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was) go(phase); if (!visible) clearTimeout(timer); }, { threshold: 0.25 }).observe(board);
    go(0); loop();
    el._cleanup = () => { clearTimeout(timer); clearTimeout(jit); };
  }

  /* ---- programs ---- */
  R.programs = (el) => {
    el.innerHTML = D.programs.map((p) => `
      <article class="jersey reveal" data-tone="${p.tone}" tabindex="0" aria-label="${esc(tx(p.t))}">
        <div class="jersey-in">
          <div class="j-face j-front">
            <figure class="j-bg" aria-hidden="true"><img src="${p.photo}.webp" alt="" loading="lazy"></figure>
            <p class="j-kicker">${tx(p.kick)}</p>
            <div class="shirt"><svg><use href="#shirt"/></svg><span class="shirt-name">${p.back}</span><span class="shirt-num">${p.n}</span></div>
            <h3>${tx(p.t)}</h3>
            <p class="j-hint">↻ ${L().jHint}</p>
          </div>
          <div class="j-face j-back">
            <span class="j-num-bg" aria-hidden="true">${p.n}</span>
            <div>
              <p class="eyebrow ${p.tone === 'rose' || p.tone === 'ink' ? 'eyebrow-paper' : ''}">${tx(p.kick)}</p>
              <h3>${tx(p.t)}</h3>
              <p>${tx(p.p)}</p>
              <ul class="j-list">${tx(p.list).map((x) => `<li><svg><use href="#i-check"/></svg><span>${x}</span></li>`).join('')}</ul>
            </div>
            <div>
              ${p.price ? `<div class="j-price"><small style="margin:0 6px 0 0">${L().jFrom}</small>${p.price}<small>${tx(p.per)}</small></div>` : `<div class="j-price" style="font-size:1.8rem">${p.id === 'team' ? L().jSeason : L().jAsk}</div>`}
              <a href="#/join?p=${p.id}" class="btn ${p.tone === 'rose' ? 'btn-ink' : p.tone === 'ink' ? 'btn-rose' : 'btn-ink'}" style="margin-top:16px"><span>${tx(p.cta)}</span><svg><use href="#i-arrow"/></svg></a>
            </div>
          </div>
        </div>
      </article>`).join('');
    $$('.jersey', el).forEach((j) => {
      j.addEventListener('click', (e) => { if (e.target.closest('a')) return; if (matchMedia('(hover: none)').matches) j.classList.toggle('is-flip'); });
      j.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { if (e.target !== j) return; e.preventDefault(); j.classList.toggle('is-flip'); } });
    });
  };

  /* ---- dressing room ---- */
  R.dressing = (el) => {
    const sq = D.squad;
    el.innerHTML = `
      <div class="wrap">
        <div class="dr-head">
          <div><p class="eyebrow">${L().drEyebrow}</p><h2 class="display-l reveal">${L().drH}</h2><p class="muted" style="margin-top:14px">${L().drP}</p></div>
          <p class="dr-lock"><svg><use href="#i-lock"/></svg>${L().drLock}</p>
        </div>
        <div class="rail"><div class="rail-row" style="--n:${sq.length}">
          ${sq.map((s, i) => `<button class="peg" type="button" data-i="${i}" aria-label="${L().drNo} ${s.n}"><span class="shirt"><svg><use href="#shirt"/></svg><b>ROSES</b><strong>${s.n}</strong></span></button>`).join('')}
        </div></div>
        <div class="dr-view">
          <div class="dr-photo"><img alt="" src="${sq[2].img}-s.webp" loading="lazy"></div>
          <div class="dr-info" aria-live="polite"><p class="eyebrow">${L().drNo}</p><div class="shirtno"></div><h3></h3><p>Roses United U8 · Spring 2026</p></div>
        </div>
      </div>`;
    const pegs = $$('.peg', el), img = $('.dr-photo img', el), no = $('.shirtno', el), cap = $('.dr-info h3', el);
    const pick = (i) => {
      pegs.forEach((p, j) => p.classList.toggle('is-on', j === i));
      const s = sq[i]; no.textContent = s.n; cap.textContent = tx(s.cap);
      const next = s.img + '-s.webp';
      if (!img.src.endsWith(next)) { img.classList.add('is-swap'); setTimeout(() => { img.src = next; img.onload = () => img.classList.remove('is-swap'); }, 260); }
      img.alt = `${L().drNo} ${s.n}: ${tx(s.cap)}`;
    };
    pegs.forEach((p) => { p.addEventListener('click', () => pick(+p.dataset.i)); p.addEventListener('mouseenter', () => matchMedia('(hover: hover)').matches && pick(+p.dataset.i)); });
    pick(2);
  };

  /* ---- film strip ---- */
  const galleryItems = () => D.gallery.map((g) => ({ ...g, full: (g.video ? g.poster : g.src) + '.webp', thumb: (g.video ? g.poster : g.src) + '-s.webp' }));
  R.strip = (el) => {
    const items = galleryItems().slice(0, 12);
    el.innerHTML = items.map((g, i) => `
      <button class="sc w${g.r}" type="button" data-i="${i}" aria-label="${esc(tx(g.cap))}">
        <img src="${g.thumb}" alt="" loading="lazy" draggable="false">
        ${g.video ? `<span class="reel-ico"><svg><use href="#i-play"/></svg></span>` : ''}
        <span class="sc-cap"><span>${esc(tx(g.cap))}</span><span>${String(i + 1).padStart(2, '0')}</span></span>
      </button>`).join('');
    $$('.sc', el).forEach((b) => b.addEventListener('click', () => { if (el.dataset.dragged === '1') return; openLb(items, +b.dataset.i); }));
    dragScroll(el);
  };
  function dragScroll(el) {
    let down = false, sx = 0, sl = 0, moved = 0;
    el.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = el.scrollLeft; el.dataset.dragged = '0'; });
    addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); if (moved > 6) { el.classList.add('is-drag'); el.dataset.dragged = '1'; } el.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; el.classList.remove('is-drag'); setTimeout(() => (el.dataset.dragged = '0'), 50); });
  }

  /* ---- gallery page ---- */
  R.gallery = (el) => {
    const items = galleryItems();
    const f = el.dataset.f || 'all';
    const cats = [['all', L().gAll], ['match', L().gMatch], ['training', L().gTraining], ['reels', L().gReels]];
    el.innerHTML = `
      <div class="wrap">
        <div class="g-filters" role="group">${cats.map(([k, n]) => `<button type="button" data-f="${k}" aria-pressed="${f === k}">${n} <small style="opacity:.6">${k === 'all' ? items.length : items.filter((g) => g.cat === k).length}</small></button>`).join('')}</div>
        <div class="masonry">${items.map((g, i) => `
          <button class="m-item reveal${f !== 'all' && g.cat !== f ? ' is-hide' : ''}" type="button" data-i="${i}" aria-label="${esc(tx(g.cap))}">
            <img src="${g.thumb}" alt="${esc(tx(g.cap))}" loading="lazy">
            ${g.video ? `<span class="reel-ico"><svg><use href="#i-play"/></svg></span>` : ''}
            <span class="sc-cap">${esc(tx(g.cap))}</span>
          </button>`).join('')}</div>
        <div class="ig-cta"><a class="btn btn-ghost btn-lg" href="${D.links.ig}" target="_blank" rel="noopener"><svg><use href="#i-ig"/></svg>${L().gMore} · @rosesunitedfc</a></div>
      </div>`;
    $$('[data-f]', el).forEach((b) => b.addEventListener('click', () => { el.dataset.f = b.dataset.f; R.gallery(el); observeReveals(el); }));
    $$('.m-item', el).forEach((b) => b.addEventListener('click', () => {
      const vis = items.filter((g) => f === 'all' || g.cat === f);
      openLb(vis, vis.indexOf(items[+b.dataset.i]));
    }));
  };

  /* ---- reviews ---- */
  R.reviews = (el) => {
    const rv = D.reviews;
    el.innerHTML = `
      <div class="wrap">
        <div class="rv-head">
          <div><p class="eyebrow">${L().rvEyebrow}</p><h2 class="display-l reveal">${L().rvH}</h2></div>
          <div class="rv-score"><b>5.0</b><div><div class="rv-stars">${'<svg><use href="#i-star"/></svg>'.repeat(5)}</div><small>${L().rvOf} · ${L().rvCount}</small></div></div>
        </div>
        <div class="rv-stage" aria-live="polite">
          ${rv.map((r, i) => `<figure class="rv-slide${i === 0 ? ' is-on' : ''}" aria-hidden="${i !== 0}"><blockquote><p>${esc(r.t)}”</p></blockquote>
            <figcaption class="rv-who"><span class="rv-av">${r.n[0]}</span><span><b>${esc(r.n)}</b><span>${L().rvParent} · Superprof</span></span></figcaption></figure>`).join('')}
        </div>
        <div class="rv-ctrl">
          <button class="rv-btn prev" type="button" aria-label="Previous review"><svg><use href="#i-arrow"/></svg></button>
          <button class="rv-btn next" type="button" aria-label="Next review"><svg><use href="#i-arrow"/></svg></button>
          <div class="rv-dots">${rv.map((_, i) => `<button type="button" aria-label="Review ${i + 1}" aria-current="${i === 0}"></button>`).join('')}</div>
          <p class="rv-src">${L().rvSrc} <a href="${D.links.superprof}" target="_blank" rel="noopener">Superprof</a></p>
        </div>
        <div class="rv-names" aria-hidden="true"><div class="rv-names-track">${[...rv, ...rv].map((r) => `<span>${esc(r.n)} ★★★★★</span>`).join('')}</div></div>
      </div>`;
    const slides = $$('.rv-slide', el), dots = $$('.rv-dots button', el);
    let i = 0, timer = 0, hold = false;
    const show = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, j) => { s.classList.toggle('is-on', j === i); s.setAttribute('aria-hidden', String(j !== i)); });
      dots.forEach((d, j) => d.setAttribute('aria-current', String(j === i)));
      clearTimeout(timer); if (!reduce) timer = setTimeout(() => !hold && show(i + 1), 7000);
    };
    $('.prev', el).onclick = () => show(i - 1);
    $('.next', el).onclick = () => show(i + 1);
    dots.forEach((d, j) => (d.onclick = () => show(j)));
    el.addEventListener('mouseenter', () => (hold = true)); el.addEventListener('mouseleave', () => { hold = false; show(i); });
    let sx = 0; el.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
    el.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); });
    show(0);
  };

  /* ---- age finder ---- */
  const ageGroup = (y) => 'U' + (2027 - y);
  const ballSize = (y) => { const u = 2027 - y; return u <= 8 ? 3 : u <= 12 ? 4 : 5; };
  R.agefinder = (el) => {
    const years = Array.from({ length: 10 }, (_, i) => 2013 + i);
    const sel = +(el.dataset.y || 2019);
    el.innerHTML = `
      <div class="af">
        <h3>${L().afH}</h3><p class="muted">${L().afP}</p>
        <div class="af-years" role="group" aria-label="${esc(L().afH)}">${years.map((y) => `<button type="button" data-y="${y}" aria-pressed="${y === sel}">${y}</button>`).join('')}</div>
        <div class="af-out" aria-live="polite"><span class="ag">${ageGroup(sel)}</span><div><p>${L().afMsg(ageGroup(sel))} <span class="muted">${L().afBall(ballSize(sel))}.</span></p><a href="#/join?y=${sel}">${L().afCta} →</a></div></div>
      </div>`;
    $$('[data-y]', el).forEach((b) => b.addEventListener('click', () => { el.dataset.y = b.dataset.y; R.agefinder(el); }));
  };

  /* ---- faq ---- */
  R.faq = (el) => {
    el.innerHTML = D.faq.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(tx(f.q))}<i aria-hidden="true"></i></summary><p>${esc(tx(f.a))}</p></details>`).join('');
  };

  R.cta = (el) => { el.innerHTML = ''; el.appendChild($('#tpl-cta').content.cloneNode(true)); applyLangTo(el); };
  function applyLangTo(root) { $$('[data-i18n]', root).forEach((n) => { if (n.dataset.en === undefined) n.dataset.en = n.innerHTML; n.innerHTML = (lang === 'es' ? ES[n.dataset.i18n] : null) ?? n.dataset.en; }); }

  function renderAll(root = document) {
    $$('[data-slot]', root).forEach((el) => { el._cleanup?.(); const f = R[el.dataset.slot]; if (f) f(el); });
    tickCountdowns();
  }

  /* ---------------- countdowns ---------------- */
  function tickCountdowns() {
    $$('[data-countdown]').forEach((el) => {
      let s = Math.max(0, Math.floor((+el.dataset.countdown - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
      const cell = (v, k) => `<span>${String(v).padStart(2, '0')}<small>${L()[k]}</small></span>`;
      el.innerHTML = cell(d, 'd') + cell(h, 'h') + cell(m, 'm') + cell(s, 's');
    });
  }
  setInterval(tickCountdowns, 1000);

  function headerNext() {
    const g = upcoming()[0], el = $('#hdNext');
    if (!g) { el.hidden = true; return; }
    const p = ptParts(g.date);
    $('.hd-next-t', el).innerHTML = L().hdNext(esc(g.opp), `${p.wd} ${p.time}`);
    el.hidden = false;
  }

  /* ---------------- calendar export ---------------- */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ics]'); if (!b) return;
    const g = games()[+b.dataset.ics];
    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const end = new Date(g.date.getTime() + 75 * 60000);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Roses United FC//Match Centre//EN', 'BEGIN:VEVENT',
      `UID:ru-${g.d}@rosesunitedfc`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(g.date)}`, `DTEND:${fmt(end)}`,
      `SUMMARY:Roses United ${g.home ? 'vs' : '@'} ${g.opp}`, `LOCATION:${(D.venues[g.venue] || g.venue).replace(/,/g, '\\,')}`,
      'DESCRIPTION:Roses United FC · Match Centre', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })), download: `roses-united-${g.d.slice(0, 10)}.ics` });
    document.body.appendChild(a); a.click(); a.remove();
    toast(L().calSaved);
  });

  let toastT = 0;
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 3200); }

  /* ---------------- lightbox ---------------- */
  const lb = $('#lb'); let lbItems = [], lbI = 0, lbLast = null;
  function openLb(items, i) {
    lbItems = items; lbLast = document.activeElement; lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    showLb(i); $('.lb-x', lb).focus();
  }
  function showLb(i) {
    lbI = (i + lbItems.length) % lbItems.length;
    const g = lbItems[lbI], m = $('.lb-media', lb);
    m.innerHTML = g.video
      ? `<video src="${g.video}" poster="${g.full}" controls autoplay playsinline></video>`
      : `<img src="${g.full}" alt="${esc(tx(g.cap))}">`;
    $('.lb-cap', lb).textContent = tx(g.cap);
    $('.lb-count', lb).textContent = `${lbI + 1} ${L().lbOf} ${lbItems.length}`;
  }
  function closeLb() { lb.classList.remove('is-open'); $('.lb-media', lb).innerHTML = ''; document.body.style.overflow = ''; setTimeout(() => (lb.hidden = true), 250); lbLast?.focus(); }
  $('.lb-x', lb).onclick = closeLb;
  $('.lb-prev', lb).onclick = () => showLb(lbI - 1);
  $('.lb-next', lb).onclick = () => showLb(lbI + 1);
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lb-fig')) closeLb(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowRight') showLb(lbI + 1); if (e.key === 'ArrowLeft') showLb(lbI - 1);
    if (e.key === 'Tab') { const f = $$('button', lb); const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  });
  let lsx = 0; lb.addEventListener('touchstart', (e) => (lsx = e.touches[0].clientX), { passive: true });
  lb.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - lsx; if (Math.abs(dx) > 50) showLb(lbI + (dx < 0 ? 1 : -1)); });
  document.addEventListener('click', (e) => {
    const v = e.target.closest('[data-video]'); if (!v) return;
    openLb([{ video: v.dataset.video, full: v.dataset.poster, cap: v.dataset.cap }], 0);
  });

  /* ---------------- join form ---------------- */
  const form = $('#joinForm');
  const bySel = $('[name="byear"]', form);
  function fillYears() {
    const cur = bySel.value;
    bySel.innerHTML = `<option value="">${L().pickYear}</option>` + Array.from({ length: 15 }, (_, i) => 2022 - i).map((y) => `<option value="${y}">${y} · ${ageGroup(y)}</option>`).join('');
    bySel.value = cur;
  }
  bySel.addEventListener('change', () => { const y = +bySel.value; $('[data-agehint]', form).textContent = y ? `${ageGroup(y)} · ${L().afFor}` : ''; });
  let step = 1;
  const showStep = (n) => {
    step = n;
    $$('.fs', form).forEach((f) => f.classList.toggle('is-on', f.dataset.step === String(n)));
    $$('.steps span', form).forEach((s, i) => { s.classList.toggle('is-on', i + 1 === n); s.classList.toggle('is-done', i + 1 < n); });
    const first = $(`.fs[data-step="${n}"] input:not([type=radio]):not([type=checkbox]), .fs[data-step="${n}"] select`, form);
    if (n > 1 && first) setTimeout(() => first.focus({ preventScroll: true }), 50);
    form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  const validate = (n) => {
    let ok = true;
    $$(`.fs[data-step="${n}"] [required]`, form).forEach((inp) => {
      const field = inp.closest('.field'); field.querySelector('.err')?.remove(); field.classList.remove('is-err');
      let msg = '';
      const v = inp.value.trim();
      if (!v) msg = L().err;
      else if (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = L().errEmail;
      else if (inp.type === 'tel' && v.replace(/\D/g, '').replace(/^1/, '').length !== 10) msg = L().errPhone;
      if (msg) { ok = false; field.classList.add('is-err'); field.insertAdjacentHTML('beforeend', `<small class="err">${msg}</small>`); inp.setAttribute('aria-invalid', 'true'); }
      else inp.removeAttribute('aria-invalid');
    });
    if (!ok) $(`.fs[data-step="${n}"] [aria-invalid]`, form)?.focus();
    return ok;
  };
  $('[name="phone"]', form).addEventListener('input', (e) => {
    const d = e.target.value.replace(/\D/g, '').replace(/^1/, '').slice(0, 10);
    e.target.value = d.length > 6 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : d.length > 3 ? `(${d.slice(0, 3)}) ${d.slice(3)}` : d;
  });
  $$('[data-next]', form).forEach((b) => b.addEventListener('click', () => validate(step) && showStep(step + 1)));
  $$('[data-prev]', form).forEach((b) => b.addEventListener('click', () => showStep(step - 1)));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(3)) return;
    const name = $('[name="player"]', form).value.trim();
    $$('.fs', form).forEach((f) => f.classList.remove('is-on'));
    const done = $('.done', form); done.hidden = false; done.classList.add('is-on');
    $('[data-done-h]', form).textContent = L().doneH(name);
    $('[data-done-p]', form).textContent = L().doneP;
    $$('.steps span', form).forEach((s) => { s.classList.remove('is-on'); s.classList.add('is-done'); });
    form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
  function prefillJoin(q) {
    const p = q.get('p'); if (p) { const r = $(`[name="program"][value="${p}"]`, form); if (r) r.checked = true; }
    const y = q.get('y'); if (y) { bySel.value = y; bySel.dispatchEvent(new Event('change')); }
  }

  /* ---------------- reveals / counts ---------------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  function observeReveals(root) { $$('.reveal:not(.is-in)', root).forEach((n) => io.observe(n)); }
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    if (reduce) return;
    const t0 = performance.now(), d = 1400;
    const step = (t) => { const k = Math.min(1, (t - t0) / d), v = to * (1 - Math.pow(1 - k, 3)); el.textContent = v.toFixed(dec); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((n) => cio.observe(n));

  /* ---------------- the roses way (scroll-linked) ---------------- */
  const wayItems = $$('.way-item'), wayPhotos = $$('.way-photo'), wayNum = $('.way-num span');
  // Desktop: the sticky photo follows the scroll. Phones: the steps advance on a timer (tap a bar or swipe to jump).
  const wayBars = $$('.way-bars button'), wayMQ = matchMedia('(max-width: 900px)'), WAY_MS = 5500;
  let wayI = 0, wayT = 0, wayVis = false;
  function wayGo(i) {
    wayI = (i + wayItems.length) % wayItems.length;
    wayItems.forEach((n, j) => n.classList.toggle('is-on', j === wayI));
    wayPhotos.forEach((n, j) => n.classList.toggle('is-on', j === wayI));
    if (wayNum) wayNum.textContent = '0' + (wayI + 1);
    wayBars.forEach((b, j) => { b.classList.remove('is-on'); b.classList.toggle('is-done', j < wayI); b.setAttribute('aria-selected', String(j === wayI)); b.style.setProperty('--wd', WAY_MS + 'ms'); });
    clearTimeout(wayT);
    if (wayMQ.matches && wayVis && !reduce) { void wayBars[wayI]?.offsetWidth; wayBars[wayI]?.classList.add('is-on'); wayT = setTimeout(() => wayGo(wayI + 1), WAY_MS); }
  }
  const wio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !wayMQ.matches) wayGo(+e.target.dataset.way); }), { rootMargin: '-45% 0px -45% 0px' });
  wayItems.forEach((n) => wio.observe(n));
  const wayGrid = $('.way-grid');
  if (wayGrid) {
    new IntersectionObserver(([e]) => { wayVis = e.isIntersecting; if (wayMQ.matches) wayVis ? wayGo(wayI) : clearTimeout(wayT); }, { threshold: 0.3 }).observe(wayGrid);
    wayBars.forEach((b, j) => b.addEventListener('click', () => wayGo(j)));
    let wx = 0;
    wayGrid.addEventListener('touchstart', (e) => (wx = e.touches[0].clientX), { passive: true });
    wayGrid.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - wx; if (wayMQ.matches && Math.abs(dx) > 50) wayGo(wayI + (dx < 0 ? 1 : -1)); });
    wayMQ.addEventListener('change', () => wayGo(wayI));
  }

  /* ---------------- hero slideshow ---------------- */
  const slides = $$('.hero-slide'), bars = $$('.hero-progress i');
  let hs = 0, hsT = 0;
  function heroGo(i) {
    hs = i % slides.length;
    slides.forEach((s, j) => s.classList.toggle('is-on', j === hs));
    bars.forEach((b, j) => { b.classList.remove('is-on'); b.classList.toggle('is-done', j < hs); });
    void bars[hs]?.offsetWidth; bars[hs]?.classList.add('is-on');
    clearTimeout(hsT); if (!reduce) hsT = setTimeout(() => heroGo(hs + 1), 4500);
  }

  /* ---------------- header / scroll ---------------- */
  const hd = $('#hd'), mbar = $('#mbar'), seal = $('.seal-ring');
  let lastY = scrollY, ticking = false;
  function onScroll() {
    const y = scrollY;
    hd.classList.toggle('is-solid', y > 30);
    const menuOpen = !$('#menu').hidden;
    hd.classList.toggle('is-hidden', !menuOpen && y > 500 && y > lastY + 4);
    if (y < lastY - 4 || y < 500) hd.classList.remove('is-hidden');
    mbar.classList.toggle('is-on', y > innerHeight * 0.6);
    if (seal && !reduce) seal.style.transform = `rotate(${y * 0.12}deg)`;
    lastY = y; ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* ---------------- mobile menu ---------------- */
  const burger = $('.burger'), menu = $('#menu');
  $$('.menu-nav a').forEach((a, i) => a.style.setProperty('--i', i));
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); document.body.style.overflow = 'hidden'; hd.classList.add('is-solid'); }
    else { menu.classList.remove('is-open'); menu.hidden = true; document.body.style.overflow = ''; onScroll(); }
  }
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });

  /* ---------------- router ---------------- */
  const pages = $$('.page');
  const wipe = $('.wipe');
  let current = null, first = true;
  function parse() {
    const h = location.hash.replace(/^#\/?/, '');
    const [path, qs] = h.split('?');
    const name = path.split('/')[0] || 'home';
    return { name: pages.some((p) => p.dataset.page === name) ? name : 'home', q: new URLSearchParams(qs || '') };
  }
  function show({ name, q }) {
    pages.forEach((p) => (p.hidden = p.dataset.page !== name));
    const page = pages.find((p) => p.dataset.page === name);
    document.body.dataset.page = name;
    document.title = page.dataset.title;
    $$('[data-nav]').forEach((a) => a.classList.toggle('is-on', a.dataset.nav === name));
    $$('[data-nav]').forEach((a) => (a.dataset.nav === name ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
    scrollTo(0, 0);
    observeReveals(page);
    $$('[data-count]', page).forEach((n) => cio.observe(n));
    if (name === 'home') { const hero = $('.hero'); hero.classList.remove('is-in'); requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-in'))); heroGo(0); }
    else clearTimeout(hsT);
    if (name === 'join') prefillJoin(q);
    current = name; onScroll();
  }
  function route() {
    const r = parse();
    if (!menu.hidden) setMenu(false);
    if (first || reduce || r.name === current) { first = false; show(r); if (!reduce && r.name === current) {} return; }
    wipe.classList.remove('is-out'); wipe.classList.add('is-in');
    setTimeout(() => { show(r); wipe.classList.remove('is-in'); wipe.classList.add('is-out'); setTimeout(() => wipe.classList.remove('is-out'), 520); }, 400);
  }
  addEventListener('hashchange', route);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#/"]');
    if (a && a.getAttribute('href') === location.hash) { e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); if (!menu.hidden) setMenu(false); }
  });

  /* ---------------- boot ---------------- */
  applyLang();
  fillYears();
  renderAll();
  headerNext();
  route();
  const reLang = () => { fillYears(); };
  $$('.lang button').forEach((b) => b.addEventListener('click', reLang));
})();
