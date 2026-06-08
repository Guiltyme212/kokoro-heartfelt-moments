/* =====================================================
   Kokoro — onboarding flow engine + renderers
   Content lives in quiz-data.js (STEPS, SECTIONS).
   Hero lives in the HTML; every step after it is rendered
   from STEPS into #flow.
   ===================================================== */

/* ---------- hero video: reliable autoplay + no-range fallback ---------- */
(function heroVideo(){
  const v = document.querySelector('.hero-vid');
  if(!v || v.tagName !== 'VIDEO') return;
  v.muted = true; v.playsInline = true;
  const ready = ()=> v.classList.add('ready');
  const play = ()=>{ const p = v.play(); if(p && p.catch) p.catch(()=>{}); };
  v.addEventListener('playing', ready);
  v.addEventListener('timeupdate', ()=>{ if(v.currentTime>0) ready(); });
  play();
  // Some hosts (and this preview) don't serve HTTP range requests, which
  // stalls <video> streaming. Full-download via fetch → blob always works.
  const file = v.getAttribute('src');
  fetch(file).then(r=> r.ok ? r.blob() : Promise.reject()).then(b=>{
    if(v.readyState >= 3) return;            // already streaming fine
    v.src = URL.createObjectURL(b); v.load();
    v.addEventListener('loadeddata', play, {once:true});
    play();
  }).catch(()=>{});
  ['pointerdown','touchstart','click'].forEach(ev=> addEventListener(ev, play, {once:true}));
  document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) play(); });
})();

/* ---------- fit the flat screen to the viewport ----------
   Phones: lock the design to its native 390px width (so every horizontal
   coordinate stays pixel-perfect), scale to fill the width exactly, and
   stretch the height to fill the screen — no cream letterbox bars on any
   device, and the flat-flex layout absorbs the height difference.
   Desktop: show the phone as a centred card that fits the window height. */
(function fit(){
  const f = document.getElementById('frame');
  const DESIGN_W = 390, DESIGN_H = 844;
  function resize(){
    // visualViewport is the source of truth on iOS (accounts for the URL bar)
    const vv = window.visualViewport;
    const vw = Math.round(vv ? vv.width  : window.innerWidth);
    const vh = Math.round(vv ? vv.height : window.innerHeight);
    let ih = DESIGN_H; // internal (design-space) height of the frame
    if(vw <= 600){
      const s = vw / DESIGN_W;          // fill width exactly
      ih = vh / s;                      // → scaled height == vh, fills the screen
      f.style.width  = DESIGN_W + 'px';
      f.style.height = ih + 'px';
      f.style.transform = 'scale(' + s + ')';
    } else {
      const s = Math.min(vh / DESIGN_H, 1);
      f.style.width  = DESIGN_W + 'px';
      f.style.height = DESIGN_H + 'px';
      f.style.transform = 'scale(' + s + ')';
    }
    // tag short canvases (e.g. iPhone SE) so the hero can tighten up
    f.classList.toggle('short', ih < 760);
  }
  addEventListener('resize', resize);
  addEventListener('orientationchange', resize);
  if(window.visualViewport) visualViewport.addEventListener('resize', resize);
  resize();
})();

/* ---------- progress precompute (named-section goal-gradient) ---------- */
const FIRST = STEPS.findIndex(s=>s.sec!=null);
const LAST  = STEPS.findIndex(s=>s.last);
STEPS.forEach((s,i)=>{
  /* V1: FRONT-LOADED curve — race to ~50% in the first few cheap steps, then
     crawl (ease-out t^0.45). Starts at 14% (never 0); never resets. */
  const t = (i-FIRST)/(LAST-FIRST);
  s._pct = i<=FIRST ? 14 : i>=LAST ? 97 : Math.round(14 + Math.pow(t, 0.45)*83);
});

/* ---------- icon library ---------- */
const ICONS = {
  brain:'<path d="M12 3a4 4 0 0 0-4 4c-1.7.5-3 2-3 4a4 4 0 0 0 2 3.5V17a3 3 0 0 0 6 0M12 3a4 4 0 0 1 4 4c1.7.5 3 2 3 4a4 4 0 0 1-2 3.5V17a3 3 0 0 1-6 0"/>',
  weight:'<path d="M12 4v10m0 0-4-4m4 4 4-4M5 20h14"/>',
  lock:'<rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  bolt:'<path d="M13 2 4.5 13H11l-1 9 8.5-11H12z"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m15 9-3.5 1.5L10 14l3.5-1.5z"/>',
  sprout:'<path d="M12 3v6m0 0 3.5 11.5M12 9 8.5 20.5M6 7l6 2 6-2"/>',
  moon:'<path d="M21 12.8A8 8 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/>',
  phone:'<rect x="6" y="3" width="12" height="18" rx="3"/><path d="M11 18h2"/>',
  chat:'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  dice:'<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.1"/><circle cx="15" cy="15" r="1.1"/>',
  feather:'<path d="M20 4C11 4 6 9 5 16l-2 5 5-2c7-1 12-6 12-15z"/><path d="M16 8 7 17"/>',
  heart:'<path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',
  wind:'<path d="M3 8h10a3 3 0 1 0-3-3M3 16h13a3 3 0 1 1-3 3"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  star:'<path d="M12 3l2.6 5.6L21 9.5l-4.5 4.3L17.7 21 12 17.6 6.3 21l1.2-7.2L3 9.5l6.4-.9z"/>',
  anchor:'<circle cx="12" cy="5" r="2"/><path d="M12 7v13M5 13a7 7 0 0 0 14 0M3 13h2M19 13h2"/>',
  eyeoff:'<path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.4 5.2A9 9 0 0 1 21 12a9.7 9.7 0 0 1-2 3M6.1 6.1A9.7 9.7 0 0 0 3 12a9 9 0 0 0 12 6"/>',
  sparkle:'<path d="M12 3l1.8 4.7L18 9l-4.2 1.3L12 15l-1.8-4.7L6 9z"/>',
  bell:'<path d="M6 9a6 6 0 0 1 12 0c0 7 2 8 2 8H4s2-1 2-8"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  venus:'<circle cx="12" cy="8" r="5"/><path d="M12 13v8M8.5 18h7"/>',
  mars:'<circle cx="10" cy="14" r="5"/><path d="M14 10l6-6M15 4h5v5"/>'
};
function svg(k,s){ s=s||18; return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[k]||'')+'</svg>'; }
const I_BACK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
const I_PLAY='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const I_CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"/></svg>';
const I_ARROW='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
const I_APPLE='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 12.6a4.7 4.7 0 0 1 2.3-4 4.9 4.9 0 0 0-3.8-2.1c-1.6-.2-3.2 1-4 1-.8 0-2.1-.9-3.5-.9a5.1 5.1 0 0 0-4.3 2.6c-1.9 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.3 2.6 1.3 0 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.6a10 10 0 0 0 1.5-3.3 4.6 4.6 0 0 1-2.8-4.3zM15.4 4.9A4.6 4.6 0 0 0 16.4 1.5c-1 .1-2 .6-2.8 1.4-.7.8-1.1 1.8-1 2.9 1.1 0 2.2-.5 2.8-1.3z"/></svg>';
const I_GOOGLE='<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.6 0-1.2-.2-1.8H12v3.5h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1z"/></svg>';

