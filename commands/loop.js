const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggle loop mode')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('The loop mode to set')
                .setRequired(true)
                .addChoices(
                    { name: 'Off', value: 'off' },
                    { name: 'Track', value: 'track' },
                    { name: 'Queue', value: 'queue' }
                )),
    async execute(interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply('No music is currently playing.');

        const loopMode = interaction.options.getString('mode');

        switch (loopMode) {
            case 'off':
                player.setTrackRepeat(false);
                player.setQueueRepeat(false);
                return interaction.reply('Loop mode turned off.');
            case 'track':
                player.setTrackRepeat(true);
                player.setQueueRepeat(false);
                return interaction.reply('Now looping the current track.');
            case 'queue':
                player.setTrackRepeat(false);
                player.setQueueRepeat(true);
                return interaction.reply('Now looping the entire queue.');
        }
    },
};