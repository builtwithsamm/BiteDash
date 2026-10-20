// Global Cart State in LocalStorage
const getCart = () => JSON.parse(localStorage.getItem('bitedash_cart')) || [];
const saveCart = (cart) => localStorage.setItem('bitedash_cart', JSON.stringify(cart));

// Update Nav Cart Count
const updateCartCount = () => {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartBadge = document.getElementById('cart-count');
  if (cartBadge) cartBadge.innerText = count;
};

// Add Item to Cart
const addToCart = (id, name, price) => {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert(`${name} added to cart!`);
};

// Change Cart Item Quantity
const changeQty = (id, delta) => {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  saveCart(cart);
  renderCart();
  updateCartCount();
};

// Check Auth Status on Page Load
const checkAuthStatus = async () => {
  try {
    const res = await fetch('/api/auth/user');
    const data = await res.json();
    const userNav = document.getElementById('user-nav');
    if (!userNav) return;

    if (data.success && data.user) {
      userNav.innerHTML = `
        <a href="profile.html">Profile (${data.user.username})</a>
        <a href="#" id="logout-btn">Logout</a>
      `;
      document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
        e.preventDefault();
        await fetch('/api/auth/logout');
        window.location.href = 'index.html';
      });
    } else {
      userNav.innerHTML = `
        <a href="login.html">Login</a>
        <a href="register.html">Register</a>
      `;
    }
  } catch (err) {
    console.error('Auth status error:', err);
  }
};

// Render Food List
const renderFoods = async (containerId, limit = null) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch('/api/foods');
    const data = await res.json();
    if (!data.success) return;

    let foods = data.foods;
    if (limit) foods = foods.slice(0, limit);

    container.innerHTML = foods.map(food => `
      <div class="food-card">
        <div class="img-placeholder">
          ${food.image ? `<img src="${food.image}" alt="${food.name}">` : `<span>[ Image Placeholder ]</span>`}
        </div>
        <div class="food-info">
          <div class="food-title">${food.name}</div>
          <div class="food-desc">${food.description}</div>
          <div class="food-bottom">
            <span class="price">₹${food.price}</span>
            <button class="btn" onclick="addToCart(${food.id}, '${food.name}', ${food.price})">Add to Cart</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error fetching foods:', err);
  }
};

// Render Cart Page
const renderCart = () => {
  const cartTableBody = document.getElementById('cart-body');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  if (!cartTableBody) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Your cart is empty. <a href="menu.html">Browse Menu</a></td></tr>`;
    if (subtotalEl) subtotalEl.innerText = '₹0';
    if (totalEl) totalEl.innerText = '₹0';
    return;
  }

  let subtotal = 0;
  cartTableBody.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    return `
      <tr>
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
          <span style="margin: 0 8px;">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </td>
        <td>₹${itemTotal}</td>
        <td><button class="btn" style="background:#dc3545; padding: 4px 8px;" onclick="changeQty(${item.id}, -${item.qty})">Remove</button></td>
      </tr>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.innerText = `₹${subtotal}`;
  if (totalEl) totalEl.innerText = `₹${subtotal}`;
};

// DOM Loaded Handler
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  checkAuthStatus();
});
