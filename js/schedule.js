/* =============================================
   RHYTHMBLOOM ACADEMY — SCHEDULE JS
   Real-time filter logic for schedule page
   ============================================= */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const programFilter  = document.getElementById('filter-program');
    const ageFilter      = document.getElementById('filter-age');
    const levelFilter    = document.getElementById('filter-level');
    const dayFilter      = document.getElementById('filter-day');
    const timingFilter   = document.getElementById('filter-timing');
    const resetBtn       = document.getElementById('filter-reset');
    const resultCount    = document.getElementById('result-count');
    const scheduleCards  = document.querySelectorAll('.schedule-card');
    const noResults      = document.getElementById('no-results');

    if (!scheduleCards.length) return;

    function normalize(str) {
      return (str || '').toLowerCase().trim();
    }

    function filterCards() {
      const prog   = normalize(programFilter?.value);
      const age    = normalize(ageFilter?.value);
      const level  = normalize(levelFilter?.value);
      const day    = normalize(dayFilter?.value);
      const timing = normalize(timingFilter?.value);

      let visible = 0;

      scheduleCards.forEach(card => {
        const cardProg   = normalize(card.dataset.program);
        const cardAge    = normalize(card.dataset.age);
        const cardLevel  = normalize(card.dataset.level);
        const cardDay    = normalize(card.dataset.day);
        const cardTiming = normalize(card.dataset.timing);

        const matchProg   = !prog   || cardProg.includes(prog);
        const matchAge    = !age    || cardAge === age;
        const matchLevel  = !level  || cardLevel === level;
        const matchDay    = !day    || cardDay === day;
        const matchTiming = !timing || cardTiming === timing;

        const show = matchProg && matchAge && matchLevel && matchDay && matchTiming;
        card.classList.toggle('hidden', !show);
        if (show) visible++;
      });

      if (resultCount) {
        resultCount.textContent = `${visible} class${visible !== 1 ? 'es' : ''} found`;
      }

      if (noResults) {
        noResults.style.display = visible === 0 ? 'block' : 'none';
      }

      // Animate visible cards
      document.querySelectorAll('.schedule-card:not(.hidden)').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 40);
      });
    }

    // Attach change listeners
    [programFilter, ageFilter, levelFilter, dayFilter, timingFilter].forEach(el => {
      if (el) el.addEventListener('change', filterCards);
    });

    // Reset filters
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        [programFilter, ageFilter, levelFilter, dayFilter, timingFilter].forEach(el => {
          if (el) el.value = '';
        });
        filterCards();
      });
    }

    // Enroll in batch
    document.querySelectorAll('.enroll-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const batchName = this.dataset.batch || 'this batch';
        // Redirect to dashboard enrollment or show toast
        if (window.showToast) {
          window.showToast(`Redirecting to enroll in ${batchName}...`, 'info');
        }
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1200);
      });
    });

    // Initial run
    filterCards();
  });

})();
