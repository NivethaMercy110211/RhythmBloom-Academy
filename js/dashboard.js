/* =============================================
   RHYTHMBLOOM ACADEMY — DASHBOARD JS
   Child switcher, enrollment wizard, attendance
   calendar, payment modal, receipt download
   ============================================= */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ════════════════════════════════════════
       SIDEBAR NAVIGATION TABS
    ════════════════════════════════════════ */
    const sidebarLinks = document.querySelectorAll('.sidebar-nav-link[data-tab]');
    const tabPanels = document.querySelectorAll('.dashboard-tab-panel');

    function activateTab(tabId) {
      sidebarLinks.forEach(l => l.classList.toggle('active', l.dataset.tab === tabId));
      tabPanels.forEach(p => p.classList.toggle('active', p.id === tabId));
      // Update URL hash without reload
      history.replaceState(null, '', `#${tabId}`);
    }

    sidebarLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        activateTab(this.dataset.tab);
        // Close mobile sidebar
        sidebar?.classList.remove('open');
      });
    });

    // Activate from URL hash or default
    const hash = window.location.hash.replace('#', '');
    activateTab(hash && document.getElementById(hash) ? hash : 'tab-overview');

    /* ════════════════════════════════════════
       MOBILE SIDEBAR TOGGLE
    ════════════════════════════════════════ */
    const sidebar = document.querySelector('.dashboard-sidebar');
    const mobileToggle = document.querySelector('.dashboard-mobile-toggle');

    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });

      document.addEventListener('click', e => {
        if (sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          !mobileToggle.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      });
    }

    /* Profile menu */
    const profileButton = document.querySelector('.dashboard-profile-btn');
    const profileMenu = document.querySelector('.dashboard-profile-menu');
    if (profileButton && profileMenu) {
      profileButton.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = profileMenu.classList.toggle('open');
        this.setAttribute('aria-expanded', String(isOpen));
      });
      document.addEventListener('click', function (e) {
        if (!profileMenu.contains(e.target) && !profileButton.contains(e.target)) {
          profileMenu.classList.remove('open');
          profileButton.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* ════════════════════════════════════════
       CHILD SWITCHER
    ════════════════════════════════════════ */
    const childSwitcher = document.querySelector('.dashboard-child-selector');
    const childDropdown = document.querySelector('.child-dropdown');

    if (childSwitcher && childDropdown) {
      childSwitcher.addEventListener('click', () => {
        childDropdown.classList.toggle('open');
      });

      document.querySelectorAll('.child-option').forEach(opt => {
        opt.addEventListener('click', function () {
          const name = this.dataset.name;
          const program = this.dataset.program;
          const initial = this.dataset.initial;

          document.querySelector('.child-name').textContent = name;
          document.querySelector('.child-program').textContent = program;
          const av = document.querySelector('.child-avatar');
          if (av) av.textContent = initial;

          childDropdown.classList.remove('open');
          window.showToast?.(`Switched to ${name}`, 'success');
        });
      });

      document.addEventListener('click', e => {
        if (!childSwitcher.contains(e.target) && !childDropdown.contains(e.target)) {
          childDropdown.classList.remove('open');
        }
      });
    }

    /* ════════════════════════════════════════
       ENROLLMENT WIZARD
    ════════════════════════════════════════ */
    let enrollStep = 1;
    const maxSteps = 5;

    function goToEnrollStep(step) {
      enrollStep = Math.max(1, Math.min(maxSteps, step));
      document.querySelectorAll('.enrollment-step-content').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.step) === enrollStep);
      });
      document.querySelectorAll('.enrollment-step-tab').forEach((tab, i) => {
        const tabStep = i + 1;
        tab.classList.remove('active', 'done');
        if (tabStep === enrollStep) tab.classList.add('active');
        if (tabStep < enrollStep) tab.classList.add('done');
      });
      const progressPrev = document.querySelector('[data-enroll-progress-prev]');
      const progressNext = document.querySelector('[data-enroll-progress-next]');
      if (progressPrev) progressPrev.disabled = enrollStep === 1;
      if (progressNext) progressNext.disabled = enrollStep === maxSteps;
    }

    document.querySelector('[data-enroll-progress-prev]')?.addEventListener('click', () => {
      goToEnrollStep(enrollStep - 1);
    });

    document.querySelector('[data-enroll-progress-next]')?.addEventListener('click', () => {
      goToEnrollStep(enrollStep + 1);
    });

    document.querySelectorAll('[data-enroll-next]').forEach(btn => {
      btn.addEventListener('click', () => goToEnrollStep(enrollStep + 1));
    });

    document.querySelectorAll('[data-enroll-prev]').forEach(btn => {
      btn.addEventListener('click', () => goToEnrollStep(enrollStep - 1));
    });

    // Program selector
    document.querySelectorAll('.program-selector-item').forEach(item => {
      item.addEventListener('click', function () {
        document.querySelectorAll('.program-selector-item').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
      });
    });

    // Level selector
    document.querySelectorAll('[data-level-select]').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-level-select]').forEach(b => b.classList.remove('selected', 'btn-primary'));
        this.classList.add('selected', 'btn-primary');
      });
    });

    // Batch selector
    document.querySelectorAll('.batch-item').forEach(item => {
      item.addEventListener('click', function () {
        document.querySelectorAll('.batch-item').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
      });
    });

    // Confirm enrollment
    const confirmEnrollBtn = document.getElementById('confirm-enroll-btn');
    if (confirmEnrollBtn) {
      confirmEnrollBtn.addEventListener('click', function () {
        this.innerHTML = '<span class="spinner"></span> Enrolling...';
        this.disabled = true;
        setTimeout(() => {
          this.innerHTML = '<i class="bi bi-check-circle-fill"></i> Enrolled!';
          window.showToast?.('Successfully enrolled! Welcome to RhythmBloom Academy.', 'success', 5000);
          goToEnrollStep(5); // Confirmation step
        }, 1500);
      });
    }

    goToEnrollStep(1);

    /* ════════════════════════════════════════
       ATTENDANCE CALENDAR
    ════════════════════════════════════════ */
    const attendanceData = {
      2026: {
        7: { // August (0-indexed: 7)
          classes: [2, 5, 9, 12, 16, 19, 23, 26],
          present: [2, 5, 9, 16, 19, 23],
          absent: [12, 26]
        }
      }
    };

    let calYear = 2026;
    let calMonth = 7; // August

    const calTitle = document.getElementById('cal-title');
    const calGrid = document.getElementById('cal-grid');
    const calPrevBtn = document.getElementById('cal-prev');
    const calNextBtn = document.getElementById('cal-next');

    function renderCalendar(year, month) {
      if (!calGrid) return;

      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      if (calTitle) calTitle.textContent = `${monthNames[month]} ${year}`;

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const data = (attendanceData[year]?.[month]) || { classes: [], present: [], absent: [] };

      const today = new Date();
      const isThisMonth = today.getFullYear() === year && today.getMonth() === month;

      const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let html = dayHeaders.map(d =>
        `<div class="att-cal-day-header">${d}</div>`
      ).join('');

      // Empty cells
      for (let i = 0; i < firstDay; i++) {
        html += `<div class="att-cal-day empty"></div>`;
      }

      for (let d = 1; d <= daysInMonth; d++) {
        let cls = 'att-cal-day';
        let icon = '';
        let title = '';

        if (data.present.includes(d)) {
          cls += ' present';
          icon = '<span class="day-icon">✓</span>';
          title = 'Present';
        } else if (data.absent.includes(d)) {
          cls += ' absent';
          icon = '<span class="day-icon">✗</span>';
          title = 'Absent';
        } else if (!data.classes.includes(d)) {
          cls += ' no-class';
        }

        if (isThisMonth && today.getDate() === d) cls += ' today';

        html += `<div class="${cls}" title="${title}">
          <span class="day-num">${d}</span>
          ${icon}
        </div>`;
      }

      calGrid.innerHTML = html;
    }

    if (calPrevBtn) {
      calPrevBtn.addEventListener('click', () => {
        calMonth--;
        if (calMonth < 0) { calMonth = 11; calYear--; }
        renderCalendar(calYear, calMonth);
      });
    }

    if (calNextBtn) {
      calNextBtn.addEventListener('click', () => {
        calMonth++;
        if (calMonth > 11) { calMonth = 0; calYear++; }
        renderCalendar(calYear, calMonth);
      });
    }

    renderCalendar(calYear, calMonth);

    /* ════════════════════════════════════════
       NOTIFICATIONS — MARK AS READ
    ════════════════════════════════════════ */
    document.querySelectorAll('.notif-item.unread').forEach(item => {
      item.addEventListener('click', function () {
        this.classList.remove('unread');
        // Update badge count
        const badge = document.querySelector('.sidebar-badge');
        if (badge) {
          const count = parseInt(badge.textContent) - 1;
          if (count <= 0) badge.remove();
          else badge.textContent = count;
        }
      });
    });

    const markAllBtn = document.getElementById('mark-all-read');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.notif-item.unread').forEach(i => i.classList.remove('unread'));
        document.querySelector('.sidebar-badge')?.remove();
        window.showToast?.('All notifications marked as read', 'success');
      });
    }

    /* ════════════════════════════════════════
       PAYMENT MODAL
    ════════════════════════════════════════ */
    const payModal = document.getElementById('pay-modal');
    const payBtn = document.getElementById('pay-btn');
    const payClose = document.getElementById('pay-modal-close');
    const payCancel = document.getElementById('pay-cancel');
    const payConfirm = document.getElementById('pay-confirm');
    const receiptModal = document.getElementById('receipt-modal');
    const receiptClose = document.getElementById('receipt-close');
    const downloadReceipt = document.getElementById('download-receipt');

    function openModal(modal) {
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal(modal) {
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    if (payBtn) payBtn.addEventListener('click', () => openModal(payModal));
    if (payClose) payClose.addEventListener('click', () => closeModal(payModal));
    if (payCancel) payCancel.addEventListener('click', () => closeModal(payModal));

    if (payModal) {
      payModal.addEventListener('click', e => {
        if (e.target === payModal) closeModal(payModal);
      });
    }

    if (payConfirm) {
      payConfirm.addEventListener('click', function () {
        this.innerHTML = '<span>Processing...</span>';
        this.disabled = true;
        setTimeout(() => {
          closeModal(payModal);
          openModal(receiptModal);
          // Update fee status UI
          const status = document.getElementById('fee-status');
          if (status) {
            status.className = 'badge badge-success';
            status.textContent = 'Paid';
          }
          const outstanding = document.getElementById('outstanding-amount');
          if (outstanding) outstanding.textContent = '₹0';
          window.showToast?.('Payment successful! Your receipt is ready.', 'success', 5000);
          this.innerHTML = 'Confirm Payment';
          this.disabled = false;
        }, 1800);
      });
    }

    if (receiptClose) receiptClose.addEventListener('click', () => closeModal(receiptModal));

    if (receiptModal) {
      receiptModal.addEventListener('click', e => {
        if (e.target === receiptModal) closeModal(receiptModal);
      });
    }

    if (downloadReceipt) {
      downloadReceipt.addEventListener('click', function () {
        window.showToast?.('Receipt downloaded successfully!', 'success');
      });
    }

    /* ════════════════════════════════════════
       QUICK ACTIONS (Dashboard Buttons)
    ════════════════════════════════════════ */
    document.querySelectorAll('[data-quick-action]').forEach(btn => {
      btn.addEventListener('click', function () {
        const action = this.dataset.quickAction;
        switch (action) {
          case 'enroll':
            activateTab('tab-enrollment');
            break;
          case 'attendance':
            activateTab('tab-attendance');
            break;
          case 'fees':
            activateTab('tab-fees');
            break;
          case 'recitals':
            activateTab('tab-recitals');
            break;
          case 'notifications':
            activateTab('tab-notifications');
            break;
        }
      });
    });

    /* ════════════════════════════════════════
       LOGOUT
    ════════════════════════════════════════ */
    const logoutBtn = document.getElementById('logout-btn');
    const logoutModal = document.getElementById('logout-modal');
    const logoutCancel = document.getElementById('logout-cancel');
    const logoutConfirm = document.getElementById('logout-confirm');
    const closeLogoutModal = () => {
      logoutModal?.classList.remove('open');
      logoutModal?.setAttribute('aria-hidden', 'true');
    };
    if (logoutBtn && logoutModal) {
      logoutBtn.addEventListener('click', () => {
        logoutModal.classList.add('open');
        logoutModal.setAttribute('aria-hidden', 'false');
        logoutCancel?.focus();
      });
      logoutCancel?.addEventListener('click', closeLogoutModal);
      logoutModal.addEventListener('click', e => {
        if (e.target === logoutModal) closeLogoutModal();
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && logoutModal.classList.contains('open')) closeLogoutModal();
      });
      logoutConfirm?.addEventListener('click', () => {
        window.showToast?.('Logging you out...', 'info');
        setTimeout(() => { window.location.href = 'login.html'; }, 700);
      });
    }

  });

})();
