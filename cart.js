/* ─────────────────────────────────────────
   cart.js – Arena Brasil Figurinhas
   Shared cart: localStorage + slide-in drawer
───────────────────────────────────────── */

const PRODUCTS = [
  { id:1,  name:'Álbum Brochura FIFA World Cup 2026',                    catName:'Álbum',      price:23.00,  pix:21.85,  img:'https://www.paninbrasil.co/products/panini/album-brochura-fifa-world-cup-2026.jpg' },
  { id:2,  name:'Álbum Capa Dura FIFA World Cup 2026',                   catName:'Álbum',      price:68.00,  pix:64.60,  img:'https://www.paninbrasil.co/products/panini/album-capa-dura-fifa-world-cup-2026.jpg' },
  { id:3,  name:'Álbum Capa Dura Prata FIFA World Cup 2026',             catName:'Álbum',      price:72.00,  pix:68.40,  img:'https://www.paninbrasil.co/products/panini/album-capa-dura-prata-fifa-world-cup-2026.jpg' },
  { id:4,  name:'Álbum Capa Dura Ouro FIFA World Cup 2026',              catName:'Álbum',      price:72.00,  pix:68.40,  img:'https://www.paninbrasil.co/products/panini/album-capa-dura-ouro-fifa-world-cup-2026.jpg' },
  { id:5,  name:'Box 50 Pacotes Figurinhas FIFA World Cup 2026',         catName:'Figurinhas', price:239.90, pix:227.91, img:'https://www.paninbrasil.co/products/panini/box-50-pacotes-figurinhas-fifa-world-cup-2026.jpg' },
  { id:6,  name:'Envelope de Figurinhas FIFA World Cup 2026',            catName:'Figurinhas', price:6.70,   pix:6.37,   img:'https://www.paninbrasil.co/products/panini/envelope-de-figurinhas-fifa-world-cup-2026.jpg' },
  { id:7,  name:'Kit 12 Envelopes Figurinhas FIFA World Cup 2026',       catName:'Figurinhas', price:73.99,  pix:70.29,  img:'https://www.paninbrasil.co/products/panini/kit-12-envelopes-figurinhas-fifa-world-cup-2026.jpg' },
  { id:8,  name:'Box 100 Pacotes Figurinhas FIFA World Cup 2026',        catName:'Figurinhas', price:349.90, pix:332.41, img:'https://www.paninbrasil.co/products/panini/box-100-pacotes-figurinhas-fifa-world-cup-2026.jpg' },
  { id:9,  name:'Adrenalyn XL FIFA World Cup 2026 Mega Tin',             catName:'Cards',      price:89.90,  pix:85.41,  img:'https://www.paninbrasil.co/products/panini/adrenalyn-xl-fifa-world-cup-2026-mega-tin.jpg' },
  { id:10, name:'Adrenalyn XL FIFA World Cup 2026 Starter Pack',         catName:'Cards',      price:39.90,  pix:37.91,  img:'https://www.paninbrasil.co/products/panini/adrenalyn-xl-fifa-world-cup-2026-starter-pack.jpg' },
  { id:11, name:'Adrenalyn XL Display Box 36 Pacotes FIFA 2026',         catName:'Cards',      price:279.90, pix:265.91, img:'https://www.paninbrasil.co/products/panini/adrenalyn-xl-fifa-world-cup-2026-display-box.jpg' },
  { id:12, name:'Adrenalyn XL Pacote 6 Cards FIFA World Cup 2026',       catName:'Cards',      price:7.99,   pix:7.59,   img:'https://www.paninbrasil.co/products/panini/adrenalyn-xl-fifa-world-cup-2026-pacote-6-cards.jpg' },
  { id:13, name:'Kit Premium com Álbum + Adrenalyn + 50 Figurinhas',     catName:'Kit',        price:169.90, pix:161.41, img:'https://www.paninbrasil.co/products/panini/kit-premium-album-adrenalyn-50-figurinhas-fifa-2026.jpg' },
  { id:14, name:'Box Sacola Álbum Capa Cartão + 30 Envelopes FIFA 2026', catName:'Kit',        price:164.90, pix:156.66, img:'https://www.paninbrasil.co/products/panini/box-sacola-album-capa-cartao-30-envelopes-fifa-world-cup-2026.jpg' },
  { id:15, name:'Box Super Premium Álbum Prata + 50 Envelopes FIFA 2026',catName:'Kit',        price:329.90, pix:313.41, img:'https://www.paninbrasil.co/products/panini/box-caixa-super-premium-album-prata-50-envelopes.jpg' },
  { id:16, name:'Box Premium Imã Álbum Prata + 40 Envelopes FIFA 2026',  catName:'Kit',        price:259.90, pix:246.91, img:'https://www.paninbrasil.co/products/panini/box-premium-ima-album-prata-40-envelopes.jpg' },
  { id:17, name:'Kit Família 2 Álbuns + 200 Figurinhas FIFA 2026',       catName:'Kit',        price:229.90, pix:218.41, img:'https://www.paninbrasil.co/products/panini/kit-familia-fifa-world-cup-2026.jpg' },
  { id:18, name:'100 Envelopes + 700 Figurinhas com Dispenser FIFA 2026',catName:'Kit',        price:649.99, pix:617.49, img:'https://www.paninbrasil.co/products/panini/100-envelopes-700-figurinhas-com-dispenser-fifa-2026.png' },
];

