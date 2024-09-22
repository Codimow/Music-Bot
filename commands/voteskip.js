const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voteskip')
        .setDescription('Vote to skip the current song'),
    async execute(interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player) return interaction.reply('No music is currently playing.');

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.reply('You need to be in a voice channel to vote skip.');

        if (!player.voteskips) player.voteskips = new Set();

        if (player.voteskips.has(interaction.user.id)) {
            return interaction.reply('You have already voted to skip this song.');
        }

        player.voteskips.add(interaction.user.id);

        const requiredVotes = Math.ceil(voiceChannel.members.size / 2);

        if (player.voteskips.size >= requiredVotes) {
            player.stop();
            return interaction.reply('Vote skip successful. Skipping to the next song.');
        } else {
            return interaction.reply(`Vote skip registered. ${player.voteskips.size}/${requiredVotes} votes required to skip.`);
        }
    },
};