/* ---------- state ---------- */
const flowEl = document.getElementById('flow');
const heroEl = document.getElementById('scr-hero');
let pos = 0;
const state = { answers:{}, plan:0, name:'', email:'' };
function lab(k,f){ const a=state.answers[k]; return (a&&a.label)?a.label:f; }

/* ---------- chrome ---------- */
function panel(inner){ return '<div class="panel anim">'+inner+'</div>'; }
function topbar(s){
  const label = s.last ? 'last one' : (s.sec!=null ? SECTIONS[s.sec] : '');
  return '<div class="topbar"><button class="iconbtn" data-act="back" aria-label="Back">'+I_BACK+'</button>'+
    '<div class="progress"><i style="width:'+s._pct+'%"></i></div><div class="seclbl">'+label+'</div></div>';
}
function miniback(){ return '<div class="minihead"><button class="iconbtn" data-act="back" aria-label="Back">'+I_BACK+'</button><span class="mk">\u5fc3</span><span class="nmm">kokoro</span></div>'; }
/* resource resolver — uses bundler-injected window.__resources[id] when present
   (standalone export), else falls back to the on-disk asset path (dev). */
function aset(id, path){ return (window.__resources && window.__resources[id]) ? window.__resources[id] : path; }

function asker(){ return '<div class="asker"><div class="ava"><img class="ava-poster" src="'+aset('peakPng','../assets/kokoro-peak.png')+'" alt=""/><video class="ava-vid" src="'+aset('peakVid','../assets/kokoro-peak-web.mp4')+'" loop muted playsinline preload="auto"></video></div><div class="meta"><div class="name"><span class="jp">\u5fc3</span> kokoro</div><div class="role"><span class="live"></span>understanding you</div></div></div>'; }

/* peek-video avatar: cache one blob, reuse across every screen (no-range safe) */
let _peekURL = null, _peekFetching = false;
function mountAvaVideo(v){
  if(!v || v.tagName !== 'VIDEO') return;
  v.muted = true; v.playsInline = true;
  const ready = ()=> v.classList.add('ready');
  const play = ()=>{ const p = v.play(); if(p && p.catch) p.catch(()=>{}); };
  v.addEventListener('playing', ready);
  v.addEventListener('timeupdate', ()=>{ if(v.currentTime>0) ready(); });
  if(_peekURL){ v.src = _peekURL; v.load(); play(); return; }
  play();
  if(!_peekFetching){
    _peekFetching = true;
    fetch(aset('peakVid','../assets/kokoro-peak-web.mp4')).then(r=> r.ok ? r.blob() : Promise.reject())
      .then(b=>{ _peekURL = URL.createObjectURL(b); }).catch(()=>{});
  }
  const tryBlob = ()=>{ if(_peekURL && v.isConnected && v.readyState < 3){ v.src = _peekURL; v.load(); play(); } };
  setTimeout(tryBlob, 1200); setTimeout(tryBlob, 2800);
}

/* ---------- renderers ---------- */
const R = {};

R.stmt = s => panel(miniback()+
  '<div class="stmt"><div class="stmt-mascot"><img class="sm-poster" src="'+aset('peakPng','../assets/kokoro-peak.png')+'" alt=""/><video class="ava-vid sm-vid" src="'+aset('peakVid','../assets/kokoro-peak-web.mp4')+'" loop muted playsinline preload="auto"></video></div><div class="stmt-eye">'+s.eyebrow+'</div><h2>'+s.h2+'</h2>'+(s.p?'<div class="stmt-p">'+s.p+'</div>':'')+'</div>'+
  '<div class="qfoot"><button class="cta" data-act="next">'+s.cta+'</button></div>');

R.single = s => {
  const opts = s.options.map(o=>{
    const ic = o.icon ? '<span class="glyph">'+svg(o.icon)+'</span>' : '';
    const body = o.sub
      ? '<span class="lblwrap"><span class="lbl">'+o.label+'</span><span class="sub">'+o.sub+'</span></span>'+(o.best?'<span class="badge-best">most chosen</span>':'')
      : '<span class="lbl">'+o.label+'</span>';
    return '<button class="opt" data-v="'+o.v+'">'+ic+body+'<span class="tick"></span></button>';
  }).join('');
  return panel(topbar(s)+asker()+'<div class="qbody"><h2 class="qtitle">'+s.title+'</h2>'+(s.help?'<p class="qhelp">'+s.help+'</p>':'')+
    '<div class="opts">'+opts+'</div><div style="flex:1;min-height:10px"></div></div>');
};

R.multi = s => {
  const chips = s.options.map(o=>'<button class="chp" data-v="'+(o.label)+'">'+o.label+'</button>').join('');
  return panel(topbar(s)+asker()+'<div class="qbody"><h2 class="qtitle">'+s.title+'</h2>'+(s.help?'<p class="qhelp">'+s.help+'</p>':'')+
    '<div class="chips">'+chips+'</div><div style="flex:1;min-height:10px"></div></div>'+
    '<div class="qfoot"><button class="cta" data-act="next" disabled>continue</button></div>');
};

R.slider = s => panel(topbar(s)+asker()+'<div class="qbody"><h2 class="qtitle">'+s.title+'</h2>'+(s.help?'<p class="qhelp">'+s.help+'</p>':'')+
  '<div class="gauge"><div class="gauge-readout"><div class="gauge-num" id="gNum">5<span>/10</span></div><div class="gauge-word" id="gWord">manageable</div></div>'+
  '<div class="track" id="track"><div class="fill" id="gFill"></div><div class="thumb" id="gThumb"></div></div>'+
  '<div class="track-ends"><span>'+s.ends[0]+'</span><span>'+s.ends[1]+'</span></div>'+
  '<div class="reflect" id="gReflect"><div class="rk"></div><p id="gReflectText"></p></div></div>'+
  '<div style="flex:1;min-height:8px"></div></div><div class="qfoot"><button class="cta" data-act="next">continue</button></div>');

