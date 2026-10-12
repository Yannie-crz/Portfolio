/**
 * ============================================================================
 * EDREI JOSH CRUZ - PORTFOLIO INTERACTIVITY SCRIPT
 * Course: PROFE7 - Web Design Authoring | CHMSU College of Computer Studies
 * High-Fidelity Prototype Implementation
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

  function openDrawer() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.add('active');
      drawerOverlay.classList.add('active');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.remove('active');
      drawerOverlay.classList.remove('active');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
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
  // 4. ScrollSpy / Active Navigation Highlighting
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 180;

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
  // 5. Modal Dialog System
  // --------------------------------------------------------------------------
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  const modalCloseButtons = document.querySelectorAll('[data-close-modal]');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Focus first actionable element inside modal
      const focusable = modal.querySelector('button, [href], input, select, textarea');
      if (focusable) focusable.focus();
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Open buttons
  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  // Dedicated CV Open Buttons
  const openCvBtn = document.getElementById('openCvBtn');
  const drawerCvBtn = document.getElementById('drawerCvBtn');
  const viewAcademicRecordBtn = document.getElementById('viewAcademicRecordBtn');

  if (openCvBtn) openCvBtn.addEventListener('click', () => openModal('modalCv'));
  if (drawerCvBtn) {
    drawerCvBtn.addEventListener('click', () => {
      closeDrawer();
      openModal('modalCv');
    });
  }
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

  // Escape key closes open modal
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
      window.print();
    });
  }

  // --------------------------------------------------------------------------
  // 6. Interactive Simulator (BCD Siomai GPS Ping)
  // --------------------------------------------------------------------------
  const simPingButtons = document.querySelectorAll('.sim-ping-btn');
  const simConsoleOutput = document.getElementById('simConsoleOutput');

  const cartData = {
    '1': { name: 'Cart 01 (CHMSU Gate)', lat: '10.7335° N', lng: '122.9692° E', speed: '0 km/h (Stationary)', stock: '142 units', battery: '94%' },
    '2': { name: 'Cart 02 (Talisay Plaza)', lat: '10.7302° N', lng: '122.9710° E', speed: '1.2 km/h (Moving)', stock: '38 units (Low)', battery: '82%' },
    '3': { name: 'Cart 03 (Highway Hub)', lat: '10.7368° N', lng: '122.9645° E', speed: '0 km/h (Stationary)', stock: '180 units', battery: '97%' }
  };

  simPingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cartId = btn.getAttribute('data-cart');
      const data = cartData[cartId];
      if (data && simConsoleOutput) {
        const time = new Date().toLocaleTimeString();
        simConsoleOutput.innerHTML = `
          <span style="color:#60A5FA;">[GPS Ping ${time}]</span> Received packet from <strong>${data.name}</strong><br>
          » Coordinates: <code>${data.lat}, ${data.lng}</code><br>
          » Velocity: ${data.speed} | Remaining Stock: ${data.stock} | Device Battery: ${data.battery}<br>
          <span style="color:#10B981;">» SQLite / MySQL Local Sync: OK (Latency: 14ms)</span>
        `;
        showToast(`Pinged ${data.name} telemetry successfully!`, 'success');
      }
    });
  });

  // Interactive Map node clicks in featured project card
  const mapNodes = document.querySelectorAll('.map-node');
  mapNodes.forEach(node => {
    node.addEventListener('click', () => {
      mapNodes.forEach(n => n.classList.remove('active-focus'));
      node.classList.add('active-focus');
      const tooltip = node.querySelector('.node-tooltip');
      if (tooltip) {
        showToast(`Inspecting ${tooltip.textContent}`, 'info');
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. Contact Form Validation & Submission
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

      // Simulated Asynchronous Submission State
      const originalBtnHtml = sendMessageBtn.innerHTML;
      sendMessageBtn.disabled = true;
      sendMessageBtn.innerHTML = `
        <span class="pulsing-radar-dot"></span>
        <span>Transmitting...</span>
      `;

      setTimeout(() => {
        sendMessageBtn.disabled = false;
        sendMessageBtn.innerHTML = originalBtnHtml;

        // Show success alert
        if (formAlertBox) {
          formAlertBox.classList.remove('hidden');
        }

        showToast('Message sent successfully! Thank you for contacting Edrei.', 'success');
        inquiryForm.reset();
        if (charCounter) charCounter.textContent = '0 / 500';

        // Scroll into view of alert box
        formAlertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1000);

    });
  }

  // --------------------------------------------------------------------------
  // 8. Clipboard Copy Helper
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
  // 9. Floating Toast Notification Dispatcher
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    
    const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // End of initialization
});
