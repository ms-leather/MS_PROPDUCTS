// --- Data: products (each color -> array of images up to 4)
const PRODUCTS = [
  {
    id: "p1",
    name: "Classic Leather Messenger Bag",
    price: 4999,
    colors: {
      brown: ["bag1a.jpg","bag1b.jpg","bag1c.jpg",],
      black: ["bag2a.jpg","bag2b.jpg","bag2c.jpg", "bag2d.jpg"]
    }
  },
   {
    id: "p2",
    name: "Classic Duflle Bag",
    price: 4999,
    colors: {
      brown: ["duffle1a.jpg","duffle1b.jpg","duffle1c.jpg", "duffle1d.jpg"],
      green: ["duffle2a.jpg","duffle2b.jpg","duffle2c.jpg ", "duffle2d.jpg"]
    }
  },
  {
    id: "p3",
    name: "LA VOUISE BAG",
    price: 2499,
    colors: {
      tan: ["la1a.jpg","la1b.jpg", "la1c.jpg", "la1d.jpg"],
      black: ["la2a.jpg","la2b.jpg", "la2c.jpg", "la2d.jpg"]
    }
  },
  {
    id: "p4",
    name: "Classic Leather bag",
    price: 1999,
    colors: {
      brown: ["cbag1a.jpg","cbag1b.jpg","cbag1c.jpg","cbag1d.jpg"],
      black: ["cbag2a.jpg","cbag2b.jpg","cbag2c.jpg","cbag2d.jpg"]
    }
  }
];

// State
let cart = JSON.parse(localStorage.getItem("ms_cart") || "[]");

// DOM refs
const productGrid = document.getElementById("productGrid");
const cartToggle = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cartSidebar");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const checkoutPage = document.getElementById("checkoutPage");
const checkoutItemsEl = document.getElementById("checkoutItems");
const checkoutTotalEl = document.getElementById("checkoutTotal");
const payBtn = document.getElementById("payBtn");
const backToShopBtn = document.getElementById("backToShop");

const orderConfirmation = document.getElementById("orderConfirmation");
const orderIdEl = document.getElementById("orderId");

// --- Helpers
function formatPrice(n){ return `$${n.toLocaleString()}`; }
function saveCart(){ localStorage.setItem("ms_cart", JSON.stringify(cart)); updateCartUI(); }

// --- Render products
function renderProducts(){
  productGrid.innerHTML = '';
  PRODUCTS.forEach((p, idx) => {
    const firstColor = Object.keys(p.colors)[0];
    // ensure max 4 images per color when rendering
    const firstImage = (p.colors[firstColor] || []).slice(0,4)[0] || '';

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-media">
        <div class="product-media-inner">
          <img class="main ${"main-" + p.id}" src="${firstImage}" alt="${p.name}">
        </div>
        <div class="thumb-row ${"thumbs-" + p.id}">
          ${ (p.colors[firstColor] || []).slice(0,4).map((img,i)=>`<img class="${i===0?'active':''}" src="${img}" data-prod="${p.id}" data-img="${img}">`).join('') }
        </div>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="price">${formatPrice(p.price)}</div>
        <div class="color-row ${"colors-"+p.id}"></div>
        <div style="margin-top:12px">
          <button class="add-cart" data-prod="${p.id}">Add to Cart</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);

    // render color swatches
    const colorsRow = card.querySelector('.color-row');
    Object.keys(p.colors).forEach((color, i) => {
      const sw = document.createElement('div');
      sw.className = 'color-swatch';
      sw.style.background = color;
      sw.title = color;
      sw.dataset.prod = p.id;
      sw.dataset.color = color;
      if(i===0) sw.classList.add('active');
      sw.addEventListener('click', () => onColorClick(p.id, color));
      colorsRow.appendChild(sw);
    });
  });

  attachProductListeners();
}