/* resonance phrasing — quote + felt-temperature scale (the standout pattern, honest version) */
R.relate = s => {
  const ticks = [0,1,2,3,4].map(()=>'<span></span>').join('');
  return panel(topbar(s)+asker()+
    '<div class="qbody rel"><div class="rel-eye">does this land?</div>'+
    '<blockquote class="rel-quote">\u201c'+s.quote+'\u201d</blockquote>'+
    '<div class="rel-slider"><div class="track" id="relTrack"><div class="rel-ticks">'+ticks+'</div><div class="fill" id="relFill"></div><div class="thumb" id="relThumb"></div></div>'+
    '<div class="scale-ends"><span>not me</span><span>that\u2019s me</span></div></div>'+
    '<div class="rel-reflect" id="relRef"><div class="rk"></div><p id="relRefText"></p></div>'+
    '<div style="flex:1;min-height:8px"></div></div>'+
    '<div class="qfoot"><button class="cta" data-act="next" id="relCta" disabled>continue</button></div>');
};

R.reflect = s => panel(miniback()+'<div class="qbody"><h2 class="qtitle">'+s.h2+'</h2>'+
  '<div class="loop">'+
    '<div class="loop-item" style="animation-delay:.05s"><div class="li" style="background:var(--sunset)">'+svg('heart',16)+'</div><div><div class="lt">'+s.loop[0]+'</div><div class="ls">the thing you\u2019re actually carrying</div></div></div>'+
    '<div class="loop-arrow">\u2193</div>'+
    '<div class="loop-item" style="animation-delay:.2s"><div class="li" style="background:var(--ink-soft)">'+svg('phone',16)+'</div><div><div class="lt">'+s.loop[1]+'</div><div class="ls">it works \u2014 for about an hour</div></div></div>'+
    '<div class="loop-arrow">\u2193</div>'+
    '<div class="loop-item" style="animation-delay:.35s"><div class="li" style="background:var(--moss)">'+svg('wind',16)+'</div><div><div class="lt">'+s.loop[2]+'</div><div class="ls">because it never got processed</div></div></div>'+
  '</div><div style="flex:1;min-height:8px"></div></div>'+
  '<div class="qfoot"><button class="cta" data-act="next">'+s.cta+'</button></div>');

/* honest authority — explains a mechanism, never claims efficacy */
R.fact = s => panel(miniback()+
  '<div class="stmt fact"><div class="fact-kanji">'+s.kanji+'</div>'+
  '<div class="stmt-eye">'+s.eyebrow+'</div><h2>'+s.h2+'</h2>'+
  '<div class="stmt-p">'+s.p+'</div>'+
  '<div class="fact-src">'+svg('sparkle',13)+'<span>'+s.src+'</span></div></div>'+
  '<div class="qfoot"><button class="cta" data-act="next">'+s.cta+'</button></div>');

/* congruent social proof — a real testimonial, matched to the moment */
R.testimonial = s => panel(miniback()+
  '<div class="qbody"><div class="testi">'+
    '<div class="testi-stars">'+'\u2605'.repeat(s.stars)+'</div>'+
    '<blockquote class="testi-q">\u201c'+s.quote+'\u201d</blockquote>'+
    '<div class="testi-by"><div class="testi-ava">'+s.name.charAt(0)+'</div>'+
      '<div><div class="testi-nm">'+s.name+', '+s.age+'</div><div class="testi-sub">'+s.sub+'</div></div></div>'+
  '</div><div style="flex:1;min-height:8px"></div></div>'+
  '<div class="qfoot"><button class="cta" data-act="next">continue</button></div>');

R.name = s => panel(miniback()+
  '<div class="qbody"><h2 class="qtitle">'+s.title+'</h2><p class="qhelp">'+s.help+'</p>'+
  '<div class="namebox"><span class="namebox-mark">'+svg('feather',18)+'</span><input class="namebox-field" id="nameField" type="text" placeholder="'+s.placeholder+'" aria-label="Your name" autocomplete="given-name" enterkeyhint="done"/></div>'+
  '<div class="privacy" style="margin-top:18px">'+svg('lock',13)+' just for kokoro. never shown, never sold.</div>'+
  '<div style="flex:1;min-height:8px"></div></div>'+
  '<div class="qfoot"><button class="cta" data-act="next" id="nameCta" disabled>continue</button></div>');

/* the shape of the work — honest curve, no fake percentages */
R.chart = s => {
  const fig = '<svg class="curve" viewBox="0 0 300 156" preserveAspectRatio="none" aria-hidden="true">'+
    '<line class="ax" x1="12" y1="130" x2="290" y2="130"/>'+
    '<path class="area" d="M14 124 C 80 122 110 112 150 92 S 250 48 288 28 L288 130 L14 130 Z"/>'+
    '<path class="line" d="M14 124 C 80 122 110 112 150 92 S 250 48 288 28"/>'+
    '<circle class="mk" cx="150" cy="92" r="6"/>'+
  '</svg>';
  const axis = '<div class="chart-axis"><span>day 1</span><span class="mid">day 4</span><span>day 7</span></div>';
  return panel(miniback()+'<div class="qbody"><div class="stmt-eye">'+s.eyebrow+'</div>'+
    '<h2 class="qtitle">'+s.title+'</h2>'+
    '<div class="chart-card">'+fig+'<div class="chart-flag">first real shift</div>'+axis+'</div>'+
    '<p class="chart-p">'+s.p+'</p>'+
    '<div class="chart-note">'+svg('feather',14)+'<span>'+s.note+'</span></div>'+
    '<div style="flex:1;min-height:10px"></div></div>'+
    '<div class="qfoot"><button class="cta" data-act="next">'+s.cta+'</button></div>');
};

/* the Kokoro Map — reflects the user back in their own words (never a diagnosis) */
function mapCard(kanji, reading, label, value, tone){
  return '<div class="map-card t-'+tone+'"><div class="mc-kanji">'+kanji+'</div>'+
    '<div class="mc-body"><div class="mc-reading">'+reading+'</div><div class="mc-label">'+label+'</div>'+
    '<div class="mc-value">'+value+'</div></div></div>';
}
R.map = s => {
  const nm = state.name || 'your';
  const want   = lab('want','lighter');
  const carry  = lab('carrying', lab('coping','what you named'));
  const tone   = lab('tone','warm');
  const style  = lab('style','a gentle sit');
  const length = lab('length','7 minutes');
  return panel(miniback()+
    '<div class="qbody map"><div class="map-eye">'+(nm==='your'?'your':nm+'\u2019s')+' kokoro map</div>'+
    '<h2 class="qtitle map-h">you don\u2019t need more motivation. you need <em>emotional repetition</em> until your next self feels normal.</h2>'+
    '<div class="map-cards">'+
      mapCard('\u611f','feeling \u00b7 kan','what you want to feel', want, 'sunset')+
      mapCard('\u601d','thought \u00b7 shi','what\u2019s in the way', carry, 'ink')+
      mapCard('\u5fd7','will \u00b7 shi','your first move', tone+' \u00b7 '+style+' \u00b7 '+length, 'moss')+
    '</div><div style="flex:1;min-height:10px"></div></div>'+
    '<div class="qfoot"><button class="cta" data-act="next">this is me</button></div>');
};

