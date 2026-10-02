// =========================================================
// Ember Hill Coffee Co. — Task 2 (SaiKet Systems Internship)
// Vanilla JS: theme toggle, mobile menu, product filtering,
// cart drawer with quantities, newsletter validation, toasts.
// =========================================================

// ---------- Safe storage (works even when storage is blocked) ----------
const storage = {
  get(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  },
};

// ---------- Data ----------
const FREE_SHIPPING_THRESHOLD = 50;

const products = [
  { id: 'yirgacheffe', name: 'Yirgacheffe', label: 'ETHIOPIA', origin: 'Ethiopia', roast: 'light', price: 19, notes: 'Jasmine · Lemon · Bergamot', color: '#C9A227', badge: 'Bestseller' },
  { id: 'nyeri-aa', name: 'Nyeri AA', label: 'KENYA', origin: 'Kenya', roast: 'light', price: 21, notes: 'Blackcurrant · Grapefruit · Cane sugar', color: '#9E3B4A' },
  { id: 'huila', name: 'Huila', label: 'COLOMBIA', origin: 'Colombia', roast: 'medium', price: 17, notes: 'Caramel · Red apple · Hazelnut', color: '#B2552A' },
  { id: 'highland-reserve', name: 'Highland Reserve', label: 'SRI LANKA', origin: 'Sri Lanka', roast: 'medium', price: 22, notes: 'Wild honey · Cinnamon · Orange peel', color: '#3F6B4E', badge: 'New' },
  { id: 'antigua', name: 'Antigua', label: 'GUATEMALA', origin: 'Guatemala', roast: 'medium', price: 18, notes: 'Cocoa · Plum · Brown spice', color: '#6B4E8A' },
  { id: 'cerrado', name: 'Cerrado', label: 'BRAZIL', origin: 'Brazil', roast: 'dark', price: 15, notes: 'Dark chocolate · Almond · Toffee', color: '#5A3A22' },
  { id: 'mandheling', name: 'Mandheling', label: 'SUMATRA', origin: 'Indonesia', roast: 'dark', price: 18, notes: 'Cedar · Molasses · Earthy', color: '#2F4858' },
  { id: 'house-espresso', name: 'House Espresso', label: 'BLEND', origin: 'Brazil & Colombia', roast: 'dark', price: 16, notes: 'Cocoa nib · Treacle · Cherry', color: '#22180F', badge: 'Staff pick' },
];

const ROAST_LEVEL = { light: 1, medium: 2, dark: 3 };

const money = (value) => `$${value.toFixed(2)}`;
const findProduct = (id) => products.find((p) => p.id === id);

// Illustrated coffee bag as inline SVG, coloured per product.
function bagSVG(product) {
  return `
    <svg viewBox="0 0 120 160" class="w-full h-auto drop-shadow-xl" role="img" aria-label="${product.name} coffee bag">
      <path d="M16 20h88l8 128a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8z" fill="${product.color}"/>
      <path d="M16 6h88v18H16z" fill="${product.color}"/>
      <path d="M16 6h88v18H16z" fill="#000" opacity=".22"/>
      <path d="M16 24h88" stroke="#fff" stroke-opacity=".25" stroke-dasharray="3 3"/>
      <rect x="26" y="58" width="68" height="62" rx="4" fill="#F6F1E9"/>
      <text x="60" y="80" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="7" letter-spacing="1.5" fill="#6E6153">${product.label}</text>
      <text x="60" y="96" text-anchor="middle" font-family="Fraunces, serif" font-size="11" fill="#22180F">${product.name.split(' ')[0]}</text>
      ${[0, 1, 2].map((i) => `<circle cx="${50 + i * 10}" cy="108" r="3" fill="${i < ROAST_LEVEL[product.roast] ? '#B24824' : '#E4DACB'}"/>`).join('')}
      <circle cx="60" cy="40" r="5" fill="#000" opacity=".18"/>
    </svg>`;
}

// ---------- Small utilities ----------
document.getElementById('year').textContent = new Date().getFullYear();

// "Roasted on" = most recent Monday.
(function setRoastDate() {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  document.getElementById('roast-date').textContent = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
})();

// Hero bags.
document.getElementById('hero-bag-1').innerHTML = bagSVG(findProduct('nyeri-aa'));
document.getElementById('hero-bag-2').innerHTML = bagSVG(findProduct('highland-reserve'));
document.getElementById('hero-bag-3').innerHTML = bagSVG(findProduct('yirgacheffe'));

// ---------- Toast ----------
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('opacity-0', 'translate-y-4');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('opacity-0', 'translate-y-4'), 2400);
}

// ---------- Announcement bar ----------
document.getElementById('close-announcement').addEventListener('click', () => {
  document.getElementById('announcement').remove();
});

// ---------- Header shadow on scroll ----------
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('border-line', window.scrollY > 10);
  header.classList.toggle('border-transparent', window.scrollY <= 10);
}, { passive: true });

