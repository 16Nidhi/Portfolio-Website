/* ========================================================
   PORTFOLIO – script.js
   Smooth animations, theme toggle, form validation, etc.
   ======================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================
     1. NAVBAR – Scroll Effect & Active-Link Highlighting
     ========================================================== */
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section, .hero");

  /** Add "scrolled" class to navbar after scrolling past 50 px */
  const handleNavbarScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  };

  /** Highlight the nav link that corresponds to the visible section */
  const highlightActiveLink = () => {
    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  };

  window.addEventListener("scroll", () => {
    handleNavbarScroll();
    highlightActiveLink();
    handleScrollTopVisibility();
  });

  /* ==========================================================
     2. MOBILE MENU (Hamburger)
     ========================================================== */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close the mobile menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  /* ==========================================================
     3. DARK / LIGHT THEME TOGGLE
     ========================================================== */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const root = document.documentElement;

  // Restore saved theme (default: dark)
  const savedTheme = localStorage.getItem("theme") || "dark";
  root.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  /* Contrast control (normal, soft, high) */
  const contrastToggle = document.getElementById("contrastToggle");
  const contrastIcon = document.getElementById("contrastIcon");
  const savedContrast = localStorage.getItem("contrast") || "normal";
  root.setAttribute("data-contrast", savedContrast);
  updateContrastIcon(savedContrast);

  contrastToggle.addEventListener("click", () => {
    const modes = ["normal", "soft", "high"];
    const current = root.getAttribute("data-contrast") || "normal";
    const next = modes[(modes.indexOf(current) + 1) % modes.length];
    root.setAttribute("data-contrast", next);
    localStorage.setItem("contrast", next);
    updateContrastIcon(next);
    contrastToggle.setAttribute("title", `Contrast: ${next.charAt(0).toUpperCase() + next.slice(1)}`);
  });

  function updateContrastIcon(mode) {
    // Keep icon same but update tooltip and a subtle color indicator
    contrastIcon.className = "fas fa-adjust";
    contrastToggle.setAttribute("title", `Contrast: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`);
  }

  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeIcon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
  }

  /* ==========================================================
     4. SCROLL-TO-TOP BUTTON
     ========================================================== */
  const scrollTopBtn = document.getElementById("scrollTop");

  const handleScrollTopVisibility = () => {
    scrollTopBtn.classList.toggle("visible", window.scrollY > 500);
  };

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ==========================================================
     5. REVEAL-ON-SCROLL (Intersection Observer)
     ========================================================== */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ==========================================================
     6. ANIMATED SKILL BARS
     ========================================================== */
  const skillFills = document.querySelectorAll(".skill-fill");

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = fill.dataset.width + "%";
          skillObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillFills.forEach((bar) => skillObserver.observe(bar));

  /* ==========================================================
     6b. SKILL DOTS ANIMATION (5-dot indicators)
     ========================================================== */
  const skillDots = document.querySelectorAll('.skill-dots');

  const dotsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const level = parseInt(container.dataset.level || '0', 10);
        const dots = Array.from(container.querySelectorAll('.dot'));
        dots.forEach((dot, i) => {
          if (i < level) {
            setTimeout(() => dot.classList.add('filled'), i * 80);
          }
        });
        dotsObserver.unobserve(container);
      }
    });
  }, { threshold: 0.25 });

  skillDots.forEach(c => dotsObserver.observe(c));

  /* ==========================================================
     7. ANIMATED STAT COUNTERS (About section)
     ========================================================== */
  const statNumbers = document.querySelectorAll(".stat-number");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((num) => counterObserver.observe(num));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500; // ms
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    requestAnimationFrame(step);
  }

  /* ==========================================================
     8. CONTACT FORM VALIDATION
     ========================================================== */
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    // Reset errors
    clearErrors();

    // Name validation
    if (nameInput.value.trim().length < 2) {
      showError(nameInput, nameError, "Please enter your name (at least 2 characters).");
      valid = false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      showError(emailInput, emailError, "Please enter a valid email address.");
      valid = false;
    }

    // Message validation
    if (messageInput.value.trim().length < 10) {
      showError(messageInput, messageError, "Message must be at least 10 characters.");
      valid = false;
    }

    if (valid) {
      // Show success feedback (placeholder – replace with real submission logic)
      const btn = contactForm.querySelector("button[type='submit']");
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.8";

      // Reset form
      contactForm.reset();

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.pointerEvents = "";
        btn.style.opacity = "";
      }, 3000);
    }
  });

  function showError(input, errorEl, message) {
    input.classList.add("error");
    errorEl.textContent = message;
  }

  function clearErrors() {
    [nameInput, emailInput, messageInput].forEach((input) =>
      input.classList.remove("error")
    );
    [nameError, emailError, messageError].forEach(
      (el) => (el.textContent = "")
    );
  }

  // Clear individual field error on input
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("error");
      const errorEl = document.getElementById(input.id + "Error");
      if (errorEl) errorEl.textContent = "";
    });
  });

  /* ==========================================================
     9. SMOOTH SCROLL FOR ANCHOR LINKS (fallback)
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ==========================================================
     10. INITIAL CALLS
     ========================================================== */
  handleNavbarScroll();
  handleScrollTopVisibility();
});