R.loading = s => panel('<div class="loading">'+
  '<div class="load-main" data-main>'+
    '<div class="ldisc"><img src="'+aset('meditatePng','../assets/kokoro-meditate.png')+'" alt="Kokoro"/></div>'+
    '<div class="load-pct" data-pct>0%</div>'+
    '<div class="load-title">'+s.title+'</div>'+
    '<div class="load-steps">'+ s.steps.map((t,i)=>'<div class="load-step" data-i="'+i+'"><div class="lc"></div>'+t+'</div>').join('') +'</div>'+
    (s.quotes ? '<div class="load-quotes" data-quotes>'+s.quotes.map((q,i)=>'<span class="lq'+(i===0?' on':'')+'">'+q+'</span>').join('')+'</div>' : '')+
  '</div>'+
  (s.interrupt ? '<div class="intr" data-intr hidden><div class="intr-eye">one quick thing</div><h3 class="intr-q">'+s.interrupt.q+'</h3>'+
     '<div class="opts">'+s.interrupt.options.map(o=>'<button class="opt" data-v="'+o.v+'"><span class="glyph">'+svg(o.icon)+'</span><span class="lbl">'+o.label+'</span><span class="tick"></span></button>').join('')+'</div></div>' : '')+
  '</div>');

R.preview = s => {
  const tone = lab('tone','warm');
  const bars = Array.from({length:40},(_,i)=>'<span style="height:'+(18+Math.round(Math.abs(Math.sin(i*0.7))*78))+'%"></span>').join('');
  return panel(miniback()+'<div class="qbody"><h2 class="qtitle">'+s.title+'</h2><p class="qhelp">'+s.help+'</p>'+
    '<div class="pc-amb" aria-hidden="true"></div><div class="preview-card is-locked pc-pop"><div class="pc-burst" aria-hidden="true"></div><div class="pc-ready"><span class="pc-ready-ck">'+I_CHECK+'</span>ready</div><div class="pc-head"><div class="pc-ava"></div><div><div class="pc-eye">your session \u00b7 '+tone+' voice</div><div class="pc-title">'+s.cardTitle+'</div></div></div>'+
    '<div class="pc-meta">'+svg('clock',14)+'<span>'+s.metaLen+'</span></div>'+
    '<div class="pc-locked"><div class="pc-wave muted live">'+bars+'</div>'+
      '<div class="pc-lockface"><span class="pc-lockbtn">'+svg('lock',20)+'<span class="pc-glow"></span></span><span class="pc-locktext">'+s.locked+'</span></div></div>'+
    '</div>'+
    '<div class="pc-bonus">'+svg('sparkle',14)+'<span>your 7-day reset is queued, too</span></div>'+
    '<div style="flex:1;min-height:12px"></div></div>'+
    '<div class="qfoot"><button class="cta cta-shine" data-act="next">unlock now</button></div>');
};

R.email = s => panel(miniback()+'<div class="qbody"><h2 class="qtitle">'+s.q+'</h2><p class="qhelp">'+s.help+'</p>'+
  '<div class="auth"><div class="email-row"><input class="email-field" type="email" inputmode="email" placeholder="you@email.com" aria-label="Email"/><button class="email-go" data-act="next" aria-label="Save">'+I_ARROW+'</button></div></div>'+
  '<div class="privacy" style="margin-top:18px">'+svg('lock',13)+' only used to save your plan. never posted, never sold.</div>'+
  '<div style="flex:1;min-height:8px"></div></div>');

/* honest before/after — stacked, framed as an aim not a guarantee */
R.beforeafter = s => panel(miniback()+'<div class="qbody"><div class="stmt-eye">'+s.eyebrow+'</div><h2 class="qtitle">'+s.title+'</h2>'+
  '<div class="ba">'+
    '<div class="ba-card now"><div class="ba-head">tonight</div>'+s.now.map(t=>'<div class="ba-row">'+t+'</div>').join('')+'</div>'+
    '<div class="ba-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 13l7 7 7-7"/></svg></div>'+
    '<div class="ba-card after"><div class="ba-head">in 7 days</div>'+s.after.map(t=>'<div class="ba-row"><span class="ba-tick">'+I_CHECK+'</span>'+t+'</div>').join('')+'</div>'+
  '</div>'+
  '<div class="chart-note">'+svg('feather',14)+'<span>'+s.note+'</span></div>'+
  '<div style="flex:1;min-height:8px"></div></div>'+
  '<div class="qfoot"><button class="cta" data-act="next">'+s.cta+'</button></div>');

R.trust = s => {
  const ava = ['s','m','j','a','r','l'].map((c,i)=>'<span class="tav v'+(i%3)+'">'+c+'</span>').join('');
  return panel(miniback()+'<div class="qbody"><h2 class="qtitle">'+s.title+'</h2>'+
    '<div class="trust-stats">'+
      '<div class="tstat"><div class="tnum">'+s.stat+'</div><div class="tlbl">'+s.statLabel+'</div></div>'+
      '<div class="tstat"><div class="tnum">'+s.rating+' <span class="tstar">\u2605</span></div><div class="tlbl">'+s.ratingLabel+'</div></div>'+
    '</div>'+
    '<div class="trust-row">'+ava+'</div>'+
    '<div class="trust-chips">'+s.chips.map(c=>'<span class="tchip">'+c+'</span>').join('')+'</div>'+
    '<div style="flex:1;min-height:8px"></div></div>'+
    '<div class="qfoot"><button class="cta" data-act="next">'+s.cta+'</button></div>');
};

R.commit = s => {
  const goal = lab('goal','feel like myself again');
  const pledge = s.pledge.replace('{goal}', goal);
  return panel(miniback()+'<div class="qbody commit-body">'+
    '<div class="commit-eye">'+s.eye+'</div>'+
    '<h2 class="qtitle">'+s.title+'</h2>'+
    '<div class="pledge"><span class="pledge-mark">\u201c</span><p>'+pledge+'</p><div class="pledge-by">'+s.by+'</div></div>'+
    '<div style="flex:1;min-height:14px"></div>'+
    '<div class="hold-wrap">'+
      '<button class="hold" data-hold aria-label="Hold to commit">'+
        '<svg class="hold-ring" viewBox="0 0 120 120"><circle class="hr-bg" cx="60" cy="60" r="54"/><circle class="hr-fg" cx="60" cy="60" r="54"/></svg>'+
        '<span class="hold-label">hold<br/>to commit</span>'+
        '<span class="hold-check">'+I_CHECK+'</span>'+
      '</button>'+
      '<div class="hold-hint" data-hint>press &amp; hold for 3 seconds</div>'+
    '</div></div>');
};

