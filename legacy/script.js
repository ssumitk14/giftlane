const WHATSAPP_NUMBER = "919204799288";
const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const byId = (id) => document.getElementById(id);

const categories = [
  ["Kids Return Gifts", "Budget packs for birthdays and school friends", "kids"],
  ["Birthday Gift Packs", "Hampers and urgent gifting options", "birthday"],
  ["Ladies Shringar & Accessories", "Bindi, bangles, clips and festive kits", "shringar"],
  ["Festival & Pooja Kits", "Rakhi, Teej, Diwali, Chhath and pooja kits", "pooja"],
  ["Home Utility Combos", "Kitchen, bathroom and new flat essentials", "utility"],
  ["Gifts Under ₹299", "Affordable gifting and return gift choices", "under-299"],
  ["Gifts Under ₹499", "Premium local gift packs", "under-499"],
  ["Bulk Return Gift Orders", "20, 30, 50 or 100 box enquiries", "bulk"],
  ["Create Your Own Box", "Build custom boxes from available products", "custom"]
];

const boxRules = {
  "Kids Return Gift Box": { min: 99, packaging: 10, recommended: ["Stationery", "Toy", "Sticker", "Gift Pouch"], bulkAt: 10, discount: 5 },
  "Birthday Gift Box": { min: 199, packaging: 25, recommended: ["Toy", "Chocolate", "Greeting"], bulkAt: 5, discount: 4 },
  "Ladies Shringar Box": { min: 149, packaging: 15, recommended: ["Bindi", "Bangles", "Hair Accessories"], bulkAt: 10, discount: 5 },
  "Festival/Pooja Box": { min: 149, packaging: 12, recommended: ["Diya", "Roli", "Chawal", "Agarbatti"], bulkAt: 10, discount: 5 },
  "Home Utility Box": { min: 249, packaging: 20, recommended: ["Kitchen", "Bathroom", "Storage"], bulkAt: 5, discount: 3 },
  "Custom Gift Box": { min: 199, packaging: 20, recommended: ["Gift Item", "Packing"], bulkAt: 10, discount: 4 }
};

const slots = ["Morning Slot: 10 AM - 12 PM", "Afternoon Slot: 2 PM - 4 PM", "Evening Slot: 6 PM - 9 PM"];

const defaultProducts = [
  p("P001", "Pencil Box", "Kids Return Gifts", 45, 50, 12, "Stationery box for return gifts", ["Kids", "Return Gift", "Birthday", "Under ₹299"], true, true, "#ffe08a", "▤"),
  p("P002", "Sticker Pack", "Kids Return Gifts", 18, 40, 15, "Colorful sticker sheet pack", ["Kids", "Sticker", "Return Gift"], true, true, "#d8f5ef", "★"),
  p("P003", "Eraser & Sharpener Set", "Kids Return Gifts", 22, 100, 20, "Useful stationery add-on", ["Kids", "Stationery", "Under ₹299"], true, true, "#dceeff", "✎"),
  p("P004", "Gift Pouch", "Kids Return Gifts", 14, 70, 20, "Simple packing pouch", ["Gift Pouch", "Return Gift", "Packing"], true, true, "#ffd7e4", "▣"),
  p("P005", "Mini Activity Book", "Kids Return Gifts", 55, 28, 10, "Activity booklet for ages 4-8", ["Kids", "Birthday", "Activity"], true, true, "#fff2aa", "☑"),
  p("P006", "Birthday Hamper Box", "Birthday Gift Packs", 399, 16, 5, "Ready decorated birthday hamper", ["Birthday", "Gift", "Under ₹499"], false, true, "#ffd7e4", "▰"),
  p("P007", "Daily Shringar Kit", "Ladies Shringar & Accessories", 249, 24, 6, "Bindi, clips, rubber bands and pins", ["Shringar", "Women", "Under ₹299"], true, true, "#ffc8db", "◈"),
  p("P008", "Festive Bangle Set", "Ladies Shringar & Accessories", 149, 18, 6, "Colorful festive bangle set", ["Shringar", "Teej", "Karwa Chauth"], true, true, "#f9b2c8", "○"),
  p("P009", "Pooja Essentials Set", "Festival & Pooja Kits", 299, 30, 8, "Roli, chawal, diya, agarbatti and cotton wicks", ["Pooja", "Festival", "Diwali", "Under ₹299"], true, true, "#ffe3b7", "◉"),
  p("P010", "Rakhi Combo", "Festival & Pooja Kits", 199, 35, 8, "Rakhi, roli chawal and token sweet box", ["Rakhi", "Festival", "Pooja"], true, true, "#fff0a8", "✦"),
  p("P011", "Kitchen Utility Kit", "Home Utility Combos", 349, 22, 6, "Scrub pad, clips, wipes and storage pouch", ["Utility", "Kitchen", "Housewarming"], true, true, "#dceeff", "▥"),
  p("P012", "Bathroom Utility Kit", "Home Utility Combos", 329, 12, 5, "Freshener, brush, scrub and organizer pouch", ["Utility", "Bathroom", "Under ₹499"], true, true, "#d8f5ef", "▧")
];

