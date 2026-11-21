import { profile, projects, about } from './data.js';

const chapters = [...projects, about];
const $ = (sel, root = document) => root.querySelector(sel);
const pad = (n) => String(n).padStart(2, '0');
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmall = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

const state = { index: 0, mode: 'gate', entered: false, menuOpen: false };
let stage = null;

// ---------------------------------------------------------------
// 입자 장면 (WebGL 불가 시 정적 이미지로 대체)

async function initStage() {
  try {
    const { ParticleStage } = await import('./particles.js');
    stage = new ParticleStage($('#stage'), { count: isSmall ? 18000 : 56000, reducedMotion });
    stage.setMode(state.mode === 'detail' ? 'detail' : state.mode);
    if (state.mode !== 'gate') stage.show(chapters[state.index].visual);
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
    idle(() => stage.preload(chapters.map((c) => c.visual)));
  } catch (err) {
    console.warn('WebGL 장면을 사용할 수 없어 정적 배경으로 표시합니다.', err);
    document.body.classList.add('no-webgl');
    stage = null;
    updateFallback();
  }
}

function updateFallback() {
  if (stage) return;
  const v = chapters[state.index].visual;
  $('#fallback-bg').style.backgroundImage = v?.image && state.mode !== 'gate' ? `url("${v.image}")` : 'none';
}

// ---------------------------------------------------------------
// 정적 UI 채우기

function buildChrome() {
  $('#gate-name').textContent = profile.name;
  $('#gate-role').textContent = profile.role;
  $('#gate-intro').innerHTML = profile.intro.map(esc).join('<br>');
  $('#gate-enter').href = `#/${chapters[0].id}`;

  $('#menu-list').innerHTML = chapters
    .map(
      (c, i) => `
      <li>
        <a href="#/${c.id}" data-index="${i}">
          <span class="menu-no">${pad(i + 1)}</span>
          <span class="menu-title">${esc(c.title)}</span>
          <span class="menu-period">${esc(c.period || '')}</span>
        </a>
      </li>`
    )
    .join('');

  $('#menu-contacts').innerHTML = profile.contacts
    .map((c) => `<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.label)}</a>`)
    .join('');

  $('#ticks').innerHTML = chapters.map((c, i) => `<a href="#/${c.id}" aria-label="${esc(c.title)}" data-index="${i}"></a>`).join('');
  $('#total').textContent = pad(chapters.length);
}

function renderChapter(immediate = false) {
  const c = chapters[state.index];
  const box = $('#chapter');
  const apply = () => {
    $('#chapter-title').innerHTML = `${esc(c.title)}<sup>${pad(state.index + 1)}</sup>`;
    $('#chapter-sub').textContent = c.subtitle || '';
    $('#chapter-period').textContent = [c.period, c.org].filter(Boolean).join(' · ');
    $('#enter-btn').href = `#/${c.id}/view`;
    $('#current').textContent = pad(state.index + 1);
    box.classList.remove('is-changing');
  };
  if (immediate || reducedMotion) apply();
  else {
    box.classList.add('is-changing');
    setTimeout(apply, 380);
  }
  document.querySelectorAll('#ticks a, #menu-list a').forEach((a) => {
    a.classList.toggle('is-current', Number(a.dataset.index) === state.index);
  });
  document.title = state.mode === 'gate' ? `${profile.nameEn} — ${profile.role}` : `${c.title} — ${profile.nameEn}`;
}

// ---------------------------------------------------------------
// 상세 화면

function renderDetail(c, i) {
  const prev = chapters[(i - 1 + chapters.length) % chapters.length];
  const next = chapters[(i + 1) % chapters.length];
  const body = c.id === 'about' ? aboutBody() : projectBody(c);

  $('#detail-inner').innerHTML = `
    <header class="detail-head">
      <p class="kicker">${pad(i + 1)}${c.period ? ` · ${esc(c.period)}` : ''}${c.org ? ` · ${esc(c.org)}` : ''}</p>
      <h1>${esc(c.title)}</h1>
      ${c.subtitle ? `<p class="lead">${esc(c.subtitle)}</p>` : ''}
    </header>
    ${body}
    <nav class="pager" aria-label="다른 프로젝트">
      <a href="#/${prev.id}/view" class="pager-prev"><span>이전</span>${esc(prev.title)}</a>
      <a href="#/${next.id}/view" class="pager-next"><span>다음</span>${esc(next.title)}</a>
    </nav>`;
  $('#detail').scrollTop = 0;
}

