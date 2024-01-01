const {
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");
const ticketSetupSchema = require("../../schemas/ticketSetupSchema");
const ticketSchema = require("../../schemas/ticketSchema");

module.exports = {
  customId: "closeTicketBtn",
  /**
   *
   * @param {ExtendedClient} client
   * @param {*} interaction
   */
  run: async (client, interaction) => {
    try {
      await interaction.deferReply();

      if (!interaction.member.permissions.has([PermissionFlagsBits.ManageThreads])) {
        return await interaction.editReply({ content: "Sie haben nicht die Erlaubnis, diese Komponente zu verwenden.", ephemeral: true });
      }
      
      const confirmCloseTicketEmbed = new EmbedBuilder()
        .setColor('DarkRed')
        .setTitle('Ticket Schließen')
        .setDescription('Bist du dir sicher, das du dieses Ticket schließen möchtest?')

      const confirmCloseTicketBtns = new ActionRowBuilder().setComponents([
        new ButtonBuilder()
          .setCustomId('confirmCloseTicketBtn')
          .setLabel('Ja')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('cancelCloseTicketBtn')
          .setLabel('Nein')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('feedbackTicketBtn')
          .setLabel('Feedback Geben')
          .setStyle(ButtonStyle.Secondary),
      ]);

      return await interaction.editReply({
        embeds: [confirmCloseTicketEmbed],
        components: [confirmCloseTicketBtns],
      })
    } catch (err) {
      console.log(err);
    }
  },
};
