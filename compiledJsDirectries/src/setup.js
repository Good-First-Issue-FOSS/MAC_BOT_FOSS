"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//this is to get the discord.js required classes
const { Client, Collection, REST, Events, Routes, GatewayIntentBits } = require('discord.js');
//this is to get the bot keys
const { keys } = require('../auth/keys');
//this is to get the node.js classes
const fs = require('node:fs');
const path = require('node:path');
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
//initinalizing for cmd
const commands = [];
client.commands = new Collection();
// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});
//searching and reading in cmd
const commandPath = path.join(__dirname, 'cmd');
const commandFiles = fs.readdirSync(commandPath).filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        console.log("done cmd " + file);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    }
    else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}
//combining intraction with input cmd
client.on(Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isChatInputCommand())
        return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        yield command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            yield interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
        else {
            yield interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}));
//to interact with cmd
client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    console.log(interaction);
});
// Construct and prepare an instance of the REST module
const rest = new REST().setToken(keys.TOKEN);
// and deploy your commands!
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = yield rest.put(Routes.applicationGuildCommands(keys.APPLICATION_ID, keys.GUILD_ID), { body: commands });
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
    catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
}))();
// Log in to Discord with your client's token
client.login(keys.TOKEN);
