const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Play a playlist')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL of the playlist to play')
                .setRequired(true)),
    async execute(interaction, client) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.reply('You need to be in a voice channel to use this command!');

        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: voiceChannel.id,
            textChannel: interaction.channel.id,
        });

        player.connect();

        const playlistUrl = interaction.options.getString('url');
        const res = await player.search(playlistUrl, interaction.user);

        if (res.loadType === "PLAYLIST_LOADED") {
            player.queue.add(res.tracks);
            if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
            return interaction.reply(`Enqueuing playlist \`${res.playlist.name}\` with ${res.tracks.length} tracks.`);
        } else {
            return interaction.reply('The provided URL does not seem to be a valid playlist.');
        }
    },
};