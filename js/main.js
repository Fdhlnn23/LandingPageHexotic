import { config } from '../config.js';
import { initNav, showToast } from './nav.js';
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

    // --- Init Factions Accordion ---
    const factionsList = document.getElementById('factionsList');
    if (factionsList && config.factions && config.factions.length > 0) {
        config.factions.forEach((faction) => {
            const item = document.createElement('div');
            item.className = 'faction-item';
            
            const isClosed = faction.status.toLowerCase() === 'closed';
            const statusClass = isClosed ? 'closed' : 'open';
            
            item.innerHTML = `
                <button class="faction-header">
                    <div class="faction-title-area">
                        <span class="faction-name">${faction.name}</span>
                        <span class="faction-status ${statusClass}">${faction.status}</span>
                    </div>
                    <svg class="faction-icon-toggle" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div class="faction-content">
                    <div class="faction-inner">
                        ${faction.desc}
                    </div>
                </div>
            `;
            
            const btn = item.querySelector('.faction-header');
            const content = item.querySelector('.faction-content');
            
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all others
                document.querySelectorAll('.faction-item').forEach(el => {
                    el.classList.remove('active');
                    el.querySelector('.faction-content').style.maxHeight = null;
                });
                
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
            
            factionsList.appendChild(item);
        });
    } else {
        const facSec = document.getElementById('factions');
        if(facSec) facSec.style.display = 'none';
    }
    
    // --- Init Background Music ---
    const bgmPlayer = document.getElementById('bgmPlayer');
    const btnBgm = document.getElementById('btnBgm');
    
    if (bgmPlayer && btnBgm && config.music && config.music.url) {
        bgmPlayer.src = config.music.url;
        bgmPlayer.volume = 0.3;
        
        let isPlaying = false;
        
        btnBgm.addEventListener('click', () => {
            if (isPlaying) {
                bgmPlayer.pause();
                btnBgm.classList.remove('playing-pulse');
                showToast("Musik dijeda");
            } else {
                bgmPlayer.play().catch(e => console.error("Audio play failed:", e));
                btnBgm.classList.add('playing-pulse');
                showToast("Memutar musik latar");
            }
            isPlaying = !isPlaying;
        });
        
        if (config.music.autoplay) {
            // Autoplay policies might block this until user interaction
            bgmPlayer.play().then(() => {
                isPlaying = true;
                btnBgm.classList.add('playing-pulse');
            }).catch(e => {
                console.log("Autoplay dicegah oleh browser. Pengguna harus play manual.");
            });
        }
    } else if (btnBgm) {
        btnBgm.style.display = 'none';
    }

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