/* ── CART STORE ── */
const Cart = {
  _key: 'arena_cart',
  get()       { return JSON.parse(localStorage.getItem(this._key) || '[]'); },
  save(items) { localStorage.setItem(this._key, JSON.stringify(items)); Cart.syncBadges(); },

  add(id, qty) {
    qty = qty || 1;
    const items = this.get();
    const existing = items.find(i => i.id === id);
    if (existing) existing.qty += qty; else items.push({ id, qty });
    this.save(items);
    openDrawer();
    refreshDrawer();
  },

  remove(id) {
    this.save(this.get().filter(i => i.id !== id));
    refreshDrawer();
  },

  setQty(id, qty) {
    qty = parseInt(qty);
    if (qty < 1) return this.remove(id);
    const items = this.get();
    const item = items.find(i => i.id === id);
    if (item) { item.qty = qty; this.save(items); }
    refreshDrawer();
  },

  count()      { return this.get().reduce((s, i) => s + i.qty, 0); },
  subtotal()   { return this.get().reduce((s, i) => { const p = PRODUCTS.find(p => p.id === i.id); return s + (p ? p.price * i.qty : 0); }, 0); },
  pixTotal()   { return this.get().reduce((s, i) => { const p = PRODUCTS.find(p => p.id === i.id); return s + (p ? p.pix   * i.qty : 0); }, 0); },
  clear()      { this.save([]); },

  syncBadges() {
    const n = Cart.count();
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = n);
  }
};

function fmt(v) { return 'R$ ' + v.toFixed(2).replace('.', ','); }

/* ── DRAWER HTML ── */
function injectDrawer() {
  if (document.getElementById('cart-drawer')) return;
  const d = document.createElement('div');
  d.id = 'cart-drawer';
  d.innerHTML = `
    <div class="cd-overlay" onclick="closeDrawer()"></div>
    <div class="cd-panel">
      <div class="cd-header">
        <div class="cd-title">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Meu Carrinho
          <span id="cd-badge" class="cd-badge">0</span>
        </div>
        <button class="cd-close" onclick="closeDrawer()" aria-label="Fechar">✕</button>
      </div>
      <div id="cd-items" class="cd-items"></div>
      <div class="cd-footer" id="cd-footer">
        <div class="cd-row">
          <span>Subtotal</span>
          <span id="cd-subtotal" class="cd-subtotal-val">R$ 0,00</span>
        </div>
        <div class="cd-row cd-row-pix">
          <span>💳 Total no PIX</span>
          <span id="cd-pix" class="cd-pix-val">R$ 0,00</span>
        </div>
        <a href="carrinho.html" class="cd-btn-go">Ver carrinho e finalizar →</a>
        <button class="cd-btn-continue" onclick="closeDrawer()">Continuar comprando</button>
      </div>
    </div>`;
  document.body.appendChild(d);
}