const defaultKits = [
  k("K001", "₹99 Kids Return Gift Pack", 99, "Budget return gift with stationery and pouch", [["P001", 1], ["P002", 1], ["P003", 1], ["P004", 1]], ["Kids", "Return Gift", "Under ₹299"], "#fff2aa", "₹99"),
  k("K002", "₹149 Kids Activity Pack", 149, "Activity book, stickers and packing", [["P005", 1], ["P002", 1], ["P004", 1]], ["Kids", "Birthday"], "#ffe08a", "₹149"),
  k("K003", "₹199 Birthday Gift Pack", 199, "Useful birthday gift pack for children", [["P005", 1], ["P001", 1], ["P002", 1], ["P004", 1]], ["Birthday", "Kids"], "#ffd7e4", "₹199"),
  k("K004", "Daily Shringar Kit", 249, "Daily accessories in a compact kit", [["P007", 1], ["P008", 1]], ["Shringar", "Women"], "#ffc8db", "SK"),
  k("K005", "Pooja Essentials Kit", 299, "Ready pooja kit for fixed-slot delivery", [["P009", 1], ["P010", 1]], ["Pooja", "Festival"], "#ffe3b7", "PK"),
  k("K006", "Kitchen Utility Kit", 349, "Useful home utility gift combo", [["P011", 1], ["P004", 1]], ["Utility", "Housewarming"], "#dceeff", "UK")
];

function p(sku, name, category, price, stock, low, description, tags, custom, kit, bg, icon) {
  return { id: sku, sku, name, category, price, costPrice: Math.round(price * .62), stock, reserved: 0, low, description, tags, custom, kit, active: true, imageBg: bg, icon, created: Date.now() - Math.random() * 1000000 };
}
function k(id, name, price, description, items, tags, bg, icon) {
  return { id, name, price, description, items: items.map(([productId, qty]) => ({ productId, qty })), tags, active: true, imageBg: bg, icon };
}

let state = loadState();
let box = { type: "Kids Return Gift Box", qty: 1, items: {}, slot: slots[2] };

function loadState() {
  const saved = localStorage.getItem("giftlane-state");
  if (saved) return JSON.parse(saved);
  return { products: defaultProducts, kits: defaultKits, orders: [], movements: [], settings: { deliveryBelow699: 40, freeDeliveryAbove: 699 } };
}
function saveState() { localStorage.setItem("giftlane-state", JSON.stringify(state)); }
function available(product) { return Math.max(0, product.stock - product.reserved); }
function kitAvailability(kit) {
  return Math.min(...kit.items.map((item) => Math.floor(available(findProduct(item.productId)) / item.qty)));
}
function findProduct(id) { return state.products.find((product) => product.id === id); }
function wa(message) { return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`; }

function init() {
  wireWhatsAppLinks();
  renderCategories();
  setupFilters();
  renderCatalog();
  renderKits();
  setupBuilder();
  setupBulk();
  setupAdmin();
}

function wireWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = wa(link.dataset.whatsapp);
    link.target = "_blank";
    link.rel = "noopener";
  });
}

function renderCategories() {
  byId("categoryGrid").innerHTML = categories.map(([name, desc, key]) => `<a class="category-card" href="${key === "custom" ? "#box-builder" : key === "bulk" ? "#bulk" : "#shop"}"><b>${categoryIcon(key)}</b><strong>${name}</strong><small>${desc}</small></a>`).join("");
}
function categoryIcon(key) {
  return { kids: "🎁", birthday: "🎂", shringar: "💄", pooja: "🪔", utility: "🧺", "under-299": "₹", "under-499": "₹", bulk: "50", custom: "+" }[key] || "•";
}

