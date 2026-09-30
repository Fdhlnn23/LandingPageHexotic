export async function initDiscord(config) {
    const section = document.getElementById('komunitas');
    const onlineEl = document.getElementById('discordOnline');
    const totalEl = document.getElementById('discordTotal');
    const avatarsEl = document.getElementById('discordAvatars');
    const statDiscord = document.getElementById('statDiscord');
    
    if (!config.socials.discordGuildId || !section) return;

    try {
        const res = await fetch(`https://discord.com/api/guilds/${config.socials.discordGuildId}/widget.json`);
        if (!res.ok) throw new Error('Widget API failed');
        
        const data = await res.json();
        updateDiscordUI(data);
    } catch (error) {
        console.warn('Gagal memuat Discord widget.', error);
        
        const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
        if (isLocal) {
            console.warn('Menjalankan simulasi Discord widget di Local Demo.');
            updateDiscordUI({
                presence_count: 142,
                members: Array.from({length: 8}, (_, i) => ({
                    username: `Member${i}`,
                    avatar_url: `https://cdn.discordapp.com/embed/avatars/${i % 5}.png`
                }))
            });
        } else {
            if (section) section.style.display = 'none';
            if (statDiscord) statDiscord.textContent = '-';
        }
    }
    
    function updateDiscordUI(data) {
        const onlineCount = data.presence_count || 0;
        if (onlineEl) onlineEl.textContent = onlineCount;
        if (totalEl) totalEl.textContent = `${Math.floor(onlineCount * 2.5)}+`; 
        
        if (statDiscord) statDiscord.textContent = `${onlineCount} Online`;
        
        if (avatarsEl && data.members) {
            avatarsEl.innerHTML = '';
            const members = data.members.slice(0, 8);
            members.forEach(member => {
                const img = document.createElement('img');
                img.src = member.avatar_url;
                img.alt = member.username;
                img.className = 'discord-avatar';
                img.loading = 'lazy';
                avatarsEl.appendChild(img);
            });
        }
        
        section.style.display = 'block';
    }
}
