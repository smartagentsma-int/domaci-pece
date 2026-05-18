/* ============================================ */
/* DOMÁCÍ PÉČE HOLÚBKOV - 3D WEBSITE JS        */
/* Three.js + GSAP + Lenis + Interactions      */
/* ============================================ */

// ============================================
// 1. GLOBAL STATE & CONFIG
// ============================================
const CONFIG = {
  particles: {
    count: isMobile() ? 300 : 800,
    size: 0.5,
    color1: 0x2563eb,
    color2: 0x10b981,
    color3: 0xffffff,
    speed: 0.0003,
    mouseInfluence: 0.5
  },
  shapes: {
    count: 5,
    size: 1.5,
    speed: 0.001
  },
  camera: {
    fov: 75,
    near: 0.1,
    far: 1000,
    z: 30
  },
  scroll: {
    smooth: true,
    duration: 1.2
  }
};

let scene, camera, renderer, composer;
let particles, particleSystem;
let shapes = [];
let mouse = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };
let scrollY = 0;
let lenis;
let isWebGLSupported = true;

// ============================================
// 2. DETECTION UTILITIES
// ============================================
function isMobile() {
  return window.innerWidth < 768 || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================
// 3. THREE.JS SCENE INITIALIZATION
// ============================================
function initThreeJS() {
  if (prefersReducedMotion()) {
    document.getElementById('webgl-canvas').style.display = 'none';
    return;
  }

  const canvas = document.getElementById('webgl-canvas');

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xf8fafc, 0.015);

  // Camera
  camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    window.innerWidth / window.innerHeight,
    CONFIG.camera.near,
    CONFIG.camera.far
  );
  camera.position.z = CONFIG.camera.z;

  // Renderer
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xf8fafc, 0);
  } catch (e) {
    console.warn('WebGL not supported, falling back to CSS background');
    isWebGLSupported = false;
    canvas.style.display = 'none';
    return;
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xe0f2fe, 1.0);
  directionalLight.position.set(10, 10, 5);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x2563eb, 0.8, 50);
  pointLight.position.set(0, 0, 10);
  scene.add(pointLight);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x1e3a5f, 0.5);
  scene.add(hemisphereLight);

  // Initialize effects
  initParticles();
  initShapes();

  // Start animation loop
  animate();
}

// ============================================
// 4. PARTICLE SYSTEM (Medical Atmosphere)
// ============================================
function initParticles() {
  const particleCount = CONFIG.particles.count;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const velocities = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color(CONFIG.particles.color1);
  const color2 = new THREE.Color(CONFIG.particles.color2);
  const color3 = new THREE.Color(CONFIG.particles.color3);

  for (let i = 0; i < particleCount; i++) {
    // Position
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

    // Color (gradient mix)
    const mixRatio = Math.random();
    let finalColor;
    if (mixRatio < 0.33) {
      finalColor = color1.clone().lerp(color2, Math.random());
    } else if (mixRatio < 0.66) {
      finalColor = color2.clone().lerp(color3, Math.random());
    } else {
      finalColor = color3.clone().lerp(color1, Math.random());
    }
    colors[i * 3] = finalColor.r;
    colors[i * 3 + 1] = finalColor.g;
    colors[i * 3 + 2] = finalColor.b;

    // Size
    sizes[i] = Math.random() * 2 + 0.5;

    // Velocity (gentle drift)
    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Custom shader material for glowing particles
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pixelRatio: { value: renderer.getPixelRatio() }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float time;

      void main() {
        vColor = color;
        vec3 pos = position;

        // Gentle floating motion
        pos.y += sin(time * 0.5 + position.x * 0.1) * 0.5;
        pos.x += cos(time * 0.3 + position.y * 0.1) * 0.3;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z) * pixelRatio;
        gl_Position = projectionMatrix * mvPosition;

        // Fade based on depth
        vAlpha = smoothstep(50.0, 10.0, -mvPosition.z);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // Circular particle with soft edge
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
        alpha *= vAlpha;

        // Glow center
        float glow = 1.0 - smoothstep(0.0, 0.3, dist);
        vec3 finalColor = vColor + vColor * glow * 0.5;

        gl_FragColor = vec4(finalColor, alpha * 0.8);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  particleSystem = new THREE.Points(geometry, material);
  particleSystem.userData = { velocities: velocities };
  scene.add(particleSystem);
}

// ============================================
// 5. 3D FLOATING SHAPES (Care Symbols)
// ============================================
function initShapes() {
  const shapeConfigs = [
    { type: 'icosahedron', color: 0x2563eb, position: [-15, 5, -10] },
    { type: 'torus', color: 0x10b981, position: [15, -5, -15] },
    { type: 'octahedron', color: 0x3b82f6, position: [-10, -8, -5] },
    { type: 'sphere', color: 0x34d399, position: [12, 8, -8] },
    { type: 'torusKnot', color: 0x60a5fa, position: [0, 12, -12] }
  ];

  shapeConfigs.forEach((config, index) => {
    let geometry;
    switch (config.type) {
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(1.5, 0);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(1.2, 0.4, 16, 100);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(1.5, 0);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(1.2, 32, 32);
        break;
      case 'torusKnot':
        geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        break;
    }

    const material = new THREE.MeshPhongMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...config.position);
    mesh.userData = {
      originalPosition: [...config.position],
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.003
      },
      floatSpeed: Math.random() * 0.001 + 0.0005,
      floatOffset: Math.random() * Math.PI * 2,
      index: index
    };

    scene.add(mesh);
    shapes.push(mesh);
  });
}