function setupFilters() {
  const cats = ["All categories", ...new Set(state.products.map((p) => p.category))];
  byId("categoryFilter").innerHTML = cats.map((c) => `<option value="${c}">${c}</option>`).join("");
  byId("builderCategory").innerHTML = cats.map((c) => `<option value="${c}">${c}</option>`).join("");
  const tags = ["All tags", ...new Set(state.products.flatMap((p) => p.tags))];
  byId("tagFilter").innerHTML = tags.map((t) => `<option value="${t}">${t}</option>`).join("");
  ["searchInput", "categoryFilter", "tagFilter", "priceFilter", "sortFilter"].forEach((id) => byId(id).addEventListener("input", renderCatalog));
}

function filteredProducts(customOnly = false) {
  const search = (customOnly ? byId("builderSearch").value : byId("searchInput").value).toLowerCase();
  const category = customOnly ? byId("builderCategory").value : byId("categoryFilter").value;
  const tag = customOnly ? "All tags" : byId("tagFilter").value;
  const price = customOnly ? "all" : byId("priceFilter").value;
  const sort = customOnly ? "popular" : byId("sortFilter").value;
  let products = state.products.filter((product) => product.active && (!customOnly || product.custom));
  products = products.filter((product) => product.name.toLowerCase().includes(search) || product.tags.join(" ").toLowerCase().includes(search));
  if (category !== "All categories") products = products.filter((product) => product.category === category);
  if (tag !== "All tags") products = products.filter((product) => product.tags.includes(tag));
  if (price !== "all") products = products.filter((product) => product.price <= Number(price));
  if (sort === "price") products.sort((a, b) => a.price - b.price);
  if (sort === "newest") products.sort((a, b) => b.created - a.created);
  return products;
}

function renderCatalog() {
  byId("productGrid").innerHTML = filteredProducts().map(productCard).join("");
}
function stockClass(product) {
  if (available(product) <= 0) return "stock-out";
  if (available(product) <= product.low) return "stock-low";
  return "stock-ok";
}
function productCard(product) {
  const disabled = available(product) <= 0 ? "disabled" : "";
  return `<article class="product-card">
    <div class="product-image" style="--image-bg:${product.imageBg}">${product.icon}</div>
    <div class="product-body">
      <div><p class="eyebrow">${product.category}</p><h3>${product.name}</h3></div>
      <div class="price">${money(product.price)}</div>
      <p class="product-meta">SKU ${product.sku} · ${product.description}</p>
      <div class="${stockClass(product)}">${available(product) ? `${available(product)} in stock` : "Out of stock"}</div>
      <div class="tag-row">${product.tags.slice(0, 4).map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
      <div class="product-actions">
        <button class="btn ghost" onclick="openProduct('${product.id}')">View Details</button>
        <a class="btn whatsapp ${disabled}" href="${wa(productOrderMessage(product))}" target="_blank" rel="noopener">WhatsApp Order</a>
      </div>
    </div>
  </article>`;
}
function productOrderMessage(product) {
  return `Hi, I want to place an order.\n\nOrder Type: Product\nProduct: ${product.name}\nSKU: ${product.sku}\nQuantity: 1\nPrice: ${money(product.price)}\nPreferred Delivery Slot: Evening, 6 PM - 9 PM\nLocation: Sector 110, Gurgaon\nName:\nPhone:\nPlease confirm availability.`;
}

