// resume.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the current song'),
    async execute(interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply('No music is currently playing.');

        player.pause(false);
        return interaction.reply('Resumed the current song.');
    },
};