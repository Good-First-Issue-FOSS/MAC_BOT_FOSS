//this is to get the discord.js required classes
const { Client, Collection, REST, Events, Routes, GatewayIntentBits } = require('discord.js');
//this is to get the bot keys
const { loadEnv } = require('./utils/loadEnv');
const keys = loadEnv();
//this is to get the node.js classes
const fs = require('node:fs');
const path = require('node:path');


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//initinalizing for cmd
const commands = [];
client.commands = new Collection();

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (c: { user: { tag: any; }; }) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

//searching and reading in cmd
const commandPath = path.join(__dirname,'cmd')
const commandFiles = fs.readdirSync(commandPath).filter((file: string) => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
        console.log("done cmd "+ file);
		commands.push(command.data.toJSON());
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
//combining intraction with input cmd
client.on(Events.InteractionCreate, async (interaction: { isChatInputCommand: () => any; client: { commands: { get: (arg0: any) => any; }; }; commandName: any; replied: any; deferred: any; followUp: (arg0: { content: string; ephemeral: boolean; }) => any; reply: (arg0: { content: string; ephemeral: boolean; }) => any; }) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
//to interact with cmd
client.on(Events.InteractionCreate, (interaction: { isChatInputCommand: () => any; }) => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
});

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(keys.TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(keys.APPLICATION_ID, keys.GUILD_ID),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

// Log in to Discord with your client's token
client.login(keys.TOKEN);