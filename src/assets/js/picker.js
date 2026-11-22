// WhatsApp dish-picker — vanilla JS, re-initialized on every astro:page-load
// (Astro view transitions swap the DOM, so cards are re-wired per page).
// The cart lives at module scope so it survives navigation between pages.

const WA_NUMBER = "18292755220";

const priceLabel = (price) => `RD$${price}`;

/** @type {{ id: string; name: string; option: string; price: number; qty: number }[]} */
let cart = [];
let toastTimer = null;

// Favorites live in the browser's local storage, so a saved dish is still
// there when the visitor comes back on the same device. No account, no
// database — the heart just remembers on this browser.
const FAVORITES_KEY = "lamovie-favoritos";
let currentMenuFilter = "todos";
let reapplyMenuFilter = null;

function loadFavorites() {
	try {
		return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"));
	} catch {
		return new Set();
	}
}

function saveFavorites(favorites) {
	try {
		localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
	} catch {
		// storage unavailable — the heart still toggles for this visit
	}
}

function syncHearts() {
	const favorites = loadFavorites();
	document.querySelectorAll("[data-heart]").forEach((btn) => {
		const card = btn.closest("[data-dish-card]");
		if (card) btn.setAttribute("aria-pressed", String(favorites.has(card.dataset.dishId)));
	});
}

document.addEventListener("astro:page-load", () => {
	initPicker();
});

function initPicker() {
	// Dish cards
	document.querySelectorAll("[data-dish-card]").forEach((card) => {
		if (card.dataset.wired) return;
		card.dataset.wired = "true";
		wireCard(card);
	});

	// Order bar
	const bar = document.querySelector("[data-order-bar]");
	if (bar && !bar.dataset.wired) {
		bar.dataset.wired = "true";
		wireOrderBar(bar);
	}

	// Menu filter pills
	const filters = document.querySelector("[data-filters]");
	if (filters && !filters.dataset.wired) {
		filters.dataset.wired = "true";
		wireFilters(filters);
	}

	syncHearts();
	renderBar();
}

function wireCard(card) {
	const select = card.querySelector("[data-option-select]");
	const priceEl = card.querySelector("[data-price]");
	const qtyEl = card.querySelector("[data-qty]");
	const qtyValue = card.querySelector("[data-qty-value]");
	const addBtn = card.querySelector("[data-add]");
	const heartBtn = card.querySelector("[data-heart]");

	if (select && priceEl) {
		select.addEventListener("change", () => {
			const option = getOptions(card)[Number(select.value)];
			priceEl.textContent = priceLabel(option.price);
		});
	}

	if (qtyEl && qtyValue) {
		qtyEl.querySelector("[data-qty-minus]").addEventListener("click", () => {
			const next = Math.max(1, Number(qtyValue.textContent) - 1);
			qtyValue.textContent = String(next);
		});
		qtyEl.querySelector("[data-qty-plus]").addEventListener("click", () => {
			const next = Math.min(20, Number(qtyValue.textContent) + 1);
			qtyValue.textContent = String(next);
		});
	}

	if (heartBtn) {
		heartBtn.addEventListener("click", () => {
			const id = card.dataset.dishId;
			if (!id) return;
			const favorites = loadFavorites();
			if (favorites.has(id)) {
				favorites.delete(id);
			} else {
				favorites.add(id);
			}
			saveFavorites(favorites);
			heartBtn.setAttribute("aria-pressed", String(favorites.has(id)));
			// If the Favoritos filter is on, refresh it so the card appears/disappears
			if (currentMenuFilter === "favoritos") reapplyMenuFilter?.("favoritos");
		});
	}

	if (addBtn) {
		addBtn.addEventListener("click", () => {
			addToCart(card);
			addBtn.classList.add("added");
			const label = addBtn.querySelector("span");
			if (label) label.textContent = "¡Agregado!";
			window.setTimeout(() => {
				addBtn.classList.remove("added");
				if (label) label.textContent = card.dataset.fixedOption !== "" ? "Pedir ahora" : "Agregar";
			}, 1500);
		});
	}
}

function getOptions(card) {
	try {
		return JSON.parse(card.dataset.options || "[]");
	} catch {
		return [];
	}
}

function addToCart(card) {
	const options = getOptions(card);
	const isFavorite = card.dataset.fixedOption !== "";
	const optionIndex = isFavorite
		? Number(card.dataset.fixedOption || 0)
		: Number(card.querySelector("[data-option-select]")?.value ?? 0);
	const option = options[optionIndex] || options[0];
	if (!option) return;

	const qty = Number(card.querySelector("[data-qty-value]")?.textContent ?? 1) || 1;
	const name = card.dataset.dishName || card.dataset.dishId;
	const id = card.dataset.dishId;

	const existing = cart.find((line) => line.id === id && line.option === option.label);
	if (existing) {
		existing.qty = Math.min(20, existing.qty + qty);
	} else {
		cart.push({ id, name, option: option.label, price: option.price, qty });
	}

	renderBar();
	showToast(`Agregado: ${qty} × ${name} (${option.label})`);
}

function cartTotal() {
	return cart.reduce((sum, line) => sum + line.price * line.qty, 0);
}

