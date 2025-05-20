/**
 * Script principal - Versión mejorada
 * Implementa funcionalidades para la página web con mejor estructura y optimización
 */
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar componentes
  initializeAOS();
  setupMobileMenu();
  setupScrollEvents();
  setupCounterAnimations();
  setupTestimonialSlider();
  setupSmoothScrolling();
  setupContactForm();

  /**
   * Inicializa la biblioteca AOS (Animate On Scroll)
   */
  function initializeAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        disable: 'mobile' // Desactiva en dispositivos móviles para mejor rendimiento
      });
    } else {
      console.warn('La biblioteca AOS no está cargada');
    }
  }

  /**
   * Configura la funcionalidad del menú móvil
   */
  function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      // Accesibilidad: Actualiza el estado para lectores de pantalla
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);

      // En móviles, prevenimos scroll cuando el menú está abierto
      // esto funciona bien con la configuración de clip-path en tu CSS
      if (window.innerWidth <= 768) {
        document.body.style.overflow = isExpanded ? 'hidden' : '';
      }
    });

    // Cerrar menú al hacer clic fuera de él (para móviles)
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 &&
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * Configura los efectos basados en el scroll
   */
  function setupScrollEvents() {
    const header = document.querySelector('.header');
    const backToTop = document.querySelector('.back-to-top');

    if (!header && !backToTop) return;

    // Usar throttle para mejorar rendimiento
    let lastScrollPosition = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      lastScrollPosition = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScrollEffects(lastScrollPosition);
          ticking = false;
        });

        ticking = true;
      }
    });

    // Función para manejar los efectos de scroll
    function handleScrollEffects(scrollPosition) {
      // Header scroll effect
      if (header) {
        if (scrollPosition > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Back to top button
      if (backToTop) {
        if (scrollPosition > 300) {
          backToTop.classList.add('active');
        } else {
          backToTop.classList.remove('active');
        }
      }
    }

    // Evento para el botón "Back to Top"
    if (backToTop) {
      backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  /**
   * Configura las animaciones de los contadores estadísticos
   */
  function setupCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length === 0) return;

    // Usar IntersectionObserver para iniciar animaciones cuando sean visibles
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          animateCounter(entry.target);
          entry.target.dataset.animated = 'true'; // Marcar como animado
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    statNumbers.forEach(statNumber => {
      observer.observe(statNumber);
    });

    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-count') || el.textContent);
      el.setAttribute('data-count', target); // Asegurar que tenga atributo data-count
      const duration = 2000; // ms
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      // Usar requestAnimationFrame para animación más fluida
      function animate() {
        frame++;
        const progress = frame / totalFrames;
        const currentValue = Math.round(easingFunction(progress) * target);

        el.textContent = currentValue.toLocaleString();

        if (frame < totalFrames) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = target.toLocaleString(); // Asegurar valor final exacto
        }
      }

      requestAnimationFrame(animate);
    }

    // Función de aceleración para movimiento más natural
    function easingFunction(t) {
      return t < 0.5
        ? 4 * t * t * t
        : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
  }

  /**
   * Configura el slider de testimonios
   */
  function setupTestimonialSlider() {
    const slides = document.getElementsByClassName("testimonial-slide");
    const dots = document.getElementsByClassName("dot");

    if (slides.length === 0) return;

    let slideIndex = 1;
    let slideInterval;

    // Función para mostrar una diapositiva específica
    function showSlide(n) {
      // Restablece el índice si está fuera de rango
      if (n > slides.length) slideIndex = 1;
      if (n < 1) slideIndex = slides.length;

      // Oculta todas las diapositivas y desactiva todos los indicadores
      for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
      }

      for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
      }

      // Muestra la diapositiva actual y activa el indicador correspondiente
      slides[slideIndex - 1].classList.add("active");
      if (dots.length > 0) {
        dots[slideIndex - 1].classList.add("active");
      }
    }

    // Función para avanzar a la siguiente diapositiva
    function nextSlide() {
      slideIndex++;
      showSlide(slideIndex);
    }

    // Función para retroceder a la diapositiva anterior
    function prevSlide() {
      slideIndex--;
      showSlide(slideIndex);
    }

    // Configurar los botones de navegación si existen
    const nextButton = document.querySelector('.testimonial-next');
    const prevButton = document.querySelector('.testimonial-prev');

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        resetInterval();
        nextSlide();
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        resetInterval();
        prevSlide();
      });
    }

    // Configurar indicadores de puntos
    for (let i = 0; i < dots.length; i++) {
      dots[i].addEventListener('click', function() {
        resetInterval();
        showSlide(slideIndex = i + 1);
      });
    }

    // Configurar cambio automático de diapositivas
    function startSlideInterval() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function resetInterval() {
      clearInterval(slideInterval);
      startSlideInterval();
    }

    // Detener rotación cuando el usuario interactúa con los testimonios
    const testimonialContainer = document.querySelector('.testimonials-container');
    if (testimonialContainer) {
      testimonialContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
      });

      testimonialContainer.addEventListener('mouseleave', () => {
        startSlideInterval();
      });
    }

    // Soporte para gestos táctiles (swipe)
    if (testimonialContainer) {
      let touchStartX = 0;
      let touchEndX = 0;

      testimonialContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, false);

      testimonialContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, false);

      function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
          // Swipe izquierdo - siguiente diapositiva
          resetInterval();
          nextSlide();
        } else if (touchEndX > touchStartX + 50) {
          // Swipe derecho - diapositiva anterior
          resetInterval();
          prevSlide();
        }
      }
    }

    // Iniciar tod
    showSlide(slideIndex);
    startSlideInterval();

    // Exponer funciones al ámbito global (si es necesario)
    window.currentSlide = function(n) {
      resetInterval();
      showSlide(slideIndex = n);
    };
  }

  /**
   * Configura el desplazamiento suave para enlaces internos
   */
  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        // Ignorar si es solo un "#"
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();

          // Cerrar el menú móvil si está abierto
          const navMenu = document.querySelector('.nav-menu');
          const mobileToggle = document.querySelector('.mobile-toggle');
          if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          }

          // Calcular desplazamiento teniendo en cuenta header fijo
          const headerOffset = document.querySelector('.header')?.offsetHeight || 0;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Configura la validación y envío del formulario de contacto
   */
  function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Validar el formulario antes de enviar
      if (!validateForm(this)) return;

      // Obtener valores del formulario
      const formData = new FormData(contactForm);
      const formValues = Object.fromEntries(formData.entries());

      // Mostrar indicador de carga
      const submitButton = contactForm.querySelector('[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';

      // Simular envío de formulario (reemplazar con código real de envío)
      setTimeout(() => {
        // Aquí iría el código para enviar datos al servidor
        // Por ejemplo: fetch('/api/contact', {method: 'POST', body: formData})

        // Mostrar mensaje de éxito
        showFormMessage('success', `¡Gracias ${formValues.nombre} por contactarnos! Responderemos a tu mensaje lo antes posible.`);

        // Restablecer el formulario
        contactForm.reset();

        // Restaurar botón
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }, 1000);
    });

    // Validación de formulario
    function validateForm(form) {
      let isValid = true;
      const inputs = form.querySelectorAll('input, textarea');

      // Eliminar mensajes de error previos
      form.querySelectorAll('.error-message').forEach(el => el.remove());

      inputs.forEach(input => {
        input.classList.remove('input-error');

        // Validar campos requeridos
        if (input.hasAttribute('required') && !input.value.trim()) {
          showInputError(input, 'Este campo es obligatorio');
          isValid = false;
          return;
        }

        // Validar email
        if (input.type === 'email' && input.value) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value)) {
            showInputError(input, 'Por favor, introduce un email válido');
            isValid = false;
          }
        }
      });

      return isValid;
    }

    // Mostrar mensaje de error para un campo específico
    function showInputError(input, message) {
      input.classList.add('input-error');
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      input.parentNode.appendChild(errorElement);

      // Enfocar el primer campo con error
      if (document.querySelectorAll('.input-error').length === 1) {
        input.focus();
      }
    }

    // Mostrar mensaje general del formulario (éxito/error)
    function showFormMessage(type, message) {
      // Eliminar mensajes anteriores
      contactForm.querySelectorAll('.form-message').forEach(el => el.remove());

      const messageElement = document.createElement('div');
      messageElement.className = `form-message ${type}-message`;
      messageElement.textContent = message;

      // Insertar después del último campo o antes del botón
      const submitButton = contactForm.querySelector('[type="submit"]');
      contactForm.insertBefore(messageElement, submitButton.parentNode);

      // Desplazarse al mensaje
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Eliminar automáticamente después de unos segundos para mensajes de éxito
      if (type === 'success') {
        setTimeout(() => {
          messageElement.remove();
        }, 5000);
      }
    }
  }
});// Toggle del tema oscuro
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.querySelector('.theme-toggle');
  const icon = themeToggle.querySelector('i');

  // Comprobar preferencias del sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const localStorageTheme = localStorage.getItem('theme');

  // Aplicar tema inicial
  if (localStorageTheme === 'dark' || (!localStorageTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    icon.classList.replace('fa-moon', 'fa-sun');
  }

  // Escuchar clicks en el botón
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      icon.classList.replace('fa-sun', 'fa-moon');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      icon.classList.replace('fa-moon', 'fa-sun');
    }
  });

  // Opcional: Escuchar cambios en las preferencias del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
      } else {
        document.documentElement.removeAttribute('data-theme');
        icon.classList.replace('fa-sun', 'fa-moon');
      }
    }
  });
});
/**
 * Funcionalidad mejorada para el cambio de tema
 * Se ejecuta inmediatamente para evitar parpadeos
 */
