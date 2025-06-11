// Variables globales
let isScrolled = false
let currentSlide = 0
let currentReview = 0

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeScrollEffects()
  initializeParticles()
  initializeForms()
  initializeAnimations()
  initializeVideoBackground()
  initializeCarousels()
  initializeCatalogFilters()
  initializeFadeInUp()
  initializeLogoIconHover()
  initializeSocialLinksHover()
})

// Inicializar video de fondo
function initializeVideoBackground() {
  const video = document.querySelector(".hero-video")

  if (video) {
    video.addEventListener("error", () => {
      console.log("Error cargando video, mostrando imagen de respaldo")
      video.style.display = "none"
    })

    video.addEventListener("loadeddata", () => {
      video.play().catch((error) => {
        console.log("Error reproduciendo video automáticamente:", error)
      })
    })

    if (window.innerWidth <= 768) {
      video.setAttribute("poster", "Imagenes/yate.png")
    }
  }
}

// Navegación
function initializeNavigation() {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")
  const header = document.getElementById("header")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      const icon = navToggle.querySelector("i")

      if (navMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) {
        navMenu.classList.remove("active")
        const icon = navToggle?.querySelector("i")
        if (icon) {
          icon.classList.remove("fa-times")
          icon.classList.add("fa-bars")
        }
      }
    })
  })

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50 && !isScrolled) {
      header?.classList.add("scrolled")
      isScrolled = true
    } else if (window.scrollY <= 50 && isScrolled) {
      header?.classList.remove("scrolled")
      isScrolled = false
    }
  })
}

// Carruseles
function initializeCarousels() {
  // Carrusel de productos
  const productCarousel = document.getElementById("productCarousel")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const indicators = document.querySelectorAll(".indicator")
  const slides = document.querySelectorAll(".carousel-slide")

  if (productCarousel && slides.length > 0) {
    // Asegurar que el primer slide esté activo al iniciar
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === 0)
    })
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === 0)
    })
    currentSlide = 0

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index)
      })
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle("active", i === index)
      })
      currentSlide = index
    }

    function nextSlide() {
      const next = (currentSlide + 1) % slides.length
      showSlide(next)
    }

    function prevSlide() {
      const prev = (currentSlide - 1 + slides.length) % slides.length
      showSlide(prev)
    }

    if (nextBtn) nextBtn.addEventListener("click", nextSlide)
    if (prevBtn) prevBtn.addEventListener("click", prevSlide)

    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => showSlide(index))
    })

    // Auto-play
    setInterval(nextSlide, 5000)
  }

  // Carrusel de reseñas
  const reviewSlides = document.querySelectorAll(".review-slide")
  const reviewIndicators = document.querySelectorAll(".review-indicators .indicator")

  if (reviewSlides.length > 0) {
    function showReview(index) {
      reviewSlides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index)
      })
      reviewIndicators.forEach((indicator, i) => {
        indicator.classList.toggle("active", i === index)
      })
      currentReview = index
    }

    function nextReview() {
      const next = (currentReview + 1) % reviewSlides.length
      showReview(next)
    }

    reviewIndicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => showReview(index))
    })

    // Auto-play reseñas
    setInterval(nextReview, 4000)
  }
}

// Filtros del catálogo
function initializeCatalogFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn")
  const catalogItems = document.querySelectorAll(".catalog-item")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter")

      // Actualizar botones activos
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Filtrar elementos
      catalogItems.forEach((item) => {
        const category = item.getAttribute("data-category")
        if (filter === "all" || category === filter) {
          item.style.display = "block"
          item.style.animation = "fadeIn 0.5s ease-in-out"
        } else {
          item.style.display = "none"
        }
      })
    })
  })

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');
      document.querySelectorAll('.catalog-item').forEach(item => {
        if (filter === 'all' || item.getAttribute('data-linea') === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Efectos de scroll
function initializeScrollEffects() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const headerHeight = document.getElementById("header")?.offsetHeight || 0
        const targetPosition = target.offsetTop - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

// --- Animación de fade-in-up para elementos al entrar en viewport ---
function initializeFadeInUp() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
      }
    });
  }, observerOptions);

  document.querySelectorAll(
    ".service-card, .catalog-item, .team-member, .review-card"
  ).forEach((el) => {
    observer.observe(el);
  });
}

// --- Animación de hover para .logo-icon y .hero-icon ---
function initializeLogoIconHover() {
  document.querySelectorAll(".logo-icon, .hero-icon").forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1) rotate(10deg)";
    });
    icon.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });
}

// --- Social links hover efecto (opcional, si usas .social-link) ---
function initializeSocialLinksHover() {
  document.querySelectorAll(".social-link").forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.background = "var(--teal-primary)";
      this.style.borderColor = "var(--teal-primary)";
      this.style.transform = "scale(1.1)";
    });
    link.addEventListener("mouseleave", function () {
      this.style.background = "";
      this.style.borderColor = "";
      this.style.transform = "";
    });
  });
}

