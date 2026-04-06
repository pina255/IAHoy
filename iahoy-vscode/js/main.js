/**
 * IA Hoy – main.js
 * ════════════════════════════════════════════
 * ÍNDICE:
 *  1. Menú hamburguesa (móvil)
 *  2. FAQ acordeón accesible
 *  3. Smooth scroll para anclas (#)
 *  4. Newsletter (validación básica)
 *  5. Header sombra al hacer scroll
 *  6. Ticker: pausa al pasar el ratón
 *  7. Barra de progreso de lectura (artículos)
 * ════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ══════════════════════════════════════════
     1. MENÚ HAMBURGUESA (MÓVIL)
     Cambia '#menuToggle' y '#mainNav' si
     cambias los IDs en el HTML.
     ══════════════════════════════════════════ */
  var menuToggle = document.getElementById('menuToggle');
  var mainNav    = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      var open = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);

      // Anima las tres líneas del botón
      var spans = menuToggle.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Cierra el menú al hacer clic en un enlace
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
      });
    });
  }


  /* ══════════════════════════════════════════
     2. FAQ ACORDEÓN ACCESIBLE
     El atributo aria-expanded está en el
     botón .faq-q de cada .faq-item.
     ══════════════════════════════════════════ */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var ans = item.querySelector('.faq-a');
    if (!btn || !ans) return;

    // Estado inicial: cerrado
    ans.style.maxHeight  = '0';
    ans.style.overflow   = 'hidden';
    ans.style.transition = 'max-height 0.35s ease, padding 0.35s ease';
    ans.style.paddingTop = '0';

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Cierra todos los demás (comportamiento "acordeón")
      // Comenta las siguientes 6 líneas si prefieres que se puedan
      // abrir varios a la vez de forma independiente.
      document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          var otherAns = other.nextElementSibling;
          if (otherAns) { otherAns.style.maxHeight = '0'; otherAns.style.paddingTop = '0'; }
        }
      });

      // Abre o cierra este
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        ans.style.maxHeight  = '0';
        ans.style.paddingTop = '0';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        ans.style.maxHeight  = ans.scrollHeight + 40 + 'px';
        ans.style.paddingTop = '0.5rem';
      }
    });
  });


  /* ══════════════════════════════════════════
     3. SMOOTH SCROLL PARA ANCLAS
     Funciona para todos los <a href="#...">
     ══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        var headerHeight = document.getElementById('header')
          ? document.getElementById('header').offsetHeight
          : 64;
        var top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ══════════════════════════════════════════
     4. NEWSLETTER – VALIDACIÓN BÁSICA
     Cambia el mensaje de éxito si quieres.
     Para integrar con Mailchimp/Brevo añade
     la acción del form y elimina el e.preventDefault.
     ══════════════════════════════════════════ */
  document.querySelectorAll('.nl-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Quita esta línea si usas un backend real

      var input = form.querySelector('input[type="email"]');
      var btn   = form.querySelector('button[type="submit"]');
      if (!input || !btn) return;

      var email = input.value.trim();
      if (!email || !email.includes('@')) {
        input.style.outline = '2px solid var(--accent)';
        setTimeout(function () { input.style.outline = ''; }, 1800);
        return;
      }

      // Éxito visual (reemplaza por llamada real a tu API)
      btn.textContent = '¡Suscrito! ✅';
      btn.disabled    = true;
      input.value     = '';
      input.disabled  = true;

      // Aquí llamarías a tu API de newsletter, por ejemplo:
      // fetch('/api/newsletter', { method:'POST', body: JSON.stringify({ email }) });
    });
  });


  /* ══════════════════════════════════════════
     5. HEADER – SOMBRA AL HACER SCROLL
     ══════════════════════════════════════════ */
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.35)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }


  /* ══════════════════════════════════════════
     6. TICKER – PAUSA AL PASAR EL RATÓN
     (El CSS también tiene :hover pause,
     esto es un refuerzo para touch devices)
     ══════════════════════════════════════════ */
  var ticker = document.getElementById('tickerTrack');
  if (ticker) {
    ticker.addEventListener('mouseenter', function () {
      ticker.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', function () {
      ticker.style.animationPlayState = 'running';
    });
  }


  /* ══════════════════════════════════════════
     7. BARRA DE PROGRESO DE LECTURA
     Solo aparece en páginas de artículo.
     Añade class="article-page" al <body>
     en tu página de artículo para activarla.
     ══════════════════════════════════════════ */
  if (document.body.classList.contains('article-page')) {
    var bar = document.createElement('div');
    bar.id  = 'reading-progress';
    Object.assign(bar.style, {
      position:   'fixed',
      top:        '64px',  // Altura del header
      left:       '0',
      width:      '0%',
      height:     '3px',
      background: 'var(--accent)',
      zIndex:     '200',
      transition: 'width 0.1s linear',
    });
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      var scrollTop  = window.scrollY;
      var docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      var pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }


  /* ══════════════════════════════════════════
     EXTRA: Añade 'loading="lazy"' a todas
     las imágenes que no lo tienen ya
     ══════════════════════════════════════════ */
  document.querySelectorAll('img:not([loading])').forEach(function (img) {
    img.setAttribute('loading', 'lazy');
  });

}); // fin DOMContentLoaded
