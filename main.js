const IMG = {
  "hero_night": "images/hero-night.jpg",
  "terrace": "images/terrace.jpg",
  "building": "images/building-exterior.jpg",
  "balcony": "images/balcony-entrance.jpg",
  "gal_garden": "images/building-garden.jpg",
  "gal_path": "images/path-beside-building.jpg",
  "livingSect": "images/living-room-sectional.jpg",
  "bed2": "images/bedroom-2br.jpg",
  "kitchen2": "images/kitchen-2br.jpg",
  "kitchen1": "images/kitchen-1br.jpg",
  "living1a": "images/living-dining-1br.jpg",
  "living1b": "images/living-room-1br.jpg"
};
document.getElementById('yr').textContent = new Date().getFullYear();
const EMAIL = 'malachiteapartmentskla@gmail.com';
const WA = '256772403696';
const API_BASE_URL = 'https://malachite-apartments2.onrender.com';

/* fill every static image from the shared photo map */
document.querySelectorAll('img[data-img]').forEach(el => { el.src = IMG[el.dataset.img]; });
document.querySelectorAll('.foot .brand:not(.footer-brand)').forEach(el => el.remove());

/* ---------- light / dark mode ---------- */
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
function currentTheme() {
  const set = root.getAttribute('data-theme');
  return set === 'dark' || set === 'light' ? set : (darkQuery.matches ? 'dark' : 'light');
}
function paintThemeBtn() {
  const t = currentTheme(), label = t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  themeBtn.dataset.mode = t; themeBtn.setAttribute('aria-label', label); themeBtn.title = label;
}
themeBtn.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try { localStorage.setItem('malachite-theme', next); } catch (err) { /* choice just won't be remembered */ }
  paintThemeBtn();
});
if (darkQuery.addEventListener) darkQuery.addEventListener('change', paintThemeBtn);
paintThemeBtn();

