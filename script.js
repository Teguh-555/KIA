'use strict';

// Semua isi surat dapat diubah di bagian LETTERS ini.
const LETTERS = {
  apology: `Kia...

Aku mau minta maaf ya.

Maaf kalau selama ini ada perkataan atau sikap aku yang bikin kamu sedih, kecewa, atau bahkan kepikiran.

Aku sadar kalau mungkin ada hal-hal yang belum aku lakukan dengan baik. Kadang aku juga masih salah dalam bersikap dan memahami perasaan kamu.

Aku nggak mau mencari alasan untuk membenarkan kesalahanku.

Aku cuma mau kamu tahu kalau aku benar-benar menyesal dan ingin belajar menjadi lebih baik.

Aku tahu kata maaf aja nggak cukup. Karena itu, aku juga mau membuktikannya lewat sikap dan tindakan aku ke depannya.

Kia, kamu itu berarti banget buat aku.

Aku nggak mau karena ego atau kesalahan aku, kamu jadi kehilangan senyum kamu.

Aku berharap kamu bisa memaafkan aku, ketika kamu sudah siap.

Maafin aku ya, Kia. ❤️`,
  healing: `Kia...

Aku tahu sekarang kamu lagi nggak enak badan.

Aku berharap kamu bisa istirahat dengan tenang dan nggak terlalu banyak mikirin hal-hal yang bikin kamu capek.

Jangan lupa makan yang teratur, minum air putih, dan istirahat yang cukup ya.

Kalau lagi capek, nggak apa-apa buat istirahat dulu.

Kamu nggak harus selalu terlihat kuat setiap saat.

Aku berharap setiap hari kondisi kamu semakin membaik, sampai akhirnya kamu benar-benar pulih.

Kalau aku bisa, aku pengen ada di dekat kamu buat nemenin dan memastikan kamu baik-baik aja.

Semoga kamu cepat sembuh ya, Kia.

Aku kangen lihat kamu sehat, bahagia, dan tersenyum lagi.

I love you, Kia. ❤️`,
  ending: `Kia...

Terima kasih ya, karena sudah hadir dalam hidup aku.

Aku tahu hubungan nggak selalu berjalan sempurna.

Kadang ada salah paham, perbedaan pendapat, dan hal-hal yang mungkin menyakitkan.

Tapi aku ingin terus belajar menjadi lebih baik.

Aku nggak minta semuanya langsung kembali baik-baik aja.

Aku cuma berharap kita bisa saling memahami dan memperbaiki apa yang masih bisa diperbaiki.

Sekarang, yang paling penting, aku pengen kamu cepat sembuh dulu.

Jaga kesehatan kamu baik-baik ya, Kia.

Aku berharap kamu selalu dikelilingi hal-hal baik dan orang-orang yang peduli sama kamu.

Maafin aku ya, Kia.

I love you. ❤️`
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const music = $('#backgroundMusic');
const musicStatus = $('#musicStatus');
const musicToggle = $('#musicToggle');
const volumeSlider = $('#musicVolume');
let targetVolume = 0.35;
let volumeFadeFrame = 0;
let letterStarted = false;
let typingFrame = 0;
let isModalOpen = false;
let lastFocusedElement = null;

function navigateTo(id) {
  document.getElementById(id)?.scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth', block:'start'});
}

function typeLetter() {
  if (letterStarted) return;
  letterStarted = true;
  const target = $('#apologyText');
  const cursor = $('#typewriterCursor');
  const text = LETTERS.apology;
  if (reducedMotion.matches) {
    target.textContent = text;
    cursor.classList.add('done');
    return;
  }
  let index = 0;
  let lastTime = 0;
  const delay = 18;
  function frame(time) {
    if (time - lastTime >= delay) {
      // Dua karakter per frame untuk surat yang panjang, sambil mempertahankan efek mengetik.
      index = Math.min(index + 2, text.length);
      target.textContent = text.slice(0, index);
      lastTime = time;
    }
    if (index < text.length) typingFrame = requestAnimationFrame(frame);
    else cursor.classList.add('done');
  }
  typingFrame = requestAnimationFrame(frame);
}

function cancelFade() {
  if (volumeFadeFrame) cancelAnimationFrame(volumeFadeFrame);
  volumeFadeFrame = 0;
}
function setPlayingUI(playing) {
  musicToggle.textContent = playing ? 'Ⅱ' : '♫';
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing ? 'Jeda musik' : 'Putar musik');
  musicStatus.textContent = playing ? 'Sedang diputar ♡' : 'Musik dijeda';
}
function fadeVolume(to, duration = 2400) {
  cancelFade();
  if (reducedMotion.matches) {music.volume = to; return;}
  const from = music.volume;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    music.volume = Math.max(0, Math.min(1, from + (to - from) * (1 - Math.pow(1 - progress, 3))));
    if (progress < 1) volumeFadeFrame = requestAnimationFrame(step);
  };
  volumeFadeFrame = requestAnimationFrame(step);
}
async function playMusic() {
  cancelFade();
  music.volume = 0;
  try {
    await music.play();
    setPlayingUI(true);
    fadeVolume(targetVolume);
  } catch (error) {
    setPlayingUI(false);
    musicStatus.textContent = 'Tambahkan file MP3 ♡';
  }
}