// attach thumbnail clicks and add-to-cart
function attachProductListeners(){
  // thumbnails
  document.querySelectorAll('.thumb-row img').forEach(img => {
    img.addEventListener('click', (e) => {
      const prod = img.dataset.prod;
      const imgSrc = img.dataset.img;
      const main = document.querySelector(`.main-${prod}`);
      if(main) main.src = imgSrc;
      // active state
      document.querySelectorAll(`.thumbs-${prod} img`).forEach(t=>t.classList.remove('active'));
      img.classList.add('active');
    });
  });

  // add to cart buttons
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.dataset.prod;
      const product = PRODUCTS.find(p => p.id === prodId);
      // determine selected color
      const activeSw = document.querySelector(`.colors-${prodId} .color-swatch.active`);
      const selectedColor = activeSw ? activeSw.dataset.color : Object.keys(product.colors)[0];
      // selected main image
      const mainImgEl = document.querySelector(`.main-${prodId}`);
      const mainImg = mainImgEl ? mainImgEl.src : (product.colors[selectedColor]||[])[0];
      // push to cart
      const existing = cart.find(c => c.prodId===prodId && c.color===selectedColor && c.image===mainImg);
      if(existing) existing.qty += 1;
      else cart.push({ prodId, name: product.name, price: product.price, color: selectedColor, image: mainImg, qty: 1 });
      saveCart();
      openCart();
    });
  });
}

// when user clicks a color swatch
function onColorClick(prodId, color){
  // set active swatch
  document.querySelectorAll(`.colors-${prodId} .color-swatch`).forEach(s=>s.classList.remove('active'));
  const swEl = document.querySelector(`.colors-${prodId} .color-swatch[data-color="${color}"]`);
  if(swEl) swEl.classList.add('active');

  const product = PRODUCTS.find(p=>p.id===prodId);
  if(!product) return;
  // limit to max 4 images
  const images = (product.colors[color] || []).slice(0,4);
  // update main image
  const main = document.querySelector(`.main-${prodId}`);
  if(images[0]) main.src = images[0];
  // rebuild thumbnails
  const thumbs = document.querySelector(`.thumbs-${prodId}`);
  thumbs.innerHTML = images.map((img,i)=>`<img class="${i===0?'active':''}" src="${img}" data-prod="${prodId}" data-img="${img}">`).join('');
  attachProductListeners(); // reattach listeners for new thumbs
}

// --- Cart UI
function updateCartUI(){
  // count
  const count = cart.reduce((s,i)=>s+i.qty,0);
  cartCountEl.innerText = count;
  // cart items list (sidebar)
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach((it, idx) => {
    total += it.price * it.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${it.image}" alt="${it.name}">
      <div class="meta">
        <div class="nm">${it.name}</div>
        <div class="muted">${it.color} · ${formatPrice(it.price)}</div>
        <div class="qty-controls">
          <button onclick="changeQty(${idx}, -1)">-</button>
          <div style="min-width:24px;text-align:center">${it.qty}</div>
          <button onclick="changeQty(${idx}, +1)">+</button>
        </div>
      </div>
      <div>
        <div style="font-weight:800">${formatPrice(it.price * it.qty)}</div>
        <button class="remove-small" onclick="removeFromCart(${idx})">✕</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });
  cartTotalEl.innerText = formatPrice(total);
  localStorage.setItem('ms_cart', JSON.stringify(cart));
}

function saveCart(){ localStorage.setItem('ms_cart', JSON.stringify(cart)); updateCartUI(); }
function loadCartFromLocal(){ cart = JSON.parse(localStorage.getItem('ms_cart') || '[]'); updateCartUI(); }

// cart actions
function changeQty(idx, delta){
  if(!cart[idx]) return;
  cart[idx].qty += delta;
  if(cart[idx].qty <= 0) cart.splice(idx,1);
  updateCartUI();
}

function removeFromCart(idx){
  cart.splice(idx,1);
  updateCartUI();
}

