const dgram = require('dgram');

function querySAMP(ip, port) {
    return new Promise((resolve, reject) => {
        const socket = dgram.createSocket('udp4');
        let resolved = false;

        socket.on('error', (err) => {
            if (!resolved) {
                resolved = true;
                socket.close();
                reject(err);
            }
        });

        socket.on('message', (msg) => {
            if (resolved) return;
            resolved = true;
            socket.close();
            
            try {
                let offset = 10;
                const password = msg.readUInt8(offset); offset += 1;
                const players = msg.readUInt16LE(offset); offset += 2;
                const maxPlayers = msg.readUInt16LE(offset); offset += 2;
                
                const hostnameLen = msg.readUInt32LE(offset); offset += 4;
                const hostname = msg.slice(offset, offset + hostnameLen).toString('utf-8'); offset += hostnameLen;
                
                const gamemodeLen = msg.readUInt32LE(offset); offset += 4;
                const gamemode = msg.slice(offset, offset + gamemodeLen).toString('utf-8'); offset += gamemodeLen;
                
                const mapnameLen = msg.readUInt32LE(offset); offset += 4;
                const language = msg.slice(offset, offset + mapnameLen).toString('utf-8');
                
                resolve({
                    online: true,
                    password: password !== 0,
                    players,
                    maxPlayers,
                    hostname,
                    gamemode,
                    language,
                    version: "0.3.DL-R1"
                });
            } catch (err) {
                reject(err);
            }
        });

        const packet = Buffer.alloc(11);
        packet.write('SAMP', 0);
        
        const ipParts = ip.split('.');
        if (ipParts.length === 4) {
            packet.writeUInt8(parseInt(ipParts[0]), 4);
            packet.writeUInt8(parseInt(ipParts[1]), 5);
            packet.writeUInt8(parseInt(ipParts[2]), 6);
            packet.writeUInt8(parseInt(ipParts[3]), 7);
        } else {
            packet.writeUInt8(127, 4);
            packet.writeUInt8(0, 5);
            packet.writeUInt8(0, 6);
            packet.writeUInt8(1, 7);
        }
        
        packet.writeUInt16LE(port, 8);
        packet.write('i', 10);

        socket.send(packet, 0, packet.length, port, ip, (err) => {
            if (err && !resolved) {
                resolved = true;
                socket.close();
                reject(err);
            }
        });

        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                socket.close();
                reject(new Error('Timeout'));
            }
        }, 3000);
    });
}

let cache = {
    data: null,
    lastUpdate: 0
};

export default async function handler(req, res) {
    const CACHE_TTL = 30000;
    const now = Date.now();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');

    if (cache.data && (now - cache.lastUpdate < CACHE_TTL)) {
        return res.status(200).json(cache.data);
    }

    const ip = req.query.ip || '127.0.0.1'; 
    const port = parseInt(req.query.port) || 7777;

    try {
        const status = await querySAMP(ip, port);
        
        const mockPlayers = [];
        for (let i = 0; i < status.players; i++) {
            mockPlayers.push({ name: `Player_${i+1}`, ping: Math.floor(Math.random() * 50) + 20 });
        }
        
        const responseData = {
            online: true,
            maxPlayers: status.maxPlayers,
            onlineCount: status.players,
            hostname: status.hostname,
            version: status.version,
            language: status.language,
            password: status.password,
            players: mockPlayers
        };
        
        cache.data = responseData;
        cache.lastUpdate = now;
        
        return res.status(200).json(responseData);
    } catch (error) {
        return res.status(200).json({ 
            online: false, 
            error: error.message 
        });
    }
}
