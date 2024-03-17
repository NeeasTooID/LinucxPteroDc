const axios = require('axios');
const config = require('../config.js');

const apiKey = config.pterodactylApiKey;
const baseUrl = config.baseUrl;
const nodeId = config.nodeId;
const maxAllocations = config.maxAllocations;
const ram = config.ram;
const swap = config.swap;
const disk = config.disk;
const cpu = config.cpu;

async function createServer(eggName, serverName) {
    try {
        const response = await axios.get(`${baseUrl}/nodes/${nodeId}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        });

        const allocations = response.data.attributes.relationships.allocations.data.length;

        if (allocations >= maxAllocations) {
            console.error('Semua alokasi di node sudah terisi penuh.');
            return 'Maaf, semua alokasi di node sudah terisi penuh. Tidak dapat membuat server baru.';
        }

        // Memeriksa apakah egg yang diminta tersedia
        const eggsResponse = await axios.get(`${baseUrl}/eggs`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'Application/vnd.pterodactyl.v1+json',
            }
        });
        const eggs = eggsResponse.data.data.map(egg => egg.attributes.name);
        if (!eggs.includes(eggName)) {
            return `Egg \`${eggName}\` tidak tersedia. Silakan gunakan perintah \`c!l egglist\` untuk melihat daftar eggs yang tersedia.`;
        }

        const serverResponse = await axios.post(`${baseUrl}/servers`, {
            egg: eggName,
            name: serverName,
            limits: {
                memory: ram,
                swap: swap,
                disk: disk,
                io: 500,
                cpu: cpu,
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
