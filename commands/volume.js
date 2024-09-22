const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjust the volume')
        .addIntegerOption(option => 
            option.setName('level')
                .setDescription('Volume level (0-100)')
                .setRequired(true)),
    async execute(interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply('No music is currently playing.');

        const volume = interaction.options.getInteger('level');
        if (volume < 0 || volume > 100) return interaction.reply('Volume must be between 0 and 100.');

        player.setVolume(volume);
        return interaction.reply(`Volume set to ${volume}`);
    },
};