// ============================================
// 6. ANIMATION LOOP
// ============================================
function animate() {
  if (!isWebGLSupported) return;
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Update particles
  if (particleSystem) {
    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.userData.velocities;
    const material = particleSystem.material;

    material.uniforms.time.value = time;

    for (let i = 0; i < CONFIG.particles.count; i++) {
      // Apply velocity
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // Mouse influence (parallax)
      const mouseInfluenceX = (targetMouse.x - mouse.x) * 0.001;
      const mouseInfluenceY = (targetMouse.y - mouse.y) * 0.001;
      positions[i * 3] += mouseInfluenceX * (i % 5 === 0 ? 1 : 0.1);
      positions[i * 3 + 1] -= mouseInfluenceY * (i % 5 === 0 ? 1 : 0.1);

      // Boundary wrap
      if (positions[i * 3] > 30) positions[i * 3] = -30;
      if (positions[i * 3] < -30) positions[i * 3] = 30;
      if (positions[i * 3 + 1] > 20) positions[i * 3 + 1] = -20;
      if (positions[i * 3 + 1] < -20) positions[i * 3 + 1] = 20;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  // Update shapes
  shapes.forEach(shape => {
    const data = shape.userData;

    // Rotation
    shape.rotation.x += data.rotationSpeed.x;
    shape.rotation.y += data.rotationSpeed.y;
    shape.rotation.z += data.rotationSpeed.z;

    // Floating motion
    shape.position.y = data.originalPosition[1] + 
      Math.sin(time * data.floatSpeed + data.floatOffset) * 2;
    shape.position.x = data.originalPosition[0] + 
      Math.cos(time * data.floatSpeed * 0.7 + data.floatOffset) * 1;
  });

  // Smooth mouse interpolation
  mouse.x += (targetMouse.x - mouse.x) * 0.05;
  mouse.y += (targetMouse.y - mouse.y) * 0.05;

  // Camera subtle movement based on mouse
  camera.position.x = Math.sin(mouse.x * 0.001) * 2;
  camera.position.y = Math.cos(mouse.y * 0.001) * 2;
  camera.lookAt(0, 0, 0);

  // Scroll-based camera zoom
  const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight);
  camera.position.z = CONFIG.camera.z - scrollProgress * 10;

  renderer.render(scene, camera);
}

// ============================================
// 7. EVENT LISTENERS (Three.js)
// ============================================
function initThreeEvents() {
  if (!isWebGLSupported) return;

  // Mouse move
  document.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX - window.innerWidth / 2) * 2;
    targetMouse.y = (e.clientY - window.innerHeight / 2) * 2;
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (particleSystem) {
      particleSystem.material.uniforms.pixelRatio.value = renderer.getPixelRatio();
    }
  });
}

