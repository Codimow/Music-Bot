const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and clear the queue'),
    async execute(interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply('There is no music playing.');

        player.destroy();
        return interaction.reply('Stopped the music and cleared the queue.');
    },
};