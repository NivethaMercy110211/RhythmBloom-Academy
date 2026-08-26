/* =============================================
   RHYTHMBLOOM ACADEMY — AUTH JS
   Login, Signup, Forgot Password form handling
   ============================================= */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ── Password Visibility Toggle ── */
    document.querySelectorAll('.auth-input-toggle').forEach(btn => {
      btn.addEventListener('click', function () {
        const input = this.closest('.auth-input-wrap').querySelector('input');
        if (!input) return;
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        this.querySelector('i').className = isPass ? 'bi bi-eye-slash' : 'bi bi-eye';
      });
    });

    /* ── Form Validation ── */
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
      return /^[\d\s\+\-\(\)]{7,15}$/.test(phone);
    }

    function showError(input, message) {
      input.classList.add('is-invalid');
      let err = input.parentElement.querySelector('.form-error');
      if (!err) {
        err = document.createElement('div');
        err.className = 'form-error';
        input.parentElement.appendChild(err);
      }
      err.textContent = message;
      err.style.display = 'block';
    }

    function clearError(input) {
      input.classList.remove('is-invalid');
      const err = input.parentElement.querySelector('.form-error');
      if (err) err.style.display = 'none';
    }

    function setLoading(btn, loading) {
      if (loading) {
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 0.8s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Processing...</span>';
        btn.disabled = true;
      } else {
        btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
        btn.disabled = false;
      }
    }

    // Add spinner keyframe if not present
    if (!document.getElementById('spin-style')) {
      const s = document.createElement('style');
      s.id = 'spin-style';
      s.textContent = '@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }';
      document.head.appendChild(s);
    }

    /* ── LOGIN FORM ── */
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      // Clear errors on input
      loginForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => clearError(input));
      });

      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        const email    = document.getElementById('login-email');
        const password = document.getElementById('login-password');

        if (!email.value.trim() || !validateEmail(email.value)) {
          showError(email, 'Please enter a valid email address.');
          valid = false;
        } else {
          clearError(email);
        }

        if (!password.value || password.value.length < 6) {
          showError(password, 'Password must be at least 6 characters.');
          valid = false;
        } else {
          clearError(password);
        }

        if (valid) {
          const btn = loginForm.querySelector('.auth-submit');
          setLoading(btn, true);
          setTimeout(() => {
            window.showToast?.('Welcome back! Redirecting to dashboard...', 'success', 3000);
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
          }, 1500);
        }
      });
    }

    /* ── SIGNUP FORM ── */
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => clearError(input));
      });

      signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        const parentName  = document.getElementById('signup-parent-name');
        const childName   = document.getElementById('signup-child-name');
        const email       = document.getElementById('signup-email');
        const phone       = document.getElementById('signup-phone');
        const password    = document.getElementById('signup-password');
        const confirm     = document.getElementById('signup-confirm');

        if (!parentName?.value.trim()) {
          showError(parentName, 'Please enter your name.'); valid = false;
        } else clearError(parentName);

        if (!childName?.value.trim()) {
          showError(childName, "Please enter your child's name."); valid = false;
        } else clearError(childName);

        if (!email?.value || !validateEmail(email.value)) {
          showError(email, 'Please enter a valid email address.'); valid = false;
        } else clearError(email);

        if (!phone?.value || !validatePhone(phone.value)) {
          showError(phone, 'Please enter a valid phone number.'); valid = false;
        } else clearError(phone);

        if (!password?.value || password.value.length < 8) {
          showError(password, 'Password must be at least 8 characters.'); valid = false;
        } else clearError(password);

        if (!confirm?.value || confirm.value !== password?.value) {
          showError(confirm, 'Passwords do not match.'); valid = false;
        } else clearError(confirm);

        if (valid) {
          const btn = signupForm.querySelector('.auth-submit');
          setLoading(btn, true);
          setTimeout(() => {
            window.showToast?.('Account created! Redirecting to your dashboard...', 'success', 3000);
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
          }, 1800);
        }
      });
    }

    /* ── FORGOT PASSWORD FORM ── */
    const forgotForm = document.getElementById('forgot-form');
    const successState = document.getElementById('forgot-success');

    if (forgotForm) {
      const emailInput = document.getElementById('forgot-email');
      if (emailInput) {
        emailInput.addEventListener('input', () => clearError(emailInput));
      }

      forgotForm.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        if (!emailInput?.value || !validateEmail(emailInput.value)) {
          showError(emailInput, 'Please enter a valid email address.');
          valid = false;
        } else {
          clearError(emailInput);
        }

        if (valid) {
          const btn = forgotForm.querySelector('.auth-submit');
          setLoading(btn, true);
          setTimeout(() => {
            forgotForm.style.display = 'none';
            if (successState) successState.style.display = 'block';
            window.showToast?.('Reset link sent! Check your inbox.', 'success', 5000);
          }, 1500);
        }
      });
    }

    /* ── Social Auth Buttons (demo) ── */
    document.querySelectorAll('.auth-social-btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const provider = this.dataset.provider;
        window.showToast?.(`Redirecting to ${provider || 'provider'} sign-in...`, 'info');
      });
    });

    /* ── Password Strength Indicator ── */
    const strengthInput = document.getElementById('signup-password');
    const strengthBar   = document.getElementById('password-strength');

    if (strengthInput && strengthBar) {
      strengthInput.addEventListener('input', function () {
        const val = this.value;
        let strength = 0;
        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val))  strength++;
        if (/[0-9]/.test(val))  strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['', '#8B2E2E', '#8A6000', '#1E5C8A', '#2D7A5A'];
        const widths = ['0%', '25%', '50%', '75%', '100%'];

        strengthBar.style.width = widths[strength];
        strengthBar.style.background = colors[strength];
        const label = document.getElementById('strength-label');
        if (label) {
          label.textContent = labels[strength];
          label.style.color = colors[strength];
        }
      });
    }

  });

})();