function renderKits() {
  byId("kitGrid").innerHTML = state.kits.filter((kit) => kit.active).map((kit) => {
    const qty = kitAvailability(kit);
    return `<article class="product-card">
      <div class="product-image" style="--image-bg:${kit.imageBg}">${kit.icon}</div>
      <div class="product-body">
        <div><p class="eyebrow">Ready-made kit</p><h3>${kit.name}</h3></div>
        <div class="price">${money(kit.price)}</div>
        <p class="product-meta">${kit.description}</p>
        <p class="${qty ? "stock-ok" : "stock-out"}">Available kits: ${qty}</p>
        <p class="product-meta">Includes: ${kit.items.map((item) => `${findProduct(item.productId).name} x ${item.qty}`).join(", ")}</p>
        <div class="product-actions"><a class="btn whatsapp" href="${wa(kitMessage(kit))}" target="_blank" rel="noopener">Order Kit</a></div>
      </div>
    </article>`;
  }).join("");
}
function kitMessage(kit) {
  return `Hi, I want to place an order.\n\nOrder Type: Ready-made Kit\nKit: ${kit.name}\nQuantity: 1\nKit Price: ${money(kit.price)}\nPreferred Delivery Slot: Evening, 6 PM - 9 PM\nLocation: Sector 110, Gurgaon\nName:\nPhone:\nPlease confirm availability.`;
}

function openProduct(id) {
  const product = findProduct(id);
  byId("modalRoot").innerHTML = `<div class="modal-backdrop" onclick="closeModal(event)">
    <article class="modal" onclick="event.stopPropagation()">
      <div class="modal-head"><h3>${product.name}</h3><button class="close-btn" onclick="closeModal()">×</button></div>
      <div class="modal-body">
        <div class="product-image" style="--image-bg:${product.imageBg}">${product.icon}</div>
        <div class="price">${money(product.price)}</div>
        <p>${product.description}</p>
        <p><strong>What's included:</strong> ${product.category.includes("Kit") ? "Combo products as listed by admin." : "Single product or add-on item."}</p>
        <p><strong>Best use case:</strong> ${product.tags.join(", ")}</p>
        <p><strong>Delivery availability:</strong> Morning, afternoon and evening slots subject to stock.</p>
        <p><strong>Stock:</strong> ${available(product)} available · SKU ${product.sku}</p>
        <label>Quantity<input id="detailQty" type="number" min="1" max="${available(product)}" value="1"></label>
        <div class="product-actions">
          ${product.custom ? `<button class="btn secondary" onclick="addToBox('${product.id}', Number(byId('detailQty').value)); closeModal(); location.hash='box-builder'">Add to Box</button>` : ""}
          <a class="btn whatsapp" href="${wa(productOrderMessage(product))}" target="_blank" rel="noopener">Order on WhatsApp</a>
          <a class="btn ghost" href="${wa(`Hi, I need bulk availability for ${product.name}. Quantity: __. Budget/date/location: __.`)}" target="_blank" rel="noopener">Bulk Enquiry</a>
        </div>
      </div>
    </article>
  </div>`;
}
function closeModal(event) {
  if (!event || event.target.classList.contains("modal-backdrop")) byId("modalRoot").innerHTML = "";
}

