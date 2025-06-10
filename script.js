// Variables globales
let isScrolled = false

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeScrollEffects()
  initializeParticles()
  initializeForms()
  initializeAnimations()
  initializeVideoBackground()
})

// Inicializar video de fondo
function initializeVideoBackground() {
  const video = document.querySelector(".hero-video")

  if (video) {
    // Manejar errores de carga del video
    video.addEventListener("error", () => {
      console.log("Error cargando video, mostrando imagen de respaldo")
      video.style.display = "none"
      // Si hay un poster, se mostrará automáticamente
    })

    // Asegurar que el video se reproduzca automáticamente
    video.addEventListener("loadeddata", () => {
      video.play().catch((error) => {
        console.log("Error reproduciendo video automáticamente:", error)
      })
    })

    // Optimización para dispositivos móviles
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

  // Toggle del menú móvil
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

  // Cerrar menú al hacer click en un link
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

  // Scroll del header
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

// Efectos de scroll
function initializeScrollEffects() {
  // Smooth scroll para los links de navegación
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

  // Intersection Observer para animaciones
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up")
      }
    })
  }, observerOptions)

  // Observar elementos para animaciones
  document
    .querySelectorAll(".service-card, .contact-item, .about-text, .signature-text, .services-about-text")
    .forEach((el) => {
      observer.observe(el)
    })
}

// Sistema de partículas
function initializeParticles() {
  const particlesContainer = document.getElementById("particles")
  if (!particlesContainer) return

  const colors = ["rgb(180, 215, 216)", "rgb(224, 215, 207)", "rgb(171, 144, 114)"]

  // Crear partículas
  for (let i = 0; i < 20; i++) {
    createParticle(particlesContainer, colors)
  }
}

function createParticle(container, colors) {
  const particle = document.createElement("div")
  particle.className = "particle"

  // Posición aleatoria
  particle.style.left = Math.random() * 100 + "%"
  particle.style.top = Math.random() * 100 + "%"

  // Color aleatorio
  particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]

  // Animación aleatoria
  particle.style.animationDelay = Math.random() * 8 + "s"
  particle.style.animationDuration = Math.random() * 10 + 8 + "s"

  container.appendChild(particle)
}

// Formularios
function initializeForms() {
  const contactForm = document.getElementById("contactForm")

  // Formulario de contacto
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

  // Validación básica
  if (!validateContactForm(data)) {
    return
  }

  // Simular envío
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

  // Validar email
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

  // Guardar texto original para restaurar después
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
  // Crear elemento de notificación
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

  // Estilos de la notificación
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
            ? "background: linear-gradient(135deg, rgb(80, 140, 146), rgb(180, 215, 216)); color: white;"
            : "background: linear-gradient(135deg, #ef4444, #f87171); color: white;"
        }
    `

  // Estilos del contenido
  const content = notification.querySelector(".notification-content")
  content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
    `

  // Estilos del botón cerrar
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

  // Agregar al DOM
  document.body.appendChild(notification)

  // Animar entrada
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Evento para cerrar
  closeBtn.addEventListener("click", () => {
    closeNotification(notification)
  })

  // Auto cerrar después de 5 segundos
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
  // Animación de hover para las tarjetas de servicio
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })

  // Animación de los iconos del hero
  document.querySelectorAll(".logo-icon, .hero-icon").forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      this.style.transform = "rotate(360deg) scale(1.1)"
    })

    icon.addEventListener("mouseleave", function () {
      this.style.transform = "rotate(0deg) scale(1)"
    })
  })

  // Efecto parallax suave en el hero
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroVideo = document.querySelector(".hero-video")

    if (heroVideo && scrolled < window.innerHeight) {
      heroVideo.style.transform = `translateY(${scrolled * 0.5}px)`
    }
  })
}

// Utilidades adicionales
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

// Optimización del scroll
const optimizedScroll = debounce(() => {
  // Aquí puedes agregar lógica adicional de scroll optimizada
}, 16)

window.addEventListener("scroll", optimizedScroll)

// Manejo de errores globales
window.addEventListener("error", (e) => {
  console.error("Error en la aplicación:", e.error)
})

// Mejorar accesibilidad
document.addEventListener("keydown", (e) => {
  // Escape para cerrar menú móvil
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

console.log("🚀 Aquaservi - Sitio web cargado correctamente")