R.paywall = s => {
  const nm = state.name ? state.name+'\u2019s' : 'your';
  const plans = s.plans.map((p,i)=>
    '<div class="plan'+(i===0?' is-on':'')+'" data-i="'+i+'">'+
      (p.best?'<span class="besttag">best value</span>':'')+
      '<div class="radio"></div>'+
      '<div class="pn"><b>'+p.name+'</b><span>'+p.note+'</span></div>'+
      '<div class="pp">'+(p.anchor?'<s>'+p.anchor+'</s> ':'')+p.price+
        (p.save?'<span class="psave">'+p.save+'</span>':'')+
        '<small>'+p.perDay+'</small></div>'+
    '</div>').join('');
  const cards = '<div class="pay-cards">'+
    '<span class="pc-badge pc-pay">'+I_APPLE+'Pay</span>'+
    '<span class="pc-badge pc-pay">'+I_GOOGLE+'Pay</span>'+
    '<span class="pc-badge pc-visa">VISA</span>'+
    '<span class="pc-badge pc-mc"><i></i><i></i></span>'+
    '<span class="pc-badge pc-amex">AMEX</span></div>';
  const reasons = s.reasons ? '<div class="pw-reasons"><div class="pw-rh">why people stay</div>'+
    s.reasons.map(r=>'<div class="pw-reason"><span class="pr-k">'+r.k+'</span><span class="pr-v">'+r.v+'</span></div>').join('')+'</div>' : '';
  /* value stack \u2014 everything included, each with a struck "\u00e0 la carte" worth */
  const stack = s.valueStack ? '<div class="vstack"><div class="vstack-h">everything you\u2019re getting</div>'+
    s.valueStack.map(v=>'<div class="vstack-row"><span class="vs-ck">'+I_CHECK+'</span><span class="vs-k">'+v.k+'</span><span class="vs-v">'+(v.was?'<s>'+v.was+'</s>':'')+'</span></div>').join('')+
    (s.valueTotal ? '<div class="vstack-tot"><span class="vs-k">total value</span><span class="vs-v"><s>'+s.valueTotal+'</s></span></div>' : '')+'</div>' : '';
  /* cost comparison \u2014 anchor against a real-world price (therapy session) */
  const compare = s.compare ? '<div class="pw-compare"><div class="pwc-col pwc-them"><div class="pwc-lbl">'+s.compare.themLbl+'</div><div class="pwc-price">'+s.compare.themPrice+'</div><div class="pwc-sub">'+s.compare.themSub+'</div></div>'+
    '<div class="pwc-vs">vs</div>'+
    '<div class="pwc-col pwc-us"><div class="pwc-lbl">'+s.compare.usLbl+'</div><div class="pwc-price">'+s.compare.usPrice+'</div><div class="pwc-sub">'+s.compare.usSub+'</div></div></div>' : '';
  return panel(miniback()+'<div class="qbody pw">'+
    '<div class="pw-timer" data-timer>'+svg('clock',15)+'<span>your discount is held for</span><b data-clock>10:00</b></div>'+
    '<div class="pw-disc"><img src="'+aset('meditatePng','../assets/kokoro-meditate.png')+'" alt="Kokoro"/></div>'+
    '<div class="pw-title">'+nm+' kokoro plan is ready.</div><div class="pw-sub">'+s.sub+'</div>'+
    '<div class="perks">'+s.perks.map(p=>'<div class="perk"><span class="pk">'+I_CHECK+'</span>'+p+'</div>').join('')+'</div>'+
    stack+
    '<div class="plans">'+plans+'</div>'+
    cards+
    '<div class="pw-note">'+svg('lock',16)+' secure checkout \u00b7 cancel anytime, in two taps.</div>'+
    compare+
    reasons+
    '<button class="cta cta-shine pw-cta2" data-pay="2">'+s.plans[0].cta+'</button>'+
    '<div class="pw-fine"><span class="pw-renew" data-renew></span><br/><a>restore</a> \u00b7 <a>terms</a> \u00b7 <a>privacy</a></div><div style="height:10px"></div></div>'+
    '<div class="qfoot"><button class="cta cta-shine" data-pay="1">'+s.plans[0].cta+'</button></div>');
};

R.success = s => {
  const nm = state.name ? ', '+state.name : '';
  return panel('<div class="success"><div class="sdisc"><img src="'+aset('meditatePng','../assets/kokoro-meditate.png')+'" alt="Kokoro"/></div>'+
  '<div class="seye">'+s.eyebrow+nm+'</div><h2>'+s.h2+'</h2><div class="sp">'+s.p+'</div></div>'+
  '<div class="qfoot"><button class="auth-btn dark" data-act="restart" style="margin-bottom:10px">'+I_APPLE+' download the app</button>'+
  '<button class="ghost" data-act="restart">send me a magic link instead</button></div>');
};

/* ---------- V1 NEW: projection graph — honest "where this is heading" + count-down ---------- */
R.projection = s => {
  const fig = '<svg class="proj" viewBox="0 0 300 150" preserveAspectRatio="none" aria-hidden="true">'+
    '<path class="proj-area" d="M10 128 C 70 124 120 96 170 60 S 250 28 290 22 L290 144 L10 144 Z"/>'+
    '<path class="proj-line" d="M10 128 C 70 124 120 96 170 60 S 250 28 290 22"/>'+
    '<circle class="proj-a" cx="10" cy="128" r="5"/>'+
    '<circle class="proj-b" cx="290" cy="22" r="6"/>'+
  '</svg>';
  return panel(miniback()+'<div class="qbody"><div class="stmt-eye">'+s.eyebrow+'</div>'+
    '<h2 class="qtitle">'+s.title+'</h2>'+
    '<div class="proj-card">'+
      '<div class="proj-readout"><div class="proj-num" data-from="'+s.from+'" data-to="'+s.to+'">'+s.from+'<span>%</span></div>'+
        '<div class="proj-lbl">projected '+s.metric+'</div></div>'+
      fig+
      '<div class="proj-axis"><span>today</span><span>day 7</span><span class="mid">day 30</span></div>'+
    '</div>'+
    '<p class="chart-p">'+s.p+'</p>'+
    '<div class="chart-note">'+svg('feather',14)+'<span>'+s.note+'</span></div>'+
    '<div style="flex:1;min-height:10px"></div></div>'+
    '<div class="qfoot"><button class="cta" data-act="next">'+s.cta+'</button></div>');
};
R.wire_projection = (s, root) => {
  const fig = root.querySelector('.proj'); const num = root.querySelector('.proj-num');
  requestAnimationFrame(()=> setTimeout(()=> fig && fig.classList.add('draw'), 80));
  if(num){
    const from=+num.dataset.from, to=+num.dataset.to, dur=1300, t0=performance.now();
    const step=(t)=>{ const k=Math.min(1,(t-t0)/dur); const e=1-Math.pow(1-k,3);
      num.innerHTML=Math.round(from+(to-from)*e)+'<span>%</span>'; if(k<1) requestAnimationFrame(step); };
    setTimeout(()=>requestAnimationFrame(step), 360);
  }
};