function setupBuilder() {
  byId("boxType").innerHTML = Object.keys(boxRules).map((name) => `<option>${name}</option>`).join("");
  byId("boxSlot").innerHTML = slots.map((slot) => `<option>${slot}</option>`).join("");
  ["boxType", "boxQty", "boxSlot", "builderSearch", "builderCategory", "customerName", "customerPhone", "customerLocation", "specialNotes"].forEach((id) => byId(id).addEventListener("input", syncBox));
  renderBuilderProducts();
  renderBoxSummary();
}
function syncBox() {
  box.type = byId("boxType").value;
  box.qty = Math.max(1, Number(byId("boxQty").value || 1));
  box.slot = byId("boxSlot").value;
  renderBuilderProducts();
  renderBoxSummary();
}
function renderBuilderProducts() {
  byId("builderProducts").innerHTML = filteredProducts(true).map((product) => `<article class="mini-card">
    <div class="mini-image" style="--image-bg:${product.imageBg}">${product.icon}</div>
    <div>
      <strong>${product.name}</strong>
      <small>${money(product.price)} · ${available(product)} available</small>
      <div class="mini-actions"><button class="qty-btn" onclick="addToBox('${product.id}', -1)">−</button><span>${box.items[product.id] || 0}</span><button class="qty-btn" onclick="addToBox('${product.id}', 1)">+</button></div>
    </div>
  </article>`).join("");
}
function addToBox(id, delta) {
  const next = Math.max(0, (box.items[id] || 0) + delta);
  if (next === 0) delete box.items[id]; else box.items[id] = next;
  renderBuilderProducts();
  renderBoxSummary();
}
function boxTotals() {
  const rule = boxRules[box.type];
  const lines = Object.entries(box.items).map(([id, qty]) => ({ product: findProduct(id), qty }));
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const packaging = lines.length ? rule.packaging : 0;
  const boxPrice = subtotal + packaging;
  const beforeDiscount = boxPrice * box.qty;
  const discount = box.qty >= rule.bulkAt ? Math.round(beforeDiscount * rule.discount / 100) : 0;
  const delivery = beforeDiscount - discount >= state.settings.freeDeliveryAbove || beforeDiscount === 0 ? 0 : state.settings.deliveryBelow699;
  const final = beforeDiscount - discount + delivery;
  const maxBoxes = lines.length ? Math.min(...lines.map((line) => Math.floor(available(line.product) / line.qty))) : 0;
  return { rule, lines, subtotal, packaging, boxPrice, beforeDiscount, discount, delivery, final, maxBoxes };
}
function renderBoxSummary() {
  const totals = boxTotals();
  const tooLow = totals.boxPrice > 0 && totals.boxPrice < totals.rule.min;
  const insufficient = totals.lines.length && box.qty > totals.maxBoxes;
  const message = customBoxMessage(totals);
  byId("boxSummary").innerHTML = `<h3>${box.type}</h3>
    <p class="product-meta">Minimum box value ${money(totals.rule.min)} · Recommended: ${totals.rule.recommended.join(", ")}</p>
    <div class="summary-items">${totals.lines.length ? totals.lines.map((line) => `<div class="summary-line"><span>${line.product.name} x ${line.qty}</span><strong>${money(line.product.price * line.qty)}</strong></div>`).join("") : "<p class='product-meta'>No items selected yet.</p>"}</div>
    <div class="summary-line"><span>Items subtotal</span><strong>${money(totals.subtotal)}</strong></div>
    <div class="summary-line"><span>Packaging per box</span><strong>${money(totals.packaging)}</strong></div>
    <div class="summary-line"><span>Box price</span><strong>${money(totals.boxPrice)}</strong></div>
    <div class="summary-line"><span>Quantity</span><strong>${box.qty} boxes</strong></div>
    <div class="summary-line"><span>Discount</span><strong>${money(totals.discount)}</strong></div>
    <div class="summary-line"><span>Delivery</span><strong>${money(totals.delivery)}</strong></div>
    <div class="summary-line"><span>Estimated total</span><strong>${money(totals.final)}</strong></div>
    ${tooLow ? `<p class="stock-low">Minimum value is ${money(totals.rule.min)}. Add more items.</p>` : ""}
    ${insufficient ? `<p class="stock-out">Only ${totals.maxBoxes} boxes can be created with current stock. Please reduce quantity or contact us for bulk availability.</p>` : ""}
    <button class="btn ghost" onclick="box.items={}; renderBuilderProducts(); renderBoxSummary();">Clear Box</button>
    <a class="btn whatsapp ${tooLow || insufficient || !totals.lines.length ? "disabled" : ""}" href="${wa(message)}" target="_blank" rel="noopener">Order on WhatsApp</a>
    <button class="btn secondary" onclick="saveBoxOrder()">Save Box / Enquiry</button>`;
  byId("mobileBoxBar").className = totals.lines.length ? "mobile-box-bar active" : "mobile-box-bar";
  byId("mobileBoxBar").innerHTML = `<strong>${totals.lines.reduce((s, l) => s + l.qty, 0)} items selected</strong><span>Total ${money(totals.final)}</span><a class="btn secondary" href="#box-builder">View Box</a>`;
}
function customBoxMessage(totals) {
  return `Hi, I want to place an order.\n\nOrder Type: Custom ${box.type}\nItems:\n${totals.lines.map((line, index) => `${index + 1}. ${line.product.name} x ${line.qty * box.qty}`).join("\n")}\n\nBox Price: ${money(totals.boxPrice)}\nQuantity: ${box.qty} boxes\nTotal: ${money(totals.final)}\nPreferred Delivery Slot: ${box.slot}\nLocation: ${byId("customerLocation").value || "Sector 110, Gurgaon"}\nName: ${byId("customerName").value || ""}\nPhone: ${byId("customerPhone").value || ""}\nNotes: ${byId("specialNotes").value || ""}\nPlease confirm availability.`;
}
function saveBoxOrder() {
  const totals = boxTotals();
  if (!totals.lines.length) return;
  state.orders.unshift({ id: `ORD${Date.now()}`, customer: byId("customerName").value || "Website enquiry", phone: byId("customerPhone").value || "", location: byId("customerLocation").value || "", type: "custom box", items: totals.lines.map((line) => ({ productId: line.product.id, qty: line.qty * box.qty })), subtotal: totals.beforeDiscount, delivery: totals.delivery, discount: totals.discount, final: totals.final, slot: box.slot, payment: "Pending", status: "New Order / Enquiry", notes: byId("specialNotes").value || "", created: new Date().toISOString() });
  saveState();
  renderAdmin();
  alert("Custom box enquiry saved in admin orders.");
}

