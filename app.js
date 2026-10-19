(() => {
  'use strict';
  // Song ab dieser Sekunde wieder bei 0 starten, z. B. 90 für 1:30 Minuten.
  // null = gesamten Song abspielen und erst am Ende wiederholen.
  const SONG_RESTART_AT_SECONDS = 50;

  const $ = id => document.getElementById(id);
  const body = document.body;
  const canvas = $('confetti');
  const ctx = canvas.getContext('2d');
  const audio = $('audio');
  let width = innerWidth, height = innerHeight, particles = [], frame = 0, lastTime = 0;
  let intensity = 65, count = 0, speechTimer, objectUrl, pointerTime = 0;
  let calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const colors = ['#ff70bd', '#dfff00', '#bfa5ff', '#fff348', '#191919'];
  // Rasterize the emoji once; drawing text at hundreds of fractional font sizes
  // on every frame is particularly expensive for color emoji on Windows.
  const duckSprite = document.createElement('canvas');
  duckSprite.width = duckSprite.height = 96;
  const duckContext = duckSprite.getContext('2d');
  duckContext.font = '64px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  duckContext.textAlign = 'center';
  duckContext.textBaseline = 'middle';
  duckContext.fillText('🦆', 48, 48);
  const maxParticles = 200;
  const maxDucks = 64;
  let pointerFrame = 0, pointerX = 0, pointerY = 0;
  const scene = $('scene');
  const smiley = $('smiley');
  const sayings = ['Ich bin nicht kaputt. Ich bin ein Feature.', 'Dein Gehirn hat den Chat verlassen.', 'Ich denke, also bin ich verwirrt.', 'Bitte wenden. Sie befinden sich in einer Ente.', 'Heute schon ausreichend Unsinn getrunken?', '404: Ernsthaftigkeit nicht gefunden.', 'Ich habe keine Ahnung. Aber dafür sehr viel davon.', 'Mama, ich bin jetzt eine Website.'];
  function resize() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function speak(message) {
    $('speech').textContent = message;
    $('speech').classList.add('show');
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => $('speech').classList.remove('show'), 4200);
  }
  function addParticles(x, y, amount, ducks = false, gentle = false) {
    if (calm) return;
    amount = Math.min(amount, ducks ? maxDucks : maxParticles);
    if (ducks) {
      let remove = Math.max(0, particles.reduce((n, p) => n + Number(p.duck), 0) + amount - maxDucks);
      particles = particles.filter(p => {
        if (p.duck && remove > 0) { remove--; return false; }
        return true;
      });
    }
    for (let i = 0; i < amount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = gentle ? Math.random() * 1.5 : 3 + Math.random() * (4 + intensity / 10);
      particles.push({x, y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed - (gentle ? 0 : 3), life:gentle?30:100+Math.random()*50, size:ducks?24+Math.random()*22:4+Math.random()*8, color:colors[Math.floor(Math.random()*colors.length)], angle, spin:(Math.random()-.5)*.15, duck:ducks, gentle});
    }
    if (particles.length > maxParticles) particles.splice(0, particles.length - maxParticles);
    if (!frame) { lastTime = 0; frame = requestAnimationFrame(draw); }
  }
  function draw(time) {
    const dt = lastTime ? Math.min((time-lastTime)/16.67, 2) : 1; lastTime = time;
    ctx.clearRect(0, 0, width, height);
    particles = particles.filter(p => p.life > 0 && p.y < height + 70);
    const weightless = body.classList.contains('weightless');
    for (const p of particles) {
      p.x += p.vx*dt; p.y += p.vy*dt; p.vy += (weightless ? -.035 : p.gentle ? .01 : .14)*dt;
      p.life -= dt; p.angle += p.spin*dt;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle); ctx.globalAlpha = Math.min(1,p.life/20);
      if (p.duck) { ctx.drawImage(duckSprite,-p.size/2,-p.size/2,p.size,p.size); }
      else { ctx.fillStyle = p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.65); }
      ctx.restore();
    }
    frame = particles.length && !calm ? requestAnimationFrame(draw) : 0;
    if (!frame) ctx.clearRect(0,0,width,height);
  }
  function burst(ducks = false, element = $('smiley')) {
    const r = element.getBoundingClientRect();
    addParticles(r.x+r.width/2, r.y+r.height/2, Math.round(ducks ? 20+intensity*.4 : 45+intensity*1.2), ducks);
    count++; $('chaos-count').textContent = `${String(count).padStart(2,'0')} AUSRASTER ↗`;
    speak(ducks ? 'Entschuldigung. Es ist eskaliert. 🦆' : sayings[Math.floor(Math.random()*sayings.length)]);
  }
  function setCalm(value) {
    calm = value; body.classList.toggle('calm',calm);
    body.classList.toggle('motion-enabled',!calm);
    $('calm').setAttribute('aria-pressed',String(calm));
    $('calm').textContent = calm ? '◐ Ruhemodus an' : '◐ Ruhemodus';
    if(calm) { particles=[]; cancelAnimationFrame(frame); frame=0; ctx.clearRect(0,0,width,height); }
  }
  $('calm').addEventListener('click',()=>setCalm(!calm));
  $('intensity').addEventListener('input',e=>{
    intensity=Number(e.target.value); $('intensity-value').textContent=`${intensity}%`;
    document.documentElement.style.setProperty('--speed',`${24-intensity*.2}s`);
    if(intensity===100) speak('Sie haben das Ende der Vernunft erreicht.');
  });
  function updatePointer() {
    pointerFrame = 0;
    const r = smiley.getBoundingClientRect();
    // Update only the scene, once per display frame, using the latest position.
    scene.style.setProperty('--mx',Math.max(-1,Math.min(1,(pointerX-r.x-r.width/2)/250)));
    scene.style.setProperty('--my',Math.max(-1,Math.min(1,(pointerY-r.y-r.height/2)/250)));
  }
  window.addEventListener('pointermove',e=>{
    pointerX = e.clientX;
    pointerY = e.clientY;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointer);
    const now = performance.now();
    if(e.pointerType==='mouse' && now-pointerTime>45 && intensity>15) {
      addParticles(e.clientX,e.clientY,Math.ceil(intensity/35),false,true); pointerTime=now;
    }
  },{passive:true});
  $('smiley').addEventListener('click',()=>burst());
  $('duck').addEventListener('click',()=>burst(true,$('duck')));
  $('chaos').addEventListener('click',()=>burst(Math.random()>.5,$('chaos')));
  $('gravity').addEventListener('click',()=>{
    const active=body.classList.toggle('weightless');
    $('gravity').setAttribute('aria-pressed',String(active));
    $('gravity-label').textContent=active?'Zurück auf den Teppich. ↓':'Abheben, bitte. ↑';
    speak(active?'Newton hat kurz gekündigt.':'Newton ist wieder im Dienst.');
  });
  $('trip').addEventListener('click',()=>{
    const active=body.classList.toggle('trip-active');
    $('trip').setAttribute('aria-pressed',String(active));
    $('trip').innerHTML=active?'ZURÜCK ZUR REALITÄT? <span>↙</span>':'GEHIRN AUS. TRIP AN. <span>↗</span>';
    burst(true); if(audio.paused) playMusic();
  });
  document.addEventListener('keydown',e=>{
    if(/INPUT|BUTTON|TEXTAREA|SELECT|A/.test(e.target.tagName) || e.target.isContentEditable || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    if(e.code==='Space') { e.preventDefault(); burst(); }
    if(e.key.toLowerCase()==='g') $('gravity').click();
    if(e.key==='Escape') setCalm(true);
  });
  audio.volume=.55;
  audio.addEventListener('timeupdate',()=>{
    if (Number.isFinite(SONG_RESTART_AT_SECONDS) && SONG_RESTART_AT_SECONDS > 0 &&
        !audio.paused && audio.currentTime >= SONG_RESTART_AT_SECONDS) {
      audio.currentTime = 0;
    }
  });
  function updateMusic() {
    const playing=!audio.paused;
    body.classList.toggle('playing',playing);
    $('music-toggle').textContent=playing?'Ⅱ':'▶';
    $('music-toggle').setAttribute('aria-label',playing?'Musik pausieren':'Musik abspielen');
  }
  async function playMusic() {
    try { await audio.play(); $('music-status').textContent='Läuft. Die Nachbarn sind begeistert.'; }
    catch(error) {
      if(error.name==='NotAllowedError') {
        $('music-status').textContent='Bitte starte den Sound über den Play-Button.';
      } else if(error.name!=='AbortError') {
        $('music-status').textContent='Lege music/track.mp3 ab oder wähle deine Audiodatei rechts.';
      }
    }
    updateMusic();
  }
  $('music-toggle').addEventListener('click',()=>{
    if(audio.paused) playMusic(); else {audio.pause(); $('music-status').textContent='Kurze Pause für die letzte Gehirnzelle.';}
  });
  audio.addEventListener('play',updateMusic); audio.addEventListener('pause',updateMusic);
  audio.addEventListener('error',()=>{updateMusic(); $('music-status').textContent='Musik fehlt oder ist nicht lesbar. MP3 wählen ↗';});
  $('volume').addEventListener('input',e=>{audio.volume=Number(e.target.value);});
  $('choose-music').addEventListener('click',()=>$('music-file').click());
  $('music-file').addEventListener('change',e=>{
    const file=e.target.files[0]; if(!file)return;
    audio.pause(); if(objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl=URL.createObjectURL(file); audio.src=objectUrl; audio.load(); playMusic();
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) {cancelAnimationFrame(pointerFrame);pointerFrame=0;cancelAnimationFrame(frame);frame=0;particles=[];ctx.clearRect(0,0,width,height);}
  });
  window.addEventListener('resize',resize);
  resize(); setCalm(calm);
})();
