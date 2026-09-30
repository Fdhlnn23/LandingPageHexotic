export function initGallery() {
    const gallerySection = document.getElementById('galeri');
    const grid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    
    const images = [];
    
    if (!images || images.length === 0) {
        if (gallerySection) gallerySection.style.display = 'none';
        return;
    }
    
    if (gallerySection) gallerySection.style.display = 'block';
    
    let currentIndex = 0;
    
    images.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Gallery ${index + 1}`;
        img.loading = 'lazy';
        
        item.appendChild(img);
        
        item.addEventListener('click', () => openLightbox(index));
        
        grid.appendChild(item);
    });
    
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }
    
    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
    }
    
    function updateLightboxImage() {
        lbImg.src = images[currentIndex];
    }
    
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', showPrev);
    if (lbNext) lbNext.addEventListener('click', showNext);
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (lightbox) {
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) showNext();
        if (touchEndX > touchStartX + swipeThreshold) showPrev();
    }
}