$('#openLetter').addEventListener('click', () => {
  $('#envelopeScene').classList.add('opened');
  playMusic();
  typeLetter();
  window.setTimeout(() => navigateTo('apology'), reducedMotion.matches ? 0 : 770);
});

musicToggle.addEventListener('click', () => {
  if (music.paused) playMusic();
  else {cancelFade(); music.pause(); setPlayingUI(false);}
});
music.addEventListener('error', () => {
  setPlayingUI(false);
  musicStatus.textContent = 'File MP3 belum ada';
});
music.addEventListener('pause', () => {if (!music.ended) setPlayingUI(false);});
music.addEventListener('playing', () => setPlayingUI(true));
volumeSlider.addEventListener('input', (event) => {
  targetVolume = Number(event.target.value) / 100;
  cancelFade();
  music.volume = targetVolume;
});

$('#healingText').textContent = LETTERS.healing;
$('#endingText').textContent = LETTERS.ending;

// Jika Kia menuju surat lewat menu, typewriter tetap berjalan.
$$('a[href="#apology"]').forEach(link => link.addEventListener('click', typeLetter));
const apologyObserver = new IntersectionObserver((entries) => {
  if (entries.some(entry => entry.isIntersecting)) typeLetter();
}, {threshold: 0.22});
apologyObserver.observe($('#apology'));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.09, rootMargin:'0px 0px 40px 0px'});
$$('.reveal').forEach(el => revealObserver.observe(el));

let scrollQueued = false;
function updateScroll() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(100, Math.max(0, window.scrollY / maxScroll * 100)) : 100;
  $('#readingProgress').style.width = `${progress}%`;
  $('#readingProgress').setAttribute('aria-valuenow', String(Math.round(progress)));
  $('#backToTop').classList.toggle('visible', window.scrollY > 600);
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) {scrollQueued = true; requestAnimationFrame(updateScroll);}
}, {passive:true});
window.addEventListener('resize', updateScroll, {passive:true});
$('#backToTop').addEventListener('click', () => navigateTo('home'));
updateScroll();

// Partikel dibatasi jumlahnya supaya tetap ringan di perangkat seluler.
if (!reducedMotion.matches) {
  const container = $('#particles');
  const chars = ['♥', '♡', '✿', '❀'];
  const count = window.innerWidth < 640 ? 9 : 16;
  for (let i = 0; i < count; i++) {
    const part = document.createElement('span');
    part.className = 'particle';
    part.textContent = chars[i % chars.length];
    part.style.setProperty('--x', `${Math.random() * 100}%`);
    part.style.setProperty('--size', `${10 + Math.random() * 13}px`);
    part.style.setProperty('--delay', `${-Math.random() * 22}s`);
    part.style.setProperty('--duration', `${18 + Math.random() * 16}s`);
    part.style.setProperty('--drift', `${Math.random() * 130 - 65}px`);
    part.style.color = i % 2 ? '#dc9ab8' : '#d5a2c6';
    container.append(part);
  }
}

