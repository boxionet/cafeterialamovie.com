document.addEventListener("astro:page-load", () => {
	const CSbody = document.querySelector("body");
	const CSnavbarMenu = document.getElementById("cs-navigation");
	const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
	const mobileMenuClose = document.getElementById("mobile-menu-close");
	const mobileOverlay = document.getElementById("cs-mobile-overlay");

	function isOpen() {
		return CSnavbarMenu.classList.contains("cs-active");
	}

	function toggleMenu() {
		const open = !isOpen();
		mobileMenuToggle.classList.toggle("cs-active", open);
		CSnavbarMenu.classList.toggle("cs-active", open);
		CSbody.classList.toggle("cs-open", open);
		mobileMenuToggle.setAttribute("aria-expanded", String(open));
		if (mobileOverlay) mobileOverlay.setAttribute("aria-hidden", String(!open));
	}

	mobileMenuToggle.addEventListener("click", () => {
		toggleMenu();
	});

	// Overlay's own X button
	if (mobileMenuClose) {
		mobileMenuClose.addEventListener("click", () => {
			if (isOpen()) toggleMenu();
		});
	}

	// Any link/button inside the overlay closes the menu (navigation
	// happens via view transitions, so the menu would otherwise stay open)
	document.querySelectorAll("[data-menu-close]").forEach((el) => {
		el.addEventListener("click", () => {
			if (isOpen()) toggleMenu();
		});
	});

	// Escape closes the overlay menu
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && isOpen()) toggleMenu();
	});

	function ariaExpanded(element) {
		const isExpanded = element.getAttribute("aria-expanded");
		element.setAttribute("aria-expanded", isExpanded === "false" ? "true" : "false");
	}

	const dropdownElements = document.querySelectorAll(".cs-dropdown");
	dropdownElements.forEach((element) => {
		// This variable tracks if the Escape key was pressed. This flag will be checked in the focusout event handler to ensure that pressing the Escape key does not trigger the focusout event and subsequently remove the cs-active class from the dropdown
		let escapePressed = false;

		element.addEventListener("focusout", (event) => {
			if (escapePressed) {
				escapePressed = false;
				return; // Skip the focusout logic if escape was pressed
			}
			if (!element.contains(event.relatedTarget)) {
				element.classList.remove("cs-active");
				const dropdownButton = element.querySelector(".cs-dropdown-button");
				if (dropdownButton) {
					ariaExpanded(dropdownButton);
				}
			}
		});

		element.addEventListener("keydown", (event) => {
			const dropdownButton = element.querySelector(".cs-dropdown-button");
			// If the dropdown is active, stop the event from propagating. This is so we can use Escape to close the dropdown, then press it again to close the hamburger menu (if needed)
			if (element.classList.contains("cs-active")) {
				event.stopPropagation();
			}

			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();

				element.classList.toggle("cs-active");
				if (dropdownButton) {
					ariaExpanded(dropdownButton);
				}
			}

			// Pressing Escape will remove the active class from the dropdown. The stopPropagation above will stop the hamburger menu from closing
			if (event.key === "Escape" && element.classList.contains("cs-active")) {
				escapePressed = true;
				element.classList.remove("cs-active");
				if (dropdownButton) {
					ariaExpanded(dropdownButton);
				}
			}
		});

		// Handles dropdown menus on mobile - the matching media query (max-width: 63.9375rem) is necessary so that clicking the dropdown button on desktop does not add the active class and thus interfere with the hover state
		const maxWidthMediaQuery = window.matchMedia("(max-width: 63.9375rem)");
		if (maxWidthMediaQuery.matches) {
			element.addEventListener("click", () => {
				element.classList.toggle("cs-active");
				const dropdownButton = element.querySelector(".cs-dropdown-button");
				if (dropdownButton) {
					ariaExpanded(dropdownButton);
				}
			});

			document.addEventListener("keydown", (event) => {
				if (event.key === "Escape" && mobileMenuToggle.classList.contains("cs-active")) {
					toggleMenu();
				}
			});
		}
	});

	const dropdownLinks = document.querySelectorAll(".cs-drop-li > .cs-li-link");
	dropdownLinks.forEach((link) => {
		link.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				window.location.href = this.href;
			}
		});
	});
});
