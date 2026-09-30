export function initMonitor(config) {
    const els = {
        statOnline: document.getElementById('statOnline'),
        statSlots: document.getElementById('statSlots'),
        badge: document.getElementById('serverBadge'),
        hostname: document.getElementById('serverHostname'),
        version: document.getElementById('serverVersion'),
        language: document.getElementById('serverLanguage'),
        slotText: document.getElementById('serverSlotText'),
        slotProgress: document.getElementById('serverSlotProgress'),
        tableBody: document.getElementById('playerTableBody'),
        chart: document.getElementById('playerChart')
    };
    
    if (els.statSlots) els.statSlots.textContent = config.server.maxSlots;
    
    let historyData = [];

    async function fetchStatus() {
        try {
            const res = await fetch(config.api.statusEndpoint);
            if (!res.ok) throw new Error('Network response was not ok');
            const data = await res.json();
            
            updateUI(data);
        } catch (error) {
            console.warn('API status error.', error);
            const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
            
            if (isLocal) {
                const mockOnline = Math.floor(Math.random() * 15) + 35;
                const mockPlayers = Array.from({length: 8}, (_, i) => ({ 
                    name: `Pemain_Demo_${i+1}`, 
                    ping: Math.floor(Math.random() * 40) + 20 
                }));
                
                updateUI({
                    online: true, 
                    maxPlayers: 100, 
                    onlineCount: mockOnline,
                    hostname: config.server.name + " (Local Demo)", 
                    version: config.server.version, 
                    language: "Indonesia",
                    players: mockPlayers
                });
            } else {
                showOfflineState();
            }
        }
    }
    
    function updateUI(data) {
        if (!data || data.error || !data.online) {
            showOfflineState();
            return;
        }
        
        const players = data.players || [];
        const maxPlayers = data.maxPlayers || config.server.maxSlots;
        const onlineCount = players.length || data.onlineCount || 0;
        
        if (els.statOnline) els.statOnline.textContent = onlineCount;
        if (els.statSlots) els.statSlots.textContent = maxPlayers;
        
        if (els.badge) {
            els.badge.textContent = 'Online';
            els.badge.className = 'status-badge online';
        }
        if (els.hostname) els.hostname.textContent = data.hostname || config.server.name;
        if (els.version) els.version.textContent = `Versi: ${data.version || '-'}`;
        if (els.language) els.language.textContent = `Bahasa: ${data.language || '-'}`;
        
        if (els.slotText) els.slotText.textContent = `${onlineCount} / ${maxPlayers}`;
        if (els.slotProgress) {
            const pct = Math.min(100, (onlineCount / maxPlayers) * 100);
            els.slotProgress.style.width = `${pct}%`;
        }
        
        updateTable(players);
        updateChart(onlineCount, maxPlayers);
    }
    
    function showOfflineState() {
        if (els.statOnline) els.statOnline.textContent = '0';
        if (els.badge) {
            els.badge.textContent = 'Offline';
            els.badge.className = 'status-badge offline';
        }
        if (els.hostname) els.hostname.textContent = config.server.name;
        if (els.slotText) els.slotText.textContent = `0 / ${config.server.maxSlots}`;
        if (els.slotProgress) els.slotProgress.style.width = '0%';
        if (els.tableBody) {
            els.tableBody.innerHTML = `<tr><td colspan="2" class="empty-state">Server sedang offline atau tidak dapat dijangkau.</td></tr>`;
        }
        updateChart(0, config.server.maxSlots);
    }
    
    function updateTable(players) {
        if (!els.tableBody) return;
        
        els.tableBody.innerHTML = '';
        if (!players || players.length === 0) {
            els.tableBody.innerHTML = `<tr><td colspan="2" class="empty-state">Belum ada pemain yang online.</td></tr>`;
            return;
        }
        
        const displayPlayers = players.slice(0, 20);
        
        displayPlayers.forEach(p => {
            const tr = document.createElement('tr');
            
            const tdName = document.createElement('td');
            tdName.textContent = p.name || 'Unknown';
            
            const tdPing = document.createElement('td');
            tdPing.textContent = p.ping !== undefined ? p.ping : '-';
            
            tr.appendChild(tdName);
            tr.appendChild(tdPing);
            els.tableBody.appendChild(tr);
        });
        
        if (players.length > 20) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="2" class="text-muted" style="text-align: center; font-size: 0.875rem;">... dan ${players.length - 20} lainnya</td>`;
            els.tableBody.appendChild(tr);
        }
    }
    
    function updateChart(currentCount, maxPlayers) {
        if (!els.chart) return;
        
        historyData.push(currentCount);
        if (historyData.length > 24) historyData.shift();
        
        let plotData = [...historyData];
        if (plotData.length < 24) {
            const padding = new Array(24 - plotData.length).fill(0);
            plotData = [...padding, ...plotData];
        }
        
        const maxVal = Math.max(maxPlayers || 100, ...plotData);
        const w = 1000;
        const h = 100;
        const stepX = w / (plotData.length - 1);
        
        let pathD = `M 0 ${h}`;
        plotData.forEach((val, i) => {
            const x = i * stepX;
            const y = h - (val / maxVal * h);
            pathD += ` L ${x} ${y}`;
        });
        
        let pathStr = '';
        plotData.forEach((val, i) => {
            const x = i * stepX;
            const y = h - (val / maxVal * h);
            if(i === 0) pathStr += `M ${x} ${y} `;
            else pathStr += `L ${x} ${y} `;
        });

        els.chart.innerHTML = `
            <path d="${pathStr}" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            ${plotData.map((val, i) => {
                const x = i * stepX;
                const y = h - (val / maxVal * h);
                return `<circle cx="${x}" cy="${y}" r="4" fill="var(--color-paper-2)" stroke="var(--color-accent)" stroke-width="2"/>`;
            }).join('')}
        `;
    }

    fetchStatus();
    setInterval(fetchStatus, 30000);
}
