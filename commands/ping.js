module.exports = {
    name: 'ping',
    description: 'Mengecek respons bot',
    execute(message, args) {
        message.channel.send('Pong!');
    },
};