// Sistema de partículas
function initializeParticles() {
  const particlesContainer = document.getElementById("particles")
  if (!particlesContainer) return

  const colors = ["#fbbf24", "#dc2626", "#1e40af"]

  for (let i = 0; i < 15; i++) {
    createParticle(particlesContainer, colors)
  }
}

function createParticle(container, colors) {
  const particle = document.createElement("div")
  particle.className = "particle"

  particle.style.left = Math.random() * 100 + "%"
  particle.style.top = Math.random() * 100 + "%"
  particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
  particle.style.animationDelay = Math.random() * 8 + "s"
  particle.style.animationDuration = Math.random() * 10 + 8 + "s"

  container.appendChild(particle)
}

// Formularios
function initializeForms() {
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()
      handleContactSubmit(this)
    })
  }
}

function handleContactSubmit(form) {
  const formData = new FormData(form)
  const data = Object.fromEntries(formData)

  if (!validateContactForm(data)) {
    return
  }

  showLoadingState(form)

  setTimeout(() => {
    hideLoadingState(form)
    showSuccessMessage("¡Mensaje enviado! Te responderemos en las próximas 24 horas.")
    form.reset()
  }, 2000)
}

function validateContactForm(data) {
  const required = ["contactName", "contactEmail", "contactPhone", "contactService", "contactMessage"]

  for (const field of required) {
    if (!data[field] || data[field].trim() === "") {
      showErrorMessage(`Por favor completa el campo: ${getFieldLabel(field)}`)
      return false
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.contactEmail)) {
    showErrorMessage("Por favor ingresa un email válido")
    return false
  }

  return true
}

function getFieldLabel(field) {
  const labels = {
    contactName: "Nombre",
    contactEmail: "Email",
    contactPhone: "Teléfono",
    contactService: "Servicio",
    contactMessage: "Mensaje",
  }
  return labels[field] || field
}

function showLoadingState(form) {
  const submitBtn = form.querySelector('button[type="submit"]')
  if (!submitBtn) return

  const originalText = submitBtn.innerHTML
  submitBtn.disabled = true
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'
  submitBtn.style.opacity = "0.7"
  submitBtn.dataset.originalText = originalText
}

function hideLoadingState(form) {
  const submitBtn = form.querySelector('button[type="submit"]')
  if (!submitBtn) return

  submitBtn.disabled = false
  submitBtn.innerHTML = submitBtn.dataset.originalText || '<i class="fas fa-paper-plane"></i> Enviar Mensaje'
  submitBtn.style.opacity = "1"
}

function showSuccessMessage(message) {
  showNotification(message, "success")
}

function showErrorMessage(message) {
  showNotification(message, "error")
}

function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
      <span>${message}</span>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    max-width: 400px;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    ${
      type === "success"
        ? "background: linear-gradient(135deg, #dc2626, #b91c1c); color: white;"
        : "background: linear-gradient(135deg, #ef4444, #f87171); color: white;"
    }
  `

  const content = notification.querySelector(".notification-content")
  content.style.cssText = `
    display: flex;
    align-items: center;
    gap: 1rem;
  `

  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background 0.3s ease;
    margin-left: auto;
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  closeBtn.addEventListener("click", () => {
    closeNotification(notification)
  })

  setTimeout(() => {
    if (document.body.contains(notification)) {
      closeNotification(notification)
    }
  }, 5000)
}

function closeNotification(notification) {
  notification.style.transform = "translateX(100%)"
  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification)
    }
  }, 300)
}

// Animaciones adicionales
function initializeAnimations() {
  document.querySelectorAll(".service-card, .catalog-item, .team-member").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })

  document.querySelectorAll(".logo-img, .hero-logo-img").forEach((logo) => {
    logo.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1) rotate(5deg)"
    })

    logo.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) rotate(0deg)"
    })
  })

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroVideo = document.querySelector(".hero-video")

    if (heroVideo && scrolled < window.innerHeight) {
      heroVideo.style.transform = `translateY(${scrolled * 0.3}px)`
    }
  })
}

// Utilidades
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const optimizedScroll = debounce(() => {
  // Lógica adicional de scroll optimizada
}, 16)

window.addEventListener("scroll", optimizedScroll)

// Manejo de errores globales
window.addEventListener("error", (e) => {
  console.error("Error en la aplicación:", e.error)
})

// Accesibilidad
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const navMenu = document.getElementById("nav-menu")
    const navToggle = document.getElementById("nav-toggle")

    if (navMenu?.classList.contains("active")) {
      navMenu.classList.remove("active")
      const icon = navToggle?.querySelector("i")
      if (icon) {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    }
  }
})

console.log("🚀 Aquaservi - Sitio web renovado cargado correctamente")