// open/close cart sidebar
document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('closeCartBtn').addEventListener('click', closeCart);
function openCart(){ cartSidebar.classList.add('open'); cartSidebar.setAttribute('aria-hidden','false'); }
function closeCart(){ cartSidebar.classList.remove('open'); cartSidebar.setAttribute('aria-hidden','true'); }

// proceed to checkout
checkoutBtn && checkoutBtn.addEventListener('click', ()=> {
  closeCart();
  openCheckoutPage();
});

// --- Checkout page
function openCheckoutPage(){
  document.getElementById('products').scrollIntoView({behavior:'smooth'});
  document.getElementById('checkoutPage').classList.remove('hidden');
  renderCheckoutItems();
}

function goToCheckout(){ openCheckoutPage(); }

// render checkout items on right summary
function renderCheckoutItems(){
  checkoutItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach((it, idx) => {
    total += it.price * it.qty;
    const div = document.createElement('div');
    div.className = 'checkout-item';
    div.innerHTML = `
      <img src="${it.image}" alt="${it.name}">
      <div style="flex:1">
        <div style="font-weight:700">${it.name}</div>
        <div style="color:#666;margin-top:6px">${it.color} · ${formatPrice(it.price)} × ${it.qty}</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:800">${formatPrice(it.price * it.qty)}</div>
        <button class="remove-small" onclick="removeFromCartDuringCheckout(${idx})">Remove</button>
      </div>
    `;
    checkoutItemsEl.appendChild(div);
  });
  checkoutTotalEl.innerText = formatPrice(total);
  document.getElementById('checkoutPage').scrollIntoView({behavior:'smooth'});
}

function removeFromCartDuringCheckout(idx){
  removeFromCart(idx);
  renderCheckoutItems();
}

// back to shop
document.getElementById('backToShop').addEventListener('click', ()=> {
  document.getElementById('checkoutPage').classList.add('hidden');
  document.getElementById('productGrid').scrollIntoView({behavior:'smooth'});
});

// payment UI: show card fields for credit/debit
document.querySelectorAll('input[name="payment"]').forEach(r => {
  r.addEventListener('change', (e) => {
    const cardFields = document.getElementById('cardFields');
    if(e.target.value === 'credit' || e.target.value === 'debit') cardFields.classList.remove('hidden');
    else cardFields.classList.add('hidden');
  });
});

// Pay button (demo)
payBtn.addEventListener('click', ()=> {
  // validate address
  const name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const country = document.getElementById('country').value.trim();
  const state = document.getElementById('state').value.trim();
  const city = document.getElementById('city').value.trim();
  const pincode = document.getElementById('pincode').value.trim();
  const street = document.getElementById('street').value.trim();
  const payMethod = document.querySelector('input[name="payment"]:checked');

  if(!name || !phone || !country || !state || !city || !pincode || !street){
    alert('Please fill complete shipping address before proceeding.');
    return;
  }
  if(!payMethod){
    alert('Please choose a payment method.');
    return;
  }

  // If card selected, basic validation
  if(payMethod.value==='credit' || payMethod.value==='debit'){
    const cn = document.getElementById('cardNumber').value.replace(/\s/g,'');
    const cvv = document.getElementById('cardCvv').value;
    if(cn.length < 12 || cvv.length < 3){
      alert('Please enter valid card details (demo validation).');
      return;
    }
  }

  // simulate success
  const generated = 'MS' + Math.floor(Math.random()*900000 + 100000);
  orderIdEl.innerText = generated;
  document.getElementById('checkoutPage').classList.add('hidden');
  orderConfirmation.classList.remove('hidden');

  // clear cart
  cart = [];
  saveCart();
  updateCartUI();
});

// continue after order
function backToShop(){ orderConfirmation.classList.add('hidden'); document.getElementById('productGrid').scrollIntoView({behavior:'smooth'}); }

// utility: scroll from hero to products
function scrollToProducts(){ document.getElementById('products').scrollIntoView({behavior:'smooth'}); }

// init
loadCartFromLocal();
renderProducts();
updateCartUI();
