// this is a test dierectry for testing all new slsh command before implementing in the actual folder

import { listProjectNames } from '../data/MongoData';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	GuildMember,
	SlashCommandBuilder,
} from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('projects')
		.setDescription('wanna work on any project?'),
	async execute(interaction: ChatInputCommandInteraction) {
		const target = interaction.options.getUser('target');
		const reason =
			interaction.options.getString('reason') ?? 'No reason provided';

		const projectsButtons: ButtonBuilder[] = [];
		const dataButtons: string[] = await listProjectNames();

		dataButtons.forEach((ele) => {
			projectsButtons.push(
				new ButtonBuilder()
					.setCustomId(ele)
					.setLabel(ele)
					.setStyle(ButtonStyle.Secondary),
			);
		});

		projectsButtons.push(
			new ButtonBuilder()
				.setCustomId('cancel')
				.setLabel('Cancel')
				.setStyle(ButtonStyle.Danger),
		);

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			...projectsButtons,
		);

		const response = await interaction.reply({
			content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
			components: [row],
		});

		try {
			const confirmation = await response.awaitMessageComponent({
				filter: (i) => i.user.id === interaction.user.id,
				time: 60_000,
			});

			if (confirmation.customId === 'cancel') {
				// await interaction.guild.members.ban(target);
				await confirmation.update({
					content: 'Action cancelled',
					components: [],
				});
			} else {
				dataButtons.forEach(async (ele) => {
					if (confirmation.customId === ele) {
						await confirmation.update({
							content: 'Granting Access',
							components: [],
						});
						const member = interaction.member as GuildMember;

						const role = interaction.guild?.roles.cache.find(
							(r) => r.name === ele,
						);

						if (role) {
							try {
								await member.roles.add(role);
								await interaction.editReply({
									content: 'Thanks for choosing ' + ele,
									components: [],
								});
							} catch (error) {
								console.error('Error adding role:', error);
								await interaction.editReply({
									content: 'An error occurred while adding the role.',
									components: [],
								});
							}
						} else {
							await interaction.editReply({
								content: 'Role not found for ' + ele,
								components: [],
							});
						}
					}
				});
			}
		} catch (e) {
			console.log(e);
			await interaction.editReply({
				content: 'Confirmation not received within 1 minute, cancelling',
				components: [],
			});
		}
	},
};
