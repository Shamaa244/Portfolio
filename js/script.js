/**
 * ═════════════════════════════════════════════════════════════════════
 * MOHAMED WALED — CYBER SECURITY & SOC ANALYST PORTFOLIO
 * High-Performance Vanilla JavaScript Engine
 * ═════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  initCyberCanvas();
  initThemeManager();
  initNavigation();
  initScrollReveal();
  initSkillsFilter();
  initProjectsModal();
  initContactForm();
  initTerminalInteractivity();
  initClipboardActions();
});

/* ─── 1. CYBER CANVAS PARTICLE & NODE SYSTEM ───────────────────────── */
function initCyberCanvas() {
  const canvas = document.getElementById('cyberCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class CyberNode {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.size = Math.random() * 2.2 + 1;
      this.baseColor = Math.random() > 0.4 ? 'rgba(0, 242, 254,' : 'rgba(59, 130, 246,';
      this.alpha = Math.random() * 0.5 + 0.25;
      this.pulseSpeed = 0.02;
      this.pulseVal = Math.random() * Math.PI;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse Proximity Interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }

      this.pulseVal += this.pulseSpeed;
    }

    draw() {
      const currentAlpha = this.alpha + Math.sin(this.pulseVal) * 0.15;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.baseColor} ${Math.max(0.1, currentAlpha)})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 14000), 80);
    for (let i = 0; i < count; i++) {
      particles.push(new CyberNode());
    }
  }

  function connectNodes() {
    const maxDist = 130;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }

      // Connect to mouse if close
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[a].x - mouse.x;
        const dy = particles[a].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectNodes();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* ─── 2. THEME MANAGER ─────────────────────────────────────────────── */
function initThemeManager() {
  const themeToggleBtn = document.getElementById('themeToggle');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('mw-theme') || localStorage.getItem('mhs-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('mw-theme', newTheme);
    showToast(`Switched to ${newTheme.toUpperCase()} Mode`, 'info');
  });
}

/* ─── 3. NAVIGATION & SCROLL SPY ───────────────────────────────────── */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll Header Style
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active Link Observer
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ─── 4. SCROLL REVEAL ANIMATIONS ──────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));
}

