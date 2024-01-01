const {
  EmbedBuilder
} = require('discord.js');
const ExtendedClient = require('../../class/ExtendedClient');
const ticketSetupSchema = require('../../schemas/ticketSetupSchema');
const ticketSchema = require('../../schemas/ticketSchema');

module.exports = {
    customId: 'feedbackTicketMdl',
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {*} interaction 
     */
    run: async (client, interaction) => {
      try {
        const { fields, guild, member, channel, message } = interaction;

        const feedbackMessage = fields.getTextInputValue('feedbackTicketMsg');
        const rating = fields.getTextInputValue('ratingTicketMsg');

        await interaction.deferReply();

        if (rating < 1 || rating > 5) {
          return await interaction.editReply({
            content: 'Du musst eine Zahl zwischen 1 und 5 angeben.',
          });
        }

        let isNum = /^\d+$/.test(rating);
        if(!isNum) {
          return await interaction.editReply({
            content: 'Bitte gebe eine gültige Bewertung.\nEs muss eine volle nummer sein!'
          });
        }

        const ticketSetup = await ticketSetupSchema.findOne({
          guildID: guild.id,
          ticketChannelID: channel.parentId,
        });

        const ticket = await ticketSchema.findOne({
          ticketChannelID: channel.id,
        })
        
        await ticket.updateOne({
          rating,
          feedback: feedbackMessage
        })

        let stars = ""
        for (let i = 0; i < rating; i++) {
          stars += "⭐"
        }

        const allTickets = await ticketSchema.find({
          guildID: guild.id,
        })
        const allRatings = allTickets.map((t) => (t.rating !== undefined ? t.rating : 0)).reduce((acc, current) => {
          return acc + current;
        }, 0);

        const ar = Math.round(allRatings / allTickets.length);
        
        let avgStars = '';
        for (let i = 0; i < ar; i++) {
          avgStars += "⭐"
        }

        const feedbackEmbed = new EmbedBuilder()
          .setColor('Blurple')
          .setTitle('Ticket feedback')
          .setDescription(`**Bewertung:** ${stars}\n**Feedback:** ${feedbackMessage}\n\n**Durchschnittsbewertung:** ${avgStars}`)
          .setFooter({
            text: `${guild.name}`,
            iconURL: guild.iconURL()
          })
          .setTimestamp();

        await guild.channels.cache.get(ticketSetup.feedbackChannelID).send({
          embeds: [feedbackEmbed]
        });

        message.components[0].components[2].data.disabled = true;

        await message.edit({
          components: [message.components[0]]
        })

        return await interaction.editReply({
          content: 'Dein Feedback wurde abgesendet!'
        });
      } catch (err) {
        console.log(err);
      }
    }
};