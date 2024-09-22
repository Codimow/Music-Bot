const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Seek to a specific position in the current song')
        .addIntegerOption(option => 
            option.setName('position')
                .setDescription('Position in seconds')
                .setRequired(true)),
    async execute(interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply('No music is currently playing.');

        const position = interaction.options.getInteger('position') * 1000; // Convert to milliseconds
        player.seek(position);
        return interaction.reply(`Seeked to ${position / 1000} seconds.`);
    },
};