function projectBody(c) {
  const out = [];
  if (c.placeholder) {
    out.push(`<p class="notice">이미지와 상세 내용은 준비 중입니다.</p>`);
  }
  if (c.meta?.length || c.links?.length) {
    const rows = (c.meta || []).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`);
    if (c.links?.length) {
      rows.push(
        `<dt>Link</dt><dd class="links">${c.links
          .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ↗</a>`)
          .join('')}</dd>`
      );
    }
    out.push(`<dl class="meta">${rows.join('')}</dl>`);
  }
  if (c.highlights?.length) {
    out.push(`<section class="block"><h2>주요 내용</h2><ul class="highlights">${c.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul></section>`);
  }
  if (c.intro?.length) {
    out.push(`<section class="block intro">${c.intro.map((p) => `<p>${esc(p)}</p>`).join('')}</section>`);
  }
  if (c.features?.length) {
    const cols = c.features.length % 3 === 0 ? 3 : 2;
    out.push(`<section class="block"><h2>핵심 기능</h2><div class="features" style="--cols:${cols}">${c.features
      .map(
        (f, n) => `<div class="feature"><span class="feature-no">${pad(n + 1)}</span><h3>${esc(f.title)}</h3><ul>${f.items
          .map((it) => `<li>${esc(it)}</li>`)
          .join('')}</ul></div>`
      )
      .join('')}</div></section>`);
  }
  const video = c.video
    ? `<section class="block"><h2>${esc(c.video.caption)}</h2><video class="video" controls playsinline preload="${c.video.poster ? 'none' : 'metadata'}"${
        c.video.poster ? ` poster="${esc(c.video.poster)}"` : ''
      } src="${esc(c.video.src)}"></video></section>`
    : '';
  if (c.video?.first) out.push(video);
  for (const s of c.sections || []) {
    out.push(`<section class="block"><h2>${esc(s.title)}</h2>${gallery(s.images)}</section>`);
  }
  if (c.video && !c.video.first) out.push(video);
  return out.join('');
}

function gallery(images) {
  const many = images.length > 1;
  const figs = images
    .map(
      ([src, alt], n) => `
      <figure>
        <button type="button" class="zoom" data-src="${esc(src)}" data-alt="${esc(alt)}" aria-label="${esc(alt)} 크게 보기">
          <img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">
        </button>
        <figcaption>${many ? `<span>${pad(n + 1)} / ${pad(images.length)}</span>` : ''}${esc(alt)}</figcaption>
      </figure>`
    )
    .join('');
  if (!many) return `<div class="gallery single">${figs}</div>`;
  return `
    <div class="gallery-wrap">
      <div class="gallery" tabindex="0">${figs}</div>
      <div class="gallery-nav">
        <button type="button" class="g-prev" aria-label="이전 이미지">←</button>
        <button type="button" class="g-next" aria-label="다음 이미지">→</button>
      </div>
    </div>`;
}

function aboutBody() {
  return `
    <section class="block intro">${profile.intro.map((p) => `<p>${esc(p)}</p>`).join('')}</section>
    <section class="block"><h2>Contact</h2>
      <dl class="meta">${profile.contacts
        .map((c) => `<dt>${esc(c.label)}</dt><dd><a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.text)}</a></dd>`)
        .join('')}</dl>
    </section>
    <section class="block"><h2>Skills</h2>
      <dl class="meta skills">${profile.skills.map((s) => `<dt>${esc(s.group)}</dt><dd>${s.items.map(esc).join(' · ')}</dd>`).join('')}</dl>
    </section>
    <section class="block"><h2>Awards / Certificates</h2>
      <ul class="timeline">${profile.credentials.map((c) => `<li><span>${esc(c.date)}</span>${esc(c.title)}</li>`).join('')}</ul>
    </section>`;
}

// ---------------------------------------------------------------
// 라우팅: #/<id> 챕터, #/<id>/view 상세

