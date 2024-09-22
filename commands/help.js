const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows a list of all available commands'),
    async execute(interaction, client) {
        const commands = Array.from(client.commands.values());
        const embed = {
            color: 0x0099ff,
            title: 'Bot Commands',
            description: 'Here\'s a list of all available commands:',
            fields: commands.map(command => ({
                name: `/${command.data.name}`,
                value: command.data.description
            })),
            footer: {
                text: 'Use /help <command> for more information on a specific command.'
            }
        };
        await interaction.reply({ embeds: [embed] });
    },
};