function setupBulk() {
  byId("bulkForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const order = { id: `BULK${Date.now()}`, customer: byId("bulkName").value, phone: byId("bulkPhone").value, location: byId("bulkLocation").value, type: "bulk order", items: [{ name: byId("bulkEvent").value, qty: Number(byId("bulkQty").value) }], subtotal: 0, delivery: 0, discount: 0, final: 0, slot: byId("bulkDate").value, payment: "Pending", status: "New Order / Enquiry", notes: `${byId("bulkCategory").value}. Budget: ${byId("bulkBudget").value}. ${byId("bulkNotes").value}`, created: new Date().toISOString() };
    state.orders.unshift(order);
    saveState();
    window.open(wa(`Hi, I need a bulk order enquiry.\nName: ${order.customer}\nPhone: ${order.phone}\nEvent Type: ${byId("bulkEvent").value}\nRequired Quantity: ${byId("bulkQty").value}\nBudget per box: ${byId("bulkBudget").value}\nPreferred Category: ${byId("bulkCategory").value}\nDelivery Date: ${byId("bulkDate").value}\nSociety/Location: ${order.location}\nSpecial Requirements: ${byId("bulkNotes").value}\nPlease share options.`), "_blank", "noopener");
  });
}

function setupAdmin() {
  byId("loginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (byId("adminUser").value === "admin" && byId("adminPass").value === "gift110") {
      byId("loginForm").classList.add("hidden");
      byId("adminApp").classList.remove("hidden");
      renderAdmin();
    } else alert("Invalid demo login.");
  });
  document.querySelectorAll("[data-admin-tab]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-admin-tab]").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    renderAdmin(button.dataset.adminTab);
  }));
}
function renderAdmin(tab = document.querySelector("[data-admin-tab].active")?.dataset.adminTab || "products") {
  renderDashboard();
  if (tab === "products") renderProductAdmin();
  if (tab === "orders") renderOrderAdmin();
  if (tab === "inventory") renderInventoryAdmin();
  if (tab === "settings") renderSettingsAdmin();
}
function renderDashboard() {
  const today = new Date().toDateString();
  const ordersToday = state.orders.filter((o) => new Date(o.created).toDateString() === today).length;
  const low = state.products.filter((p) => available(p) <= p.low && available(p) > 0).length;
  const out = state.products.filter((p) => available(p) <= 0).length;
  const revenue = state.orders.filter((o) => o.status === "Fulfilled / Delivered").reduce((s, o) => s + o.final, 0);
  byId("dashboardCards").innerHTML = [["Orders today", ordersToday], ["Pending", state.orders.filter((o) => o.status.includes("New")).length], ["Low stock", low], ["Revenue", money(revenue)], ["Out of stock", out], ["Bulk enquiries", state.orders.filter((o) => o.type === "bulk order").length], ["Custom boxes", state.orders.filter((o) => o.type === "custom box").length], ["Confirmed", state.orders.filter((o) => o.status === "Confirmed").length]].map(([label, value]) => `<article class="dash-card"><span>${label}</span><strong>${value}</strong></article>`).join("");
}
function renderProductAdmin() {
  byId("adminPanel").innerHTML = `<div class="admin-card"><h3>Add product</h3><div class="bulk-form">
    <label>Name<input id="newName"></label><label>SKU<input id="newSku"></label><label>Category<input id="newCategory"></label><label>Price<input id="newPrice" type="number"></label><label>Stock<input id="newStock" type="number"></label><label>Low-stock threshold<input id="newLow" type="number" value="5"></label><label class="wide">Tags<input id="newTags" placeholder="Birthday, Kids, Under ₹299"></label><button class="btn primary wide" onclick="addProduct()">Add Product</button>
  </div></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Flags</th><th>Actions</th></tr></thead><tbody>${state.products.map((p) => `<tr><td><strong>${p.name}</strong><br><small>${p.sku} · ${p.category}</small></td><td><input type="number" value="${p.price}" onchange="updateProduct('${p.id}','price',this.value)"></td><td><input type="number" value="${p.stock}" onchange="manualStock('${p.id}',this.value)"><small>Reserved ${p.reserved}</small></td><td><label><input type="checkbox" ${p.active ? "checked" : ""} onchange="updateProduct('${p.id}','active',this.checked)"> Active</label><label><input type="checkbox" ${p.custom ? "checked" : ""} onchange="updateProduct('${p.id}','custom',this.checked)"> Custom box</label><label><input type="checkbox" ${p.kit ? "checked" : ""} onchange="updateProduct('${p.id}','kit',this.checked)"> Ready kit</label></td><td><button class="btn ghost" onclick="updateProduct('${p.id}','stock',0)">Out of stock</button></td></tr>`).join("")}</tbody></table></div>`;
}
function addProduct() {
  const sku = byId("newSku").value || `P${Date.now()}`;
  state.products.push(p(sku, byId("newName").value || "New Product", byId("newCategory").value || "General", Number(byId("newPrice").value || 0), Number(byId("newStock").value || 0), Number(byId("newLow").value || 5), "Admin added product", byId("newTags").value.split(",").map((t) => t.trim()).filter(Boolean), true, true, "#fff2aa", "+"));
  saveState(); setupFilters(); renderCatalog(); renderBuilderProducts(); renderAdmin("products");
}
function updateProduct(id, field, value) {
  const product = findProduct(id);
  product[field] = ["price", "stock", "low"].includes(field) ? Number(value) : value;
  saveState(); renderCatalog(); renderKits(); renderBuilderProducts(); renderAdmin();
}
function manualStock(id, value) {
  const product = findProduct(id);
  state.movements.unshift({ id: `MOV${Date.now()}`, productId: id, type: "manual update", change: Number(value) - product.stock, previous: product.stock, next: Number(value), admin: "admin", timestamp: new Date().toISOString(), notes: "Manual admin stock update" });
  updateProduct(id, "stock", value);
}
function renderOrderAdmin() {
  const statuses = ["New Order / Enquiry", "Confirmed", "Packed", "Out for Delivery", "Fulfilled / Delivered", "Cancelled", "Returned"];
  byId("adminPanel").innerHTML = `<div class="table-wrap"><table class="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Slot</th><th>Status</th><th>WhatsApp</th></tr></thead><tbody>${state.orders.map((o) => `<tr><td><strong>${o.id}</strong><br><small>${o.type}</small><br>${orderItemsText(o)}</td><td>${o.customer}<br><small>${o.phone}<br>${o.location}</small></td><td>${money(o.final)}<br><small>Pay: ${o.payment}</small></td><td>${o.slot}</td><td><select onchange="changeOrderStatus('${o.id}', this.value)">${statuses.map((s) => `<option ${o.status === s ? "selected" : ""}>${s}</option>`).join("")}</select><textarea onchange="updateOrderNotes('${o.id}', this.value)">${o.notes || ""}</textarea></td><td><a class="btn whatsapp" href="${wa(`Hi ${o.customer}, regarding your GiftLane 110 order ${o.id}, `)}" target="_blank" rel="noopener">Contact</a><button class="btn ghost" onclick="printOrder('${o.id}')">Print</button></td></tr>`).join("")}</tbody></table></div>`;
}
function orderItemsText(order) {
  return order.items.map((item) => item.productId ? `${findProduct(item.productId)?.name || item.productId} x ${item.qty}` : `${item.name} x ${item.qty}`).join("<br>");
}
function changeOrderStatus(id, status) {
  const order = state.orders.find((o) => o.id === id);
  if (order.status !== "Confirmed" && status === "Confirmed") adjustInventory(order, "reserve");
  if (order.status === "Confirmed" && status === "Cancelled") adjustInventory(order, "release");
  if (order.status !== "Fulfilled / Delivered" && status === "Fulfilled / Delivered") adjustInventory(order, "fulfill");
  order.status = status;
  saveState(); renderCatalog(); renderKits(); renderAdmin("orders");
}
function adjustInventory(order, mode) {
  order.items.filter((item) => item.productId).forEach((item) => {
    const product = findProduct(item.productId);
    const prevStock = product.stock;
    if (mode === "reserve") product.reserved += item.qty;
    if (mode === "release") product.reserved = Math.max(0, product.reserved - item.qty);
    if (mode === "fulfill") { product.stock = Math.max(0, product.stock - item.qty); product.reserved = Math.max(0, product.reserved - item.qty); }
    state.movements.unshift({ id: `MOV${Date.now()}${item.productId}`, productId: item.productId, type: `order ${mode}`, change: mode === "fulfill" ? -item.qty : item.qty, previous: prevStock, next: product.stock, orderId: order.id, admin: "admin", timestamp: new Date().toISOString(), notes: `Order status inventory ${mode}` });
  });
}
function updateOrderNotes(id, notes) { state.orders.find((o) => o.id === id).notes = notes; saveState(); }
function printOrder(id) {
  const order = state.orders.find((o) => o.id === id);
  const win = window.open("", "_blank");
  win.document.write(`<pre>GiftLane 110 Order Summary\n\nOrder: ${order.id}\nCustomer: ${order.customer}\nPhone: ${order.phone}\nLocation: ${order.location}\nItems:\n${orderItemsText(order).replaceAll("<br>", "\n")}\nTotal: ${money(order.final)}\nSlot: ${order.slot}\nStatus: ${order.status}</pre>`);
  win.print();
}
function renderInventoryAdmin() {
  byId("adminPanel").innerHTML = `<div class="table-wrap"><table class="admin-table"><thead><tr><th>Product</th><th>Current</th><th>Reserved</th><th>Low threshold</th><th>Status</th></tr></thead><tbody>${state.products.map((p) => `<tr><td>${p.name}<br><small>${p.sku}</small></td><td>${p.stock}</td><td>${p.reserved}</td><td><input type="number" value="${p.low}" onchange="updateProduct('${p.id}','low',this.value)"></td><td class="${stockClass(p)}">${available(p) <= 0 ? "Out of stock" : available(p) <= p.low ? "Low stock" : "Available"}</td></tr>`).join("")}</tbody></table></div><h3>Inventory Movement History</h3><div class="table-wrap"><table class="admin-table"><thead><tr><th>Time</th><th>Product</th><th>Type</th><th>Change</th><th>Order</th></tr></thead><tbody>${state.movements.slice(0, 30).map((m) => `<tr><td>${new Date(m.timestamp).toLocaleString()}</td><td>${findProduct(m.productId)?.name || m.productId}</td><td>${m.type}</td><td>${m.change}</td><td>${m.orderId || ""}</td></tr>`).join("")}</tbody></table></div>`;
}
function renderSettingsAdmin() {
  byId("adminPanel").innerHTML = `<div class="admin-card"><h3>Delivery and pricing settings</h3><label>Delivery charge below free-delivery value<input type="number" value="${state.settings.deliveryBelow699}" onchange="state.settings.deliveryBelow699=Number(this.value); saveState(); renderBoxSummary();"></label><label>Free delivery above<input type="number" value="${state.settings.freeDeliveryAbove}" onchange="state.settings.freeDeliveryAbove=Number(this.value); saveState(); renderBoxSummary();"></label><p class="product-meta">Future-ready hooks: online checkout, UPI/COD, customer login, payment gateway, invoices, delivery assignment and order tracking can build on the existing order and inventory models.</p></div>`;
}

window.openProduct = openProduct;
window.closeModal = closeModal;
window.addToBox = addToBox;
window.saveBoxOrder = saveBoxOrder;
window.addProduct = addProduct;
window.updateProduct = updateProduct;
window.manualStock = manualStock;
window.changeOrderStatus = changeOrderStatus;
window.updateOrderNotes = updateOrderNotes;
window.printOrder = printOrder;

init();