function burstHearts(count = 27) {
  if (reducedMotion.matches) return;
  const container = $('#heartBurst');
  const rect = container.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const node = document.createElement('span');
    node.className = 'burst-heart';
    node.textContent = ['♥','♡','💗','✦'][i % 4];
    node.style.setProperty('--x', `${35 + Math.random() * 30}%`);
    node.style.setProperty('--y', `${45 + Math.random() * 22}%`);
    node.style.setProperty('--size', `${14 + Math.random() * 19}px`);
    node.style.setProperty('--dx', `${Math.random() * rect.width * .9 - rect.width * .45}px`);
    node.style.setProperty('--dy', `${-100 - Math.random() * rect.height * .5}px`);
    node.style.setProperty('--duration', `${1100 + Math.random() * 1100}ms`);
    node.style.color = i % 2 ? '#dc81a6' : '#b58bcb';
    node.addEventListener('animationend', () => node.remove(), {once:true});
    container.append(node);
  }
}

let lastCheerIndex = -1;
const cheers = [
  'Kia hebat, tapi jangan lupa istirahat ya.',
  'Semoga Kia cepat sehat lagi. ❤️',
  'Aku selalu berharap yang terbaik buat Kia.',
  'Hari yang berat pasti akan berlalu.',
  'Jangan lupa tersenyum kalau sudah merasa lebih baik ya, Kia.'
];
function showMessage(message) {
  const el = $('#interactionMessage');
  el.textContent = message;
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
}
$('#hugButton').addEventListener('click', () => {
  burstHearts(35);
  showMessage('Peluk jauh buat Kia. Semoga hari kamu terasa sedikit lebih baik. ❤️');
});
$('#cheerButton').addEventListener('click', () => {
  let index = Math.floor(Math.random() * cheers.length);
  if (index === lastCheerIndex) index = (index + 1) % cheers.length;
  lastCheerIndex = index;
  showMessage(cheers[index]);
});
$('#giftButton').addEventListener('click', () => {
  const icon = $('#giftIcon');
  icon.classList.remove('open-gift');
  void icon.offsetWidth;
  icon.classList.add('open-gift');
  icon.textContent = '💖';
  burstHearts(43);
  showMessage('Aku bersyukur bisa punya Kia dalam hidupku. ❤️');
  window.setTimeout(() => {icon.textContent = '🎁'; icon.classList.remove('open-gift');}, 1150);
});
$('#sendLove').addEventListener('click', () => {
  burstHearts(64);
  $('#endingMessage').textContent = 'Semoga Kia cepat sembuh dan bahagia selalu. ❤️';
});

// Foto yang gagal dimuat otomatis menampilkan placeholder.
$$('.photo-frame img').forEach(img => {
  const fallback = () => img.closest('.photo-frame').classList.add('missing');
  img.addEventListener('error', fallback);
  img.addEventListener('load', () => img.closest('.photo-frame').classList.remove('missing'));
  if (img.complete && img.naturalWidth === 0) fallback();
});
const modal = $('#imageModal');
const modalImage = $('#modalImage');
const modalPlaceholder = $('#modalPlaceholder');
function openPhoto(card) {
  lastFocusedElement = document.activeElement;
  modalImage.hidden = true;
  modalPlaceholder.hidden = false;
  $('#modalCaption').textContent = card.dataset.caption;
  const sourceImage = card.querySelector('img');
  if (sourceImage?.complete && sourceImage.naturalWidth > 0) {
    modalImage.src = card.dataset.src;
    modalImage.alt = sourceImage.alt;
    modalImage.hidden = false;
    modalPlaceholder.hidden = true;
  }
  modal.hidden = false;
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  isModalOpen = true;
  $('#closeModal').focus();
}
function closePhoto() {
  if (!isModalOpen) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden','true');
  modalImage.removeAttribute('src');
  document.body.style.overflow = '';
  isModalOpen = false;
  lastFocusedElement?.focus();
}
$$('.polaroid').forEach(card => card.addEventListener('click', () => openPhoto(card)));
$('#closeModal').addEventListener('click', closePhoto);
modal.addEventListener('click', event => {if (event.target === modal) closePhoto();});
document.addEventListener('keydown', event => {
  if (!isModalOpen) return;
  if (event.key === 'Escape') closePhoto();
  if (event.key === 'Tab') {event.preventDefault(); $('#closeModal').focus();}
});
