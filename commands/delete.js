// Command untuk menghapus server

const axios = require('axios');
const config = require('../config.js');

const apiKey = config.pterodactylApiKey;
const baseUrl = config.baseUrl;

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

module.exports = {
    name: 'delete',
    description: 'Menghapus server',
    async execute(message, args) {
        const serverId = args.shift();
        if (!serverId) {
            return message.channel.send('Format perintah salah. Gunakan: `c!l delete (id server)`');
        }
        await deleteServer(serverId);
        message.channel.send(`Server dengan ID \`${serverId}\` berhasil dihapus.`);
    },
};
