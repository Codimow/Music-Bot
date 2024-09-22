// pause.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song'),
    async execute(interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply('No music is currently playing.');

        player.pause(true);
        return interaction.reply('Paused the current song.');
    },
};

