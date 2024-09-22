const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display the current music queue'),
    async execute(interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player || !player.queue.current) return interaction.reply('No music is currently playing.');

        const queue = player.queue;
        const embed = {
            title: 'Music Queue',
            description: `**Now Playing:** ${queue.current.title}\n\n**Queue:**`,
            fields: []
        };

        const tracks = queue.slice(0, 10); // Display up to 10 tracks
        if (tracks.length) {
            embed.fields.push({
                name: 'Upcoming Tracks',
                value: tracks.map((track, i) => `${i + 1}. ${track.title}`).join('\n')
            });
        } else {
            embed.fields.push({
                name: 'Upcoming Tracks',
                value: 'No more tracks in the queue.'
            });
        }

        if (queue.length > 10) {
            embed.fields.push({
                name: 'And more...',
                value: `${queue.length - 10} more tracks in the queue.`
            });
        }

        return interaction.reply({ embeds: [embed] });
    },
};