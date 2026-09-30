export function initNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    const sections = Array.from(links).map(link => {
        const targetId = link.getAttribute('href').substring(1);
        return document.getElementById(targetId);
    }).filter(Boolean);
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        if (current) {
            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    }, { passive: true });
    
    const copyIpBtn = document.getElementById('copyIpBtn');
    const serverIpDisplay = document.getElementById('serverIpDisplay');
    
    if (copyIpBtn && serverIpDisplay) {
        copyIpBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(serverIpDisplay.textContent);
                showToast("IP Server berhasil disalin!");
            } catch (err) {
                console.error('Failed to copy IP', err);
            }
        });
    }
}

// Helper Toast Notification
export function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Trigger reflow to start animation
    void toast.offsetWidth;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300); // Wait for transition to finish
    }, 3000);
}
