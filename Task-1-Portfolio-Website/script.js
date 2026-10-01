// =========================================================
// Portfolio — Task 1 (SaiKet Systems Internship)
// Mobile menu, typing effect, scroll reveal, active nav link,
// and contact form validation.
// =========================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Mobile menu ----------
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');

const MENU_OPEN_PATH = 'M4 7h16M4 12h16M4 17h10';
const MENU_CLOSE_PATH = 'M6 6l12 12M18 6L6 18';

function setMenu(open) {
  mobileMenu.classList.toggle('hidden', !open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuIcon.setAttribute('d', open ? MENU_CLOSE_PATH : MENU_OPEN_PATH);
}

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

document.querySelectorAll('.mobile-link').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

// ---------- Typing effect ----------
const typedEl = document.getElementById('typed');
const commands = [
  'npm run build -- --portfolio',
  'git commit -m "ship task 01"',
  'node server.js --port 3000',
  'SELECT * FROM users;',
];

if (prefersReducedMotion) {
  typedEl.textContent = commands[0];
} else {
  let cmdIndex = 0;
  let charIndex = 0;
  let deleting = false;

  (function type() {
    const current = commands[cmdIndex];
    charIndex += deleting ? -1 : 1;
    typedEl.textContent = current.slice(0, charIndex);

    let delay = deleting ? 35 : 75;
    if (!deleting && charIndex === current.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      cmdIndex = (cmdIndex + 1) % commands.length;
      delay = 400;
    }
    setTimeout(type, delay);
  })();
}

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ---------- Active nav link ----------
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('text-paper', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((section) => navObserver.observe(section));
}

// ---------- Contact form validation ----------
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const successBox = document.getElementById('form-success');
const messageInput = document.getElementById('message');
const charCount = document.getElementById('char-count');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MESSAGE_MIN = 20;
const MESSAGE_MAX = 500;

// Each rule returns an error message, or '' when the value is valid.
const validators = {
  name(value) {
    if (!value) return 'Please enter your name.';
    if (value.length < 2) return 'Name must be at least 2 characters.';
    if (!/^[\p{L}\s'.-]+$/u.test(value)) return 'Name can only contain letters, spaces, apostrophes and hyphens.';
    return '';
  },
  email(value) {
    if (!value) return 'Please enter your email address.';
    if (!EMAIL_PATTERN.test(value)) return 'Please enter a valid email, e.g. name@example.com.';
    return '';
  },
  subject(value) {
    return value ? '' : 'Please choose a subject.';
  },
  message(value) {
    if (!value) return 'Please write a message.';
    if (value.length < MESSAGE_MIN) return `Message must be at least ${MESSAGE_MIN} characters (${value.length} so far).`;
    if (value.length > MESSAGE_MAX) return `Message must be under ${MESSAGE_MAX} characters.`;
    return '';
  },
};

function showError(field, message) {
  const errorEl = document.getElementById(`${field.id}-error`);
  const invalid = Boolean(message);

  errorEl.textContent = message;
  errorEl.classList.toggle('hidden', !invalid);
  field.setAttribute('aria-invalid', String(invalid));
  field.classList.toggle('border-signal', invalid);
  field.classList.toggle('border-line', !invalid);
}

function validateField(field) {
  const error = validators[field.name](field.value.trim());
  showError(field, error);
  return !error;
}

// Validate a field once the user leaves it, then live while they fix it.
Object.keys(validators).forEach((name) => {
  const field = form.elements[name];
  field.addEventListener('blur', () => {
    field.dataset.touched = 'true';
    validateField(field);
  });
  field.addEventListener('input', () => {
    if (field.dataset.touched) validateField(field);
  });
  field.addEventListener('change', () => {
    if (field.dataset.touched) validateField(field);
  });
});

messageInput.addEventListener('input', () => {
  const length = messageInput.value.length;
  charCount.textContent = `${length} / ${MESSAGE_MAX}`;
  charCount.classList.toggle('text-signal', length >= MESSAGE_MAX - 50);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  successBox.classList.add('hidden');

  const fields = Object.keys(validators).map((name) => form.elements[name]);
  fields.forEach((field) => (field.dataset.touched = 'true'));
  const results = fields.map(validateField);

  const firstInvalid = fields[results.indexOf(false)];
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  sendMessage(fields);
});

// No back-end for this static site, so messages are forwarded to email by FormSubmit.
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/chamindujaya@gmail.com';

function showStatus(message, isError) {
  successBox.textContent = message;
  successBox.classList.toggle('text-ok', !isError);
  successBox.classList.toggle('border-ok/40', !isError);
  successBox.classList.toggle('bg-ok/5', !isError);
  successBox.classList.toggle('text-signal', isError);
  successBox.classList.toggle('border-signal/40', isError);
  successBox.classList.toggle('bg-signal/5', isError);
  successBox.classList.remove('hidden');
  successBox.focus();
}

async function sendMessage(fields) {
  const name = form.elements.name.value.trim();
  const subjectSelect = form.elements.subject;
  const subjectText = subjectSelect.options[subjectSelect.selectedIndex].text;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name,
        email: form.elements.email.value.trim(),
        subject: subjectText,
        message: form.elements.message.value.trim(),
        _subject: `Portfolio: ${subjectText} — from ${name}`,
        _replyto: form.elements.email.value.trim(),
        _template: 'table',
        _honey: form.elements._honey.value,
      }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || String(result.success) !== 'true') {
      throw new Error(result.message || `Request failed (${response.status})`);
    }

    showStatus(`✓ Thanks, ${name.split(' ')[0]}! Your message has been sent. I'll reply soon.`, false);
    form.reset();
    fields.forEach((field) => {
      delete field.dataset.touched;
      field.removeAttribute('aria-invalid');
    });
    charCount.textContent = `0 / ${MESSAGE_MAX}`;
    charCount.classList.remove('text-signal');
  } catch (error) {
    console.error('Contact form error:', error);
    showStatus('✕ Sorry, your message could not be sent. Please try again or email chamindujaya@gmail.com directly.', true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send message';
  }
}
