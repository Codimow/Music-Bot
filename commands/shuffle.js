const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current queue'),
    async execute(interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply('No music is currently playing.');

        player.queue.shuffle();
        return interaction.reply('The queue has been shuffled.');
    },
};