/* ---------- mobile menu ---------- */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
navLinks.addEventListener('click', e => {
  if (e.target.closest('a')) { navLinks.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Open menu'); }
});

/* ---------- lightbox ---------- */
const lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg'), lbMeta = document.getElementById('lbMeta');
let lbItems = [], lbI = 0, lbOpener = null;
function lbShow() {
  const it = lbItems[lbI];
  lbImg.src = IMG[it.key]; lbImg.alt = it.alt;
  lbMeta.textContent = (it.caption ? it.caption + '  ' : '') + (lbItems.length > 1 ? '(' + (lbI + 1) + ' of ' + lbItems.length + ')' : '');
  document.getElementById('lbPrev').style.display = document.getElementById('lbNext').style.display = lbItems.length > 1 ? '' : 'none';
}
function openLB(items, i, opener) {
  lbItems = items; lbI = i; lbOpener = opener || null;
  lbShow(); lb.classList.add('open'); document.body.style.overflow = 'hidden';
  document.getElementById('lbClose').focus();
}
function closeLB() {
  lb.classList.remove('open'); document.body.style.overflow = '';
  if (lbOpener) lbOpener.focus();
}
function lbGo(d) { lbI = (lbI + d + lbItems.length) % lbItems.length; lbShow(); }
document.getElementById('lbClose').addEventListener('click', closeLB);
document.getElementById('lbPrev').addEventListener('click', () => lbGo(-1));
document.getElementById('lbNext').addEventListener('click', () => lbGo(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLB();
  else if (e.key === 'ArrowLeft') lbGo(-1);
  else if (e.key === 'ArrowRight') lbGo(1);
  else if (e.key === 'Tab') {
    const f = [...lb.querySelectorAll('button')].filter(b => b.style.display !== 'none');
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ---------- gallery ---------- */
const GALLERY = [
  { key: 'building',   caption: 'The building and garden', alt: 'The yellow and white apartment building seen across the lawn, with flowering bushes in front' },
  { key: 'balcony',    caption: 'Balcony and entrance',    alt: 'Stone-clad columns, a balcony with iron railings and the entrance steps beside the garden' },
  { key: 'terrace',    caption: 'The terrace',             alt: 'Shared terrace with black wrought-iron tables and chairs, overlooking the garden and trees' },
  { key: 'gal_garden', caption: 'Building and garden',      alt: 'Side of the apartment building with stone-clad pillars, balconies, terrace seating and flowering bushes in the garden' },
  { key: 'gal_path',   caption: 'Path beside the building',  alt: 'Paved path shaded by trees running alongside the apartment building and its boundary wall' }
];
document.querySelectorAll('#gal button[data-g]').forEach(b => {
  b.addEventListener('click', () => openLB(GALLERY, +b.dataset.g, b));
});

/* ---------- sliders ---------- */
const SETS = {
  one: [
    { key: 'living1b',   caption: 'Living room',            alt: 'Living room with wooden armchairs, a TV, air-conditioning and sheer curtains' },
    { key: 'living1a',   caption: 'Living and dining area', alt: 'Living area with two sofas, an antelope painting, a dining nook and a red accent wall' },
    { key: 'kitchen1',   caption: 'Kitchen',                alt: 'Kitchen with a fridge, microwave, sink and a garden view through the window' }
  ],
  two: [
    { key: 'livingSect', caption: 'Living room',   alt: 'Living room with a large sectional sofa, a red rug and balcony doors' },
    { key: 'bed2',       caption: 'Bedroom',       alt: 'Bedroom with a double bed, bedside lamps, a daybed and framed art' },
    { key: 'kitchen2',   caption: 'Kitchen',       alt: 'Kitchen with red cabinets, a fridge, a gas cooker and a steel sink' }
  ]
};
const ARROW_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>';
const ARROW_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>';

function initSlider(root, slides) {
  root.innerHTML =
    '<div class="s-view" tabindex="0" aria-label="Use the left and right arrow keys to change photo. Press Enter to enlarge.">' +
      '<div class="s-track"></div>' +
      '<button class="s-btn s-prev" type="button" aria-label="Previous photo">' + ARROW_L + '</button>' +
      '<button class="s-btn s-next" type="button" aria-label="Next photo">' + ARROW_R + '</button>' +
      '<div class="s-cap"></div><div class="s-count" aria-hidden="true"></div>' +
    '</div><div class="s-dots"></div>';
  const view = root.querySelector('.s-view'), track = root.querySelector('.s-track');
  const cap = root.querySelector('.s-cap'), count = root.querySelector('.s-count'), dots = root.querySelector('.s-dots');
  slides.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide'; slide.setAttribute('role', 'group'); slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', (i + 1) + ' of ' + slides.length);
    const bg = document.createElement('div'); bg.className = 'bg'; bg.style.backgroundImage = 'url(' + IMG[s.key] + ')';
    const im = document.createElement('img'); im.src = IMG[s.key]; im.alt = s.alt; im.draggable = false;
    slide.append(bg, im); track.append(slide);
    const d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', 'Show photo ' + (i + 1) + ': ' + s.caption);
    d.addEventListener('click', () => go(i)); dots.append(d);
  });
  let cur = 0;
  function go(i) {
    cur = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(' + (-100 * cur) + '%)';
    cap.textContent = slides[cur].caption; count.textContent = (cur + 1) + ' / ' + slides.length;
    [...dots.children].forEach((d, k) => d.setAttribute('aria-current', k === cur ? 'true' : 'false'));
  }
  go(0);
  root.querySelector('.s-prev').addEventListener('click', e => { e.stopPropagation(); go(cur - 1); });
  root.querySelector('.s-next').addEventListener('click', e => { e.stopPropagation(); go(cur + 1); });
  let sx = null;
  view.addEventListener('pointerdown', e => { if (!e.target.closest('button')) sx = e.clientX; });
  view.addEventListener('pointercancel', () => { sx = null; });
  view.addEventListener('pointerup', e => {
    if (sx === null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
    else openLB(slides, cur, view);
  });
  view.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLB(slides, cur, view); }
  });
}
document.querySelectorAll('.slider').forEach(el => initSlider(el, SETS[el.dataset.set]));

/* ---------- enquiry form ---------- */
const form = document.getElementById('enq');
const $ = id => document.getElementById(id);
const roomSel = $('f-room');
document.querySelectorAll('[data-room]').forEach(a => {
  a.addEventListener('click', () => { roomSel.selectedIndex = a.dataset.room === '2bed' ? 1 : 0; });
});
const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
const iso = today.toISOString().slice(0, 10);
$('f-in').min = iso; $('f-out').min = iso;
$('f-in').addEventListener('change', () => { if ($('f-in').value) $('f-out').min = $('f-in').value; });

