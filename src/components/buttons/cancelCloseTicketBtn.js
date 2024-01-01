const { PermissionFlagsBits } = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
    customId: 'cancelCloseTicketBtn',
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

        return await interaction.reply({
          content: 'Ticket schließung wurde abgebrochen.',
          ephemeral: true
        })
      } catch (err) {
        console.log(err);
      }
    }
};