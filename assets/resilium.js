(function () {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav-links, .navlinks");

  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      menu.classList.toggle("open", !isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  document.querySelectorAll("form[data-mailto-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const rows = [];
      form.querySelectorAll("input, select, textarea").forEach((field) => {
        if (!field.value || field.type === "submit" || field.type === "button") return;

        const label = field.id
          ? form.querySelector(`label[for="${field.id}"]`)
          : null;
        rows.push(`${label ? label.textContent.trim() : field.name || "Údaj"}: ${field.value}`);
      });

      const subject = form.dataset.subject || "Poptávka z webu Resilium";
      const href = `mailto:info@allprosys.cz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(rows.join("\n\n"))}`;
      window.location.href = href;
    });
  });

  const stickyCta = document.querySelector(".mobile-cta");
  const hero = document.querySelector(".hero");

  if (stickyCta && hero) {
    const stickyTargetHash = new URL(stickyCta.href, window.location.href).hash;
    const stickyTarget = stickyTargetHash
      ? document.querySelector(stickyTargetHash)
      : null;

    const updateStickyCta = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const targetRect = stickyTarget?.getBoundingClientRect();
      const targetIsVisible = Boolean(
        targetRect &&
        targetRect.top < window.innerHeight &&
        targetRect.bottom > 0
      );
      const isAtStickyTarget = Boolean(
        stickyTargetHash && window.location.hash === stickyTargetHash
      );
      stickyCta.classList.toggle(
        "visible",
        heroBottom < 80 && !targetIsVisible && !isAtStickyTarget
      );
    };

    updateStickyCta();
    window.addEventListener("scroll", updateStickyCta, { passive: true });
    window.addEventListener("load", updateStickyCta);
    window.addEventListener("hashchange", updateStickyCta);

    if (stickyTarget && "IntersectionObserver" in window) {
      const targetObserver = new IntersectionObserver(updateStickyCta, {
        threshold: 0
      });
      targetObserver.observe(stickyTarget);
    }
  }
})();
