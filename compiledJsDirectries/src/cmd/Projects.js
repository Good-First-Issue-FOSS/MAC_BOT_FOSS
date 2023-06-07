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
        .setName('projects')
        .setDescription('wanna work on any project?'),
    execute(interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const target = interaction.options.getUser('target');
            const reason = (_a = interaction.options.getString('reason')) !== null && _a !== void 0 ? _a : 'No reason provided';
            const projectsButtons = [];
            const dataButtons = yield (0, MongoData_1.listProjectNames)();
            dataButtons.forEach(ele => {
                projectsButtons.push(new discord_js_1.ButtonBuilder()
                    .setCustomId(ele)
                    .setLabel(ele)
                    .setStyle(discord_js_1.ButtonStyle.Secondary));
            });
            projectsButtons.push(new discord_js_1.ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle(discord_js_1.ButtonStyle.Danger));
            const row = new discord_js_1.ActionRowBuilder()
                .addComponents(...projectsButtons);
            const response = yield interaction.reply({
                content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
                components: [row],
            });
            const collectorFilter = (i) => i.user.id === interaction.user.id;
            try {
                const confirmation = yield response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
                if (confirmation.customId === 'cancel') {
                    //await interaction.guild.members.ban(target);
                    yield confirmation.update({ content: 'Action cancelled', components: [] });
                }
                else {
                    dataButtons.forEach((ele) => __awaiter(this, void 0, void 0, function* () {
                        var _b;
                        if (confirmation.customId === ele) {
                            yield confirmation.update({ content: 'Granting Access', components: [] });
                            // Get the member object from the interaction
                            const member = interaction.member;
                            // Get the role based on the selected project
                            const role = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.find((r) => r.name === ele);
                            if (role) {
                                try {
                                    // Add the role to the member
                                    yield member.roles.add(role);
                                    yield interaction.editReply({ content: 'Thanks for choosing ' + ele, components: [] });
                                }
                                catch (error) {
                                    console.error('Error adding role:', error);
                                    yield interaction.editReply({ content: 'An error occurred while adding the role.', components: [] });
                                }
                            }
                            else {
                                yield interaction.editReply({ content: 'Role not found for ' + ele, components: [] });
                            }
                        }
                    }));
                }
            }
            catch (e) {
                console.log(e);
                yield interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
            }
        });
    },
};
