// ---------- Header & navigasi ----------
const header = document.querySelector('.site-header');
const burger = document.getElementById('burger');
const mainNav = document.getElementById('mainNav');
const waFloat = document.querySelector('.wa-float');
const hero = document.querySelector('.hero');

const setNav = open => {
  mainNav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
};
burger.addEventListener('click', () => setNav(!mainNav.classList.contains('is-open')));
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setNav(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setNav(false);
});

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 10);
}, { passive: true });

// Tombol WA mengambang muncul setelah hero lewat, dan sembunyi saat form kontak terlihat.
if (hero && waFloat) {
  const contact = document.getElementById('kontak');
  let pastHero = false;
  let contactVisible = false;
  const update = () => waFloat.classList.toggle('is-visible', pastHero && !contactVisible);
  new IntersectionObserver(([entry]) => {
    pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    update();
  }).observe(hero);
  if (contact) {
    new IntersectionObserver(([entry]) => {
      contactVisible = entry.isIntersecting;
      update();
    }, { threshold: 0.25 }).observe(contact);
  }
}

// ---------- Animasi muncul saat scroll ----------
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- Video: dimuat & diputar hanya saat terlihat ----------
const loadVideo = video => {
  if (video.src) return;
  video.src = video.dataset.src;
  video.preload = 'metadata';
};
const videoObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target: video, isIntersecting }) => {
    if (isIntersecting) {
      loadVideo(video);
      video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  });
}, { threshold: 0.25 });
const lazyVideos = document.querySelectorAll('video[data-src]');
lazyVideos.forEach(video => { video.muted = true; });
// Video baru diunduh setelah halaman selesai dimuat agar tidak berebut bandwidth dengan teks & gambar.
const startVideos = () => lazyVideos.forEach(video => videoObserver.observe(video));
if (document.readyState === 'complete') startVideos();
else window.addEventListener('load', startVideos, { once: true });

const phoneVideo = document.querySelector('.phone-video');
const soundButton = document.querySelector('.phone-sound');
if (phoneVideo && soundButton) {
  soundButton.addEventListener('click', () => {
    loadVideo(phoneVideo);
    phoneVideo.muted = !phoneVideo.muted;
    if (!phoneVideo.muted) phoneVideo.play().catch(() => {});
    soundButton.textContent = phoneVideo.muted ? 'Nyalakan suara' : 'Matikan suara';
    soundButton.setAttribute('aria-pressed', String(!phoneVideo.muted));
  });
}

// ---------- Tab jenis hasil karya ----------
// Video di panel tersembunyi tidak terlihat, jadi videoObserver otomatis menjeda/menunda memuatnya.
const workTabs = [...document.querySelectorAll('.work-tab')];
const selectWorkTab = (tab, focus) => {
  workTabs.forEach(other => {
    const selected = other === tab;
    other.setAttribute('aria-selected', String(selected));
    other.tabIndex = selected ? 0 : -1;
    document.getElementById(other.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) tab.focus();
};
workTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectWorkTab(tab));
  tab.addEventListener('keydown', event => {
    const last = workTabs.length - 1;
    const target = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    selectWorkTab(workTabs[target], true);
  });
});

// ---------- Dialog hasil karya ----------
const dialog = document.getElementById('mediaDialog');
const dialogStage = dialog.querySelector('.media-dialog-stage');
const dialogTitle = document.getElementById('mediaDialogTitle');

document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('click', () => {
    const src = card.dataset.media;
    dialogTitle.textContent = card.dataset.title;
    dialogStage.replaceChildren();
    if (/\.(mp4|webm)$/i.test(src)) {
      const video = document.createElement('video');
      Object.assign(video, { src, controls: true, autoplay: true, playsInline: true });
      dialogStage.append(video);
    } else {
      const img = document.createElement('img');
      Object.assign(img, { src, alt: card.dataset.title });
      dialogStage.append(img);
    }
    dialog.showModal();
  });
});
dialog.querySelector('.media-dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => dialogStage.replaceChildren());

// ---------- FAQ: satu item terbuka dalam satu waktu ----------
const faqItems = document.querySelectorAll('.faq-list details');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});

// ---------- Form konsultasi → WhatsApp ----------
const leadForm = document.getElementById('leadForm');
const leadError = document.getElementById('leadFormError');
leadForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(leadForm);
  const name = data.get('name').trim();
  const brand = data.get('brand').trim();
  const services = data.getAll('service');
  const note = data.get('note').trim();

  if (!name || !brand) {
    leadError.textContent = 'Isi nama dan nama brand dulu ya.';
    leadError.hidden = false;
    leadForm.querySelector(name ? '[name="brand"]' : '[name="name"]').focus();
    return;
  }
  leadError.hidden = true;

  const lines = [
    'Halo CAST Digital, saya mau konsultasi gratis.',
    '',
    `Nama: ${name}`,
    `Brand/usaha: ${brand}`,
    `Layanan: ${services.length ? services.join(', ') : 'Belum tahu, mau diarahkan'}`
  ];
  if (note) lines.push(`Cerita singkat: ${note}`);

  window.CAST_WA.trackLead('form');
  window.open(window.CAST_WA.waUrl(lines.join('\n')), '_blank', 'noopener');
});

document.getElementById('year').textContent = new Date().getFullYear();
