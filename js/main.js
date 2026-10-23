// Header scroll effect
  const header = document.getElementById('header');
  const scrollProgress = header.querySelector('.scroll-progress span');
  let scrollProgressFrame = null;
  const updateScrollProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? Math.min(window.scrollY / scrollableHeight, 1) : 0;
    scrollProgress.style.transform = `scaleX(${progress})`;
    scrollProgressFrame = null;
  };
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    if (scrollProgressFrame === null) {
      scrollProgressFrame = window.requestAnimationFrame(updateScrollProgress);
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  updateScrollProgress();

  document.querySelectorAll('.client-logo img').forEach(image => {
    const showLogo = () => {
      image.hidden = false;
      image.nextElementSibling.hidden = true;
    };
    const showPlaceholder = () => {
      image.hidden = true;
      image.nextElementSibling.hidden = false;
    };

    image.addEventListener('load', showLogo);
    image.addEventListener('error', showPlaceholder);
    if (image.complete && image.naturalWidth > 0) showLogo();
  });

  // Mobile nav
  const mobileNav = document.getElementById('mobileNav');
  document.getElementById('burger').addEventListener('click', () => mobileNav.classList.add('open'));
  document.getElementById('closeNav').addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  const helpAdVideo = document.querySelector('.help-ad-video');
  if (helpAdVideo) {
    const soundButton = document.querySelector('.help-ad-sound');
    helpAdVideo.muted = true;
    helpAdVideo.playsInline = true;
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!helpAdVideo.src) {
            helpAdVideo.src = helpAdVideo.dataset.src;
            helpAdVideo.load();
          }
          helpAdVideo.play().catch(error => {
            if (error.name === 'NotAllowedError') {
              soundButton.textContent = 'Putar video';
              soundButton.hidden = false;
              return;
            }
            if (error.name !== 'AbortError') console.error('Video iklan CAST gagal diputar:', error);
          });
        } else {
          helpAdVideo.pause();
        }
      });
    }, { threshold: 0.05, rootMargin: '80px 0px' });

    soundButton.addEventListener('click', () => {
      if (helpAdVideo.paused) {
        helpAdVideo.muted = true;
        helpAdVideo.play().then(() => {
          soundButton.textContent = 'Aktifkan suara video';
        }).catch(error => {
          console.error('Video iklan CAST gagal diputar:', error);
        });
        return;
      }
      helpAdVideo.muted = false;
      helpAdVideo.play().then(() => {
        soundButton.hidden = true;
      }).catch(error => {
        helpAdVideo.muted = true;
        console.error('Video iklan CAST gagal diputar dengan suara:', error);
      });
    });
    helpAdVideo.addEventListener('play', () => {
      soundButton.textContent = 'Aktifkan suara video';
      soundButton.hidden = false;
    });
    helpAdVideo.addEventListener('error', () => {
      console.error(`Video iklan CAST tidak dapat dimuat: ${helpAdVideo.dataset.src}`);
    });
    videoObserver.observe(helpAdVideo);
  }

  // Service photos fall back to their placeholder until the local image is available.
  document.querySelectorAll('.service-preview-photo').forEach(photo => {
    const placeholder = photo.parentElement.querySelector('.service-preview-placeholder');
    const showPhoto = () => {
      photo.hidden = false;
      placeholder.hidden = true;
    };
    const showPlaceholder = () => {
      photo.hidden = true;
      placeholder.hidden = false;
    };

    photo.addEventListener('load', showPhoto);
    photo.addEventListener('error', showPlaceholder);
    if (photo.complete && photo.naturalWidth > 0) showPhoto();
  });

  // Portfolio video player
  const projectVideoDialog = document.getElementById('projectVideoDialog');
  const projectVideo = document.getElementById('projectVideo');
  const projectImage = document.getElementById('projectImage');
  const projectMediaMessage = document.getElementById('projectMediaMessage');
  const projectCarouselTitle = document.getElementById('projectCarouselTitle');
  const projectCarouselPosition = document.getElementById('projectCarouselPosition');
  const projectSlideButtons = Array.from(projectVideoDialog.querySelectorAll('[data-project-slide]'));
  const projectSlides = ['reels', 'design', 'entertainment'];
  let activeProject = null;
  let activeProjectSlide = 0;

  function showProjectSlide(index) {
    if (!activeProject) return;
    activeProjectSlide = (index + projectSlides.length) % projectSlides.length;
    const type = projectSlides[activeProjectSlide];
    const isImage = type === 'design';
    const source = activeProject.dataset[type];

    projectVideo.pause();
    projectVideo.removeAttribute('src');
    projectVideo.dataset.source = '';
    projectVideo.load();
    projectVideo.hidden = true;
    projectImage.hidden = true;
    projectImage.dataset.source = '';
    projectMediaMessage.hidden = true;
    projectMediaMessage.textContent = '';
    projectCarouselPosition.textContent = `${activeProjectSlide + 1} / ${projectSlides.length} · ${projectSlideButtons[activeProjectSlide].textContent}`;
    projectSlideButtons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === activeProjectSlide;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    if (!source) {
      projectMediaMessage.textContent = `Dokumentasi ${projectSlideButtons[activeProjectSlide].textContent} belum ditambahkan untuk ${activeProject.dataset.projectName}.`;
      projectMediaMessage.hidden = false;
      return;
    }

    if (isImage) {
      projectImage.dataset.source = source;
      projectImage.alt = `Dokumentasi design ${activeProject.dataset.projectName}`;
      projectImage.onload = () => {
        if (projectImage.dataset.source === source) projectImage.hidden = false;
      };
      projectImage.onerror = () => {
        if (projectImage.dataset.source !== source) return;
        projectImage.hidden = true;
        projectMediaMessage.textContent = `Tambahkan dokumentasi design ${activeProject.dataset.projectName} di ${source}.`;
        projectMediaMessage.hidden = false;
      };
      projectImage.src = source;
      return;
    }

    projectVideo.dataset.source = source;
    projectVideo.hidden = false;
    projectVideo.onplay = () => {
      if (projectVideo.dataset.source === source) projectMediaMessage.hidden = true;
    };
    projectVideo.onerror = () => {
      if (projectVideo.dataset.source !== source) return;
      projectVideo.hidden = true;
      projectMediaMessage.textContent = `Tambahkan dokumentasi ${projectSlideButtons[activeProjectSlide].textContent} ${activeProject.dataset.projectName} di ${source}.`;
      projectMediaMessage.hidden = false;
    };
    projectVideo.src = source;
    projectVideo.load();
    projectVideo.play().catch(error => {
      if (projectVideo.dataset.source !== source || error.name === 'AbortError') return;
      if (error.name === 'NotAllowedError') {
        projectMediaMessage.textContent = 'Tekan tombol putar pada video untuk memulai.';
        projectMediaMessage.hidden = false;
        return;
      }
      console.error(`Gagal memutar dokumentasi proyek: ${source}`, error);
      projectMediaMessage.textContent = `Video tidak dapat diputar. Periksa file ${source}.`;
      projectMediaMessage.hidden = false;
    });
  }

  function openProjectCarousel(project) {
    activeProject = project;
    projectCarouselTitle.textContent = project.dataset.projectName;
    if (typeof projectVideoDialog.showModal === 'function') {
      projectVideoDialog.showModal();
    } else {
      projectVideoDialog.classList.add('is-open');
      projectVideoDialog.setAttribute('open', '');
    }
    const selectedCategory = project.querySelector('.project-card-category').textContent.trim().toLowerCase();
    const selectedSlide = projectSlides.indexOf(selectedCategory);
    showProjectSlide(selectedSlide === -1 ? 0 : selectedSlide);
  }

  function showProjectCardSlide(project, type) {
    const video = project.querySelector('.project-thumbnail');
    const image = project.querySelector('.project-thumbnail-image');
    const cover = project.querySelector('.project-card-cover');
    const message = project.querySelector('.project-card-message');
    const source = project.dataset[type];

    video.pause();
    video.removeAttribute('src');
    video.dataset.source = '';
    video.load();
    video.hidden = true;
    image.hidden = true;
    image.dataset.source = '';
    if (cover) cover.hidden = true;
    message.hidden = true;
    message.textContent = '';
    if (!source) {
      message.textContent = `Dokumentasi ${type} belum ditambahkan untuk ${project.dataset.projectName}.`;
      message.hidden = false;
      return;
    }

    if (type === 'reels' && project.dataset.previewLabel && cover) {
      cover.textContent = project.dataset.previewLabel.toUpperCase();
      cover.hidden = false;
      return;
    }

    if (type === 'design') {
      image.alt = `Dokumentasi design ${project.dataset.projectName}`;
      image.dataset.source = source;
      image.onload = () => {
        if (image.dataset.source === source) image.hidden = false;
      };
      image.onerror = () => {
        if (image.dataset.source !== source) return;
        message.textContent = `Tambahkan file ${source} untuk menampilkan dokumentasi design.`;
        message.hidden = false;
      };
      image.src = source;
      return;
    }

    video.onerror = () => {
      if (video.dataset.source !== source) return;
      message.textContent = `Tambahkan file ${source} untuk menampilkan dokumentasi video.`;
      message.hidden = false;
    };
    video.dataset.source = source;
    video.src = source;
    video.hidden = false;
    video.load();
    video.muted = true;
    video.playsInline = true;
  }

  const workGrid = document.querySelector('.work-grid');
  const portfolioFilters = Array.from(document.querySelectorAll('[data-portfolio-filter]'));
  const portfolioCategoryLabels = {
    reels: 'Reels',
    design: 'Design',
    entertainment: 'Entertainment',
    event: 'Event'
  };
  const projectLoadObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const project = entry.target;
      const video = project.querySelector('.project-thumbnail');
      const source = video.dataset.source;
      if (!video.hidden && source && !video.src) {
        video.preload = 'metadata';
        video.src = source;
        video.load();
      }
      projectLoadObserver.unobserve(project);
    });
  }, { rootMargin: '500px 0px' });
  const projectPreviewObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('.project-thumbnail');
      if (!video || video.hidden || !video.dataset.source) return;
      if (entry.isIntersecting) {
        if (!video.src) {
          video.preload = 'metadata';
          video.src = video.dataset.source;
          video.load();
        }
        video.muted = true;
        video.playsInline = true;
        video.play().catch(error => {
          if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
            console.error(`Gagal memutar preview proyek: ${video.dataset.source}`, error);
          }
        });
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });
  workGrid.querySelectorAll('.project-work').forEach(project => {
    const video = project.querySelector('.project-thumbnail');
    video.muted = true;
    video.playsInline = true;
    video.dataset.source = video.dataset.src || project.dataset.reels;
    const cover = project.querySelector('.project-card-cover');
    if (project.dataset.previewLabel && cover) {
      video.hidden = true;
      cover.textContent = project.dataset.previewLabel.toUpperCase();
      cover.hidden = false;
    }
    projectLoadObserver.observe(project);
    projectPreviewObserver.observe(project);
  });

  portfolioFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      const selectedFilter = filter.dataset.portfolioFilter;
      const mediaType = selectedFilter === 'all' ? 'reels' : selectedFilter;
      const categoryLabel = portfolioCategoryLabels[mediaType];
      if (!categoryLabel) return;

      portfolioFilters.forEach(button => {
        const selected = button === filter;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      workGrid.querySelectorAll('.project-work').forEach(project => {
        project.querySelector('.project-card-category').textContent = categoryLabel.toUpperCase();
        showProjectCardSlide(project, mediaType);
        projectLoadObserver.unobserve(project);
        projectLoadObserver.observe(project);
        projectPreviewObserver.unobserve(project);
        projectPreviewObserver.observe(project);
      });
    });
  });

  workGrid.addEventListener('click', event => {
    const openButton = event.target.closest('.project-open');
    if (!openButton) return;

    const project = openButton.closest('.project-work');
    if (project) openProjectCarousel(project);
  });
  const heroVideoLink = document.querySelector('.video-link');
  if (heroVideoLink) {
    heroVideoLink.addEventListener('click', event => {
      event.preventDefault();
      const iSellProject = document.querySelector('.project-work[data-project-name^="iSell"]');
      if (iSellProject) openProjectCarousel(iSellProject);
    });
  }
  projectVideoDialog.querySelector('.project-carousel-prev').addEventListener('click', () => {
    showProjectSlide(activeProjectSlide - 1);
  });
  projectVideoDialog.querySelector('.project-carousel-next').addEventListener('click', () => {
    showProjectSlide(activeProjectSlide + 1);
  });
  projectSlideButtons.forEach((button, index) => {
    button.addEventListener('click', () => showProjectSlide(index));
  });
  function clearProjectCarousel() {
    projectVideo.pause();
    projectVideo.removeAttribute('src');
    projectVideo.load();
    projectImage.removeAttribute('src');
    projectImage.hidden = true;
    projectMediaMessage.hidden = true;
    activeProject = null;
  }
  document.querySelector('.video-dialog-close').addEventListener('click', () => {
    if (typeof projectVideoDialog.close === 'function') {
      projectVideoDialog.close();
    } else {
      projectVideoDialog.classList.remove('is-open');
      projectVideoDialog.removeAttribute('open');
      clearProjectCarousel();
    }
  });
  projectVideoDialog.addEventListener('close', clearProjectCarousel);

  // Testimonial slider
  const testimonials = [];
  let tIdx = 0;
  const card = document.getElementById('testiCard');
  const emptyTestimonial = document.getElementById('testiEmpty');
  const testimonialQuote = document.getElementById('testiQuote');
  const testimonialPerson = document.getElementById('testiPerson');
  const testimonialNavigation = document.getElementById('testiNav');
  const testimonialForm = document.getElementById('testimonialForm');
  const testimonialFormStatus = document.getElementById('testimonialFormStatus');
  function showTesti(i) {
    if (testimonials.length === 0) {
      emptyTestimonial.hidden = false;
      testimonialQuote.hidden = true;
      testimonialPerson.hidden = true;
      testimonialNavigation.hidden = true;
      return;
    }

    tIdx = (i + testimonials.length) % testimonials.length;
    card.style.opacity = 0; card.style.transform = 'translateY(10px)'; card.style.transition = '.3s';
    setTimeout(() => {
      emptyTestimonial.hidden = true;
      testimonialQuote.hidden = false;
      testimonialPerson.hidden = false;
      testimonialNavigation.hidden = testimonials.length < 2;
      testimonialQuote.textContent = testimonials[tIdx].q;
      document.getElementById('testiName').textContent = testimonials[tIdx].n;
      document.getElementById('testiRole').textContent = testimonials[tIdx].r;
      const image = document.getElementById('testiImg');
      if (testimonials[tIdx].img && testimonials[tIdx].img.trim()) {
        image.src = testimonials[tIdx].img;
        image.hidden = false;
      } else {
        image.removeAttribute('src');
        image.hidden = true;
      }
      card.style.opacity = 1; card.style.transform = 'none';
    }, 300);
  }
  document.getElementById('nextTesti').addEventListener('click', () => showTesti(tIdx + 1));
  document.getElementById('prevTesti').addEventListener('click', () => showTesti(tIdx - 1));

  const supabaseConfig = window.CAST_SUPABASE;
  const hasSupabaseConfig = supabaseConfig?.url && supabaseConfig?.anonKey;
  const testimonialEndpoint = hasSupabaseConfig
    ? `${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/testimonials`
    : '';
  function setTestimonialStatus(message, state = '') {
    testimonialFormStatus.textContent = message;
    testimonialFormStatus.dataset.state = state;
  }
  function testimonialHeaders(extraHeaders = {}) {
    return {
      apikey: supabaseConfig.anonKey,
      'Content-Type': 'application/json',
      ...extraHeaders
    };
  }
  async function checkTestimonialResponse(response, action) {
    if (response.ok) return;
    const details = (await response.text()).slice(0, 240);
    throw new Error(`${action} (${response.status})${details ? `: ${details}` : '.'}`);
  }
  async function loadClientTestimonials() {
    if (!hasSupabaseConfig) {
      setTestimonialStatus('Form belum aktif. Hubungkan URL dan anon key Supabase di js/supabase-config.js.');
      return;
    }

    const response = await fetch(`${testimonialEndpoint}?select=id,name,company,role,quote,created_at&is_approved=eq.true&order=created_at.asc`, {
      headers: testimonialHeaders()
    });
    await checkTestimonialResponse(response, 'Gagal memuat testimoni');

    const submittedTestimonials = await response.json();
    submittedTestimonials.forEach(item => {
      testimonials.push({
        q: item.quote,
        n: item.name,
        r: [item.company, item.role].filter(Boolean).join(' — '),
        company: item.company,
        img: ''
      });
    });
    showTesti(0);
  }
  loadClientTestimonials().catch(error => {
    console.error(error);
    setTestimonialStatus(`${error.message} Periksa tabel dan kebijakan akses Supabase.`, 'error');
  });
  testimonialForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!hasSupabaseConfig) {
      setTestimonialStatus('Testimoni belum bisa dikirim karena Supabase belum dikonfigurasi. Isi URL project dan anon public key di js/supabase-config.js.', 'error');
      return;
    }

    const submitButton = testimonialForm.querySelector('button[type="submit"]');
    const formData = new FormData(testimonialForm);
    const testimonial = {
      name: formData.get('name').trim(),
      company: formData.get('company').trim(),
      role: formData.get('role').trim(),
      quote: formData.get('quote').trim(),
      consented_at: new Date().toISOString()
    };
    submitButton.disabled = true;
    setTestimonialStatus('Mengirim testimoni...');
    try {
      const response = await fetch(testimonialEndpoint, {
        method: 'POST',
        headers: testimonialHeaders(),
        body: JSON.stringify(testimonial)
      });
      await checkTestimonialResponse(response, 'Testimoni gagal dikirim');

      testimonialForm.reset();
      setTestimonialStatus('Terima kasih! Testimoni sudah diterima dan akan ditampilkan setelah disetujui tim CAST.', 'success');
    } catch (error) {
      console.error(error);
      setTestimonialStatus(`${error.message} Silakan coba lagi.`, 'error');
    } finally {
      submitButton.disabled = false;
    }
  });

  // Show the loader on every page visit until loading completes.
  const castLoader = document.getElementById('cast-loader');
  if (castLoader) {
    const loaderShownAt = performance.now();
    let pageLoaded = document.readyState === 'complete';

    const hideImmediately = () => {
      castLoader.classList.remove('is-visible', 'is-hiding');
      castLoader.classList.add('is-hidden-now');
    };

    const fadeLoaderAfterMinimum = () => {
      if (!pageLoaded) return;
      const remaining = 700 - (performance.now() - loaderShownAt);
      if (remaining > 0) {
        setTimeout(fadeLoaderAfterMinimum, remaining);
        return;
      }
      castLoader.classList.remove('is-visible');
      castLoader.classList.add('is-hiding');
    };

    castLoader.classList.add('is-visible');

    if (pageLoaded) {
      fadeLoaderAfterMinimum();
    } else {
      window.addEventListener('load', () => {
        pageLoaded = true;
        fadeLoaderAfterMinimum();
      }, { once: true });
    }

    setTimeout(hideImmediately, Math.max(0, 3000 - performance.now()));
  }
