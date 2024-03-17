const axios = require('axios');
const config = require('../config.js');

const apiKey = config.pterodactylApiKey;
const baseUrl = config.baseUrl;

module.exports = {
    name: 'egglist',
    description: 'Menampilkan daftar eggs yang tersedia',
    async execute(message, args) {
        try {
            const response = await axios.get(`${baseUrl}/eggs`, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'Application/vnd.pterodactyl.v1+json',
                }
            });

            const eggs = response.data.data.map(egg => egg.attributes.name);
            message.channel.send(`Eggs yang tersedia: ${eggs.join(', ')}`);
        } catch (error) {
            console.error('Gagal mengambil daftar eggs:', error.response.data.errors);
            message.channel.send('Terjadi kesalahan saat mengambil daftar eggs.');
        }
    },
};
