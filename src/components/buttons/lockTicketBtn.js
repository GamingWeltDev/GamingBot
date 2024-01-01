const { PermissionFlagsBits } = require("discord.js");
const ExtendedClient = require("../../class/ExtendedClient");
const ticketSetupSchema = require("../../schemas/ticketSetupSchema");
const ticketSchema = require("../../schemas/ticketSchema");

module.exports = {
  customId: "lockTicketBtn",
  /**
   *
   * @param {ExtendedClient} client
   * @param {*} interaction
   */
  run: async (client, interaction) => {
    try {
      if (!interaction.member.permissions.has([PermissionFlagsBits.ManageThreads])) {
        return await interaction.editReply({ content: "Sie haben nicht die Erlaubnis, diese Komponente zu verwenden.", ephemeral: true });
      }
      
      const { channel } = interaction;
      await interaction.deferReply({ ephemeral: true });

      await channel.setLocked(true);

      return await interaction.editReply({
        content: 'Dieses Ticket wurde gesperrt.'
      })
    } catch (err) {
      console.log(err);
    }
  },
};