function fmtDate(v) {
  if (!v) return 'Not sure yet';
  const [y, m, d] = v.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function setErr(field, id, msg) {
  $(id).textContent = msg || '';
  if (field) field.setAttribute('aria-invalid', msg ? 'true' : 'false');
}
function validate(needEmail) {
  let ok = true;
  const name = $('f-name'), email = $('f-email');
  setErr(name, 'e-name', ''); setErr(email, 'e-email', ''); setErr($('f-out'), 'e-out', '');
  if (!name.value.trim()) { setErr(name, 'e-name', 'Add your name so we know who to reply to.'); ok = false; }
  if (needEmail && !/^\S+@\S+\.\S+$/.test(email.value.trim())) { setErr(email, 'e-email', 'Add an email address we can reply to.'); ok = false; }
  else if (!needEmail && email.value.trim() && !/^\S+@\S+\.\S+$/.test(email.value.trim())) { setErr(email, 'e-email', 'That email address looks incomplete.'); ok = false; }
  if ($('f-in').value && $('f-out').value && $('f-out').value <= $('f-in').value) { setErr($('f-out'), 'e-out', 'Check-out must be after check-in.'); ok = false; }
  if (!ok) { const bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); }
  return ok;
}
function lines() {
  const v = id => $(id).value.trim();
  return [
    'Name: ' + v('f-name'),
    v('f-email') ? 'Email: ' + v('f-email') : null,
    v('f-phone') ? 'Phone: ' + v('f-phone') : null,
    'Apartment: ' + roomSel.value,
    'Check-in: ' + fmtDate($('f-in').value),
    'Check-out: ' + fmtDate($('f-out').value),
    'Guests: ' + (v('f-guests') || 'Not sure yet'),
    v('f-msg') ? '' : null,
    v('f-msg') ? 'Message: ' + v('f-msg') : null
  ].filter(x => x !== null);
}
let lastText = '';
function showNotice(title, text, state) {
  const box = $('sent');
  $('sentH').textContent = title; $('sentP').textContent = text;
  box.dataset.state = state;
  box.querySelector('.sent-actions').hidden = true;
  box.classList.add('show');
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function showSent(title, text, linkHref, linkLabel) {
  $('sentH').textContent = title; $('sentP').textContent = text;
  const l = $('sentLink'); l.href = linkHref; l.textContent = linkLabel;
  const box = $('sent'); delete box.dataset.state;
  box.querySelector('.sent-actions').hidden = false;
  box.classList.add('show');
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!form.reportValidity() || !validate(false)) return;
  const submitButton = $('submitEnquiry');
  submitButton.disabled = true;
  submitButton.textContent = 'Saving...';
  $('sent').classList.remove('show');
  const payload = {
    apartmentType: roomSel.value,
    fullName: $('f-name').value.trim(),
    email: $('f-email').value.trim(),
    phone: $('f-phone').value.trim(),
    checkIn: $('f-in').value,
    checkOut: $('f-out').value,
    guests: Number($('f-guests').value),
    message: $('f-msg').value.trim()
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) throw new Error(result.message || 'The enquiry could not be saved. Please try again.');
    form.reset();
    $('f-out').min = iso;
    showNotice('Enquiry saved', 'Thank you. Your enquiry has been saved, and our team will get back to you soon.', 'success');
  } catch (err) {
    showNotice('Could not save enquiry', err.message || 'Please check your connection and try again.', 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Save enquiry';
  }
});
$('sendMail').addEventListener('click', () => {
  if (!validate(true)) return;
  const subject = 'Booking enquiry: ' + roomSel.value.split(' (')[0] + ' (' + $('f-name').value.trim() + ')';
  const body = 'Hello Malachite Apartments,\n\nI would like to check availability.\n\n' + lines().join('\n') + '\n\nThank you.';
  lastText = body;
  const href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  showSent('Your email is ready to send',
    'We tried to open your email app with your enquiry addressed to ' + EMAIL + '. Press send there to finish. If nothing opened, use the button below or copy the message.',
    href, 'Open email app');
  try { window.location.href = href; } catch (err) { /* the visible link below is the fallback */ }
});
$('sendWA').addEventListener('click', () => {
  if (!validate(false)) return;
  const text = 'Hello Malachite Apartments, I would like to check availability.\n\n' + lines().join('\n');
  lastText = text;
  const href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
  showSent('Your WhatsApp message is ready',
    'We opened WhatsApp with your enquiry. Press send there to finish. If nothing opened, use the button below.',
    href, 'Open WhatsApp');
  window.open(href, '_blank', 'noopener');
});
$('copyBtn').addEventListener('click', async () => {
  const btn = $('copyBtn');
  try { await navigator.clipboard.writeText(lastText); }
  catch (err) {
    const t = document.createElement('textarea'); t.value = lastText; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e2) {} t.remove();
  }
  btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = 'Copy message'; }, 2000);
});