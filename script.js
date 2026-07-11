/* ===== CURSOR GLOW ===== */
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

/* ===== PARTICLE CANVAS ===== */
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.2, 0.2), vy: rand(-0.3, -0.05),
      size: rand(1, 2.5),
      alpha: rand(0.1, 0.5),
      color: Math.random() > 0.5 ? '79,142,247' : '34,211,238'
    };
  }

  for (let i = 0; i < 80; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -5) { particles[i] = createParticle(); particles[i].y = H + 5; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });
    // draw faint connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79,142,247,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ===== TYPEWRITER ===== */
(function () {
  const el = document.getElementById('typed-text');
  const phrases = [
    'IT Student @ Jimma University',
    'Aspiring Web Developer',
    'Networking Enthusiast',
    'Cybersecurity Learner',
    'Problem Solver'
  ];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 45 : 80);
  }
  setTimeout(type, 800);
})();

/* ===== NAVBAR ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  highlightNav();
});

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* ===== ACTIVE NAV ===== */
function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight);
    }
  });
}

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ===== SKILL BAR ANIMATION ===== */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animate'), i * 120);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

/* ===== STAT COUNTER ANIMATION ===== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-card h3').forEach(el => {
        const target = parseInt(el.textContent);
        if (isNaN(target)) return;
        let current = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + (el.textContent.includes('+') ? '+' : '');
          if (current >= target) clearInterval(timer);
        }, 40);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const aboutSection = document.getElementById('about');
if (aboutSection) counterObserver.observe(aboutSection);

/* ===== CONTACT FORM ===== */
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    successMsg.classList.add('show');
    form.reset();
    setTimeout(() => successMsg.classList.remove('show'), 5000);
  }, 1500);
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ===== MODAL DATA ===== */
const modalData = {
  languages: {
    icon: 'fas fa-globe', title: 'Languages', sub: 'Communication Skills',
    body: 'Birtukan is multilingual, enabling her to communicate effectively across diverse communities and professional environments.',
    list: [
      { icon: 'fas fa-star', text: '<strong style="color:#93c5fd">Afaan Oromoo</strong> — Native language, full professional fluency' },
      { icon: 'fas fa-star', text: '<strong style="color:#22d3ee">Amharic</strong> — Fluent, widely used in Ethiopia for professional communication' },
      { icon: 'fas fa-star', text: '<strong style="color:#34d399">English</strong> — Good proficiency, used in academic and technical contexts' }
    ]
  },
  hobbies: {
    icon: 'fas fa-heart', title: 'Hobbies & Interests', sub: 'Personal Passions',
    body: 'Outside of academics, Birtukan stays curious and engaged through activities that fuel both personal growth and community impact.',
    list: [
      { icon: 'fas fa-book', text: '<strong style="color:#93c5fd">Reading</strong> — Enjoys books on technology, self-development, and innovation' },
      { icon: 'fas fa-hands-helping', text: '<strong style="color:#22d3ee">Volunteering</strong> — Actively contributes to community service and social initiatives' },
      { icon: 'fas fa-laptop', text: '<strong style="color:#34d399">Technology</strong> — Passionate about exploring new tools, gadgets, and digital trends' }
    ]
  },
  softskills: {
    icon: 'fas fa-users', title: 'Soft Skills', sub: 'Interpersonal Strengths',
    body: 'Strong soft skills complement technical expertise and are essential for thriving in any IT environment.',
    list: [
      { icon: 'fas fa-comments', text: '<strong style="color:#93c5fd">Communication</strong> — Able to clearly convey technical ideas to both technical and non-technical audiences' },
      { icon: 'fas fa-people-carry', text: '<strong style="color:#22d3ee">Teamwork</strong> — Collaborative mindset with experience working in group projects and community settings' },
      { icon: 'fas fa-lightbulb', text: '<strong style="color:#34d399">Problem Solving</strong> — Analytical thinker who approaches challenges with creativity and persistence' }
    ]
  },
  'skill-html': {
    icon: 'fab fa-html5', title: 'HTML5', sub: 'Markup Language', level: 90,
    body: 'Proficient in writing semantic, accessible HTML5 markup. Comfortable structuring web pages, forms, tables, and multimedia elements.',
    tags: ['Semantic HTML', 'Forms', 'Accessibility', 'SEO Structure']
  },
  'skill-css': {
    icon: 'fab fa-css3-alt', title: 'CSS3', sub: 'Styling & Layout', level: 90,
    body: 'Strong CSS skills including Flexbox, Grid, animations, transitions, and responsive design with media queries.',
    tags: ['Flexbox', 'CSS Grid', 'Animations', 'Responsive Design', 'Variables']
  },
  'skill-js': {
    icon: 'fab fa-js-square', title: 'JavaScript', sub: 'Programming Language', level: 70,
    body: 'Comfortable with core JavaScript concepts including DOM manipulation, events, fetch API, and ES6+ syntax.',
    tags: ['DOM Manipulation', 'ES6+', 'Events', 'Fetch API', 'JSON']
  },
  'skill-react': {
    icon: 'fab fa-react', title: 'React', sub: 'Frontend Framework', level: 75,
    body: 'Basic understanding of React including components, props, state management, and JSX syntax.',
    tags: ['Components', 'Props & State', 'JSX', 'Hooks (basic)']
  },
  'skill-db': {
    icon: 'fas fa-database', title: 'Database Fundamentals', sub: 'Data Management', level: 95,
    body: 'Strong grasp of database concepts including relational models, SQL queries, normalization, and basic database design.',
    tags: ['SQL', 'Relational Models', 'Normalization', 'CRUD Operations', 'ER Diagrams']
  },
  'skill-net': {
    icon: 'fas fa-network-wired', title: 'Basic Networking', sub: 'Network Fundamentals', level: 80,
    body: 'Knowledge of networking concepts including OSI model, TCP/IP, IP addressing, subnetting, and basic network configuration.',
    tags: ['OSI Model', 'TCP/IP', 'IP Addressing', 'Subnetting', 'DNS & DHCP']
  },
  'skill-office': {
    icon: 'fab fa-microsoft', title: 'Microsoft Office', sub: 'Productivity Suite', level: 85,
    body: 'Proficient in the full Microsoft Office suite for academic and professional document creation and data management.',
    tags: ['Word', 'Excel', 'PowerPoint', 'Data Entry', 'Reports']
  },
  'skill-android': {
    icon: 'fab fa-android', title: 'Android Development', sub: 'Mobile Development', level: 50,
    body: 'Foundational knowledge of Android app development through the Udacity Android Developer Fundamentals course.',
    tags: ['Activities', 'Layouts', 'Intents', 'App Lifecycle', 'XML UI']
  },
  'cert-hardware': {
    icon: 'fas fa-microchip', title: 'Computer Hardware', sub: 'Cisco Networking Academy — Jan 28, 2025',
    image: 'image/computer harware certificate_page_1.png',
    body: 'This certification covers the fundamentals of computer hardware including component identification, assembly, troubleshooting, and preventive maintenance.',
    list: [
      { icon: 'fas fa-check', text: 'Hardware component identification and function' },
      { icon: 'fas fa-check', text: 'PC assembly and disassembly procedures' },
      { icon: 'fas fa-check', text: 'Troubleshooting hardware failures' },
      { icon: 'fas fa-check', text: 'Preventive maintenance best practices' }
    ]
  },
  'cert-cyber': {
    icon: 'fas fa-shield-alt', title: 'Cyber Threat Management', sub: 'Cisco Networking Academy — Jan 30, 2025',
    image: 'image/cyber threatment management_page_1.png',
    body: 'Covers identification, analysis, and management of cyber threats including risk assessment frameworks and incident response strategies.',
    list: [
      { icon: 'fas fa-check', text: 'Cyber threat identification and classification' },
      { icon: 'fas fa-check', text: 'Risk assessment and management frameworks' },
      { icon: 'fas fa-check', text: 'Incident response planning' },
      { icon: 'fas fa-check', text: 'Security policies and compliance' }
    ]
  },
  'cert-network': {
    icon: 'fas fa-lock', title: 'Network Defense', sub: 'Cisco Networking Academy — Jan 30, 2025',
    image: 'image/network defense_page_1.png',
    body: 'Focuses on defending network infrastructure against attacks, including intrusion detection, firewall configuration, and security monitoring.',
    list: [
      { icon: 'fas fa-check', text: 'Firewall configuration and management' },
      { icon: 'fas fa-check', text: 'Intrusion detection and prevention systems' },
      { icon: 'fas fa-check', text: 'Network traffic analysis and monitoring' },
      { icon: 'fas fa-check', text: 'VPN and secure communication protocols' }
    ]
  },
  'cert-android': {
    icon: 'fab fa-android', title: 'Android Developer Fundamentals', sub: 'Udacity — Nov 29, 2024',
    image: 'image/udacity_certificate.png',
    body: 'Completed the Udacity Android Developer Fundamentals course covering core Android development concepts and building functional apps.',
    list: [
      { icon: 'fas fa-check', text: 'Android Studio setup and project structure' },
      { icon: 'fas fa-check', text: 'Activities, fragments, and app navigation' },
      { icon: 'fas fa-check', text: 'UI design with XML layouts' },
      { icon: 'fas fa-check', text: 'Data persistence and app lifecycle management' }
    ]
  },
  'cert-compnet': {
    icon: 'fas fa-network-wired', title: 'Computer Networks V1.0', sub: 'Huawei ICT Academy — Mar 27, 2026',
    image: 'image/photo_2026-07-10_13-38-52.jpg',
    body: 'Covers comprehensive computer networking principles including network architecture, communication protocols, and infrastructure design and management.',
    list: [
      { icon: 'fas fa-check', text: 'Network topologies and architecture design' },
      { icon: 'fas fa-check', text: 'TCP/IP protocol suite and OSI model layers' },
      { icon: 'fas fa-check', text: 'LAN, WAN, and wireless network configuration' },
      { icon: 'fas fa-check', text: 'Network troubleshooting and diagnostics' }
    ]
  },
  'cert-hcia': {
    icon: 'fas fa-server', title: 'HCIA-Datacom V1.0', sub: 'Huawei ICT Academy — Mar 27, 2026',
    image: 'image/photo_2026-07-10_13-39-00.jpg',
    body: 'The Huawei HCIA-Datacom certification validates knowledge of data communication fundamentals, enterprise networking, and Huawei network device configuration.',
    list: [
      { icon: 'fas fa-check', text: 'Routing protocols — OSPF, RIP, and static routing' },
      { icon: 'fas fa-check', text: 'Switching technologies — VLANs, STP, and trunking' },
      { icon: 'fas fa-check', text: 'Enterprise network architecture and design' },
      { icon: 'fas fa-check', text: 'Huawei VRP operating system configuration' },
      { icon: 'fas fa-check', text: 'Network security and access control basics' }
    ]
  },
  'cert-progfund': {
    icon: 'fas fa-code', title: 'Programming Fundamentals', sub: 'Udacity — Sep 5, 2024',
    image: 'image/programming.png',
    body: 'Covers the foundational concepts of programming including logic building, algorithm design, and core coding principles applicable across multiple languages.',
    list: [
      { icon: 'fas fa-check', text: 'Variables, data types, and operators' },
      { icon: 'fas fa-check', text: 'Control flow — conditionals and loops' },
      { icon: 'fas fa-check', text: 'Functions and modular programming' },
      { icon: 'fas fa-check', text: 'Basic algorithms and problem-solving techniques' },
      { icon: 'fas fa-check', text: 'Introduction to object-oriented concepts' }
    ]
  }
};

