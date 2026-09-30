export const config = {
    server: {
        name: "Hexotic Roleplay",
        ip: "151.243.226.42",
        port: 7777,
        maxSlots: 50,
        version: "0.3.DL-R1 / open.mp"
    },
    socials: {
        discordLink: "https://discord.gg/hYFb7dcKBr",
        discordGuildId: "1550922102230483035",
        tiktok: "https://tiktok.com/@hexoticroleplay"
    },
    download: {
        clientLink: "https://example.com/download/client.zip",
        autoUpdater: true,
        support: "x32 / x64"
    },
    api: {
        statusEndpoint: "/api/status" 
    },
    music: {
        url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3", // Lofi royalty-free audio default
        autoplay: true
    },
    factions: [
        { name: "Los Santos Police Department", type: "gov", status: "Open", desc: "Menjaga keamanan dan ketertiban kota Los Santos." },
        { name: "San Andreas Fire Department", type: "gov", status: "Closed", desc: "Menangani keadaan darurat medis dan kebakaran." },
        { name: "San News", type: "gov", status: "Open", desc: "Menyajikan berita aktual dan hiburan untuk warga." },
        { name: "Pemerintah Kota (Gov)", type: "gov", status: "Closed", desc: "Pusat perizinan dan regulasi hukum kota." }
    ]
};
