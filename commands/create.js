// Command untuk membuat server

const axios = require('axios');
const config = require('../config.js');

const apiKey = config.pterodactylApiKey;
const baseUrl = config.baseUrl;

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

module.exports = {
    name: 'create',
    description: 'Membuat server baru',
    async execute(message, args) {
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
    },
};
