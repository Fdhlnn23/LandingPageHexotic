import { config } from '../config.js';
import { initNav } from './nav.js';
import { initMonitor } from './monitor.js';
import { initDiscord } from './discord.js';
import { initGallery } from './gallery.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('serverIpDisplay').textContent = `${config.server.ip}:${config.server.port}`;
    document.getElementById('dlSupport').textContent = `✓ Support ${config.download.support}`;
    
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    const discordLinks = ['navDiscord', 'btnJoinDiscord', 'footerDiscord'];
    discordLinks.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.href = config.socials.discordLink;
    });
    
    const tiktokLinks = ['navTiktok', 'footerTiktok'];
    tiktokLinks.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.href = config.socials.tiktok;
    });
    
    document.getElementById('btnDownload').href = config.download.clientLink;

    initNav();
    initMonitor(config);
    initDiscord(config);
    initGallery();
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });
    
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
});