function route() {
  const [, id, view] = location.hash.replace(/^#/, '').split('/');
  const idx = chapters.findIndex((c) => c.id === id);

  if (idx < 0) {
    if (!state.entered) return setMode('gate');
    location.replace(`#/${chapters[state.index].id}`);
    return;
  }

  state.entered = true;
  const changed = idx !== state.index || state.mode === 'gate';
  state.index = idx;
  closeMenu();

  if (view === 'view') {
    renderDetail(chapters[idx], idx);
    setMode('detail');
  } else {
    setMode('browse');
  }
  if (changed) {
    renderChapter(state.mode === 'detail');
    stage?.show(chapters[idx].visual);
  }
  updateFallback();
}

function setMode(mode) {
  state.mode = mode;
  document.body.dataset.mode = mode;
  $('#gate').hidden = mode !== 'gate';
  $('#browse').inert = mode !== 'browse';
  const detail = $('#detail');
  if (mode === 'detail') {
    detail.hidden = false;
    requestAnimationFrame(() => detail.classList.add('is-open'));
    detail.focus({ preventScroll: true });
  } else {
    detail.classList.remove('is-open');
    setTimeout(() => { if (state.mode !== 'detail') detail.hidden = true; }, 500);
  }
  stage?.setMode(mode);
  if (mode === 'gate') stage?.show(null);
}

function go(delta) {
  const i = (state.index + delta + chapters.length) % chapters.length;
  location.hash = `#/${chapters[i].id}`;
}

// ---------------------------------------------------------------
// 메뉴

function openMenu() {
  state.menuOpen = true;
  const m = $('#menu');
  m.hidden = false;
  requestAnimationFrame(() => m.classList.add('is-open'));
  $('#menu-btn').setAttribute('aria-expanded', 'true');
  $('.menu-label').textContent = 'Close';
  document.body.classList.add('menu-open');
}

function closeMenu() {
  if (!state.menuOpen) return;
  state.menuOpen = false;
  const m = $('#menu');
  m.classList.remove('is-open');
  setTimeout(() => { if (!state.menuOpen) m.hidden = true; }, 450);
  $('#menu-btn').setAttribute('aria-expanded', 'false');
  $('.menu-label').textContent = 'Projects';
  document.body.classList.remove('menu-open');
}

// ---------------------------------------------------------------
// 입력

function bindEvents() {
  window.addEventListener('hashchange', route);
  $('#menu-btn').addEventListener('click', () => (state.menuOpen ? closeMenu() : openMenu()));
  $('#gate-list').addEventListener('click', openMenu);
  $('#prev').addEventListener('click', () => go(-1));
  $('#next').addEventListener('click', () => go(1));
  $('#detail-close').addEventListener('click', () => { location.hash = `#/${chapters[state.index].id}`; });

  document.addEventListener('keydown', (e) => {
    if ($('#lightbox').open) return;
    if (e.key === 'Escape') {
      if (state.menuOpen) closeMenu();
      else if (state.mode === 'detail') location.hash = `#/${chapters[state.index].id}`;
      return;
    }
    if (state.menuOpen || state.mode !== 'browse') return;
    if (e.key === 'ArrowRight') go(1);
    else if (e.key === 'ArrowLeft') go(-1);
  });

  // 휠/스와이프로 챕터 넘기기
  let acc = 0, lockUntil = 0;
  window.addEventListener('wheel', (e) => {
    if (state.mode !== 'browse' || state.menuOpen) return;
    const now = performance.now();
    if (now < lockUntil) return;
    acc += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(acc) > 60) {
      go(acc > 0 ? 1 : -1);
      acc = 0;
      lockUntil = now + 1300;
    }
  }, { passive: true });

  let touch = null;
  window.addEventListener('touchstart', (e) => { touch = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (!touch || state.mode !== 'browse' || state.menuOpen) return;
    const dx = e.changedTouches[0].clientX - touch.x;
    const dy = e.changedTouches[0].clientY - touch.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 50) go((Math.abs(dx) > Math.abs(dy) ? -dx : -dy) > 0 ? 1 : -1);
    touch = null;
  }, { passive: true });

  // 상세: 갤러리 넘기기, 이미지 확대
  $('#detail').addEventListener('click', (e) => {
    const zoom = e.target.closest('.zoom');
    if (zoom) {
      const lb = $('#lightbox');
      $('#lightbox-img').src = zoom.dataset.src;
      $('#lightbox-img').alt = zoom.dataset.alt;
      $('#lightbox-cap').textContent = zoom.dataset.alt;
      lb.showModal();
      return;
    }
    const nav = e.target.closest('.g-prev, .g-next');
    if (nav) {
      const g = nav.closest('.gallery-wrap').querySelector('.gallery');
      const step = g.querySelector('figure')?.getBoundingClientRect().width || g.clientWidth;
      g.scrollBy({ left: nav.classList.contains('g-next') ? step : -step, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  });
  const lb = $('#lightbox');
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.closest('.lightbox-close')) lb.close(); });
}

// ---------------------------------------------------------------

buildChrome();
bindEvents();
route();
renderChapter(true);
initStage();
