const axios = require('axios');
const config = require('../config.js');

const apiKey = config.pterodactylApiKey;
const baseUrl = config.baseUrl;

async function createServer(eggName, serverName) {
    try {
        const response = await axios.get(`${baseUrl}/nodes/${config.nodeId}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        });

        const allocations = response.data.attributes.relationships.allocations.data.length;

        if (allocations >= config.maxAllocations) {
            console.error('Semua alokasi di node sudah terisi penuh.');
            return 'Maaf, semua alokasi di node sudah terisi penuh. Tidak dapat membuat server baru.';
        }

        const serverResponse = await axios.post(`${baseUrl}/servers`, {
            egg: eggName,
            name: serverName,
            limits: {
                memory: config.ram,
                swap: config.swap,
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

        console.log('Server berhasil dibuat:', serverResponse.data.attributes.identifier);
        return serverResponse.data.attributes.identifier;
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