/* ── DRAWER CSS (injected once) ── */
function injectDrawerCSS() {
  if (document.getElementById('cd-styles')) return;
  const s = document.createElement('style');
  s.id = 'cd-styles';
  s.textContent = `
#cart-drawer{display:none;position:fixed;inset:0;z-index:9990}
#cart-drawer.open{display:block}
.cd-overlay{position:absolute;inset:0;background:rgba(0,0,0,.48);animation:cdFade .22s ease}
.cd-panel{position:absolute;top:0;right:0;bottom:0;width:100%;max-width:420px;background:#fff;display:flex;flex-direction:column;box-shadow:-6px 0 32px rgba(0,0,0,.2);animation:cdSlide .25s ease}
@keyframes cdFade{from{opacity:0}to{opacity:1}}
@keyframes cdSlide{from{transform:translateX(100%)}to{transform:translateX(0)}}
.cd-header{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid #e5e7eb;flex-shrink:0}
.cd-title{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:800;color:#0d1b2a}
.cd-badge{background:#1a7a4a;color:#fff;font-size:11px;font-weight:700;min-width:20px;height:20px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px}
.cd-close{border:none;background:none;font-size:18px;cursor:pointer;color:#6b7280;padding:6px 9px;border-radius:7px;transition:background .15s}
.cd-close:hover{background:#f3f4f6;color:#111}
.cd-items{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:12px}
.cd-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#6b7280;text-align:center;gap:8px;padding:24px}
.cd-empty p{font-size:15px}
.cd-empty a{color:#1a7a4a;font-weight:600;font-size:14px}
.cd-item{display:flex;gap:12px;align-items:flex-start;padding:12px;border:1px solid #e5e7eb;border-radius:10px;background:#fff}
.cd-item-img{width:68px;height:68px;object-fit:contain;border-radius:8px;border:1px solid #f3f4f6;flex-shrink:0;display:block}
.cd-item-info{flex:1;min-width:0}
.cd-item-name{font-size:12.5px;font-weight:600;color:#111827;line-height:1.4;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;overflow:hidden;text-decoration:none}
.cd-item-name:hover{color:#1a7a4a}
.cd-item-cat{font-size:11px;color:#6b7280;margin:3px 0 5px}
.cd-item-price{font-size:14px;font-weight:700;color:#0d1b2a;margin-bottom:8px}
.cd-item-row{display:flex;align-items:center;gap:6px}
.cd-qty-btn{width:26px;height:26px;border:1.5px solid #e5e7eb;border-radius:6px;font-size:15px;font-weight:700;cursor:pointer;background:#fff;color:#111;display:flex;align-items:center;justify-content:center;line-height:1;transition:border-color .15s,background .15s}
.cd-qty-btn:hover{border-color:#1a7a4a;background:#e8f5ee}
.cd-qty{font-size:14px;font-weight:700;min-width:22px;text-align:center}
.cd-remove{margin-left:auto;background:none;border:none;font-size:16px;cursor:pointer;padding:3px 6px;border-radius:6px;opacity:.55;transition:opacity .15s}
.cd-remove:hover{opacity:1}
.cd-footer{padding:18px 22px;border-top:1px solid #e5e7eb;flex-shrink:0;display:flex;flex-direction:column;gap:10px}
.cd-row{display:flex;justify-content:space-between;font-size:14px;color:#374151;font-weight:500}
.cd-row-pix{font-weight:600}
.cd-subtotal-val{font-size:15px;font-weight:700;color:#111827}
.cd-pix-val{color:#1a7a4a;font-weight:700}
.cd-btn-go{display:block;width:100%;padding:13px;background:#1a7a4a;color:#fff;border-radius:10px;font-size:15px;font-weight:700;text-align:center;transition:background .2s;margin-top:2px;box-sizing:border-box}
.cd-btn-go:hover{background:#145f39}
.cd-btn-continue{display:block;width:100%;padding:11px;background:#f3f4f6;color:#374151;border-radius:10px;font-size:14px;font-weight:600;text-align:center;cursor:pointer;border:none;transition:background .15s}
.cd-btn-continue:hover{background:#e5e7eb}`;
  document.head.appendChild(s);
}

/* ── DRAWER ACTIONS ── */
function openDrawer()  {
  refreshDrawer();
  document.getElementById('cart-drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.body.style.overflow = '';
}

function refreshDrawer() {
  const items  = Cart.get();
  const count  = Cart.count();
  const sub    = Cart.subtotal();
  const pix    = Cart.pixTotal();
  const badge  = document.getElementById('cd-badge');
  const subEl  = document.getElementById('cd-subtotal');
  const pixEl  = document.getElementById('cd-pix');
  const itemEl = document.getElementById('cd-items');
  if (!badge) return;

  badge.textContent  = count;
  subEl.textContent  = fmt(sub);
  pixEl.textContent  = fmt(pix);
  Cart.syncBadges();

  if (!items.length) {
    itemEl.innerHTML = `<div class="cd-empty">
      <div><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
      <p>Seu carrinho está vazio.</p>
      <a href="catalogo.html" onclick="closeDrawer()">Ver catálogo</a>
    </div>`;
    return;
  }

  itemEl.innerHTML = items.map(({ id, qty }) => {
    const p = PRODUCTS.find(p => p.id === id);
    if (!p) return '';
    return `<div class="cd-item">
      <a href="produto.html?id=${p.id}"><img src="${p.img}" alt="${p.name}" class="cd-item-img" /></a>
      <div class="cd-item-info">
        <a href="produto.html?id=${p.id}" class="cd-item-name">${p.name}</a>
        <div class="cd-item-cat">${p.catName}</div>
        <div class="cd-item-price">${fmt(p.price)}</div>
        <div class="cd-item-row">
          <button class="cd-qty-btn" onclick="Cart.setQty(${id},${qty-1})">−</button>
          <span class="cd-qty">${qty}</span>
          <button class="cd-qty-btn" onclick="Cart.setQty(${id},${qty+1})">+</button>
          <button class="cd-remove" onclick="Cart.remove(${id})" title="Remover"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  injectDrawerCSS();
  injectDrawer();
  Cart.syncBadges();

  document.querySelectorAll('.btn-buy[data-id]').forEach(btn => {
    btn.addEventListener('click', function () {
      Cart.add(parseInt(this.dataset.id), parseInt(this.dataset.qty || '1'));
      this.textContent = '✓ Adicionado!';
      this.style.background = '#145f39';
      setTimeout(() => { this.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Comprar'; this.style.background = ''; }, 1600);
    });
  });
});
