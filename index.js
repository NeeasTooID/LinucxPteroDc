// Import library
const Discord = require('discord.js');
const axios = require('axios');
const config = require('./config.js');

// Konfigurasi bot Discord
const client = new Discord.Client();
const prefix = 'c!l'; // Prefix untuk perintah bot

// Token bot Discord
const token = 'TOKEN_DISCORD_BOT_ANDA';

// Key API Pterodactyl
const apiKey = 'API_KEY_PTERODACTYL_ANDA';
const baseUrl = 'https://panel.yourpterodactyl.com/api/client'; // URL panel Pterodactyl

// Fungsi untuk membuat server
async function createServer(eggName, serverName) {
    try {
        const response = await axios.post(`${baseUrl}/servers`, {
            egg: eggName,
            name: serverName,
            limits: {
                memory: config.ram,
                swap: 0,
                disk: config.disk,
                io: 500,
                cpu: config.cpu,
            }
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'Application/vnd.pterodactyl.v1+json',
                'Content-Type': 'application/json',
            }
        });
        console.log('Server berhasil dibuat:', response.data.attributes.identifier);
        return response.data.attributes.identifier;
    } catch (error) {
        console.error('Gagal membuat server:', error.response.data.errors);
        return null;
    }
}

// Fungsi untuk menghapus server
async function deleteServer(serverId) {
    try {
        await axios.delete(`${baseUrl}/servers/${serverId}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'Application/vnd.pterodactyl.v1+json',
                'Content-Type': 'application/json',
            }
        });
        console.log('Server berhasil dihapus:', serverId);
    } catch (error) {
        console.error('Gagal menghapus server:', error.response.data.errors);
    }
}

// Event saat bot siap beroperasi
client.once('ready', () => {
    console.log('Bot Discord telah siap!');
});

// Event saat bot menerima pesan
client.on('message', async message => {
    // Memeriksa apakah pesan dimulai dengan prefix dan dari pengguna yang valid
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Parsing argumen dari pesan
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Handler perintah c!l create
    if (command === 'create') {
        const eggName = args.shift();
        const serverName = args.join(' ');
        if (!eggName || !serverName) {
            return message.channel.send('Format perintah salah. Gunakan: `c!l create (nama eggs) (nama server)`');
        }
        const serverId = await createServer(eggName, serverName);
        if (serverId) {
            message.channel.send(`Server \`${serverName}\` berhasil dibuat dengan ID: \`${serverId}\``);
        } else {
            message.channel.send('Gagal membuat server, silakan coba lagi.');
        }
    }

    // Handler perintah c!l delete
    if (command === 'delete') {
        const serverId = args.shift();
        if (!serverId) {
            return message.channel.send('Format perintah salah. Gunakan: `c!l delete (id server)`');
        }
        await deleteServer(serverId);
        message.channel.send(`Server dengan ID \`${serverId}\` berhasil dihapus.`);
    }
});

// Login bot menggunakan token
client.login(token);