/* ---------- V1 NEW: the pattern reveal — named pattern + intensity gauge + facets ---------- */
const PATTERNS = {
  noswitch:{name:'The Restless Mind', line:'a head that won’t power down on command.'},
  overthink:{name:'The Overthinker’s Loop', line:'you solve the same thought a hundred ways.'},
  pretending:{name:'The Quiet Holder', line:'fine on the outside, holding a lot underneath.'},
  cantsay:{name:'The Quiet Holder', line:'carrying something you haven’t said out loud.'},
  behind:{name:'The Pressure Spiral', line:'always a step behind your own standards.'},
  wasting:{name:'The Pressure Spiral', line:'a clock running louder than it should.'},
  miss:{name:'The Tender Heart', line:'still holding space for someone.'},
  noname:{name:'The Unnamed Weight', line:'something real, even if it has no name yet.'}
};
R.reveal = s => {
  const carry = (state.answers.carrying||{}).v, cope = (state.answers.coping||{}).v;
  const pat = PATTERNS[carry] || PATTERNS[cope] || {name:'The 2 a.m. Rerun', line:'your mind replays the day when it should be resting.'};
  const feels = (state.answers.feels||[]).slice(0,3);
  const facets = feels.length ? feels : ['pressure','overthinking','restlessness'];
  const nm = state.name ? state.name+', ' : '';
  return panel(miniback()+'<div class="qbody reveal"><div class="stmt-eye">'+s.eyebrow+'</div>'+
    '<div class="rv-name">'+pat.name+'</div>'+
    '<p class="rv-line">'+nm+pat.line+'</p>'+
    '<div class="rv-gauge"><div class="rv-track"><span class="rv-marker"></span></div>'+
      '<div class="rv-ends"><span>quiet</span><span class="rv-now">'+s.gauge+'</span><span>loud</span></div></div>'+
    '<div class="rv-facets">'+facets.map(f=>'<span class="rv-facet">'+f+'</span>').join('')+'</div>'+
    '<p class="chart-p">'+s.p+'</p>'+
    '<div style="flex:1;min-height:10px"></div></div>'+
    '<div class="qfoot"><button class="cta" data-act="next">'+s.cta+'</button></div>');
};
R.wire_reveal = (s, root) => {
  const m = root.querySelector('.rv-marker');
  const pos = s.gauge==='high' ? 88 : s.gauge==='elevated' ? 72 : 58;
  if(m){ m.style.left='8%'; requestAnimationFrame(()=> setTimeout(()=>{ m.style.left=pos+'%'; }, 220)); }
  root.querySelectorAll('.rv-facet').forEach((f,i)=> f.style.animationDelay=(0.12+i*0.1)+'s');
};

/* ---------- navigation ---------- */
function renderStep(){
  const s = STEPS[pos];
  flowEl.innerHTML = R[s.type](s);
  flowEl.classList.add('show');
  heroEl.classList.remove('is-active');
  const root = flowEl.querySelector('.panel');
  root.querySelectorAll('[data-act="back"]').forEach(b=> b.onclick = back);
  root.querySelectorAll('[data-act="next"]').forEach(b=> b.addEventListener('click', ()=>{ if(b.disabled) return; next(); }));
  root.querySelectorAll('[data-act="restart"]').forEach(b=> b.onclick = restart);
  if (R['wire_'+s.type]) R['wire_'+s.type](s, root);
  root.querySelectorAll('.ava-vid').forEach(mountAvaVideo);
  const sc = root.querySelector('.qbody'); if(sc) sc.scrollTop = 0;
}
function next(){ if(pos < STEPS.length-1){ pos++; renderStep(); } }
function back(){
  if(pos === 0){ flowEl.classList.remove('show'); flowEl.innerHTML=''; heroEl.classList.add('is-active'); return; }
  pos--; renderStep();
}
function startFlow(){ pos = 0; renderStep(); }
function restart(){ pos = 0; state.answers={}; state.plan=0; state.name=''; flowEl.classList.remove('show'); flowEl.innerHTML=''; heroEl.classList.add('is-active'); }
window.startFlow = startFlow; window.restart = restart;
window.goTo = n => { pos = Math.max(0, Math.min(STEPS.length-1, n)); renderStep(); };

/* ---------- per-type wiring ---------- */
R.wire_single = (s, root) => {
  root.querySelectorAll('.opt').forEach(o=>{
    o.onclick = ()=>{
      root.querySelectorAll('.opt').forEach(x=>x.classList.remove('is-on'));
      o.classList.add('is-on');
      const opt = s.options.find(x=>x.v===o.dataset.v);
      state.answers[s.id] = { v:opt.v, label:opt.label };
      setTimeout(next, 430);
    };
  });
};

R.wire_multi = (s, root) => {
  const cta = root.querySelector('[data-act="next"]');
  const upd = ()=>{
    const on = [...root.querySelectorAll('.chp.is-on')];
    cta.disabled = on.length === 0;
    state.answers[s.id] = on.map(c=>c.dataset.v);
  };
  root.querySelectorAll('.chp').forEach(c=> c.onclick = ()=>{ c.classList.toggle('is-on'); upd(); });
  upd();
};

R.wire_relate = (s, root) => {
  const track=root.querySelector('#relTrack'), fill=root.querySelector('#relFill'), thumb=root.querySelector('#relThumb');
  const ref=root.querySelector('#relRef'), txt=root.querySelector('#relRefText'), cta=root.querySelector('#relCta');
  const STOPS=5, colors={1:'var(--moss)',2:'var(--moss-1)',3:'var(--mustard-dark)',4:'var(--sunset-soft)',5:'var(--sunset)'};
  let val=0;
  thumb.style.left='50%'; fill.style.width='50%';   // rest at centre, neutral
  function paint(){
    const pct=(val-1)/(STOPS-1);
    fill.style.width=(pct*100)+'%'; thumb.style.left=(pct*100)+'%';
    thumb.style.borderColor=colors[val]; fill.style.background=colors[val];
    state.answers[s.id]={ value:val, label:(val>=4?'relates':val<=2?'not really':'sometimes') };
    ref.classList.add('show');
    txt.textContent = val>=4 ? s.reflectHi : val<=2 ? s.reflectLo : s.reflectHi;
    cta.disabled=false;
  }
  function setX(x){ const r=track.getBoundingClientRect(); let p=(x-r.left)/r.width; p=Math.max(0,Math.min(1,p)); val=Math.round(p*(STOPS-1))+1; thumb.classList.add('live'); paint(); }
  let drag=false;
  const dn=e=>{ drag=true; setX((e.touches?e.touches[0]:e).clientX); };
  const mv=e=>{ if(drag) setX((e.touches?e.touches[0]:e).clientX); };
  track.addEventListener('mousedown',dn); track.addEventListener('touchstart',dn,{passive:true});
  addEventListener('mousemove',mv); addEventListener('touchmove',mv,{passive:true});
  addEventListener('mouseup',()=>drag=false); addEventListener('touchend',()=>drag=false);
};

