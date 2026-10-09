/* Advanced Yoga UI Kit interactions.
   Include after the HTML, or load with defer. Uses event delegation. */
(() => {
  const root = document.querySelector('.yoga-advanced') || document;
  let toastTimer;
  function showToast(message) {
    let toast = document.querySelector('.ya-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'ya-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  // Add data-action="toast" data-message="..." to any button for a real interaction feedback.
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'toast') showToast(button.dataset.message || 'Done');
    if (action === 'toggle-active') {
      const active = button.getAttribute('aria-pressed') === 'true';
      button.setAttribute('aria-pressed', String(!active));
      button.classList.toggle('is-active', !active);
      showToast(!active ? (button.dataset.onMessage || 'Enabled') : (button.dataset.offMessage || 'Disabled'));
    }
    if (action === 'play-demo') {
      // Demo only: use this for UI preview. Connect to your actual audio player for production.
      showToast('Connect this control to your selected yoga audio file.');
    }
  });

  // Reveal cards as they enter the viewport.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ya-reveal');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    root.querySelectorAll('[data-animate="reveal"]').forEach(el => observer.observe(el));
  }

  // Subtle pointer glow for cards; disabled on touch-only devices.
  if (window.matchMedia('(pointer: fine)').matches) {
    root.querySelectorAll('[data-animate="pointer-glow"]').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--pointer-y', `${e.clientY - rect.top}px`);
      });
    });
  }
})();
