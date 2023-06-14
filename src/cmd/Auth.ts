// add program to complete Auth command
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { listUsers } from '../data/MongoData';

export default {
  data: new SlashCommandBuilder()
    .setName('auth')
    .setDescription('Authenticates you with github!'),
  async execute(interaction: ChatInputCommandInteraction) {
    const auth = new ButtonBuilder()
      .setCustomId('auth')
      .setLabel('Authenticate me')
      .setStyle(ButtonStyle.Secondary);

    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      auth,
      cancel,
    );

    const response = await interaction.reply({
      content: 'Be sure only one Github account is public on your discord ID?',
      components: [row],
    });

    try {
      const confirmation = await response.awaitMessageComponent({
        filter: (i) => i.user.id === interaction.user.id,
        time: 60_000,
      });
      if (confirmation.customId === 'auth') {
        // await interaction.guild.members.ban(target);
        const userList = await listUsers();
        const userObj = userList.find(
          (userVar) => userVar.id === confirmation.user.id,
        );
        if (userObj && userObj.id !== confirmation.user.id) {
          await confirmation.update({
            content:
              '[Click here](https://discord.com/oauth2/authorize?client_id=1114904309918867496&redirect_uri=http%3A%2F%2Flocalhost%3A53134&response_type=code&scope=identify%20email%20connections)',
            components: [],
          });
        } else {
          await confirmation.update({
            content: 'You are already authenticated try /roles to get roles',
            components: [],
          });
        }
      } else if (confirmation.customId === 'cancel') {
        await confirmation.update({
          content: 'Action cancelled ...',
          components: [],
        });
      }
    } catch (e) {
      console.log(e);
      await interaction.editReply({
        content:
          'Confirmation not received within 1 minute, cancelling authentication process ...',
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
