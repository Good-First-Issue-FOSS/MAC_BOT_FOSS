// this is a test dierectry for testing all new slsh command before implementing in the actual folder

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('mac')
    .setDescription('Replies with Maccer!'),
  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser('target');
    const reason =
      interaction.options.getString('reason') ?? 'No reason provided';

    const confirm = new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('Confirm Ban')
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      cancel,
      confirm,
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

      if (confirmation.customId === 'confirm') {
        // await interaction.guild.members.ban(target);
        await confirmation.update({
          content: `${target?.username} has been banned for reason: ${reason}`,
          components: [],
        });
      } else if (confirmation.customId === 'cancel') {
        await confirmation.update({
          content: 'Action cancelled',
          components: [],
        });
      }
    } catch (e) {
      console.log(e);
      await interaction.editReply({
        content: 'Confirmation not received within 1 minute, cancelling',
        components: [],
      });
    }
    // temp message hidden from other users
    // await interaction.reply({content:'maccer!', ephemeral: true });

    // permanant messafe message
    // await interaction.reply('maccer!'});

    // waiting
    // await wait(4000);

    // reply to message
    // await interaction.editReply('maccer!');
    // await interaction.followUp('Pong again!');
    // await interaction.deleteReply();
  },
};