/* ===== MODAL LOGIC ===== */
const overlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

function openModal(key) {
  const d = modalData[key];
  if (!d) return;

  let html = `
    <div class="modal-header">
      <div class="modal-icon"><i class="${d.icon}"></i></div>
      <div><h2>${d.title}</h2><p>${d.sub}</p></div>
    </div>
    <div class="modal-body">`;

  if (d.image) {
    html += `
      <div class="modal-cert-img-wrap">
        <img src="${d.image}" alt="${d.title} certificate" class="modal-cert-img" />
        <a href="${d.image}" target="_blank" class="modal-cert-view"><i class="fas fa-expand"></i> View Full Size</a>
      </div>`;
  }

  html += `<p>${d.body}</p>`;

  if (d.level !== undefined) {
    html += `
      <div class="modal-level-bar">
        <label>Proficiency Level — ${d.level}%</label>
        <div class="bar-track"><div class="bar-fill" style="--target:${d.level}%; width:0"></div></div>
      </div>`;
  }
  if (d.tags) {
    html += `<div class="modal-tags">${d.tags.map(t => `<span>${t}</span>`).join('')}</div>`;
  }
  if (d.list) {
    html += `<ul class="modal-list">${d.list.map(i => `<li><i class="${i.icon}"></i><span>${i.text}</span></li>`).join('')}</ul>`;
  }

  html += `</div>`;
  modalContent.innerHTML = html;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // animate bar if present
  setTimeout(() => {
    const bar = modalContent.querySelector('.bar-fill');
    if (bar) bar.classList.add('animate');
  }, 100);
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-modal]').forEach(el => {
  el.addEventListener('click', () => openModal(el.dataset.modal));
});
modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
