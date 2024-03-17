// Import library
const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.js');

// Konfigurasi bot Discord
const client = new Discord.Client();
const prefix = 'c!l'; // Prefix untuk perintah bot
client.commands = new Discord.Collection();

// Token bot Discord
const token = config.discordToken;

// Membaca file command
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Event saat bot siap beroperasi
client.once('ready', () => {
    console.log('Bot Discord telah siap!');
});

// Event saat bot menerima pesan
client.on('message', message => {
    // Memeriksa apakah pesan dimulai dengan prefix dan dari pengguna yang valid
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Parsing argumen dari pesan
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Memeriksa apakah command tersebut ada
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Terjadi kesalahan saat menjalankan perintah tersebut!');
    }
});

// Login bot menggunakan token
client.login(token);
