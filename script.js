// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'white';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Form Submission
const appointmentForm = document.getElementById('appointmentForm');

appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.nama || !data.telepon || !data.email || !data.tanggal || !data.layanan) {
        alert('Mohon lengkapi semua field yang wajib diisi.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Mohon masukkan alamat email yang valid.');
        return;
    }
    
    // Phone validation (Indonesian format)
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    if (!phoneRegex.test(data.telepon.replace(/[-\s]/g, ''))) {
        alert('Mohon masukkan nomor telepon yang valid.');
        return;
    }
    
    // Date validation (not in the past)
    const selectedDate = new Date(data.tanggal);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('Tanggal kunjungan tidak boleh di masa lalu.');
        return;
    }
    
    // Success message
    alert(`Terima kasih, ${data.nama}!\n\nReservasi Anda telah diterima.\nTim kami akan menghubungi Anda di ${data.telepon} untuk konfirmasi.\n\nDetail:\n- Layanan: ${data.layanan}\n- Tanggal: ${data.tanggal}`);
    
    // Reset form
    this.reset();
});

// Set minimum date for appointment (today)
const dateInput = document.getElementById('tanggal');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to cards
document.querySelectorAll('.service-card, .doctor-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Counter Animation for Stats
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 30);
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.stat-item h3').forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                if (number) {
                    stat.dataset.suffix = text.replace(/[0-9]/g, '');
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statsObserver.observe(statsSection);
