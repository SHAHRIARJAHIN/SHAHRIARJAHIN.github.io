// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and interactions
    initNavbarAnimation();
    initDarkModeToggle();
    initMobileMenu();
    initSkillsAnimation();
    initDNAAnimation();
    initContactForm();
});

// Handle navbar color change on scroll
function initNavbarAnimation() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Handle dark mode toggle
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = darkModeToggle.querySelector('i');
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    // Toggle dark mode on click
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        // Change icon based on menu state
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Animate skill bars when they come into view
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the width from inline style (e.g., "width: 90%")
                const width = entry.target.style.width;
                // First set width to 0
                entry.target.style.width = '0';
                
                // Then animate to the target width
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 200);
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    skillBars.forEach(bar => {
        // Store the target width
        const targetWidth = bar.style.width;
        // Set initial width to 0
        bar.style.width = '0';
        // Observe the element
        observer.observe(bar);
    });
}

// DNA Animation in background canvas
function initDNAAnimation() {
    const canvas = document.getElementById('dnaCanvas');
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
        }
        
        draw() {
            const time = Date.now() * 0.001;
            
            ctx.strokeStyle = 'rgba(100, 255, 218, 0.3)';
            ctx.lineWidth = 1;
            
            // Draw left helix
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
            
            // Draw right helix
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(188, 19, 254, 0.3)';
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
            
            // Draw bridges between helices
            ctx.strokeStyle = 'rgba(204, 214, 246, 0.15)';
            for (let i = 0; i < this.length; i += 3) {
                const t1 = i * 0.1 + time * this.speed + this.offset;
                const t2 = i * 0.1 + time * this.speed + this.offset + Math.PI;
                
                const x1 = this.x + Math.sin(t1) * this.baseWidth;
                const x2 = this.x + Math.sin(t2) * this.baseWidth;
                const y = this.y + i * 10;
                
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
            }
        }
    }
    
    // Create DNA strands
    const strands = [];
    const numberOfStrands = Math.floor(canvas.width / 300);
    
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

// Handle contact form submission
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            // For now, let's just simulate a successful submission
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Your message has been sent successfully!</p>
            `;
            
            // Add success message after form
            contactForm.innerHTML = '';
            contactForm.appendChild(successMessage);
            
            // Style success message
            successMessage.style.textAlign = 'center';
            successMessage.style.padding = '2rem';
            
            const icon = successMessage.querySelector('i');
            icon.style.fontSize = '3rem';
            icon.style.color = 'var(--teal)';
            icon.style.marginBottom = '1rem';
            
            console.log('Form submitted:', formObject);
        });
    }
}