// ---------- Theme toggle ----------
const themeToggle = document.getElementById('theme-toggle');

function updateThemeLabel() {
  const isDark = document.documentElement.classList.contains('dark');
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  storage.set('ember-theme', isDark ? 'dark' : 'light');
  updateThemeLabel();
});
updateThemeLabel();

// ---------- Mobile menu ----------
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');

function setMenu(open) {
  mobileMenu.classList.toggle('hidden', !open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuIcon.setAttribute('d', open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16');
}

menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
document.querySelectorAll('.mobile-link').forEach((link) => link.addEventListener('click', () => setMenu(false)));
window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

// ---------- Products & filtering ----------
const grid = document.getElementById('product-grid');
const productCount = document.getElementById('product-count');
const filterButtons = document.querySelectorAll('.filter-btn');

function renderProducts(filter = 'all') {
  const list = filter === 'all' ? products : products.filter((p) => p.roast === filter);

  grid.innerHTML = list.map((p) => `
    <li class="product flex flex-col">
      <div class="relative aspect-[4/5] rounded-3xl border border-line overflow-hidden flex items-end justify-center pb-8"
           style="background: color-mix(in srgb, ${p.color} 12%, rgb(var(--surface)));">
        ${p.badge ? `<span class="absolute top-4 left-4 bg-surface/90 text-ink text-xs font-medium px-3 py-1 rounded-full">${p.badge}</span>` : ''}
        <div class="bag w-[52%]">${bagSVG(p)}</div>
      </div>
      <div class="mt-5 flex items-start justify-between gap-3">
        <div>
          <h3 class="font-display text-xl leading-tight">${p.name}</h3>
          <p class="text-sm text-muted">${p.origin} · 250g</p>
        </div>
        <p class="font-medium">${money(p.price)}</p>
      </div>
      <p class="text-sm text-muted mt-2">${p.notes}</p>
      <div class="flex items-center gap-2 mt-3 text-xs text-muted">
        <span class="capitalize w-14">${p.roast}</span>
        <span class="flex gap-1" aria-label="Roast level ${ROAST_LEVEL[p.roast]} of 3">
          ${[1, 2, 3].map((n) => `<span class="w-5 h-1.5 rounded-full ${n <= ROAST_LEVEL[p.roast] ? 'bg-accent' : 'bg-line'}"></span>`).join('')}
        </span>
      </div>
      <button class="add-btn mt-5 w-full rounded-full border border-ink/20 py-3 text-sm font-medium hover:bg-ink hover:text-bg hover:border-ink transition-colors"
              data-id="${p.id}">Add to cart</button>
    </li>`).join('');

  productCount.textContent = `Showing ${list.length} ${list.length === 1 ? 'coffee' : 'coffees'}`;
}

function setActiveFilter(activeBtn) {
  filterButtons.forEach((btn) => {
    const active = btn === activeBtn;
    btn.setAttribute('aria-pressed', String(active));
    btn.classList.toggle('bg-ink', active);
    btn.classList.toggle('text-bg', active);
    btn.classList.toggle('border-ink', active);
    btn.classList.toggle('border-line', !active);
    btn.classList.toggle('hover:border-ink', !active);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    setActiveFilter(btn);
    renderProducts(btn.dataset.filter);
  });
});

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-btn');
  if (!btn) return;

  addToCart(btn.dataset.id);
  btn.textContent = 'Added ✓';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Add to cart';
    btn.disabled = false;
  }, 1200);
});

// ---------- Cart ----------
// cart = { productId: quantity }
let cart = {};
try { cart = JSON.parse(storage.get('ember-cart')) || {}; } catch (e) { cart = {}; }
// Drop anything that no longer matches a product.
Object.keys(cart).forEach((id) => { if (!findProduct(id) || cart[id] < 1) delete cart[id]; });

const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItems = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartFooter = document.getElementById('cart-footer');
const cartSubtotal = document.getElementById('cart-subtotal');
const shippingMsg = document.getElementById('shipping-msg');
const shippingBar = document.getElementById('shipping-bar');

const cartQuantity = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
const cartTotal = () => Object.entries(cart).reduce((sum, [id, qty]) => sum + findProduct(id).price * qty, 0);

function saveCart() {
  storage.set('ember-cart', JSON.stringify(cart));
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  cartCount.classList.remove('pop');
  void cartCount.offsetWidth; // restart the animation
  cartCount.classList.add('pop');
  showToast(`${findProduct(id).name} added to cart`);
}