R.wire_slider = (s, root) => {
  const track=root.querySelector('#track'), fill=root.querySelector('#gFill'), thumb=root.querySelector('#gThumb');
  const gNum=root.querySelector('#gNum'), gWord=root.querySelector('#gWord');
  const gRef=root.querySelector('#gReflect'), gTxt=root.querySelector('#gReflectText');
  const words={1:'barely there',2:'quiet',3:'a low hum',4:'noticeable',5:'manageable',6:'busy',7:'pretty loud',8:'hard to ignore',9:'overwhelming',10:'i can\u2019t escape it'};
  const col = v => v<=3?'var(--moss)':v<=6?'var(--mustard-dark)':'var(--sunset)';
  let val=5, touched=false;
  function paint(){
    const pct=(val-1)/9;
    fill.style.width=(pct*100)+'%'; thumb.style.left=(pct*100)+'%';
    gNum.innerHTML=val+'<span>/10</span>'; gWord.textContent=words[val];
    gNum.style.color=col(val); gWord.style.color=col(val);
    state.answers[s.id]={ value:val, label:words[val] };
    if(touched){
      gRef.classList.add('show');
      gTxt.innerHTML = val>=7 ? 'that\u2019s a lot to hold. no generic calm-down track \u2014 <span class="nm">kokoro</span> will make something for this much noise.'
        : val<=3 ? 'quiet, but you\u2019re still here. <span class="nm">kokoro</span> will keep it gentle, not pushy.'
        : 'got it. not too much, not nothing \u2014 <span class="nm">kokoro</span> will meet you right here.';
    }
  }
  function setX(x){ const r=track.getBoundingClientRect(); let p=(x-r.left)/r.width; p=Math.max(0,Math.min(1,p)); val=Math.round(p*9)+1; touched=true; paint(); }
  let drag=false;
  const dn=e=>{ drag=true; setX((e.touches?e.touches[0]:e).clientX); };
  const mv=e=>{ if(drag) setX((e.touches?e.touches[0]:e).clientX); };
  track.addEventListener('mousedown',dn); track.addEventListener('touchstart',dn,{passive:true});
  addEventListener('mousemove',mv); addEventListener('touchmove',mv,{passive:true});
  addEventListener('mouseup',()=>drag=false); addEventListener('touchend',()=>drag=false);
  paint();
};

R.wire_name = (s, root) => {
  const inp = root.querySelector('#nameField');
  const cta = root.querySelector('#nameCta');
  const cap = v => v ? v.charAt(0).toUpperCase()+v.slice(1) : '';
  const sync = ()=>{ const v=inp.value.trim(); cta.disabled = v.length<1; state.name = cap(v); };
  inp.addEventListener('input', sync);
  inp.addEventListener('keydown', e=>{ if(e.key==='Enter' && inp.value.trim()){ sync(); next(); } });
  setTimeout(()=>inp.focus(), 120); sync();
};

R.wire_chart = (s, root) => {
  const fig = root.querySelector('.curve');
  requestAnimationFrame(()=> setTimeout(()=> fig && fig.classList.add('draw'), 80));
};

R.wire_map = (s, root) => {
  root.querySelectorAll('.map-card').forEach((c,i)=> c.style.animationDelay = (0.08 + i*0.13)+'s');
};

R.wire_loading = (s, root) => {
  const items=[...root.querySelectorAll('.load-step')];
  const main=root.querySelector('[data-main]');
  const intr=root.querySelector('[data-intr]');
  const pctEl=root.querySelector('[data-pct]');
  const quotes=[...root.querySelectorAll('.load-quotes .lq')];
  let i=0, asked=false, pct=0, paused=false;
  /* count-up % — eases toward 100, pauses while the interrupt question is open */
  const tickPct=()=>{ if(pctEl && !paused && pct<99){ pct += Math.max(1, Math.round((100-pct)/24)); pctEl.textContent=pct+'%'; } if(pctEl && pctEl.isConnected) setTimeout(tickPct, 95); };
  tickPct();
  /* rotating testimonial under the loader */
  if(quotes.length>1){ let q=0; const rot=()=>{ if(!root.isConnected) return; quotes[q].classList.remove('on'); q=(q+1)%quotes.length; quotes[q].classList.add('on'); setTimeout(rot,1800); }; setTimeout(rot,1800); }
  function adv(){
    if(i>0){ items[i-1].classList.remove('active'); items[i-1].classList.add('done'); }
    if(i===2 && intr && !asked){ asked=true; return ask(); }
    if(i<items.length){ items[i].classList.add('active'); i++; setTimeout(adv, 820); }
    else { pct=100; if(pctEl) pctEl.textContent='100%'; setTimeout(next, 720); }
  }
  function ask(){
    paused=true; main.style.display='none'; intr.hidden=false; intr.classList.add('anim');
    intr.querySelectorAll('.opt').forEach(o=> o.onclick = ()=>{
      const opt = s.interrupt.options.find(x=>x.v===o.dataset.v);
      state.answers.when = { v:opt.v, label:opt.label };
      o.classList.add('is-on');
      setTimeout(()=>{ intr.hidden=true; main.style.display=''; paused=false; setTimeout(adv, 360); }, 460);
    });
  }
  adv();
};

