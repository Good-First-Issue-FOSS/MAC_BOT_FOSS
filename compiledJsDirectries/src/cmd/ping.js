"use strict";
//this is a test dierectry for testing all new slsh command before implementing in the actual folder
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MongoData_1 = require("../data/MongoData");
const discord_js_1 = require("discord.js");
const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mac')
        .setDescription('Replies with Maccer!'),
    execute(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const target = interaction.options.getUser('target');
            const reason = (_a = interaction.options.getString('reason')) !== null && _a !== void 0 ? _a : 'No reason provided';
            const confirm = new discord_js_1.ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Confirm Ban')
                .setStyle(discord_js_1.ButtonStyle.Danger);
            const cancel = new discord_js_1.ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle(discord_js_1.ButtonStyle.Secondary);
            const row = new discord_js_1.ActionRowBuilder()
                .addComponents(cancel, confirm);
            const response = yield interaction.reply({
                content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
                components: [row],
            });
            const collectorFilter = (i) => i.user.id === interaction.user.id;
            try {
                const confirmation = yield response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
                if (confirmation.customId === 'confirm') {
                    //await interaction.guild.members.ban(target);
                    yield confirmation.update({ content: `${target.username} has been banned for reason: ${reason}`, components: [] });
                }
                else if (confirmation.customId === 'cancel') {
                    yield (0, MongoData_1.listProject)();
                    yield (0, MongoData_1.listUsers)();
                    yield confirmation.update({ content: 'Action cancelled', components: [] });
                }
            }
            catch (e) {
                console.log(e);
                yield interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            }
        });
    },
};
