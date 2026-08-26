/* =============================================
   RHYTHMBLOOM ACADEMY — GALLERY JS
   Lightbox viewer + category filtering
   ============================================= */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const filterBtns  = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCap = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev  = document.getElementById('lightbox-prev');
    const lightboxNext  = document.getElementById('lightbox-next');

    if (!galleryItems.length) return;

    let visibleItems = [...galleryItems];
    let currentIndex = 0;

    /* ── Category Filter ── */
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const cat = this.dataset.filter;

        galleryItems.forEach((item, i) => {
          const itemCat = item.dataset.category;
          const show = cat === 'all' || itemCat === cat;
          item.classList.toggle('hidden', !show);

          // Stagger animation
          if (show) {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.94)';
            setTimeout(() => {
              item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 30);
          }
        });

        // Rebuild visible items array
        visibleItems = [...galleryItems].filter(item => !item.classList.contains('hidden'));
      });
    });

    /* ── Lightbox Open ── */
    galleryItems.forEach((item) => {
      item.addEventListener('click', function () {
        visibleItems = [...galleryItems].filter(i => !i.classList.contains('hidden'));
        currentIndex = visibleItems.indexOf(item);
        openLightbox(currentIndex);
      });
    });

    function openLightbox(index) {
      const item = visibleItems[index];
      if (!item || !lightbox) return;
      const img = item.querySelector('img');
      const label = item.querySelector('.gallery-item-label');
      const cat   = item.querySelector('.gallery-item-cat');

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCap.textContent = [
        label ? label.textContent : '',
        cat   ? `• ${cat.textContent}` : ''
      ].filter(Boolean).join(' ');

      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      currentIndex = index;
    }

    function closeLightbox() {
      if (lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      openLightbox(currentIndex);
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % visibleItems.length;
      openLightbox(currentIndex);
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev)  lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext)  lightboxNext.addEventListener('click', showNext);

    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!lightbox?.classList.contains('open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   showPrev();
      if (e.key === 'ArrowRight')  showNext();
    });

    // Touch/swipe
    let touchStartX = 0;
    if (lightbox) {
      lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
      lightbox.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? showNext() : showPrev();
        }
      });
    }

  });

})();
