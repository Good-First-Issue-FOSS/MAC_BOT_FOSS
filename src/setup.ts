// this is to get the discord.js required classes
import {
	Client,
	Collection,
	REST,
	Events,
	Routes,
	GatewayIntentBits,
} from 'discord.js';
// this is to get the bot keys
import { loadEnv } from './utils/loadEnv';
const keys = loadEnv();
// this is to get the node.js classes
import fs from 'node:fs';
import path from 'node:path';
import { ExtendedClient } from './interfaces/ExtendedClient';

// Create a new client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds],
}) as ExtendedClient;

// initializing for cmd
const commands: unknown[] = [];
client.commands = new Collection();

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// searching and reading in cmd

const commandPath = path.join(__dirname, 'cmd');
const commandFiles = fs
	.readdirSync(commandPath)
  .filter((file: string) => file.endsWith('.js'));

async function loadCommands() {
  for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);

    const command = await import(filePath);

    const defaultCommand = command.default;
    if (
      defaultCommand != null &&
      'data' in defaultCommand &&
      'execute' in defaultCommand
    ) {
      console.log('done cmd ' + file);
      commands.push(defaultCommand.data.toJSON());
      client.commands.set(defaultCommand.data.name, defaultCommand);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

// combining interaction with input cmd
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}
});
// to interact with cmd
client.on(Events.InteractionCreate, (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
});

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(keys.TOKEN);

// and deploy your commands!
(async () => {
  try {
    await loadCommands();
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`,
		);
		// The put method is used to fully refresh all commands in the guild with the current set
		await rest.put(
			Routes.applicationGuildCommands(keys.APPLICATION_ID, keys.GUILD_ID),
			{ body: commands },
		);
		console.log(
			`Successfully reloaded ${commands.length} application (/) commands.`,
		);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

// Log in to Discord with your client's token
client.login(keys.TOKEN);