(function() {
  // Comprobar preferencias almacenadas o preferencias del sistema
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme');

  // Aplicar tema en cuanto se cargue el script
  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
})();

// Cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.querySelector('.theme-toggle');

  if (!themeToggle) return;

  const icon = themeToggle.querySelector('i');

  // Asegurarse de que el icono coincida con el tema actual
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    icon.classList.replace('fa-moon', 'fa-sun');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
  }

  // Manejar el cambio de tema con animación
  themeToggle.addEventListener('click', function() {
    // Añadir clase para animar la transición
    document.body.classList.add('theme-transitioning');

    const currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
      // Cambiar a tema claro
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      icon.classList.add('fa-rotate');

      setTimeout(() => {
        icon.classList.replace('fa-sun', 'fa-moon');
        icon.classList.remove('fa-rotate');
      }, 200);

    } else {
      // Cambiar a tema oscuro
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      icon.classList.add('fa-rotate');

      setTimeout(() => {
        icon.classList.replace('fa-moon', 'fa-sun');
        icon.classList.remove('fa-rotate');
      }, 200);
    }

    // Quitar la clase de transición
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 500);
  });

  // Responder a cambios en las preferencias del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    // Solo cambiar automáticamente si el usuario no ha establecido una preferencia
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
      } else {
        document.documentElement.removeAttribute('data-theme');
        if (icon) icon.classList.replace('fa-sun', 'fa-moon');
      }
    }
  });

  // Añadir un tooltip al botón de tema
  themeToggle.setAttribute('title', 'Cambiar a modo ' +
      (document.documentElement.getAttribute('data-theme') === 'dark' ? 'claro' : 'oscuro'));

  themeToggle.addEventListener('mouseenter', function() {
    this.setAttribute('title', 'Cambiar a modo ' +
        (document.documentElement.getAttribute('data-theme') === 'dark' ? 'claro' : 'oscuro'));
  });
});