function changeQuantity(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function renderCart() {
  const qty = cartQuantity();
  const total = cartTotal();
  const ids = Object.keys(cart);

  // Badge
  cartCount.textContent = qty;
  cartCount.classList.toggle('scale-0', qty === 0);
  cartButton.setAttribute('aria-label', `Open cart, ${qty} ${qty === 1 ? 'item' : 'items'}`);

  // Items
  cartItems.innerHTML = ids.map((id) => {
    const p = findProduct(id);
    return `
      <li class="py-5 flex gap-4">
        <div class="w-16 shrink-0 rounded-xl p-2" style="background: color-mix(in srgb, ${p.color} 14%, rgb(var(--surface)));">${bagSVG(p)}</div>
        <div class="flex-1 min-w-0">
          <div class="flex justify-between gap-2">
            <p class="font-display text-lg leading-tight">${p.name}</p>
            <p class="font-medium">${money(p.price * cart[id])}</p>
          </div>
          <p class="text-xs text-muted capitalize mb-3">${p.roast} roast · ${money(p.price)} each</p>
          <div class="flex items-center justify-between">
            <div class="inline-flex items-center border border-line rounded-full">
              <button class="qty-btn w-8 h-8 rounded-full hover:bg-ink/5" data-id="${id}" data-delta="-1" aria-label="Decrease ${p.name} quantity">−</button>
              <span class="w-8 text-center text-sm" aria-label="Quantity">${cart[id]}</span>
              <button class="qty-btn w-8 h-8 rounded-full hover:bg-ink/5" data-id="${id}" data-delta="1" aria-label="Increase ${p.name} quantity">+</button>
            </div>
            <button class="remove-btn text-xs text-muted underline hover:text-accent" data-id="${id}">Remove</button>
          </div>
        </div>
      </li>`;
  }).join('');

  const empty = ids.length === 0;
  cartItems.classList.toggle('hidden', empty);
  cartEmpty.classList.toggle('hidden', !empty);
  cartFooter.classList.toggle('hidden', empty);
  cartSubtotal.textContent = money(total);

  // Free shipping progress
  const remaining = FREE_SHIPPING_THRESHOLD - total;
  shippingMsg.innerHTML = remaining > 0
    ? `You're <strong>${money(remaining)}</strong> away from free shipping.`
    : '🎉 You\'ve unlocked <strong>free shipping!</strong>';
  shippingBar.style.width = `${Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)}%`;
}

cartItems.addEventListener('click', (e) => {
  const qtyBtn = e.target.closest('.qty-btn');
  const removeBtn = e.target.closest('.remove-btn');
  if (qtyBtn) changeQuantity(qtyBtn.dataset.id, Number(qtyBtn.dataset.delta));
  if (removeBtn) {
    const name = findProduct(removeBtn.dataset.id).name;
    delete cart[removeBtn.dataset.id];
    saveCart();
    renderCart();
    showToast(`${name} removed`);
  }
});

// Drawer open / close
let lastFocused = null;

function setCartOpen(open) {
  cartDrawer.classList.toggle('translate-x-full', !open);
  cartDrawer.setAttribute('aria-hidden', String(!open));
  cartOverlay.classList.toggle('opacity-0', !open);
  cartOverlay.classList.toggle('pointer-events-none', !open);
  cartButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('overflow-hidden', open);

  if (open) {
    lastFocused = document.activeElement;
    document.getElementById('cart-close').focus();
  } else if (lastFocused) {
    lastFocused.focus();
  }
}

cartButton.addEventListener('click', () => setCartOpen(true));
document.getElementById('cart-close').addEventListener('click', () => setCartOpen(false));
document.getElementById('cart-browse').addEventListener('click', () => setCartOpen(false));
cartOverlay.addEventListener('click', () => setCartOpen(false));

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  setCartOpen(false);
  setMenu(false);
});

// Keep keyboard focus inside the open drawer.
cartDrawer.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const focusable = [...cartDrawer.querySelectorAll('button, a[href]')].filter((el) => el.offsetParent !== null);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

document.getElementById('checkout-btn').addEventListener('click', () => {
  showToast('This is a demo store, so checkout is disabled.');
});

// ---------- Newsletter validation ----------
const newsletterForm = document.getElementById('newsletter-form');
const newsletterEmail = document.getElementById('newsletter-email');
const newsletterMsg = document.getElementById('newsletter-msg');
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setNewsletterMessage(text, isError) {
  newsletterMsg.textContent = text;
  newsletterEmail.setAttribute('aria-invalid', String(isError));
  newsletterEmail.classList.toggle('border-espresso', isError);
  newsletterEmail.classList.toggle('border-transparent', !isError);
}

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = newsletterEmail.value.trim();

  if (!email) {
    setNewsletterMessage('⚠ Please enter your email address.', true);
    newsletterEmail.focus();
    return;
  }
  if (!EMAIL_PATTERN.test(email)) {
    setNewsletterMessage('⚠ That email doesn\'t look right. Try name@example.com.', true);
    newsletterEmail.focus();
    return;
  }

  setNewsletterMessage(`✓ You're in! Your 10% code is on its way to ${email}.`, false);
  newsletterForm.reset();
});

newsletterEmail.addEventListener('input', () => {
  if (newsletterEmail.getAttribute('aria-invalid') === 'true') setNewsletterMessage('', false);
});

// ---------- Init ----------
setActiveFilter(document.querySelector('.filter-btn[data-filter="all"]'));
renderProducts();
renderCart();
