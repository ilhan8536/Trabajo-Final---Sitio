// Tema día / noche
const raiz = document.documentElement, btn = document.getElementById('tema'), icono = btn.querySelector('img');
function aplicarTema(t) {
  raiz.dataset.theme = t;
  icono.src = t === 'dia' ? 'assets/icons/moon-stars.svg' : 'assets/icons/sun.svg';
  btn.setAttribute('aria-label', t === 'dia' ? 'Cambiar a tema noche' : 'Cambiar a tema día');
}
aplicarTema('noche');
btn.addEventListener('click', () => aplicarTema(raiz.dataset.theme === 'dia' ? 'noche' : 'dia'));

// Video con barra propia: play, pausa, progreso, tiempo y volumen
const video = document.getElementById('video');
if (video) {
  const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const prog = document.getElementById('progreso'), tiempo = document.getElementById('tiempo');
  const actualizar = () => {
    const d = video.duration || 0;
    prog.value = d ? (video.currentTime / d) * 100 : 0;
    tiempo.textContent = fmt(video.currentTime) + ' / ' + fmt(d);
  };
  document.getElementById('btn-play').addEventListener('click', () => video.play());
  document.getElementById('btn-pausa').addEventListener('click', () => video.pause());
  prog.addEventListener('input', () => { video.currentTime = (prog.value / 100) * (video.duration || 0); });
  document.getElementById('volumen').addEventListener('input', e => { video.volume = e.target.value; });
  video.addEventListener('timeupdate', actualizar);
  video.addEventListener('loadedmetadata', actualizar);
}

// Rompecabezas (Rompe1 = izquierda, rompe2 = centro, Rompe3 = derecha)
const bandeja = document.getElementById('bandeja');
if (bandeja) {
  const archivos = ['Rompe1.png', 'rompe2.png', 'Rompe3.png'];
  const TEXTO = 'Arrastre y suelte la imagen aquí';
  const huecos = [...document.querySelectorAll('.hueco')], msg = document.getElementById('mensaje');
  const azar = (a, b) => a + Math.random() * (b - a);
  let actual = null;
  const medidas = () => { const w = huecos[0].getBoundingClientRect().width; return { w, h: (w * 505) / 285 }; };
  // Deja una pieza en la mesa, con centro (x, y) y un giro
  function enMesa(p, x, y, ang) {
    const { w, h } = medidas(), W = bandeja.clientWidth, H = bandeja.clientHeight;
    x = Math.min(Math.max(x, w / 2), W - w / 2); y = Math.min(Math.max(y, h / 2), H - h / 2);
    p.style.cssText = `width:${w}px;left:${x - w / 2}px;top:${y - h / 2}px;transform:rotate(${ang}deg)`;
    bandeja.appendChild(p);
  }
  const giro = () => (Math.random() < 0.35 ? (Math.random() < 0.5 ? 90 : -90) + azar(-12, 12) : azar(-25, 25));
  function restaurarTextos() { huecos.forEach(h => { if (!h.querySelector('.pieza')) h.textContent = TEXTO; }); }
  function iniciar() {
    bandeja.innerHTML = ''; msg.textContent = '';
    huecos.forEach(h => { h.textContent = TEXTO; });
    const { w, h } = medidas();
    bandeja.style.height = h * 1.5 + 'px';
    const columnas = [0, 1, 2].sort(() => Math.random() - .5), W = bandeja.clientWidth, H = bandeja.clientHeight;
    [0, 1, 2].forEach(i => {
      const p = document.createElement('img');
      p.className = 'pieza'; p.draggable = true; p.dataset.i = i;
      p.src = 'assets/imagenes/' + archivos[i]; p.alt = 'Pieza del rompecabezas';
      p.addEventListener('dragstart', () => { actual = p; p.classList.add('arrastrando'); });
      p.addEventListener('dragend', () => p.classList.remove('arrastrando'));
      enMesa(p, columnas[i] * (W / 3) + W / 6 + azar(-W / 14, W / 14), azar(h / 2, H - h / 2), giro());
    });
  }
  function revisar() {
    if (huecos.some(h => !h.querySelector('.pieza'))) return;
    const ok = huecos.every(h => h.querySelector('.pieza').dataset.i === h.dataset.i);
    msg.textContent = ok ? '¡Lo lograste! La imagen está completa.' : 'Casi. Hay piezas fuera de lugar, probá de nuevo.';
  }
  huecos.forEach(h => {
    h.addEventListener('dragover', e => { e.preventDefault(); h.classList.add('sobre'); });
    h.addEventListener('dragleave', () => h.classList.remove('sobre'));
    h.addEventListener('drop', e => {
      e.preventDefault(); h.classList.remove('sobre');
      if (!actual || h.querySelector('.pieza')) return;
      actual.style.cssText = ''; h.textContent = ''; h.appendChild(actual);
      restaurarTextos(); revisar();
    });
  });
  bandeja.addEventListener('dragover', e => e.preventDefault());
  bandeja.addEventListener('drop', e => {
    e.preventDefault(); if (!actual) return;
    const r = bandeja.getBoundingClientRect();
    enMesa(actual, e.clientX - r.left, e.clientY - r.top, azar(-25, 25));
    restaurarTextos(); msg.textContent = '';
  });
  document.getElementById('reiniciar').addEventListener('click', iniciar);
  iniciar();
}

// La barra de navegación toma fondo al hacer scroll
const barra = document.querySelector('header');
const alScroll = () => barra.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', alScroll);
alScroll();
