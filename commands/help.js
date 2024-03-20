module.exports = {
    name: 'help',
    description: 'Displays available commands.',
    execute(message, args) {
        message.channel.send('List of available commands: ...');
        // Your logic to display help message
    },
};
