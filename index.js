require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Manager } = require('erela.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const nodes = [
  {
    host: process.env.LAVALINK_HOST,
    port: parseInt(process.env.LAVALINK_PORT),
    password: process.env.LAVALINK_PASSWORD,
  },
];

client.manager = new Manager({
  nodes,
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

client.manager.on("nodeConnect", node => console.log(`Node "${node.options.identifier}" connected.`));
client.manager.on("nodeError", (node, error) => console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}`));

// New function to update bot activity
const updateBotActivity = (client, player) => {
  if (player && player.playing && player.queue.current) {
    client.user.setActivity(`🎵 ${player.queue.current.title}`, { type: 'LISTENING' });
  } else {
    client.user.setActivity('Idle', { type: 'WATCHING' });
  }
};

client.manager.on("trackStart", (player, track) => {
  updateBotActivity(client, player);
});

client.manager.on("queueEnd", player => {
  updateBotActivity(client, null); // No song playing
});

client.manager.on("trackEnd", player => {
  if (!player.queue || player.queue.length === 0) {
    updateBotActivity(client, null); // No more songs in queue
  }
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: client.commands.map(command => command.data.toJSON()) },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.manager.init(client.user.id);

  // Set initial activity to Idle when the bot starts
  updateBotActivity(client, null);
});

client.on('raw', d => client.manager.updateVoiceState(d));

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
