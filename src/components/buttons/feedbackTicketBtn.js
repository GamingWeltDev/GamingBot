const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");

module.exports = {
  customId: "feedbackTicketBtn",
  /**
   *
   * @param {ExtendedClient} client
   * @param {*} interaction
   */
  run: async (client, interaction) => {
    try {
      const feedbackTicketModal = new ModalBuilder()
        .setTitle('Feedback für das Ticket')
        .setCustomId('feedbackTicketMdl')
        .setComponents(
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel('Bewertung')
              .setCustomId('ratingTicketMsg')
              .setPlaceholder('Gebe eine Bewertung von 1 bis 5 ein')
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel('Feedback Nachricht')
              .setCustomId('feedbackTicketMsg')
              .setPlaceholder('Gebe Feedback für dieses Ticket')
              .setStyle(TextInputStyle.Paragraph)
          )
        );

      return interaction.showModal(feedbackTicketModal);
    } catch (err) {
      console.log(err);
    }
  },
};
