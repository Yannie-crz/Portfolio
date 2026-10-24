/**
 * ============================================================================
 * EDREI JOSH CRUZ - PORTFOLIO INTERACTIVITY SCRIPT
 * Course: PROFE7 - Web Design Authoring | CHMSU College of Computer Studies
 * Clean, Flat, Minimalistic Portfolio Logic
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. Theme Switcher (Dark / Light Mode)
  // --------------------------------------------------------------------------
  const htmlRoot = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeLabel = document.getElementById('themeLabel');

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('ejc_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('ejc_theme', theme);
    if (themeLabel) {
      themeLabel.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerNavLinks = document.querySelectorAll('.drawer-nav-link');

  // Initial accessibility state for mobile drawer
  if (mobileDrawer) {
    mobileDrawer.setAttribute('inert', '');
  }

  function openDrawer() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.removeAttribute('inert');
      mobileDrawer.removeAttribute('aria-hidden');
      mobileDrawer.classList.add('active');
      drawerOverlay.classList.add('active');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (drawerCloseBtn) {
        drawerCloseBtn.focus();
      }
    }
  }

  function closeDrawer() {
    if (mobileDrawer && drawerOverlay) {
      // Return focus to hamburgerBtn before hiding
      if (hamburgerBtn) {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.focus();
      } else if (document.activeElement && mobileDrawer.contains(document.activeElement)) {
        document.activeElement.blur();
      }

      mobileDrawer.classList.remove('active');
      drawerOverlay.classList.remove('active');
      mobileDrawer.removeAttribute('aria-hidden');
      mobileDrawer.setAttribute('inert', '');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // --------------------------------------------------------------------------
  // 3. ScrollSpy / Active Navigation Highlighting
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('data-target') === sectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        drawerNavLinks.forEach(link => {
          if (link.getAttribute('data-target') === sectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // --------------------------------------------------------------------------
  // 4. Modal Dialog System
  // --------------------------------------------------------------------------
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  const modalCloseButtons = document.querySelectorAll('[data-close-modal]');

  let lastFocusedTrigger = null;

  // Initial accessibility state for modal backdrops
  modalBackdrops.forEach(m => m.setAttribute('inert', ''));

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      lastFocusedTrigger = document.activeElement;
      modal.removeAttribute('inert');
      modal.removeAttribute('aria-hidden');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      const focusable = modal.querySelector('button, [href], input, select, textarea');
      if (focusable) focusable.focus();
    }
  }

  function closeModal(modal) {
    if (modal) {
      // 1. Move focus out of the modal before changing state
      if (document.activeElement && modal.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function' && document.body.contains(lastFocusedTrigger)) {
        lastFocusedTrigger.focus();
      }

      // 2. Cleanly deactivate and apply inert (no aria-hidden warning)
      modal.classList.remove('active');
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('inert', '');
      document.body.style.overflow = '';
    }
  }

  // Open modal buttons
  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  // Dedicated CV Open Buttons
  const openCvBtn = document.getElementById('openCvBtn');
  const viewAcademicRecordBtn = document.getElementById('viewAcademicRecordBtn');

  if (openCvBtn) openCvBtn.addEventListener('click', () => openModal('modalCv'));
  if (viewAcademicRecordBtn) {
    viewAcademicRecordBtn.addEventListener('click', () => openModal('modalCv'));
  }

  // Close buttons
  modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      closeModal(modal);
    });
  });

  // Click outside dialog to close
  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  // Escape key closes open modal or mobile drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) closeModal(activeModal);
      if (mobileDrawer && mobileDrawer.classList.contains('active')) closeDrawer();
    }
  });

  // Print CV trigger
  const printCvBtn = document.getElementById('printCvBtn');
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      const modalCv = document.getElementById('modalCv');
      if (modalCv) {
        modalCv.removeAttribute('inert');
      }

      try {
        if (typeof window.print === 'function') {
          window.print();
        } else {
          showToast('Print is not supported in this browser. Please use Download PDF.', 'info');
        }
      } catch (err) {
        console.warn('Print error:', err);
        showToast('Print dialog failed to open. Please use Download PDF.', 'info');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Contact Form Validation & Submission
  // --------------------------------------------------------------------------
  const inquiryForm = document.getElementById('inquiryForm');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('emailAddress');
  const subjectSelect = document.getElementById('inquirySubject');
  const messageInput = document.getElementById('projectScopeMessage');
  const charCounter = document.getElementById('charCounter');
  const formAlertBox = document.getElementById('formAlertBox');
  const sendMessageBtn = document.getElementById('sendMessageBtn');

  // Character counter for message textarea
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500`;
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setFieldError(field, isValid) {
    const parentGroup = field.closest('.form-group');
    if (isValid) {
      field.classList.remove('invalid');
      if (parentGroup) parentGroup.classList.remove('has-error');
    } else {
      field.classList.add('invalid');
      if (parentGroup) parentGroup.classList.add('has-error');
    }
    return isValid;
  }

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Full Name
      if (!fullNameInput.value.trim()) {
        isValid = setFieldError(fullNameInput, false) && isValid;
      } else {
        setFieldError(fullNameInput, true);
      }

      // Validate Email
      if (!validateEmail(emailInput.value.trim())) {
        isValid = setFieldError(emailInput, false) && isValid;
      } else {
        setFieldError(emailInput, true);
      }

      // Validate Subject
      if (!subjectSelect.value) {
        isValid = setFieldError(subjectSelect, false) && isValid;
      } else {
        setFieldError(subjectSelect, true);
      }

      // Validate Message (min 15 chars)
      if (messageInput.value.trim().length < 15) {
        isValid = setFieldError(messageInput, false) && isValid;
      } else {
        setFieldError(messageInput, true);
      }

      if (!isValid) {
        showToast('Please correct the highlighted form errors.', 'error');
        return;
      }

      // Submission UI State
      const originalBtnHtml = sendMessageBtn.innerHTML;
      sendMessageBtn.disabled = true;
      sendMessageBtn.innerHTML = `<span>Sending...</span>`;

      setTimeout(() => {
        sendMessageBtn.disabled = false;
        sendMessageBtn.innerHTML = originalBtnHtml;

        // Show success alert
        if (formAlertBox) {
          formAlertBox.classList.remove('hidden');
        }

        showToast('Message dispatched successfully!', 'success');
        inquiryForm.reset();
        if (charCounter) charCounter.textContent = '0 / 500';

        formAlertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 700);

    });
  }

  // --------------------------------------------------------------------------
  // 6. Clipboard Copy Helper
  // --------------------------------------------------------------------------
  const emailToCopy = 'ejcruz.chmsu@gmail.com';
  const copyHeroEmailBtn = document.getElementById('copyHeroEmailBtn');
  const copyDirectEmailBtn = document.getElementById('copyDirectEmailBtn');

  function copyEmail() {
    navigator.clipboard.writeText(emailToCopy).then(() => {
      showToast(`Copied ${emailToCopy} to clipboard!`, 'success');
    }).catch(() => {
      showToast(`Email: ${emailToCopy}`, 'info');
    });
  }

  if (copyHeroEmailBtn) copyHeroEmailBtn.addEventListener('click', copyEmail);
  if (copyDirectEmailBtn) copyDirectEmailBtn.addEventListener('click', copyEmail);

  // --------------------------------------------------------------------------
  // 7. Floating Toast Notification Dispatcher
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    
    toast.innerHTML = `<span class="toast-msg">${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

});