// ============================================
// 8. LENIS SMOOTH SCROLL
// ============================================
function initLenis() {
  if (prefersReducedMotion()) {
    // Fallback to native smooth scroll
    document.documentElement.style.scrollBehavior = 'smooth';
    return;
  }

  lenis = new Lenis({
    duration: CONFIG.scroll.duration,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync scroll position for Three.js
  lenis.on('scroll', (e) => {
    scrollY = e.scroll;
  });
}

// ============================================
// 9. GSAP ANIMATIONS
// ============================================
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance timeline
  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .from('.hero-badge', { y: 30, opacity: 0, duration: 0.8, ease: 'power4.out' })
    .from('.hero-title', { y: 50, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.5')
    .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero-address', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5')
    .from('.hero-description', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
    .from('.hero-cta-group', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .from('.hero-stats', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .from('.hero-image-wrapper', { scale: 0.9, opacity: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' }, '-=1');

  // Counter animation for stats
  const counters = document.querySelectorAll('.hero-stat-number[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    gsap.to(counter, {
      innerText: target,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: counter,
        start: 'top 80%',
        once: true
      },
      onUpdate: function() {
        counter.innerText = Math.round(this.targets()[0].innerText);
      }
    });
  });

  // Scroll-triggered section reveals
  const sections = document.querySelectorAll('section:not(.hero)');
  sections.forEach(section => {
    const header = section.querySelector('.section-header');
    const content = section.querySelectorAll('.about-card, .service-card, .team-member, .why-us-feature, .testimonial-card, .contact-card');

    if (header) {
      gsap.from(header, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          once: true
        }
      });
    }

    if (content.length) {
      gsap.from(content, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true
        }
      });
    }
  });

  // Parallax effects
  gsap.utils.toArray('.hero-image-wrapper').forEach(el => {
    gsap.to(el, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // About mission parallax
  gsap.to('.about-mission-image-wrapper', {
    yPercent: -10,
    rotationY: 5,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about-mission',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  // Why us features stagger
  gsap.from('.why-us-feature', {
    x: -60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.why-us-features',
      start: 'top 80%',
      once: true
    }
  });

  // Navigation scroll effect
  ScrollTrigger.create({
    start: 'top -100',
    onUpdate: (self) => {
      const nav = document.getElementById('mainNav');
      if (self.direction === 1 && self.scroll() > 100) {
        nav.classList.add('scrolled');
      } else if (self.scroll() < 100) {
        nav.classList.remove('scrolled');
      }
    }
  });
}

// ============================================
// 10. NAVIGATION
// ============================================
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Smooth scroll to sections
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        if (lenis) {
          lenis.scrollTo(target, { offset: -80 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Close mobile menu
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';

      // Update active state
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Update active nav on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

// ============================================
// 11. TESTIMONIALS SLIDER
// ============================================
function initTestimonials() {
  const slider = document.getElementById('testimonialsSlider');
  if (!slider) return;

  const track = slider.querySelector('.testimonials-track');
  const cards = slider.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('testimonialsPrev');
  const nextBtn = document.getElementById('testimonialsNext');
  const dots = slider.querySelectorAll('.testimonials-dot');

  let currentIndex = 0;
  const totalCards = cards.length;

  function getVisibleCards() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateSlider() {
    const visibleCards = getVisibleCards();
    const cardWidth = cards[0].offsetWidth + 32; // gap
    const offset = -currentIndex * cardWidth;
    track.style.transform = `translateX(${offset}px)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(index) {
    const visibleCards = getVisibleCards();
    const maxIndex = totalCards - visibleCards;
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    updateSlider();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  // Auto-play
  let autoplay = setInterval(() => {
    const visibleCards = getVisibleCards();
    const maxIndex = totalCards - visibleCards;
    if (currentIndex < maxIndex) {
      goTo(currentIndex + 1);
    } else {
      goTo(0);
    }
  }, 5000);

  // Pause on hover
  slider.addEventListener('mouseenter', () => clearInterval(autoplay));
  slider.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      const visibleCards = getVisibleCards();
      const maxIndex = totalCards - visibleCards;
      if (currentIndex < maxIndex) {
        goTo(currentIndex + 1);
      } else {
        goTo(0);
      }
    }, 5000);
  });

  // Resize handler
  window.addEventListener('resize', updateSlider);
}

// ============================================
// 12. CONTACT FORM
// ============================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Odesílání...</span>';
    submitBtn.style.opacity = '0.7';

    // Simulate form submission
    setTimeout(() => {
      submitBtn.innerHTML = '<span>Odesláno!</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      submitBtn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';

      // Reset after delay
      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = '';
      }, 2000);
    }, 1500);
  });
}

// ============================================
// 13. BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// ============================================
// 14. 3D TILT CARDS
// ============================================
function initTiltCards() {
  if (isTouchDevice()) return;

  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / centerY * -10;
      const rotateY = (x - centerX) / centerX * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ============================================
// 15. MAGNETIC BUTTONS
// ============================================
function initMagneticButtons() {
  if (isTouchDevice()) return;

  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// ============================================
// 16. LUCIDE ICONS
// ============================================
function initLucideIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// ============================================
// 17. SCROLL REVEAL OBSERVER
// ============================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// ============================================
// 18. CUSTOM CURSOR (Desktop)
// ============================================
function initCustomCursor() {
  if (isTouchDevice() || isMobile()) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  document.body.appendChild(cursorDot);

  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  function animateCursor() {
    dotX += (cursorX - dotX) * 0.2;
    dotY += (cursorY - dotY) * 0.2;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects
  const hoverElements = document.querySelectorAll('a, button, .service-card, .about-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// ============================================
// 19. LOADING SCREEN
// ============================================
function initLoadingScreen() {
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.classList.remove('loading');

      // Trigger hero animations
      if (typeof gsap !== 'undefined') {
        // Animations are handled by initGSAP
      }
    }, 500);
  });
}

// ============================================
// 20. PERFORMANCE MONITORING
// ============================================
function initPerformanceMonitor() {
  let frameCount = 0;
  let lastTime = performance.now();

  function checkFPS() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
      const fps = frameCount;
      frameCount = 0;
      lastTime = currentTime;

      // Reduce particle count if FPS is low
      if (fps < 30 && particleSystem && CONFIG.particles.count > 200) {
        CONFIG.particles.count = Math.max(200, CONFIG.particles.count - 100);
        console.log('Reduced particles for performance. FPS:', fps);
      }
    }

    requestAnimationFrame(checkFPS);
  }

  if (!isMobile()) {
    requestAnimationFrame(checkFPS);
  }
}

// ============================================
// 21. INITIALIZATION
// ============================================
function init() {
  // Initialize in order
  initLucideIcons();
  initLoadingScreen();
  initThreeJS();
  initThreeEvents();
  initLenis();
  initGSAP();
  initNavigation();
  initTestimonials();
  initContactForm();
  initBackToTop();
  initTiltCards();
  initMagneticButtons();
  initScrollReveal();
  initCustomCursor();
  initPerformanceMonitor();

  console.log('%c Domácí péče Holoubkov ', 'background: linear-gradient(135deg, #2563eb, #10b981); color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold;');
  console.log('%c 3D Website Initialized ', 'color: #2563eb; font-weight: 600;');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Re-initialize Lucide icons after dynamic content
window.addEventListener('load', () => {
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 100);
});
