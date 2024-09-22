const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show information about the current song'),
    async execute(interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player || !player.queue.current) return interaction.reply('No music is currently playing.');

        const track = player.queue.current;
        const position = player.position;
        const duration = track.duration;
        const progress = Math.floor((position / duration) * 30);

        const embed = {
            title: 'Now Playing',
            description: `${track.title}\n${'▬'.repeat(progress)}🔘${'▬'.repeat(30 - progress)}`,
            fields: [
                { name: 'Duration', value: `${new Date(position).toISOString().substr(11, 8)} / ${new Date(duration).toISOString().substr(11, 8)}`, inline: true },
                { name: 'Author', value: track.author, inline: true },
            ],
        };

        return interaction.reply({ embeds: [embed] });
    },
};