/* count-up the trust stat (e.g. 12,000+) when it scrolls in */
R.wire_trust = (s, root) => {
  const el = root.querySelector('.tnum');
  if(!el) return;
  const raw = el.textContent, target = +raw.replace(/[^\d]/g,''), suffix = raw.replace(/[\d,]/g,'').trim();
  if(!target) return;
  const dur=1100, t0=performance.now();
  const step=(t)=>{ const k=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-k,3), v=Math.round(target*e);
    el.textContent = v.toLocaleString('en-US')+(suffix?suffix:''); if(k<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
};

R.wire_preview = (s, root) => {
  /* ambient sakura petals — continuous gentle life, fills the empty space */
  const amb = root.querySelector('.pc-amb');
  if(amb){
    const cols = ['var(--sunset-soft)','var(--mustard-1)','var(--moss-soft)','var(--coral-soft)','var(--mustard)'];
    for(let i=0;i<8;i++){
      const w=document.createElement('div'); w.className='amb-petal';
      const dur=9+Math.random()*7, delay=-Math.random()*dur, size=9+Math.random()*11;
      w.style.left=(3+Math.random()*94)+'%';
      w.style.animationDuration=dur+'s'; w.style.animationDelay=delay.toFixed(2)+'s';
      const inner=document.createElement('div'); inner.className='amb-inner';
      inner.style.width=size+'px'; inner.style.height=size+'px'; inner.style.background=cols[i%cols.length];
      inner.style.animationDuration=(2.4+Math.random()*2.2).toFixed(2)+'s'; inner.style.animationDelay=delay.toFixed(2)+'s';
      w.appendChild(inner); amb.appendChild(w);
    }
  }
  /* one-shot celebratory burst from the card */
  const burst = root.querySelector('.pc-burst');
  if(burst){
    const cols = ['var(--sunset)','var(--mustard)','var(--moss-1)','var(--sunset-soft)','var(--mustard-dark)','var(--coral)'];
    const launch = ()=>{
      const N=18;
      for(let i=0;i<N;i++){
        const p=document.createElement('div'); p.className='burst-petal';
        const ang=(Math.PI*2*i/N)+(Math.random()*0.4-0.2);
        const dist=66+Math.random()*96;
        p.style.setProperty('--tx', (Math.cos(ang)*dist).toFixed(1)+'px');
        p.style.setProperty('--ty', (Math.sin(ang)*dist - 18).toFixed(1)+'px');
        p.style.setProperty('--rot', (Math.random()*620-310).toFixed(0)+'deg');
        p.style.background=cols[i%cols.length];
        p.style.animationDelay=(Math.random()*0.09).toFixed(2)+'s';
        burst.appendChild(p);
      }
      setTimeout(()=>{ if(burst.isConnected) burst.innerHTML=''; }, 1500);
    };
    setTimeout(launch, 420);
  }
};

/* VALUE funnel — premium price + hard yearly push + aggressive anchoring.
   Index matches the paywall plans: 0 = yearly €79.99/yr (hero, default),
   1 = monthly €24.99/mo, 2 = weekly €9.99/wk. Apple Pay shows one-tap.
   Each link's success_url should be thanks.html?plan=<name>&value=<value> so
   Purchase fires. */
const STRIPE_LINKS = [
  'https://buy.stripe.com/fZu28q0TXaoU6nodHs5os0j', // yearly  €79.99/yr
  'https://buy.stripe.com/7sY28qauxgNibHI6f05os0k', // monthly €24.99/mo
  'https://buy.stripe.com/14AdR8cCF1So4fg1YK5os0l'  // weekly  €9.99/wk
];
/* Meta Pixel — safe no-op if blocked/not loaded */
function fbtrack(ev, params){ try{ if(window.fbq) fbq('track', ev, params||{}); }catch(e){} }

const PLAN_VALUE = [79.99, 24.99, 9.99];   // yearly / monthly / weekly (EUR)
const PLAN_NAME  = ['yearly','monthly','weekly'];

/* Email capture: a Google Apps Script Web App URL that appends rows to the Sheet.
   Empty = no-op (the Lead pixel still fires). */
const EMAIL_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwRuFGWNtzxvXXc4dDYdjOf2gV5Yl8pKzJr03zr1Egueq3bPhN3pm47-y8RD__9R0Ux/exec';

function goToCheckout(){
  const link = STRIPE_LINKS[state.plan] || STRIPE_LINKS[0];
  const email = (state.email || '').trim();
  const url = email && /.+@.+\..+/.test(email)
    ? link + '?prefilled_email=' + encodeURIComponent(email)
    : link;
  // strong mid-funnel signal Meta can optimize toward
  fbtrack('InitiateCheckout', { value: PLAN_VALUE[state.plan] || PLAN_VALUE[0], currency: 'EUR',
                                content_name: PLAN_NAME[state.plan] || PLAN_NAME[0] });
  // small delay so the event flushes before we leave the page
  setTimeout(()=>{ window.location.href = url; }, 200);
}

R.wire_paywall = (s, root) => {
  const ctas = [...root.querySelectorAll('[data-pay]')];   // primary footer CTA + the inline one
  const renew = root.querySelector('[data-renew]');
  const setRenew = ()=>{ const p=s.plans[state.plan]; if(!renew) return;
    const isWk=/week/.test(p.name), isYr=/year|12\s*month/.test(p.name);   // "12 months" must read as yearly, not monthly
    renew.textContent = 'then '+p.price+(isWk?' / week, renews weekly':isYr?' / year, renews annually':' / month, renews monthly')+' · cancel anytime'; };
  const setCtas = ()=> ctas.forEach(c=> c.textContent = s.plans[state.plan].cta);
  root.querySelectorAll('.plan').forEach(p=>{
    p.onclick = ()=>{
      root.querySelectorAll('.plan').forEach(x=>x.classList.remove('is-on'));
      p.classList.add('is-on'); state.plan=+p.dataset.i; setCtas(); setRenew();
    };
  });
  setRenew();
  ctas.forEach(c=> c.addEventListener('click', goToCheckout));
  /* a real, per-session countdown (no deceptive reset on reload) */
  const clock = root.querySelector('[data-clock]');
  if(clock){
    let left = (s.countdown || 600);
    const tick = ()=>{ const m=Math.floor(left/60), ss=left%60; clock.textContent = m+':'+(ss<10?'0':'')+ss; if(left>0) left--; };
    tick(); const iv = setInterval(()=>{ if(!clock.isConnected){ clearInterval(iv); return; } tick(); }, 1000);
  }
};

R.wire_email = (s, root) => {
  const inp = root.querySelector('.email-field');
  const go  = root.querySelector('.email-go');
  if(inp) inp.addEventListener('input', ()=>{ state.email = inp.value.trim(); });
  const fireLead = ()=>{
    const e=(state.email||'').trim();
    if(!/.+@.+\..+/.test(e)) return;
    fbtrack('Lead', { content_name:'email_captured' });
    try{ localStorage.setItem('kokoro_email', e); }catch(_){}
    if(EMAIL_ENDPOINT){                           // save to the Google Sheet (fire-and-forget)
      try{ fetch(EMAIL_ENDPOINT, { method:'POST', mode:'no-cors',
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body: JSON.stringify({ email:e, plan: PLAN_NAME[state.plan]||'', source:'funnel-value', ts: Date.now() }) }); }catch(_){}
    }
  };
  if(go)  go.addEventListener('click', fireLead);
  if(inp) inp.addEventListener('keydown', ev=>{ if(ev.key==='Enter') fireLead(); });
};

R.wire_commit = (s, root) => {
  const btn = root.querySelector('[data-hold]');
  const hint = root.querySelector('[data-hint]');
  const HOLD = 2600;
  let t=null, done=false;
  function start(e){ if(e) e.preventDefault(); if(done) return; btn.classList.add('filling'); t=setTimeout(complete, HOLD); }
  function cancel(){ if(done) return; clearTimeout(t); btn.classList.remove('filling'); }
  function complete(){
    done=true; btn.classList.remove('filling'); btn.classList.add('done');
    state.answers[s.id]={ committed:true };
    if(navigator.vibrate) navigator.vibrate(30);
    if(hint) hint.textContent = s.done;
    setTimeout(next, 1000);
  }
  btn.addEventListener('pointerdown', start);
  btn.addEventListener('pointerup', cancel);
  btn.addEventListener('pointerleave', cancel);
  btn.addEventListener('pointercancel', cancel);
};
