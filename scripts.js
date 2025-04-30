// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and interactions
    initNavbarAnimation();
    initDarkModeToggle();
    initMobileMenu();
    initSkillsAnimation();
    initDNAAnimation();
    initContactForm();
    initParticles();
    initScrollAnimations();
});

// Initialize particle.js background
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#64ffda" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { 
                    enable: true, 
                    distance: 150, 
                    color: "#64ffda", 
                    opacity: 0.2, 
                    width: 1 
                },
                move: { 
                    enable: true, 
                    speed: 2, 
                    direction: "none", 
                    random: true, 
                    straight: false, 
                    out_mode: "out" 
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }
}
function initNavbarAnimation() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}
function initDarkModeToggle() {
    const toggle = document.getElementById('darkModeToggle');
    const icon = toggle.querySelector('i');
    const body = document.body;

    // Optional: persist choice
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    toggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');

        if (isLight) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });
}


function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

function initSkillsAnimation() {
    const progressBars = document.querySelectorAll('.progress-bar');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0'; // Reset to trigger transition
                setTimeout(() => {
                    bar.style.transition = 'width 2s ease';
                    bar.style.width = width; // Animate to original width
                }, 50);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.4 });

    progressBars.forEach(bar => observer.observe(bar));
}
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
}

// DNA Animation in background canvas
function initDNAAnimation() {
    const canvas = document.getElementById('dnaCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // DNA strand class
    class DNAStrand {
        constructor(x, y, length) {
            this.x = x;
            this.y = y;
            this.length = length;
            this.baseWidth = 30;
            this.speed = 0.5 + Math.random() * 0.5;
            this.offset = Math.random() * Math.PI * 2;
            this.hue = Math.random() * 60 + 180; // Blue-green hue range
        }
        
        draw() {
            const time = Date.now() * 0.001;
            
            // Left helix
            ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, 0.3)`;
            ctx.lineWidth = 1;
            
            ctx.beginPath();
            for (let i = 0; i < this.length; i++) {
                const t = i * 0.1 + time * this.speed + this.offset;
                const x = this.x + Math.sin(t) * this.baseWidth;
                const y = this.y + i * 10;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            
            // Right helix
            ctx.strokeStyle = `hsla(${(this.hue + 120) % 360}, 100%, 70%, 0.3)`;
            ctx.beginPath();
            for (let i = 0; i < this.length; i++) {
                const t = i * 0.1 + time * this.speed + this.offset + Math.PI;
                const x = this.x + Math.sin(t) * this.baseWidth;
                const y = this.y + i * 10;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            
            // Bridges between helices
            for (let i = 0; i < this.length; i += 3) {
                const t1 = i * 0.1 + time * this.speed + this.offset;
                const t2 = i * 0.1 + time * this.speed + this.offset + Math.PI;
                
                const x1 = this.x + Math.sin(t1) * this.baseWidth;
                const x2 = this.x + Math.sin(t2) * this.baseWidth;
                const y = this.y + i * 10;
                
                const gradient = ctx.createLinearGradient(x1, y, x2, y);
                gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, 0.15)`);
                gradient.addColorStop(1, `hsla(${(this.hue + 120) % 360}, 100%, 70%, 0.15)`);
                
                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(x1, y);
                ctx.lineTo(x2, y);
                ctx.stroke();
            }
        }
        
        update() {
            this.y -= 0.5;
            
            // Reset if moved out of view
            if (this.y + this.length * 10 < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
    }
    
    // Create DNA strands
    const strands = [];
    const numberOfStrands = Math.floor(canvas.width / 200);
    
    for (let i = 0; i < numberOfStrands; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const length = 20 + Math.random() * 30;
        
        strands.push(new DNAStrand(x, y, length));
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        strands.forEach(strand => {
            strand.draw();
            strand.update();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Rest of your existing script.js code remains the same...

// Handle contact form submission

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Send form using EmailJS
            emailjs.sendForm('service_6m3af3p', 'template_zkcweey', contactForm)
                .then(() => {
                    // Show success message with futuristic animation
                    const successMessage = document.createElement('div');
                    successMessage.classList.add('success-message');
                    successMessage.innerHTML = `
                        <div class="success-icon">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--teal)" stroke-width="5" stroke-dasharray="283" stroke-dashoffset="283" class="circle"/>
                                <path d="M30,50 L45,65 L70,35" fill="none" stroke="var(--teal)" stroke-width="5" stroke-dasharray="50" stroke-dashoffset="50" class="check"/>
                            </svg>
                        </div>
                        <h3>Transmission Successful!</h3>
                        <p>Your message has been sent through the quantum network.</p>
                    `;
                    
                    contactForm.innerHTML = '';
                    contactForm.appendChild(successMessage);
                    
                    // Animate the success icon
                    setTimeout(() => {
                        const circle = contactForm.querySelector('.circle');
                        const check = contactForm.querySelector('.check');
                        if (circle) circle.style.strokeDashoffset = '0';
                        if (check) check.style.strokeDashoffset = '0';
                    }, 100);
                    
                }, (error) => {
                    // Error handling
                    alert('Quantum transmission failed: ' + error.text);
                    console.error('EmailJS error:', error);
                });
        });
    }
}

// Add event listener for page load animations
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});