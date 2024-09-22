const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song')
        .addStringOption(option => 
            option.setName('song')
                .setDescription('The song name or URL to play')
                .setRequired(true)),
    async execute(interaction, client) {
        const song = interaction.options.getString('song');
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.reply('You need to be in a voice channel to use this command!');

        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: voiceChannel.id,
            textChannel: interaction.channel.id,
        });

        player.connect();

        const res = await player.search(song, interaction.user);
        if (res.loadType === "LOAD_FAILED") {
            if (!player.queue.current) player.destroy();
            return interaction.reply(`There was an error while searching: ${res.exception.message}`);
        }

        switch (res.loadType) {
            case "NO_MATCHES":
                if (!player.queue.current) player.destroy();
                return interaction.reply("There were no results found.");
            case "TRACK_LOADED":
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused && !player.queue.size) player.play();
                return interaction.reply(`Enqueuing \`${res.tracks[0].title}\`.`);
            case "PLAYLIST_LOADED":
                player.queue.add(res.tracks);
                if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
                return interaction.reply(`Enqueuing playlist \`${res.playlist.name}\` with ${res.tracks.length} tracks.`);
            case "SEARCH_RESULT":
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused && !player.queue.size) player.play();
                return interaction.reply(`Enqueuing \`${res.tracks[0].title}\`.`);
        }
    },
};