function cartCount() {
	return cart.reduce((sum, line) => sum + line.qty, 0);
}

function buildMessage() {
	const lines = cart.map(
		(line) => `• ${line.qty} × ${line.name} (${line.option}) — ${priceLabel(line.price * line.qty)}`,
	);
	return [
		"Hola Cafetería La Movie, quiero hacer un pedido:",
		...lines,
		`Total: ${priceLabel(cartTotal())}`,
	].join("\n");
}

function renderBar() {
	const bar = document.querySelector("[data-order-bar]");
	if (!bar) return;

	const countLabelEl = bar.querySelector("[data-order-count-label]");
	const totalEl = bar.querySelector("[data-order-total]");
	const linesEl = bar.querySelector("[data-order-lines]");
	const sendEl = bar.querySelector("[data-order-send]");
	const panel = bar.querySelector("[data-order-panel]");

	bar.hidden = cart.length === 0;
	if (cart.length === 0) {
		if (panel) panel.hidden = true;
		bar.querySelector("[data-order-toggle]")?.setAttribute("aria-expanded", "false");
		return;
	}

	const count = cartCount();
	if (countLabelEl) countLabelEl.textContent = `${count} ${count === 1 ? "pedido" : "pedidos"}`;
	if (totalEl) totalEl.textContent = priceLabel(cartTotal());

	if (linesEl) {
		linesEl.innerHTML = "";
		cart.forEach((line, index) => {
			const li = document.createElement("li");
			const text = document.createElement("span");
			text.textContent = `${line.qty} × ${line.name} (${line.option}) — ${priceLabel(line.price * line.qty)}`;
			const remove = document.createElement("button");
			remove.type = "button";
			remove.className = "order-line-remove";
			remove.innerHTML =
				'<svg viewBox="0 0 448 512" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2C296.3 0 307.4 6.8 312.8 17.7L320 32H416C433.7 32 448 46.3 448 64S433.7 96 416 96H32C14.3 96 0 81.7 0 64S14.3 32 32 32H128L135.2 17.7zM394.6 466.1C393.2 492.3 372.3 512 346 512H102C75.7 512 54.8 492.3 53.4 466.1L31.6 128H416.4L394.6 466.1z"/></svg>';
			remove.setAttribute("aria-label", `Quitar ${line.name} del pedido`);
			remove.addEventListener("click", () => {
				cart.splice(index, 1);
				renderBar();
			});
			li.append(text, remove);
			linesEl.append(li);
		});
	}

	if (sendEl) {
		sendEl.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildMessage())}`;
	}
}

function wireOrderBar(bar) {
	const toggle = bar.querySelector("[data-order-toggle]");
	const panel = bar.querySelector("[data-order-panel]");
	const clear = bar.querySelector("[data-order-clear]");

	if (toggle && panel) {
		toggle.addEventListener("click", () => {
			const expanded = toggle.getAttribute("aria-expanded") === "true";
			toggle.setAttribute("aria-expanded", String(!expanded));
			panel.hidden = expanded;
		});
	}

	if (clear) {
		clear.addEventListener("click", () => {
			cart = [];
			renderBar();
		});
	}
}

function wireFilters(filters) {
	const buttons = filters.querySelectorAll("[data-filter]");
	const cards = document.querySelectorAll("[data-dish-card]");
	const params = new URLSearchParams(window.location.search);
	const initial = params.get("categoria") || "todos";

	const applyFilter = (category) => {
		currentMenuFilter = category;
		reapplyMenuFilter = applyFilter;
		const favorites = loadFavorites();
		buttons.forEach((btn) => {
			const active = btn.dataset.filter === category;
			btn.classList.toggle("is-active", active);
			btn.setAttribute("aria-pressed", String(active));
		});
		cards.forEach((card) => {
			const visible =
				category === "todos" ||
				(category === "favoritos" && favorites.has(card.dataset.dishId)) ||
				card.dataset.category === category;
			card.style.display = visible ? "" : "none";
		});
		// Hide empty category sections
		document.querySelectorAll("[data-category-section]").forEach((section) => {
			const anyVisible = [...section.querySelectorAll("[data-dish-card]")].some(
				(card) => card.style.display !== "none",
			);
			section.style.display = anyVisible ? "" : "none";
		});
		// Empty state when the Favoritos filter has nothing saved yet
		const empty = document.querySelector("[data-favorites-empty]");
		if (empty) empty.hidden = !(category === "favoritos" && favorites.size === 0);
		// Keep the URL in sync without reloading
		const url = new URL(window.location.href);
		if (category === "todos") {
			url.searchParams.delete("categoria");
		} else {
			url.searchParams.set("categoria", category);
		}
		window.history.replaceState(null, "", url);
	};

	buttons.forEach((btn) => {
		btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
	});

	applyFilter(initial);
}

function showToast(message) {
	const toast = document.querySelector("[data-order-toast]");
	if (!toast) return;
	toast.textContent = message;
	toast.hidden = false;
	if (toastTimer) window.clearTimeout(toastTimer);
	toastTimer = window.setTimeout(() => {
		toast.hidden = true;
	}, 2500);
}