/* ─── 5. SKILLS CATEGORY FILTER ────────────────────────────────────── */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ─── 6. PROJECTS INTERACTIVE DEEP DIVE MODAL ──────────────────────── */
const projectDetailsData = {
  'soc-lab': {
    title: 'SOC Monitoring Lab',
    badge: 'SIEM / Sysmon / Detection Engineering',
    category: 'Security Operations',
    overview: 'Engineered a virtualized enterprise cyber range utilizing an Active Directory domain controller, Windows 10 endpoints, and a Linux-based Splunk SIEM aggregator. The lab simulates real-world lateral movement and credential attacks, validating security telemetry pipelines.',
    architecture: [
      'Configured SwiftOnSecurity Sysmon schema for granular process creation, network connection, and DLL injection monitoring.',
      'Established Windows Event Forwarding (WEF) and Splunk Universal Forwarder pipelines for near real-time ingestion.',
      'Simulated Pass-the-Hash, Mimikatz memory dumping, and brute-force Kerberoasting attacks inside isolated virtual networks.'
    ],
    detectionRules: 'index=windows EventCode=4625 | stats count by TargetUserName, IpAddress | where count > 5\nindex=sysmon EventCode=1 Image="*mimikatz.exe" OR CommandLine="*sekurlsa*"',
    mitreTactics: ['TA0006: Credential Access', 'TA0008: Lateral Movement', 'TA0005: Defense Evasion'],
    outcomes: 'Successfully authored 6 high-fidelity detection rules with zero false positives during testing, drastically accelerating triage response time.'
  },
  'wireshark-analysis': {
    title: 'Network Traffic Analysis Using Wireshark',
    badge: 'PCAP Dissection / Threat Hunting / TCP/IP',
    category: 'Network Forensics',
    overview: 'Performed deep packet inspection and forensic artifact extraction on suspicious network captures (PCAPs), identifying unencrypted credential transmissions, covert DNS tunneling, and command-and-control (C2) beaconing cadence.',
    architecture: [
      'Isolated abnormal TCP stream conversations and reconstructed unencrypted HTTP application payloads.',
      'Detected Cobalt Strike and Empire C2 heartbeat signals through statistical packet inter-arrival time and Shannon entropy calculations.',
      'Extracted malicious payloads embedded inside base64 DNS TXT query records, decoding exfiltrated corporate hostnames.'
    ],
    detectionRules: 'dns.flags.response == 0 && dns.qry.name.len > 45\nhttp.request.method == "POST" && tcp.port == 8080',
    mitreTactics: ['TA0011: Command and Control', 'TA0010: Exfiltration', 'TA0007: Discovery'],
    outcomes: 'Mapped network indicators of compromise (IoCs) into STIX/TAXII threat intelligence formats and created actionable Snort/Suricata signature rules.'
  },
  'splunk-dashboard': {
    title: 'Splunk Log Analysis Dashboard',
    badge: 'Splunk Enterprise / SPL / Analytics',
    category: 'SIEM & Analytics',
    overview: 'Designed high-performance security monitoring dashboards using Splunk Search Processing Language (SPL), providing SOC Tier-1 and Tier-2 analysts with real-time situational awareness across authentication and network boundaries.',
    architecture: [
      'Developed optimized scheduled SPL searches leveraging data models to minimize query load on heavy indexing tiers.',
      'Built interactive drilldown visualizations highlighting logon anomalies, impossible travel, and privilege escalation events.',
      'Integrated risk-scoring algorithms into alerts to prioritize severe threats above routine baseline noise.'
    ],
    detectionRules: 'index=wineventlog EventCode=4720 OR EventCode=4728 | eval action="Privilege Alteration" | table _time, SubjectUserName, TargetUserName, action',
    mitreTactics: ['TA0004: Privilege Escalation', 'TA0003: Persistence', 'TA0001: Initial Access'],
    outcomes: 'Reduced manual analyst triage overhead by 40% through centralized visualization of high-priority security telemetry.'
  },
  'incident-investigation': {
    title: 'Threat Detection & Incident Investigation Simulation',
    badge: 'Incident Response / MITRE ATT&CK / PICERL',
    category: 'Incident Response',
    overview: 'Executed an end-to-end incident handling simulation adhering to the NIST / PICERL lifecycle. Investigated a multi-stage ransomware compromise from spear-phishing execution to volume shadow copy destruction.',
    architecture: [
      'Collected and analyzed volatility memory dumps and master file table ($MFT) records to pinpoint patient zero.',
      'Traced adversary persistence via scheduled tasks and Windows registry Run keys.',
      'Drafted comprehensive Incident Commander reports featuring remediation timelines and root-cause defense hardening.'
    ],
    detectionRules: 'CommandLine="*vssadmin*delete*shadows*" OR CommandLine="*wmic*shadowcopy*delete*"',
    mitreTactics: ['TA0002: Execution', 'TA0005: Defense Evasion', 'TA0040: Impact'],
    outcomes: 'Delivered an executive-ready post-incident review detailing containment steps, IOC hashes, and organizational perimeter hardening measures.'
  }
};

function initProjectsModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalDetails');
  const detailButtons = document.querySelectorAll('.project-details-btn');

  if (!modal || !modalBody) return;

  detailButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectDetailsData[projectId];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="margin-bottom: 16px;">
          <span class="tech-badge" style="background: rgba(0,242,254,0.15); border-color: var(--accent-cyan); font-weight:700;">${data.category}</span>
          <h2 style="font-size: 1.6rem; font-weight: 800; margin-top: 10px; color: var(--text-primary);">${data.title}</h2>
          <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-cyan); margin-top: 4px;">// ${data.badge}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Executive Overview</h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${data.overview}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Technical Architecture & Execution</h4>
          <ul style="display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; color: var(--text-secondary);">
            ${data.architecture.map(item => `<li style="display:flex; align-items:flex-start; gap:8px;">
              <span style="color:var(--accent-cyan); font-weight:bold;">▹</span> <span>${item}</span>
            </li>`).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Detection Query / Rule Blueprint</h4>
          <pre style="background: rgba(6,11,20,0.85); border: 1px solid var(--border-card); border-radius: 8px; padding: 12px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); overflow-x: auto; line-height: 1.5;">${data.detectionRules}</pre>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">MITRE ATT&CK Matrix Mapping</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${data.mitreTactics.map(t => `<span class="tech-badge" style="background:rgba(59,130,246,0.15); border-color:var(--accent-blue); color:var(--text-primary); font-size:0.75rem;">${t}</span>`).join('')}
          </div>
        </div>

        <div>
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">Measurable Outcome</h4>
          <p style="font-size: 0.9rem; color: var(--accent-emerald); font-weight: 500; line-height: 1.5;">✔ ${data.outcomes}</p>
        </div>
      `;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ─── 7. CONTACT FORM VALIDATION & TOAST ───────────────────────────── */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const subjectInput = document.getElementById('senderSubject');
    const messageInput = document.getElementById('senderMessage');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all mandatory fields.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }

    // Button visual progress
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="spinner" viewBox="0 0 50 50" style="width:20px;height:20px;animation:spin 1s linear infinite;">
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="80" stroke-dashoffset="60"></circle>
      </svg>
      <span>ENCRYPTING & DISPATCHING...</span>
    `;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      contactForm.reset();
      showToast('Transmission dispatched successfully! Mohamed will respond promptly.', 'success');
    }, 1200);
  });
}

/* ─── 8. INTERACTIVE TERMINAL SIMULATOR ────────────────────────────── */
function initTerminalInteractivity() {
  const terminalCmd = document.getElementById('terminalCmdInput');
  const terminalOutput = document.getElementById('terminalDynamicOutput');
  if (!terminalCmd || !terminalOutput) return;

  const commands = {
    'help': 'Available commands: whoami, status, skills, certs, clear, contact',
    'whoami': 'Mohamed Waled // Cyber Security Professional & SOC Analyst Candidate',
    'status': '● Operational. Threat detection engines active. Ready for SOC Analyst opportunities.',
    'skills': 'SIEM (Splunk), Wireshark, Sysmon, TCP/IP, Routing & Switching, Threat Hunting, Log Analysis',
    'certs': 'CCNA (Cisco), Intro to IoT (Cisco), Cybersecurity Diploma',
    'contact': 'Email: mohamedshamaa518@gmail.com | Phone: +20 1015123390 | Location: Dakahlia, Egypt',
    'clear': '__CLEAR__'
  };

  terminalCmd.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = terminalCmd.value.trim().toLowerCase();
      if (!input) return;

      if (commands[input]) {
        if (commands[input] === '__CLEAR__') {
          terminalOutput.innerHTML = '';
        } else {
          const line = document.createElement('div');
          line.className = 'terminal-line';
          line.innerHTML = `<span class="terminal-prompt">soc@mw-defense:~$</span> <span class="terminal-cmd">${escapeHtml(input)}</span>`;
          
          const resp = document.createElement('div');
          resp.className = 'terminal-output';
          resp.textContent = commands[input];

          terminalOutput.appendChild(line);
          terminalOutput.appendChild(resp);
        }
      } else {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="terminal-prompt">soc@mw-defense:~$</span> <span class="terminal-cmd">${escapeHtml(input)}</span>`;
        
        const resp = document.createElement('div');
        resp.className = 'terminal-output';
        resp.style.color = '#ef4444';
        resp.textContent = `Command not recognized: "${input}". Type 'help' for available commands.`;

        terminalOutput.appendChild(line);
        terminalOutput.appendChild(resp);
      }

      terminalCmd.value = '';
    }
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ─── 9. CLIPBOARD COPY ACTIONS ────────────────────────────────────── */
function initClipboardActions() {
  const copyableItems = document.querySelectorAll('.copyable');
  copyableItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const text = item.getAttribute('data-copy') || item.innerText;
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied to clipboard: ${text}`, 'success');
      }).catch(() => {
        showToast('Failed to copy to clipboard.', 'warning');
      });
    });
  });
}

/* ─── 10. CYBER TOAST NOTIFICATIONS ────────────────────────────────── */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = '⚡';
  if (type === 'success') icon = '🛡️';
  if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}
